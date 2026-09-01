const securityHeaders = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=self, microphone=(), geolocation=()'
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com",
      "img-src 'self' data: blob: https://images.unsplash.com https://*.supabase.co https://res.cloudinary.com https://i.ibb.co https://placehold.co https://*.tile.openstreetmap.org https://unpkg.com https://*.basemaps.cartocdn.com https://*.hiobuy.com https://cdn.hiobuy.com https://*.alicdn.com https://*.aliyun.com https://*.aliyuncs.com https://*.1688.com https://*.taobao.com",
      "connect-src 'self' https://*.supabase.co https://payproxyapi.hubtel.com https://api.imgbb.com https://cdn.jsdelivr.net https://fastly.jsdelivr.net",
      "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com",
      "frame-ancestors 'none'"
    ].join('; ')
  }
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '25mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
      {
        protocol: "https",
        hostname: "*.hiobuy.com",
      },
      {
        protocol: "https",
        hostname: "cdn.hiobuy.com",
      },
      {
        protocol: "https",
        hostname: "*.alicdn.com",
      },
      {
        protocol: "https",
        hostname: "*.aliyun.com",
      },
      {
        protocol: "https",
        hostname: "*.aliyuncs.com",
      },
      {
        protocol: "https",
        hostname: "*.1688.com",
      },
      {
        protocol: "https",
        hostname: "*.taobao.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};


export default nextConfig;
