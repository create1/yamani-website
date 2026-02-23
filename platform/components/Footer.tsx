import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">Apotheos</div>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <Link href="/curriculum" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Curriculum</Link>
        <Link href="/schedule"   style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Schedule</Link>
        <Link href="/courses"    style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Courses</Link>
        <Link href="/#contact"   style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Contact</Link>
      </div>
      <div className="footer-copy">© {new Date().getFullYear()} Apotheos. All rights reserved.</div>
    </footer>
  )
}
