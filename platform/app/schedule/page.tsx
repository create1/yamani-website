'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ALL_COURSES, TRACK_META } from '@/lib/courses'
import type { TrackName, CourseData } from '@/lib/courses'

// ─── CONSTANTS ────────────────────────────────────────────────
const DAYS = [
  { key: 'mon', label: 'Mon' },
  { key: 'tue', label: 'Tue' },
  { key: 'wed', label: 'Wed' },
  { key: 'thu', label: 'Thu' },
  { key: 'fri', label: 'Fri' },
  { key: 'sat', label: 'Sat' },
  { key: 'sun', label: 'Sun' },
]

const HOUR_START = 6   // 6am
const HOUR_END   = 24  // midnight
const HOUR_PX    = 72  // pixels per hour
const TOTAL_HOURS = HOUR_END - HOUR_START
const TOTAL_HEIGHT = TOTAL_HOURS * HOUR_PX

const TRACK_NAMES: TrackName[] = ['wellness', 'ai', 'founder', 'community']

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
  return `${fmt(mon)} – ${fmt(sun)}, ${sun.getFullYear()}`
}

function getDayDate(weekOffset: number, dayIdx: number): Date {
  const mon = getWeekMonday(weekOffset)
  const d = new Date(mon)
  d.setDate(d.getDate() + dayIdx)
  return d
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

function formatHour(h: number): string {
  if (h === 0 || h === 24) return '12am'
  if (h === 12) return '12pm'
  return h < 12 ? `${h}am` : `${h - 12}pm`
}

// ─── PAGE ──────────────────────────────────────────────────────
export default function SchedulePage() {
  const [weekOffset, setWeekOffset] = useState(0)
  const [activeFilters, setActiveFilters] = useState<Set<TrackName>>(new Set(TRACK_NAMES))

  const rotationIdx = getRotationIndex(weekOffset)

  const toggleFilter = (track: TrackName) => {
    setActiveFilters(prev => {
      const next = new Set(prev)
      if (next.has(track)) { next.delete(track) } else { next.add(track) }
      return next
    })
  }

  // Group filtered courses by day
  const coursesByDay = useMemo(() => {
    const map: Record<string, CourseData[]> = {}
    DAYS.forEach(d => { map[d.key] = [] })
    ALL_COURSES.forEach(c => {
      if (!activeFilters.has(c.track)) return
      if (c.rotation_week !== null && c.rotation_week !== rotationIdx) return
      if (map[c.day_of_week]) map[c.day_of_week].push(c)
    })
    return map
  }, [rotationIdx, activeFilters])

  const totalVisible = Object.values(coursesByDay).reduce((s, arr) => s + arr.length, 0)

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Header */}
      <section style={{ padding: '2.5rem 0 2rem', borderBottom: '1px solid var(--border2)', background: 'var(--surface)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <p className="eyebrow">Weekly Schedule</p>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3rem)' }}>Campus Programming</h1>
              <p style={{ color: 'var(--muted)', marginTop: '0.5rem', maxWidth: '52ch', fontSize: '0.9rem' }}>
                Wellness 6am–12pm · AI & learning 12pm–6pm · Creative expression 6pm–midnight.
                6-week rotation cycle — all courses appear each month.
              </p>
            </div>
            <Link href="/courses" className="btn btn-gold">Enroll in a Course →</Link>
          </div>
        </div>
      </section>

      {/* Controls bar */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border2)', position: 'sticky', top: 'var(--nav-h)', zIndex: 100 }}>
        <div className="container" style={{ padding: '0.85rem 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            {/* Week selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={() => setWeekOffset(w => w - 1)}
                style={{ width: '2.1rem', height: '2.1rem', borderRadius: '50%', border: '1px solid var(--border)', background: 'none', color: 'var(--gold)', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
              >‹</button>
              <div style={{ minWidth: '20rem', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text)', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                  {formatWeekLabel(weekOffset)}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--gold)', letterSpacing: '0.08em' }}>
                  Rotation {rotationIdx + 1} of 6{weekOffset === 0 && ' · Current Week'}
                  {' · '}{totalVisible} events
                </div>
              </div>
              <button
                onClick={() => setWeekOffset(w => w + 1)}
                style={{ width: '2.1rem', height: '2.1rem', borderRadius: '50%', border: '1px solid var(--border)', background: 'none', color: 'var(--gold)', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
              >›</button>
              {weekOffset !== 0 && (
                <button onClick={() => setWeekOffset(0)} className="btn btn-ghost btn-sm">Today</button>
              )}
            </div>

            {/* Track filters */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
              {TRACK_NAMES.map(track => (
                <button
                  key={track}
                  onClick={() => toggleFilter(track)}
                  className={`btn btn-sm ${activeFilters.has(track) ? 'btn-gold' : 'btn-ghost'}`}
                  style={{ opacity: activeFilters.has(track) ? 1 : 0.45 }}
                >
                  {TRACK_META[track].icon} {TRACK_META[track].label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Week grid */}
      <div style={{ overflowX: 'auto', marginTop: '0' }}>
        <div style={{ minWidth: '900px' }}>
          {/* Day column headers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '3.5rem repeat(7, 1fr)',
            borderBottom: '1px solid var(--border2)',
            background: 'var(--surface)',
            position: 'sticky',
            top: 'calc(var(--nav-h) + 3.6rem)',
            zIndex: 90,
          }}>
            <div /> {/* gutter */}
            {DAYS.map((day, idx) => {
              const date = getDayDate(weekOffset, idx)
              const isToday = weekOffset === 0 && idx === ((new Date().getDay() + 6) % 7)
              return (
                <div key={day.key} style={{
                  padding: '0.75rem 0.5rem',
                  textAlign: 'center',
                  borderLeft: '1px solid var(--border2)',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: isToday ? 'var(--gold)' : 'var(--muted)',
                  }}>
                    {day.label}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-serif)', fontSize: '1.2rem',
                    color: isToday ? 'var(--gold)' : 'var(--text)',
                    fontWeight: isToday ? 700 : 400,
                    marginTop: '0.1rem',
                  }}>
                    {date.getDate()}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.52rem',
                    color: 'var(--muted)', marginTop: '0.1rem',
                  }}>
                    {coursesByDay[day.key].length} events
                  </div>
                </div>
              )
            })}
          </div>

          {/* Time grid body */}
          <div style={{ display: 'grid', gridTemplateColumns: '3.5rem repeat(7, 1fr)', position: 'relative' }}>
            {/* Hour labels + horizontal lines */}
            <div style={{ position: 'relative', height: `${TOTAL_HEIGHT}px` }}>
              {Array.from({ length: TOTAL_HOURS + 1 }, (_, i) => {
                const hour = HOUR_START + i
                return (
                  <div key={hour} style={{
                    position: 'absolute', top: `${i * HOUR_PX}px`,
                    width: '100%', display: 'flex', alignItems: 'flex-start',
                    paddingRight: '0.5rem',
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: '0.52rem',
                      color: hour === 12 ? 'rgba(201,168,76,0.6)' : 'rgba(255,255,255,0.2)',
                      letterSpacing: '0.04em', whiteSpace: 'nowrap',
                      transform: 'translateY(-50%)',
                      width: '100%', textAlign: 'right',
                    }}>
                      {formatHour(hour)}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Day columns */}
            {DAYS.map((day, dayIdx) => (
              <DayColumn
                key={day.key}
                courses={coursesByDay[day.key]}
                weekOffset={weekOffset}
                dayIdx={dayIdx}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Zone legend */}
      <div className="container" style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.06em' }}>
          <span>▬ <span style={{ color: 'rgba(122,158,126,0.9)' }}>Wellness Zone</span> 6am–12pm</span>
          <span>▬ <span style={{ color: 'rgba(80,128,142,0.9)' }}>Learning Zone</span> 12pm–6pm</span>
          <span>▬ <span style={{ color: 'rgba(138,104,162,0.9)' }}>Creative Zone</span> 6pm–midnight</span>
        </div>
      </div>

      <style>{`
        .event-card:hover { filter: brightness(1.2); transform: scale(1.01); z-index: 10; }
        .event-card { transition: filter 0.15s, transform 0.15s; }
      `}</style>
    </div>
  )
}

// ─── DAY COLUMN ────────────────────────────────────────────────
function DayColumn({ courses, weekOffset, dayIdx }: {
  courses: CourseData[]
  weekOffset: number
  dayIdx: number
}) {
  const isToday = weekOffset === 0 && dayIdx === ((new Date().getDay() + 6) % 7)

  return (
    <div style={{
      position: 'relative',
      height: `${TOTAL_HEIGHT}px`,
      borderLeft: '1px solid var(--border2)',
      background: isToday ? 'rgba(201,168,76,0.02)' : 'transparent',
    }}>
      {/* Hour lines */}
      {Array.from({ length: TOTAL_HOURS + 1 }, (_, i) => {
        const hour = HOUR_START + i
        const isZoneBoundary = hour === 12 || hour === 18
        return (
          <div key={i} style={{
            position: 'absolute', top: `${i * HOUR_PX}px`,
            left: 0, right: 0,
            borderTop: isZoneBoundary
              ? '1px solid rgba(201,168,76,0.2)'
              : '1px solid rgba(255,255,255,0.04)',
            pointerEvents: 'none',
          }} />
        )
      })}

      {/* Zone backgrounds */}
      {/* Wellness: 6am–12pm */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: `${6 * HOUR_PX}px`, background: 'rgba(122,158,126,0.03)', pointerEvents: 'none' }} />
      {/* Learning: 12pm–6pm */}
      <div style={{ position: 'absolute', top: `${6 * HOUR_PX}px`, left: 0, right: 0, height: `${6 * HOUR_PX}px`, background: 'rgba(80,128,142,0.03)', pointerEvents: 'none' }} />
      {/* Creative: 6pm–midnight */}
      <div style={{ position: 'absolute', top: `${12 * HOUR_PX}px`, left: 0, right: 0, height: `${6 * HOUR_PX}px`, background: 'rgba(138,104,162,0.03)', pointerEvents: 'none' }} />

      {/* Events */}
      {courses.map(course => (
        <CalendarEvent key={course.slug} course={course} />
      ))}
    </div>
  )
}

// ─── EVENT BLOCK ───────────────────────────────────────────────
function CalendarEvent({ course }: { course: CourseData }) {
  const meta = TRACK_META[course.track]
  const startMin = timeToMinutes(course.start_time)
  const startOffset = startMin - HOUR_START * 60
  const top = (startOffset / 60) * HOUR_PX
  const height = Math.max((course.duration_min / 60) * HOUR_PX - 2, 20)

  const [h, m] = course.start_time.split(':').map(Number)
  const endMin = h * 60 + m + course.duration_min
  const endH = Math.floor(endMin / 60) % 24
  const endM = endMin % 60
  const endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`

  const isShort = height < 48

  return (
    <Link href={`/courses/${course.slug}`} style={{ textDecoration: 'none' }}>
      <div
        className="event-card"
        style={{
          position: 'absolute',
          top: `${top}px`,
          left: '2px',
          right: '2px',
          height: `${height}px`,
          background: meta.color.replace(')', ', 0.18)').replace('rgb', 'rgba'),
          border: `1px solid ${meta.color.replace(')', ', 0.4)').replace('rgb', 'rgba')}`,
          borderLeft: `3px solid ${meta.color}`,
          borderRadius: '4px',
          padding: isShort ? '0.2rem 0.4rem' : '0.35rem 0.5rem',
          overflow: 'hidden',
          cursor: 'pointer',
          zIndex: 2,
        }}
      >
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
          color: meta.color, letterSpacing: '0.04em',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {course.start_time}–{endTime}
        </div>
        {!isShort && (
          <div style={{
            fontFamily: 'var(--font-serif)', fontSize: '0.72rem',
            color: 'var(--text)', lineHeight: 1.3, marginTop: '0.1rem',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: height > 80 ? 3 : 2,
            WebkitBoxOrient: 'vertical',
          }}>
            {course.name}
          </div>
        )}
        {isShort && (
          <div style={{
            fontFamily: 'var(--font-serif)', fontSize: '0.65rem',
            color: 'var(--text)', whiteSpace: 'nowrap',
            overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {course.name}
          </div>
        )}
        {height > 90 && (
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.48rem',
            color: 'var(--muted)', marginTop: '0.2rem',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {course.space}
          </div>
        )}
      </div>
    </Link>
  )
}
