import { NextRequest, NextResponse } from "next/server";
import { uploadImage, deleteImage } from "@/utils/image-service";
import { createClient } from "@/utils/supabase/server";

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Simple magic byte checker for basic image formats
function checkMagicBytes(buffer: Buffer): boolean {
  if (buffer.length < 4) return false;
  const hex = buffer.toString('hex', 0, 4).toUpperCase();
  
  // JPEG: FFD8FF
  if (hex.startsWith('FFD8FF')) return true;
  // PNG: 89504E47
  if (hex.startsWith('89504E47')) return true;
  // WEBP: RIFF...WEBP
  if (hex.startsWith('52494646')) return true; // RIFF
  // GIF: 47494638
  if (hex.startsWith('47494638')) return true;

  return false;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Auth check
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const intent = formData.get("intent") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!authData?.user && intent !== 'registration') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. MIME type check
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed." }, { status: 400 });
    }

    // 3. File size check
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large. Maximum size is 5MB." }, { status: 400 });
    }

    // Convert Next.js File to Node.js Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // 4. Magic bytes check (defense against disguised executables)
    if (!checkMagicBytes(buffer)) {
      return NextResponse.json({ error: "Invalid file content." }, { status: 400 });
    }

    // Upload using our Image Abstraction Layer (which handles WebP conversion + ImgBB upload)
    const result = await uploadImage(buffer, file.name);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      url: result.url,
      id: result.id 
    });

  } catch (error: any) {
    console.error("Upload API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // 1. Auth check
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();

    if (!authData?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const imageIdOrUrl = searchParams.get("id") || searchParams.get("url");

    if (!imageIdOrUrl) {
      return NextResponse.json({ error: "No image ID or URL provided" }, { status: 400 });
    }

    // 2. Call image abstraction layer
    const result = await deleteImage(imageIdOrUrl);

    if (!result) {
      return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Image deleted successfully" });
  } catch (error: any) {
    console.error("Delete API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
