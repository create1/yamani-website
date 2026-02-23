'use client'
import { useState } from 'react'
import CourseCard from '@/components/CourseCard'
import { ALL_COURSES, COURSES_BY_TRACK, TRACK_META } from '@/lib/courses'
import type { TrackName } from '@/lib/courses'

const TRACKS: TrackName[] = ['wellness', 'ai', 'founder', 'community']

export default function CoursesPage() {
  const [activeTrack, setActiveTrack] = useState<TrackName | 'all'>('all')
  const [search, setSearch] = useState('')

  const filtered = (activeTrack === 'all' ? ALL_COURSES : COURSES_BY_TRACK[activeTrack])
    .filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '3rem' }}>
        <p className="eyebrow">Learning Platform</p>
        <h1 className="section-title">All Courses</h1>
        <p className="section-subtitle" style={{ maxWidth: '50ch' }}>
          {ALL_COURSES.length} courses across wellness, AI, entrepreneurship, and community arts. Join in-person or live online.
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '2.5rem' }}>
        {/* Track filter pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            className={`btn btn-sm ${activeTrack === 'all' ? 'btn-gold' : 'btn-ghost'}`}
            onClick={() => setActiveTrack('all')}
          >
            All ({ALL_COURSES.length})
          </button>
          {TRACKS.map(track => (
            <button
              key={track}
              className={`btn btn-sm ${activeTrack === track ? 'btn-gold' : 'btn-ghost'}`}
              onClick={() => setActiveTrack(track)}
            >
              {TRACK_META[track].icon} {TRACK_META[track].label} ({COURSES_BY_TRACK[track].length})
            </button>
          ))}
        </div>

        {/* Search */}
        <input
          className="form-input"
          type="search"
          placeholder="Search courses…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: '260px', marginLeft: 'auto' }}
        />
      </div>

      {/* Results count */}
      {search && (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', marginBottom: '1.5rem', letterSpacing: '0.06em' }}>
          {filtered.length} result{filtered.length !== 1 ? 's' : ''} for &ldquo;{search}&rdquo;
        </p>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="empty-state">No courses match your search.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {filtered.map(course => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      )}
    </div>
  )
}
