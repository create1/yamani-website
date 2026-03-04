'use client'
import { InterestProvider } from '@/context/InterestContext'

export default function Providers({ children }: { children: React.ReactNode }) {
  return <InterestProvider>{children}</InterestProvider>
}
