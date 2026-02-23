'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase, supabaseReady } from '@/lib/supabase'

export default function SignUpPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [autoSignedIn, setAutoSignedIn] = useState(false)

  const configured = supabaseReady()

  const friendlyError = (msg: string): string => {
    if (msg.includes('already registered') || msg.includes('already been registered')) return 'An account with this email already exists. Sign in instead.'
    if (msg.includes('Password should be')) return 'Password must be at least 8 characters.'
    if (msg.includes('rate limit')) return 'Too many attempts. Please wait a minute and try again.'
    return msg
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!configured) return
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true); setError('')

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) { setError(friendlyError(error.message)); setLoading(false); return }

    // If auto-confirmed (email confirmation disabled in Supabase), go straight to dashboard
    if (data.session) {
      setAutoSignedIn(true)
      setTimeout(() => router.push('/dashboard'), 1500)
    } else {
      setDone(true)
    }
    setLoading(false)
  }

  const handleGoogleSignUp = async () => {
    if (!configured) return
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  if (autoSignedIn) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--gold)' }}>Account created!</h2>
          <p style={{ color: 'var(--muted)', marginTop: '0.5rem' }}>Taking you to your dashboard…</p>
        </div>
      </div>
    )
  }

  if (done) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '440px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1.25rem' }}>✉️</div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '1rem' }}>Check your email</h2>
          <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: '0.5rem' }}>
            We sent a confirmation link to <strong style={{ color: 'var(--text)' }}>{email}</strong>.
          </p>
          <p style={{ color: 'var(--muted)', lineHeight: 1.7, fontSize: '0.88rem' }}>
            Click the link in the email to activate your account, then come back here to sign in.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
            <Link href="/auth/signin" className="btn btn-gold">Go to Sign In →</Link>
            <button onClick={() => { setDone(false); setPassword('') }} className="btn btn-ghost btn-sm">
              Try again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>

        {!configured && (
          <div style={{ background: 'rgba(196,97,58,0.12)', border: '1px solid rgba(196,97,58,0.35)', borderRadius: 'var(--radius)', padding: '1rem 1.25rem', marginBottom: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', lineHeight: 1.7 }}>
            <strong style={{ color: '#e07a5a' }}>⚠ Auth not configured</strong><br />
            <span style={{ color: 'var(--muted)' }}>Supabase credentials need to be added to Vercel.</span>
          </div>
        )}

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--gold)', textDecoration: 'none' }}>Apotheos</Link>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.25rem', marginTop: '0.75rem' }}>Create your account</h1>
          <p style={{ color: 'var(--muted)', marginTop: '0.4rem', fontSize: '0.9rem' }}>Join Apotheos — access courses, live sessions, and community.</p>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <button onClick={handleGoogleSignUp} disabled={!configured} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', gap: '0.75rem' }}>
            <GoogleIcon /> Continue with Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border2)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.1em' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border2)' }} />
          </div>

          <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-field">
              <label className="form-label">Full Name</label>
              <input className="form-input" type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Your name" autoComplete="name" />
            </div>
            <div className="form-field">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" autoComplete="email" />
            </div>
            <div className="form-field">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Min 8 characters" autoComplete="new-password" />
            </div>

            {error && (
              <div style={{ background: 'rgba(196,97,58,0.12)', border: '1px solid rgba(196,97,58,0.3)', borderRadius: 'var(--radius)', padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#e07a5a', lineHeight: 1.5 }}>
                {error}
                {error.includes('already exists') && (
                  <> <Link href="/auth/signin" style={{ color: 'var(--gold)' }}>Sign in →</Link></>
                )}
              </div>
            )}

            <button type="submit" className="btn btn-gold" disabled={loading || !configured} style={{ justifyContent: 'center', padding: '0.85rem' }}>
              {loading ? 'Creating account…' : 'Create Account →'}
            </button>

            <p style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', lineHeight: 1.6 }}>
              By creating an account you agree to our terms of service.
            </p>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', marginTop: '1.5rem' }}>
          Already have an account?{' '}
          <Link href="/auth/signin" style={{ color: 'var(--gold)' }}>Sign in →</Link>
        </p>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}
