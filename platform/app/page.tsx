'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { TRACK_META } from '@/lib/courses'

export default function HomePage() {
  const router = useRouter()
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        router.replace('/dashboard')
        return
      }
      setCheckingAuth(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user) router.replace('/dashboard')
    })
    return () => subscription.unsubscribe()
  }, [router])

  if (checkingAuth) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" />
      </div>
    )
  }

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', textAlign: 'center',
        padding: '0 2rem',
        background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(201,168,76,0.07) 0%, transparent 70%)',
      }}>
        <p className="eyebrow" style={{ marginBottom: '1.5rem' }}>Digital Learning Platform</p>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 700, lineHeight: 1.05, maxWidth: '16ch' }}>
          Learn, Build &amp; <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Grow</em>
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', maxWidth: '52ch', margin: '2rem auto', lineHeight: 1.7 }}>
          Apotheos is a live online platform for AI literacy, creative entrepreneurship, and holistic wellness — join any class from anywhere in the world. Taught by expert humans <em>and</em> next-generation AI agents.
        </p>

        {/* Primary CTAs */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1rem' }}>
          <Link href="/auth/signup" className="btn btn-gold btn-lg">Create Account →</Link>
          <Link href="/auth/signin" className="btn btn-outline btn-lg">Sign In</Link>
        </div>

        {/* Secondary CTAs */}
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1.25rem', alignItems: 'center' }}>
          <Link href="/courses" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.08em', textDecoration: 'none' }}>
            Browse Courses →
          </Link>
          <span style={{ width: '1px', height: '0.8rem', background: 'var(--border2)', display: 'inline-block' }} />
          <Link href="#mission" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.08em', textDecoration: 'none' }}>
            Our Mission
          </Link>
          <span style={{ width: '1px', height: '0.8rem', background: 'var(--border2)', display: 'inline-block' }} />
          <Link href="/locations" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.08em', textDecoration: 'none' }}>
            Locations
          </Link>
        </div>

        {/* Trust line */}
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.06em', marginTop: '2rem', opacity: 0.7 }}>
          Free to join · No credit card required · Cancel anytime
        </p>
      </section>

      {/* ── MISSION ──────────────────────────────────────── */}
      <section id="mission" className="section section-dark">
        <div className="container">
          <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
            <p className="eyebrow">Our Mission</p>
            <h2 className="section-title" style={{ textAlign: 'center' }}>
              A New Kind of Institution
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '1.1rem', lineHeight: 1.8 }}>
              We believe the most important skills of the coming decade — AI literacy, entrepreneurial resilience, and embodied wellness — are best learned together, in community, not in silos.
            </p>
            <p style={{ color: 'var(--muted)', fontSize: '1.1rem', lineHeight: 1.8, marginTop: '1.5rem' }}>
              Apotheos is a live digital platform first — accessible from anywhere. For those who want to go deeper in person, our{' '}
              <Link href="/locations/nevada-city" style={{ color: 'var(--gold)', textDecoration: 'underline' }}>Nevada City campus</Link>
              {' '}brings the full experience under one roof.
            </p>
          </div>
        </div>
      </section>

      {/* ── TRACKS ───────────────────────────────────────── */}
      <section id="model" className="section">
        <div className="container">
          <p className="eyebrow">The Model</p>
          <h2 className="section-title">Three Pillars, One Community</h2>
          <p className="section-subtitle" style={{ marginBottom: '3rem', maxWidth: '50ch' }}>
            Every program at Apotheos falls within one of three interconnected tracks.
          </p>
          <div className="grid-3">
            {(['wellness', 'ai', 'founder'] as const).map(track => {
              const m = TRACK_META[track]
              return (
                <div key={track} className="card" style={{ gap: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: '2rem', color: m.color }}>{m.icon}</div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem' }}>{m.label}</h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.7 }}>{m.description}</p>
                  <Link href={`/courses?track=${track}`} className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-start' }}>
                    View Courses →
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── AI AGENTIC TEACHERS ──────────────────────────── */}
      <section className="section section-dark">
        <div className="container">
          <div className="ai-agent-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>

            {/* Agent mockup */}
            <div style={{
              background: 'var(--surface2)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '1.75rem',
              fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Glow */}
              <div style={{ position: 'absolute', top: '-40%', left: '50%', transform: 'translateX(-50%)', width: '60%', height: '200px', background: 'radial-gradient(ellipse, rgba(123,179,190,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--teal-lt)', display: 'inline-block', animation: 'pulse 2s ease-in-out infinite' }} />
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
                    <span style={{ color: 'var(--text)' }}>temp=1.0:</span> &quot;France&apos;s soul lives in Paris — city of light and croissants…&quot;
                  </div>
                </div>
                <AgentMessage role="student" text="Oh wow, that makes total sense now." />
                <AgentMessage role="agent" text="Try adjusting it yourself — I've opened the sandbox on your right. Ask me anything as you go." />
              </div>
            </div>

            {/* Copy */}
            <div>
              <p className="eyebrow">The Future of Instruction</p>
              <h2 className="section-title">Some Classes Are Taught by AI Agents</h2>
              <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.8, marginBottom: '1.25rem' }}>
                Select Apotheos courses are led by purpose-built AI instructors — adaptive agents that respond to your questions in real time, run live code demos, adjust their teaching style to how you learn, and never run out of time for you.
              </p>
              <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.8, marginBottom: '2rem' }}>
                These aren&apos;t chatbots reading slides. They&apos;re pedagogically-designed agents built on the same frontier models powering the AI revolution — trained to teach, not just to answer.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                {[
                  'Always available — run a session at 2am if that\'s when you think',
                  'Adapts in real time to your pace and knowledge level',
                  'Runs live experiments, code, and simulations mid-class',
                  'Seamlessly hands off to a human instructor when needed',
                ].map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: 'var(--muted)', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--teal-lt)', flexShrink: 0, marginTop: '0.15rem' }}>◈</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/courses" className="btn btn-outline">See Agent-Led Courses →</Link>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50%       { opacity: 0.4; }
          }
          @media (max-width: 768px) {
            .ai-agent-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* ── ONLINE LEARNING PROMO ─────────────────────────── */}
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
                    {item.text}{item.highlight && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--teal-lt)', letterSpacing: '0.08em', marginLeft: '0.4rem', alignSelf: 'center', border: '1px solid rgba(123,179,190,0.3)', borderRadius: '2rem', padding: '0.1rem 0.4rem' }}>NEW</span>}
                  </li>
                ))}
              </ul>
              <Link href="/courses" className="btn btn-gold">Browse All Courses →</Link>
            </div>
            {/* Classroom preview mockup */}
            <div style={{
              background: 'var(--surface2)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '1.5rem',
              fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border2)' }}>
                <span style={{ color: 'var(--gold)' }}>● LIVE</span>
                <span style={{ color: 'var(--muted)' }}>14 attending (8 remote, 6 in-room)</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', height: '180px' }}>
                <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', border: '1px solid var(--border2)' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📹</div>
                    <div>Instructor Live Stream</div>
                  </div>
                </div>
                <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid var(--border2)', overflowY: 'auto' }}>
                  <div style={{ color: 'var(--gold)' }}>Live Chat</div>
                  <ChatLine name="Alex" msg="This is incredible" />
                  <ChatLine name="Sarah" msg="Can you repeat that last part?" />
                  <ChatLine name="Instructor" msg="Of course! So..." highlight />
                  <ChatLine name="Jordan" msg="Got it, thanks!" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MEMBERSHIP ───────────────────────────────────── */}
      <MembershipSection />

      {/* ── WAITLIST ─────────────────────────────────────── */}
      <section id="waitlist" className="section section-dark">
        <div className="container">
          <div style={{ maxWidth: '560px', margin: '0 auto', textAlign: 'center' }}>
            <p className="eyebrow">Early Access</p>
            <h2 className="section-title">Join the Waitlist</h2>
            <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>
              Be first to know when Apotheos opens enrollment. We&apos;ll notify you based on your membership interest.
            </p>
            <WaitlistForm />
          </div>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────── */}
      <section id="contact" className="section">
        <div className="container">
          <div style={{ maxWidth: '560px', margin: '0 auto', textAlign: 'center' }}>
            <p className="eyebrow">Get In Touch</p>
            <h2 className="section-title">Contact Us</h2>
            <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>
              Questions about membership, partnerships, or the campus? We&apos;d love to hear from you.
            </p>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  )
}

/* ─── MEMBERSHIP SECTION ─────────────────────────────── */
function MembershipSection() {
  const [activeIdx, setActiveIdx] = useState(1) // default to Seeker (index 1)
  const tier = MEMBERSHIP_TIERS[activeIdx]

  return (
    <section id="membership" className="section section-dark">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <p className="eyebrow">Membership</p>
          <h2 className="section-title" style={{ textAlign: 'center' }}>Choose Your Path</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.95rem', maxWidth: '44ch', margin: '0 auto' }}>
            Every tier includes full online course access. Choose how deep you want to go.
          </p>
        </div>

        {/* ── Desktop: 4-column grid ── */}
        <div className="mem-desktop">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            {MEMBERSHIP_TIERS.map((t, i) => (
              <TierCard key={t.name} tier={t} active={activeIdx === i} onSelect={() => setActiveIdx(i)} />
            ))}
          </div>
        </div>

        {/* ── Mobile: tab strip + single expanded card ── */}
        <div className="mem-mobile">
          {/* Tab strip */}
          <div style={{ display: 'flex', gap: '0', border: '1px solid var(--border2)', borderRadius: 'var(--radius)', overflow: 'hidden', marginBottom: '1.25rem' }}>
            {MEMBERSHIP_TIERS.map((t, i) => (
              <button
                key={t.name}
                onClick={() => setActiveIdx(i)}
                style={{
                  flex: 1,
                  padding: '0.7rem 0.25rem',
                  background: activeIdx === i ? 'rgba(201,168,76,0.12)' : 'transparent',
                  border: 'none',
                  borderRight: i < MEMBERSHIP_TIERS.length - 1 ? '1px solid var(--border2)' : 'none',
                  color: activeIdx === i ? 'var(--gold)' : 'var(--muted)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6rem',
                  letterSpacing: '0.06em',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.2rem',
                }}
              >
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.85rem', color: activeIdx === i ? 'var(--gold)' : 'var(--text)' }}>{t.name}</span>
                <span style={{ color: activeIdx === i ? 'var(--gold)' : 'var(--muted)' }}>{t.price}/mo</span>
              </button>
            ))}
          </div>

          {/* Expanded tier detail */}
          <div style={{
            background: tier.featured ? 'rgba(201,168,76,0.04)' : 'var(--surface2)',
            border: `1px solid ${tier.featured ? 'rgba(201,168,76,0.3)' : 'var(--border2)'}`,
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
          }}>
            {tier.featured && (
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--gold)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                ★ Most Popular
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', lineHeight: 1.1 }}>{tier.name}</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.82rem', marginTop: '0.25rem' }}>{tier.subtitle}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.25rem', color: 'var(--gold)', lineHeight: 1 }}>{tier.price}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)' }}>per month</div>
              </div>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.5rem' }}>
              {tier.perks.map(perk => (
                <li key={perk} style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start', fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                  <span style={{ color: 'var(--gold)', flexShrink: 0, marginTop: '0.15rem' }}>◎</span>{perk}
                </li>
              ))}
            </ul>
            <Link href="#waitlist" className={`btn ${tier.featured ? 'btn-gold' : 'btn-outline'}`} style={{ width: '100%', justifyContent: 'center' }}>
              Join Waitlist →
            </Link>
          </div>

          {/* Tier navigation dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
            {MEMBERSHIP_TIERS.map((_, i) => (
              <button key={i} onClick={() => setActiveIdx(i)} style={{
                width: i === activeIdx ? '1.5rem' : '0.45rem',
                height: '0.45rem',
                borderRadius: '1rem',
                background: i === activeIdx ? 'var(--gold)' : 'var(--border)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                padding: 0,
              }} />
            ))}
          </div>
        </div>

        {/* ── À La Carte ── */}
        <div style={{ marginTop: '3rem', paddingTop: '2.5rem', borderTop: '1px solid var(--border2)' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <p className="eyebrow" style={{ marginBottom: '0.4rem' }}>Or Attend À La Carte</p>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
              No membership required — buy single classes, workshops, or bundles
            </p>
          </div>
          <div className="alacarte-grid">
            {ALA_CARTE.map(item => (
              <div key={item.type} style={{
                background: 'var(--surface)', border: '1px solid var(--border2)',
                borderRadius: 'var(--radius)', padding: '1.1rem 1.25rem',
                display: 'flex', flexDirection: 'column', gap: '0.3rem',
              }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                  {item.type}
                </span>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--text)' }}>{item.price}</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.5 }}>{item.desc}</span>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', letterSpacing: '0.04em', marginTop: '1.25rem' }}>
            Free first workshop for all new learners · Sliding-scale & scholarship pricing available ·{' '}
            <Link href="/curriculum" style={{ color: 'var(--gold)' }}>View full pricing →</Link>
          </p>
        </div>
      </div>

      <style>{`
        .mem-desktop { display: block; }
        .mem-mobile  { display: none; }
        .alacarte-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.85rem;
        }
        @media (max-width: 900px) {
          .mem-desktop { display: none; }
          .mem-mobile  { display: block; }
          .alacarte-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .alacarte-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  )
}

function TierCard({ tier, active, onSelect }: { tier: typeof MEMBERSHIP_TIERS[0]; active: boolean; onSelect: () => void }) {
  return (
    <div
      onClick={onSelect}
      className="card"
      style={{
        display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'pointer',
        border: tier.featured ? '1px solid rgba(201,168,76,0.4)' : undefined,
        background: tier.featured ? 'rgba(201,168,76,0.04)' : undefined,
        transition: 'transform 0.15s, border-color 0.15s',
        transform: active ? 'translateY(-2px)' : 'none',
      }}
    >
      {tier.featured && (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', color: 'var(--gold)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>★ Most Popular</div>
      )}
      <div>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '0.25rem' }}>{tier.name}</h3>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)' }}>{tier.subtitle}</p>
      </div>
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.9rem', color: 'var(--gold)', lineHeight: 1 }}>
        {tier.price}<span style={{ fontSize: '0.8rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>/mo</span>
      </div>
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem', flexGrow: 1 }}>
        {tier.perks.map(perk => (
          <li key={perk} style={{ fontSize: '0.82rem', color: 'var(--muted)', display: 'flex', gap: '0.5rem', lineHeight: 1.4 }}>
            <span style={{ color: 'var(--gold)', flexShrink: 0 }}>◎</span>{perk}
          </li>
        ))}
      </ul>
      <Link href="#waitlist" className={`btn btn-sm ${tier.featured ? 'btn-gold' : 'btn-outline'}`} style={{ justifyContent: 'center' }} onClick={e => e.stopPropagation()}>
        Join Waitlist
      </Link>
    </div>
  )
}

function ChatLine({ name, msg, highlight = false }: { name: string; msg: string; highlight?: boolean }) {
  return (
    <div style={{ fontSize: '0.58rem', lineHeight: 1.4 }}>
      <span style={{ color: highlight ? 'var(--gold)' : 'var(--teal-lt)' }}>{name}: </span>
      <span style={{ color: 'var(--muted)' }}>{msg}</span>
    </div>
  )
}

function AgentMessage({ role, text }: { role: 'student' | 'agent'; text: string }) {
  const isAgent = role === 'agent'
  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', flexDirection: isAgent ? 'row' : 'row-reverse' }}>
      <div style={{
        width: '1.4rem', height: '1.4rem', borderRadius: '50%', flexShrink: 0,
        background: isAgent ? 'rgba(123,179,190,0.15)' : 'rgba(201,168,76,0.12)',
        border: `1px solid ${isAgent ? 'rgba(123,179,190,0.4)' : 'rgba(201,168,76,0.3)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.55rem', color: isAgent ? 'var(--teal-lt)' : 'var(--gold)',
      }}>
        {isAgent ? '◈' : '◎'}
      </div>
      <div style={{
        background: isAgent ? 'rgba(123,179,190,0.06)' : 'rgba(201,168,76,0.04)',
        border: `1px solid ${isAgent ? 'rgba(123,179,190,0.15)' : 'rgba(201,168,76,0.1)'}`,
        borderRadius: 'var(--radius)', padding: '0.45rem 0.6rem',
        color: 'var(--muted)', fontSize: '0.62rem', lineHeight: 1.55,
        maxWidth: '85%',
      }}>
        {text}
      </div>
    </div>
  )
}

const MEMBERSHIP_TIERS = [
  {
    name: 'Community', price: '$49', featured: false,
    subtitle: 'Online-only access',
    perks: ['Full online course library', 'Community chat & Discord', 'Monthly virtual events', 'Digital certificates & badges'],
  },
  {
    name: 'Seeker', price: '$149', featured: false,
    subtitle: 'Weekend campus + 4 live classes',
    perks: ['Campus access (weekends)', '4 live classes/month', 'Online + in-person hybrid', 'Wellness programming'],
  },
  {
    name: 'Founder', price: '$399', featured: true,
    subtitle: 'Unlimited live classes & campus',
    perks: ['Full campus access — any day', 'Unlimited live classes & workshops', 'Cowork access (campus + online)', 'AI lab & founder office hours', 'Priority scheduling'],
  },
  {
    name: 'Visionary', price: '$899', featured: false,
    subtitle: 'Founder + mentorship & network',
    perks: ['Everything in Founder', '1:1 mentorship (monthly)', 'Investor intro network', 'Recording studio access', 'Private cohort events'],
  },
]

const ALA_CARTE = [
  { type: 'Drop-In Workshop', price: '$20–$50', desc: 'Single session · online or in-person · any track' },
  { type: '4–8 Week Course', price: '$99–$299', desc: 'Full structured enrollment · online · live or self-paced' },
  { type: 'Bootcamp Intensive', price: '$249–$649', desc: 'Immersive 1-week sprint · online or in-person' },
  { type: 'Starter Bundle', price: '$49 / $89', desc: '3 workshops of your choice · online / in-person' },
  { type: 'Family Plan', price: '$79–$199/mo', desc: 'Up to 4 family members · all ages · kids track included' },
  { type: 'Kids & Teens Pass', price: '$39–$99/mo', desc: 'Ages 8–17 · full youth track · coding, AI & maker classes' },
]

function WaitlistForm() {
  return (
    <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}
      onSubmit={(e) => { e.preventDefault(); alert('Thank you! We\'ll be in touch.') }}>
      <div className="form-field">
        <label className="form-label">Full Name</label>
        <input className="form-input" type="text" placeholder="Your name" required />
      </div>
      <div className="form-field">
        <label className="form-label">Email</label>
        <input className="form-input" type="email" placeholder="you@example.com" required />
      </div>
      <div className="form-field">
        <label className="form-label">Membership Interest</label>
        <select className="form-select">
          <option value="">Select a tier</option>
          <option value="community">Community — $49/mo</option>
          <option value="seeker">Seeker — $149/mo</option>
          <option value="founder">Founder — $399/mo</option>
          <option value="visionary">Visionary — $899/mo</option>
          <option value="alacarte">À La Carte — workshops &amp; courses</option>
        </select>
      </div>
      <button type="submit" className="btn btn-gold" style={{ justifyContent: 'center' }}>
        Join Waitlist →
      </button>
    </form>
  )
}

function ContactForm() {
  return (
    <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}
      onSubmit={(e) => { e.preventDefault(); alert('Message sent! We\'ll get back to you shortly.') }}>
      <div className="form-field">
        <label className="form-label">Name</label>
        <input className="form-input" type="text" placeholder="Your name" required />
      </div>
      <div className="form-field">
        <label className="form-label">Email</label>
        <input className="form-input" type="email" placeholder="you@example.com" required />
      </div>
      <div className="form-field">
        <label className="form-label">Message</label>
        <textarea className="form-textarea" rows={4} placeholder="How can we help?" required style={{ resize: 'vertical' }} />
      </div>
      <button type="submit" className="btn btn-outline" style={{ justifyContent: 'center' }}>
        Send Message →
      </button>
    </form>
  )
}
