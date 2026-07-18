'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowRight, Eye, EyeOff, Package } from 'lucide-react';
import { verifyStaffCredentials } from '@/app/staff/actions';

export default function WarehouseLoginClient() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await verifyStaffCredentials(email, password);
    
    if (!res.success) {
      setError(res.error || 'Access denied');
      setLoading(false);
      return;
    }

    if (res.redirectTo) {
      router.push(res.redirectTo);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-[100dvh] bg-black text-white flex flex-col items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none"></div>

      <div className="w-full max-w-md bg-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden relative z-10 animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex flex-col items-center justify-center gap-4 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl"></div>
          
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-2 shadow-lg shadow-blue-500/20 relative z-10">
            <Package className="w-8 h-8 text-white" />
          </div>
          <div className="relative z-10">
            <h1 className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">Warehouse Portal</h1>
            <p className="text-xs text-blue-400 uppercase tracking-[0.2em] font-bold mt-1">China Operations</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium flex items-start gap-3 animate-in slide-in-from-top-2">
              <ShieldCheck className="w-5 h-5 mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleCredentialsSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 ml-1">Staff Email</label>
              <input 
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full h-14 bg-zinc-900 border border-white/10 rounded-2xl px-5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-zinc-600"
                placeholder="staff@c2glogistics.com"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 ml-1">Secure Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full h-14 bg-zinc-900 border border-white/10 rounded-2xl pl-5 pr-12 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-zinc-600"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full h-14 mt-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/25 active:scale-[0.98]"
            >
              {loading ? 'Authenticating...' : (
                <>Access Dashboard <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
