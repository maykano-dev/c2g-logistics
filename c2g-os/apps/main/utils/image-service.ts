import sharp from 'sharp';

/**
 * Image Abstraction Layer for C2G Mall.
 * 
 * All image operations strictly route through this service.
 * Currently uses ImgBB as the underlying storage provider, but is designed 
 * so it can be swapped out seamlessly for MinIO or Cloudflare R2 in the future.
 */

const IMGBB_API_KEY = process.env.IMGBB_API_KEY;

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  id?: string;
  error?: string;
}

/**
 * Uploads an image. If a buffer is provided, it is first compressed 
 * to a lightweight WebP format on the backend before being sent to the storage provider.
 */
export async function uploadImage(fileBuffer: Buffer, fileName: string): Promise<ImageUploadResult> {
  if (!IMGBB_API_KEY) {
    console.error("Missing IMGBB_API_KEY");
    return { success: false, error: "Storage provider configuration missing. Add IMGBB_API_KEY to your .env" };
  }

  try {
    // 1. Backend Processing: Convert any image format to highly-optimized WebP
    // This reduces a 2MB image down to roughly ~200KB or less without visible quality loss.
    const optimizedBuffer = await sharp(fileBuffer)
      .webp({ quality: 80, effort: 6 })
      .resize({ width: 1200, withoutEnlargement: true }) // Max width 1200px
      .toBuffer();

    // 2. Upload to Storage Provider (ImgBB)
    const base64Image = optimizedBuffer.toString('base64');
    
    const formData = new FormData();
    formData.append('key', IMGBB_API_KEY);
    formData.append('image', base64Image);
    formData.append('name', fileName.replace(/\.[^/.]+$/, "") + ".webp");

    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      return {
        success: true,
        url: data.data.url, // URL of the uploaded WebP image
        id: data.data.id,
      };
    } else {
      console.error("ImgBB Upload Error:", data);
      return { success: false, error: data.error?.message || "Upload failed" };
    }
  } catch (error: any) {
    console.error("Error in uploadImage:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Deletes an image from the storage provider.
 * Note: ImgBB's API does not actually support deleting images via API unless using a specific user token,
 * but this abstraction function ensures future-proofing when migrating to S3/R2/MinIO.
 */
export async function deleteImage(imageIdOrUrl: string): Promise<boolean> {
  // TODO: Implement deletion when migrating to a provider that fully supports it.
  // For now, this is a no-op placeholder to fulfill the abstraction contract.
  console.log(`[Image Abstraction] deleteImage called for ${imageIdOrUrl}`);
  return true; 
}

/**
 * Retrieves the public URL for an image.
 * For direct-link providers like ImgBB/Cloudflare R2, this often just returns the URL.
 * For private buckets, this could generate a signed URL.
 */
export function getImageUrl(pathOrUrl: string): string {
  // If we ever move to private buckets, signed URL generation logic goes here.
  return pathOrUrl;
}

/**
 * Moves or renames an image within the storage provider.
 * S3/MinIO/R2 equivalent of "CopyObject" then "DeleteObject".
 */
export async function moveImage(sourceIdOrUrl: string, destinationPath: string): Promise<boolean> {
  // TODO: Implement move when migrating to S3/R2/MinIO.
  console.log(`[Image Abstraction] moveImage called to move ${sourceIdOrUrl} to ${destinationPath}`);
  return true;
}
