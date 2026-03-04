'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ALL_COURSES, TRACK_META } from '@/lib/courses'
import type { TrackName } from '@/lib/courses'
import type { User } from '@supabase/supabase-js'
import type { Journey } from '@/lib/journeys'
import { JOURNEY_STATUS_LABELS, formatJourneyDateRange } from '@/lib/journeys'
import PersonalCalendar from '@/components/PersonalCalendar'

const DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

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

  const todayKey = DAYS[new Date().getDay()]
  const todayClasses = ALL_COURSES
    .filter(c => c.day_of_week === todayKey && c.rotation_week === null)
    .sort((a, b) => a.start_time.localeCompare(b.start_time))
    .slice(0, 5)
  const enrolledCourses = ALL_COURSES.filter(c => enrolledSlugs.includes(c.slug))

  return (
    <div style={{ background: 'var(--ink)', minHeight: '100vh' }}>

      {/* Portal header — clear identity and primary actions */}
      <header style={{
        background: 'radial-gradient(ellipse 100% 80% at 50% -10%, rgba(201,168,76,0.12) 0%, transparent 55%)',
        borderBottom: '1px solid var(--border2)',
        padding: '2rem 0 2.25rem',
      }}>
        <div className="container">
          <div className="portal-header">
            <div className="portal-identity">
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--gold)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                Your portal
              </p>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', lineHeight: 1.15, marginBottom: '0.5rem' }}>
                {displayName}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)' }}>{user?.email}</span>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.08em',
                  padding: '0.25rem 0.6rem', borderRadius: '2rem',
                  background: `${tierInfo.color}18`, border: `1px solid ${tierInfo.color}50`,
                  color: tierInfo.color,
                }}>
                  {tierInfo.label}
                </span>
                {isInstructor && <span className="track-badge track-ai" style={{ fontSize: '0.55rem' }}>Instructor</span>}
              </div>
            </div>
            <div className="portal-actions">
              <Link href="/journeys/new" className="btn btn-gold">
                Design a Journey →
              </Link>
              <Link href="/journeys" className="btn btn-outline">My Journeys</Link>
              <Link href="/courses" className="btn btn-outline">Courses</Link>
              {isInstructor && <Link href="/admin" className="btn btn-ghost btn-sm">Admin</Link>}
              <button onClick={async () => { await supabase.auth.signOut(); router.push('/') }} className="btn btn-ghost btn-sm">Sign out</button>
            </div>
          </div>
        </div>
      </header>

      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        <div className="portal-grid">

          {/* Left: Journey + Learning blocks */}
          <div className="portal-main">

            {/* Journey block */}
            <section className="portal-block">
              <div className="portal-block-head">
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem' }}>Journey</h2>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)' }}>In‑person experience design</span>
              </div>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                Create mythopoetic journeys for yourself or a group. Set goals, choose modalities, and receive a narrative arc, schedule, and rituals.
              </p>
              <Link href="/journeys/new" className="btn btn-gold" style={{ marginBottom: '1.25rem' }}>Design a Journey →</Link>
              {journeys.length === 0 ? (
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)' }}>No journeys yet. Create your first above.</p>
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

            {/* Learning block */}
            <section className="portal-block">
              <div className="portal-block-head">
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem' }}>Learning</h2>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)' }}>Courses & schedule</span>
              </div>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: 1.6 }}>
                Enroll in courses across wellness, AI, founder, and community tracks. View your calendar and today’s classes.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                <Link href="/courses" className="btn btn-outline btn-sm">Browse courses</Link>
                <Link href="/schedule" className="btn btn-ghost btn-sm">Weekly schedule</Link>
                <Link href="/curriculum" className="btn btn-ghost btn-sm">Curriculum</Link>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>My schedule</h3>
                <PersonalCalendar />
              </div>
              <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                My courses {enrolledCourses.length > 0 && `(${enrolledCourses.length})`}
              </h3>
              {enrolledCourses.length === 0 ? (
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)' }}>Not enrolled yet. Browse courses to add.</p>
              ) : (
                <div className="portal-list">
                  {enrolledCourses.slice(0, 5).map(c => {
                    const meta = TRACK_META[c.track as TrackName]
                    return (
                      <Link key={c.slug} href={`/courses/${c.slug}`} className="portal-list-item">
                        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.9rem' }}>{c.name}</span>
                        <span className={`track-badge track-${c.track}`} style={{ fontSize: '0.52rem' }}>{meta.icon}</span>
                        <span style={{ color: 'var(--gold)', fontSize: '0.7rem' }}>→</span>
                      </Link>
                    )
                  })}
                  <Link href="/courses" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--gold)', padding: '0.5rem 0', display: 'block' }}>
                    View all courses →
                  </Link>
                </div>
              )}
            </section>

            {/* Today's classes */}
            <section className="portal-block">
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', marginBottom: '0.75rem' }}>
                Today’s classes
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', fontWeight: 400, marginLeft: '0.5rem' }}>
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </span>
              </h3>
              {todayClasses.length === 0 ? (
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)' }}>No classes scheduled today.</p>
              ) : (
                <div className="portal-list">
                  {todayClasses.map(c => {
                    const meta = TRACK_META[c.track as TrackName]
                    const isEnrolled = enrolledSlugs.includes(c.slug)
                    return (
                      <Link key={c.slug} href={`/courses/${c.slug}`} className="portal-list-item">
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', minWidth: '3.5rem' }}>{c.start_time}</span>
                        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.9rem' }}>{c.name}</span>
                        <span className={`track-badge track-${c.track}`} style={{ fontSize: '0.5rem' }}>{meta.icon}</span>
                        {isEnrolled && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--gold)' }}>Enrolled</span>}
                        <span style={{ color: 'var(--gold)', fontSize: '0.7rem' }}>→</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </section>
          </div>

          {/* Right sidebar */}
          <aside className="portal-sidebar">
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Membership</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '0.25rem' }}>{tierInfo.label}</div>
              <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '1rem', lineHeight: 1.5 }}>{tierInfo.description}</p>
              <a href="/#membership" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--gold)', textDecoration: 'none' }}>Upgrade →</a>
            </div>
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Quick links</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  { href: '/journeys', label: 'Journey', sub: 'Experience design' },
                  { href: '/journeys/new', label: 'Design a Journey', sub: 'Create new' },
                  { href: '/courses', label: 'Courses', sub: `${ALL_COURSES.length} available` },
                  { href: '/curriculum', label: 'Curriculum', sub: 'Tracks & courses' },
                  { href: '/schedule', label: 'Schedule', sub: 'Weekly view' },
                  { href: '/locations', label: 'Locations', sub: 'Campus & places' },
                ].map(({ href, label, sub }) => (
                  <Link key={href} href={href} style={{ display: 'block', padding: '0.5rem 0', borderBottom: '1px solid var(--border2)', textDecoration: 'none' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text)' }}>{label}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)' }}>{sub}</div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Account</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text)' }}>{displayName}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', marginBottom: '1rem', wordBreak: 'break-all' }}>{user?.email}</div>
              <button onClick={async () => { await supabase.auth.signOut(); router.push('/') }} className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center' }}>Sign out</button>
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
