'use client'
import Link from 'next/link'

const LOCATIONS = [
  {
    slug: 'nevada-city',
    city: 'Nevada City',
    state: 'CA',
    address: 'Nevada City, California',
    status: 'open' as const,
    tagline: 'The original campus',
    description: 'Our founding campus nestled in the Sierra Nevada foothills — 11 dedicated spaces spanning movement, technology, arts, and community.',
    spaces: 11,
    tracks: ['Wellness', 'AI', 'Founder', 'Community & Arts'],
    highlight: 'Open now',
  },
]

const COMING_SOON = [
  { city: 'Asheville', state: 'NC', tagline: 'Mountain arts & wellness campus' },
  { city: 'Taos',      state: 'NM', tagline: 'High desert creative retreat' },
  { city: 'Portland',  state: 'OR', tagline: 'Pacific Northwest tech & culture hub' },
]

export default function LocationsPage() {
  return (
    <div style={{ paddingBottom: '5rem' }}>

      {/* Hero */}
      <section style={{
        padding: 'clamp(3rem,6vw,5rem) 0 clamp(2rem,4vw,3.5rem)',
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,168,76,0.07) 0%, transparent 70%)',
        borderBottom: '1px solid var(--border2)',
        textAlign: 'center',
      }}>
        <div className="container">
          <p className="eyebrow">Apotheos Locations</p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem,6vw,4.5rem)', lineHeight: 1.05, marginBottom: '1.25rem' }}>
            Learn Anywhere.<br />
            <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Go Deeper In Person.</em>
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 'clamp(0.95rem,2vw,1.1rem)', maxWidth: '52ch', margin: '0 auto 2rem', lineHeight: 1.75 }}>
            Every Apotheos class is available live online. Our physical campuses offer the full immersive experience — movement studios, tech labs, art spaces, and community — all under one roof.
          </p>
          {/* Online vs In-Person quick-compare */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            <Link href="/courses" className="btn btn-outline">Digital Platform →</Link>
            <Link href="/locations/nevada-city" className="btn btn-gold">Visit Nevada City →</Link>
          </div>
        </div>
      </section>

      {/* Digital vs In-Person split */}
      <section style={{ padding: 'clamp(2.5rem,5vw,4rem) 0', borderBottom: '1px solid var(--border2)' }}>
        <div className="container">
          <div className="loc-split-grid">

            {/* Digital */}
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--border2)',
              borderRadius: 'var(--radius-lg)', padding: '2rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: 'rgba(123,179,190,0.15)', border: '1px solid rgba(123,179,190,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>◈</div>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--teal-lt)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.15rem' }}>Digital Platform</div>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', lineHeight: 1.1 }}>Online from Anywhere</h2>
                </div>
              </div>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.75, marginBottom: '1.5rem' }}>
                All Apotheos classes are live-streamed simultaneously. Join from your home, your office, or the other side of the world — with full chat, recordings, and community access.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.75rem' }}>
                {[
                  'All 47+ live classes — same time, same instructor',
                  'AI agentic teacher sessions — available 24/7',
                  'Shared live chat with in-room students',
                  'Session recordings & downloadable materials',
                  'Community Discord & virtual events',
                ].map(item => (
                  <li key={item} style={{ display: 'flex', gap: '0.65rem', fontSize: '0.88rem', color: 'var(--muted)' }}>
                    <span style={{ color: 'var(--teal-lt)', flexShrink: 0 }}>◈</span>{item}
                  </li>
                ))}
              </ul>
              <Link href="/courses" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
                Browse Online Courses →
              </Link>
            </div>

            {/* In-Person */}
            <div style={{
              background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.25)',
              borderRadius: 'var(--radius-lg)', padding: '2rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>◎</div>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--gold)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.15rem' }}>Campus Experience</div>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', lineHeight: 1.1 }}>In-Person at Campus</h2>
                </div>
              </div>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.75, marginBottom: '1.5rem' }}>
                The campus is a living environment — movement studios, a tech lab, art spaces, outdoor terraces, and a community dining room. Some experiences simply cannot be replicated on a screen.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.75rem' }}>
                {[
                  'Full in-room classes across all 11 campus spaces',
                  'Physical movement, yoga, art, and maker sessions',
                  'Co-working and daily campus access (Seeker+)',
                  'Community meals, social hours, and live events',
                  'Networking with founders, artists, and instructors',
                ].map(item => (
                  <li key={item} style={{ display: 'flex', gap: '0.65rem', fontSize: '0.88rem', color: 'var(--muted)' }}>
                    <span style={{ color: 'var(--gold)', flexShrink: 0 }}>◎</span>{item}
                  </li>
                ))}
              </ul>
              <Link href="/locations/nevada-city" className="btn btn-gold" style={{ width: '100%', justifyContent: 'center' }}>
                Explore Nevada City Campus →
              </Link>
            </div>
          </div>
        </div>

        <style>{`
          .loc-split-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
          }
          @media (max-width: 768px) {
            .loc-split-grid { grid-template-columns: 1fr; }
          }
        `}</style>
      </section>

      {/* Open Locations */}
      <section style={{ padding: 'clamp(2.5rem,5vw,4rem) 0', borderBottom: '1px solid var(--border2)' }}>
        <div className="container">
          <p className="eyebrow" style={{ marginBottom: '0.5rem' }}>Open Now</p>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.75rem,4vw,2.5rem)', marginBottom: '2rem' }}>Campus Locations</h2>

          {LOCATIONS.map(loc => (
            <Link key={loc.slug} href={`/locations/${loc.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
              <div style={{
                background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.25)',
                borderRadius: 'var(--radius-lg)', padding: 'clamp(1.5rem,3vw,2.25rem)',
                display: 'flex', alignItems: 'center', gap: '2rem',
                flexWrap: 'wrap',
                transition: 'border-color 0.2s, background 0.2s',
                cursor: 'pointer',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.25)' }}
              >
                {/* Location marker */}
                <div style={{
                  width: '4rem', height: '4rem', borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(201,168,76,0.15)', border: '2px solid rgba(201,168,76,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--gold)',
                }}>
                  ◎
                </div>

                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.3rem,3vw,1.75rem)' }}>
                      {loc.city}, {loc.state}
                    </h3>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--gold)', letterSpacing: '0.1em', background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '2rem', padding: '0.15rem 0.5rem' }}>
                      {loc.highlight}
                    </span>
                  </div>
                  <p style={{ color: 'var(--muted)', fontSize: '0.58rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>{loc.address}</p>
                  <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '55ch' }}>{loc.description}</p>
                  <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                    {[`${loc.spaces} spaces`, `${loc.tracks.length} tracks`, loc.tagline].map(tag => (
                      <span key={tag} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.06em' }}>◎ {tag}</span>
                    ))}
                  </div>
                </div>

                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--gold)', flexShrink: 0 }}>
                  View Campus →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Coming Soon */}
      <section style={{ padding: 'clamp(2.5rem,5vw,4rem) 0' }}>
        <div className="container">
          <p className="eyebrow" style={{ marginBottom: '0.5rem' }}>Expanding</p>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.75rem,4vw,2.5rem)', marginBottom: '0.5rem' }}>Coming Soon</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
            New campuses in development. <Link href="/membership#waitlist" style={{ color: 'var(--gold)' }}>Join the waitlist →</Link>
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%,240px), 1fr))', gap: '1rem' }}>
            {COMING_SOON.map(loc => (
              <div key={loc.city} style={{
                background: 'var(--surface)', border: '1px solid var(--border2)',
                borderRadius: 'var(--radius-lg)', padding: '1.5rem',
                display: 'flex', flexDirection: 'column', gap: '0.5rem',
              }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem' }}>{loc.city}, {loc.state}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)' }}>{loc.tagline}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', color: 'var(--muted)', letterSpacing: '0.1em', marginTop: '0.25rem', borderTop: '1px solid var(--border2)', paddingTop: '0.5rem' }}>COMING SOON</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
