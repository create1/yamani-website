import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Root (/) now serves the Next.js app (app/page.tsx) so nav, Journey, and dashboard work
  // To use the static home.html again, add: beforeFiles: [ { source: '/', destination: '/home.html' } ],
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
