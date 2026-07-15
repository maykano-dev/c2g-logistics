'use client';

import { PackagePlus, ImageIcon, Store, X, Loader2, Camera } from "lucide-react";
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
    
    formData.delete('tracking_numbers');
    trackingNumbers.forEach(t => {
      if (t.trim()) formData.append('tracking_numbers', t.trim());
    });

    try {
      // Append image files directly — server action handles upload
      for (let i = 0; i < trackingNumbers.length; i++) {
        const file = imageFiles[i];
        if (trackingNumbers[i]?.trim() && file) {
          formData.append(`image_${i}`, file);
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
        <div className="p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {/* Tracking Numbers + Images */}
      <div className="space-y-3">
        <label className="text-sm font-semibold flex items-center gap-2">
          <PackagePlus className="w-4 h-4 text-primary" />
          Chinese Tracking Number(s) <span className="text-destructive">*</span>
        </label>

        <div className="space-y-4">
          {trackingNumbers.map((tracking, index) => (
            <div key={index} className="rounded-2xl border border-border/60 bg-secondary/10 overflow-hidden shadow-sm">

              {/* Image upload — full-width, prominent */}
              <div className="relative w-full aspect-video sm:aspect-auto sm:h-44 bg-black/30 overflow-hidden group cursor-pointer select-none">
                {imagePreviews[index] ? (
                  <>
                    <img
                      src={imagePreviews[index]}
                      alt="Package preview"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                    {/* Tap-to-change overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-white text-sm font-bold tracking-wide">Change Photo</span>
                    </div>
                    {/* "Photo added" pill */}
                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[11px] font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Photo added
                    </div>
                    {/* Package number label */}
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                      Package #{index + 1}
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-dashed border-primary/40 flex items-center justify-center">
                      <Camera className="w-7 h-7 text-primary/60" />
                    </div>
                    <div className="text-center px-4">
                      <p className="text-sm font-semibold text-foreground/80">Tap to add photo</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Package #{index + 1} · JPEG, PNG or WebP</p>
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(index, e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
              </div>

              {/* Tracking number input + remove button */}
              <div className="flex items-center gap-2 p-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={tracking}
                    onChange={(e) => handleTrackingChange(index, e.target.value)}
                    placeholder="e.g., YT89938221123"
                    required
                    className="flex h-11 w-full rounded-xl border border-input bg-background/60 px-3 py-2 text-sm font-mono ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
                  />
                </div>
                {trackingNumbers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveTracking(index)}
                    className="p-2.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-xl transition-colors border border-transparent hover:border-destructive/20 shrink-0"
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
          className="text-sm text-primary font-semibold hover:underline mt-1 flex items-center gap-1"
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
          className="flex h-11 w-full rounded-xl border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
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
          className="flex w-full rounded-xl border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors resize-none"
        />
      </div>

      {/* Shipping Method info */}
      <div className="space-y-3 pt-4 border-t border-border/50">
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-400">
          <p className="text-sm leading-relaxed">
            You don&apos;t need to select a shipping method during package registration. After your package arrives at our China warehouse, you&apos;ll be able to choose your preferred shipping method from the <strong>Reservations</strong> page before shipment to Ghana.
          </p>
        </div>
      </div>

      {/* Submit */}
      <div className="pt-4 border-t border-border/50 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] h-11 px-8 shadow-lg shadow-primary/25 disabled:opacity-50 disabled:pointer-events-none"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Registering...
            </>
          ) : 'Save Registration'}
        </button>
      </div>
    </form>
  );
}
