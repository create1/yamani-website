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
  const [verifyEmailSent, setVerifyEmailSent] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true); setError('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    })

    if (error) { setError(error.message); setLoading(false); return }
    setVerifyEmailSent(true)
    setLoading(false)
  }

  const handleGoogleSignUp = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })
  }

  if (verifyEmailSent) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '420px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>✉️</div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '1rem' }}>Verify Your Email</h2>
          <p style={{ color: 'var(--muted)', lineHeight: 1.7 }}>
            We sent a verification link to <strong style={{ color: 'var(--text)' }}>{email}</strong>. Click the link to activate your account and access your dashboard.
          </p>
          <Link href="/auth/signin" className="btn btn-outline" style={{ marginTop: '2rem', justifyContent: 'center' }}>
            Back to Sign In
          </Link>
        </div>
      </div>
    )
  }

  const configured = supabaseReady()

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {!configured && (
          <div style={{ background: 'rgba(196,97,58,0.12)', border: '1px solid rgba(196,97,58,0.4)', borderRadius: 'var(--radius)', padding: '1rem 1.25rem', marginBottom: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', lineHeight: 1.7, color: 'var(--text)' }}>
            <strong style={{ color: '#e07a5a' }}>⚠ Supabase not connected</strong><br />
            Auth is not yet configured. Add your Supabase credentials to enable account creation.
          </div>
        )}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <p className="eyebrow">Join Apotheos</p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem' }}>Create Account</h1>
          <p style={{ color: 'var(--muted)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
            Access courses, live sessions, and the Apotheos community.
          </p>
        </div>

        <div className="card" style={{ gap: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          {/* Google */}
          <button onClick={handleGoogleSignUp} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', gap: '0.75rem' }}>
            <GoogleIcon /> Continue with Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <hr className="gold-rule" style={{ flex: 1, margin: 0 }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.08em' }}>OR</span>
            <hr className="gold-rule" style={{ flex: 1, margin: 0 }} />
          </div>

          <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-field">
              <label className="form-label">Full Name</label>
              <input className="form-input" type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Your name" />
            </div>
            <div className="form-field">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
            </div>
            <div className="form-field">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Min 8 characters" />
            </div>

            {error && <p className="form-error">{error}</p>}

            <button type="submit" className="btn btn-gold" disabled={loading} style={{ justifyContent: 'center' }}>
              {loading ? 'Creating account…' : 'Create Account →'}
            </button>

            <p style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', lineHeight: 1.6 }}>
              By creating an account you agree to our terms of service and privacy policy.
            </p>
          </form>

          <p style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)' }}>
            Already have an account?{' '}
            <Link href="/auth/signin" style={{ color: 'var(--gold)' }}>Sign in →</Link>
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
