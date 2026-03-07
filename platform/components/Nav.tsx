'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

const NAV_LINKS_BASE = [
  { href: '/mission',     label: 'Mission'  },
  { href: '/about',       label: 'About'    },
  { href: '/journeys',    label: 'Journey'  },
]
const NAV_LINK_SIGN_IN = { href: '/auth/signin', label: 'Sign In' }

export default function Nav() {
  const pathname  = usePathname()
  const [user, setUser]           = useState<User | null>(null)
  const [userRole, setUserRole]   = useState<string | null>(null)
  const [menuOpen, setMenuOpen]   = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const u = data.session?.user ?? null
      setUser(u)
      if (u) {
        const { data: prof } = await supabase.from('users').select('role').eq('id', u.id).single()
        setUserRole(prof?.role ?? null)
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
      if (!session?.user) setUserRole(null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setMenuOpen(false)
  }

  const close = () => setMenuOpen(false)

  return (
    <>
      <nav className="site-nav">
        {/* Brand */}
        <div className="nav-brand">
          <Link href="/" onClick={close}>
            <div className="nav-wordmark">Apotheos</div>
            <div className="nav-tagline">The Living Campus</div>
          </Link>
        </div>

        {/* Desktop nav links — hidden below 1100px */}
        <ul className="nav-links">
          {[...NAV_LINKS_BASE, ...(user ? [] : [NAV_LINK_SIGN_IN])].map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className={pathname === href ? 'active' : ''}>{label}</Link>
            </li>
          ))}
        </ul>

        {/* Auth area — always visible, adapts at breakpoints */}
        <div className="nav-auth">
          {user ? (
            /* ── Logged in ── */
            <>
              {(userRole === 'admin' || userRole === 'instructor') && (
                <Link href="/admin" className="nav-user-btn nav-hide-sm" style={{ color: 'var(--gold)' }}>Admin</Link>
              )}
              <Link href="/dashboard" className="nav-dashboard-btn">
                <span className="nav-dashboard-icon">◎</span>
                <span className="nav-dashboard-label">Dashboard</span>
              </Link>
              <button onClick={handleSignOut} className="nav-user-btn nav-hide-sm">Sign Out</button>
            </>
          ) : (
            /* ── Logged out ── */
            <>
              <Link href="/auth/signin" className="nav-signin-btn">Sign In</Link>
              <Link href="/auth/signup" className="nav-signup-btn">
                <span className="nav-signup-label-long">Create Account</span>
                <span className="nav-signup-label-short">Sign Up</span>
              </Link>
            </>
          )}

          {/* Hamburger — always on the right of auth area on mobile */}
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile / tablet drawer */}
      {menuOpen && (
        <div className="mobile-menu" onClick={e => { if (e.target === e.currentTarget) close() }}>
          <div className="mobile-menu-inner">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {[...NAV_LINKS_BASE, ...(user ? [] : [NAV_LINK_SIGN_IN])].map(({ href, label }) => (
                <Link key={href} href={href} onClick={close} className="mobile-nav-link">{label}</Link>
              ))}
            </div>

            <div style={{ height: '1px', background: 'var(--border)', margin: '0.5rem 0' }} />

            {user ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '0.25rem' }}>
                {(userRole === 'admin' || userRole === 'instructor') && (
                  <Link href="/admin" onClick={close} className="mobile-nav-link" style={{ color: 'var(--gold)' }}>Admin Panel</Link>
                )}
                <Link href="/dashboard" onClick={close} className="btn btn-gold" style={{ justifyContent: 'center' }}>
                  ◎ Dashboard
                </Link>
                <button onClick={handleSignOut} className="btn btn-ghost btn-sm" style={{ justifyContent: 'center', width: '100%' }}>
                  Sign Out
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', paddingTop: '0.25rem' }}>
                <Link href="/auth/signup" onClick={close} className="btn btn-gold" style={{ justifyContent: 'center' }}>
                  Create Account →
                </Link>
                <Link href="/auth/signin" onClick={close} className="btn btn-outline" style={{ justifyContent: 'center' }}>
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
