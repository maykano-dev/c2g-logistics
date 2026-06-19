import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { 
    fetchHubtelTransactionStatusLocal, 
    mergeNotesWithHubtelCheckout 
} from '../../../../utils/hubtel'

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const clientReference = searchParams.get('clientReference')
    const checkoutId = searchParams.get('checkoutId')

    if (!clientReference && !checkoutId) {
        return NextResponse.json({ error: 'Missing clientReference or checkoutId' }, { status: 400 })
    }

    try {
        console.log(`[Verify API] Checking status for ref: ${clientReference}, checkout: ${checkoutId}`)
        
        // 1. Fetch status directly from Hubtel
        const statusData = await fetchHubtelTransactionStatusLocal({
            clientReference: clientReference || undefined,
            hubtelTransactionId: checkoutId || undefined
        })

        const isSuccess = statusData.status === 'success' || statusData.status === 'paid'

        if (isSuccess) {
            // Bypass RLS using service role key to securely update the database
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
            const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
            const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

            const paymentStatus = 'paid'
            const ref = clientReference || statusData.clientReference

            if (ref) {
                // 1. LINK ORDERS
                const { data: linkOrder } = await supabase
                    .from('orders')
                    .select('id, payment_status, notes')
                    .eq('payment_reference', ref)
                    .maybeSingle()

                if (linkOrder && linkOrder.payment_status !== 'paid') {
                    const notesMerged = mergeNotesWithHubtelCheckout(linkOrder.notes as string | undefined, checkoutId as string | undefined)
                    await supabase
                        .from('orders')
                        .update({
                            payment_status: paymentStatus,
                            order_status: 'processing',
                            ...(notesMerged !== linkOrder.notes && notesMerged != null ? { notes: notesMerged } : {})
                        })
                        .eq('id', linkOrder.id)
                    console.log(`[Verify API] Link order ${linkOrder.id} verified as paid`)
                }

                // 2. ECOM ORDERS
                const { data: ecomOrder } = await supabase
                    .from('ecom_orders')
                    .select('id, payment_status')
                    .eq('payment_reference', ref)
                    .maybeSingle()

                if (ecomOrder && ecomOrder.payment_status !== 'paid') {
                    await supabase
                        .from('ecom_orders')
                        .update({
                            payment_status: paymentStatus,
                            order_status: 'processing',
                            payment_gateway: 'hubtel',
                            updated_at: new Date().toISOString()
                        })
                        .eq('id', ecomOrder.id)
                    console.log(`[Verify API] Ecom order ${ecomOrder.id} verified as paid`)
                }

                // 3. SHIPMENT SHIPPING FEES
                if (ref.startsWith('SHIPMENT-')) {
                    const { data: shipment } = await supabase
                        .from('shipments')
                        .select('id, shipping_fee_paid')
                        .eq('shipping_fee_payment_reference', ref)
                        .maybeSingle()

                    if (shipment && !shipment.shipping_fee_paid) {
                        await supabase
                            .from('shipments')
                            .update({ shipping_fee_paid: true })
                            .eq('id', shipment.id)
                        console.log(`[Verify API] Shipment ${shipment.id} shipping fee verified as paid`)
                    }
                }

                // 4. ECOM SHIPPING FEES
                if (ref.startsWith('SHIPPING_') || ref.startsWith('C2G-SHIPPING-') || ref.startsWith('SHIP-')) {
                    const { data: shipFeeOrder } = await supabase
                        .from('ecom_orders')
                        .select('id, shipping_fee_paid')
                        .eq('shipping_fee_payment_reference', ref)
                        .maybeSingle()

                    if (shipFeeOrder && !shipFeeOrder.shipping_fee_paid) {
                        await supabase
                            .from('ecom_orders')
                            .update({
                                shipping_fee_paid: true,
                                updated_at: new Date().toISOString()
                            })
                            .eq('id', shipFeeOrder.id)
                        console.log(`[Verify API] Ecom order ${shipFeeOrder.id} shipping fee verified as paid`)
                    }
                }

                // 5. PACKAGE REGISTRATION FEES
                if (ref.startsWith('REG-')) {
                    const { data: regShipment } = await supabase
                        .from('shipments')
                        .select('id, registration_fee_paid')
                        .eq('registration_fee_payment_reference', ref)
                        .maybeSingle()

                    if (regShipment && !regShipment.registration_fee_paid) {
                        await supabase
                            .from('shipments')
                            .update({
                                registration_fee_paid: true,
                                status: 'awaiting_arrival'
                            })
                            .eq('id', regShipment.id)
                        console.log(`[Verify API] Shipment ${regShipment.id} registration fee verified as paid`)
                    }
                }
            }
        }

        return NextResponse.json({
            status: statusData.status,
            amount: statusData.amount,
            isFulfilled: statusData.isFulfilled
        })

    } catch (error: any) {
        console.error('[Verify API] Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
