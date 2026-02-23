'use client'
import Link from 'next/link'
import { TRACK_META } from '@/lib/courses'

export default function HomePage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', textAlign: 'center',
        padding: '0 2rem',
        background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(201,168,76,0.07) 0%, transparent 70%)',
      }}>
        <p className="eyebrow" style={{ marginBottom: '1.5rem' }}>Live Online Learning</p>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 700, lineHeight: 1.05, maxWidth: '16ch' }}>
          Learn, Build &amp; <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Grow</em>
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', maxWidth: '52ch', margin: '2rem auto', lineHeight: 1.7 }}>
          Apotheos delivers live AI & creative production, founder mentorship, and holistic wellness classes online — from anywhere in the world. In-person at our Nevada City campus for local members.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1rem' }}>
          <Link href="/courses" className="btn btn-gold btn-lg">Explore Courses</Link>
          <Link href="#mission" className="btn btn-outline btn-lg">Our Mission</Link>
          <Link href="#waitlist" className="btn btn-ghost btn-lg">Join Waitlist</Link>
        </div>
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
              Apotheos provides a physical campus and a digital platform where these disciplines reinforce each other every single day.
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

      {/* ── ONLINE LEARNING PROMO ─────────────────────────── */}
      <section className="section section-dark">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <p className="eyebrow">Now Online</p>
              <h2 className="section-title">Join Any Class, Anywhere</h2>
              <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                Every Apotheos class is live-streamed simultaneously. Join in-person or connect remotely with a shared chat room — the community is always with you.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                {[
                  'Live video with the instructor and in-room participants',
                  'Real-time shared chat between in-room and remote students',
                  'Session recordings available after class ends',
                  'Downloadable materials, slides, and resources',
                ].map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: 'var(--muted)', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--gold)', flexShrink: 0, marginTop: '0.15rem' }}>◎</span>
                    {item}
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
      <section id="membership" className="section">
        <div className="container">
          <p className="eyebrow">Membership</p>
          <h2 className="section-title">Choose Your Path</h2>
          <div className="grid-4" style={{ marginTop: '2.5rem' }}>
            {MEMBERSHIP_TIERS.map(tier => (
              <div key={tier.name} className="card" style={{
                display: 'flex', flexDirection: 'column', gap: '1.25rem',
                ...(tier.featured ? { border: '1px solid var(--gold-dim)', background: 'rgba(201,168,76,0.04)' } : {})
              }}>
                {tier.featured && <div className="eyebrow" style={{ fontSize: '0.55rem' }}>Most Popular</div>}
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem' }}>{tier.name}</h3>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--gold)' }}>
                  {tier.price}<span style={{ fontSize: '0.9rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>/mo</span>
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
                  {tier.perks.map(perk => (
                    <li key={perk} style={{ fontSize: '0.85rem', color: 'var(--muted)', display: 'flex', gap: '0.5rem' }}>
                      <span style={{ color: 'var(--gold)' }}>◎</span>{perk}
                    </li>
                  ))}
                </ul>
                <Link href="#waitlist" className={`btn btn-sm ${tier.featured ? 'btn-gold' : 'btn-outline'}`}
                  style={{ justifyContent: 'center' }}>
                  Join Waitlist
                </Link>
              </div>
            ))}
          </div>

          {/* À La Carte */}
          <div style={{ marginTop: '3rem', paddingTop: '2.5rem', borderTop: '1px solid var(--border2)' }}>
            <p className="eyebrow" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Or Attend À La Carte</p>
            <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '2rem' }}>
              No membership required — buy single classes, workshops, or bundles
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              {ALA_CARTE.map(item => (
                <div key={item.type} style={{
                  background: 'var(--surface)', border: '1px solid var(--border2)',
                  borderRadius: '1rem', padding: '1.25rem 1.5rem',
                  display: 'flex', flexDirection: 'column', gap: '0.35rem',
                }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                    {item.type}
                  </span>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--text)' }}>{item.price}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.5 }}>{item.desc}</span>
                </div>
              ))}
            </div>
            <p style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.05em' }}>
              Free first workshop for all new learners · Sliding-scale & scholarship pricing available ·{' '}
              <Link href="/curriculum" style={{ color: 'var(--gold)', textDecoration: 'none' }}>View full pricing →</Link>
            </p>
          </div>
        </div>
      </section>

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

function ChatLine({ name, msg, highlight = false }: { name: string; msg: string; highlight?: boolean }) {
  return (
    <div style={{ fontSize: '0.58rem', lineHeight: 1.4 }}>
      <span style={{ color: highlight ? 'var(--gold)' : 'var(--teal-lt)' }}>{name}: </span>
      <span style={{ color: 'var(--muted)' }}>{msg}</span>
    </div>
  )
}

const MEMBERSHIP_TIERS = [
  {
    name: 'Community', price: '$49', featured: false,
    perks: ['Online course library', 'Community chat & Discord', 'Monthly virtual events', 'Digital certificates & badges'],
  },
  {
    name: 'Seeker', price: '$149', featured: false,
    perks: ['Campus access (weekends)', '4 live classes/month', 'Online + in-person hybrid', 'Wellness programming'],
  },
  {
    name: 'Founder', price: '$399', featured: true,
    perks: ['Full campus access — any day', 'Unlimited live classes & workshops', 'Full cowork access (campus + online)', 'AI lab & founder office hours', 'Priority scheduling'],
  },
  {
    name: 'Visionary', price: '$899', featured: false,
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
