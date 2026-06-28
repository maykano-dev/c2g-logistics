'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2, CheckCircle2, XCircle, ArrowRight, AlertCircle } from 'lucide-react'
import Link from 'next/link'

function PaymentStatusContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const reference = searchParams.get('reference')
  const checkoutId = searchParams.get('checkoutid') || searchParams.get('checkoutId')
  const statusParam = searchParams.get('status')
  
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying')
  const [message, setMessage] = useState('Verifying your payment securely with Hubtel...')
  const [amount, setAmount] = useState<number | null>(null)

  useEffect(() => {
    if (statusParam === 'cancelled') {
        setStatus('failed')
        setMessage('Payment was cancelled.')
        return
    }

    if (!reference && !checkoutId) {
        setStatus('failed')
        setMessage('Invalid payment reference.')
        return
    }

    let isMounted = true
    let attempts = 0
    const maxAttempts = 15 // Poll for up to ~45 seconds

    const verifyPayment = async () => {
      try {
        attempts++
        const res = await fetch(`/api/hubtel/verify?clientReference=${reference || ''}&checkoutId=${checkoutId || ''}`)
        const data = await res.json()

        if (!isMounted) return

        if (res.ok && (data.status === 'success' || data.status === 'paid')) {
          setStatus('success')
          setMessage('Payment successful! Your transaction has been securely verified.')
          if (data.amount) setAmount(data.amount)
            
          // Ported logic: Clear cart on mall order success
          if (reference && (reference.includes('C2G-MALL') || reference.startsWith('MALL-'))) {
              try {
                  localStorage.removeItem('ecomCart');
                  window.dispatchEvent(new Event('cartUpdated')); // Trigger global cart update if listeners exist
              } catch (e) {}
          }
        } else if (res.ok && data.status === 'failed') {
          setStatus('failed')
          setMessage('Payment failed or was declined.')
        } else if (attempts < maxAttempts) {
          // Keep polling if pending
          setTimeout(verifyPayment, 3000)
        } else {
          setStatus('failed')
          setMessage('Verification timed out. If you were charged, please contact support.')
        }
      } catch (err) {
        if (!isMounted) return
        if (attempts < maxAttempts) {
            setTimeout(verifyPayment, 3000)
        } else {
            setStatus('failed')
            setMessage('Network error while verifying payment.')
        }
      }
    }

    verifyPayment()

    return () => { isMounted = false }
  }, [reference, checkoutId, statusParam])

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-neutral-800/50 backdrop-blur-xl border border-neutral-700/50 rounded-3xl shadow-2xl overflow-hidden relative"
      >
        {/* Top accent line */}
        <div className={`h-1 w-full absolute top-0 left-0 transition-colors duration-500 ${
            status === 'verifying' ? 'bg-blue-500' : 
            status === 'success' ? 'bg-emerald-500' : 'bg-red-500'
        }`} />

        <div className="p-8 flex flex-col items-center text-center space-y-6">
          
          {/* Icon Container */}
          <div className="relative">
            {status === 'verifying' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-24 h-24 rounded-full bg-blue-500/10 flex items-center justify-center"
              >
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
              </motion.div>
            )}

            {status === 'success' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center"
              >
                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
              </motion.div>
            )}

            {status === 'failed' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center"
              >
                <XCircle className="w-12 h-12 text-red-500" />
              </motion.div>
            )}
          </div>

          {/* Text Content */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">
              {status === 'verifying' && 'Verifying Payment'}
              {status === 'success' && 'Payment Successful'}
              {status === 'failed' && 'Payment Failed'}
            </h1>
            <p className="text-neutral-400 text-sm leading-relaxed">
              {message}
            </p>
          </div>

          {/* Receipt Details (if success) */}
          {status === 'success' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full bg-neutral-900/50 rounded-2xl p-4 border border-neutral-800 space-y-3"
            >
              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-500">Reference</span>
                <span className="text-neutral-300 font-mono text-xs truncate max-w-[150px]">{reference || checkoutId}</span>
              </div>
              {amount !== null && (
                <div className="flex justify-between items-center text-sm border-t border-neutral-800 pt-3">
                  <span className="text-neutral-500">Amount Paid</span>
                  <span className="text-emerald-400 font-semibold text-lg">₵{amount.toFixed(2)}</span>
                </div>
              )}
            </motion.div>
          )}

          {/* Alert (if failed) */}
          {status === 'failed' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full bg-red-500/10 rounded-2xl p-4 border border-red-500/20 flex items-start space-x-3 text-left"
            >
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="text-sm text-red-300">
                You will not be charged. If money was deducted, it will be automatically reversed by your provider.
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <div className="w-full pt-4">
            {status === 'verifying' ? (
              <div className="w-full h-12 rounded-xl bg-neutral-800 animate-pulse" />
            ) : (
              <Link 
                href={(() => {
                  if (reference?.startsWith('WLT-') || reference?.startsWith('WALLET-')) return '/dashboard/wallet';
                  if (reference?.startsWith('SHIPMENT-')) return '/dashboard/packages';
                  if (reference?.startsWith('REG-')) return '/dashboard/packages';
                  return '/dashboard/orders';
                })()}
                className={`w-full flex items-center justify-center space-x-2 h-12 rounded-xl font-medium transition-all ${
                  status === 'success' 
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-white'
                }`}
              >
                <span>Return to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>

        </div>
      </motion.div>
    </div>
  )
}

export default function PaymentStatusPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    }>
      <PaymentStatusContent />
    </Suspense>
  )
}
