'use client';

import { Store, Camera, Loader2, PackagePlus } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updatePackageFull } from "../../actions";

export default function EditPackageForm({ packageData }: { packageData: any }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Existing items_description is formatted as "Store Name: Description"
  let initialStoreName = '';
  let initialDescription = packageData.items_description || '';
  if (packageData.items_description?.includes(':')) {
    const parts = packageData.items_description.split(':');
    initialStoreName = parts[0].trim();
    initialDescription = parts.slice(1).join(':').trim();
  }

  const [trackingNumber, setTrackingNumber] = useState(packageData.tracking_number || '');
  const [storeName, setStoreName] = useState(initialStoreName);
  const [description, setDescription] = useState(initialDescription);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(packageData.image_url || '');

  const handleImageChange = (file: File | null) => {
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formData = new FormData();
    formData.append('id', packageData.id);
    formData.append('tracking_number', trackingNumber);
    formData.append('store_name', storeName);
    formData.append('description', description);
    
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      await updatePackageFull(formData);
      router.push('/dashboard/packages?success=true');
    } catch (err: any) {
      setError(err.message || 'An error occurred during update.');
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

      <div className="space-y-3">
        <label className="text-sm font-semibold flex items-center gap-2">
          <PackagePlus className="w-4 h-4 text-primary" />
          Chinese Tracking Number <span className="text-destructive">*</span>
        </label>

        <div className="rounded-2xl border border-border/60 bg-secondary/10 overflow-hidden shadow-sm">
          {/* Image upload */}
          <div className="relative w-full aspect-video sm:aspect-auto sm:h-44 bg-black/30 overflow-hidden group cursor-pointer select-none">
            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
                  alt="Package preview"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-white text-sm font-bold tracking-wide">Change Photo</span>
                </div>
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[11px] font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Photo Added
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-dashed border-primary/40 flex items-center justify-center">
                  <Camera className="w-7 h-7 text-primary/60" />
                </div>
                <div className="text-center px-4">
                  <p className="text-sm font-semibold text-foreground/80">Tap to add photo</p>
                  <p className="text-xs text-muted-foreground mt-0.5">JPEG, PNG or WebP</p>
                </div>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
          </div>

          <div className="p-3">
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="e.g., YT89938221123"
              required
              className="flex h-11 w-full rounded-xl border border-input bg-background/60 px-3 py-2 text-sm font-mono ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
          <Store className="w-4 h-4 text-muted-foreground" />
          Store / Supplier Name <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          placeholder="e.g., Guangzhou Electronics Store"
          required
          className="flex h-11 w-full rounded-xl border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Item Description <span className="text-destructive">*</span></label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="e.g., 5 pairs of Nike Shoes, size 42"
          required
          className="flex w-full rounded-xl border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors resize-none"
        />
      </div>

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
              Saving...
            </>
          ) : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
