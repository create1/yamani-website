'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase, supabaseReady } from '@/lib/supabase'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [magicSent, setMagicSent] = useState(false)
  const [mode, setMode] = useState<'password' | 'magic'>('password')

  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/dashboard')
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/dashboard` } })
    if (error) { setError(error.message); setLoading(false); return }
    setMagicSent(true); setLoading(false)
  }

  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })
  }

  const configured = supabaseReady()

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {!configured && (
          <div style={{ background: 'rgba(196,97,58,0.12)', border: '1px solid rgba(196,97,58,0.4)', borderRadius: 'var(--radius)', padding: '1rem 1.25rem', marginBottom: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', lineHeight: 1.7, color: 'var(--text)' }}>
            <strong style={{ color: '#e07a5a' }}>⚠ Supabase not connected</strong><br />
            Auth is not yet configured. Add your Supabase credentials to <code style={{ color: 'var(--gold)' }}>.env.local</code> on Vercel to enable sign-in.
          </div>
        )}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <p className="eyebrow">Welcome Back</p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem' }}>Sign In</h1>
          <p style={{ color: 'var(--muted)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
            Access your courses, dashboard, and live sessions.
          </p>
        </div>

        <div className="card" style={{ gap: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          {/* Google */}
          <button onClick={handleGoogleSignIn} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', gap: '0.75rem' }}>
            <GoogleIcon /> Continue with Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <hr className="gold-rule" style={{ flex: 1, margin: 0 }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.08em' }}>OR</span>
            <hr className="gold-rule" style={{ flex: 1, margin: 0 }} />
          </div>

          {/* Mode toggle */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className={`btn btn-sm ${mode === 'password' ? 'btn-gold' : 'btn-ghost'}`} onClick={() => setMode('password')} style={{ flex: 1, justifyContent: 'center' }}>Password</button>
            <button className={`btn btn-sm ${mode === 'magic' ? 'btn-gold' : 'btn-ghost'}`} onClick={() => setMode('magic')} style={{ flex: 1, justifyContent: 'center' }}>Magic Link</button>
          </div>

          {magicSent ? (
            <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--gold-glow)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>✉️</div>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Check your inbox</p>
              <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>We sent a sign-in link to <strong>{email}</strong></p>
            </div>
          ) : mode === 'password' ? (
            <form onSubmit={handlePasswordSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-field">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
              </div>
              <div className="form-field">
                <label className="form-label">Password</label>
                <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
              </div>
              {error && <p className="form-error">{error}</p>}
              <button type="submit" className="btn btn-gold" disabled={loading} style={{ justifyContent: 'center' }}>
                {loading ? 'Signing in…' : 'Sign In →'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleMagicLink} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-field">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
              </div>
              {error && <p className="form-error">{error}</p>}
              <button type="submit" className="btn btn-gold" disabled={loading} style={{ justifyContent: 'center' }}>
                {loading ? 'Sending…' : 'Send Magic Link →'}
              </button>
            </form>
          )}

          <p style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)' }}>
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" style={{ color: 'var(--gold)' }}>Sign up →</Link>
          </p>
        </div>
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
