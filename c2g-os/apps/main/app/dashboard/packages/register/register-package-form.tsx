'use client';

import { PackagePlus, Zap, Plane, Ship, Store, X, Loader2 } from "lucide-react";
import { useState } from "react";
import { registerPackages } from "../actions";
import { useRouter } from "next/navigation";

export default function RegisterPackageForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [trackingNumbers, setTrackingNumbers] = useState<string[]>(['']);
  const [imageFiles, setImageFiles] = useState<Record<number, File>>({});
  const [imagePreviews, setImagePreviews] = useState<Record<number, string>>({});

  const handleAddTracking = () => {
    setTrackingNumbers([...trackingNumbers, '']);
  };

  const handleRemoveTracking = (index: number) => {
    const newArr = [...trackingNumbers];
    newArr.splice(index, 1);
    setTrackingNumbers(newArr);

    const newFiles = { ...imageFiles };
    delete newFiles[index];
    setImageFiles(newFiles);

    const newPreviews = { ...imagePreviews };
    delete newPreviews[index];
    setImagePreviews(newPreviews);
  };

  const handleTrackingChange = (index: number, value: string) => {
    const newArr = [...trackingNumbers];
    newArr[index] = value;
    setTrackingNumbers(newArr);
  };

  const handleImageChange = (index: number, file: File | null) => {
    if (!file) return;
    setImageFiles(prev => ({ ...prev, [index]: file }));
    setImagePreviews(prev => ({ ...prev, [index]: URL.createObjectURL(file) }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Validate images
    for (let i = 0; i < trackingNumbers.length; i++) {
      const tracking = trackingNumbers[i];
      if (tracking && tracking.trim() && !imageFiles[i]) {
        setError(`Please provide an image for tracking number ${i + 1}`);
        setIsSubmitting(false);
        return;
      }
    }

    const formData = new FormData(e.currentTarget);
    
    // Ensure all tracking numbers are in form data
    formData.delete('tracking_numbers');
    trackingNumbers.forEach(t => {
      if (t.trim()) {
        formData.append('tracking_numbers', t.trim());
      }
    });

    try {
      // Upload images
      const imageUrls: string[] = [];
      for (let i = 0; i < trackingNumbers.length; i++) {
        if (trackingNumbers[i]?.trim()) {
          const file = imageFiles[i];
          if (!file) continue;
          const uploadData = new FormData();
          uploadData.append("file", file);
          uploadData.append("intent", "package_registration");

          const res = await fetch("/api/upload", {
            method: "POST",
            body: uploadData,
          });

          if (!res.ok) {
            throw new Error(`Failed to upload image for package ${i + 1}`);
          }

          const data = await res.json();
          imageUrls.push(data.url);
          formData.append('image_urls', data.url);
        }
      }
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
            <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-secondary/10 p-3 rounded-lg border border-border/50">
              <div className="w-full sm:w-24 h-24 shrink-0 rounded-md overflow-hidden bg-black/20 border border-border/50 flex items-center justify-center relative group">
                {imagePreviews[index] ? (
                  <img src={imagePreviews[index]} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-muted-foreground/50">
                    <Zap className="w-6 h-6 mb-1 opacity-50" />
                    <span className="text-[10px] font-bold">IMAGE</span>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => handleImageChange(index, e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="absolute inset-0 bg-black/50 items-center justify-center hidden group-hover:flex transition-all pointer-events-none">
                  <span className="text-white text-xs font-bold">Change</span>
                </div>
              </div>
              <div className="flex-1 w-full flex items-center gap-2">
                <input 
                  type="text" 
                  value={tracking}
                  onChange={(e) => handleTrackingChange(index, e.target.value)}
                  placeholder="e.g., YT89938221123" 
                  required
                  className="flex h-12 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors backdrop-blur-sm"
                />
                {trackingNumbers.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => handleRemoveTracking(index)}
                    className="p-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-md transition-colors border border-transparent hover:border-destructive/20 h-12 flex items-center justify-center shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
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

      {/* Shipping Method */}
      <div className="space-y-3 pt-4 border-t border-border/50">
        <label className="text-sm font-medium">Shipping Method</label>
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-400">
          <p className="text-sm leading-relaxed">
            You don't need to select a shipping method during package registration. After your package arrives at our China warehouse, you'll be able to choose your preferred shipping method from the <strong>Reservations</strong> page before shipment to Ghana.
          </p>
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
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Registering...
            </>
          ) : 'Register Package'}
        </button>
      </div>
    </form>
  );
}
