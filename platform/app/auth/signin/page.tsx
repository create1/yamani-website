'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase, supabaseReady } from '@/lib/supabase'

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  )
}

function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [magicSent, setMagicSent] = useState(false)
  const [mode, setMode] = useState<'password' | 'magic'>('password')

  const configured = supabaseReady()

  useEffect(() => {
    const urlError = searchParams.get('error')
    if (urlError) setError(decodeURIComponent(urlError))
  }, [searchParams])

  const friendlyError = (msg: string): string => {
    if (msg.includes('Invalid login credentials')) return 'Incorrect email or password. Try again or use a magic link.'
    if (msg.includes('Email not confirmed')) return 'Please check your email and click the confirmation link first.'
    if (msg.includes('rate limit')) return 'Too many attempts. Please wait a minute and try again.'
    if (msg.includes('fetch') || msg.includes('network')) return 'Connection error — check your internet and try again.'
    return msg
  }

  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!configured) return
    setLoading(true); setError(''); setInfo('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(friendlyError(error.message)); setLoading(false); return }
    router.push('/dashboard')
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!configured) return
    setLoading(true); setError(''); setInfo('')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) { setError(friendlyError(error.message)); setLoading(false); return }
    setMagicSent(true); setLoading(false)
  }

  const handleGoogleSignIn = async () => {
    if (!configured) return
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
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
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.25rem', marginTop: '0.75rem' }}>Welcome back</h1>
          <p style={{ color: 'var(--muted)', marginTop: '0.4rem', fontSize: '0.9rem' }}>Sign in to access your courses and dashboard.</p>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Google */}
          <button onClick={handleGoogleSignIn} disabled={!configured} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', gap: '0.75rem' }}>
            <GoogleIcon /> Continue with Google
          </button>

          <Divider />

          {/* Mode tabs */}
          <div style={{ display: 'flex', background: 'var(--surface2)', borderRadius: 'var(--radius)', padding: '3px', gap: '3px' }}>
            {(['password', 'magic'] as const).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); setInfo('') }}
                style={{
                  flex: 1, padding: '0.5rem', border: 'none', cursor: 'pointer',
                  borderRadius: 'calc(var(--radius) - 2px)',
                  background: mode === m ? 'var(--surface)' : 'transparent',
                  color: mode === m ? 'var(--text)' : 'var(--muted)',
                  fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.06em',
                  transition: 'all 0.15s',
                }}
              >
                {m === 'password' ? 'Password' : 'Magic Link'}
              </button>
            ))}
          </div>

          {magicSent ? (
            <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--gold-glow)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>✉️</div>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', marginBottom: '0.4rem' }}>Check your inbox</p>
              <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>We sent a sign-in link to <strong style={{ color: 'var(--text)' }}>{email}</strong></p>
              <button onClick={() => { setMagicSent(false); setEmail('') }} style={{ marginTop: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--gold)', background: 'none', border: 'none', cursor: 'pointer' }}>
                Use a different email
              </button>
            </div>
          ) : mode === 'password' ? (
            <form onSubmit={handlePasswordSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-field">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" autoComplete="email" />
              </div>
              <div className="form-field">
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  Password
                  <button type="button" onClick={() => setMode('magic')} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--gold)', background: 'none', border: 'none', cursor: 'pointer' }}>
                    Forgot password?
                  </button>
                </label>
                <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" autoComplete="current-password" />
              </div>
              {error && <ErrorBox message={error} />}
              {info && <InfoBox message={info} />}
              <button type="submit" className="btn btn-gold" disabled={loading || !configured} style={{ justifyContent: 'center', padding: '0.85rem' }}>
                {loading ? 'Signing in…' : 'Sign In →'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleMagicLink} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', lineHeight: 1.6 }}>
                Enter your email and we&apos;ll send a one-click sign-in link — no password needed.
              </p>
              <div className="form-field">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" autoComplete="email" />
              </div>
              {error && <ErrorBox message={error} />}
              <button type="submit" className="btn btn-gold" disabled={loading || !configured} style={{ justifyContent: 'center', padding: '0.85rem' }}>
                {loading ? 'Sending…' : 'Send Magic Link →'}
              </button>
            </form>
          )}
        </div>

        <p style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', marginTop: '1.5rem' }}>
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" style={{ color: 'var(--gold)' }}>Create one →</Link>
        </p>
      </div>
    </div>
  )
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div style={{ background: 'rgba(196,97,58,0.12)', border: '1px solid rgba(196,97,58,0.3)', borderRadius: 'var(--radius)', padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#e07a5a', lineHeight: 1.5 }}>
      {message}
    </div>
  )
}

function InfoBox({ message }: { message: string }) {
  return (
    <div style={{ background: 'var(--gold-glow)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--gold)', lineHeight: 1.5 }}>
      {message}
    </div>
  )
}

function Divider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <div style={{ flex: 1, height: '1px', background: 'var(--border2)' }} />
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.1em' }}>OR</span>
      <div style={{ flex: 1, height: '1px', background: 'var(--border2)' }} />
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
