'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ALL_COURSES, NEVADA_CITY_SPACES, TRACK_META } from '@/lib/courses'
import type { TrackName, CourseData } from '@/lib/courses'

const TRACK_COLORS: Record<TrackName, string> = {
  wellness:  '#C9A84C',
  ai:        '#7BB3BE',
  founder:   '#D4856A',
  community: '#8DA88F',
}

const DAYS = [
  { key: 'mon', label: 'Monday'    },
  { key: 'tue', label: 'Tuesday'   },
  { key: 'wed', label: 'Wednesday' },
  { key: 'thu', label: 'Thursday'  },
  { key: 'fri', label: 'Friday'    },
  { key: 'sat', label: 'Saturday'  },
  { key: 'sun', label: 'Sunday'    },
]

const JS_DAY_TO_KEY: Record<number, string> = {
  0: 'sun', 1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu', 5: 'fri', 6: 'sat'
}

function endTime(startTime: string, durationMin: number): string {
  const [h, m] = startTime.split(':').map(Number)
  const total = h * 60 + m + durationMin
  return `${String(Math.floor(total / 60) % 24).padStart(2,'0')}:${String(total % 60).padStart(2,'0')}`
}

export default function NevadaCityPage() {
  const [activeTab, setActiveTab] = useState<'schedule' | 'spaces' | 'membership'>('schedule')
  const [activeTrack, setActiveTrack] = useState<TrackName | 'all'>('all')
  const todayKey = JS_DAY_TO_KEY[new Date().getDay()]

  // Campus schedule: all hybrid courses sorted by day then time
  const campusCourses = useMemo(() => {
    const filtered = ALL_COURSES.filter(c =>
      c.delivery === 'hybrid' && (activeTrack === 'all' || c.track === activeTrack) && c.rotation_week === null
    )
    const byDay: Record<string, CourseData[]> = {}
    DAYS.forEach(d => { byDay[d.key] = [] })
    filtered.forEach(c => { if (byDay[c.day_of_week]) byDay[c.day_of_week].push(c) })
    Object.keys(byDay).forEach(day => byDay[day].sort((a, b) => a.start_time.localeCompare(b.start_time)))
    return byDay
  }, [activeTrack])

  const totalClasses = Object.values(campusCourses).reduce((s, a) => s + a.length, 0)

  return (
    <div style={{ paddingBottom: '5rem' }}>

      {/* Campus / Digital context banner */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border2)' }}>
        <div className="container" style={{ paddingTop: '1rem', paddingBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <nav style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.08em', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Link href="/locations" style={{ color: 'var(--muted)' }}>Locations</Link>
            <span>›</span>
            <span style={{ color: 'var(--gold)' }}>Nevada City, CA</span>
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.06em' }}>
              Looking for the online platform?
            </span>
            <Link href="/courses" className="btn btn-sm btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span>◈</span> Digital Courses →
            </Link>
          </div>
        </div>
      </div>

      {/* Campus Hero */}
      <section style={{
        padding: 'clamp(2rem,5vw,4rem) 0 clamp(1.5rem,3vw,2.5rem)',
        background: 'radial-gradient(ellipse 80% 80% at 50% -10%, rgba(201,168,76,0.1) 0%, transparent 65%)',
        borderBottom: '1px solid var(--border2)',
      }}>
        <div className="container">
          <div className="nc-hero-grid">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--gold)', letterSpacing: '0.12em', textTransform: 'uppercase', background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '2rem', padding: '0.2rem 0.6rem' }}>
                  ● Open Now
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.08em' }}>
                  In-Person Campus · Sierra Nevada Foothills
                </span>
              </div>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem,5vw,3.75rem)', lineHeight: 1.05, marginBottom: '0.75rem' }}>
                Nevada City, <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>CA</em>
              </h1>
              <p style={{ color: 'var(--muted)', fontSize: '0.65rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', marginBottom: '1rem' }}>
                APOTHEOS PHYSICAL CAMPUS · NEVADA CITY, CALIFORNIA
              </p>
              <p style={{ color: 'var(--muted)', fontSize: 'clamp(0.9rem,2vw,1.05rem)', lineHeight: 1.75, maxWidth: '52ch', marginBottom: '1.25rem' }}>
                Apotheos&apos;s founding campus — a converted Victorian building in the heart of Nevada City. Eleven dedicated spaces where wellness, technology, entrepreneurship, and arts share the same roof and the same community.
              </p>
              {/* Digital availability callout */}
              <div style={{
                background: 'rgba(123,179,190,0.06)', border: '1px solid rgba(123,179,190,0.2)',
                borderRadius: 'var(--radius)', padding: '0.75rem 1rem', marginBottom: '1.75rem',
                display: 'flex', alignItems: 'flex-start', gap: '0.65rem',
              }}>
                <span style={{ color: 'var(--teal-lt)', flexShrink: 0, fontSize: '0.85rem', marginTop: '0.05rem' }}>◈</span>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.04em', lineHeight: 1.65 }}>
                  All campus classes are also live-streamed to the{' '}
                  <Link href="/courses" style={{ color: 'var(--teal-lt)', textDecoration: 'underline' }}>digital platform</Link>
                  {' '}— join from anywhere in the world.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button onClick={() => setActiveTab('schedule')} className="btn btn-gold">Campus Schedule →</button>
                <button onClick={() => setActiveTab('spaces')} className="btn btn-outline">Explore Spaces</button>
                <button onClick={() => setActiveTab('membership')} className="btn btn-ghost btn-sm" style={{ alignSelf: 'center' }}>Campus Membership</button>
              </div>
            </div>

            {/* Campus stats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {[
                { value: '11',    label: 'Dedicated Spaces' },
                { value: totalClasses.toString(), label: 'Weekly Classes' },
                { value: '4',     label: 'Tracks' },
                { value: '∞',     label: 'Also Livestreamed Online' },
              ].map(stat => (
                <div key={stat.label} style={{
                  background: 'var(--surface)', border: '1px solid var(--border2)',
                  borderRadius: 'var(--radius)', padding: '0.85rem 1.1rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', color: 'var(--gold)' }}>{stat.value}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.08em', textAlign: 'right' }}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border2)', position: 'sticky', top: 'var(--nav-h)', zIndex: 50 }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '0' }}>
            {([
              { id: 'schedule',   label: 'Campus Schedule' },
              { id: 'spaces',     label: 'Spaces'          },
              { id: 'membership', label: 'Membership'      },
            ] as const).map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '1rem 1.25rem',
                  fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: activeTab === tab.id ? 'var(--gold)' : 'var(--muted)',
                  borderBottom: `2px solid ${activeTab === tab.id ? 'var(--gold)' : 'transparent'}`,
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                }}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── SCHEDULE TAB ── */}
      {activeTab === 'schedule' && (
        <div className="container" style={{ paddingTop: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem' }}>In-Person Class Schedule</h2>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
                Nevada City campus · All classes also available via live-stream online
              </p>
            </div>
            <Link href="/courses" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--teal-lt)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span>◈</span> Browse Online Courses →
            </Link>
          </div>

          {/* Track filter */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.75rem', overflowX: 'auto', paddingBottom: '2px' }}>
            <button onClick={() => setActiveTrack('all')} className={`btn btn-sm ${activeTrack === 'all' ? 'btn-gold' : 'btn-ghost'}`} style={{ flexShrink: 0 }}>All Tracks</button>
            {(['wellness','ai','founder','community'] as TrackName[]).map(t => (
              <button key={t} onClick={() => setActiveTrack(t)} className={`btn btn-sm ${activeTrack === t ? 'btn-gold' : 'btn-ghost'}`} style={{ flexShrink: 0 }}>
                {TRACK_META[t].icon} {TRACK_META[t].label}
              </button>
            ))}
          </div>

          {/* Day-by-day schedule */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {DAYS.map(day => {
              const events = campusCourses[day.key] ?? []
              const isToday = day.key === todayKey
              if (events.length === 0) return null
              return (
                <div key={day.key}>
                  {/* Day header */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    marginBottom: '0.6rem',
                  }}>
                    <div style={{
                      fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase',
                      color: isToday ? 'var(--gold)' : 'var(--muted)',
                      padding: '0.2rem 0', minWidth: '80px',
                    }}>
                      {day.label}
                    </div>
                    {isToday && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: 'var(--gold)', letterSpacing: '0.1em', background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '2rem', padding: '0.1rem 0.4rem' }}>TODAY</span>}
                    <div style={{ flex: 1, height: '1px', background: isToday ? 'rgba(201,168,76,0.3)' : 'var(--border2)' }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)' }}>{events.length} class{events.length !== 1 ? 'es' : ''}</span>
                  </div>

                  {/* Events */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {events.map(course => {
                      const color = TRACK_COLORS[course.track]
                      const end = endTime(course.start_time, course.duration_min)
                      const meta = TRACK_META[course.track]
                      return (
                        <a key={course.slug} href={`/courses/${course.slug}`} style={{ textDecoration: 'none' }}>
                          <div style={{
                            display: 'flex', alignItems: 'center', gap: '1rem',
                            background: 'var(--surface)', border: '1px solid var(--border2)',
                            borderLeft: `3px solid ${color}`,
                            borderRadius: 'var(--radius)', padding: '0.75rem 1rem',
                            transition: 'background 0.15s, border-color 0.15s',
                            flexWrap: 'wrap',
                          }}
                          onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = `${color}10`; el.style.borderColor = color }}
                          onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'var(--surface)'; el.style.borderColor = 'var(--border2)' }}
                          >
                            {/* Time */}
                            <div style={{ minWidth: '5rem', flexShrink: 0 }}>
                              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color, lineHeight: 1.2 }}>{course.start_time}</div>
                              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', lineHeight: 1.2 }}>{end}</div>
                            </div>
                            {/* Name + meta */}
                            <div style={{ flex: 1, minWidth: '150px' }}>
                              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: 'var(--text)', lineHeight: 1.25 }}>{course.name}</div>
                              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', color: 'var(--muted)' }}>{meta.icon} {meta.label}</span>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', color: 'var(--muted)' }}>⬡ {course.space}</span>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', color: 'var(--muted)' }}>👥 {course.capacity} max</span>
                              </div>
                            </div>
                            {/* Badge */}
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}>
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: 'var(--teal-lt)', letterSpacing: '0.08em', border: '1px solid rgba(123,179,190,0.3)', borderRadius: '2rem', padding: '0.15rem 0.45rem' }}>
                                Also Online
                              </span>
                              <span style={{ color: 'var(--gold)', fontSize: '0.75rem' }}>→</span>
                            </div>
                          </div>
                        </a>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── SPACES TAB ── */}
      {activeTab === 'spaces' && (
        <div className="container" style={{ paddingTop: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', marginBottom: '0.5rem' }}>Campus Spaces</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
            Eleven dedicated environments — each designed for a different mode of learning and being.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: '1rem' }}>
            {NEVADA_CITY_SPACES.map(space => {
              const classCount = ALL_COURSES.filter(c => c.space === space.name && c.rotation_week === null).length
              return (
                <div key={space.id} style={{
                  background: 'var(--surface)', border: '1px solid var(--border2)',
                  borderRadius: 'var(--radius-lg)', padding: '1.5rem',
                  display: 'flex', flexDirection: 'column', gap: '0.6rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ fontSize: '1.4rem' }}>{space.icon}</div>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem' }}>{space.name}</h3>
                  </div>
                  <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>{space.desc}</p>
                  {classCount > 0 && (
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--gold)', letterSpacing: '0.08em', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid var(--border2)' }}>
                      {classCount} weekly class{classCount !== 1 ? 'es' : ''} held here
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── MEMBERSHIP TAB ── */}
      {activeTab === 'membership' && (
        <div className="container" style={{ paddingTop: '2rem', maxWidth: '760px' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', marginBottom: '0.5rem' }}>Campus Membership</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.75, marginBottom: '2rem' }}>
            Nevada City campus access is included in Seeker, Founder, and Visionary memberships. Community members get full digital access and can attend campus events à la carte.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
            {[
              { tier: 'Community', price: '$49/mo', campus: false, perks: 'Full online course library, AI agent sessions, community events.' },
              { tier: 'Seeker',    price: '$149/mo', campus: true,  perks: 'Weekends at campus, 4 in-person classes/month, online access.' },
              { tier: 'Founder',   price: '$399/mo', campus: true,  perks: 'Full campus access any day, unlimited classes, co-working, AI lab.' },
              { tier: 'Visionary', price: '$899/mo', campus: true,  perks: 'Everything in Founder + 1:1 mentorship, investor network, studio access.' },
            ].map(t => (
              <div key={t.tier} style={{
                display: 'flex', gap: '1rem', alignItems: 'flex-start',
                background: t.campus ? 'rgba(201,168,76,0.04)' : 'var(--surface)',
                border: `1px solid ${t.campus ? 'rgba(201,168,76,0.25)' : 'var(--border2)'}`,
                borderRadius: 'var(--radius)', padding: '1rem 1.25rem',
              }}>
                <div style={{ width: '1.4rem', height: '1.4rem', borderRadius: '50%', flexShrink: 0, marginTop: '0.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: t.campus ? 'rgba(201,168,76,0.15)' : 'var(--surface2)', border: `1px solid ${t.campus ? 'rgba(201,168,76,0.4)' : 'var(--border2)'}`, fontSize: '0.6rem', color: t.campus ? 'var(--gold)' : 'var(--muted)' }}>
                  {t.campus ? '◎' : '◈'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                    <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem' }}>{t.tier}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--gold)' }}>{t.price}</span>
                    {t.campus && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', color: 'var(--gold)', letterSpacing: '0.08em', background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '2rem', padding: '0.1rem 0.4rem' }}>Campus Access</span>}
                  </div>
                  <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>{t.perks}</p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/membership#waitlist" className="btn btn-gold">Join the Waitlist →</Link>
        </div>
      )}

      <style>{`
        .nc-hero-grid {
          display: grid;
          grid-template-columns: 1fr 280px;
          gap: 3rem;
          align-items: start;
        }
        @media (max-width: 900px) {
          .nc-hero-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}
