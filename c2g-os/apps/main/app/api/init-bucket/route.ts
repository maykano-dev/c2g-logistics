import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  let logs: string[] = [];

  try {
    // 1. Create the order-screenshots bucket if it doesn't exist
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      logs.push(`Error listing buckets: ${listError.message}`);
    } else {
      const bucketExists = buckets.find(b => b.name === 'order-screenshots');
      if (!bucketExists) {
        logs.push('Bucket not found. Creating order-screenshots bucket...');
        const { error } = await supabase.storage.createBucket('order-screenshots', {
          public: true,
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
          fileSizeLimit: 5242880 // 5MB
        });
        if (error) {
          logs.push(`Error creating bucket: ${error.message}`);
        } else {
          logs.push('Bucket created successfully!');
        }
      } else {
        logs.push('Bucket order-screenshots already exists.');
      }
    }

    // Ensure it's public
    const { error: updateError } = await supabase.storage.updateBucket('order-screenshots', {
      public: true
    });
    if (updateError) {
      logs.push(`Update bucket error: ${updateError.message}`);
    } else {
      logs.push('Bucket set to public.');
    }

    return NextResponse.json({ success: true, logs });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message, logs });
  }
}
