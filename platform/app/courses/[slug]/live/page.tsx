'use client'
import { use, useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { COURSES_BY_SLUG } from '@/lib/courses'
import { supabase } from '@/lib/supabase'
import type { Message, Session } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

interface PageProps { params: Promise<{ slug: string }> }

export default function LiveClassroomPage({ params }: PageProps) {
  const { slug } = use(params)
  const course = COURSES_BY_SLUG[slug]
  if (!course) notFound()

  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMsg, setNewMsg] = useState('')
  const [sending, setSending] = useState(false)
  const [attendanceType, setAttendanceType] = useState<'remote' | 'in-room'>('remote')
  const [goingLive, setGoingLive] = useState(false)
  const [isInstructor, setIsInstructor] = useState(false)
  const [iframeToken, setIframeToken] = useState<string | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Auth
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const u = data.session?.user ?? null
      setUser(u)
      if (u) {
        const { data: profile } = await supabase.from('users').select('role').eq('id', u.id).single()
        setIsInstructor(profile?.role === 'instructor' || profile?.role === 'admin')
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null))
    return () => subscription.unsubscribe()
  }, [])

  // Load active session
  useEffect(() => {
    async function loadSession() {
      const { data: courseRow } = await supabase.from('courses').select('id').eq('slug', slug).single()
      if (!courseRow) return

      const { data: sess } = await supabase
        .from('sessions')
        .select('*')
        .eq('course_id', courseRow.id)
        .in('status', ['live', 'scheduled'])
        .order('scheduled_date', { ascending: true })
        .limit(1)
        .single()
      if (sess) setSession(sess)
    }
    loadSession()
  }, [slug])

  // Load messages + subscribe to realtime
  useEffect(() => {
    if (!session) return

    async function loadMessages() {
      const { data } = await supabase
        .from('messages')
        .select('*, user:users(name, role)')
        .eq('session_id', session!.id)
        .order('created_at', { ascending: true })
      setMessages((data as Message[]) ?? [])
    }
    loadMessages()

    const channel = supabase
      .channel(`session-${session.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `session_id=eq.${session.id}` },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message])
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [session])

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Fetch Daily token once session has a room
  const fetchToken = useCallback(async () => {
    if (!session?.daily_room_name || !user) return
    const res = await fetch('/api/sessions/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: session.id,
        roomName: session.daily_room_name,
        userName: user.email,
        isOwner: isInstructor,
      }),
    })
    const { token } = await res.json()
    setIframeToken(token)
  }, [session, user, isInstructor])

  useEffect(() => { fetchToken() }, [fetchToken])

  const handleGoLive = async () => {
    if (!session) return
    setGoingLive(true)
    await fetch('/api/sessions/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: session.id }),
    })
    // Reload session to get room URL
    const { data } = await supabase.from('sessions').select('*').eq('id', session.id).single()
    if (data) { setSession(data); fetchToken() }
    setGoingLive(false)
  }

  const sendMessage = async () => {
    if (!newMsg.trim() || !user || !session) return
    setSending(true)
    await supabase.from('messages').insert({
      session_id: session.id,
      user_id: user.id,
      body: newMsg.trim(),
      attendance_type: attendanceType,
    })
    setNewMsg('')
    setSending(false)
  }

  if (!user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem' }}>Sign in to Join the Classroom</h2>
        <p style={{ color: 'var(--muted)' }}>You need to be enrolled and signed in to access live sessions.</p>
        <Link href="/auth/signin" className="btn btn-gold">Sign In →</Link>
      </div>
    )
  }

  const dailyUrl = session?.daily_room_url
  const iframeSrc = dailyUrl && iframeToken
    ? `${dailyUrl}?t=${iframeToken}`
    : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - var(--nav-h))' }}>
      {/* Top bar */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href={`/courses/${slug}`} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', letterSpacing: '0.08em' }}>
            ← {course.name}
          </Link>
          {session?.status === 'live' && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--gold)', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--gold)', display: 'inline-block', animation: 'pulse 1.5s ease-in-out infinite' }} />
              LIVE
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Attendance toggle */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className={`btn btn-sm ${attendanceType === 'remote' ? 'btn-gold' : 'btn-ghost'}`}
              onClick={() => setAttendanceType('remote')}
            >
              Remote
            </button>
            <button
              className={`btn btn-sm ${attendanceType === 'in-room' ? 'btn-gold' : 'btn-ghost'}`}
              onClick={() => setAttendanceType('in-room')}
            >
              In-Room
            </button>
          </div>

          {isInstructor && !session?.daily_room_url && (
            <button className="btn btn-gold btn-sm" onClick={handleGoLive} disabled={goingLive}>
              {goingLive ? 'Creating room…' : '● Go Live'}
            </button>
          )}
        </div>
      </div>

      {/* Main layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', flex: 1, overflow: 'hidden' }}>
        {/* Video area */}
        <div style={{ background: '#000', position: 'relative', overflow: 'hidden' }}>
          {iframeSrc ? (
            <iframe
              src={iframeSrc}
              allow="camera; microphone; fullscreen; speaker; display-capture"
              style={{ width: '100%', height: '100%', border: 'none' }}
              title="Live classroom"
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', color: 'var(--muted)', textAlign: 'center', padding: '2rem' }}>
              {isInstructor && !session?.daily_room_url ? (
                <>
                  <div style={{ fontSize: '3rem' }}>📹</div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--text)' }}>Ready to Go Live?</h3>
                  <p style={{ maxWidth: '35ch', fontSize: '0.9rem' }}>Click &ldquo;Go Live&rdquo; to create the video room and start streaming to both in-person and remote students.</p>
                  <button className="btn btn-gold btn-lg" onClick={handleGoLive} disabled={goingLive}>
                    {goingLive ? 'Setting up room…' : '● Start Live Session'}
                  </button>
                </>
              ) : (
                <>
                  <div style={{ fontSize: '3rem' }}>⏳</div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--text)' }}>Session Not Yet Live</h3>
                  <p style={{ maxWidth: '35ch', fontSize: '0.9rem' }}>The instructor will start the live stream shortly. You&apos;ll be connected automatically. Use the chat to connect with other students in the meantime.</p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Chat panel */}
        <div style={{ background: 'var(--surface2)', borderLeft: '1px solid var(--border2)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Chat header */}
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border2)', flexShrink: 0 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Live Chat
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
              Shared between in-room &amp; remote students
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {messages.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', marginTop: '2rem' }}>
                No messages yet. Say hello!
              </div>
            ) : (
              messages.map(msg => (
                <ChatMessage key={msg.id} message={msg} currentUserId={user?.id} />
              ))
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--border2)', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                className="form-input"
                style={{ flex: 1, fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}
                placeholder="Type a message…"
                value={newMsg}
                onChange={e => setNewMsg(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                disabled={!session || sending}
              />
              <button
                className="btn btn-gold btn-sm"
                onClick={sendMessage}
                disabled={!newMsg.trim() || !session || sending}
              >
                →
              </button>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', marginTop: '0.4rem' }}>
              Sending as <span style={{ color: 'var(--gold)' }}>{attendanceType}</span> · Enter to send
            </div>
          </div>
        </div>
      </div>

      {/* Materials bar */}
      <div style={{ background: 'var(--surface)', borderTop: '1px solid var(--border2)', padding: '0.6rem 1.5rem', display: 'flex', gap: '2rem', alignItems: 'center', flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)' }}>
        <span style={{ color: 'var(--text)' }}>📎 Session Materials</span>
        <span>Slides will be available here during the session</span>
        <Link href={`/courses/${slug}`} style={{ marginLeft: 'auto', color: 'var(--gold)' }}>
          Course Home →
        </Link>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}

function ChatMessage({ message, currentUserId }: { message: Message; currentUserId?: string }) {
  const isOwn = message.user_id === currentUserId
  const name = (message.user as { name?: string })?.name ?? 'Anonymous'
  const role = (message.user as { role?: string })?.role ?? 'student'
  const isInstructor = role === 'instructor' || role === 'admin'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', alignItems: isOwn ? 'flex-end' : 'flex-start' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {!isOwn && (
          <div className="avatar" style={{ width: '1.5rem', height: '1.5rem', fontSize: '0.55rem' }}>
            {name.slice(0, 2).toUpperCase()}
          </div>
        )}
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: isInstructor ? 'var(--gold)' : 'var(--muted)' }}>
          {isOwn ? 'You' : name}
          {isInstructor && ' · Instructor'}
          {message.attendance_type === 'in-room' && ' · In-Room'}
        </span>
      </div>
      <div style={{
        background: isOwn ? 'var(--gold-glow)' : 'var(--surface)',
        border: `1px solid ${isInstructor ? 'var(--border)' : 'var(--border2)'}`,
        borderRadius: 'var(--radius)',
        padding: '0.5rem 0.75rem',
        maxWidth: '85%',
        fontSize: '0.85rem',
        lineHeight: 1.5,
        color: 'var(--text)',
        wordBreak: 'break-word',
      }}>
        {message.body}
      </div>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', color: 'var(--muted)' }}>
        {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  )
}
