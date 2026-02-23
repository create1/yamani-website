'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

const NAV_LINKS = [
  { href: '/#mission',    label: 'Mission'     },
  { href: '/#model',      label: 'Model'       },
  { href: '/curriculum',  label: 'Curriculum'  },
  { href: '/schedule',    label: 'Schedule'    },
  { href: '/courses',     label: 'Courses'     },
  { href: '/#membership', label: 'Membership'  },
  { href: '/#contact',    label: 'Contact'     },
]

export default function Nav() {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

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
  }

  return (
    <>
      <nav className="site-nav">
        <div className="nav-brand">
          <Link href="/">
            <div className="nav-wordmark">Apotheos</div>
            <div className="nav-tagline">The Living Campus</div>
          </Link>
        </div>

        <div className="nav-right">
          <ul className="nav-links">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={pathname === href ? 'active' : ''}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {user ? (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              {(userRole === 'admin' || userRole === 'instructor') && (
                <Link href="/admin" className="nav-user-btn" style={{ color: 'var(--gold)' }}>
                  Admin
                </Link>
              )}
              <Link href="/dashboard" className="nav-user-btn">
                <span>◎</span> Dashboard
              </Link>
              <button onClick={handleSignOut} className="nav-user-btn">
                Sign Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <Link href="/auth/signin" className="nav-user-btn">Sign In</Link>
              <Link href="/#waitlist" className="nav-pill">Join Waitlist</Link>
            </div>
          )}
        </div>

        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
          style={{
            display: 'none',
            background: 'none', border: 'none', color: 'var(--gold)',
            fontSize: '1.5rem', cursor: 'pointer',
          }}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu" style={{
          position: 'fixed', top: 'var(--nav-h)', left: 0, right: 0,
          background: 'rgba(13,12,9,0.97)', zIndex: 199,
          borderBottom: '1px solid var(--border)',
          padding: '1.5rem 2rem',
          display: 'flex', flexDirection: 'column', gap: '0.75rem',
        }}>
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href} href={href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'var(--muted)', padding: '0.5rem 0',
                borderBottom: '1px solid var(--border2)',
              }}
            >
              {label}
            </Link>
          ))}
          {user ? (
            <>
              <Link href="/dashboard" onClick={() => setMenuOpen(false)}
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--gold)' }}>
                Dashboard
              </Link>
              <button onClick={() => { handleSignOut(); setMenuOpen(false); }}
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)',
                  background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/signin" onClick={() => setMenuOpen(false)}
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)' }}>
                Sign In
              </Link>
              <Link href="/#waitlist" onClick={() => setMenuOpen(false)}
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--gold)' }}>
                Join Waitlist →
              </Link>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 1100px) {
          .nav-hamburger { display: block !important; }
        }
      `}</style>
    </>
  )
}
