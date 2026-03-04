'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import type { Journey } from '@/lib/journeys'
import { JOURNEY_STATUS_LABELS, formatJourneyDateRange } from '@/lib/journeys'

export default function JourneysPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [journeys, setJourneys] = useState<Journey[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load(u: User) {
      setUser(u)
      const { data, error } = await supabase
        .from('journeys')
        .select('id, title, type, status, start_at, end_at, created_at, updated_at, location_id, selected_modalities, host_id, location:locations(id, name, slug)')
        .eq('host_id', u.id)
        .order('created_at', { ascending: false })
      if (!error && data) setJourneys(data as unknown as Journey[])
      setLoading(false)
    }

    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        load(data.session.user)
      } else {
        const t = setTimeout(() => {
          supabase.auth.getSession().then(({ data: d2 }) => {
            if (d2.session?.user) load(d2.session.user)
            else router.push('/auth/signin')
          })
        }, 500)
        return () => clearTimeout(t)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user) load(session.user)
    })
    return () => subscription.unsubscribe()
  }, [router])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <div className="spinner" />
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)' }}>Loading journeys…</p>
      </div>
    )
  }

  return (
    <div style={{ paddingBottom: '5rem' }}>

      {/* Hero */}
      <section style={{
        padding: 'clamp(2rem, 5vw, 4rem) 0 clamp(1.5rem, 4vw, 3rem)',
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,168,76,0.07) 0%, transparent 70%)',
        borderBottom: '1px solid var(--border2)',
      }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <p className="eyebrow">Experience Design</p>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1, marginBottom: '0.5rem' }}>
                Journey
              </h1>
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem', maxWidth: '48ch' }}>
                Design in-real-life experiences. Set your intention, choose modalities, and receive a mythopoetic journey tailored to you — solo or with others.
              </p>
            </div>
            <Link href="/journeys/new" className="btn btn-gold btn-lg">
              Design a Journey →
            </Link>
          </div>
        </div>
      </section>

      {/* My Journeys */}
      <section className="section">
        <div className="container">
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1.25rem' }}>
            My Journeys
          </h2>

          {journeys.length === 0 ? (
            <div className="card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--gold)' }}>◎</div>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>No journeys yet</p>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Create your first experience design. You’ll set goals, preferences, and timeframe — then receive a narrative arc, schedule, and rituals.
              </p>
              <Link href="/journeys/new" className="btn btn-gold">Design a Journey →</Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {journeys.map(j => {
                const statusLabel = JOURNEY_STATUS_LABELS[j.status]
                const isReady = j.status === 'ready'
                return (
                  <Link key={j.id} href={isReady ? `/journeys/${j.id}/experience` : `/journeys/${j.id}`} style={{ textDecoration: 'none' }}>
                    <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', cursor: 'pointer' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem' }}>
                            {j.title || 'Untitled Journey'}
                          </span>
                          <span style={{
                            fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.08em',
                            padding: '0.2rem 0.5rem', borderRadius: '2rem',
                            background: j.status === 'ready' ? 'rgba(201,168,76,0.15)' : 'var(--surface)',
                            border: `1px solid ${j.status === 'ready' ? 'rgba(201,168,76,0.3)' : 'var(--border2)'}`,
                            color: j.status === 'ready' ? 'var(--gold)' : 'var(--muted)',
                          }}>
                            {statusLabel}
                          </span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', textTransform: 'capitalize' }}>
                            {j.type}
                          </span>
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)' }}>
                          {formatJourneyDateRange(j.start_at, j.end_at)}
                          {(j.location as { name?: string } | null)?.name && ` · ${(j.location as { name: string }).name}`}
                        </div>
                      </div>
                      <span style={{ color: 'var(--gold)', fontFamily: 'var(--font-mono)', fontSize: '0.65rem' }}>
                        {isReady ? 'View experience →' : 'Continue →'}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
