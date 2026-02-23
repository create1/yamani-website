'use client'
import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { COURSES_BY_SLUG, TRACK_META } from '@/lib/courses'
import { supabase } from '@/lib/supabase'
import type { Session } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

interface PageProps { params: Promise<{ slug: string }> }

export default function CourseDetailPage({ params }: PageProps) {
  const { slug } = use(params)
  const course = COURSES_BY_SLUG[slug]
  if (!course) notFound()

  const meta = TRACK_META[course.track]
  const [user, setUser] = useState<User | null>(null)
  const [enrolled, setEnrolled] = useState(false)
  const [enrolling, setEnrolling] = useState(false)
  const [sessions, setSessions] = useState<Session[]>([])
  const [courseId, setCourseId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null))
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    // Fetch course DB record and upcoming sessions
    async function load() {
      const { data: courseRow } = await supabase
        .from('courses').select('id').eq('slug', slug).single()
      if (!courseRow) return
      setCourseId(courseRow.id)

      const { data: sessionRows } = await supabase
        .from('sessions')
        .select('*')
        .eq('course_id', courseRow.id)
        .gte('scheduled_date', new Date().toISOString().split('T')[0])
        .order('scheduled_date', { ascending: true })
        .limit(6)
      setSessions(sessionRows ?? [])

      if (user) {
        const { data: enr } = await supabase
          .from('enrollments')
          .select('id').eq('user_id', user.id).eq('course_id', courseRow.id).single()
        setEnrolled(!!enr)
      }
    }
    load()
  }, [slug, user])

  const handleEnroll = async () => {
    if (!user) { window.location.href = '/auth/signin'; return }
    if (!courseId) return
    setEnrolling(true)
    const { error } = await supabase.from('enrollments').insert({ user_id: user.id, course_id: courseId })
    if (!error) setEnrolled(true)
    setEnrolling(false)
  }

  const handleUnenroll = async () => {
    if (!user || !courseId) return
    await supabase.from('enrollments').delete().eq('user_id', user.id).eq('course_id', courseId)
    setEnrolled(false)
  }

  const durationHrs = Math.floor(course.duration_min / 60)
  const durationMins = course.duration_min % 60
  const durStr = durationMins > 0 ? `${durationHrs}h ${durationMins}m` : `${durationHrs}h`

  return (
    <div style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      {/* Breadcrumb */}
      <div className="container" style={{ marginBottom: '2rem' }}>
        <nav style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', letterSpacing: '0.08em', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Link href="/courses" style={{ color: 'var(--muted)' }}>Courses</Link>
          <span>›</span>
          <span style={{ color: 'var(--gold)' }}>{TRACK_META[course.track].label}</span>
          <span>›</span>
          <span>{course.name}</span>
        </nav>
      </div>

      {/* Hero */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border2)', padding: '3rem 0', marginBottom: '3rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem', alignItems: 'start' }}>
            <div>
              <span className={`track-badge track-${course.track}`} style={{ marginBottom: '1.25rem', display: 'inline-flex' }}>
                {meta.icon} {meta.label}
              </span>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', marginBottom: '1.25rem', lineHeight: 1.2 }}>
                {course.name}
              </h1>
              <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: 1.8, maxWidth: '60ch' }}>
                {course.description}
              </p>
              {/* Meta chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginTop: '2rem' }}>
                <MetaChip icon="⏱" label={durStr} />
                <MetaChip icon="⬡" label={course.space} />
                <MetaChip icon="◎" label={course.instructor} />
                <MetaChip icon="👥" label={`${course.capacity} max`} />
                <MetaChip icon="↻" label={course.rotation_week === null ? 'Every week' : `Rotation ${course.rotation_week + 1} of 6`} />
              </div>
            </div>

            {/* Enroll card */}
            <div className="card" style={{ position: 'sticky', top: 'calc(var(--nav-h) + 1rem)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', letterSpacing: '0.08em', marginBottom: '1rem' }}>
                {course.day_of_week.toUpperCase()} · {course.start_time} · {durStr}
              </div>
              {enrolled && (
                <div style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '0.75rem', marginBottom: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--gold)', textAlign: 'center', letterSpacing: '0.08em' }}>
                  ✓ You&apos;re enrolled in this course
                </div>
              )}
              {enrolled ? (
                <>
                  {sessions[0] && (
                    <Link href={`/courses/${slug}/live`} className="btn btn-gold" style={{ width: '100%', justifyContent: 'center', marginBottom: '0.75rem' }}>
                      ● Join Live Session →
                    </Link>
                  )}
                  <button onClick={handleUnenroll} className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                    Unenroll
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="btn btn-gold"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {enrolling ? 'Enrolling…' : user ? 'Enroll Now →' : 'Sign In to Enroll →'}
                </button>
              )}
              {/* Upcoming sessions preview */}
              {sessions.length > 0 && (
                <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border2)', paddingTop: '1rem' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                    Upcoming Sessions
                  </div>
                  {sessions.slice(0, 3).map(s => (
                    <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0', borderBottom: '1px solid var(--border2)', fontFamily: 'var(--font-mono)', fontSize: '0.6rem' }}>
                      <span style={{ color: 'var(--muted)' }}>
                        {new Date(s.scheduled_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span style={{ color: s.status === 'live' ? 'var(--gold)' : 'var(--muted)' }}>
                        {s.status === 'live' ? '● Live' : s.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem', alignItems: 'start' }}>
          <div>
            {/* Objectives */}
            <section style={{ marginBottom: '3rem' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', marginBottom: '1.25rem' }}>What You&apos;ll Learn</h2>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {course.objectives.map((obj, i) => (
                  <li key={i} style={{ display: 'flex', gap: '0.75rem', color: 'var(--text)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                    <span style={{ color: 'var(--gold)', flexShrink: 0, marginTop: '0.2rem' }}>◎</span>
                    {obj}
                  </li>
                ))}
              </ul>
            </section>

            {/* Outline */}
            <section style={{ marginBottom: '3rem' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', marginBottom: '1.25rem' }}>
                {course.rotation_week !== null ? '6-Week Curriculum' : 'Course Outline'}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {course.outline.map((block, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '3rem 1fr', gap: '1rem', padding: '1.25rem 0', borderBottom: '1px solid var(--border2)' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--gold)', paddingTop: '0.2rem' }}>
                      {block.week !== undefined ? `W${block.week}` : String(i + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', fontWeight: 600, marginBottom: '0.3rem' }}>{block.title}</div>
                      <div style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>{block.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Class template */}
            <section>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', marginBottom: '1.25rem' }}>Each Session: {durStr} Template</h2>
              <ClassTemplate durationMin={course.duration_min} />
            </section>
          </div>

          {/* Sidebar: related courses */}
          <div style={{ position: 'sticky', top: 'calc(var(--nav-h) + 1rem)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card">
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                {meta.label} Track
              </div>
              <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.7 }}>{meta.description}</p>
              <Link href={`/courses?track=${course.track}`} className="btn btn-ghost btn-sm" style={{ marginTop: '1rem', justifyContent: 'center' }}>
                View All {meta.label} Courses →
              </Link>
            </div>
            <div className="card">
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                Online Access
              </div>
              <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.7 }}>
                Every session is live-streamed. Join remotely with full access to the shared chat room, session recordings, and downloadable materials.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MetaChip({ icon, label }: { icon: string; label: string }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', letterSpacing: '0.06em' }}>
      <span style={{ color: 'var(--gold)' }}>{icon}</span> {label}
    </span>
  )
}

function ClassTemplate({ durationMin }: { durationMin: number }) {
  const isShort = durationMin <= 90
  const segments = isShort
    ? [
        { pct: 8,  label: 'Welcome & Check-In', note: '~5 min', color: 'var(--gold-glow)' },
        { pct: 55, label: 'Lesson Block',        note: `~${Math.round(durationMin * 0.55)} min`, color: 'rgba(80,128,142,0.15)' },
        { pct: 12, label: 'Break',               note: '~10 min', color: 'rgba(201,168,76,0.05)' },
        { pct: 25, label: 'Practice / Q&A',      note: `~${Math.round(durationMin * 0.25)} min`, color: 'rgba(122,158,126,0.15)' },
      ]
    : [
        { pct: 4,  label: 'Welcome',             note: '5 min',  color: 'var(--gold-glow)' },
        { pct: 37, label: 'Lesson Block 1',      note: '45 min', color: 'rgba(80,128,142,0.15)' },
        { pct: 8,  label: 'Break',               note: '10 min', color: 'rgba(201,168,76,0.05)' },
        { pct: 37, label: 'Hands-On Lab',        note: '45 min', color: 'rgba(196,97,58,0.12)' },
        { pct: 13, label: 'Wrap-Up & Q&A',       note: '15 min', color: 'rgba(122,158,126,0.15)' },
      ]

  return (
    <div>
      <div style={{ display: 'flex', height: '2.5rem', borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border2)', marginBottom: '1rem' }}>
        {segments.map((s, i) => (
          <div key={i} style={{ width: `${s.pct}%`, background: s.color, borderRight: i < segments.length - 1 ? '1px solid var(--border2)' : 'none' }} title={s.label} />
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {segments.map((s, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.62rem' }}>
            <span style={{ color: 'var(--text)' }}>{s.label}</span>
            <span style={{ color: 'var(--muted)' }}>{s.note}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
