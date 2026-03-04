import Link from 'next/link'

export const metadata = {
  title: 'Our Mission — Apotheos',
  description: 'A new kind of institution: AI literacy, entrepreneurial resilience, and embodied wellness — learned together in community.',
}

export default function MissionPage() {
  return (
    <div className="section section-dark" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
      <div className="container">
        <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
          <p className="eyebrow">Our Mission</p>
          <h1 className="section-title" style={{ textAlign: 'center' }}>
            A New Kind of Institution
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '1.1rem', lineHeight: 1.8 }}>
            We believe the most important skills of the coming decade — AI literacy, entrepreneurial resilience, and embodied wellness — are best learned together, in community, not in silos.
          </p>
          <p style={{ color: 'var(--muted)', fontSize: '1.1rem', lineHeight: 1.8, marginTop: '1.5rem' }}>
            Apotheos is a live digital platform first — accessible from anywhere. For those who want to go deeper in person, our{' '}
            <Link href="/locations/nevada-city" style={{ color: 'var(--gold)', textDecoration: 'underline' }}>Nevada City campus</Link>
            {' '}brings the full experience under one roof.
          </p>
          <div style={{ marginTop: '2.5rem' }}>
            <Link href="/" className="btn btn-outline">← Home</Link>
            <Link href="/about" className="btn btn-gold" style={{ marginLeft: '0.5rem' }}>How We Teach →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
