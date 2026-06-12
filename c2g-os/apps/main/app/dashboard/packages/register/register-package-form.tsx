'use client';

import { PackagePlus, Zap, Plane, Ship, Store, X } from "lucide-react";
import { useState } from "react";
import { registerPackages } from "../actions";
import { useRouter } from "next/navigation";

export default function RegisterPackageForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [trackingNumbers, setTrackingNumbers] = useState<string[]>(['']);

  const handleAddTracking = () => {
    setTrackingNumbers([...trackingNumbers, '']);
  };

  const handleRemoveTracking = (index: number) => {
    const newArr = [...trackingNumbers];
    newArr.splice(index, 1);
    setTrackingNumbers(newArr);
  };

  const handleTrackingChange = (index: number, value: string) => {
    const newArr = [...trackingNumbers];
    newArr[index] = value;
    setTrackingNumbers(newArr);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    
    // Ensure all tracking numbers are in form data
    formData.delete('tracking_numbers');
    trackingNumbers.forEach(t => {
      if (t.trim()) {
        formData.append('tracking_numbers', t.trim());
      }
    });

    try {
      await registerPackages(formData);
      router.push('/dashboard/packages?success=true');
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration.');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-md text-sm font-medium">
          {error}
        </div>
      )}

      {/* Tracking Number */}
      <div className="space-y-2">
        <label className="text-sm font-semibold flex items-center gap-2">
          <PackagePlus className="w-4 h-4 text-primary" />
          Chinese Tracking Number(s) <span className="text-destructive">*</span>
        </label>
        
        <div className="space-y-3">
          {trackingNumbers.map((tracking, index) => (
            <div key={index} className="flex items-center gap-2">
              <input 
                type="text" 
                value={tracking}
                onChange={(e) => handleTrackingChange(index, e.target.value)}
                placeholder="e.g., YT89938221123, 61-4-2992" 
                required
                className="flex h-11 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors backdrop-blur-sm"
              />
              {trackingNumbers.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => handleRemoveTracking(index)}
                  className="p-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-md transition-colors border border-transparent hover:border-destructive/20"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>

        <button 
          type="button"
          onClick={handleAddTracking}
          className="text-sm text-primary font-medium hover:underline mt-1"
        >
          + Add another tracking number
        </button>

        <div className="mt-2 bg-secondary/30 border border-border/50 rounded-lg p-3 text-xs text-muted-foreground space-y-1">
          <p><span className="font-semibold text-foreground">For Taobao:</span> Use the courier number.</p>
          <p><span className="font-semibold text-foreground">For 1688:</span> Use the 7-digit number in order details (e.g., 61-4-2992).</p>
        </div>
      </div>

      {/* Store / Supplier Name */}
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
          <Store className="w-4 h-4 text-muted-foreground" />
          Store / Supplier Name <span className="text-destructive">*</span>
        </label>
        <input 
          type="text" 
          name="store_name"
          placeholder="e.g., Guangzhou Electronics Store" 
          required 
          className="flex h-11 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors" 
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Item Description <span className="text-destructive">*</span></label>
        <textarea 
          name="description"
          rows={3}
          placeholder="e.g., 5 pairs of Nike Shoes, size 42" 
          required 
          className="flex w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors resize-none" 
        />
      </div>

      {/* Shipping Mode */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Shipping Mode <span className="text-destructive">*</span></label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="relative flex cursor-pointer rounded-xl border border-input bg-background/50 p-4 hover:bg-accent hover:text-accent-foreground has-[:checked]:border-primary has-[:checked]:bg-primary/5">
            <input type="radio" name="shipping_mode" value="express" className="peer sr-only" required />
            <div className="flex flex-col gap-1 w-full text-center items-center">
              <Zap className="w-5 h-5 text-orange-500 mb-1" />
              <span className="font-semibold text-sm">Air Express</span>
            </div>
          </label>
          <label className="relative flex cursor-pointer rounded-xl border border-input bg-background/50 p-4 hover:bg-accent hover:text-accent-foreground has-[:checked]:border-primary has-[:checked]:bg-primary/5">
            <input type="radio" name="shipping_mode" value="normal" className="peer sr-only" required />
            <div className="flex flex-col gap-1 w-full text-center items-center">
              <Plane className="w-5 h-5 text-blue-500 mb-1" />
              <span className="font-semibold text-sm">Air Normal</span>
            </div>
          </label>
          <label className="relative flex cursor-pointer rounded-xl border border-input bg-background/50 p-4 hover:bg-accent hover:text-accent-foreground has-[:checked]:border-primary has-[:checked]:bg-primary/5">
            <input type="radio" name="shipping_mode" value="sea" className="peer sr-only" required />
            <div className="flex flex-col gap-1 w-full text-center items-center">
              <Ship className="w-5 h-5 text-green-500 mb-1" />
              <span className="font-semibold text-sm">Sea Freight</span>
            </div>
          </label>
        </div>
      </div>

      {/* Submit */}
      <div className="pt-6 border-t border-border/50 flex justify-end gap-3">
        <button 
          type="button" 
          onClick={() => router.back()}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] h-11 px-8 shadow-lg shadow-primary/25 disabled:opacity-50 disabled:pointer-events-none"
        >
          {isSubmitting ? 'Registering...' : 'Register Package'}
        </button>
      </div>
    </form>
  );
}
