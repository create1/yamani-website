'use client'

import { useState } from 'react'
import Link from 'next/link'

const MEMBERSHIP_TIERS = [
  { name: 'Community', price: '$49', featured: false, subtitle: 'Online-only access', perks: ['Full online course library', 'Community chat & Discord', 'Monthly virtual events', 'Digital certificates & badges'] },
  { name: 'Seeker', price: '$149', featured: false, subtitle: 'Weekend campus + 4 live classes', perks: ['Campus access (weekends)', '4 live classes/month', 'Online + in-person hybrid', 'Wellness programming'] },
  { name: 'Founder', price: '$399', featured: true, subtitle: 'Unlimited live classes & campus', perks: ['Full campus access — any day', 'Unlimited live classes & workshops', 'Cowork access (campus + online)', 'AI lab & founder office hours', 'Priority scheduling'] },
  { name: 'Visionary', price: '$899', featured: false, subtitle: 'Founder + mentorship & network', perks: ['Everything in Founder', '1:1 mentorship (monthly)', 'Investor intro network', 'Recording studio access', 'Private cohort events'] },
]

const ALA_CARTE = [
  { type: 'Drop-In Workshop', price: '$20–$50', desc: 'Single session · online or in-person · any track' },
  { type: '4–8 Week Course', price: '$99–$299', desc: 'Full structured enrollment · online · live or self-paced' },
  { type: 'Bootcamp Intensive', price: '$249–$649', desc: 'Immersive 1-week sprint · online or in-person' },
  { type: 'Starter Bundle', price: '$49 / $89', desc: '3 workshops of your choice · online / in-person' },
  { type: 'Family Plan', price: '$79–$199/mo', desc: 'Up to 4 family members · all ages · kids track included' },
  { type: 'Kids & Teens Pass', price: '$39–$99/mo', desc: 'Ages 8–17 · full youth track · coding, AI & maker classes' },
]

export default function MembershipPage() {
  const [activeIdx, setActiveIdx] = useState(1)
  const tier = MEMBERSHIP_TIERS[activeIdx]

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Tiers */}
      <section className="section section-dark">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p className="eyebrow">Membership</p>
            <h1 className="section-title" style={{ textAlign: 'center' }}>Choose Your Path</h1>
            <p style={{ color: 'var(--muted)', fontSize: '0.95rem', maxWidth: '44ch', margin: '0 auto' }}>
              Every tier includes full online course access. Choose how deep you want to go.
            </p>
          </div>

          <div className="mem-desktop">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
              {MEMBERSHIP_TIERS.map((t, i) => (
                <TierCard key={t.name} tier={t} active={activeIdx === i} onSelect={() => setActiveIdx(i)} />
              ))}
            </div>
          </div>

          <div className="mem-mobile">
            <div style={{ display: 'flex', gap: 0, border: '1px solid var(--border2)', borderRadius: 'var(--radius)', overflow: 'hidden', marginBottom: '1.25rem' }}>
              {MEMBERSHIP_TIERS.map((t, i) => (
                <button
                  key={t.name}
                  onClick={() => setActiveIdx(i)}
                  style={{
                    flex: 1, padding: '0.7rem 0.25rem', background: activeIdx === i ? 'rgba(201,168,76,0.12)' : 'transparent',
                    border: 'none', borderRight: i < MEMBERSHIP_TIERS.length - 1 ? '1px solid var(--border2)' : 'none',
                    color: activeIdx === i ? 'var(--gold)' : 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                    letterSpacing: '0.06em', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.85rem', color: activeIdx === i ? 'var(--gold)' : 'var(--text)' }}>{t.name}</span>
                  <span style={{ color: activeIdx === i ? 'var(--gold)' : 'var(--muted)' }}>{t.price}/mo</span>
                </button>
              ))}
            </div>
            <div style={{
              background: tier.featured ? 'rgba(201,168,76,0.04)' : 'var(--surface2)',
              border: `1px solid ${tier.featured ? 'rgba(201,168,76,0.3)' : 'var(--border2)'}`,
              borderRadius: 'var(--radius-lg)', padding: '1.5rem',
            }}>
              {tier.featured && <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--gold)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>★ Most Popular</div>}
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
              <a href="#waitlist" className={`btn ${tier.featured ? 'btn-gold' : 'btn-outline'}`} style={{ width: '100%', justifyContent: 'center' }}>Join Waitlist →</a>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
              {MEMBERSHIP_TIERS.map((_, i) => (
                <button key={i} onClick={() => setActiveIdx(i)} style={{ width: i === activeIdx ? '1.5rem' : '0.45rem', height: '0.45rem', borderRadius: '1rem', background: i === activeIdx ? 'var(--gold)' : 'var(--border)', border: 'none', cursor: 'pointer', padding: 0 }} />
              ))}
            </div>
          </div>

          <div style={{ marginTop: '3rem', paddingTop: '2.5rem', borderTop: '1px solid var(--border2)' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
              <p className="eyebrow" style={{ marginBottom: '0.4rem' }}>Or Attend À La Carte</p>
              <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>No membership required — buy single classes, workshops, or bundles</p>
            </div>
            <div className="alacarte-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.85rem' }}>
              {ALA_CARTE.map(item => (
                <div key={item.type} style={{ background: 'var(--surface)', border: '1px solid var(--border2)', borderRadius: 'var(--radius)', padding: '1.1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)' }}>{item.type}</span>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--text)' }}>{item.price}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.5 }}>{item.desc}</span>
                </div>
              ))}
            </div>
            <p style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', letterSpacing: '0.04em', marginTop: '1.25rem' }}>
              Free first workshop for all new learners · <Link href="/curriculum" style={{ color: 'var(--gold)' }}>View full pricing →</Link>
            </p>
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section id="waitlist" className="section section-dark">
        <div className="container">
          <div style={{ maxWidth: '560px', margin: '0 auto', textAlign: 'center' }}>
            <p className="eyebrow">Early Access</p>
            <h2 className="section-title">Join the Waitlist</h2>
            <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>Be first to know when Apotheos opens enrollment.</p>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }} onSubmit={(e) => { e.preventDefault(); alert('Thank you! We\'ll be in touch.') }}>
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
                  <option value="alacarte">À La Carte</option>
                </select>
              </div>
              <button type="submit" className="btn btn-gold" style={{ justifyContent: 'center' }}>Join Waitlist →</button>
            </form>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="section">
        <div className="container">
          <div style={{ maxWidth: '560px', margin: '0 auto', textAlign: 'center' }}>
            <p className="eyebrow">Get In Touch</p>
            <h2 className="section-title">Contact Us</h2>
            <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>Questions about membership, partnerships, or the campus?</p>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }} onSubmit={(e) => { e.preventDefault(); alert('Message sent! We\'ll get back to you shortly.') }}>
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
              <button type="submit" className="btn btn-outline" style={{ justifyContent: 'center' }}>Send Message →</button>
            </form>
          </div>
        </div>
      </section>

      <style>{`
        .mem-desktop { display: block; }
        .mem-mobile { display: none; }
        .alacarte-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.85rem; }
        @media (max-width: 900px) {
          .mem-desktop { display: none; }
          .mem-mobile { display: block; }
          .alacarte-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) { .alacarte-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  )
}

function TierCard({ tier, active, onSelect }: { tier: typeof MEMBERSHIP_TIERS[0]; active: boolean; onSelect: () => void }) {
  return (
    <div onClick={onSelect} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'pointer', border: tier.featured ? '1px solid rgba(201,168,76,0.4)' : undefined, background: tier.featured ? 'rgba(201,168,76,0.04)' : undefined, transition: 'transform 0.15s', transform: active ? 'translateY(-2px)' : 'none' }}>
      {tier.featured && <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', color: 'var(--gold)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>★ Most Popular</div>}
      <div>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '0.25rem' }}>{tier.name}</h3>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)' }}>{tier.subtitle}</p>
      </div>
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.9rem', color: 'var(--gold)', lineHeight: 1 }}>{tier.price}<span style={{ fontSize: '0.8rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>/mo</span></div>
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem', flexGrow: 1 }}>
        {tier.perks.map(perk => (
          <li key={perk} style={{ fontSize: '0.82rem', color: 'var(--muted)', display: 'flex', gap: '0.5rem', lineHeight: 1.4 }}>
            <span style={{ color: 'var(--gold)', flexShrink: 0 }}>◎</span>{perk}
          </li>
        ))}
      </ul>
      <a href="#waitlist" className={`btn btn-sm ${tier.featured ? 'btn-gold' : 'btn-outline'}`} style={{ justifyContent: 'center' }} onClick={e => e.stopPropagation()}>Join Waitlist</a>
    </div>
  )
}
