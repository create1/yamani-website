'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ALL_COURSES, TRACK_META } from '@/lib/courses'
import type { User } from '@supabase/supabase-js'

interface Session {
  id: string
  course_id: string
  scheduled_date: string
  status: 'scheduled' | 'live' | 'ended' | 'cancelled'
  daily_room_url: string | null
  daily_room_name: string | null
  course?: { slug: string; name: string; track: string; start_time: string }
}

interface CourseRow {
  id: string
  slug: string
  name: string
  track: string
}

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [sessions, setSessions] = useState<Session[]>([])
  const [courses, setCourses] = useState<CourseRow[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [tab, setTab] = useState<'sessions' | 'seed'>('sessions')
  const [seedStatus, setSeedStatus] = useState('')
  const [newSession, setNewSession] = useState({ course_id: '', scheduled_date: '', status: 'scheduled' })

  const loadSessions = useCallback(async () => {
    const { data } = await supabase
      .from('sessions')
      .select('*, course:courses(slug, name, track, start_time)')
      .order('scheduled_date', { ascending: false })
      .limit(50)
    setSessions((data ?? []) as Session[])
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const u = data.session?.user
      if (!u) { router.push('/auth/signin'); return }
      setUser(u)
      const { data: prof } = await supabase.from('users').select('role').eq('id', u.id).single()
      if (prof?.role !== 'admin' && prof?.role !== 'instructor') {
        router.push('/dashboard'); return
      }
      setIsAdmin(true)

      const { data: courseRows } = await supabase.from('courses').select('id, slug, name, track').order('name')
      setCourses((courseRows ?? []) as CourseRow[])
      await loadSessions()
      setLoading(false)
    })
  }, [router, loadSessions])

  const goLive = async (session: Session) => {
    setActionLoading(session.id)
    await fetch('/api/sessions/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: session.id }),
    })
    await loadSessions()
    setActionLoading(null)
  }

  const endSession = async (sessionId: string) => {
    setActionLoading(sessionId)
    await supabase.from('sessions').update({ status: 'ended' }).eq('id', sessionId)
    await loadSessions()
    setActionLoading(null)
  }

  const createSession = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSession.course_id || !newSession.scheduled_date) return
    setActionLoading('create')
    await supabase.from('sessions').insert({
      course_id: newSession.course_id,
      scheduled_date: newSession.scheduled_date,
      status: newSession.status,
    })
    setNewSession({ course_id: '', scheduled_date: '', status: 'scheduled' })
    await loadSessions()
    setActionLoading(null)
  }

  const seedCourses = async () => {
    setSeedStatus('Seeding…')
    const res = await fetch('/api/courses/seed', { method: 'POST' })
    const json = await res.json()
    setSeedStatus(json.message ?? (res.ok ? 'Done!' : 'Error'))
    if (res.ok) {
      const { data: courseRows } = await supabase.from('courses').select('id, slug, name, track').order('name')
      setCourses((courseRows ?? []) as CourseRow[])
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="spinner" />
      </div>
    )
  }

  if (!isAdmin) return null

  const statusColor: Record<string, string> = {
    scheduled: 'var(--muted)',
    live: 'var(--gold)',
    ended: 'rgba(120,120,120,0.6)',
    cancelled: 'rgba(196,97,58,0.8)',
  }

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p className="eyebrow">Admin</p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 2.75rem)' }}>
            Session Manager
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginTop: '0.25rem' }}>
            Signed in as {user?.email}
          </p>
        </div>
        <Link href="/dashboard" className="btn btn-outline btn-sm">← Dashboard</Link>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--border2)', paddingBottom: '0' }}>
        {(['sessions', 'seed'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em',
              textTransform: 'uppercase', padding: '0.5rem 1.25rem',
              background: 'none', border: 'none', cursor: 'pointer',
              color: tab === t ? 'var(--gold)' : 'var(--muted)',
              borderBottom: `2px solid ${tab === t ? 'var(--gold)' : 'transparent'}`,
              marginBottom: '-1px',
            }}
          >
            {t === 'sessions' ? 'Sessions' : 'DB Seed'}
          </button>
        ))}
      </div>

      {tab === 'seed' && (
        <div style={{ maxWidth: '600px' }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '0.5rem' }}>Seed Course Database</h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                This inserts all {ALL_COURSES.length} courses from the code into the Supabase database. Run this once after setting up your Supabase project.
              </p>
            </div>
            <button onClick={seedCourses} className="btn btn-gold" style={{ width: 'fit-content' }} disabled={!!seedStatus && seedStatus !== 'Done!'}>
              {seedStatus || `Seed ${ALL_COURSES.length} Courses →`}
            </button>
            {seedStatus && (
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: seedStatus.includes('Error') ? 'var(--terracotta)' : 'var(--gold)' }}>
                {seedStatus}
              </p>
            )}
            {courses.length > 0 && (
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', marginBottom: '0.75rem', letterSpacing: '0.08em' }}>
                  {courses.length} COURSES IN DATABASE
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {Object.keys(TRACK_META).map(track => {
                    const count = courses.filter(c => c.track === track).length
                    return (
                      <span key={track} className={`track-badge track-${track}`}>
                        {TRACK_META[track as keyof typeof TRACK_META].label}: {count}
                      </span>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'sessions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {/* Create session */}
          <div className="card" style={{ maxWidth: '600px' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: '1.25rem' }}>Schedule a Session</h2>
            <form onSubmit={createSession} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-field">
                <label className="form-label">Course</label>
                <select
                  className="form-select"
                  value={newSession.course_id}
                  onChange={e => setNewSession(s => ({ ...s, course_id: e.target.value }))}
                  required
                >
                  <option value="">Select a course…</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label className="form-label">Date</label>
                <input
                  className="form-input"
                  type="date"
                  value={newSession.scheduled_date}
                  onChange={e => setNewSession(s => ({ ...s, scheduled_date: e.target.value }))}
                  required
                />
              </div>
              <div className="form-field">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={newSession.status}
                  onChange={e => setNewSession(s => ({ ...s, status: e.target.value }))}
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="live">Live (go live immediately)</option>
                </select>
              </div>
              <button type="submit" className="btn btn-gold" disabled={actionLoading === 'create'} style={{ width: 'fit-content' }}>
                {actionLoading === 'create' ? 'Creating…' : 'Create Session →'}
              </button>
            </form>
          </div>

          {/* Sessions list */}
          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: '1.25rem' }}>
              All Sessions ({sessions.length})
            </h2>
            {sessions.length === 0 ? (
              <div className="card">
                <p style={{ color: 'var(--muted)', textAlign: 'center' }}>No sessions yet. Create one above.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {sessions.map(session => (
                  <div key={session.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem' }}>
                        {session.course?.name ?? 'Unknown Course'}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)' }}>
                        {new Date(session.scheduled_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        {session.course?.start_time && ` · ${session.course.start_time}`}
                      </div>
                      {session.daily_room_url && (
                        <a href={session.daily_room_url} target="_blank" rel="noopener noreferrer"
                          style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--gold)' }}>
                          {session.daily_room_url}
                        </a>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: statusColor[session.status] ?? 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        {session.status === 'live' && '● '}
                        {session.status}
                      </span>
                      {session.status === 'scheduled' && (
                        <button
                          className="btn btn-gold btn-sm"
                          onClick={() => goLive(session)}
                          disabled={actionLoading === session.id}
                        >
                          {actionLoading === session.id ? 'Starting…' : '● Go Live'}
                        </button>
                      )}
                      {session.status === 'live' && (
                        <>
                          <Link href={`/courses/${session.course?.slug}/live`} className="btn btn-outline btn-sm">
                            View Room →
                          </Link>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => endSession(session.id)}
                            disabled={actionLoading === session.id}
                          >
                            {actionLoading === session.id ? '…' : 'End'}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
