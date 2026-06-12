'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Loader2, ShieldCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function MfaVerifyForm() {
  const supabase = createClient();
  const router = useRouter();
  const [verifyCode, setVerifyCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [factorId, setFactorId] = useState<string | null>(null);

  useEffect(() => {
    // On mount, check if user is at AAL1 and fetch their TOTP factor ID
    const fetchFactor = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace('/login');
        return;
      }
      
      const { data: factorsData } = await supabase.auth.mfa.listFactors();
      if (factorsData?.totp && factorsData.totp.length > 0) {
        setFactorId(factorsData.totp[0].id);
      } else {
        // No TOTP enrolled, redirect back
        router.replace('/dashboard');
      }
    };
    fetchFactor();
  }, [supabase, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!factorId || verifyCode.length < 6) return;
    
    setError(null);
    setIsLoading(true);

    try {
      const challenge = await supabase.auth.mfa.challenge({ factorId });
      if (challenge.error) throw challenge.error;

      const verify = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.data.id,
        code: verifyCode
      });

      if (verify.error) throw verify.error;

      // Successfully reached AAL2! Insert session login history manually via client call or let the user proceed.
      // (Server action handles it natively, but here we can just push to dashboard)
      // Since it's a client component, we will push router to dashboard which will re-run layout.tsx server component.
      
      router.refresh();
      router.replace('/dashboard');
      
    } catch (err: any) {
      setError(err.message || 'Invalid authentication code.');
      setVerifyCode('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto space-y-6">
      <div className="text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Two-Factor Authentication</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Open your authenticator app and enter the 6-digit code to continue.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2 text-center">Authentication Code</label>
          <input 
            type="text" 
            maxLength={6}
            value={verifyCode}
            onChange={(e) => setVerifyCode(e.target.value.replace(/\\D/g, ''))}
            className="w-full h-14 bg-background border border-border rounded-xl px-4 text-center text-3xl tracking-[0.5em] font-mono focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm"
            placeholder="000000"
            required
            autoFocus
          />
        </div>

        {error && (
          <div className="p-3 bg-destructive/10 text-destructive text-sm font-medium rounded-lg text-center border border-destructive/20">
            {error}
          </div>
        )}

        <button 
          type="submit" 
          disabled={verifyCode.length < 6 || isLoading || !factorId}
          className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          Verify Identity
        </button>
      </form>

      <div className="text-center pt-2">
        <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Cancel & Return to Login
        </Link>
      </div>
    </div>
  );
}
