'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, ArrowRight, ScanLine, KeyRound, Eye, EyeOff } from 'lucide-react';
import { verifyAdminCredentials, setupTOTP, verifyTOTP } from '@/app/admin/actions';
import QRCode from 'qrcode';

export default function AdminLogin() {
  const router = useRouter();
  
  // Steps: 0 = Email/Pass, 1 = Setup 2FA QR, 2 = Enter 2FA Code
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState('');
  
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [totpCode, setTotpCode] = useState('');

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await verifyAdminCredentials(email, password);
    
    if (!res.success) {
      setError(res.error || 'Access denied');
      setLoading(false);
      return;
    }

    setUserId(res.userId || '');

    if (res.totpEnabled) {
      // 2FA already set up, skip QR
      setStep(2);
      setLoading(false);
    } else {
      // Need to setup 2FA
      const setupRes = await setupTOTP(res.userId || '');
      if (setupRes.success && setupRes.otpauth) {
        const qr = await QRCode.toDataURL(setupRes.otpauth);
        setQrCodeDataUrl(qr);
        setStep(1);
      } else {
        setError(setupRes.error || 'Failed to initialize 2FA');
      }
      setLoading(false);
    }
  };

  const handleTotpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (totpCode.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    const res = await verifyTOTP(userId, totpCode);
    
    if (res.success) {
      router.push('/admin/dashboard');
    } else {
      setError(res.error || 'Invalid code');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-center gap-3">
          <div className="w-10 h-10 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Admin Terminal</h1>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          {step === 0 && (
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Clearance ID (Email)</label>
                <input 
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full h-12 bg-zinc-900 border border-zinc-800 rounded-xl px-4 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Passphrase</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full h-12 bg-zinc-900 border border-zinc-800 rounded-xl pl-4 pr-10 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full h-12 mt-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
              >
                {loading ? 'Authenticating...' : (
                  <>Authenticate <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
          )}

          {step === 1 && (
            <form onSubmit={handleTotpSubmit} className="space-y-6 text-center">
              <div className="space-y-2">
                <h3 className="text-lg font-bold">Setup Authenticator</h3>
                <p className="text-sm text-zinc-400">Scan this code with Google Authenticator or Authy to secure your access.</p>
              </div>
              
              {qrCodeDataUrl && (
                <div className="bg-white p-4 rounded-xl inline-block mx-auto border-4 border-indigo-500/20">
                  <img src={qrCodeDataUrl} alt="QR Code" className="w-48 h-48" />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Enter 6-Digit Code</label>
                <input 
                  type="text"
                  maxLength={6}
                  value={totpCode}
                  onChange={e => setTotpCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full h-14 bg-zinc-900 border border-zinc-800 rounded-xl px-4 text-white text-center text-2xl tracking-[0.5em] font-mono focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  placeholder="••••••"
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={loading || totpCode.length !== 6}
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
              >
                {loading ? 'Verifying...' : (
                  <>Verify & Proceed <ScanLine className="w-4 h-4" /></>
                )}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleTotpSubmit} className="space-y-6 text-center">
              <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-800">
                <KeyRound className="w-8 h-8 text-indigo-500" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-bold">2FA Required</h3>
                <p className="text-sm text-zinc-400">Enter the 6-digit code from your authenticator app.</p>
              </div>
              
              <div>
                <input 
                  type="text"
                  maxLength={6}
                  value={totpCode}
                  onChange={e => setTotpCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full h-14 bg-zinc-900 border border-zinc-800 rounded-xl px-4 text-white text-center text-2xl tracking-[0.5em] font-mono focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  placeholder="••••••"
                  autoFocus
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={loading || totpCode.length !== 6}
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
              >
                {loading ? 'Verifying...' : (
                  <>Unlock Dashboard <ShieldAlert className="w-4 h-4" /></>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
