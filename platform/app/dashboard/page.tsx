'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ALL_COURSES } from '@/lib/courses'
import type { User } from '@supabase/supabase-js'
import type { Journey } from '@/lib/journeys'
import { JOURNEY_STATUS_LABELS, formatJourneyDateRange } from '@/lib/journeys'

const TIER_INFO: Record<string, { label: string; color: string; description: string; perks: string[] }> = {
  community: { label: 'Community', color: '#C9A84C', description: 'Online access', perks: ['Full online course library', 'Community chat', 'Monthly events'] },
  seeker: { label: 'Seeker', color: '#7BB3BE', description: 'Weekend campus + 4 live classes/month', perks: ['Weekend campus access', '4 live classes/month', 'Online course library'] },
  founder: { label: 'Founder', color: '#D4856A', description: 'Unlimited access', perks: ['Unlimited live classes', 'Full campus access', 'Founder cohort & AI lab'] },
  visionary: { label: 'Visionary', color: '#8DA88F', description: 'Full access + mentorship', perks: ['Everything in Founder', '1:1 mentorship', 'Investor network access'] },
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<{ name: string; membership_tier: string; role: string } | null>(null)
  const [enrolledSlugs, setEnrolledSlugs] = useState<string[]>([])
  const [journeys, setJourneys] = useState<Journey[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser(u: User) {
      setUser(u)
      try {
        await fetch('/api/user/ensure', { method: 'POST' }).catch(() => {})
        const [profRes, enrRes, journeysRes] = await Promise.all([
          supabase.from('users').select('name, membership_tier, role').eq('id', u.id).single(),
          supabase.from('enrollments').select('course:courses(slug)').eq('user_id', u.id),
          supabase.from('journeys').select('id, title, type, status, start_at, end_at, created_at, location:locations(id, name, slug)').eq('host_id', u.id).order('created_at', { ascending: false }).limit(5),
        ])
        setProfile(profRes.error ? null : (profRes.data ?? null))
        if (enrRes.data && !enrRes.error) {
          const slugs = enrRes.data.map((e: unknown) => (e as { course?: { slug?: string } }).course?.slug).filter(Boolean) as string[]
          setEnrolledSlugs(slugs)
        } else {
          setEnrolledSlugs([])
        }
        if (journeysRes.data && !journeysRes.error) setJourneys(journeysRes.data as unknown as Journey[])
        else setJourneys([])
      } finally {
        setLoading(false)
      }
    }

    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) loadUser(data.session.user)
      else {
        const t = setTimeout(() => {
          supabase.auth.getSession().then(({ data: d2 }) => {
            if (d2.session?.user) loadUser(d2.session.user)
            else {
              setLoading(false)
              router.push('/auth/signin')
            }
          })
        }, 800)
        return () => clearTimeout(t)
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user) loadUser(session.user)
    })
    return () => subscription.unsubscribe()
  }, [router])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh', flexDirection: 'column', gap: '1rem' }}>
        <div className="spinner" />
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)' }}>Loading your portal…</p>
      </div>
    )
  }

  const displayName = profile?.name || user?.email?.split('@')[0] || 'Guest'
  const tier = profile?.membership_tier ?? 'community'
  const tierInfo = TIER_INFO[tier] ?? TIER_INFO.community
  const isInstructor = profile?.role === 'instructor' || profile?.role === 'admin'
  const enrolledCourses = ALL_COURSES.filter(c => enrolledSlugs.includes(c.slug))

  return (
    <div style={{ background: 'var(--ink)', minHeight: '100vh' }}>

      {/* Compact header: identity + sign out */}
      <header style={{
        borderBottom: '1px solid var(--border2)',
        padding: '1rem 0',
      }}>
        <div className="container">
          <div className="portal-header">
            <div className="portal-identity">
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', fontWeight: 600 }}>
                {displayName}
              </h1>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)' }}>{user?.email}</span>
            </div>
            <div className="portal-actions">
              <Link href="/journeys" className="btn btn-ghost btn-sm">My Journeys</Link>
              {isInstructor && <Link href="/admin" className="btn btn-ghost btn-sm">Admin</Link>}
              <button onClick={async () => { await supabase.auth.signOut(); window.location.href = '/' }} className="btn btn-ghost btn-sm">Sign out</button>
            </div>
          </div>
        </div>
      </header>

      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        <div className="portal-grid">

          <div className="portal-main">

            {/* Hero: Design an experience — primary CTA */}
            <section className="dashboard-hero">
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--gold)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                Experience design
              </p>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', lineHeight: 1.2, marginBottom: '0.75rem' }}>
                Design an immersive experience
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.65, maxWidth: '42ch', marginBottom: '1.5rem' }}>
                Create a mythopoetic journey for yourself or a group. Set intentions, choose modalities, pick a location and dates — then get a narrative arc, schedule, and rituals tailored to your goals.
              </p>
              <Link href="/journeys/new" className="btn btn-gold btn-lg dashboard-hero-cta">
                Start designing an experience →
              </Link>
            </section>

            {/* Your journeys */}
            <section className="portal-block">
              <div className="portal-block-head">
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem' }}>Your journeys</h2>
                <Link href="/journeys/new" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--gold)', textDecoration: 'none' }}>New journey</Link>
              </div>
              {journeys.length === 0 ? (
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)' }}>You haven’t designed any experiences yet. Start with the button above.</p>
              ) : (
                <div className="portal-list">
                  {journeys.map(j => {
                    const isReady = j.status === 'ready'
                    return (
                      <Link key={j.id} href={isReady ? `/journeys/${j.id}/experience` : `/journeys/${j.id}`} className="portal-list-item">
                        <div>
                          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.95rem' }}>{j.title || 'Untitled Journey'}</span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', marginLeft: '0.5rem' }}>
                            {JOURNEY_STATUS_LABELS[j.status]}
                          </span>
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)' }}>
                          {formatJourneyDateRange(j.start_at, j.end_at)}
                        </div>
                        <span style={{ color: 'var(--gold)', fontSize: '0.7rem' }}>→</span>
                      </Link>
                    )
                  })}
                  <Link href="/journeys" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--gold)', padding: '0.5rem 0', display: 'block' }}>
                    View all journeys →
                  </Link>
                </div>
              )}
            </section>

            {/* Learning — compact */}
            <section className="portal-block">
              <div className="portal-block-head">
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem' }}>Learning</h2>
                <Link href="/courses" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--gold)', textDecoration: 'none' }}>Browse courses</Link>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Link href="/courses" className="btn btn-outline btn-sm">Courses</Link>
                <Link href="/schedule" className="btn btn-ghost btn-sm">Schedule</Link>
                <Link href="/curriculum" className="btn btn-ghost btn-sm">Curriculum</Link>
              </div>
              {enrolledCourses.length > 0 && (
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', marginTop: '0.75rem' }}>
                  Enrolled in {enrolledCourses.length} course{enrolledCourses.length !== 1 ? 's' : ''}.
                </p>
              )}
            </section>
          </div>

          {/* Right sidebar */}
          <aside className="portal-sidebar">
            <div className="card" style={{ padding: '1.25rem' }}>
              <Link href="/journeys/new" className="btn btn-gold" style={{ width: '100%', justifyContent: 'center', marginBottom: '0.75rem' }}>
                Start designing an experience →
              </Link>
              <Link href="/journeys" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', textDecoration: 'none', display: 'block' }}>
                My Journeys
              </Link>
            </div>
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Membership</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem' }}>{tierInfo.label}</div>
              <Link href="/membership" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--gold)', textDecoration: 'none' }}>Upgrade</Link>
            </div>
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Account</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text)', wordBreak: 'break-all' }}>{user?.email}</div>
              <button onClick={async () => { await supabase.auth.signOut(); window.location.href = '/' }} className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center', marginTop: '0.75rem' }}>Sign out</button>
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        .portal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 1.25rem;
        }
        .portal-identity { flex: 1; min-width: 200px; }
        .portal-actions {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-wrap: wrap;
        }
        .portal-grid {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 2rem;
          align-items: start;
        }
        @media (max-width: 960px) {
          .portal-grid { grid-template-columns: 1fr; }
          .portal-actions { width: 100%; }
        }
        .portal-main { display: flex; flex-direction: column; gap: 2rem; }
        .dashboard-hero {
          background: linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(201,168,76,0.02) 100%);
          border: 1px solid var(--border2);
          border-radius: var(--radius-lg);
          padding: 2rem;
          margin-bottom: 0.5rem;
        }
        .dashboard-hero-cta {
          display: inline-flex;
          align-items: center;
          padding: 0.9rem 1.5rem;
          font-size: 0.95rem;
        }
        .portal-block {
          background: var(--surface2);
          border: 1px solid var(--border2);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
        }
        .portal-block-head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .portal-list { display: flex; flex-direction: column; gap: 0; }
        .portal-list-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.65rem 0;
          border-bottom: 1px solid var(--border2);
          text-decoration: none;
          color: inherit;
          transition: background 0.15s;
        }
        .portal-list-item:hover { background: var(--surface); }
        .portal-list-item:last-of-type { border-bottom: none; }
        .portal-sidebar { display: flex; flex-direction: column; gap: 1rem; }
      `}</style>
    </div>
  )
}
