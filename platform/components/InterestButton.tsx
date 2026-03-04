'use client'
import { useInterests } from '@/context/InterestContext'

interface Props {
  slug: string
  size?: 'sm' | 'md' | 'lg'
  style?: React.CSSProperties
}

export default function InterestButton({ slug, size = 'md', style }: Props) {
  const { isInterested, toggleInterest } = useInterests()
  const saved = isInterested(slug)

  const dim = size === 'sm' ? '1.5rem' : size === 'lg' ? '2.25rem' : '1.85rem'
  const fontSize = size === 'sm' ? '0.7rem' : size === 'lg' ? '1rem' : '0.85rem'

  return (
    <button
      onClick={e => { e.preventDefault(); e.stopPropagation(); toggleInterest(slug) }}
      title={saved ? 'Remove from my schedule' : 'Add to my schedule'}
      style={{
        width: dim, height: dim, borderRadius: '50%', flexShrink: 0,
        border: `1px solid ${saved ? 'var(--gold)' : 'rgba(201,168,76,0.35)'}`,
        background: saved ? 'var(--gold)' : 'rgba(201,168,76,0.08)',
        color: saved ? 'var(--ink)' : 'var(--gold)',
        fontSize,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.18s',
        fontWeight: 700,
        lineHeight: 1,
        ...style,
      }}
    >
      {saved ? '✓' : '+'}
    </button>
  )
}
