'use client';

import { useState } from 'react';
import { submitImporterRegistration } from './actions';
import { useRouter } from 'next/navigation';
import { Store, Loader2, CheckCircle2, AlertCircle, ChevronRight, ChevronLeft, Upload, Briefcase, FileCheck, CreditCard, ShoppingBag, ScrollText } from 'lucide-react';
import { PhoneInput } from '../../../components/phone-input';
import Image from 'next/image';
import Link from 'next/link';

const STEPS = [
  { id: 1, name: 'Basic Info', icon: Store },
  { id: 2, name: 'Business', icon: Briefcase },
  { id: 3, name: 'Verification', icon: FileCheck },
  { id: 4, name: 'Payout', icon: CreditCard },
  { id: 5, name: 'Experience', icon: ShoppingBag },
  { id: 6, name: 'Agreements', icon: ScrollText },
];

export default function ImporterRegisterClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', whatsapp: '', password: '',
    storeName: '', storeSlug: '', businessDescription: '',
    idType: 'Ghana Card', idNumber: '',
    payoutMethod: 'Mobile Money', momoNetwork: 'MTN', momoNumber: '', momoName: '', bankName: '', bankAccount: '', bankAccountName: '',
    experience: 'Less than 6 months', sourcingPlatforms: [] as string[], categories: [] as string[], estimatedOrders: '1 - 20',
    agreeFraud: false, agreePayout: false, agreeTerms: false, agreePrivacy: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setFormData(prev => ({ ...prev, storeSlug: val }));
  };

  const handleMultiSelect = (name: 'sourcingPlatforms' | 'categories', value: string) => {
    setFormData(prev => {
      const current = prev[name];
      if (current.includes(value)) {
        return { ...prev, [name]: current.filter(item => item !== value) };
      } else {
        return { ...prev, [name]: [...current, value] };
      }
    });
  };

  const nextStep = () => setCurrentStep(p => Math.min(p + 1, 6));
  const prevStep = () => setCurrentStep(p => Math.max(p - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 6) {
      nextStep();
      return;
    }

    setLoading(true);
    setError(null);

    const formPayload = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      formPayload.append(key, Array.isArray(val) ? JSON.stringify(val) : String(val));
    });

    try {
      const res = await submitImporterRegistration(formPayload);
      if (res.success) {
        setSuccess(true);
      } else {
        setError(res.error || 'Registration failed.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
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
          Your importer account is currently <strong className="text-foreground">Pending Verification</strong>. Our team will review your application and contact you on WhatsApp shortly.
        </p>
        <button 
          onClick={() => router.push('/importers/login')}
          className="inline-flex items-center justify-center rounded-xl bg-primary px-8 py-3 text-sm font-bold text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="mb-6 relative z-10 flex flex-col items-center text-center">
        <h2 className="text-2xl font-bold tracking-tight mb-2">Apply as Importer</h2>
        <p className="text-sm font-medium">
          Already have an account?{" "}
          <Link href="/importers/login" className="text-primary hover:text-primary/80 transition-colors font-bold underline underline-offset-4">
            Log in here
          </Link>
        </p>
      </div>

      {/* Step Indicator */}
      <div className="mb-8 flex items-center justify-between relative">
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-border/50 z-0 rounded-full" />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary z-0 rounded-full transition-all duration-300" style={{ width: `${((currentStep - 1) / 5) * 100}%` }} />
        
        {STEPS.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          
          return (
            <div key={step.id} className={`relative z-10 flex flex-col items-center gap-2 ${isActive ? 'text-primary' : isCompleted ? 'text-primary' : 'text-muted-foreground/50'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${isActive ? 'bg-primary text-primary-foreground shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-110' : isCompleted ? 'bg-primary text-primary-foreground' : 'bg-secondary border border-border'}`}>
                {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
              </div>
              <span className="text-[10px] sm:text-xs font-semibold hidden sm:block uppercase tracking-wider">{step.name}</span>
            </div>
          );
        })}
      </div>

      <div className="glass-panel p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Subtle top highlight */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-blue-500 to-primary opacity-50" />

        {error && (
          <div className="p-4 rounded-xl bg-destructive/10 text-destructive border border-destructive/30 text-sm mb-6 flex items-start gap-3 animate-shake">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="mt-0.5 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative z-10">
          
          {/* STEP 1: BASIC INFO */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Store className="w-5 h-5 text-primary" /> Basic Account Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Full Name <span className="text-destructive">*</span></label>
                  <input type="text" name="fullName" required value={formData.fullName} onChange={handleInputChange} className="w-full flex h-12 rounded-xl border border-input bg-background/50 px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-primary" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Email Address <span className="text-destructive">*</span></label>
                  <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full flex h-12 rounded-xl border border-input bg-background/50 px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-primary" placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Phone Number <span className="text-destructive">*</span></label>
                  <PhoneInput name="phone" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">WhatsApp Number <span className="text-destructive">*</span></label>
                  <PhoneInput name="whatsapp" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Password <span className="text-destructive">*</span></label>
                  <input type="password" name="password" required value={formData.password} onChange={handleInputChange} className="w-full flex h-12 rounded-xl border border-input bg-background/50 px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-primary" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Profile Photo (Optional)</label>
                  <div className="flex h-12 items-center justify-center w-full rounded-xl border border-dashed border-input bg-background/30 hover:bg-background/50 cursor-pointer transition-colors text-sm text-muted-foreground">
                    <Upload className="w-4 h-4 mr-2" /> Upload Photo
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: BUSINESS INFO */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Briefcase className="w-5 h-5 text-primary" /> Business Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Store Name <span className="text-destructive">*</span></label>
                  <input type="text" name="storeName" required value={formData.storeName} onChange={handleInputChange} className="w-full flex h-12 rounded-xl border border-input bg-background/50 px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-primary" placeholder="e.g. Abena Imports" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Store Username <span className="text-destructive">*</span></label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs text-muted-foreground font-mono">c2g.com/store/</span>
                    <input type="text" name="storeSlug" required value={formData.storeSlug} onChange={handleSlugChange} className="w-full flex h-12 rounded-xl border border-input bg-background/50 pl-[105px] pr-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-primary font-mono text-primary" placeholder="abena-imports" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-semibold">Business Description <span className="text-destructive">*</span></label>
                  <span className="text-xs text-muted-foreground">{formData.businessDescription.length}/250</span>
                </div>
                <textarea name="businessDescription" required maxLength={250} value={formData.businessDescription} onChange={handleInputChange} className="w-full min-h-[100px] flex rounded-xl border border-input bg-background/50 px-3 py-3 text-sm focus-visible:ring-2 focus-visible:ring-primary resize-y" placeholder="We import fashion accessories, shoes and beauty products from China." />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Store Logo (Optional)</label>
                  <div className="flex h-12 items-center justify-center w-full rounded-xl border border-dashed border-input bg-background/30 hover:bg-background/50 cursor-pointer text-sm text-muted-foreground">
                    <Upload className="w-4 h-4 mr-2" /> Upload Logo
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Store Banner (Optional)</label>
                  <div className="flex h-12 items-center justify-center w-full rounded-xl border border-dashed border-input bg-background/30 hover:bg-background/50 cursor-pointer text-sm text-muted-foreground">
                    <Upload className="w-4 h-4 mr-2" /> Upload Banner
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: VERIFICATION */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2"><FileCheck className="w-5 h-5 text-primary" /> Identity Verification</h2>
                <p className="text-sm text-muted-foreground mt-1">This dramatically reduces fraud and protects our ecosystem.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">ID Type <span className="text-destructive">*</span></label>
                  <select name="idType" value={formData.idType} onChange={handleInputChange} className="w-full h-12 rounded-xl border border-input bg-background/50 px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-primary">
                    <option>Ghana Card</option>
                    <option>Passport</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">ID Number <span className="text-destructive">*</span></label>
                  <input type="text" name="idNumber" required value={formData.idNumber} onChange={handleInputChange} className="w-full flex h-12 rounded-xl border border-input bg-background/50 px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-primary uppercase font-mono" placeholder="GHA-123456789-0" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">ID Front <span className="text-destructive">*</span></label>
                  <div className="flex h-24 items-center justify-center w-full rounded-xl border border-dashed border-primary/50 bg-primary/5 cursor-pointer text-sm text-primary hover:bg-primary/10 transition-colors">
                    <div className="text-center"><Upload className="w-5 h-5 mx-auto mb-1" /> Upload Front</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">ID Back <span className="text-destructive">*</span></label>
                  <div className="flex h-24 items-center justify-center w-full rounded-xl border border-dashed border-primary/50 bg-primary/5 cursor-pointer text-sm text-primary hover:bg-primary/10 transition-colors">
                    <div className="text-center"><Upload className="w-5 h-5 mx-auto mb-1" /> Upload Back</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <label className="text-sm font-semibold">Selfie Verification <span className="text-destructive">*</span></label>
                <p className="text-xs text-muted-foreground mb-2">Take a selfie holding your ID next to your face.</p>
                <div className="flex h-32 items-center justify-center w-full rounded-xl border border-dashed border-blue-500/50 bg-blue-500/5 cursor-pointer text-sm text-blue-500 hover:bg-blue-500/10 transition-colors">
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-2"><CheckCircle2 className="w-5 h-5" /></div>
                    Upload Selfie
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: PAYOUT */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div className="mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2"><CreditCard className="w-5 h-5 text-primary" /> Payout Information</h2>
                <p className="text-sm text-muted-foreground mt-1">Where should we send your profits?</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold">Preferred Payout Method <span className="text-destructive">*</span></label>
                <div className="flex gap-4">
                  <label className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border cursor-pointer transition-colors ${formData.payoutMethod === 'Mobile Money' ? 'border-primary bg-primary/10 text-primary font-bold' : 'border-input bg-background/50 hover:bg-secondary'}`}>
                    <input type="radio" name="payoutMethod" value="Mobile Money" checked={formData.payoutMethod === 'Mobile Money'} onChange={handleInputChange} className="sr-only" />
                    Mobile Money
                  </label>
                  <label className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border cursor-pointer transition-colors ${formData.payoutMethod === 'Bank Account' ? 'border-primary bg-primary/10 text-primary font-bold' : 'border-input bg-background/50 hover:bg-secondary'}`}>
                    <input type="radio" name="payoutMethod" value="Bank Account" checked={formData.payoutMethod === 'Bank Account'} onChange={handleInputChange} className="sr-only" />
                    Bank Account
                  </label>
                </div>
              </div>

              {formData.payoutMethod === 'Mobile Money' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 animate-fade-in">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Network <span className="text-destructive">*</span></label>
                    <select name="momoNetwork" value={formData.momoNetwork} onChange={handleInputChange} className="w-full h-12 rounded-xl border border-input bg-background/50 px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-primary">
                      <option>MTN</option>
                      <option>Telecel (Vodafone)</option>
                      <option>AT (AirtelTigo)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">MoMo Number <span className="text-destructive">*</span></label>
                    <PhoneInput name="momoNumber" required />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold">Account Name <span className="text-destructive">*</span></label>
                    <input type="text" name="momoName" value={formData.momoName} onChange={handleInputChange} className="w-full h-12 rounded-xl border border-input bg-background/50 px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-primary" placeholder="Name registered to MoMo" />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 animate-fade-in">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Bank Name <span className="text-destructive">*</span></label>
                    <input type="text" name="bankName" value={formData.bankName} onChange={handleInputChange} className="w-full h-12 rounded-xl border border-input bg-background/50 px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-primary" placeholder="e.g. Ecobank" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Account Number <span className="text-destructive">*</span></label>
                    <input type="text" name="bankAccount" value={formData.bankAccount} onChange={handleInputChange} className="w-full h-12 rounded-xl border border-input bg-background/50 px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-primary" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold">Account Name <span className="text-destructive">*</span></label>
                    <input type="text" name="bankAccountName" value={formData.bankAccountName} onChange={handleInputChange} className="w-full h-12 rounded-xl border border-input bg-background/50 px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-primary" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: EXPERIENCE */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-fade-in">
              <div className="mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2"><ShoppingBag className="w-5 h-5 text-primary" /> Importer Information</h2>
                <p className="text-sm text-muted-foreground mt-1">This helps C2G understand who they're approving.</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold">How long have you been importing? <span className="text-destructive">*</span></label>
                <select name="experience" value={formData.experience} onChange={handleInputChange} className="w-full h-12 rounded-xl border border-input bg-background/50 px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-primary">
                  <option>Less than 6 months</option>
                  <option>6 months - 1 year</option>
                  <option>1 - 3 years</option>
                  <option>3+ years</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Where do you source from? <span className="text-destructive">*</span></label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {['1688', 'Taobao', 'Pinduoduo', 'Alibaba', 'Weidian', 'Other'].map(src => (
                    <label key={src} className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${formData.sourcingPlatforms.includes(src) ? 'border-primary bg-primary/10 text-primary font-bold' : 'border-input bg-background/50 hover:bg-secondary'}`}>
                      <input type="checkbox" checked={formData.sourcingPlatforms.includes(src)} onChange={() => handleMultiSelect('sourcingPlatforms', src)} className="rounded border-input text-primary focus:ring-primary" />
                      <span className="text-sm">{src}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Product Categories <span className="text-destructive">*</span></label>
                <div className="flex flex-wrap gap-2">
                  {['Fashion', 'Electronics', 'Beauty', 'Home', 'Kids', 'Automotive', 'Tools', 'Business Supplies'].map(cat => (
                    <button type="button" key={cat} onClick={() => handleMultiSelect('categories', cat)} className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${formData.categories.includes(cat) ? 'border-primary bg-primary text-primary-foreground' : 'border-input bg-background/50 hover:bg-secondary text-foreground'}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Estimated Monthly Orders <span className="text-destructive">*</span></label>
                <select name="estimatedOrders" value={formData.estimatedOrders} onChange={handleInputChange} className="w-full h-12 rounded-xl border border-input bg-background/50 px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-primary">
                  <option>1 - 20</option>
                  <option>21 - 50</option>
                  <option>51 - 100</option>
                  <option>100+</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 6: AGREEMENTS */}
          {currentStep === 6 && (
            <div className="space-y-6 animate-fade-in">
              <div className="mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2"><ScrollText className="w-5 h-5 text-primary" /> Terms &amp; Agreements</h2>
                <p className="text-sm text-muted-foreground mt-1">Please review and agree to our platform rules.</p>
              </div>
              
              <div className="space-y-4 bg-secondary/30 p-6 rounded-2xl border border-border/50">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="mt-1 flex items-center justify-center">
                    <input type="checkbox" name="agreeFraud" required checked={formData.agreeFraud} onChange={handleInputChange} className="w-5 h-5 rounded border-input text-primary focus:ring-primary bg-background" />
                  </div>
                  <span className="text-sm group-hover:text-foreground transition-colors">I understand that C2G may suspend accounts involved in fraud or selling counterfeit goods.</span>
                </label>
                
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="mt-1 flex items-center justify-center">
                    <input type="checkbox" name="agreePayout" required checked={formData.agreePayout} onChange={handleInputChange} className="w-5 h-5 rounded border-input text-primary focus:ring-primary bg-background" />
                  </div>
                  <span className="text-sm group-hover:text-foreground transition-colors">I understand that payout requests are processed according to C2G standard processing timelines.</span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="mt-1 flex items-center justify-center">
                    <input type="checkbox" name="agreeTerms" required checked={formData.agreeTerms} onChange={handleInputChange} className="w-5 h-5 rounded border-input text-primary focus:ring-primary bg-background" />
                  </div>
                  <span className="text-sm group-hover:text-foreground transition-colors">I agree to the <a href="#" className="text-primary hover:underline font-semibold">C2G Terms and Conditions</a>.</span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="mt-1 flex items-center justify-center">
                    <input type="checkbox" name="agreePrivacy" required checked={formData.agreePrivacy} onChange={handleInputChange} className="w-5 h-5 rounded border-input text-primary focus:ring-primary bg-background" />
                  </div>
                  <span className="text-sm group-hover:text-foreground transition-colors">I agree to the <a href="#" className="text-primary hover:underline font-semibold">C2G Privacy Policy</a>.</span>
                </label>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="pt-8 mt-8 border-t border-border/50 flex items-center justify-between">
            {currentStep > 1 ? (
              <button type="button" onClick={prevStep} className="px-6 py-3 rounded-xl font-semibold border border-input hover:bg-secondary transition-colors flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            ) : <div />}

            {currentStep < 6 ? (
              <button type="submit" className="px-8 py-3 rounded-xl font-bold bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors flex items-center gap-2 ml-auto">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button type="submit" disabled={loading || !formData.agreeFraud || !formData.agreePayout || !formData.agreeTerms || !formData.agreePrivacy} className="px-10 py-3 bg-gradient-to-r from-blue-600 to-primary hover:to-blue-600 text-white font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.4)] disabled:opacity-50 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 ml-auto">
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
