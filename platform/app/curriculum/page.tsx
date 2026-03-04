'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ALL_COURSES, COURSES_BY_TRACK, TRACK_META } from '@/lib/courses'
import type { TrackName, CourseData } from '@/lib/courses'
import InterestButton from '@/components/InterestButton'

const TRACKS: TrackName[] = ['wellness', 'ai', 'founder', 'community']

const COLORS: Record<TrackName, string> = {
  wellness:  '#C9A84C',
  ai:        '#7BB3BE',
  founder:   '#D4856A',
  community: '#8DA88F',
}

function endTime(startTime: string, durationMin: number): string {
  const [h, m] = startTime.split(':').map(Number)
  const total = h * 60 + m + durationMin
  return `${String(Math.floor(total / 60) % 24).padStart(2,'0')}:${String(total % 60).padStart(2,'0')}`
}

export default function CurriculumPage() {
  const [activeTrack, setActiveTrack] = useState<TrackName | 'all'>('all')
  const tracks = activeTrack === 'all' ? TRACKS : [activeTrack as TrackName]
  const count = activeTrack === 'all' ? ALL_COURSES.length : (COURSES_BY_TRACK[activeTrack as TrackName]?.length ?? 0)

  return (
    <div style={{ paddingBottom: '5rem' }}>

      {/* Hero */}
      <section style={{
        padding: 'clamp(2rem, 5vw, 4rem) 0 clamp(1.5rem, 4vw, 3rem)',
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,168,76,0.07) 0%, transparent 70%)',
        borderBottom: '1px solid var(--border2)',
        textAlign: 'center',
      }}>
        <div className="container">
          <p className="eyebrow">The Curriculum</p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 6vw, 4rem)', margin: '0 auto', lineHeight: 1.1 }}>
            {ALL_COURSES.length} Courses · Three Tracks
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.95rem', maxWidth: '50ch', margin: '1rem auto', lineHeight: 1.7 }}>
            Click any class to see the full curriculum, schedule, and enrollment options.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <Link href="/schedule" className="btn btn-outline">View Weekly Schedule →</Link>
          </div>
        </div>
      </section>

      {/* Track filter */}
      <div style={{ position: 'sticky', top: 'var(--nav-h)', zIndex: 50, background: 'var(--surface)', borderBottom: '1px solid var(--border2)' }}>
        <div className="container" style={{ padding: '0.6rem 1rem' }}>
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
            <button onClick={() => setActiveTrack('all')} className={`btn btn-sm ${activeTrack === 'all' ? 'btn-gold' : 'btn-ghost'}`} style={{ flexShrink: 0 }}>
              All
            </button>
            {TRACKS.map(track => (
              <button key={track} onClick={() => setActiveTrack(track)} className={`btn btn-sm ${activeTrack === track ? 'btn-gold' : 'btn-ghost'}`} style={{ flexShrink: 0 }}>
                {TRACK_META[track].icon} {TRACK_META[track].label}
              </button>
            ))}
            <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', flexShrink: 0, paddingLeft: '0.5rem' }}>
              {count} courses
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
  const color = COLORS[track]
  const courses = COURSES_BY_TRACK[track]
  const recurring = courses.filter(c => c.rotation_week === null)
  const rotating = courses.filter(c => c.rotation_week !== null).sort((a, b) => (a.rotation_week ?? 0) - (b.rotation_week ?? 0))

  return (
    <section id={track} style={{ borderBottom: '2px solid var(--border2)', padding: '3rem 0' }}>
      <div className="container">
        {/* Track header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: `${color}20`, border: `1px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>
              {meta.icon}
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: 'var(--text)' }}>{meta.label}</h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>{meta.description}</p>
            </div>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)' }}>{courses.length} courses</span>
        </div>

        {recurring.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <GroupLabel color={color}>Weekly Recurring</GroupLabel>
            <CourseGrid courses={recurring} color={color} />
          </div>
        )}

        {rotating.length > 0 && (
          <div>
            <GroupLabel color={color}>6-Week Rotation</GroupLabel>
            <CourseGrid courses={rotating} color={color} />
          </div>
        )}
      </div>
    </section>
  )
}

function GroupLabel({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
      <span style={{ width: '1.5rem', height: '1px', background: color, display: 'inline-block' }} />
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
        {children}
      </span>
    </div>
  )
}

function CourseGrid({ courses, color }: { courses: CourseData[]; color: string }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '0.75rem' }}>
      {courses.map(course => <CourseTile key={course.slug} course={course} color={color} />)}
    </div>
  )
}

function CourseTile({ course, color }: { course: CourseData; color: string }) {
  const durHrs = Math.floor(course.duration_min / 60)
  const durMins = course.duration_min % 60
  const dur = durMins > 0 ? `${durHrs}h ${durMins}m` : `${durHrs}h`
  const day = course.day_of_week.charAt(0).toUpperCase() + course.day_of_week.slice(1, 3)
  const end = endTime(course.start_time, course.duration_min)

  return (
    <a
      href={`/courses/${course.slug}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        textDecoration: 'none',
        background: 'var(--surface)',
        border: '1px solid var(--border2)',
        borderLeft: `3px solid ${color}`,
        borderRadius: 'var(--radius)',
        padding: '1rem 1.1rem',
        cursor: 'pointer',
        transition: 'border-color 0.15s, background 0.15s',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLAnchorElement
        el.style.background = `${color}12`
        el.style.borderColor = color
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLAnchorElement
        el.style.background = 'var(--surface)'
        el.style.borderColor = 'var(--border2)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', lineHeight: 1.3, color: 'var(--text)', flex: 1 }}>
          {course.name}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
          {course.rotation_week !== null && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color, background: `${color}18`, border: `1px solid ${color}40`, borderRadius: '2rem', padding: '0.15rem 0.4rem', whiteSpace: 'nowrap' }}>
              W{course.rotation_week + 1}
            </span>
          )}
          <InterestButton slug={course.slug} size="sm" />
        </div>
      </div>

      <p style={{ color: 'var(--muted)', fontSize: '0.78rem', lineHeight: 1.5 }}>
        {course.description.length > 100 ? course.description.slice(0, 100) + '…' : course.description}
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)' }}>
          {day} · {course.start_time}–{end} · {dur}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color }}>→</span>
      </div>
    </a>
  )
}
