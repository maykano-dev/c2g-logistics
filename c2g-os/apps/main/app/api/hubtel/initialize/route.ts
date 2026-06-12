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

    if (!settings?.hubtel_api_id || !settings?.hubtel_api_key || !settings?.hubtel_merchant_account) {
      return NextResponse.json({ error: 'Payment gateway not configured' }, { status: 500 });
    }

    const authString = btoa(`${settings.hubtel_api_id}:${settings.hubtel_api_key}`);
    const storeName = settings.store_name || 'C2G Logistics';
    
    const timestamp = Date.now();
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'https://c2g-logistics.com';
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
      const regFee = settings.rates?.package_registration_fee || 5;
      
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
      description = `Order #${order.id.substring(0, 8)} - ${storeName}`;
      clientReference = `C2G-ORDER-${orderId.substring(0, 8)}-${timestamp}`;
      
      returnUrl = `${origin}/dashboard/link-orders/${orderId}?track=true`;
      cancelUrl = `${origin}/dashboard/link-orders/${orderId}`;
      
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
      merchantAccountNumber: settings.hubtel_merchant_account,
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
      return NextResponse.json({ error: 'Payment initialization failed' }, { status: 500 });
    }

    const hubtelData = JSON.parse(responseText);

    if (hubtelData.responseCode !== "0000" && hubtelData.status !== "Success") {
      return NextResponse.json({ error: hubtelData.message || 'Payment initialization failed' }, { status: 500 });
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
