import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendPushNotification } from '../../../../utils/push';

async function notifyUser(supabase: any, userId: string, title: string, message: string, type: string, url: string) {
  // Save to DB
  await supabase.from('notifications').insert({ user_id: userId, title, message, type, link: url, read: false });
  
  // Get push subscriptions
  const { data: subs } = await supabase.from('push_subscriptions').select('*').eq('user_id', userId);
  if (subs && subs.length > 0) {
    const payload = { title, body: message, url };
    for (const sub of subs) {
      const subscription = {
        endpoint: sub.endpoint,
        keys: { p256dh: sub.p256dh, auth: sub.auth }
      };
      await sendPushNotification(subscription, payload);
    }
  }
}

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  try {
    const callbackData = await request.json();
    console.log('Received Hubtel callback:', JSON.stringify(callbackData, null, 2));

    const data = callbackData.Data ?? callbackData.data;

    if (!data || !(data.ClientReference ?? data.clientReference)) {
      console.error('Invalid callback data: missing ClientReference');
      return NextResponse.json({ error: 'Invalid callback data' }, { status: 400 });
    }

    const responseCode = callbackData.ResponseCode ?? callbackData.responseCode ?? data.ResponseCode ?? data.responseCode;
    const status = callbackData.Status ?? callbackData.status ?? data.Status ?? data.status;
    const clientReference = String(data.ClientReference ?? data.clientReference ?? '').trim();
    
    // Normalize response code
    const rc = String(responseCode).trim().padStart(4, '0');
    
    // Determine status
    let isSuccess = false;
    let isFailed = false;

    if (rc === '0000') {
      const st = String(status ?? '').trim().toLowerCase();
      if (st === 'paid' || st === 'success' || st === 'successful' || st === 'completed' || st === 'fulfilled' || st === '') {
        isSuccess = true;
      }
      
      const fulfilled = data.IsFulfilled ?? data.isFulfilled;
      if (fulfilled === true) {
        isSuccess = true;
      }
    } else if (rc === '2001') {
      isFailed = true;
    }

    let paymentStatus = 'pending';
    let orderStatus = 'pending_payment';

    if (isSuccess) {
      paymentStatus = 'paid';
      orderStatus = 'processing';
    } else if (isFailed) {
      paymentStatus = 'failed';
      orderStatus = 'cancelled';
    }

    // Process based on reference type
    if (clientReference.startsWith('C2G-ORDER-')) {
      const { data: linkOrder, error: linkFetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('payment_reference', clientReference)
        .maybeSingle();

      if (!linkFetchError && linkOrder) {
        const linkOrderStatus = paymentStatus === 'paid' 
          ? 'processing' 
          : (paymentStatus === 'failed' ? 'cancelled' : (linkOrder.order_status || 'pending_payment'));

        const { error: linkUpdateError } = await supabase
          .from('orders')
          .update({
            payment_status: paymentStatus,
            order_status: linkOrderStatus
          })
          .eq('id', linkOrder.id);

        if (linkUpdateError) {
          console.error('Error updating link order:', linkUpdateError);
          return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
        }

        // Insert into history if status changed to paid
        if (paymentStatus === 'paid') {
          await supabase
            .from('order_status_history')
            .insert({
              order_id: linkOrder.id,
              status: linkOrderStatus,
              changed_by: 'system',
              notes: 'Payment received via Hubtel webhook'
            });

          await notifyUser(
            supabase,
            linkOrder.customer_id,
            'Payment Successful',
            `Your payment for Link Order #${linkOrder.id.split('-').pop().substring(0,8)} has been received.`,
            'payment',
            `/dashboard/orders/${linkOrder.id}`
          );
        }

        return NextResponse.json({
          message: 'Link order callback processed successfully',
          reference: clientReference,
          status: paymentStatus
        });
      }
    } else if (clientReference.startsWith('REG-')) {
      // Handle Package Registration Fee
      const { data: shipment, error: shipmentFetchError } = await supabase
        .from('shipments')
        .select('*')
        .eq('registration_fee_payment_reference', clientReference)
        .maybeSingle();

      if (!shipmentFetchError && shipment) {
        if (isSuccess && !shipment.registration_fee_paid) {
          const { error: shipmentUpdateError } = await supabase
            .from('shipments')
            .update({
              registration_fee_paid: true,
              status: 'pending' // Move from pending_payment to pending
            })
            .eq('id', shipment.id);

          if (shipmentUpdateError) {
            console.error('Error updating shipment:', shipmentUpdateError);
            return NextResponse.json({ error: 'Failed to update shipment' }, { status: 500 });
          }

          await notifyUser(
            supabase,
            shipment.customer_id,
            'Registration Fee Paid',
            `Your registration fee for Package ${shipment.tracking_number} is complete.`,
            'payment',
            `/dashboard/packages`
          );

          return NextResponse.json({
            message: 'Package registration fee callback processed successfully',
            reference: clientReference,
            status: 'paid'
          });
        } else if (isFailed) {
           return NextResponse.json({
            message: 'Package registration fee payment failed',
            reference: clientReference,
            status: 'failed'
          });
        }
      }
    } else if (clientReference.startsWith('MALL-')) {
      // Handle Mall Orders
      const { data: mallOrder, error: mallFetchError } = await supabase
        .from('ecom_orders')
        .select('*')
        .eq('payment_reference', clientReference)
        .maybeSingle();

      if (!mallFetchError && mallOrder) {
        const orderStatus = paymentStatus === 'paid' 
          ? 'processing' 
          : (paymentStatus === 'failed' ? 'cancelled' : (mallOrder.order_status || 'pending_payment'));

        const { error: mallUpdateError } = await supabase
          .from('ecom_orders')
          .update({
            payment_status: paymentStatus,
            order_status: orderStatus
          })
          .eq('id', mallOrder.id);

        if (mallUpdateError) {
          console.error('Error updating mall order:', mallUpdateError);
          return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
        }

        if (paymentStatus === 'paid') {
          await notifyUser(
            supabase,
            mallOrder.customer_id,
            'Mall Order Paid',
            `Payment for Mall Order #${mallOrder.order_id} was successful.`,
            'payment',
            `/dashboard/mall-orders`
          );
        }

        return NextResponse.json({
          message: 'Mall order callback processed successfully',
          reference: clientReference,
          status: paymentStatus
        });
      }
    }

    // Return 200 OK to Hubtel even if we don't recognize the reference to stop retries
    return NextResponse.json({
      message: 'Callback received, reference not processed by this handler',
      reference: clientReference
    });

  } catch (error: any) {
    console.error('Webhook error:', error);
    // Still return 200 to prevent Hubtel from retrying endlessly
    return NextResponse.json({ error: 'Internal server error', message: error.message }, { status: 200 });
  }
}
