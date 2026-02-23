'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { COURSES_BY_SLUG, TRACK_META } from '@/lib/courses'
import type { Enrollment, Session } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

interface EnrollmentWithCourse extends Omit<Enrollment, 'course'> {
  course: { slug: string; name: string; track: string; start_time: string; day_of_week: string }
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<{ name: string; membership_tier: string; role: string } | null>(null)
  const [enrollments, setEnrollments] = useState<EnrollmentWithCourse[]>([])
  const [upcomingSessions, setUpcomingSessions] = useState<(Session & { course_slug?: string; course_name?: string })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const u = data.session?.user
      if (!u) { router.push('/auth/signin'); return }
      setUser(u)

      // Load profile
      const { data: prof } = await supabase.from('users').select('name, membership_tier, role').eq('id', u.id).single()
      setProfile(prof)

      // Load enrollments
      const { data: enrData } = await supabase
        .from('enrollments')
        .select('*, course:courses(slug, name, track, start_time, day_of_week)')
        .eq('user_id', u.id)
        .order('enrolled_at', { ascending: false })
      setEnrollments((enrData ?? []) as EnrollmentWithCourse[])

      // Load upcoming sessions for enrolled courses
      if (enrData && enrData.length > 0) {
        const courseIds = enrData.map((e: Enrollment) => e.course_id)
        const { data: sessData } = await supabase
          .from('sessions')
          .select('*, course:courses(slug, name)')
          .in('course_id', courseIds)
          .gte('scheduled_date', new Date().toISOString().split('T')[0])
          .in('status', ['scheduled', 'live'])
          .order('scheduled_date', { ascending: true })
          .limit(10)
        setUpcomingSessions((sessData ?? []).map((s: Session & { course?: { slug: string; name: string } }) => ({
          ...s,
          course_slug: s.course?.slug,
          course_name: s.course?.name,
        })))
      }

      setLoading(false)
    })
  }, [router])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p className="eyebrow">Welcome Back</p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 2.75rem)' }}>
            {profile?.name || user?.email?.split('@')[0] || 'Student'}
          </h1>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
            <TierBadge tier={profile?.membership_tier ?? 'community'} />
            {profile?.role === 'instructor' && (
              <span className="track-badge track-ai">Instructor</span>
            )}
          </div>
        </div>
        <Link href="/courses" className="btn btn-outline">Browse Courses →</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem', alignItems: 'start' }}>
        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {/* Upcoming sessions */}
          <section>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1.25rem' }}>Upcoming Sessions</h2>
            {upcomingSessions.length === 0 ? (
              <div className="card">
                <div className="empty-state" style={{ padding: '2rem' }}>
                  No upcoming sessions. <Link href="/courses" style={{ color: 'var(--gold)' }}>Browse courses →</Link>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {upcomingSessions.map(session => (
                  <div key={session.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', marginBottom: '0.25rem' }}>
                        {session.course_name}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)' }}>
                        {new Date(session.scheduled_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        {' · '}{session.course_slug && COURSES_BY_SLUG[session.course_slug]?.start_time}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      {session.status === 'live' && (
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--gold)', letterSpacing: '0.08em' }}>● LIVE NOW</span>
                      )}
                      <Link
                        href={`/courses/${session.course_slug}/live`}
                        className={`btn btn-sm ${session.status === 'live' ? 'btn-gold' : 'btn-outline'}`}
                      >
                        {session.status === 'live' ? 'Join Now →' : 'Join Session →'}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Enrolled courses */}
          <section>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1.25rem' }}>
              My Courses ({enrollments.length})
            </h2>
            {enrollments.length === 0 ? (
              <div className="card">
                <div className="empty-state" style={{ padding: '2rem' }}>
                  You haven&apos;t enrolled in any courses yet.{' '}
                  <Link href="/courses" style={{ color: 'var(--gold)' }}>Explore the catalog →</Link>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                {enrollments.map(enr => {
                  const meta = TRACK_META[enr.course.track as keyof typeof TRACK_META]
                  return (
                    <Link key={enr.id} href={`/courses/${enr.course.slug}`} style={{ textDecoration: 'none' }}>
                      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <span className={`track-badge track-${enr.course.track}`}>{meta.icon} {meta.label}</span>
                        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem' }}>{enr.course.name}</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)' }}>
                          {enr.course.day_of_week.toUpperCase()} · {enr.course.start_time}
                        </div>
                        <span className="btn btn-ghost btn-sm" style={{ justifyContent: 'center' }}>View Course →</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Quick links */}
          <div className="card">
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>Quick Links</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { href: '/courses', label: '⬡ Browse All Courses' },
                { href: '/schedule', label: '◎ Weekly Schedule' },
                { href: '/curriculum', label: '◈ Curriculum Overview' },
              ].map(({ href, label }) => (
                <Link key={href} href={href} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.06em', padding: '0.5rem 0', borderBottom: '1px solid var(--border2)', display: 'block' }}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Membership */}
          <div className="card">
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Your Membership</div>
            <TierBadge tier={profile?.membership_tier ?? 'community'} />
            <p style={{ color: 'var(--muted)', fontSize: '0.82rem', lineHeight: 1.6, marginTop: '0.75rem' }}>
              {TIER_DESCRIPTIONS[profile?.membership_tier ?? 'community']}
            </p>
            <Link href="/#membership" className="btn btn-ghost btn-sm" style={{ marginTop: '1rem', justifyContent: 'center' }}>
              Upgrade Membership →
            </Link>
          </div>

          {/* Account */}
          <div className="card">
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Account</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', marginBottom: '1rem' }}>{user?.email}</div>
            <button
              onClick={async () => { await supabase.auth.signOut(); router.push('/') }}
              className="btn btn-ghost btn-sm"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const TIER_DESCRIPTIONS: Record<string, string> = {
  community: 'Digital access — online course library and community chat.',
  seeker: 'Campus access on weekends, 4 live classes per month.',
  founder: 'Full campus access, unlimited live classes, founder cohort and AI lab.',
  visionary: 'Full founder access plus 1:1 mentorship, investor network, and private events.',
}

function TierBadge({ tier }: { tier: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    community: { label: 'Community',  cls: 'track-community' },
    seeker:    { label: 'Seeker',     cls: 'track-wellness'  },
    founder:   { label: 'Founder',    cls: 'track-founder'   },
    visionary: { label: 'Visionary',  cls: 'track-ai'        },
  }
  const m = map[tier] ?? map.community
  return <span className={`track-badge ${m.cls}`}>◎ {m.label}</span>
}
