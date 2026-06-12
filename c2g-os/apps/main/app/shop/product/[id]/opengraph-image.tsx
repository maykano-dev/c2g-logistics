import { ImageResponse } from 'next/og';
import { createClient } from '@supabase/supabase-js';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const alt = 'Product on C2G Mall';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function Image({ params }: { params: { id: string } }) {
  // Fetch product data
  let product = null;
  let primaryImage = '';

  try {
    const { data } = await supabaseAdmin
      .from('products')
      .select('name, price, product_images(image_url, is_primary)')
      .eq('id', params.id)
      .single();

    if (data) {
      product = data;
      const images = data.product_images || [];
      const pImage = images.find((i: any) => i.is_primary) || images[0];
      if (pImage) primaryImage = pImage.image_url;
    }
  } catch (e) {
    console.error(e);
  }

  const productName = product?.name || 'Quality Goods from C2G Mall';
  const price = product?.price ? `¥${product.price}` : 'Check Price on Store';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          backgroundColor: '#0a0a0a',
          backgroundImage: 'radial-gradient(circle at 25px 25px, #333 2%, transparent 0%), radial-gradient(circle at 75px 75px, #333 2%, transparent 0%)',
          backgroundSize: '100px 100px',
          color: 'white',
        }}
      >
        {/* Left Side: Text and Price */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '80px',
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#dc2626', // red-600
              color: 'white',
              fontSize: 24,
              fontWeight: 800,
              padding: '8px 24px',
              borderRadius: '9999px',
              marginBottom: 40,
              width: 'max-content',
              textTransform: 'uppercase',
              letterSpacing: '2px',
            }}
          >
            C2G Mall
          </div>

          <h1
            style={{
              fontSize: 64,
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: 20,
              maxHeight: '280px',
              overflow: 'hidden',
            }}
          >
            {productName}
          </h1>

          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 16,
              marginTop: 'auto',
            }}
          >
            <span style={{ fontSize: 32, color: '#a3a3a3' }}>From</span>
            <span style={{ fontSize: 72, fontWeight: 800, color: '#facc15' }}>
              {price}
            </span>
          </div>
        </div>

        {/* Right Side: Product Image */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
          }}
        >
          {primaryImage ? (
            <img
              src={primaryImage}
              alt="Product"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '24px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#262626',
                borderRadius: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 48,
                color: '#737373',
              }}
            >
              No Image
            </div>
          )}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
