import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Serve the original static home page at / while the Next.js app handles everything else
  async rewrites() {
    return {
      // beforeFiles runs before Next.js pages, so this overrides app/page.tsx for /
      beforeFiles: [
        { source: '/', destination: '/home.html' },
      ],
      afterFiles: [],
      fallback: [],
    }
  },
  // Allow Daily.co iframes
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
  reactStrictMode: true,
}

export default nextConfig
