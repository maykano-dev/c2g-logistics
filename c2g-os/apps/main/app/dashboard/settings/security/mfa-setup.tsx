'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { useModal } from "@/components/providers/modal-provider";

export default function MfaSetup({ hasTotp }: { hasTotp: boolean }) {
  const supabase = createClient();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(hasTotp);
  const [isLoading, setIsLoading] = useState(false);
  const { showConfirm, showAlert } = useModal();

  const startEnrollment = async () => {
    setIsEnrolling(true);
    setError(null);
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
      });
      if (error) throw error;
      
      setQrCode(data.totp.qr_code);
      setFactorId(data.id);
    } catch (err: any) {
      setError(err.message || 'Failed to start MFA enrollment');
      setIsEnrolling(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!factorId || !verifyCode) return;
    
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

      setSuccess(true);
      setIsEnrolling(false);
    } catch (err: any) {
      setError(err.message || 'Invalid code, please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnenroll = async () => {
    const confirmed = await showConfirm({
      title: 'Disable 2FA',
      message: 'Are you sure you want to disable Two-Factor Authentication? This will make your account less secure.',
      type: 'warning',
      confirmText: 'Yes, Disable'
    });
    
    if (!confirmed) return;
    
    setIsLoading(true);
    try {
      const { data: factorsData } = await supabase.auth.mfa.listFactors();
      if (factorsData && factorsData.totp && factorsData.totp.length > 0) {
        const id = factorsData.totp[0]?.id;
        if (id) {
          const { error } = await supabase.auth.mfa.unenroll({ factorId: id });
          if (error) throw error;
        }
      }
      setSuccess(false);
      setQrCode(null);
      setFactorId(null);
    } catch (err: any) {
      setError('Failed to disable MFA. Try again.');
      showAlert({ title: 'Error', message: 'Failed to disable MFA. Try again.', type: 'danger' });
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-6 border border-green-500/30 bg-green-500/10 rounded-xl flex flex-col sm:flex-row items-center sm:items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h3 className="font-bold text-green-500 text-lg">Two-Factor Auth is Enabled</h3>
          <p className="text-sm text-green-500/80 mt-1">Your account is highly secure. You will be prompted for an authenticator code when logging in.</p>
        </div>
        <button 
          onClick={handleUnenroll} 
          disabled={isLoading}
          className="mt-4 sm:mt-0 px-4 py-2 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white rounded-md text-sm font-semibold transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : 'Disable'}
        </button>
      </div>
    );
  }

  if (isEnrolling && qrCode) {
    return (
      <div className="p-6 border border-primary/30 bg-primary/5 rounded-xl">
        <h3 className="font-bold text-lg mb-2">Configure Authenticator App</h3>
        <p className="text-sm text-muted-foreground mb-6">Scan the QR code below with your authenticator app (like Google Authenticator, Authy, or 1Password), then enter the 6-digit code to verify setup.</p>
        
        <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">
          <div className="bg-white p-2 rounded-xl shadow-sm">
            <img src={qrCode} alt="QR Code" className="w-48 h-48" />
          </div>
          
          <form onSubmit={handleVerify} className="flex-1 w-full max-w-sm space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">6-Digit Code</label>
              <input 
                type="text" 
                maxLength={6}
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ''))}
                className="w-full h-12 bg-background border border-border rounded-lg px-4 text-center text-xl tracking-[0.5em] font-mono focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="000000"
                required
              />
            </div>
            {error && <p className="text-destructive text-sm font-medium">{error}</p>}
            <div className="flex gap-3">
              <button 
                type="button" 
                onClick={() => { setIsEnrolling(false); setQrCode(null); setError(null); }}
                className="flex-1 h-11 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md font-semibold transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={verifyCode.length < 6 || isLoading}
                className="flex-1 h-11 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Verify & Save
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      {error && <p className="text-destructive text-sm font-medium mb-4">{error}</p>}
      <button 
        onClick={startEnrollment}
        disabled={isLoading}
        className="h-11 px-6 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-semibold transition-colors flex items-center justify-center gap-2"
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        Enable Two-Factor Auth
      </button>
    </div>
  );
}
