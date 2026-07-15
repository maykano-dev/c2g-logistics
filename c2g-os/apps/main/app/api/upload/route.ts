import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

const BUCKET = 'order-screenshots';

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

    // Upload directly to Supabase Storage using the service-role key
    const serviceSupabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const uniqueId = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const filePath = `uploads/${uniqueId}.${ext}`;

    const { error: uploadError } = await serviceSupabase.storage
      .from(BUCKET)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Supabase Storage upload error:', uploadError.message);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: urlData } = serviceSupabase.storage.from(BUCKET).getPublicUrl(filePath);

    return NextResponse.json({ 
      success: true, 
      url: urlData.publicUrl,
      id: filePath
    });

  } catch (error: any) {
    console.error("Upload API error:", error?.message || error);
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
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

    // 2. Delete from Supabase Storage
    const serviceSupabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    let filePath = imageIdOrUrl;
    if (imageIdOrUrl.startsWith('http')) {
      const parts = imageIdOrUrl.split(`/${BUCKET}/`);
      filePath = parts.length > 1 ? (parts[1] || '') : '';
    }

    if (filePath) {
      const { error: delError } = await serviceSupabase.storage.from(BUCKET).remove([filePath]);
      if (delError) console.error('Storage delete error:', delError.message);
    }

    return NextResponse.json({ success: true, message: "Image deleted successfully" });
  } catch (error: any) {
    console.error("Delete API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
