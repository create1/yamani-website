'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import type { Journey } from '@/lib/journeys'
import { JOURNEY_STATUS_LABELS, formatJourneyDateRange, JOURNEY_MODALITIES } from '@/lib/journeys'

export default function JourneyDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const [user, setUser] = useState<User | null>(null)
  const [journey, setJourney] = useState<Journey | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    if (!id) return
    async function load(u: User) {
      setUser(u)
      const { data, error } = await supabase
        .from('journeys')
        .select('id, host_id, title, type, status, start_at, end_at, location_id, selected_modalities, created_at, updated_at, location:locations(id, name, slug)')
        .eq('id', id)
        .single()
      if (error || !data) {
        setJourney(null)
        setLoading(false)
        return
      }
      if (data.host_id !== u.id) {
        router.push('/journeys')
        return
      }
      setJourney(data as unknown as Journey)
      setLoading(false)
    }

    supabase.auth.getSession().then(({ data }) => {
      if (!data.session?.user) {
        router.push('/auth/signin')
        return
      }
      load(data.session.user)
    })
  }, [id, router])

  const triggerGenerate = async () => {
    if (!journey || journey.status === 'generating') return
    setGenerating(true)
    try {
      const res = await fetch('/api/journeys/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ journeyId: journey.id }),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Failed')
      const { data } = await supabase.from('journeys').select('status').eq('id', journey.id).single()
      if (data) setJourney(prev => prev ? { ...prev, status: data.status as Journey['status'] } : null)
      router.push(`/journeys/${journey.id}/experience`)
    } catch {
      setGenerating(false)
    }
  }

  if (loading || !user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <div className="spinner" />
      </div>
    )
  }

  if (!journey) {
    return (
      <div className="container" style={{ paddingTop: '3rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--muted)', marginBottom: '1rem' }}>Journey not found.</p>
        <Link href="/journeys" className="btn btn-outline">Back to Journey</Link>
      </div>
    )
  }

  const isReady = journey.status === 'ready'
  const canGenerate = journey.status === 'draft' || journey.status === 'collecting_inputs'

  return (
    <div style={{ paddingBottom: '5rem' }}>
      <div className="container" style={{ maxWidth: '800px', paddingTop: '2rem' }}>
        <Link href="/journeys" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', letterSpacing: '0.08em', textDecoration: 'none' }}>
          ← Back to Journey
        </Link>

        <div className="card" style={{ marginTop: '1rem', padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem' }}>
                {journey.title || 'Untitled Journey'}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.08em',
                  padding: '0.2rem 0.5rem', borderRadius: '2rem',
                  background: isReady ? 'rgba(201,168,76,0.15)' : 'var(--surface)',
                  border: `1px solid ${isReady ? 'rgba(201,168,76,0.3)' : 'var(--border2)'}`,
                  color: isReady ? 'var(--gold)' : 'var(--muted)',
                }}>
                  {JOURNEY_STATUS_LABELS[journey.status]}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', textTransform: 'capitalize' }}>{journey.type}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {isReady && (
                <Link href={`/journeys/${journey.id}/experience`} className="btn btn-gold">
                  View experience →
                </Link>
              )}
              {canGenerate && (
                <button type="button" onClick={triggerGenerate} className="btn btn-gold" disabled={generating}>
                  {generating ? 'Generating…' : 'Generate journey'}
                </button>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gap: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
            <div><span style={{ color: 'var(--muted)' }}>When:</span> <span style={{ color: 'var(--text)' }}>{formatJourneyDateRange(journey.start_at, journey.end_at)}</span></div>
            {(journey.location as { name?: string } | null)?.name && (
              <div><span style={{ color: 'var(--muted)' }}>Location:</span> <span style={{ color: 'var(--text)' }}>{(journey.location as { name: string }).name}</span></div>
            )}
            <div>
              <span style={{ color: 'var(--muted)' }}>Modalities:</span>{' '}
              <span style={{ color: 'var(--text)' }}>
                {journey.selected_modalities?.length
                  ? journey.selected_modalities.map(slug => JOURNEY_MODALITIES.find(m => m.value === slug)?.label ?? slug).join(', ')
                  : '—'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
