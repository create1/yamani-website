'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import type { JourneyOutput } from '@/lib/journeys'

export default function JourneyExperiencePage() {
  const router = useRouter()
  const params = useParams()
  const journeyId = params?.id as string
  const [user, setUser] = useState<User | null>(null)
  const [output, setOutput] = useState<JourneyOutput | null>(null)
  const [journeyTitle, setJourneyTitle] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!journeyId) return
    async function load(u: User) {
      setUser(u)
      try {
      const { data: j, error: jErr } = await supabase
        .from('journeys')
        .select('id, title, host_id')
        .eq('id', journeyId)
        .single()
      if (jErr || !j) return
      const isHost = (j as { host_id: string }).host_id === u.id
      if (!isHost) {
        const { data: part } = await supabase
          .from('journey_participants')
          .select('journey_id')
          .eq('journey_id', journeyId)
          .eq('user_id', u.id)
          .maybeSingle()
        if (!part) {
          router.push('/journeys')
          return
        }
      }
      setJourneyTitle((j as { title: string | null }).title || 'Journey')

      const { data: out, error } = await supabase
        .from('journey_outputs')
        .select('*')
        .eq('journey_id', journeyId)
        .order('version', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (!error && out) setOutput(out as JourneyOutput)
      } finally {
        setLoading(false)
      }
    }

    supabase.auth.getSession().then(({ data }) => {
      if (!data.session?.user) {
        router.push('/auth/signin')
        return
      }
      load(data.session.user)
    })
  }, [journeyId, router])

  if (loading || !user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <div className="spinner" />
      </div>
    )
  }

  if (!output) {
    return (
      <div className="container" style={{ paddingTop: '3rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--muted)', marginBottom: '1rem' }}>Experience design not found or not yet generated.</p>
        <Link href="/journeys" className="btn btn-outline">Back to Journey</Link>
      </div>
    )
  }

  const schedule = Array.isArray(output.schedule) ? output.schedule : []
  const spaces = Array.isArray(output.spaces_decor) ? output.spaces_decor : []
  const objects = Array.isArray(output.memorabilia_sacred_objects) ? output.memorabilia_sacred_objects : []
  const rituals = Array.isArray(output.rituals) ? output.rituals : []

  return (
    <div style={{ paddingBottom: '5rem' }}>
      <div className="container" style={{ maxWidth: '720px', paddingTop: '2rem' }}>
        <Link href="/journeys" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', letterSpacing: '0.08em', textDecoration: 'none' }}>
          ← Back to Journey
        </Link>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', marginTop: '0.5rem', marginBottom: '2rem' }}>
          {journeyTitle || 'Your experience'}
        </h1>

        {/* Narrative arc */}
        {output.narrative_arc && (
          <section style={{ marginBottom: '2.5rem' }}>
            <p className="eyebrow">Narrative arc</p>
            <div
              className="card"
              style={{ padding: '1.5rem', whiteSpace: 'pre-wrap', fontFamily: 'var(--font-sans)', fontSize: '0.95rem', lineHeight: 1.75, color: 'var(--muted)' }}
            >
              {output.narrative_arc}
            </div>
          </section>
        )}

        {/* Schedule */}
        {schedule.length > 0 && (
          <section style={{ marginBottom: '2.5rem' }}>
            <p className="eyebrow">Schedule</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {schedule.map((block: { day?: number; time_start?: string; time_end?: string; title?: string; description?: string; space?: string; narrative_beat?: string }, i: number) => (
                <div
                  key={i}
                  className="card"
                  style={{ padding: '1rem 1.25rem', borderLeft: '3px solid var(--gold)' }}
                >
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--gold)' }}>
                      {block.time_start}{block.time_end ? ` – ${block.time_end}` : ''}
                      {block.day != null ? ` · Day ${block.day}` : ''}
                    </span>
                    {block.space && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)' }}>{block.space}</span>}
                  </div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem' }}>{block.title}</div>
                  {block.description && <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '0.35rem', marginBottom: 0 }}>{block.description}</p>}
                  {block.narrative_beat && <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--gold)', marginTop: '0.35rem', marginBottom: 0 }}>{block.narrative_beat}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Spaces & atmosphere */}
        {spaces.length > 0 && (
          <section style={{ marginBottom: '2.5rem' }}>
            <p className="eyebrow">Spaces & atmosphere</p>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {spaces.map((s: { space_name?: string; atmosphere_notes?: string; lighting?: string; objects?: string[] }, i: number) => (
                <div key={i} className="card" style={{ padding: '1.25rem' }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>{s.space_name}</div>
                  {s.atmosphere_notes && <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{s.atmosphere_notes}</p>}
                  {s.lighting && <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--gold)' }}>Lighting: {s.lighting}</p>}
                  {s.objects && s.objects.length > 0 && (
                    <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem', color: 'var(--muted)', fontSize: '0.85rem' }}>
                      {s.objects.map((obj, j) => <li key={j}>{obj}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Memorabilia & sacred objects */}
        {objects.length > 0 && (
          <section style={{ marginBottom: '2.5rem' }}>
            <p className="eyebrow">Memorabilia & sacred objects</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {objects.map((obj: { name?: string; meaning?: string; when_to_use?: string }, i: number) => (
                <div key={i} className="card" style={{ padding: '1rem 1.25rem' }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem' }}>{obj.name}</div>
                  {obj.meaning && <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: '0.25rem', marginBottom: 0 }}>{obj.meaning}</p>}
                  {obj.when_to_use && <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--gold)', marginTop: '0.35rem', marginBottom: 0 }}>{obj.when_to_use}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Rituals */}
        {rituals.length > 0 && (
          <section style={{ marginBottom: '2.5rem' }}>
            <p className="eyebrow">Rituals</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {rituals.map((r: { name?: string; description?: string; timing?: string }, i: number) => (
                <div key={i} className="card" style={{ padding: '1rem 1.25rem' }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem' }}>{r.name}</div>
                  {r.timing && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--gold)', marginLeft: '0.5rem' }}>{r.timing}</span>}
                  {r.description && <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: '0.35rem', marginBottom: 0 }}>{r.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border2)' }}>
          <Link href="/journeys" className="btn btn-outline">Back to My Journeys</Link>
        </div>
      </div>
    </div>
  )
}
