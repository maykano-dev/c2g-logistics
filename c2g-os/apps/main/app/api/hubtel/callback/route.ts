import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { 
    fetchHubtelTransactionStatusLocal, 
    HUBTEL_RATE_LIMIT_ERROR, 
    HUBTEL_NO_MATCH,
    mergeNotesWithHubtelCheckout
} from '../../../../utils/hubtel'

function normalizeHubtelCallbackCode(raw: unknown): string {
    if (raw === undefined || raw === null) return ''
    const s = String(raw).trim()
    if (/^\d+$/.test(s)) return s.padStart(4, '0')
    return s
}

function isHubtelCallbackSuccess(
    responseCode: unknown,
    statusRaw: unknown,
    data?: Record<string, unknown> | null
): boolean {
    const rc = normalizeHubtelCallbackCode(responseCode)
    if (rc !== '0000') return false

    const st = String(statusRaw ?? '').trim().toLowerCase()
    if (st === 'unpaid' || st === 'pending' || st === 'failed' || st === 'failure') return false
    if (st === '' || st === 'success' || st === 'successful') return true
    if (st === 'paid' || st === 'fulfilled' || st === 'completed') return true

    if (data) {
        const fulfilled = data.IsFulfilled ?? data.isFulfilled
        if (fulfilled === true) return true
        const inner = String(data.status ?? data.Status ?? '').trim().toLowerCase()
        if (inner === 'unpaid' || inner === 'pending') return false
        if (inner === 'paid' || inner === 'fulfilled' || inner === 'completed') return true
    }
    return false
}

function isHubtelCallbackFailed(
    responseCode: unknown,
    statusRaw: unknown,
    data?: Record<string, unknown> | null
): boolean {
    const rc = normalizeHubtelCallbackCode(responseCode)
    const st = String(statusRaw ?? '').trim().toLowerCase()
    if (rc === '2001') return true
    if (st === 'failed' || st === 'failure' || st === 'declined') return true
    if (data) {
        const drc = normalizeHubtelCallbackCode(data.ResponseCode ?? data.responseCode)
        if (drc === '2001') return true
        const inner = String(data.status ?? data.Status ?? '').trim().toLowerCase()
        if (inner === 'failed' || inner === 'failure' || inner === 'declined') return true
    }
    return false
}

export async function GET() {
    return NextResponse.json({
        ok: true,
        service: 'hubtel-callback',
        hint: 'Hubtel sends POST JSON here. Set callback URL in Hubtel.'
    })
}

export async function POST(req: Request) {
    try {
        const callbackData = await req.json() as Record<string, unknown>
        console.log('Received Hubtel callback:', JSON.stringify(callbackData, null, 2))

        const data = (callbackData.Data ?? callbackData.data) as Record<string, unknown> | undefined

        if (!data || !(data.ClientReference ?? data.clientReference)) {
            console.error('Invalid callback data: missing ClientReference')
            return NextResponse.json({ error: 'Invalid callback data' }, { status: 400 })
        }

        const responseCode = callbackData.ResponseCode ?? callbackData.responseCode ?? data.ResponseCode ?? data.responseCode
        const status = callbackData.Status ?? callbackData.status ?? data.Status ?? data.status

        const clientReference = String(data.ClientReference ?? data.clientReference ?? '').trim()
        const checkoutId = data.CheckoutId ?? data.checkoutId
        const salesInvoiceId = data.SalesInvoiceId ?? data.salesInvoiceId
        const amount = data.Amount ?? data.amount as number
        const customerPhone = data.CustomerPhoneNumber ?? data.customerPhoneNumber
        const paymentDetails = data.PaymentDetails ?? data.paymentDetails
        const description = data.Description ?? data.description

        let paymentStatus = 'pending'
        let orderStatus = 'pending_payment'

        if (isHubtelCallbackSuccess(responseCode, status, data)) {
            paymentStatus = 'paid'
            orderStatus = 'processing'
        } else if (isHubtelCallbackFailed(responseCode, status, data)) {
            paymentStatus = 'failed'
            orderStatus = 'cancelled'
        }

        // Bouncer: Verify securely
        if (paymentStatus === 'paid') {
            try {
                console.log(`🔒 Verifying webhook payload for reference: ${clientReference}`)
                const verifiedStatus = await fetchHubtelTransactionStatusLocal({
                    clientReference: clientReference || undefined,
                    hubtelTransactionId: checkoutId ? String(checkoutId) : undefined
                })
                
                const hs = String(verifiedStatus.status || '').toLowerCase()
                if (hs !== 'success' && hs !== 'paid') {
                    console.warn(`🚨 SECURITY WARNING: Webhook claimed success, but Hubtel API says ${hs}. Ignoring payload.`)
                    paymentStatus = 'pending'
                    orderStatus = 'pending_payment'
                } else {
                    console.log(`✅ Webhook payload verified securely against Hubtel API.`)
                }
            } catch (err: any) {
                const msg = String(err?.message || err)
                if (msg === HUBTEL_RATE_LIMIT_ERROR || /429/.test(msg)) {
                    console.warn(`⚠️ Rate limited by Hubtel API during callback verification. Downgrading to pending.`)
                    paymentStatus = 'pending'
                    orderStatus = 'pending_payment'
                } else if (msg === HUBTEL_NO_MATCH) {
                    console.warn(`🚨 SECURITY WARNING: Hubtel API has no record of this transaction (no_match). Ignoring payload.`)
                    paymentStatus = 'pending'
                    orderStatus = 'pending_payment'
                } else {
                    console.warn(`⚠️ Could not verify webhook against Hubtel API:`, err)
                    paymentStatus = 'pending'
                    orderStatus = 'pending_payment'
                }
            }
        }

        // Bypass RLS using service role key
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
        const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

        // 1. LINK ORDERS (orders table)
        const { data: linkOrder, error: linkFetchError } = await supabase
            .from('orders')
            .select('*')
            .eq('payment_reference', clientReference)
            .maybeSingle()

        if (!linkFetchError && linkOrder) {
            const linkOrderStatus = paymentStatus === 'paid'
                ? 'processing'
                : (paymentStatus === 'failed' ? 'cancelled' : (linkOrder.order_status || 'new'))

            const notesMerged = mergeNotesWithHubtelCheckout(linkOrder.notes as string | undefined, checkoutId as string | undefined)

            const { error: linkUpdateError } = await supabase
                .from('orders')
                .update({
                    payment_status: paymentStatus,
                    order_status: linkOrderStatus,
                    ...(notesMerged !== linkOrder.notes && notesMerged != null ? { notes: notesMerged } : {})
                })
                .eq('id', linkOrder.id)

            if (linkUpdateError) throw linkUpdateError
            
            console.log(`Link order ${linkOrder.id} updated from Hubtel callback: ${paymentStatus}`)
            
            return NextResponse.json({
                message: 'Link order callback processed successfully',
                reference: clientReference,
                status: paymentStatus,
                orderType: 'link_order'
            })
        }

        // 2. MALL ORDERS (ecom_orders table)
        const { data: ecomOrder, error: fetchError } = await supabase
            .from('ecom_orders')
            .select('*')
            .eq('payment_reference', clientReference)
            .maybeSingle()

        if (!fetchError && ecomOrder) {
            const { error: updateError } = await supabase
                .from('ecom_orders')
                .update({
                    payment_status: paymentStatus,
                    order_status: orderStatus,
                    payment_gateway: 'hubtel',
                    payment_details: {
                        checkoutId,
                        salesInvoiceId,
                        amount,
                        customerPhone,
                        paymentMethod: (paymentDetails as any)?.PaymentType || (paymentDetails as any)?.paymentType || null,
                        channel: (paymentDetails as any)?.Channel || (paymentDetails as any)?.channel || null,
                        mobileMoneyNumber: (paymentDetails as any)?.MobileMoneyNumber || (paymentDetails as any)?.mobileMoneyNumber || null,
                        description,
                        responseCode,
                        callbackReceivedAt: new Date().toISOString()
                    },
                    updated_at: new Date().toISOString()
                })
                .eq('id', ecomOrder.id)

            if (updateError) throw updateError
            console.log(`Ecom Order ${ecomOrder.id} updated: ${paymentStatus}`)

            return NextResponse.json({
                message: 'Ecom order callback processed successfully',
                reference: clientReference,
                status: paymentStatus,
                orderType: 'ecom_order'
            })
        }

        // 3. SHIPMENT SHIPPING FEES
        if (clientReference.startsWith('SHIPMENT-')) {
            const { data: shipment, error: shipErr } = await supabase
                .from('shipments')
                .select('id, shipping_fee_paid')
                .eq('shipping_fee_payment_reference', clientReference)
                .maybeSingle()

            if (!shipErr && shipment) {
                if (paymentStatus === 'paid' && !shipment.shipping_fee_paid) {
                    await supabase
                        .from('shipments')
                        .update({ shipping_fee_paid: true })
                        .eq('id', shipment.id)
                    console.log(`Shipment ${shipment.id} shipping fee marked paid`)
                    revalidatePath('/dashboard/packages')
                    revalidatePath(`/dashboard/packages/${shipment.id}`)
                }
                return NextResponse.json({
                    message: 'Shipment callback processed',
                    reference: clientReference,
                    type: 'shipment_shipping_fee'
                })
            }
        }

        // 4. ECOM SHIPPING FEES
        if (clientReference.startsWith('SHIPPING_') || clientReference.startsWith('C2G-SHIPPING-') || clientReference.startsWith('SHIP-')) {
            const { data: shipFeeOrder, error: sfoErr } = await supabase
                .from('ecom_orders')
                .select('id, shipping_fee_paid')
                .eq('shipping_fee_payment_reference', clientReference)
                .maybeSingle()

            if (!sfoErr && shipFeeOrder) {
                if (paymentStatus === 'paid' && !shipFeeOrder.shipping_fee_paid) {
                    await supabase
                        .from('ecom_orders')
                        .update({
                            shipping_fee_paid: true,
                            updated_at: new Date().toISOString()
                        })
                        .eq('id', shipFeeOrder.id)
                    console.log(`Ecom order ${shipFeeOrder.id} shipping fee marked paid`)
                }
                return NextResponse.json({
                    message: 'Ecom shipping fee callback processed',
                    reference: clientReference,
                    type: 'ecom_shipping_fee'
                })
            }
        }

        // 5. PACKAGE REGISTRATION FEES
        if (clientReference.startsWith('REG-')) {
            const { data: regShipment, error: regErr } = await supabase
                .from('shipments')
                .select('id, registration_fee_paid')
                .eq('registration_fee_payment_reference', clientReference)
                .maybeSingle()

            if (!regErr && regShipment) {
                if (paymentStatus === 'paid' && !regShipment.registration_fee_paid) {
                    await supabase
                        .from('shipments')
                        .update({
                            registration_fee_paid: true,
                            status: 'awaiting_arrival'
                        })
                        .eq('id', regShipment.id)
                    console.log(`Shipment ${regShipment.id} registration fee marked paid`)
                    revalidatePath('/dashboard/packages')
                    revalidatePath(`/dashboard/packages/${regShipment.id}`)
                }
                return NextResponse.json({
                    message: 'Registration fee callback processed',
                    reference: clientReference,
                    type: 'package_registration_fee'
                })
            }
        }

        console.error('Order not found for reference:', clientReference)
        return NextResponse.json({
            message: 'Order not found',
            reference: clientReference
        }, { status: 200 }) // Return 200 to stop Hubtel from retrying

    } catch (error: any) {
        console.error('Error processing Hubtel callback:', error)
        return NextResponse.json({
            error: 'Internal server error',
            message: error.message
        }, { status: 200 })
    }
}
