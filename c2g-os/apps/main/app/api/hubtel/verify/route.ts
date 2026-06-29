import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { 
    fetchHubtelTransactionStatusLocal, 
    mergeNotesWithHubtelCheckout 
} from '../../../../utils/hubtel'
import { createNotification } from '@/utils/notifications'

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
                let { data: ecomOrder } = await supabase
                    .from('ecom_orders')
                    .select('id, payment_status, total_amount, customer_id')
                    .eq('payment_reference', ref)
                    .maybeSingle()

                // Fallback parsing for ecom orders (e.g. C2G-MALL-ID)
                if (!ecomOrder && (ref.startsWith('C2G-MALL-') || ref.startsWith('MALL-'))) {
                    const parts = ref.split('-');
                    const idPart = parts.length >= 3 && ref.startsWith('C2G-') ? parts[2] : (parts.length >= 2 ? parts[1] : null);
                    if (idPart) {
                        const isNumeric = !isNaN(parseInt(idPart as string));
                        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idPart as string);
                        if (isNumeric || isUUID) {
                            const { data: oById } = await supabase.from('ecom_orders').select('id, payment_status, total_amount, customer_id').eq('id', idPart).maybeSingle();
                            if (oById) ecomOrder = oById;
                        }
                    }
                }

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

                    if (ecomOrder.customer_id) {
                        await createNotification({
                            userId: ecomOrder.customer_id,
                            title: 'Order Payment Successful',
                            message: `Your payment of ₵${(ecomOrder.total_amount || 0).toFixed(2)} for Mall Order #${ecomOrder.id.toString().slice(-4)} was successful.`,
                            type: 'order_payment_successful',
                            priority: 'info',
                            link: '/dashboard/orders'
                        });
                    }
                }

                // 3. SHIPMENT SHIPPING FEES
                if (ref.startsWith('SHIPMENT-')) {
                    // Lookup by reference first
                    let { data: shipment } = await supabase
                        .from('shipments')
                        .select('id, shipping_fee_paid, shipping_cost, customer_id')
                        .eq('shipping_fee_payment_reference', ref)
                        .maybeSingle()

                    // Fallback to parsing ID from reference if needed
                    if (!shipment) {
                        const parts = ref.split('-');
                        if (parts.length >= 2) {
                            const shipmentId = parts[1];
                            const isNumeric = !isNaN(parseInt(shipmentId as string));
                            const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(shipmentId as string);
                            if (isNumeric || isUUID) {
                                const { data: sById } = await supabase.from('shipments').select('id, shipping_fee_paid, shipping_cost, customer_id').eq('id', shipmentId).maybeSingle();
                                if (sById) shipment = sById;
                            }
                        }
                    }

                    if (shipment && !shipment.shipping_fee_paid) {
                        await supabase
                            .from('shipments')
                            .update({ shipping_fee_paid: true })
                            .eq('id', shipment.id)
                        console.log(`[Verify API] Shipment ${shipment.id} shipping fee verified as paid`)
                        
                        if (shipment.customer_id) {
                            await createNotification({
                                userId: shipment.customer_id,
                                title: 'Shipping Fee Paid',
                                message: `Your shipping fee of ₵${(shipment.shipping_cost || 0).toFixed(2)} for shipment #${shipment.id} has been paid successfully.`,
                                type: 'shipment_shipping_fee_paid',
                                priority: 'info',
                                link: '/dashboard/packages'
                            });
                        }
                    }
                }

                // 4. ECOM SHIPPING FEES
                if (ref.startsWith('SHIPPING_') || ref.startsWith('C2G-SHIPPING-') || ref.startsWith('SHIP-')) {
                    let { data: shipFeeOrder } = await supabase
                        .from('ecom_orders')
                        .select('id, shipping_fee_paid, shipping_cost, customer_id')
                        .eq('shipping_fee_payment_reference', ref)
                        .maybeSingle()

                    // Fallback to parsing ID
                    if (!shipFeeOrder) {
                        const separator = ref.includes('_') ? '_' : '-';
                        const parts = ref.split(separator);
                        if (parts.length >= 2) {
                            const orderId = parts[1];
                            const isNumeric = !isNaN(parseInt(orderId as string));
                            const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId as string);
                            if (isNumeric || isUUID) {
                                const { data: oById } = await supabase.from('ecom_orders').select('id, shipping_fee_paid, shipping_cost, customer_id').eq('id', orderId).maybeSingle();
                                if (oById) shipFeeOrder = oById;
                            }
                        }
                    }

                    if (shipFeeOrder && !shipFeeOrder.shipping_fee_paid) {
                        await supabase
                            .from('ecom_orders')
                            .update({
                                shipping_fee_paid: true,
                                updated_at: new Date().toISOString()
                            })
                            .eq('id', shipFeeOrder.id)
                        console.log(`[Verify API] Ecom order ${shipFeeOrder.id} shipping fee verified as paid`)

                        if (shipFeeOrder.customer_id) {
                            await createNotification({
                                userId: shipFeeOrder.customer_id,
                                title: 'Order Shipping Fee Paid',
                                message: `Your shipping fee of ₵${(shipFeeOrder.shipping_cost || 0).toFixed(2)} for Mall Order #${shipFeeOrder.id.toString().slice(-4)} has been paid successfully.`,
                                type: 'order_shipping_fee_paid',
                                priority: 'info',
                                link: '/dashboard/orders'
                            });
                        }
                    }
                }

                // 5. PACKAGE REGISTRATION FEES
                if (ref.startsWith('REG-')) {
                    let { data: regShipment } = await supabase
                        .from('shipments')
                        .select('id, registration_fee_paid, customer_id')
                        .eq('registration_fee_payment_reference', ref)
                        .maybeSingle()

                    if (!regShipment) {
                        const parts = ref.split('-');
                        if (parts.length >= 2) {
                            const shipmentId = parts[1];
                            const isNumeric = !isNaN(parseInt(shipmentId as string));
                            const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(shipmentId as string);
                            if (isNumeric || isUUID) {
                                const { data: sById } = await supabase.from('shipments').select('id, registration_fee_paid, customer_id').eq('id', shipmentId).maybeSingle();
                                if (sById) regShipment = sById;
                            }
                        }
                    }

                    if (regShipment && !regShipment.registration_fee_paid) {
                        await supabase
                            .from('shipments')
                            .update({
                                registration_fee_paid: true,
                                status: 'awaiting_arrival'
                            })
                            .eq('id', regShipment.id)
                        console.log(`[Verify API] Shipment ${regShipment.id} registration fee verified as paid`)

                        if (regShipment.customer_id) {
                            await createNotification({
                                userId: regShipment.customer_id,
                                title: 'Package Registration Paid',
                                message: `Your registration fee for package #${regShipment.id} has been paid successfully.`,
                                type: 'package_registration_paid',
                                priority: 'info',
                                link: '/dashboard/packages'
                            });
                        }
                    }
                }

                // 6. WALLET TOP UP
                if (ref.startsWith('WLT-') || ref.startsWith('WALLET-')) {
                    const urlParams = new URL(req.url);
                    const queryCustomerId = urlParams.searchParams.get('customerId');
                    
                    let customerId = queryCustomerId;
                    if (!customerId && ref.startsWith('WALLET-')) {
                        const parts = ref.split('-');
                        if (parts.length >= 2) customerId = parts[1] || null;
                    }

                    // Always try to find the transaction first using the reference
                    const { data: existingTx } = await supabase
                        .from('wallet_transactions')
                        .select('id, status, wallet_id')
                        .eq('reference_id', checkoutId || ref)
                        .maybeSingle();

                    // If we have an existing transaction, we don't need the customerId, we use the wallet_id
                    // If we don't have an existing transaction, we strictly need the customerId to create one
                    if (existingTx || customerId) {
                        if (!existingTx || existingTx.status === 'pending') {
                            
                            // Get wallet by existing transaction's wallet_id, OR fallback to customerId
                            let walletQuery = supabase.from('wallets').select('id, available_balance, customer_id');
                            if (existingTx && existingTx.wallet_id) {
                                walletQuery = walletQuery.eq('id', existingTx.wallet_id);
                            } else {
                                walletQuery = walletQuery.eq('customer_id', customerId);
                            }
                            
                            const { data: wallet } = await walletQuery.single();

                            if (wallet && statusData.amount) {
                                const amount = Number(statusData.amount);
                                const newBalance = Number(wallet.available_balance) + amount;

                                // Update wallet
                                await supabase
                                    .from('wallets')
                                    .update({ available_balance: newBalance })
                                    .eq('id', wallet.id);

                                // Log or Update transaction
                                if (existingTx) {
                                    await supabase
                                        .from('wallet_transactions')
                                        .update({
                                            status: 'completed',
                                            reference_id: checkoutId || ref
                                        })
                                        .eq('id', existingTx.id);
                                } else {
                                    await supabase
                                        .from('wallet_transactions')
                                        .insert({
                                            wallet_id: wallet.id,
                                            amount: amount,
                                            transaction_type: 'top_up',
                                            status: 'completed',
                                            description: 'Wallet Top Up via Hubtel',
                                            reference_id: checkoutId || ref
                                        });
                                }

                                await createNotification({
                                    userId: wallet.customer_id || customerId,
                                    title: 'Wallet Top-Up Successful',
                                    message: `Your wallet has been credited with ₵${amount.toFixed(2)}.`,
                                    type: 'wallet_top_up',
                                    priority: 'info',
                                    link: '/dashboard/wallet'
                                });

                                console.log(`[Verify API] Wallet ${wallet.id} credited with ${amount}`);
                            }
                        }
                    }
                }
            }
        } else {
            // Handle Failed/Cancelled Hubtel Top-Ups
            const ref = clientReference || statusData.clientReference
            if (ref && (ref.startsWith('WLT-') || ref.startsWith('WALLET-'))) {
                const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
                const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
                const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)
                
                const { data: existingTx } = await supabase
                    .from('wallet_transactions')
                    .select('id, status')
                    .eq('reference_id', checkoutId || ref)
                    .maybeSingle();
                
                if (existingTx && existingTx.status === 'pending') {
                    await supabase
                        .from('wallet_transactions')
                        .update({ status: 'failed', description: 'Wallet Top Up Failed/Cancelled' })
                        .eq('id', existingTx.id);
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
