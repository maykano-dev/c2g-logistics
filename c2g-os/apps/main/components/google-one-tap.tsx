'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Script from 'next/script'
import { createClient } from '@/utils/supabase/client'
import { Loader2 } from 'lucide-react'

type CredentialResponse = {
  credential: string;
  select_by: string;
  clientId: string;
};

declare const google: { 
  accounts: {
    id: {
      initialize: (config: any) => void;
      prompt: (callback?: (notification: any) => void) => void;
    }
  } 
};

const generateNonce = async (): Promise<string[]> => {
  const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))))
  const encoder = new TextEncoder()
  const encodedNonce = encoder.encode(nonce)
  const hashBuffer = await crypto.subtle.digest('SHA-256', encodedNonce)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashedNonce = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  return [nonce, hashedNonce]
}

export function GoogleSignInButton({ label = "Continue with Google" }: { label?: string }) {
  const supabase = createClient()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const nonceRef = useRef<string | undefined>(undefined)
  const initializedRef = useRef(false)
  const scriptLoadedRef = useRef(false)

  const fallbackToOAuth = async () => {
    console.log('[GoogleSignIn] Using standard OAuth redirect with select_account')
    try {
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            prompt: 'select_account',
          }
        },
      })
      
      if (authError) {
        setError(authError.message)
        setIsLoading(false)
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred during sign in')
      setIsLoading(false)
    }
  }

  const handleCredentialResponse = useCallback(async (response: CredentialResponse) => {
    setIsLoading(true)
    setError(null)

    try {
      const { data, error: authError } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: response.credential,
        nonce: nonceRef.current!,
      })

      if (authError) {
        setError(authError.message)
        setIsLoading(false)
        return
      }

      if (data?.user) {
        try {
          await supabase.from('customers').insert({
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'Customer',
            status: 'active'
          })
        } catch (e) {}

        const hasPhone = !!data.user.user_metadata?.phone || !!data.user.phone
        if (!hasPhone) {
          try {
            const { data: customer } = await supabase.from('customers').select('phone').eq('id', data.user.id).maybeSingle()
            if (customer?.phone) {
              await supabase.auth.updateUser({ data: { phone: customer.phone } })
              setTimeout(() => { window.location.href = '/dashboard' }, 100)
              return
            }
          } catch (e) {}
          setTimeout(() => { window.location.href = '/auth/complete-profile' }, 500)
          return
        }
      }

      setTimeout(() => { window.location.href = '/dashboard' }, 500)
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred')
      setIsLoading(false)
    }
  }, [supabase, router])

  const initializeGoogleSDK = useCallback(async () => {
    if (initializedRef.current) return
    
    // Check if we are in the browser to safely access navigator
    if (typeof window === 'undefined') return

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    if (isMobile) {
      scriptLoadedRef.current = true
      return
    }

    initializedRef.current = true

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    if (!clientId) {
      setError('Google Client ID is not configured')
      return
    }

    const [nonce, hashedNonce] = await generateNonce()
    nonceRef.current = nonce

    google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCredentialResponse,
      nonce: hashedNonce,
      use_fedcm_for_prompt: true,
      auto_select: false,
      context: 'signin',
      ux_mode: 'popup',
      itp_support: true,
    })

    scriptLoadedRef.current = true
    // Automatically trigger One Tap prompt on page load for PC
    google.accounts.id.prompt()
  }, [handleCredentialResponse])

  const handleSignInClick = () => {
    setIsLoading(true)
    setError(null)
    
    // Explicit button clicks ALWAYS use OAuth redirect to guarantee account selection
    fallbackToOAuth()
  }

  return (
    <div className="w-full flex flex-col items-center">
      <Script
        src="https://accounts.google.com/gsi/client"
        onReady={() => { initializeGoogleSDK() }}
        strategy="afterInteractive"
      />

      <button
        type="button"
        onClick={handleSignInClick}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 h-11 rounded-md border border-input bg-background/50 hover:bg-secondary transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            <path d="M1 1h22v22H1z" fill="none" />
          </svg>
        )}
        {isLoading ? "Connecting to Google..." : label}
      </button>

      {error && (
        <p className="text-xs text-destructive mt-2 text-center">{error}</p>
      )}
    </div>
  )
}
