'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function HomePage() {
  const router = useRouter()
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        window.location.replace('/dashboard')
        return
      }
      setCheckingAuth(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user) window.location.replace('/dashboard')
    })
    return () => subscription.unsubscribe()
  }, [])

  if (checkingAuth) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" />
      </div>
    )
  }

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', textAlign: 'center',
        padding: '0 2rem',
        background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(201,168,76,0.07) 0%, transparent 70%)',
      }}>
        <p className="eyebrow" style={{ marginBottom: '1.5rem' }}>Digital Learning Platform</p>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 700, lineHeight: 1.05, maxWidth: '16ch' }}>
          Learn, Build &amp; <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Grow</em>
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', maxWidth: '52ch', margin: '2rem auto', lineHeight: 1.7 }}>
          Apotheos is a live online platform for AI literacy, creative entrepreneurship, and holistic wellness — join any class from anywhere in the world. Taught by expert humans <em>and</em> next-generation AI agents.
        </p>

        {/* Primary CTAs */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1rem' }}>
          <Link href="/auth/signup" className="btn btn-gold btn-lg">Create Account →</Link>
          <Link href="/auth/signin" className="btn btn-outline btn-lg">Sign In</Link>
        </div>

        {/* Explore — nav-driven pages */}
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1.25rem', alignItems: 'center' }}>
          <Link href="/mission" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.08em', textDecoration: 'none' }}>Mission</Link>
          <span style={{ width: '1px', height: '0.8rem', background: 'var(--border2)', display: 'inline-block' }} />
          <Link href="/about" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.08em', textDecoration: 'none' }}>About</Link>
          <span style={{ width: '1px', height: '0.8rem', background: 'var(--border2)', display: 'inline-block' }} />
          <Link href="/journeys" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.08em', textDecoration: 'none' }}>Journey</Link>
        </div>

        {/* Trust line */}
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.06em', marginTop: '2rem', opacity: 0.7 }}>
          Free to join · No credit card required · Cancel anytime
        </p>
      </section>
    </>
  )
}
