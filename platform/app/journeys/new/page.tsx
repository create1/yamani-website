'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import { ALL_COURSES, COURSES_BY_TRACK, TRACK_META } from '@/lib/courses'
import type { TrackName } from '@/lib/courses'
import type { JourneyType } from '@/lib/journeys'

const STEPS = [
  { id: 1, label: 'People' },
  { id: 2, label: 'When' },
  { id: 3, label: 'Goal' },
  { id: 4, label: 'Experiences' },
  { id: 5, label: 'Preferences' },
  { id: 6, label: 'Location' },
  { id: 7, label: 'Review' },
] as const

const TRACKS: TrackName[] = ['wellness', 'ai', 'founder', 'community']

export default function NewJourneyPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [type, setType] = useState<JourneyType>('solo')
  const [participantCount, setParticipantCount] = useState(2)
  const [startDate, setStartDate] = useState('')
  const [startTime, setStartTime] = useState('09:00')
  const [endDate, setEndDate] = useState('')
  const [endTime, setEndTime] = useState('17:00')
  const [goalsText, setGoalsText] = useState('')
  const [selectedCourseSlugs, setSelectedCourseSlugs] = useState<string[]>([])
  const [foodPreferences, setFoodPreferences] = useState('')
  const [intensity, setIntensity] = useState<'gentle' | 'moderate' | 'intense'>('moderate')
  const [locationId, setLocationId] = useState<string>('')
  const [locations, setLocations] = useState<{ id: string; name: string; slug: string }[]>([])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session?.user) {
        router.push('/auth/signin')
        return
      }
      setUser(data.session.user)
    })
    supabase.from('locations').select('id, name, slug').eq('status', 'active').order('sort_order').then(({ data }) => {
      if (data) setLocations(data)
    })
  }, [router])

  const toggleCourse = (slug: string) => {
    setSelectedCourseSlugs(prev => prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug])
  }

  const startAt = startDate && startTime ? `${startDate}T${startTime}:00` : ''
  const endAt = endDate && endTime ? `${endDate}T${endTime}:00` : ''

  const canProceed = () => {
    if (step === 1) return true
    if (step === 2) return !!startDate && !!endDate
    if (step === 3) return goalsText.trim().length > 0
    if (step === 4) return selectedCourseSlugs.length > 0
    if (step === 5) return true
    if (step === 6) return true
    if (step === 7) return true
    return false
  }

  const handleSubmit = async () => {
    if (!user) return
    setSubmitting(true)
    setError(null)
    try {
      const { data: journey, error: insertErr } = await supabase
        .from('journeys')
        .insert({
          host_id: user.id,
          type,
          status: 'draft',
          start_at: startAt,
          end_at: endAt,
          location_id: locationId || null,
          selected_modalities: selectedCourseSlugs,
          participant_count: type === 'solo' ? 1 : Math.max(2, participantCount),
        })
        .select('id')
        .single()

      if (insertErr) throw insertErr
      const jId = (journey as { id: string }).id

      await supabase.from('journey_inputs').upsert({
        journey_id: jId,
        user_id: user.id,
        goals_text: goalsText.trim(),
        food_preferences: foodPreferences.trim() || null,
        other_preferences: { intensity, selected_course_slugs: selectedCourseSlugs },
        modality_interests: selectedCourseSlugs,
        completed_at: new Date().toISOString(),
      }, { onConflict: 'journey_id,user_id' })

      await supabase.from('journey_participants').insert({
        journey_id: jId,
        user_id: user.id,
        role: 'host',
        joined_at: new Date().toISOString(),
      }).then(() => {})

      const res = await fetch('/api/journeys/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ journeyId: jId }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Generation failed')
      }
      router.push(`/journeys/${jId}/experience`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  if (!user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <div className="spinner" />
      </div>
    )
  }

  const selectedCourseNames = selectedCourseSlugs.map(slug => ALL_COURSES.find(c => c.slug === slug)?.name).filter(Boolean)

  return (
    <div style={{ paddingBottom: '5rem' }}>
      <div className="container" style={{ maxWidth: '680px', paddingTop: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/dashboard" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', letterSpacing: '0.08em', textDecoration: 'none' }}>
            ← Dashboard
          </Link>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', marginTop: '0.5rem' }}>
            Create an experience
          </h1>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            {STEPS.map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStep(s.id)}
                style={{
                  padding: '0.35rem 0.65rem',
                  fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.06em',
                  background: step === s.id ? 'var(--gold)' : 'transparent',
                  color: step === s.id ? 'var(--ink)' : 'var(--muted)',
                  border: `1px solid ${step === s.id ? 'var(--gold)' : 'var(--border2)'}`,
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
          {step === 1 && (
            <>
              <p className="eyebrow">Who is this for?</p>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', marginBottom: '1rem' }}>Solo or group</h2>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                {(['solo', 'group'] as const).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`btn ${type === t ? 'btn-gold' : 'btn-outline'}`}
                    style={{ textTransform: 'capitalize' }}
                  >
                    {t}
                  </button>
                ))}
              </div>
              {type === 'group' && (
                <div className="form-field" style={{ maxWidth: '12rem' }}>
                  <label className="form-label">How many people?</label>
                  <input
                    className="form-input"
                    type="number"
                    min={2}
                    max={50}
                    value={participantCount}
                    onChange={e => setParticipantCount(Math.max(2, parseInt(e.target.value, 10) || 2))}
                  />
                </div>
              )}
              <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '1rem' }}>
                {type === 'solo' ? 'A personal experience designed around your goals.' : `${participantCount} participants. You can invite others to add their goals before generating.`}
              </p>
            </>
          )}

          {step === 2 && (
            <>
              <p className="eyebrow">Time frame</p>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', marginBottom: '1rem' }}>Start and end</h2>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div className="form-field">
                  <label className="form-label">Start date</label>
                  <input className="form-input" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                </div>
                <div className="form-field">
                  <label className="form-label">Start time</label>
                  <input className="form-input" type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
                </div>
                <div className="form-field">
                  <label className="form-label">End date</label>
                  <input className="form-input" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                </div>
                <div className="form-field">
                  <label className="form-label">End time</label>
                  <input className="form-input" type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <p className="eyebrow">Purpose</p>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', marginBottom: '1rem' }}>Goal of this experience</h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                What do you want from this journey? The narrative will center on this.
              </p>
              <div className="form-field">
                <label className="form-label">Goals (required)</label>
                <textarea
                  className="form-textarea"
                  rows={5}
                  placeholder="e.g. I want to step into my leadership without burning out, and reconnect with what matters most."
                  value={goalsText}
                  onChange={e => setGoalsText(e.target.value)}
                  style={{ resize: 'vertical' }}
                />
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <p className="eyebrow">What to offer</p>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', marginBottom: '1rem' }}>Pick experiences (classes)</h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                Choose which classes or experiences you want woven into this journey. Select at least one.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {TRACKS.map(track => {
                  const courses = COURSES_BY_TRACK[track] ?? []
                  const meta = TRACK_META[track]
                  if (courses.length === 0) return null
                  return (
                    <div key={track}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--gold)', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                        {meta.icon} {meta.label}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        {courses.map(course => (
                          <label
                            key={course.slug}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.75rem',
                              padding: '0.6rem 0.75rem',
                              background: selectedCourseSlugs.includes(course.slug) ? 'rgba(201,168,76,0.08)' : 'var(--surface)',
                              border: `1px solid ${selectedCourseSlugs.includes(course.slug) ? 'var(--gold)' : 'var(--border2)'}`,
                              borderRadius: 'var(--radius)',
                              cursor: 'pointer',
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={selectedCourseSlugs.includes(course.slug)}
                              onChange={() => toggleCourse(course.slug)}
                              style={{ accentColor: 'var(--gold)' }}
                            />
                            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.95rem' }}>{course.name}</span>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', marginLeft: 'auto' }}>
                              {course.duration_min} min · {course.space}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
              {selectedCourseSlugs.length > 0 && (
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--gold)', marginTop: '1rem' }}>
                  {selectedCourseSlugs.length} selected
                </p>
              )}
            </>
          )}

          {step === 5 && (
            <>
              <p className="eyebrow">Customization</p>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', marginBottom: '1rem' }}>Preferences</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-field">
                  <label className="form-label">Food preferences</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="Dietary restrictions, allergies, or ritual preferences"
                    value={foodPreferences}
                    onChange={e => setFoodPreferences(e.target.value)}
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Intensity</label>
                  <select className="form-select" value={intensity} onChange={e => setIntensity(e.target.value as 'gentle' | 'moderate' | 'intense')}>
                    <option value="gentle">Gentle</option>
                    <option value="moderate">Moderate</option>
                    <option value="intense">Intense</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {step === 6 && (
            <>
              <p className="eyebrow">Where</p>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', marginBottom: '1rem' }}>Location (optional)</h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                The AI can tailor spaces and atmosphere to this location.
              </p>
              <div className="form-field">
                <select className="form-select" value={locationId} onChange={e => setLocationId(e.target.value)}>
                  <option value="">No specific location</option>
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {step === 7 && (
            <>
              <p className="eyebrow">Review</p>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', marginBottom: '1rem' }}>Ready to generate</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>
                <div><span style={{ color: 'var(--text)' }}>Type:</span> {type}{type === 'group' && ` (${participantCount} people)`}</div>
                <div><span style={{ color: 'var(--text)' }}>When:</span> {startDate && endDate ? `${startDate} ${startTime} – ${endDate} ${endTime}` : '—'}</div>
                <div><span style={{ color: 'var(--text)' }}>Goal:</span> {goalsText.slice(0, 80)}{goalsText.length > 80 ? '…' : ''}</div>
                <div><span style={{ color: 'var(--text)' }}>Experiences:</span> {selectedCourseNames.length ? selectedCourseNames.slice(0, 5).join(', ') + (selectedCourseNames.length > 5 ? ` +${selectedCourseNames.length - 5} more` : '') : '—'}</div>
                <div><span style={{ color: 'var(--text)' }}>Location:</span> {locationId ? locations.find(l => l.id === locationId)?.name : 'None'}</div>
              </div>
              {error && (
                <p style={{ color: 'var(--rust-lt)', fontSize: '0.8rem', marginTop: '1rem' }}>{error}</p>
              )}
            </>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <button
            type="button"
            onClick={() => setStep(s => Math.max(1, s - 1))}
            className="btn btn-ghost"
            disabled={step === 1}
          >
            ← Back
          </button>
          {step < 7 ? (
            <button
              type="button"
              onClick={() => setStep(s => Math.min(7, s + 1))}
              className="btn btn-gold"
              disabled={!canProceed()}
            >
              Next →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="btn btn-gold"
              disabled={submitting || !canProceed()}
            >
              {submitting ? 'Generating…' : 'Generate experience →'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
