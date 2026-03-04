'use client'

import Link from 'next/link'
import { TRACK_META } from '@/lib/courses'
import type { TrackName } from '@/lib/courses'

export default function AboutPage() {
  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Three Pillars */}
      <section className="section">
        <div className="container">
          <p className="eyebrow">The Model</p>
          <h1 className="section-title">Three Pillars, One Community</h1>
          <p className="section-subtitle" style={{ marginBottom: '3rem', maxWidth: '50ch' }}>
            Every program at Apotheos falls within one of three interconnected tracks.
          </p>
          <div className="grid-3">
            {(['wellness', 'ai', 'founder'] as const).map(track => {
              const m = TRACK_META[track as TrackName]
              return (
                <div key={track} className="card" style={{ gap: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: '2rem', color: m.color }}>{m.icon}</div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem' }}>{m.label}</h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.7 }}>{m.description}</p>
                  <Link href={`/courses?track=${track}`} className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-start' }}>View Courses →</Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* AI Agents */}
      <section className="section section-dark">
        <div className="container">
          <div className="ai-agent-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-40%', left: '50%', transform: 'translateX(-50%)', width: '60%', height: '200px', background: 'radial-gradient(ellipse, rgba(123,179,190,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--teal-lt)', display: 'inline-block', animation: 'pulse 2s ease-in-out infinite' }} />
                  <span style={{ color: 'var(--teal-lt)', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.6rem' }}>Agent Active</span>
                </div>
                <span style={{ color: 'var(--muted)', fontSize: '0.58rem' }}>Intro to Prompt Engineering</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <AgentMessage role="student" text="I'm confused about temperature settings in LLMs — can you show me a real example?" />
                <AgentMessage role="agent" text="Absolutely. Let's try the same prompt at temp 0.1 vs 1.0 right now and compare the outputs live. Watch this…" />
                <div style={{ background: 'rgba(123,179,190,0.06)', border: '1px solid rgba(123,179,190,0.2)', borderRadius: 'var(--radius)', padding: '0.6rem 0.75rem' }}>
                  <div style={{ color: 'var(--teal-lt)', fontSize: '0.55rem', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>LIVE DEMO · RUNNING</div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.6rem', lineHeight: 1.6 }}>
                    <span style={{ color: 'var(--text)' }}>temp=0.1:</span> &quot;The capital of France is Paris.&quot;<br />
                    <span style={{ color: 'var(--text)' }}>temp=1.0:</span> &quot;France&apos;s soul lives in Paris…&quot;
                  </div>
                </div>
                <AgentMessage role="student" text="Oh wow, that makes total sense now." />
                <AgentMessage role="agent" text="Try adjusting it yourself — I've opened the sandbox on your right. Ask me anything as you go." />
              </div>
            </div>
            <div>
              <p className="eyebrow">The Future of Instruction</p>
              <h2 className="section-title">Some Classes Are Taught by AI Agents</h2>
              <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.8, marginBottom: '1.25rem' }}>
                Select Apotheos courses are led by purpose-built AI instructors — adaptive agents that respond to your questions in real time, run live code demos, and adjust their teaching style to how you learn.
              </p>
              <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.8, marginBottom: '2rem' }}>
                These aren&apos;t chatbots reading slides. They&apos;re pedagogically-designed agents built on frontier models — trained to teach, not just to answer.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                {['Always available — run a session at 2am if that\'s when you think', 'Adapts in real time to your pace and knowledge level', 'Runs live experiments, code, and simulations mid-class', 'Seamlessly hands off to a human instructor when needed'].map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: 'var(--muted)', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--teal-lt)', flexShrink: 0, marginTop: '0.15rem' }}>◈</span>{item}
                  </li>
                ))}
              </ul>
              <Link href="/courses" className="btn btn-outline">See Agent-Led Courses →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Digital Platform */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <p className="eyebrow">Digital Platform</p>
              <h2 className="section-title">Join Any Class, Anywhere</h2>
              <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                Every Apotheos class is broadcast live. Attend from your home, your office, or anywhere in the world — with real-time chat, AI agent sessions, and recordings available after.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                {[
                  { text: 'Live video with the instructor and in-room participants', icon: '◎' },
                  { text: 'Real-time shared chat between in-room and remote students', icon: '◎' },
                  { text: 'AI agent sessions available on-demand, any time of day', icon: '◈', highlight: true },
                  { text: 'Session recordings available after class ends', icon: '◎' },
                  { text: 'Downloadable materials, slides, and resources', icon: '◎' },
                ].map(item => (
                  <li key={item.text} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: 'var(--muted)', fontSize: '0.9rem' }}>
                    <span style={{ color: item.highlight ? 'var(--teal-lt)' : 'var(--gold)', flexShrink: 0, marginTop: '0.15rem' }}>{item.icon}</span>
                    {item.text}{item.highlight && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--teal-lt)', letterSpacing: '0.08em', marginLeft: '0.4rem', border: '1px solid rgba(123,179,190,0.3)', borderRadius: '2rem', padding: '0.1rem 0.4rem' }}>NEW</span>}
                  </li>
                ))}
              </ul>
              <Link href="/courses" className="btn btn-gold">Browse All Courses →</Link>
            </div>
            <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border2)' }}>
                <span style={{ color: 'var(--gold)' }}>● LIVE</span>
                <span style={{ color: 'var(--muted)' }}>14 attending (8 remote, 6 in-room)</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', height: 180 }}>
                <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', border: '1px solid var(--border2)' }}>
                  <div style={{ textAlign: 'center' }}><div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📹</div><div>Instructor Live Stream</div></div>
                </div>
                <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid var(--border2)', overflowY: 'auto' }}>
                  <div style={{ color: 'var(--gold)' }}>Live Chat</div>
                  <div style={{ fontSize: '0.58rem', lineHeight: 1.4 }}><span style={{ color: 'var(--teal-lt)' }}>Alex:</span> <span style={{ color: 'var(--muted)' }}>This is incredible</span></div>
                  <div style={{ fontSize: '0.58rem', lineHeight: 1.4 }}><span style={{ color: 'var(--gold)' }}>Instructor:</span> <span style={{ color: 'var(--muted)' }}>Of course! So...</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container" style={{ textAlign: 'center', paddingTop: '2rem' }}>
        <Link href="/mission" className="btn btn-outline">← Mission</Link>
        <Link href="/courses" className="btn btn-gold" style={{ marginLeft: '0.5rem' }}>Browse Courses →</Link>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @media (max-width: 768px) { .ai-agent-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}

function AgentMessage({ role, text }: { role: 'student' | 'agent'; text: string }) {
  const isAgent = role === 'agent'
  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', flexDirection: isAgent ? 'row' : 'row-reverse' }}>
      <div style={{ width: '1.4rem', height: '1.4rem', borderRadius: '50%', flexShrink: 0, background: isAgent ? 'rgba(123,179,190,0.15)' : 'rgba(201,168,76,0.12)', border: `1px solid ${isAgent ? 'rgba(123,179,190,0.4)' : 'rgba(201,168,76,0.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', color: isAgent ? 'var(--teal-lt)' : 'var(--gold)' }}>{isAgent ? '◈' : '◎'}</div>
      <div style={{ background: isAgent ? 'rgba(123,179,190,0.06)' : 'rgba(201,168,76,0.04)', border: `1px solid ${isAgent ? 'rgba(123,179,190,0.15)' : 'rgba(201,168,76,0.1)'}`, borderRadius: 'var(--radius)', padding: '0.45rem 0.6rem', color: 'var(--muted)', fontSize: '0.62rem', lineHeight: 1.55, maxWidth: '85%' }}>{text}</div>
    </div>
  )
}
