'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ALL_COURSES, TRACK_META } from '@/lib/courses'
import type { TrackName, CourseData } from '@/lib/courses'

const DAYS = [
  { key: 'mon', label: 'Monday'    },
  { key: 'tue', label: 'Tuesday'   },
  { key: 'wed', label: 'Wednesday' },
  { key: 'thu', label: 'Thursday'  },
  { key: 'fri', label: 'Friday'    },
  { key: 'sat', label: 'Saturday'  },
  { key: 'sun', label: 'Sunday'    },
]

const TRACK_NAMES: TrackName[] = ['wellness', 'ai', 'founder', 'community']

const COLORS: Record<TrackName, string> = {
  wellness:  '#C9A84C',
  ai:        '#7BB3BE',
  founder:   '#D4856A',
  community: '#8DA88F',
}

const ROTATION_ANCHOR = new Date(2026, 1, 23)

function getWeekMonday(offset: number): Date {
  const d = new Date(ROTATION_ANCHOR)
  d.setDate(d.getDate() + offset * 7)
  return d
}

function getRotationIndex(offset: number): number {
  return ((offset % 6) + 6) % 6
}

function formatWeekLabel(offset: number): string {
  const mon = getWeekMonday(offset)
  const sun = new Date(mon); sun.setDate(sun.getDate() + 6)
  const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return `${fmt(mon)} – ${fmt(sun)}, ${sun.getFullYear()}`
}

function getDayDate(weekOffset: number, dayIdx: number): Date {
  const mon = getWeekMonday(weekOffset)
  const d = new Date(mon)
  d.setDate(d.getDate() + dayIdx)
  return d
}

function endTime(startTime: string, durationMin: number): string {
  const [h, m] = startTime.split(':').map(Number)
  const total = h * 60 + m + durationMin
  return `${String(Math.floor(total / 60) % 24).padStart(2,'0')}:${String(total % 60).padStart(2,'0')}`
}

export default function SchedulePage() {
  const [weekOffset, setWeekOffset] = useState(0)
  const [activeFilters, setActiveFilters] = useState<Set<TrackName>>(new Set(TRACK_NAMES))
  const rotationIdx = getRotationIndex(weekOffset)

  const toggleFilter = (track: TrackName) => {
    setActiveFilters(prev => {
      const next = new Set(prev)
      next.has(track) ? next.delete(track) : next.add(track)
      return next
    })
  }

  const coursesByDay = useMemo(() => {
    const map: Record<string, CourseData[]> = {}
    DAYS.forEach(d => { map[d.key] = [] })

    // Group by day → time slot, keep only one course per slot
    const byDayAndTime: Record<string, Record<string, CourseData>> = {}
    DAYS.forEach(d => { byDayAndTime[d.key] = {} })

    // Track priority: wellness first in morning, ai/founder midday, community evening
    const trackPriority: Record<TrackName, number> = { wellness: 0, ai: 1, founder: 2, community: 3 }

    ALL_COURSES.forEach(c => {
      if (!activeFilters.has(c.track)) return
      if (c.rotation_week !== null && c.rotation_week !== rotationIdx) return
      const slot = byDayAndTime[c.day_of_week]
      if (!slot) return
      const existing = slot[c.start_time]
      // Keep highest-priority track for this time slot
      if (!existing || trackPriority[c.track] < trackPriority[existing.track]) {
        slot[c.start_time] = c
      }
    })

    Object.keys(byDayAndTime).forEach(day => {
      const sorted = Object.values(byDayAndTime[day]).sort((a, b) => a.start_time.localeCompare(b.start_time))
      // Remove any course that overlaps the previous one
      const noOverlap: CourseData[] = []
      let lastEndMin = 0
      for (const course of sorted) {
        const [h, m] = course.start_time.split(':').map(Number)
        const startMin = h * 60 + m
        if (startMin >= lastEndMin) {
          noOverlap.push(course)
          lastEndMin = startMin + course.duration_min
        }
      }
      map[day] = noOverlap
    })
    return map
  }, [rotationIdx, activeFilters])

  const totalEvents = Object.values(coursesByDay).reduce((s, a) => s + a.length, 0)
  const todayIdx = (new Date().getDay() + 6) % 7

  return (
    <div style={{ paddingBottom: '4rem' }}>

      {/* Header */}
      <section style={{ padding: '2.5rem 0 2rem', background: 'var(--surface)', borderBottom: '1px solid var(--border2)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p className="eyebrow">Weekly Schedule</p>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3rem)' }}>Campus Programming</h1>
              <p style={{ color: 'var(--muted)', marginTop: '0.5rem', fontSize: '0.88rem' }}>
                Wellness 6am–12pm · AI & learning 12pm–6pm · Creative expression 6pm–midnight
              </p>
            </div>
            <Link href="/courses" className="btn btn-gold">Enroll →</Link>
          </div>
        </div>
      </section>

      {/* Controls */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border2)', position: 'sticky', top: 'var(--nav-h)', zIndex: 50 }}>
        <div className="container" style={{ padding: '0.75rem 2rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {/* Week nav */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button onClick={() => setWeekOffset(w => w - 1)} style={navBtnStyle}>‹</button>
              <div style={{ textAlign: 'center', minWidth: '18rem' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text)', letterSpacing: '0.04em' }}>{formatWeekLabel(weekOffset)}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--gold)' }}>
                  Rotation {rotationIdx + 1} of 6{weekOffset === 0 && ' · Current Week'} · {totalEvents} events
                </div>
              </div>
              <button onClick={() => setWeekOffset(w => w + 1)} style={navBtnStyle}>›</button>
              {weekOffset !== 0 && <button onClick={() => setWeekOffset(0)} className="btn btn-ghost btn-sm">Today</button>}
            </div>
            {/* Filters */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {TRACK_NAMES.map(t => (
                <button key={t} onClick={() => toggleFilter(t)}
                  className={`btn btn-sm ${activeFilters.has(t) ? 'btn-gold' : 'btn-ghost'}`}
                  style={{ opacity: activeFilters.has(t) ? 1 : 0.5 }}>
                  {TRACK_META[t].icon} {TRACK_META[t].label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Week grid - 7 day columns */}
      <div style={{ overflowX: 'auto' }}>
        <div style={{ minWidth: '900px', display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0', borderBottom: '1px solid var(--border2)' }}>
          {DAYS.map((day, idx) => {
            const date = getDayDate(weekOffset, idx)
            const isToday = weekOffset === 0 && idx === todayIdx
            const events = coursesByDay[day.key] ?? []

            return (
              <div key={day.key} style={{ borderLeft: idx > 0 ? '1px solid var(--border2)' : 'none', minHeight: '200px' }}>
                {/* Day header */}
                <div style={{
                  padding: '0.75rem 0.5rem',
                  textAlign: 'center',
                  borderBottom: '1px solid var(--border2)',
                  background: isToday ? 'rgba(201,168,76,0.06)' : 'var(--surface)',
                  position: 'sticky',
                  top: 'calc(var(--nav-h) + 3.2rem)',
                  zIndex: 40,
                }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: isToday ? 'var(--gold)' : 'var(--muted)' }}>
                    {day.label.slice(0, 3)}
                  </div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: isToday ? 'var(--gold)' : 'var(--text)', fontWeight: isToday ? 700 : 400 }}>
                    {date.getDate()}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: 'var(--muted)' }}>
                    {events.length} class{events.length !== 1 ? 'es' : ''}
                  </div>
                </div>

                {/* Events */}
                <div style={{ padding: '0.5rem 0.35rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  {events.length === 0 ? (
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', textAlign: 'center', padding: '2rem 0' }}>—</div>
                  ) : (
                    events.map(course => (
                      <EventTile key={course.slug} course={course} />
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="container" style={{ marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)' }}>
          {TRACK_NAMES.map(t => (
            <span key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[t], display: 'inline-block', flexShrink: 0 }} />
              {TRACK_META[t].label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

const navBtnStyle: React.CSSProperties = {
  width: '2rem', height: '2rem', borderRadius: '50%',
  border: '1px solid var(--border)', background: 'none',
  color: 'var(--gold)', fontSize: '1.1rem', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
}

function EventTile({ course }: { course: CourseData }) {
  const color = COLORS[course.track]
  const end = endTime(course.start_time, course.duration_min)

  return (
    <a
      href={`/courses/${course.slug}`}
      style={{
        display: 'block',
        textDecoration: 'none',
        background: 'var(--surface)',
        border: '1px solid var(--border2)',
        borderLeft: `3px solid ${color}`,
        borderRadius: '4px',
        padding: '0.4rem 0.5rem',
        cursor: 'pointer',
        transition: 'background 0.15s, border-color 0.15s',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLAnchorElement
        el.style.background = `${color}18`
        el.style.borderColor = color
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLAnchorElement
        el.style.background = 'var(--surface)'
        el.style.borderColor = 'var(--border2)'
      }}
    >
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.48rem', color, letterSpacing: '0.04em', marginBottom: '0.15rem' }}>
        {course.start_time}–{end} · {TRACK_META[course.track].icon}
      </div>
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '0.72rem', color: 'var(--text)', lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
        {course.name}
      </div>
    </a>
  )
}
