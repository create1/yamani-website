'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ALL_COURSES, COURSES_BY_TRACK, TRACK_META } from '@/lib/courses'
import type { TrackName, CourseData } from '@/lib/courses'

const TRACKS: TrackName[] = ['wellness', 'ai', 'founder', 'community']

const TRACK_COLORS: Record<TrackName, { solid: string; bg: string; border: string }> = {
  wellness:  { solid: '#C9A84C', bg: 'rgba(201,168,76,0.08)',  border: 'rgba(201,168,76,0.25)'  },
  ai:        { solid: '#7BB3BE', bg: 'rgba(80,128,142,0.08)',  border: 'rgba(80,128,142,0.25)'  },
  founder:   { solid: '#D4856A', bg: 'rgba(196,97,58,0.08)',   border: 'rgba(196,97,58,0.25)'   },
  community: { solid: '#8DA88F', bg: 'rgba(122,158,126,0.08)', border: 'rgba(122,158,126,0.25)' },
}

export default function CurriculumPage() {
  const [activeTrack, setActiveTrack] = useState<TrackName | 'all'>('all')

  const tracks = activeTrack === 'all' ? TRACKS : [activeTrack]

  return (
    <div style={{ paddingBottom: '5rem' }}>
      {/* Hero */}
      <section style={{
        padding: '4rem 0 3.5rem',
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,168,76,0.07) 0%, transparent 70%)',
        borderBottom: '1px solid var(--border2)',
        textAlign: 'center',
      }}>
        <div className="container">
          <p className="eyebrow">The Curriculum</p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 6vw, 4rem)', maxWidth: '16ch', margin: '0 auto', lineHeight: 1.1 }}>
            {ALL_COURSES.length} Courses Across Three Tracks
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '1rem', maxWidth: '52ch', margin: '1.25rem auto', lineHeight: 1.7 }}>
            Wellness · AI & Creative Production · Founder Ecosystem — live online and in-person at our Nevada City campus.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
            <Link href="/schedule" className="btn btn-outline">View Weekly Schedule →</Link>
          </div>
        </div>
      </section>

      {/* Track filter tabs */}
      <div style={{ position: 'sticky', top: 'var(--nav-h)', zIndex: 90, background: 'var(--surface)', borderBottom: '1px solid var(--border2)' }}>
        <div className="container" style={{ padding: '0.75rem 2rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={() => setActiveTrack('all')}
              className={`btn btn-sm ${activeTrack === 'all' ? 'btn-gold' : 'btn-ghost'}`}
            >
              All Tracks
            </button>
            {TRACKS.map(track => (
              <button
                key={track}
                onClick={() => setActiveTrack(track)}
                className={`btn btn-sm ${activeTrack === track ? 'btn-gold' : 'btn-ghost'}`}
              >
                {TRACK_META[track].icon} {TRACK_META[track].label}
              </button>
            ))}
            <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)' }}>
              {activeTrack === 'all' ? ALL_COURSES.length : COURSES_BY_TRACK[activeTrack as TrackName]?.length ?? 0} courses
            </span>
          </div>
        </div>
      </div>

      {/* Track sections */}
      {tracks.map(track => (
        <TrackSection key={track} track={track} />
      ))}
    </div>
  )
}

function TrackSection({ track }: { track: TrackName }) {
  const meta = TRACK_META[track]
  const colors = TRACK_COLORS[track]
  const courses = COURSES_BY_TRACK[track]
  const recurring = courses.filter(c => c.rotation_week === null)
  const rotating = courses.filter(c => c.rotation_week !== null)

  return (
    <section id={track} style={{ borderBottom: '1px solid var(--border2)', padding: '3.5rem 0' }}>
      <div className="container">
        {/* Track header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <div style={{
              width: '3.5rem', height: '3.5rem', borderRadius: '50%',
              background: colors.bg, border: `1px solid ${colors.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.5rem', flexShrink: 0,
            }}>
              {meta.icon}
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.6rem, 3vw, 2.25rem)', color: 'var(--text)' }}>
                {meta.label}
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginTop: '0.25rem', maxWidth: '48ch' }}>
                {meta.description}
              </p>
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.08em' }}>
            {courses.length} COURSES
          </div>
        </div>

        {/* Weekly recurring */}
        {recurring.length > 0 && (
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: colors.solid, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ width: '1.5rem', height: '1px', background: colors.solid, display: 'inline-block' }} />
              Weekly Recurring
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '0.75rem' }}>
              {recurring.map(course => <ClassCard key={course.slug} course={course} colors={colors} />)}
            </div>
          </div>
        )}

        {/* Rotating */}
        {rotating.length > 0 && (
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: colors.solid, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ width: '1.5rem', height: '1px', background: colors.solid, display: 'inline-block' }} />
              6-Week Rotation
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '0.75rem' }}>
              {rotating
                .sort((a, b) => (a.rotation_week ?? 0) - (b.rotation_week ?? 0))
                .map(course => <ClassCard key={course.slug} course={course} colors={colors} />)}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function ClassCard({ course, colors }: { course: CourseData; colors: { solid: string; bg: string; border: string } }) {
  const durationHrs = Math.floor(course.duration_min / 60)
  const durationMins = course.duration_min % 60
  const durStr = durationMins > 0 ? `${durationHrs}h ${durationMins}m` : `${durationHrs}h`

  const [h, m] = course.start_time.split(':').map(Number)
  const endMin = h * 60 + m + course.duration_min
  const endH = Math.floor(endMin / 60) % 24
  const endM = endMin % 60
  const endStr = `${String(endH).padStart(2,'0')}:${String(endM).padStart(2,'0')}`

  const dayLabel = course.day_of_week.charAt(0).toUpperCase() + course.day_of_week.slice(1)

  return (
    <Link href={`/courses/${course.slug}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'var(--surface)',
        border: `1px solid var(--border2)`,
        borderLeft: `3px solid ${colors.solid}`,
        borderRadius: 'var(--radius)',
        padding: '1.1rem 1.25rem',
        display: 'flex', flexDirection: 'column', gap: '0.6rem',
        cursor: 'pointer',
        transition: 'border-color 0.15s, background 0.15s, transform 0.15s',
        height: '100%',
      }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.borderColor = colors.solid
          ;(e.currentTarget as HTMLDivElement).style.background = colors.bg
          ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)'
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border2)'
          ;(e.currentTarget as HTMLDivElement).style.background = 'var(--surface)'
          ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', lineHeight: 1.3, flex: 1, color: 'var(--text)' }}>
            {course.name}
          </h3>
          {course.rotation_week !== null && (
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.52rem',
              color: colors.solid, background: colors.bg,
              border: `1px solid ${colors.border}`,
              borderRadius: '2rem', padding: '0.15rem 0.45rem',
              whiteSpace: 'nowrap', flexShrink: 0,
            }}>
              Week {course.rotation_week + 1}
            </span>
          )}
        </div>

        <p style={{ color: 'var(--muted)', fontSize: '0.8rem', lineHeight: 1.5, flexGrow: 1 }}>
          {course.description.length > 110 ? course.description.slice(0, 110) + '…' : course.description}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Tag>{dayLabel} · {course.start_time}–{endStr}</Tag>
            <Tag>{durStr}</Tag>
            {course.space && <Tag>{course.space}</Tag>}
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: colors.solid }}>→</span>
        </div>
      </div>
    </Link>
  )
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', color: 'var(--muted)', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
      {children}
    </span>
  )
}
