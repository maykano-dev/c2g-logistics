/**
 * Image Abstraction Layer for C2G Mall.
 *
 * Uploads images directly to Supabase Storage (order-screenshots bucket).
 * Images are automatically compressed to WebP using sharp before upload,
 * reducing file sizes by 60-80% while maintaining visual quality.
 */

import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const BUCKET = 'order-screenshots';

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  id?: string;
  error?: string;
}

/**
 * Compresses an image buffer to WebP using sharp.
 * - Resizes to max 1920px wide (preserving aspect ratio, no upscaling)
 * - Converts to WebP at 85% quality — visually lossless but much smaller
 * - Auto-corrects EXIF orientation (fixes sideways phone photos)
 */
async function compressImage(buffer: Buffer): Promise<{ data: Buffer; ext: string }> {
  try {
    const compressed = await sharp(buffer)
      .rotate()                                        // auto-correct EXIF rotation
      .resize({ width: 1920, withoutEnlargement: true }) // cap width, keep aspect ratio
      .webp({ quality: 85 })                           // convert to WebP, high quality
      .toBuffer();
    return { data: compressed, ext: 'webp' };
  } catch (e) {
    // If sharp fails for any reason, fall back to the raw buffer
    console.warn('[Image Service] Compression failed, uploading original:', e);
    return { data: buffer, ext: 'jpg' };
  }
}

/**
 * Uploads an image buffer to Supabase Storage.
 * Automatically compresses to WebP before upload.
 */
export async function uploadImage(fileBuffer: Buffer, fileName: string): Promise<ImageUploadResult> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return { success: false, error: 'Supabase configuration missing' };
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Compress before uploading
    const { data: compressedBuffer, ext } = await compressImage(fileBuffer);

    // Unique path to prevent collisions
    const uniqueId = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const filePath = `uploads/${uniqueId}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, compressedBuffer, {
        contentType: ext === 'webp' ? 'image/webp' : 'image/jpeg',
        upsert: false,
      });

    if (uploadError) {
      console.error('Supabase storage upload error:', uploadError);
      return { success: false, error: uploadError.message };
    }

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(filePath);

    return {
      success: true,
      url: urlData.publicUrl,
      id: filePath,
    };
  } catch (error: any) {
    console.error('Error in uploadImage:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Deletes an image from Supabase Storage.
 */
export async function deleteImage(imageIdOrUrl: string): Promise<boolean> {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    let filePath = imageIdOrUrl;
    if (imageIdOrUrl.startsWith('http')) {
      const url = new URL(imageIdOrUrl);
      const parts = url.pathname.split(`/${BUCKET}/`);
      if (parts.length > 1) filePath = parts[1] as string;
      else return true;
    }
    const { error } = await supabase.storage.from(BUCKET).remove([filePath]);
    if (error) console.error('[Image Service] Delete error:', error.message);
    return !error;
  } catch (e) {
    console.error('[Image Service] deleteImage exception:', e);
    return false;
  }
}

/**
 * Returns the public URL for an image path.
 */
export function getImageUrl(pathOrUrl: string): string {
  return pathOrUrl;
}

/**
 * No-op move placeholder for future S3/R2 migration.
 */
export async function moveImage(sourceIdOrUrl: string, destinationPath: string): Promise<boolean> {
  console.log(`[Image Service] moveImage: ${sourceIdOrUrl} -> ${destinationPath}`);
  return true;
}
