'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

const NAV_LINKS = [
  { href: '/#mission',    label: 'Mission'        },
  { href: '/journeys',    label: 'Journey'        },
  { href: '/courses',     label: 'Online Courses' },
  { href: '/curriculum',  label: 'Curriculum'     },
  { href: '/locations',   label: 'Locations'      },
  { href: '/#membership', label: 'Membership'     },
]

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
          {NAV_LINKS.map(({ href, label }) => (
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
              {NAV_LINKS.map(({ href, label }) => (
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

      <style>{`
        /* ── Nav layout ── */
        nav.site-nav {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        /* Nav links stay in the middle, flex-grow pushes auth to the right */
        nav.site-nav .nav-links { flex: 1; }

        /* Auth cluster */
        .nav-auth {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-shrink: 0;
        }

        /* Sign In — ghost link style */
        .nav-signin-btn {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: var(--muted);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: none;
          border: 1px solid var(--border2);
          padding: 0.38rem 0.9rem;
          border-radius: 2rem;
          transition: all 0.2s;
          white-space: nowrap;
          text-decoration: none;
        }
        .nav-signin-btn:hover { color: var(--gold); border-color: var(--border); }

        /* Sign Up — gold filled pill */
        .nav-signup-btn {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: var(--gold);
          color: var(--ink);
          border: 1px solid var(--gold);
          padding: 0.4rem 1rem;
          border-radius: 2rem;
          transition: all 0.2s;
          white-space: nowrap;
          text-decoration: none;
        }
        .nav-signup-btn:hover { background: var(--gold-lt); border-color: var(--gold-lt); }

        /* Label toggling */
        .nav-signup-label-short { display: none; }
        .nav-signup-label-long  { display: inline; }

        /* Dashboard button */
        .nav-dashboard-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: var(--gold);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: rgba(201,168,76,0.1);
          border: 1px solid rgba(201,168,76,0.3);
          padding: 0.38rem 0.9rem;
          border-radius: 2rem;
          transition: all 0.2s;
          white-space: nowrap;
          text-decoration: none;
        }
        .nav-dashboard-btn:hover { background: rgba(201,168,76,0.18); border-color: var(--gold); }
        .nav-dashboard-icon { font-size: 0.75rem; }

        /* Generic user button */
        .nav-user-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: var(--muted);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: none;
          border: 1px solid var(--border2);
          padding: 0.35rem 0.85rem;
          border-radius: 2rem;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          white-space: nowrap;
        }
        .nav-user-btn:hover { color: var(--gold); border-color: var(--border); }

        /* Hamburger */
        .nav-hamburger {
          display: none;
          background: none;
          border: 1px solid var(--border);
          color: var(--gold);
          width: 2.2rem;
          height: 2.2rem;
          border-radius: var(--radius);
          font-size: 1rem;
          cursor: pointer;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        /* Mobile drawer */
        .mobile-menu {
          position: fixed;
          top: var(--nav-h);
          left: 0; right: 0; bottom: 0;
          z-index: 199;
          background: rgba(13,12,9,0.6);
          backdrop-filter: blur(4px);
        }
        .mobile-menu-inner {
          background: rgba(13,12,9,0.98);
          border-bottom: 1px solid var(--border);
          padding: 1rem 1.5rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .mobile-nav-link {
          display: block;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          padding: 0.75rem 0;
          border-bottom: 1px solid var(--border2);
          cursor: pointer;
          transition: color 0.15s;
          text-decoration: none;
        }
        .mobile-nav-link:hover { color: var(--gold); }

        /* ── Breakpoints ── */

        /* Below 1100px: hide nav links, show hamburger */
        @media (max-width: 1100px) {
          .nav-links       { display: none; }
          .nav-hamburger   { display: flex; }
          .nav-hide-sm     { display: none; }

          /* Shorten "Create Account" → "Sign Up" */
          .nav-signup-label-long  { display: none; }
          .nav-signup-label-short { display: inline; }

          /* Hide dashboard label, show just the icon */
          .nav-dashboard-label { display: none; }
          .nav-dashboard-btn   { padding: 0.38rem 0.55rem; }
        }

        /* Below 480px: hide sign-in text, keep sign-up pill + hamburger */
        @media (max-width: 480px) {
          .nav-signin-btn { display: none; }
        }
      `}</style>
    </>
  )
}
