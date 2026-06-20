const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './apps/main/.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function init() {
  // 1. Create the order-screenshots bucket if it doesn't exist
  console.log('Checking for order-screenshots bucket...');
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  
  if (listError) {
    console.error('Error listing buckets:', listError);
  } else {
    const bucketExists = buckets.find(b => b.name === 'order-screenshots');
    if (!bucketExists) {
      console.log('Bucket not found. Creating order-screenshots bucket...');
      const { data, error } = await supabase.storage.createBucket('order-screenshots', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        fileSizeLimit: 5242880 // 5MB
      });
      if (error) {
        console.error('Error creating bucket:', error);
      } else {
        console.log('Bucket created successfully!');
      }
    } else {
      console.log('Bucket order-screenshots already exists.');
    }
  }

  // Check if we need to update the bucket to be public
  console.log('Updating bucket to public...');
  const { error: updateError } = await supabase.storage.updateBucket('order-screenshots', {
    public: true
  });
  if (updateError) {
    console.log('Update bucket error:', updateError);
  } else {
    console.log('Bucket set to public.');
  }

  console.log('Done!');
}

init();
