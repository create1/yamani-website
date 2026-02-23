import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Apotheos — The Living Campus',
  description: 'A transformational community campus uniting AI learning, founder mentorship, and holistic wellness in a single, curated space.',
  openGraph: {
    title: 'Apotheos — The Living Campus',
    description: 'AI learning, founder ecosystem, and holistic wellness — all in one place.',
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
