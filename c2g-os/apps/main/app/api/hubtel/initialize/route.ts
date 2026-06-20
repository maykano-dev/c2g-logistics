import { NextResponse } from 'next/server';
import { createClient } from '../../../../utils/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { orderId, packageId, type } = body;

    if (!orderId && !packageId) {
      return NextResponse.json({ error: 'orderId or packageId is required' }, { status: 400 });
    }

    // Get Hubtel settings from database
    const { data: settings } = await supabase
      .from('settings')
      .select('hubtel_api_id, hubtel_api_key, hubtel_merchant_account, hubtel_test_mode, store_name, rates')
      .eq('id', 1)
      .single();

    const hubtelApiId = (process.env.HUBTEL_API_ID || process.env.HUBTEL_CLIENT_ID || settings?.hubtel_api_id)?.trim();
    const hubtelApiKey = (process.env.HUBTEL_API_KEY || process.env.HUBTEL_CLIENT_SECRET || settings?.hubtel_api_key)?.trim();
    const hubtelMerchantAccount = (process.env.HUBTEL_MERCHANT_ACCOUNT || settings?.hubtel_merchant_account)?.trim();

    if (!hubtelApiId || !hubtelApiKey || !hubtelMerchantAccount) {
      return NextResponse.json({ error: 'Payment gateway credentials not configured' }, { status: 500 });
    }

    const authString = Buffer.from(`${hubtelApiId}:${hubtelApiKey}`).toString('base64');
    const storeName = settings?.store_name || 'C2G Logistics';
    
    const timestamp = Date.now();
    let origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'https://c2g-logistics.com';
    if (origin.includes('localhost')) {
      origin = process.env.NEXT_PUBLIC_SITE_URL || 'https://c2g-logistics.com';
    }
    const hubtelCallbackUrl = `${origin}/api/hubtel/callback`;

    let totalAmount = 0;
    let description = '';
    let returnUrl = '';
    let cancelUrl = '';
    let clientReference = '';
    let dbTable = '';
    let dbId = '';

    if (type === 'package_registration' && packageId) {
      // Handle Package Registration Fee
      const { data: pkg, error: pkgError } = await supabase
        .from('shipments')
        .select('*')
        .eq('id', packageId)
        .eq('customer_id', user.id)
        .single();

      if (pkgError || !pkg) {
        return NextResponse.json({ error: 'Package not found' }, { status: 404 });
      }

      if (pkg.registration_fee_paid) {
        return NextResponse.json({ error: 'Registration fee is already paid' }, { status: 400 });
      }

      // Fetch dynamic fee from settings.rates or fallback to 5
      const regFee = settings?.rates?.package_registration_fee || 5;
      
      totalAmount = parseFloat(regFee);
      description = `Package Reg Fee - ${pkg.tracking_number} - ${storeName}`;
      
      const shortRandom = Math.random().toString(36).substring(2, 10).toUpperCase();
      clientReference = `REG-${shortRandom}`;
      
      returnUrl = `${origin}/dashboard/packages`;
      cancelUrl = `${origin}/dashboard/packages`;
      
      dbTable = 'shipments';
      dbId = pkg.id;

      await supabase
        .from('shipments')
        .update({ registration_fee_payment_reference: clientReference })
        .eq('id', pkg.id);

    } else if (type === 'mall_order' && orderId) {
      // Handle Mall Orders
      const { data: ecomOrder, error: ecomOrderError } = await supabase
        .from('ecom_orders')
        .select('*')
        .eq('id', orderId)
        .eq('customer_id', user.id)
        .single();

      if (ecomOrderError || !ecomOrder) {
        return NextResponse.json({ error: 'Mall order not found' }, { status: 404 });
      }

      if (ecomOrder.payment_status === 'paid' || ecomOrder.payment_status === 'Paid') {
        return NextResponse.json({ error: 'Order is already paid' }, { status: 400 });
      }

      totalAmount = parseFloat(ecomOrder.total_amount);
      description = `Mall Order #${ecomOrder.order_id} - ${storeName}`;
      clientReference = `MALL-${ecomOrder.order_id}-${timestamp}`;
      
      returnUrl = `${origin}/dashboard/mall-orders?success=true&orderId=${ecomOrder.order_id}`;
      cancelUrl = `${origin}/dashboard/mall-orders`;
      
      dbTable = 'ecom_orders';
      dbId = ecomOrder.id;

      await supabase
        .from('ecom_orders')
        .update({ payment_reference: clientReference })
        .eq('id', ecomOrder.id);
    } else if (type === 'package_shipping_fee' && packageId) {
      // Handle Package Shipping Fee
      const { data: pkg, error: pkgError } = await supabase
        .from('shipments')
        .select('*')
        .eq('id', packageId)
        .eq('customer_id', user.id)
        .single();

      if (pkgError || !pkg) {
        return NextResponse.json({ error: 'Package not found' }, { status: 404 });
      }

      if (pkg.shipping_fee_paid) {
        return NextResponse.json({ error: 'Shipping fee is already paid' }, { status: 400 });
      }
      
      if (!pkg.shipping_fee || parseFloat(pkg.shipping_fee) <= 0) {
        return NextResponse.json({ error: 'Invalid shipping fee amount' }, { status: 400 });
      }

      totalAmount = parseFloat(pkg.shipping_fee);
      description = `Shipping Fee - ${pkg.tracking_number} - ${storeName}`;
      
      const shortRandom = Math.random().toString(36).substring(2, 10).toUpperCase();
      clientReference = `SHIPMENT-${shortRandom}`;
      
      returnUrl = `${origin}/dashboard/packages`;
      cancelUrl = `${origin}/dashboard/packages`;
      
      dbTable = 'shipments';
      dbId = pkg.id;

      await supabase
        .from('shipments')
        .update({ shipping_fee_payment_reference: clientReference })
        .eq('id', pkg.id);
    } else if (type === 'ecom_shipping_fee' && orderId) {
      // Handle Mall Order Shipping Fee
      const { data: ecomOrder, error: ecomOrderError } = await supabase
        .from('ecom_orders')
        .select('*')
        .eq('id', orderId)
        .eq('customer_id', user.id)
        .single();

      if (ecomOrderError || !ecomOrder) {
        return NextResponse.json({ error: 'Mall order not found' }, { status: 404 });
      }

      if (ecomOrder.shipping_fee_paid) {
        return NextResponse.json({ error: 'Shipping fee is already paid' }, { status: 400 });
      }
      
      if (!ecomOrder.shipping_fee || parseFloat(ecomOrder.shipping_fee) <= 0) {
        return NextResponse.json({ error: 'Invalid shipping fee amount' }, { status: 400 });
      }

      totalAmount = parseFloat(ecomOrder.shipping_fee);
      description = `Shipping Fee - Order #${ecomOrder.order_id} - ${storeName}`;
      
      const shortRandom = Math.random().toString(36).substring(2, 10).toUpperCase();
      clientReference = `SHIPPING_${shortRandom}`;
      
      returnUrl = `${origin}/dashboard/mall-orders?success=true&orderId=${ecomOrder.order_id}`;
      cancelUrl = `${origin}/dashboard/mall-orders`;
      
      dbTable = 'ecom_orders';
      dbId = ecomOrder.id;

      await supabase
        .from('ecom_orders')
        .update({ shipping_fee_payment_reference: clientReference })
        .eq('id', ecomOrder.id);
    } else if (orderId) {
      // Handle Link Orders
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .eq('customer_id', user.id)
        .single();

      if (orderError || !order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      if (order.payment_status === 'paid' || order.payment_status === 'Paid') {
        return NextResponse.json({ error: 'Order is already paid' }, { status: 400 });
      }

      totalAmount = parseFloat(order.total);
      
      if (!totalAmount || totalAmount <= 0) {
        return NextResponse.json({ error: 'Order total must be greater than 0 to initialize payment' }, { status: 400 });
      }

      description = `Order #${String(order.id).substring(0, 8)} - ${storeName}`;
      clientReference = `C2G-ORDER-${String(orderId).substring(0, 8)}-${timestamp}`;
      
      returnUrl = `${origin}/dashboard/orders/${orderId}?track=true`;
      cancelUrl = `${origin}/dashboard/orders/${orderId}`;
      
      dbTable = 'orders';
      dbId = order.id;

      await supabase
        .from('orders')
        .update({ payment_reference: clientReference })
        .eq('id', order.id);
    } else {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // Official Hubtel Online Checkout API request payload
    const hubtelPayload = {
      totalAmount: totalAmount,
      description: description,
      callbackUrl: hubtelCallbackUrl,
      returnUrl: returnUrl,
      merchantAccountNumber: hubtelMerchantAccount,
      cancellationUrl: cancelUrl,
      clientReference: clientReference,
      payeeEmail: user.email || 'customer@c2g-logistics.com'
    };

    const apiUrl = 'https://payproxyapi.hubtel.com/items/initiate';

    const hubtelResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(hubtelPayload),
    });

    const responseText = await hubtelResponse.text();

    if (!hubtelResponse.ok) {
      console.error('Hubtel API error:', responseText);
      
      let errorMsg = 'Payment initialization failed';
      try {
        const parsed = JSON.parse(responseText);
        if (parsed.message) errorMsg = parsed.message;
      } catch (e) {
        errorMsg = responseText || `HTTP ${hubtelResponse.status} ${hubtelResponse.statusText}`;
      }
      
      return NextResponse.json({ error: `Hubtel Error: ${errorMsg}` }, { status: 500 });
    }

    const hubtelData = JSON.parse(responseText);

    if (hubtelData.responseCode !== "0000" && hubtelData.status !== "Success") {
      return NextResponse.json({ error: hubtelData.message || 'Payment initialization failed' }, { status: 500 });
    }

    // Persist checkoutId for link orders exactly like the old codebase
    if (type === 'mall_order' || !type || type === 'link_order') {
        const checkoutId = hubtelData.data?.checkoutId;
        if (checkoutId && dbTable === 'orders' && dbId) {
            const { data: orderData } = await supabase.from('orders').select('notes').eq('id', dbId).single();
            const existingNotes = orderData?.notes || '';
            const line = `HUBTEL_CHECKOUT:${checkoutId}`;
            if (!existingNotes.includes(line)) {
                const marker = 'JSON_ITEMS:';
                const idx = existingNotes.indexOf(marker);
                let merged = '';
                if (idx === -1) {
                    merged = `${existingNotes.trim()}\n${line}`.trim();
                } else {
                    merged = `${existingNotes.slice(0, idx).trim()}\n${line}\n${marker}${existingNotes.slice(idx + marker.length)}`;
                }
                await supabase.from('orders').update({ notes: merged }).eq('id', dbId);
            }
        }
    }



    return NextResponse.json({
      success: true,
      checkoutUrl: hubtelData.data.checkoutUrl
    });

  } catch (error: any) {
    console.error('Payment initialization error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
