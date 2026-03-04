'use client'
import { useInterests } from '@/context/InterestContext'
import { ALL_COURSES, TRACK_META } from '@/lib/courses'
import type { TrackName, CourseData } from '@/lib/courses'
import InterestButton from '@/components/InterestButton'
import Link from 'next/link'

const DAYS_ORDERED = [
  { key: 'mon', short: 'Mon', full: 'Monday'    },
  { key: 'tue', short: 'Tue', full: 'Tuesday'   },
  { key: 'wed', short: 'Wed', full: 'Wednesday' },
  { key: 'thu', short: 'Thu', full: 'Thursday'  },
  { key: 'fri', short: 'Fri', full: 'Friday'    },
  { key: 'sat', short: 'Sat', full: 'Saturday'  },
  { key: 'sun', short: 'Sun', full: 'Sunday'    },
]

// Map JS getDay() (0=Sun) to our day keys
const JS_DAY_TO_KEY: Record<number, string> = {
  0: 'sun', 1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu', 5: 'fri', 6: 'sat'
}

const TRACK_COLORS: Record<TrackName, string> = {
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

// Get the real date for a day in the current week (Mon-start)
function getDateForDay(dayKey: string): Date {
  const today = new Date()
  const todayKey = JS_DAY_TO_KEY[today.getDay()]
  const dayOrder = DAYS_ORDERED.findIndex(d => d.key === dayKey)
  const todayOrder = DAYS_ORDERED.findIndex(d => d.key === todayKey)
  const diff = dayOrder - todayOrder
  const d = new Date(today)
  d.setDate(d.getDate() + diff)
  return d
}

export default function PersonalCalendar() {
  const { interests, toggleInterest } = useInterests()
  const todayKey = JS_DAY_TO_KEY[new Date().getDay()]

  // Filter to interested recurring courses only (rotation week = null for simplicity)
  const interestedCourses = ALL_COURSES.filter(c => interests.has(c.slug) && c.rotation_week === null)

  // Group by day, sort by time
  const byDay: Record<string, CourseData[]> = {}
  DAYS_ORDERED.forEach(d => { byDay[d.key] = [] })
  interestedCourses.forEach(c => {
    if (byDay[c.day_of_week]) byDay[c.day_of_week].push(c)
  })
  Object.keys(byDay).forEach(day => {
    byDay[day].sort((a, b) => a.start_time.localeCompare(b.start_time))
  })

  const totalCount = interestedCourses.length
  const daysWithClasses = DAYS_ORDERED.filter(d => byDay[d.key].length > 0)

  if (interests.size === 0) {
    return (
      <EmptyState />
    )
  }

  return (
    <div>
      {/* Summary row */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.06em' }}>
          <span style={{ color: 'var(--gold)' }}>{totalCount}</span> class{totalCount !== 1 ? 'es' : ''} saved
          {' · '}
          <span style={{ color: 'var(--gold)' }}>{daysWithClasses.length}</span> day{daysWithClasses.length !== 1 ? 's' : ''}/week
        </div>
        <Link href="/courses" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--gold)', marginLeft: 'auto' }}>
          + Add more courses →
        </Link>
      </div>

      {/* Desktop: 7-column grid */}
      <div className="pcal-desktop">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0', border: '1px solid var(--border2)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
          {DAYS_ORDERED.map((day, idx) => {
            const isToday = day.key === todayKey
            const date = getDateForDay(day.key)
            const events = byDay[day.key]
            return (
              <div key={day.key} style={{ borderLeft: idx > 0 ? '1px solid var(--border2)' : 'none', minHeight: '120px', display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <div style={{
                  padding: '0.5rem 0.4rem', textAlign: 'center',
                  background: isToday ? 'rgba(201,168,76,0.1)' : 'var(--surface)',
                  borderBottom: '1px solid var(--border2)',
                }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: isToday ? 'var(--gold)' : 'var(--muted)' }}>
                    {day.short}
                  </div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: isToday ? 'var(--gold)' : 'var(--text)', fontWeight: isToday ? 700 : 400 }}>
                    {date.getDate()}
                  </div>
                </div>

                {/* Events */}
                <div style={{ padding: '0.35rem 0.3rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
                  {events.length === 0 ? (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.48rem', color: 'rgba(232,228,217,0.15)' }}>—</span>
                    </div>
                  ) : (
                    events.map(course => (
                      <CalEvent key={course.slug} course={course} compact />
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Mobile: vertical list by day */}
      <div className="pcal-mobile">
        {daysWithClasses.length === 0 ? (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border2)', borderRadius: 'var(--radius)', padding: '1.5rem', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)' }}>
            All your saved courses are in the rotation schedule
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {daysWithClasses.map(day => {
              const isToday = day.key === todayKey
              const date = getDateForDay(day.key)
              const events = byDay[day.key]
              return (
                <div key={day.key} style={{ background: 'var(--surface)', border: `1px solid ${isToday ? 'var(--border)' : 'var(--border2)'}`, borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.6rem 0.85rem',
                    background: isToday ? 'rgba(201,168,76,0.06)' : 'transparent',
                    borderBottom: '1px solid var(--border2)',
                  }}>
                    <div style={{
                      width: '2rem', height: '2rem', borderRadius: '50%',
                      background: isToday ? 'rgba(201,168,76,0.15)' : 'var(--surface2)',
                      border: `1px solid ${isToday ? 'var(--gold)' : 'var(--border2)'}`,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.42rem', color: isToday ? 'var(--gold)' : 'var(--muted)', lineHeight: 1 }}>{day.short.toUpperCase()}</div>
                      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '0.75rem', color: isToday ? 'var(--gold)' : 'var(--text)', lineHeight: 1 }}>{date.getDate()}</div>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: isToday ? 'var(--gold)' : 'var(--text)' }}>{day.full}</span>
                    {isToday && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', color: 'var(--gold)', letterSpacing: '0.08em', marginLeft: 'auto' }}>TODAY</span>}
                  </div>
                  <div style={{ padding: '0.5rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {events.map(course => <CalEvent key={course.slug} course={course} compact={false} />)}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <style>{`
        .pcal-desktop { display: block; }
        .pcal-mobile  { display: none; }
        @media (max-width: 700px) {
          .pcal-desktop { display: none; }
          .pcal-mobile  { display: block; }
        }
      `}</style>
    </div>
  )
}

function CalEvent({ course, compact }: { course: CourseData; compact: boolean }) {
  const color = TRACK_COLORS[course.track as TrackName]
  const end = endTime(course.start_time, course.duration_min)
  const meta = TRACK_META[course.track as TrackName]

  if (compact) {
    return (
      <div style={{ position: 'relative' }}>
        <a href={`/courses/${course.slug}`} style={{
          display: 'block', textDecoration: 'none',
          background: `${color}12`, border: `1px solid ${color}30`,
          borderLeft: `2px solid ${color}`,
          borderRadius: '3px', padding: '0.3rem 0.35rem',
          paddingRight: '1.4rem',
          cursor: 'pointer',
        }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.44rem', color, letterSpacing: '0.03em', marginBottom: '0.1rem' }}>
            {course.start_time}
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '0.65rem', color: 'var(--text)', lineHeight: 1.25, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {course.name}
          </div>
        </a>
        <div style={{ position: 'absolute', top: '0.2rem', right: '0.2rem' }}>
          <InterestButton slug={course.slug} size="sm" style={{ width: '1rem', height: '1rem', fontSize: '0.5rem' }} />
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
      <a href={`/courses/${course.slug}`} style={{
        flex: 1, display: 'flex', alignItems: 'center', gap: '0.6rem',
        textDecoration: 'none',
        background: `${color}10`, border: `1px solid ${color}30`,
        borderLeft: `3px solid ${color}`,
        borderRadius: 'var(--radius)', padding: '0.5rem 0.7rem',
        cursor: 'pointer', minWidth: 0,
      }}>
        <div style={{ flexShrink: 0, textAlign: 'right', minWidth: '3rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color, lineHeight: 1.2 }}>{course.start_time}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', color: 'var(--muted)', lineHeight: 1.2 }}>{end}</div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '0.88rem', color: 'var(--text)', lineHeight: 1.3 }}>{course.name}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: 'var(--muted)', marginTop: '0.1rem' }}>{meta.icon} {meta.label}</div>
        </div>
      </a>
      <InterestButton slug={course.slug} size="sm" />
    </div>
  )
}

function EmptyState() {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border2)',
      borderRadius: 'var(--radius)', padding: '2.5rem 1.5rem', textAlign: 'center',
    }}>
      <div style={{ fontSize: '2rem', marginBottom: '0.75rem', opacity: 0.4 }}>◎</div>
      <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Your schedule is empty</p>
      <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.6, maxWidth: '32ch', margin: '0 auto 1.25rem' }}>
        Hit the <strong style={{ color: 'var(--gold)' }}>+</strong> button on any class to add it here.
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href="/courses" className="btn btn-gold btn-sm">Browse Courses →</Link>
        <Link href="/schedule" className="btn btn-outline btn-sm">See Full Schedule →</Link>
      </div>
    </div>
  )
}
