import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { 
    fetchHubtelTransactionStatusLocal, 
    HUBTEL_RATE_LIMIT_ERROR, 
    HUBTEL_NO_MATCH
} from '../../../../utils/hubtel'
import { createNotification } from '../../../../utils/notifications'

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
        const amount = Number(data.Amount ?? data.amount) || 0
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

        // WALLET TOP UP
        if (clientReference.startsWith('WLT-') || clientReference.startsWith('WALLET-')) {
            const { data: existingTx } = await supabase
                .from('wallet_transactions')
                .select('id, status, wallet_id')
                .eq('reference_id', checkoutId || clientReference)
                .maybeSingle()

            if (existingTx) {
                if (paymentStatus === 'paid' && existingTx.status === 'pending') {
                    // Use Atomic RPC to prevent double crediting race conditions
                    const { data: rpcData, error: rpcError } = await supabase.rpc('process_wallet_topup_atomic', {
                        p_transaction_id: existingTx.id,
                        p_wallet_id: existingTx.wallet_id,
                        p_amount: amount
                    });

                    if (rpcError || !rpcData?.success) {
                        console.error('Failed to process atomic wallet top-up:', rpcError || rpcData?.error);
                    } else if (rpcData.message !== 'Already completed') {
                        // Get customer_id to send notification
                        const { data: wallet } = await supabase
                            .from('wallets')
                            .select('customer_id')
                            .eq('id', existingTx.wallet_id)
                            .single();

                        if (wallet) {
                            createNotification({
                                userId: wallet.customer_id,
                                title: 'Wallet Top-Up Successful',
                                message: `Your wallet has been credited with ₵${amount.toFixed(2)} via Hubtel.`,
                                type: 'wallet_top_up',
                                priority: 'info',
                                link: '/dashboard/wallet'
                            }).catch(e => console.warn('Failed to dispatch notification:', e));

                            console.log(`Wallet ${existingTx.wallet_id} credited with ${amount} via webhook (Atomic)`);
                        }
                    }
                } else if (paymentStatus === 'failed' && existingTx.status === 'pending') {
                    await supabase
                        .from('wallet_transactions')
                        .update({ status: 'failed', description: 'Wallet Top Up Failed/Cancelled' })
                        .eq('id', existingTx.id)
                }
                
                return NextResponse.json({
                    message: 'Wallet top-up callback processed',
                    reference: clientReference,
                    type: 'wallet_top_up'
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
