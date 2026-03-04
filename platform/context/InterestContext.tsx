'use client'
import { createContext, useContext, useState, useEffect, useCallback } from 'react'

interface InterestContextType {
  interests: Set<string>
  toggleInterest: (slug: string) => void
  isInterested: (slug: string) => boolean
}

const InterestContext = createContext<InterestContextType>({
  interests: new Set(),
  toggleInterest: () => {},
  isInterested: () => false,
})

const STORAGE_KEY = 'apotheos_interests'

export function InterestProvider({ children }: { children: React.ReactNode }) {
  const [interests, setInterests] = useState<Set<string>>(new Set())
  const [ready, setReady] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setInterests(new Set(JSON.parse(raw) as string[]))
    } catch { /* ignore */ }
    setReady(true)
  }, [])

  // Persist to localStorage whenever interests change (after initial load)
  useEffect(() => {
    if (!ready) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...interests]))
    } catch { /* ignore */ }
  }, [interests, ready])

  const toggleInterest = useCallback((slug: string) => {
    setInterests(prev => {
      const next = new Set(prev)
      next.has(slug) ? next.delete(slug) : next.add(slug)
      return next
    })
  }, [])

  const isInterested = useCallback((slug: string) => interests.has(slug), [interests])

  return (
    <InterestContext.Provider value={{ interests, toggleInterest, isInterested }}>
      {children}
    </InterestContext.Provider>
  )
}

export const useInterests = () => useContext(InterestContext)
