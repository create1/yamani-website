'use client'
import Link from 'next/link'
import { useState } from 'react'

/* ─── Slide counter chip ───────────────────────────────── */
function SlideNum({ n, total }: { n: string; total: string }) {
  return (
    <div style={{
      fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.14em',
      color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.35rem',
    }}>
      <span style={{ color: 'var(--gold)' }}>{n}</span>
      <span style={{ width: '1.5rem', height: '1px', background: 'var(--border)' }} />
      <span>{total}</span>
    </div>
  )
}

/* ─── Divider line ─────────────────────────────────────── */
function HDivide() {
  return <div style={{ width: '3rem', height: '1px', background: 'var(--gold)', margin: '2rem 0', opacity: 0.6 }} />
}

/* ─── Big stat block ───────────────────────────────────── */
function Stat({ num, label, accent = false }: { num: string; label: string; accent?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      <div style={{
        fontFamily: 'var(--font-serif)', fontSize: 'clamp(3rem, 6vw, 5rem)',
        fontWeight: 700, lineHeight: 1, color: accent ? 'var(--gold)' : 'var(--text)',
      }}>{num}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.1em', color: 'var(--muted)', textTransform: 'uppercase' }}>{label}</div>
    </div>
  )
}

/* ─── Pill tag ─────────────────────────────────────────── */
function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.12em',
      textTransform: 'uppercase', color: 'var(--gold)',
      border: '1px solid rgba(201,168,76,0.3)', borderRadius: '2rem',
      padding: '0.2rem 0.75rem',
    }}>{children}</span>
  )
}

export default function DeckPage() {
  const [waitEmail, setWaitEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  return (
    <>
      <div className="deck-wrap">

        {/* ═══════════════════════════════════════════════════
            01 — COVER
        ═══════════════════════════════════════════════════ */}
        <section className="slide slide-cover">
          <div className="slide-inner">
            <SlideNum n="01" total="09" />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                Introducing
              </p>
              <h1 style={{
                fontFamily: 'var(--font-serif)', fontSize: 'clamp(5rem, 16vw, 14rem)',
                fontWeight: 700, lineHeight: 0.9, letterSpacing: '-0.02em', color: 'var(--text)',
              }}>
                Apo<em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>theos</em>
              </h1>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(0.7rem, 1.5vw, 1rem)', letterSpacing: '0.25em', color: 'var(--muted)', textTransform: 'uppercase', marginTop: '1.5rem' }}>
                The Living Campus
              </p>
              <div style={{ width: '100%', height: '1px', background: 'var(--border)', margin: '3rem 0' }} />
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.1rem, 2.5vw, 1.75rem)', color: 'var(--muted)', maxWidth: '36ch', lineHeight: 1.55, fontStyle: 'italic' }}>
                "A new institution where AI literacy, entrepreneurial resilience, and human flourishing are learned together — in community, not in silos."
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link href="/auth/signup" className="btn btn-gold">Create Account →</Link>
              <Link href="/auth/signin" className="btn btn-outline">Sign In</Link>
            </div>
          </div>
          {/* Radial glow */}
          <div className="deck-glow" />
        </section>

        {/* ═══════════════════════════════════════════════════
            02 — THE PROBLEM
        ═══════════════════════════════════════════════════ */}
        <section className="slide slide-dark">
          <div className="slide-inner">
            <SlideNum n="02" total="09" />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Tag>The Problem</Tag>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 7vw, 6rem)', fontWeight: 700, lineHeight: 1.0, marginTop: '1.5rem', maxWidth: '16ch' }}>
                The World Changed.<br /><em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Education Didn&apos;t.</em>
              </h2>
              <HDivide />
              <div className="problem-grid">
                {[
                  {
                    icon: '◈', color: 'var(--teal-lt)', label: 'AI Literacy',
                    body: 'The most transformative technology in human history is being taught in textbooks — years after the world already changed.',
                  },
                  {
                    icon: '◎', color: 'var(--gold)', label: 'Entrepreneurship',
                    body: 'MBA programs silo business education behind credential walls, disconnected from the actual founder experience.',
                  },
                  {
                    icon: '✦', color: 'var(--sage-lt)', label: 'Wellness',
                    body: 'Embodied health, mental resilience, and community are treated as extracurricular — not the foundation of high performance.',
                  },
                ].map(p => (
                  <div key={p.label} style={{ borderTop: `2px solid ${p.color}`, paddingTop: '1.5rem' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: p.color, marginBottom: '0.75rem' }}>{p.icon} {p.label}</div>
                    <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.75 }}>{p.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            03 — THE SOLUTION
        ═══════════════════════════════════════════════════ */}
        <section className="slide">
          <div className="slide-inner">
            <SlideNum n="03" total="09" />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Tag>The Solution</Tag>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 7vw, 6rem)', fontWeight: 700, lineHeight: 1.0, marginTop: '1.5rem', maxWidth: '20ch' }}>
                One Institution.<br /><em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Three Disciplines.</em><br />One Community.
              </h2>
              <HDivide />
              <p style={{ color: 'var(--muted)', fontSize: 'clamp(1rem, 2vw, 1.25rem)', maxWidth: '52ch', lineHeight: 1.8 }}>
                Apotheos is a physical campus and digital platform where AI literacy, creative entrepreneurship, and embodied wellness reinforce each other every single day — taught by expert humans <em>and</em> next-generation AI agents.
              </p>
              <div className="stat-row" style={{ marginTop: '4rem' }}>
                <Stat num="3" label="Core disciplines" accent />
                <Stat num="30+" label="Weekly live classes" />
                <Stat num="12" label="Campus spaces" />
                <Stat num="∞" label="Online access" accent />
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            04 — THREE PILLARS
        ═══════════════════════════════════════════════════ */}
        <section className="slide slide-dark">
          <div className="slide-inner">
            <SlideNum n="04" total="09" />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Tag>The Model</Tag>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 5vw, 4.5rem)', fontWeight: 700, lineHeight: 1.05, marginTop: '1.5rem' }}>
                Three Pillars, One Campus
              </h2>
              <HDivide />
              <div className="pillars-grid">
                {[
                  {
                    num: '01', icon: '🧘', color: 'var(--sage-lt)', track: 'Wellness & Embodiment',
                    tagline: 'Build a body and mind that can carry the vision.',
                    items: ['Yoga, breathwork & somatics', 'Meditation & nervous system regulation', 'Nutrition, sleep & recovery science', 'Embodied leadership & resilience'],
                  },
                  {
                    num: '02', icon: '◈', color: 'var(--teal-lt)', track: 'AI & Technology',
                    tagline: 'Become fluent in the tools reshaping everything.',
                    items: ['Prompt engineering & LLM fundamentals', 'AI agent design & automation', 'Machine learning & data science', 'Building with frontier models'],
                  },
                  {
                    num: '03', icon: '◎', color: 'var(--gold)', track: 'Creative & Founder',
                    tagline: 'Ship ideas. Build ventures. Lead with vision.',
                    items: ['Startup mechanics & fundraising', 'Product design & creative direction', 'Content, brand & storytelling', 'Founder mentorship & cohorts'],
                  },
                ].map(p => (
                  <div key={p.num} className="pillar-card" style={{ borderTop: `2px solid ${p.color}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.15em', color: p.color }}>{p.num}</span>
                      <span style={{ fontSize: '1.5rem' }}>{p.icon}</span>
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '0.5rem', color: p.color }}>{p.track}</h3>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '1.25rem', fontStyle: 'italic' }}>{p.tagline}</p>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {p.items.map(item => (
                        <li key={item} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                          <span style={{ color: p.color, flexShrink: 0, fontSize: '0.65rem', marginTop: '0.15rem' }}>—</span>{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            05 — THE PLATFORM
        ═══════════════════════════════════════════════════ */}
        <section className="slide">
          <div className="slide-inner slide-split">
            <div className="split-text">
              <SlideNum n="05" total="09" />
              <Tag>The Platform</Tag>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 700, lineHeight: 1.0, marginTop: '1.5rem' }}>
                Join Any Class,<br /><em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Anywhere</em>
              </h2>
              <HDivide />
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
                {[
                  { icon: '◎', c: 'var(--gold)', text: 'Every class live-streamed simultaneously — attend in-person or remotely' },
                  { icon: '◎', c: 'var(--gold)', text: 'Real-time shared chat between in-room and remote students' },
                  { icon: '◈', c: 'var(--teal-lt)', text: 'AI agent sessions available on-demand, any time of day', badge: 'NEW' },
                  { icon: '◎', c: 'var(--gold)', text: 'Session recordings available after class ends' },
                  { icon: '◎', c: 'var(--gold)', text: 'Downloadable materials, slides, and project resources' },
                ].map(item => (
                  <li key={item.text} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                    <span style={{ color: item.c, flexShrink: 0, marginTop: '0.1rem', fontSize: '1rem' }}>{item.icon}</span>
                    <span>
                      {item.text}
                      {item.badge && (
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: 'var(--teal-lt)', letterSpacing: '0.1em', marginLeft: '0.5rem', border: '1px solid rgba(123,179,190,0.35)', borderRadius: '2rem', padding: '0.1rem 0.5rem', verticalAlign: 'middle' }}>{item.badge}</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              <Link href="/courses" className="btn btn-gold">Browse All Courses →</Link>
            </div>

            {/* Live classroom mockup */}
            <div className="split-visual">
              <div style={{
                background: 'var(--surface2)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)', padding: '1.5rem',
                fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border2)' }}>
                  <span style={{ color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--gold)', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                    LIVE
                  </span>
                  <span style={{ color: 'var(--muted)', fontSize: '0.62rem' }}>14 attending · 8 remote · 6 in-room</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem', height: '160px', marginBottom: '0.75rem' }}>
                  <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border2)', color: 'var(--muted)', flexDirection: 'column', gap: '0.5rem' }}>
                    <span style={{ fontSize: '2rem' }}>📹</span>
                    <span style={{ fontSize: '0.6rem' }}>Instructor Live Stream</span>
                  </div>
                  <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: '0.75rem', border: '1px solid var(--border2)', display: 'flex', flexDirection: 'column', gap: '0.45rem', overflow: 'hidden' }}>
                    <div style={{ color: 'var(--gold)', marginBottom: '0.25rem', fontSize: '0.6rem' }}>Live Chat</div>
                    {[{ n: 'Alex', m: 'This is incredible', g: false }, { n: 'Sarah', m: 'Can you repeat that?', g: false }, { n: 'Instructor', m: 'Of course! So…', g: true }, { n: 'Jordan', m: 'Got it, thanks!', g: false }].map((c, i) => (
                      <div key={i} style={{ fontSize: '0.55rem', lineHeight: 1.4 }}>
                        <span style={{ color: c.g ? 'var(--gold)' : 'var(--teal-lt)' }}>{c.n}: </span>
                        <span style={{ color: 'var(--muted)' }}>{c.m}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                  {['◈ AI Agent', '◎ Recording', '◎ Resources', '◎ Q&A'].map(t => (
                    <div key={t} style={{ background: 'var(--surface)', border: '1px solid var(--border2)', borderRadius: 'var(--radius)', padding: '0.4rem 0.5rem', fontSize: '0.52rem', color: 'var(--muted)', textAlign: 'center' }}>{t}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            06 — AI AGENTS
        ═══════════════════════════════════════════════════ */}
        <section className="slide slide-dark">
          <div className="slide-inner slide-split slide-split-reverse">
            {/* Agent chat mockup */}
            <div className="split-visual">
              <div style={{
                background: 'var(--surface2)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)', padding: '1.75rem',
                fontFamily: 'var(--font-mono)', fontSize: '0.7rem', position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: '-40%', left: '50%', transform: 'translateX(-50%)', width: '60%', height: '200px', background: 'radial-gradient(ellipse, rgba(123,179,190,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--teal-lt)', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                    <span style={{ color: 'var(--teal-lt)', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.58rem' }}>Agent Active</span>
                  </div>
                  <span style={{ color: 'var(--muted)', fontSize: '0.55rem' }}>Intro to Prompt Engineering</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {[
                    { role: 'student', text: "I'm confused about temperature settings in LLMs — can you show me a real example?" },
                    { role: 'agent', text: "Absolutely. Let's run the same prompt at temp 0.1 vs 1.0 right now and compare outputs live. Watch this…" },
                  ].map((m, i) => {
                    const isAgent = m.role === 'agent'
                    return (
                      <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', flexDirection: isAgent ? 'row' : 'row-reverse' }}>
                        <div style={{ width: '1.4rem', height: '1.4rem', borderRadius: '50%', flexShrink: 0, background: isAgent ? 'rgba(123,179,190,0.15)' : 'rgba(201,168,76,0.12)', border: `1px solid ${isAgent ? 'rgba(123,179,190,0.4)' : 'rgba(201,168,76,0.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', color: isAgent ? 'var(--teal-lt)' : 'var(--gold)' }}>
                          {isAgent ? '◈' : '◎'}
                        </div>
                        <div style={{ background: isAgent ? 'rgba(123,179,190,0.06)' : 'rgba(201,168,76,0.04)', border: `1px solid ${isAgent ? 'rgba(123,179,190,0.15)' : 'rgba(201,168,76,0.1)'}`, borderRadius: 'var(--radius)', padding: '0.45rem 0.6rem', color: 'var(--muted)', fontSize: '0.62rem', lineHeight: 1.55, maxWidth: '85%' }}>
                          {m.text}
                        </div>
                      </div>
                    )
                  })}
                  <div style={{ background: 'rgba(123,179,190,0.06)', border: '1px solid rgba(123,179,190,0.2)', borderRadius: 'var(--radius)', padding: '0.6rem 0.75rem' }}>
                    <div style={{ color: 'var(--teal-lt)', fontSize: '0.52rem', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>LIVE DEMO · RUNNING</div>
                    <div style={{ color: 'var(--muted)', fontSize: '0.58rem', lineHeight: 1.6 }}>
                      <span style={{ color: 'var(--text)' }}>temp=0.1:</span> &quot;The capital of France is Paris.&quot;<br />
                      <span style={{ color: 'var(--text)' }}>temp=1.0:</span> &quot;France&apos;s soul lives in Paris — city of light…&quot;
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', flexDirection: 'row-reverse' }}>
                    <div style={{ width: '1.4rem', height: '1.4rem', borderRadius: '50%', flexShrink: 0, background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', color: 'var(--gold)' }}>◎</div>
                    <div style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.1)', borderRadius: 'var(--radius)', padding: '0.45rem 0.6rem', color: 'var(--muted)', fontSize: '0.62rem', lineHeight: 1.55, maxWidth: '85%' }}>Oh wow, that makes total sense now.</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="split-text">
              <SlideNum n="06" total="09" />
              <Tag>The Future of Instruction</Tag>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 700, lineHeight: 1.0, marginTop: '1.5rem' }}>
                Some Classes Are Taught by <em style={{ color: 'var(--teal-lt)', fontStyle: 'italic' }}>AI Agents</em>
              </h2>
              <HDivide />
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.8, marginBottom: '1.75rem' }}>
                Not chatbots reading slides. Pedagogically-designed agents built on frontier models — trained to teach, adapt, and run live experiments mid-session.
              </p>
              <div className="agent-stats">
                {[
                  { icon: '◈', c: 'var(--teal-lt)', text: 'Available 24 / 7 — run a session at 2 am' },
                  { icon: '◈', c: 'var(--teal-lt)', text: 'Adapts in real time to your pace and knowledge level' },
                  { icon: '◈', c: 'var(--teal-lt)', text: 'Runs live code, experiments, and simulations mid-class' },
                  { icon: '◈', c: 'var(--teal-lt)', text: 'Seamlessly hands off to a human instructor when needed' },
                ].map(item => (
                  <div key={item.text} style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start', fontSize: '0.88rem', color: 'var(--muted)', lineHeight: 1.6 }}>
                    <span style={{ color: item.c, flexShrink: 0, marginTop: '0.1rem' }}>{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            07 — THE CAMPUS
        ═══════════════════════════════════════════════════ */}
        <section className="slide">
          <div className="slide-inner">
            <SlideNum n="07" total="09" />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Tag>Physical Campus</Tag>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 7vw, 6rem)', fontWeight: 700, lineHeight: 0.95, marginTop: '1.5rem' }}>
                Nevada City,<br /><em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>California</em>
              </h2>
              <HDivide />
              <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.8, maxWidth: '52ch', marginBottom: '3rem' }}>
                A fully-built campus in the Sierra Nevada foothills — 12 dedicated spaces for movement, technology, creativity, and community. Open now.
              </p>

              <div className="campus-grid">
                {[
                  { icon: '🏃', space: 'Movement Studio', desc: 'Sprung floor, barre, yoga props. Holds 20.' },
                  { icon: '💻', space: 'Tech Lab', desc: 'High-spec workstations, dual monitors, GPU cluster.' },
                  { icon: '🎙', space: 'Recording Studio', desc: 'Professional booth, mixing desk, podcast rig.' },
                  { icon: '🧘', space: 'Meditation Room', desc: 'Soundproofed sanctuary with cushions. Holds 15.' },
                  { icon: '🎨', space: 'Art Studio', desc: 'Natural light, easels, ceramics wheel.' },
                  { icon: '⬡', space: 'Great Hall', desc: 'Vaulted gathering space for workshops & panels.' },
                  { icon: '◎', space: 'Parlour', desc: 'Intimate salon for small-group mentorship.' },
                  { icon: '🌲', space: 'Patio', desc: 'Outdoor terrace overlooking the pines.' },
                ].map(s => (
                  <div key={s.space} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '1rem', flexShrink: 0, marginTop: '0.1rem' }}>{s.icon}</span>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.08em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>{s.space}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.5 }}>{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '3rem' }}>
                <Link href="/locations/nevada-city" className="btn btn-outline">View Campus Schedule →</Link>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            08 — MEMBERSHIP
        ═══════════════════════════════════════════════════ */}
        <section className="slide slide-dark">
          <div className="slide-inner">
            <SlideNum n="08" total="09" />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Tag>Membership</Tag>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 700, lineHeight: 1.0, marginTop: '1.5rem' }}>
                Choose Your Path
              </h2>
              <HDivide />
              <div className="pricing-grid">
                {[
                  {
                    name: 'Community', price: '$49', freq: '/mo', featured: false, color: 'var(--border)',
                    tag: 'Online Only',
                    perks: ['Full online course library', 'Community chat & Discord', 'Monthly virtual events', 'Digital certificates'],
                  },
                  {
                    name: 'Seeker', price: '$149', freq: '/mo', featured: false, color: 'var(--border)',
                    tag: 'Weekend Campus',
                    perks: ['Campus access (weekends)', '4 live classes / month', 'Online + in-person hybrid', 'Wellness programming'],
                  },
                  {
                    name: 'Founder', price: '$399', freq: '/mo', featured: true, color: 'rgba(201,168,76,0.5)',
                    tag: '★ Most Popular',
                    perks: ['Full campus access — any day', 'Unlimited live classes', 'Cowork access', 'AI lab & founder office hours', 'Priority scheduling'],
                  },
                  {
                    name: 'Visionary', price: '$899', freq: '/mo', featured: false, color: 'var(--border)',
                    tag: 'All-Access',
                    perks: ['Everything in Founder', '1:1 mentorship monthly', 'Investor intro network', 'Recording studio access', 'Private cohort events'],
                  },
                ].map(t => (
                  <div key={t.name} style={{
                    borderTop: `2px solid ${t.color}`,
                    paddingTop: '1.5rem',
                    background: t.featured ? 'rgba(201,168,76,0.03)' : 'transparent',
                    padding: '1.5rem',
                    borderRadius: t.featured ? 'var(--radius)' : 0,
                    border: t.featured ? '1px solid rgba(201,168,76,0.25)' : 'none',
                    borderTopWidth: '2px',
                    borderTopColor: t.color,
                    borderTopStyle: 'solid',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', letterSpacing: '0.12em', color: t.featured ? 'var(--gold)' : 'var(--muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{t.tag}</div>
                      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', lineHeight: 1 }}>{t.name}</div>
                    </div>
                    <div>
                      <span style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: t.featured ? 'var(--gold)' : 'var(--text)', lineHeight: 1 }}>{t.price}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)' }}>{t.freq}</span>
                    </div>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem', flex: 1 }}>
                      {t.perks.map(p => (
                        <li key={p} style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'flex', gap: '0.5rem', lineHeight: 1.45 }}>
                          <span style={{ color: t.featured ? 'var(--gold)' : 'var(--border)', flexShrink: 0 }}>◎</span>{p}
                        </li>
                      ))}
                    </ul>
                    <Link href="/auth/signup" className={`btn btn-sm ${t.featured ? 'btn-gold' : 'btn-outline'}`} style={{ justifyContent: 'center' }}>
                      {t.featured ? 'Get Started →' : 'Join →'}
                    </Link>
                  </div>
                ))}
              </div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.05em', marginTop: '1.5rem', textAlign: 'center' }}>
                À la carte workshops from $20 · Free first session for all new learners · Sliding-scale & scholarship pricing available
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            09 — CTA / CLOSE
        ═══════════════════════════════════════════════════ */}
        <section className="slide slide-cover">
          <div className="slide-inner">
            <SlideNum n="09" total="09" />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                Be Part of It
              </p>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(3.5rem, 10vw, 9rem)', fontWeight: 700, lineHeight: 0.9, letterSpacing: '-0.01em' }}>
                Start<br /><em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Learning.</em>
              </h2>
              <div style={{ width: '100%', height: '1px', background: 'var(--border)', margin: '3rem 0' }} />
              <p style={{ color: 'var(--muted)', fontSize: 'clamp(1rem, 2vw, 1.2rem)', maxWidth: '44ch', lineHeight: 1.7, marginBottom: '2.5rem' }}>
                Create a free account. Explore the course catalog. Join a live class this week. The campus — physical and digital — is open.
              </p>

              {submitted ? (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--gold)', letterSpacing: '0.08em', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 'var(--radius)', padding: '1rem 1.5rem', maxWidth: '360px' }}>
                  ◎ You&apos;re on the list — we&apos;ll be in touch.
                </div>
              ) : (
                <form
                  style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', maxWidth: '480px' }}
                  onSubmit={(e) => { e.preventDefault(); if (waitEmail) setSubmitted(true) }}
                >
                  <input
                    type="email" required placeholder="your@email.com" value={waitEmail}
                    onChange={e => setWaitEmail(e.target.value)}
                    style={{
                      flex: '1 1 200px', background: 'var(--surface2)', border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)', padding: '0.75rem 1rem',
                      fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text)',
                      outline: 'none',
                    }}
                  />
                  <button type="submit" className="btn btn-gold">Join Waitlist →</button>
                </form>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                <Link href="/auth/signup" className="btn btn-outline">Create Account</Link>
                <Link href="/courses" className="btn btn-ghost">Browse Courses</Link>
                <Link href="/locations" className="btn btn-ghost">Find a Campus</Link>
              </div>
            </div>
          </div>
          <div className="deck-glow" />
        </section>

      </div>

      <style>{`
        /* ── Deck Layout ────────────────────────────────── */
        .deck-wrap {
          padding-top: var(--nav-h);
        }

        .slide {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }

        .slide-dark { background: var(--surface); }
        .slide-cover {
          background: radial-gradient(ellipse 90% 70% at 50% 30%, rgba(201,168,76,0.06) 0%, transparent 65%);
        }

        .slide-inner {
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          padding: clamp(3rem, 8vh, 6rem) 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          min-height: calc(100vh - var(--nav-h));
        }

        /* ── Two-column split slides ────────────────────── */
        .slide-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: center;
        }

        .slide-split-reverse .split-text { order: 2; }
        .slide-split-reverse .split-visual { order: 1; }

        .split-text { display: flex; flex-direction: column; gap: 0.5rem; }
        .split-visual { display: flex; flex-direction: column; }

        /* ── Glow decoration ────────────────────────────── */
        .deck-glow {
          position: absolute;
          bottom: -20%;
          right: -10%;
          width: 60%;
          height: 60%;
          background: radial-gradient(ellipse, rgba(201,168,76,0.05) 0%, transparent 65%);
          pointer-events: none;
        }

        /* ── Slide-specific grids ───────────────────────── */
        .problem-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        .stat-row {
          display: flex;
          gap: 3rem;
          flex-wrap: wrap;
          align-items: flex-start;
        }

        .pillars-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        .pillar-card {
          padding-top: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .campus-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem 2rem;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          align-items: start;
        }

        .agent-stats {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.35; }
        }

        /* ── Responsive ─────────────────────────────────── */
        @media (max-width: 1024px) {
          .campus-grid   { grid-template-columns: repeat(2, 1fr); }
          .pricing-grid  { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 900px) {
          .slide-split {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
          .slide-split-reverse .split-text  { order: 1; }
          .slide-split-reverse .split-visual { order: 2; }
          .problem-grid  { grid-template-columns: 1fr; gap: 2.5rem; }
          .pillars-grid  { grid-template-columns: 1fr; }
          .stat-row      { gap: 2rem; }
        }

        @media (max-width: 600px) {
          .campus-grid  { grid-template-columns: repeat(2, 1fr); gap: 1.25rem; }
          .pricing-grid { grid-template-columns: 1fr; }
          .stat-row     { gap: 1.5rem; }
        }
      `}</style>
    </>
  )
}
