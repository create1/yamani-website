import Link from 'next/link'
import { COURSES_BY_TRACK, TRACK_META } from '@/lib/courses'
import type { TrackName, CourseData } from '@/lib/courses'

const TRACKS: TrackName[] = ['wellness', 'ai', 'founder', 'community']

export default function CurriculumPage() {
  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Hero */}
      <section style={{
        padding: '5rem 0 4rem',
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,168,76,0.07) 0%, transparent 70%)',
        borderBottom: '1px solid var(--border2)',
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p className="eyebrow">The Curriculum</p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', maxWidth: '14ch', margin: '0 auto', lineHeight: 1.1 }}>
            A Complete Education in Three Pillars
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '1.1rem', maxWidth: '52ch', margin: '1.5rem auto', lineHeight: 1.7 }}>
            48 courses spanning wellness, AI, entrepreneurship, and creative community — designed to be experienced together, in-person and live online.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
            <Link href="/courses" className="btn btn-gold btn-lg">Browse All Courses</Link>
            <Link href="/schedule" className="btn btn-outline btn-lg">View Schedule</Link>
          </div>
        </div>
      </section>

      {/* Track overview */}
      <section className="section">
        <div className="container">
          <p className="eyebrow">Three Tracks</p>
          <h2 className="section-title">Integrated by Design</h2>
          <p className="section-subtitle" style={{ marginBottom: '3rem', maxWidth: '56ch' }}>
            Each track is standalone, but transformative when combined. Members who participate across tracks develop a rare, integrated intelligence.
          </p>
          <div className="grid-3">
            {(['wellness', 'ai', 'founder'] as TrackName[]).map(track => {
              const meta = TRACK_META[track]
              const courses = COURSES_BY_TRACK[track]
              return (
                <div key={track} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ fontSize: '1.75rem', color: meta.color }}>{meta.icon}</div>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '0.5rem' }}>{meta.label}</h3>
                    <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{meta.description}</p>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', letterSpacing: '0.06em' }}>
                    {courses.length} courses
                  </div>
                  <Link href={`/courses?track=${track}`} className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-start' }}>
                    View Track →
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Course listings by track */}
      {TRACKS.map(track => (
        <TrackSection key={track} track={track} courses={COURSES_BY_TRACK[track]} />
      ))}

      {/* CTA */}
      <section className="section section-dark">
        <div className="container" style={{ textAlign: 'center' }}>
          <p className="eyebrow">Ready to Begin?</p>
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            Join In-Person or Online
          </h2>
          <p style={{ color: 'var(--muted)', maxWidth: '48ch', margin: '0 auto 2rem', fontSize: '1rem', lineHeight: 1.7 }}>
            Every class is live-streamed with a shared chat room. Attend from anywhere in the world or in our physical campus space.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/courses" className="btn btn-gold btn-lg">Enroll in a Course</Link>
            <Link href="/#waitlist" className="btn btn-outline btn-lg">Join the Waitlist</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function TrackSection({ track, courses }: { track: TrackName; courses: CourseData[] }) {
  const meta = TRACK_META[track]
  const recurring = courses.filter(c => c.rotation_week === null)
  const rotating = courses.filter(c => c.rotation_week !== null)

  return (
    <section id={track} className="section" style={{ borderTop: '1px solid var(--border2)' }}>
      <div className="container">
        {/* Section header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '1.5rem', color: meta.color, marginBottom: '0.5rem' }}>{meta.icon}</div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}>{meta.label} Track</h2>
            <p style={{ color: 'var(--muted)', marginTop: '0.5rem', maxWidth: '50ch' }}>{meta.description}</p>
          </div>
          <Link href={`/courses?track=${track}`} className="btn btn-outline btn-sm">View All →</Link>
        </div>

        {/* Recurring courses */}
        {recurring.length > 0 && (
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border2)' }}>
              Weekly Recurring
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {recurring.map(course => <CourseRow key={course.slug} course={course} />)}
            </div>
          </div>
        )}

        {/* Rotating courses */}
        {rotating.length > 0 && (
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border2)' }}>
              6-Week Rotating Schedule
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {rotating
                .sort((a, b) => (a.rotation_week ?? 0) - (b.rotation_week ?? 0))
                .map(course => <CourseRow key={course.slug} course={course} />)}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function CourseRow({ course }: { course: CourseData }) {
  const durationHrs = Math.floor(course.duration_min / 60)
  const durationMins = course.duration_min % 60
  const durStr = durationMins > 0 ? `${durationHrs}h ${durationMins}m` : `${durationHrs}h`

  return (
    <Link href={`/courses/${course.slug}`} style={{ textDecoration: 'none' }}>
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', height: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', lineHeight: 1.3, flex: 1 }}>{course.name}</h3>
          {course.rotation_week !== null && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--gold)', background: 'var(--gold-glow)', border: '1px solid var(--border)', borderRadius: '2rem', padding: '0.2rem 0.5rem', whiteSpace: 'nowrap', flexShrink: 0 }}>
              W{course.rotation_week + 1}
            </span>
          )}
        </div>
        <p style={{ color: 'var(--muted)', fontSize: '0.82rem', lineHeight: 1.5, flexGrow: 1 }}>
          {course.description.length > 100 ? course.description.slice(0, 100) + '…' : course.description}
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <MiniMeta label={`${course.day_of_week.slice(0, 3).toUpperCase()} ${course.start_time}`} />
          <MiniMeta label={durStr} />
          <MiniMeta label={course.space} />
        </div>
      </div>
    </Link>
  )
}

function MiniMeta({ label }: { label: string }) {
  return (
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.05em' }}>
      {label}
    </span>
  )
}
