'use client'

import { useRouter } from 'next/navigation'
import Script from 'next/script'
import { createClient } from '@/utils/supabase/client'
import { useState, useCallback, useRef } from 'react'

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
      renderButton: (parent: HTMLElement, options: any) => void;
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
  const [error, setError] = useState<string | null>(null)
  const btnContainerRef = useRef<HTMLDivElement>(null)
  const nonceRef = useRef<string | undefined>(undefined)
  const initializedRef = useRef(false)

  const handleCredentialResponse = useCallback(async (response: CredentialResponse) => {
    setError(null)
    try {
      const { data, error: authError } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: response.credential,
        nonce: nonceRef.current!,
      })

      if (authError) {
        setError(authError.message || JSON.stringify(authError))
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
            const { data: customer } = await supabase
              .from('customers')
              .select('phone')
              .eq('id', data.user.id)
              .maybeSingle()
            
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
    }
  }, [supabase, router])

  const initializeGoogleSDK = useCallback(async () => {
    if (initializedRef.current) return
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

    if (btnContainerRef.current) {
      google.accounts.id.renderButton(btnContainerRef.current, {
        type: 'standard',
        theme: 'filled_black',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        logo_alignment: 'center',
        width: btnContainerRef.current.offsetWidth || 350
      })
    }

    // Still optionally show One Tap UI if applicable
    google.accounts.id.prompt()
  }, [handleCredentialResponse])

  return (
    <div className="w-full flex flex-col items-center">
      <Script
        src="https://accounts.google.com/gsi/client"
        onReady={() => { initializeGoogleSDK() }}
        strategy="afterInteractive"
      />
      
      <div 
        ref={btnContainerRef} 
        className="w-full flex justify-center min-h-[44px]"
      ></div>

      {error && (
        <p className="text-xs text-destructive mt-2 text-center">{error}</p>
      )}
    </div>
  )
}
