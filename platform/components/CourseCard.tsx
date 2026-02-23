import Link from 'next/link'
import type { CourseData } from '@/lib/courses'
import { TRACK_META } from '@/lib/courses'

interface CourseCardProps {
  course: CourseData
  enrolled?: boolean
  showEnroll?: boolean
}

export default function CourseCard({ course, enrolled = false, showEnroll = true }: CourseCardProps) {
  const meta = TRACK_META[course.track]
  const durationHrs = Math.floor(course.duration_min / 60)
  const durationMins = course.duration_min % 60
  const durStr = durationMins > 0
    ? `${durationHrs}h ${durationMins}m`
    : `${durationHrs}h`

  return (
    <Link href={`/courses/${course.slug}`} style={{ textDecoration: 'none' }}>
      <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'pointer' }}>
        {/* Track badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className={`track-badge track-${course.track}`}>
            {meta.icon} {meta.label}
          </span>
          {enrolled && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--gold)', letterSpacing: '0.08em' }}>
              ✓ Enrolled
            </span>
          )}
        </div>

        {/* Name */}
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', fontWeight: 600, lineHeight: 1.3 }}>
          {course.name}
        </h3>

        {/* Description */}
        <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.6, flexGrow: 1 }}>
          {course.description.length > 130
            ? course.description.slice(0, 130) + '…'
            : course.description}
        </p>

        {/* Meta row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid var(--border2)', paddingTop: '0.75rem' }}>
          <MetaItem icon="⏱" label={durStr} />
          <MetaItem icon="⬡" label={course.space} />
          <MetaItem icon="◎" label={course.instructor} />
          {course.rotation_week === null
            ? <MetaItem icon="↻" label="Weekly" />
            : <MetaItem icon="↻" label={`Rotation ${course.rotation_week + 1} of 6`} />
          }
        </div>

        {showEnroll && (
          <div style={{ marginTop: 'auto' }}>
            <span className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
              {enrolled ? 'View Course →' : 'Learn More →'}
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}

function MetaItem({ icon, label }: { icon: string; label: string }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.06em' }}>
      <span style={{ color: 'var(--gold)' }}>{icon}</span> {label}
    </span>
  )
}
