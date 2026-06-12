'use client';

import { useState } from 'react';
import { submitImporterRegistration } from './actions';
import { useRouter } from 'next/navigation';
import { Store, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { PhoneInput } from '../../../components/phone-input';

export default function ImporterRegisterClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [slug, setSlug] = useState('');
  
  const router = useRouter();

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Force lowercase, replace spaces with hyphens, remove non-alphanumeric
    const val = e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setSlug(val);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await submitImporterRegistration(formData);

    if (res.success) {
      setSuccess(true);
    } else {
      setError(res.error || 'Registration failed.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="glass-panel p-12 text-center max-w-2xl mx-auto flex flex-col items-center justify-center animate-fade-in-up border-green-500/30 bg-green-500/5">
        <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black mb-4 text-green-500">Application Submitted!</h2>
        <p className="text-muted-foreground text-lg mb-8 max-w-md">
          Your request to become a C2G Verified Importer is under review. Our team will verify your Ghana Card and contact you via WhatsApp shortly.
        </p>
        <button 
          onClick={() => router.push('/dashboard')}
          className="inline-flex items-center justify-center rounded-xl bg-primary px-8 py-3 text-sm font-bold text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass-panel p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Background ambient glow */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="mb-8 relative z-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4 shadow-sm border border-primary/20">
            <Store className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">Partner with C2G</h1>
          <p className="text-muted-foreground">Setup your mini-importation business on our infrastructure. We buy, we ship, you earn.</p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-destructive/10 text-destructive border border-destructive/30 text-sm mb-8 flex items-start gap-3 animate-shake">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="mt-0.5 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Business Name <span className="text-destructive">*</span></label>
              <input 
                name="businessName"
                type="text" 
                required
                className="w-full flex h-12 rounded-xl border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary backdrop-blur-sm transition-all" 
                placeholder="e.g. Ama's Imports"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Store URL Slug <span className="text-destructive">*</span></label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs text-muted-foreground font-mono">c2g.com/store/</span>
                <input 
                  name="storeSlug"
                  type="text" 
                  required
                  value={slug}
                  onChange={handleSlugChange}
                  className="w-full flex h-12 rounded-xl border border-input bg-background/50 pl-[105px] pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary backdrop-blur-sm transition-all font-mono font-bold text-primary" 
                  placeholder="amas-imports"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold">WhatsApp Number <span className="text-destructive">*</span></label>
              <PhoneInput name="whatsapp" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Business Email <span className="text-destructive">*</span></label>
              <input 
                name="email"
                type="email" 
                required
                className="w-full flex h-12 rounded-xl border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary backdrop-blur-sm transition-all" 
                placeholder="sales@amasimports.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Ghana Card Number (For Verification) <span className="text-destructive">*</span></label>
            <input 
              name="ghanaCard"
              type="text" 
              required
              className="w-full flex h-12 rounded-xl border border-input bg-background/50 px-3 py-2 text-sm uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary backdrop-blur-sm transition-all font-mono" 
              placeholder="GHA-123456789-0"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Tell us about what you sell</label>
            <textarea 
              name="businessDescription"
              className="w-full min-h-[100px] flex rounded-xl border border-input bg-background/50 px-3 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary backdrop-blur-sm transition-all resize-y"
              placeholder="I specialize in importing home appliances and fashion items from 1688..."
            />
          </div>

          <div className="pt-4 border-t border-border/50">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full h-14 bg-gradient-to-r from-primary to-primary/80 hover:to-primary text-primary-foreground font-black text-lg rounded-xl shadow-xl shadow-primary/25 disabled:opacity-50 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {loading ? 'Submitting Application...' : 'Submit Application'}
            </button>
            <p className="text-xs text-center text-muted-foreground mt-4">
              By submitting this application, you agree to the C2G Importer Platform <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Profit Sharing Agreement</a>.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
