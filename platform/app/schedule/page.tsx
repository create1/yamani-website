'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ALL_COURSES, TRACK_META } from '@/lib/courses'
import type { TrackName, CourseData } from '@/lib/courses'

// ─── CONSTANTS ────────────────────────────────────────────────
const DAYS = [
  { key: 'mon', label: 'Monday'    },
  { key: 'tue', label: 'Tuesday'   },
  { key: 'wed', label: 'Wednesday' },
  { key: 'thu', label: 'Thursday'  },
  { key: 'fri', label: 'Friday'    },
  { key: 'sat', label: 'Saturday'  },
  { key: 'sun', label: 'Sunday'    },
]

const ROTATION_ANCHOR = new Date(2026, 1, 23) // Feb 23 2026 = Week 0 Monday

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
  return `${fmt(mon)} — ${fmt(sun)}, ${sun.getFullYear()}`
}

function getDayDate(weekOffset: number, dayIdx: number): Date {
  const mon = getWeekMonday(weekOffset)
  const d = new Date(mon)
  d.setDate(d.getDate() + dayIdx)
  return d
}

const TRACK_NAMES: TrackName[] = ['wellness', 'ai', 'founder', 'community']

export default function SchedulePage() {
  const [weekOffset, setWeekOffset] = useState(0)
  const [activeDay, setActiveDay] = useState('mon')
  const [activeFilters, setActiveFilters] = useState<Set<TrackName>>(new Set(TRACK_NAMES))
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const rotationIdx = getRotationIndex(weekOffset)

  // Get courses for the active day, accounting for rotation
  const dayEvents = useMemo(() => {
    return ALL_COURSES.filter(c => {
      if (c.day_of_week !== activeDay) return false
      if (!activeFilters.has(c.track)) return false
      if (c.rotation_week === null) return true
      return c.rotation_week === rotationIdx
    }).sort((a, b) => a.start_time.localeCompare(b.start_time))
  }, [activeDay, rotationIdx, activeFilters])

  const toggleFilter = (track: TrackName) => {
    setActiveFilters(prev => {
      const next = new Set(prev)
      if (next.has(track)) { next.delete(track) } else { next.add(track) }
      return next
    })
  }

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Header */}
      <section style={{ padding: '3rem 0 2.5rem', borderBottom: '1px solid var(--border2)', background: 'var(--surface)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <p className="eyebrow">Weekly Schedule</p>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3rem)' }}>Campus Programming</h1>
              <p style={{ color: 'var(--muted)', marginTop: '0.5rem', maxWidth: '50ch' }}>
                Body & spirit 6am–12pm · AI & learning 12pm–6pm · Creative expression 6pm–12am.
                The 6-week rotation ensures all courses appear each month.
              </p>
            </div>
            <Link href="/courses" className="btn btn-gold">Enroll in a Course →</Link>
          </div>
        </div>
      </section>

      {/* Week nav */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border2)', position: 'sticky', top: 'var(--nav-h)', zIndex: 100 }}>
        <div className="container" style={{ padding: '1rem 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            {/* Week selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={() => setWeekOffset(w => w - 1)}
                style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', border: '1px solid var(--border)', background: 'none', color: 'var(--gold)', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
              >
                ‹
              </button>
              <div style={{ width: '22rem', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text)', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                  {formatWeekLabel(weekOffset)}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--gold)', letterSpacing: '0.08em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Rotation {rotationIdx + 1} of 6
                  {weekOffset === 0 && ' · Current Week'}
                </div>
              </div>
              <button
                onClick={() => setWeekOffset(w => w + 1)}
                style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', border: '1px solid var(--border)', background: 'none', color: 'var(--gold)', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
              >
                ›
              </button>
              {weekOffset !== 0 && (
                <button onClick={() => setWeekOffset(0)} className="btn btn-ghost btn-sm">Today</button>
              )}
            </div>

            {/* Filters + view toggle */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              {TRACK_NAMES.map(track => (
                <button
                  key={track}
                  onClick={() => toggleFilter(track)}
                  className={`btn btn-sm ${activeFilters.has(track) ? 'btn-gold' : 'btn-ghost'}`}
                  style={{ opacity: activeFilters.has(track) ? 1 : 0.5 }}
                >
                  {TRACK_META[track].icon} {TRACK_META[track].label}
                </button>
              ))}
              <div style={{ width: '1px', height: '1.5rem', background: 'var(--border2)', margin: '0 0.25rem' }} />
              <button className={`btn btn-sm ${viewMode === 'grid' ? 'btn-gold' : 'btn-ghost'}`} onClick={() => setViewMode('grid')}>Grid</button>
              <button className={`btn btn-sm ${viewMode === 'list' ? 'btn-gold' : 'btn-ghost'}`} onClick={() => setViewMode('list')}>List</button>
            </div>
          </div>
        </div>
      </div>

      {/* Day tabs */}
      <div style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border2)', overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: 0, minWidth: 'max-content', padding: '0 2rem' }}>
          {DAYS.map((day, idx) => {
            const date = getDayDate(weekOffset, idx === 6 ? 6 : idx)
            const isActive = activeDay === day.key
            return (
              <button
                key={day.key}
                onClick={() => setActiveDay(day.key)}
                style={{
                  padding: '1rem 1.5rem',
                  fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  background: 'none', border: 'none', cursor: 'pointer',
                  borderBottom: isActive ? '2px solid var(--gold)' : '2px solid transparent',
                  color: isActive ? 'var(--gold)' : 'var(--muted)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem',
                  transition: 'color 0.2s',
                }}
              >
                <span>{day.label.slice(0, 3)}</span>
                <span style={{ fontSize: '0.75rem', color: isActive ? 'var(--text)' : 'var(--muted)' }}>
                  {date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Events */}
      <div className="container" style={{ paddingTop: '2rem' }}>
        {dayEvents.length === 0 ? (
          <div className="empty-state" style={{ marginTop: '3rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>◎</div>
            No events match your filters for this day.
          </div>
        ) : viewMode === 'grid' ? (
          <GridView events={dayEvents} weekOffset={weekOffset} activeDay={activeDay} dayIdx={DAYS.findIndex(d => d.key === activeDay)} />
        ) : (
          <ListView events={dayEvents} />
        )}
      </div>
    </div>
  )
}

// ─── TIME GRID VIEW ────────────────────────────────────────────
function GridView({ events, weekOffset, activeDay, dayIdx }: { events: CourseData[]; weekOffset: number; activeDay: string; dayIdx: number }) {
  const date = getDayDate(weekOffset, dayIdx === 6 ? 6 : dayIdx)

  return (
    <div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', marginBottom: '1.5rem', letterSpacing: '0.06em' }}>
        {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        {' — '}{events.length} event{events.length !== 1 ? 's' : ''}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {events.map(course => (
          <EventBlock key={course.slug} course={course} />
        ))}
      </div>
    </div>
  )
}

function EventBlock({ course }: { course: CourseData }) {
  const meta = TRACK_META[course.track]
  const durationHrs = Math.floor(course.duration_min / 60)
  const durationMins = course.duration_min % 60
  const durStr = durationMins > 0 ? `${durationHrs}h ${durationMins}m` : `${durationHrs}h`

  // Calculate end time
  const [h, m] = course.start_time.split(':').map(Number)
  const endMin = h * 60 + m + course.duration_min
  const endH = Math.floor(endMin / 60) % 24
  const endM = endMin % 60
  const endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`

  return (
    <Link href={`/courses/${course.slug}`} style={{ textDecoration: 'none' }}>
      <div className="card" style={{
        display: 'grid', gridTemplateColumns: '5rem 1fr auto',
        gap: '1.5rem', alignItems: 'center',
        borderLeft: `3px solid ${meta.color}`,
      }}>
        {/* Time */}
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', lineHeight: 1.5 }}>
          <div style={{ color: 'var(--text)', fontWeight: 500 }}>{course.start_time}</div>
          <div>{endTime}</div>
          <div style={{ color: 'var(--gold)', marginTop: '0.25rem' }}>{durStr}</div>
        </div>

        {/* Info */}
        <div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
            <span className={`track-badge track-${course.track}`}>{meta.icon} {meta.label}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)' }}>{course.space}</span>
            {course.rotation_week !== null && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--gold)', background: 'var(--gold-glow)', border: '1px solid var(--border)', borderRadius: '2rem', padding: '0.15rem 0.4rem' }}>
                W{course.rotation_week + 1}
              </span>
            )}
          </div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', marginBottom: '0.25rem' }}>{course.name}</h3>
          <p style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>{course.instructor}</p>
        </div>

        {/* CTA */}
        <span className="btn btn-outline btn-sm">View →</span>
      </div>
    </Link>
  )
}

// ─── LIST VIEW ─────────────────────────────────────────────────
function ListView({ events }: { events: CourseData[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {events.map((course, i) => {
        const meta = TRACK_META[course.track]
        const durationHrs = Math.floor(course.duration_min / 60)
        const durationMins = course.duration_min % 60
        const durStr = durationMins > 0 ? `${durationHrs}h ${durationMins}m` : `${durationHrs}h`

        return (
          <Link key={course.slug} href={`/courses/${course.slug}`} style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '4rem 1fr 8rem 6rem',
              gap: '1.5rem', alignItems: 'center',
              padding: '1rem 0', borderBottom: '1px solid var(--border2)',
              transition: 'background 0.15s',
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)' }}>
                {course.start_time}
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem' }}>{course.name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', marginTop: '0.2rem' }}>{course.space}</div>
              </div>
              <span className={`track-badge track-${course.track}`}>{meta.icon} {meta.label}</span>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', textAlign: 'right' }}>{durStr}</div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
