// apps/main/utils/hubtel.ts

import { createClient } from '@supabase/supabase-js'

export const HUBTEL_RATE_LIMIT_ERROR = 'HUBTEL_RATE_LIMIT'
export const HUBTEL_NO_MATCH = 'HUBTEL_NO_MATCH'

function normalizeBodyResponseCode(body: Record<string, unknown>): string {
    const raw = body.ResponseCode ?? body.responseCode
    if (raw === undefined || raw === null) return ''
    const s = String(raw).trim()
    if (/^\d+$/.test(s)) return s.padStart(4, '0')
    return s
}

export type HubtelStatusInput = {
    clientReference?: string
    hubtelTransactionId?: string
    networkTransactionId?: string
}

export type HubtelStatusNormalized = {
    status: string
    amount: number
    charges: number
    amountAfterCharges: number
    reference?: string
    clientReference?: string
    transactionId?: string
    externalTransactionId?: string
    paymentMethod?: string
    date?: string
    isFulfilled?: boolean
    rawResponse: Record<string, unknown>
}

export async function fetchHubtelTransactionStatusLocal(
    input: HubtelStatusInput
): Promise<HubtelStatusNormalized> {
    const { clientReference, hubtelTransactionId, networkTransactionId } = input

    if (!clientReference && !hubtelTransactionId && !networkTransactionId) {
        throw new Error(
            'At least one transaction identifier is required (clientReference, hubtelTransactionId, or networkTransactionId)'
        )
    }

    const params = new URLSearchParams()
    if (hubtelTransactionId && /^\d+$/.test(hubtelTransactionId)) {
        params.append('hubtelTransactionId', hubtelTransactionId)
    } else if (networkTransactionId) {
        params.append('networkTransactionId', networkTransactionId)
    } else if (clientReference) {
        params.append('clientReference', clientReference)
    } else if (hubtelTransactionId) {
        params.append('clientReference', hubtelTransactionId)
    }

    // Fetch credentials dynamically
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: settings } = await supabase.from('settings').select('hubtel_api_id, hubtel_api_key, hubtel_merchant_account').eq('id', 1).single();

    const hubtelApiId = (process.env.HUBTEL_API_ID || process.env.HUBTEL_CLIENT_ID || settings?.hubtel_api_id)?.trim();
    const hubtelApiKey = (process.env.HUBTEL_API_KEY || process.env.HUBTEL_CLIENT_SECRET || settings?.hubtel_api_key)?.trim();
    const hubtelMerchantAccount = (process.env.HUBTEL_MERCHANT_ACCOUNT || settings?.hubtel_merchant_account)?.trim();

    if (!hubtelApiId || !hubtelApiKey || !hubtelMerchantAccount) {
        throw new Error('Hubtel gateway credentials not configured');
    }

    const authString = `Basic ${Buffer.from(`${hubtelApiId}:${hubtelApiKey}`).toString('base64')}`;

    const apiUrl =
        `https://rmsc.hubtel.com/v1/merchantaccount/merchants/${encodeURIComponent(hubtelMerchantAccount)}/transactions/status?${params.toString()}`

    console.log('Checking Hubtel transaction status (RMSC):', {
        merchantAccount: hubtelMerchantAccount,
        clientReference,
        hubtelTransactionId,
        networkTransactionId
    })

    const hubtelResponse = await fetch(apiUrl, {
        method: 'GET',
        headers: {
            Authorization: authString,
            'Content-Type': 'application/json'
        }
    })

    const responseText = await hubtelResponse.text()

    if (!hubtelResponse.ok) {
        if (hubtelResponse.status === 429) {
            throw new Error(HUBTEL_RATE_LIMIT_ERROR)
        }
        if (hubtelResponse.status === 403) {
            throw new Error(
                'IP address not whitelisted. Contact Hubtel Retail Systems Engineer.'
            )
        }
        throw new Error(`Hubtel Status Check API error: ${hubtelResponse.status} - ${responseText}`)
    }

    let statusData: any
    try {
        statusData = JSON.parse(responseText)
    } catch {
        throw new Error('Invalid response from Hubtel Status Check API')
    }

    const bodyFlat = statusData as unknown as Record<string, unknown>
    const rc = normalizeBodyResponseCode(bodyFlat)
    if (rc === '4290') {
        throw new Error(HUBTEL_RATE_LIMIT_ERROR)
    }
    if (rc === '4720') {
        throw new Error(HUBTEL_NO_MATCH)
    }
    if (rc !== '0000') {
        throw new Error(String(statusData.message ?? statusData.Message ?? 'Status check failed'))
    }

    let transactionData = (statusData.data ?? statusData.Data) as Record<string, unknown>
    if (Array.isArray(transactionData)) {
        if (transactionData.length === 0) {
            throw new Error(HUBTEL_NO_MATCH)
        }
        const successful = transactionData.find((t: any) => {
            const st = String(t.status || t.Status || t.TransactionStatus || '').toLowerCase()
            const fulfilled = t.isFulfilled === true || t.IsFulfilled === true || t.InvoiceStatus?.toLowerCase() === 'success'
            return fulfilled || st === 'paid' || st === 'success' || st === 'successful'
        })
        transactionData = successful || transactionData[0]
    }

    if (!transactionData) {
        throw new Error('Missing transaction data in Hubtel response')
    }

    const stRaw = String(
        transactionData.status ??
        (transactionData as { Status?: string }).Status ??
        (transactionData as { TransactionStatus?: string }).TransactionStatus ??
        ''
    )
    const stLower = stRaw.trim().toLowerCase()
    const fulfilled =
        transactionData.isFulfilled === true ||
        (transactionData as { IsFulfilled?: boolean }).IsFulfilled === true ||
        (transactionData as { InvoiceStatus?: string }).InvoiceStatus?.toLowerCase() === 'success'

    let status: 'pending' | 'success' | 'refunded' | 'failed' = 'pending'
    if (stLower === 'refunded') {
        status = 'refunded'
    } else if (stLower === 'unpaid') {
        status = 'pending'
    } else if (stLower === 'failed' || stLower === 'cancelled') {
        status = 'failed'
    } else if (
        fulfilled ||
        stLower === 'paid' ||
        stLower === 'successful' ||
        stLower === 'success' ||
        stLower === 'fulfilled' ||
        stLower === 'completed' ||
        stLower === 'complete'
    ) {
        status = 'success'
    } else if (stLower === 'pending') {
        status = fulfilled ? 'success' : 'pending'
    } else if (!stRaw.trim() && fulfilled) {
        status = 'success'
    }

    const rawAmount = Number(transactionData.amount ?? (transactionData as { TransactionAmount?: number }).TransactionAmount) || 0
    const charges = Number(transactionData.charges ?? (transactionData as { Fee?: number }).Fee) || 0
    const amountAfterCharges = Number(transactionData.amountAfterCharges ?? (transactionData as { AmountAfterFees?: number }).AmountAfterFees) || 0
    const amount = rawAmount || amountAfterCharges || 0

    return {
        status,
        amount,
        charges,
        amountAfterCharges,
        reference: clientReference,
        clientReference: (transactionData.clientReference ?? (transactionData as { ClientReference?: string }).ClientReference) as string | undefined,
        transactionId: (transactionData.transactionId ?? (transactionData as { TransactionId?: string }).TransactionId) as string | undefined,
        externalTransactionId: (transactionData.externalTransactionId ?? (transactionData as { NetworkTransactionId?: string }).NetworkTransactionId) as string | undefined,
        paymentMethod: (transactionData.paymentMethod ?? (transactionData as { PaymentMethod?: string }).PaymentMethod) as string | undefined,
        date: (transactionData.date ?? (transactionData as { StartDate?: string }).StartDate) as string | undefined,
        isFulfilled: transactionData.isFulfilled as boolean | undefined,
        rawResponse: { ...transactionData, _debugMerchantAccount: hubtelMerchantAccount }
    }
}

export function extractHubtelCheckoutId(notes: string | null | undefined): string | null {
    if (!notes || typeof notes !== 'string') return null
    const m = notes.match(/HUBTEL_CHECKOUT:([^\s\n]+)/)
    return m && m[1] ? m[1].trim() : null
}

export function mergeNotesWithHubtelCheckout(existingNotes: string | null | undefined, checkoutId: string | undefined): string | null {
    if (!checkoutId || !String(checkoutId).trim()) return existingNotes ?? null
    const line = `HUBTEL_CHECKOUT:${String(checkoutId).trim()}`
    const base = existingNotes ?? ''
    if (base.includes(line)) return base
    const marker = 'JSON_ITEMS:'
    const idx = base.indexOf(marker)
    if (idx === -1) return `${base.trim()}\n${line}`.trim()
    return `${base.slice(0, idx).trim()}\n${line}\n${marker}${base.slice(idx + marker.length)}`
}

export async function initializeHubtelPayment({
    amount,
    reference,
    customerName,
    customerPhone,
    customerEmail,
    description,
    returnUrl,
    cancelUrl,
    callbackUrl,
    hubtelApiId,
    hubtelApiKey,
    hubtelMerchantAccount
}: {
    amount: number,
    reference: string,
    customerName?: string,
    customerPhone?: string,
    customerEmail?: string,
    description: string,
    returnUrl: string,
    cancelUrl: string,
    callbackUrl: string,
    hubtelApiId?: string,
    hubtelApiKey?: string,
    hubtelMerchantAccount?: string
}) {
    const authString = `Basic ${Buffer.from(`${hubtelApiId}:${hubtelApiKey}`).toString('base64')}`;
    const merchantAccount = hubtelMerchantAccount;

    const hubtelPayload = {
        totalAmount: amount,
        description: description,
        callbackUrl: callbackUrl,
        returnUrl: returnUrl,
        merchantAccountNumber: merchantAccount,
        cancellationUrl: cancelUrl,
        clientReference: reference,
        ...(customerName && { payeeName: customerName }),
        ...(customerPhone && { payeeMobileNumber: customerPhone }),
        ...(customerEmail && { payeeEmail: customerEmail })
    }

    const apiUrl = 'https://payproxyapi.hubtel.com/items/initiate'

    const hubtelResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Authorization': authString,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(hubtelPayload),
    })

    const responseText = await hubtelResponse.text()

    if (!hubtelResponse.ok) {
        throw new Error(`Hubtel API error: ${hubtelResponse.status} - ${responseText}`)
    }

    let hubtelData
    try {
        hubtelData = JSON.parse(responseText)
    } catch (parseError) {
        throw new Error('Invalid response from Hubtel API')
    }

    if (hubtelData.responseCode !== "0000" && hubtelData.status !== "Success") {
        throw new Error(hubtelData.message || 'Failed to initialize Hubtel payment')
    }

    if (!hubtelData.data?.checkoutUrl) {
        throw new Error('No checkout URL returned from Hubtel')
    }

    return {
        checkoutUrl: hubtelData.data.checkoutUrl,
        checkoutDirectUrl: hubtelData.data.checkoutDirectUrl,
        checkoutId: hubtelData.data.checkoutId
    }
}
