/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Optimasi images — aktifkan remote patterns untuk hosting
  images: {
    unoptimized: true, // Tetap untuk simplisitas, bisa diubah ke domains[] jika perlu CDN
  },

  // Penting untuk deploy di Railway / Docker / VPS
  // Jika hosting di Vercel, hapus baris output ini
  // output: 'standalone',

  // Pastikan environment variables tersedia saat runtime
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3524',
  },

  // Konfigurasi header keamanan tambahan via next.config
  // (middleware.ts sudah handle headers, ini sebagai lapisan kedua)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
    ];
  },

  // Redirect www ke non-www (uncomment jika hosting dengan domain custom)
  // async redirects() {
  //   return [
  //     { source: '/', destination: '/dashboard', permanent: false, has: [{ type: 'cookie', key: 'sirkula_auth_token' }] },
  //   ];
  // },
};

module.exports = nextConfig;
