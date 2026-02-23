import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Apotheos — Live Online Learning | AI, Founders & Wellness',
  description: 'Live online classes in AI, founder mentorship, and holistic wellness. Join from anywhere — or in-person at our Nevada City, CA campus.',
  openGraph: {
    title: 'Apotheos — Live Online Learning',
    description: 'AI & creative production, founder ecosystem, and holistic wellness — live online from anywhere.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main className="page-wrap">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
