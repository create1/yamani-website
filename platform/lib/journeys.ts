// ═══════════════════════════════════════════════════════════════
// APOTHEOS JOURNEY — Types and constants for experience design
// ═══════════════════════════════════════════════════════════════

import type { TrackName } from '@/lib/courses'
import { TRACK_META } from '@/lib/courses'

export type JourneyType = 'solo' | 'group'
export type JourneyStatus = 'draft' | 'collecting_inputs' | 'generating' | 'ready' | 'archived'

export interface Journey {
  id: string
  host_id: string
  title: string | null
  type: JourneyType
  status: JourneyStatus
  start_at: string
  end_at: string
  location_id: string | null
  selected_modalities: string[]
  created_at: string
  updated_at: string
  location?: { id: string; name: string; slug: string } | null
}

export interface JourneyInput {
  id: string
  journey_id: string
  user_id: string
  goals_text: string
  food_preferences: string | null
  other_preferences: Record<string, unknown>
  modality_interests: string[]
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface JourneyOutput {
  id: string
  journey_id: string
  version: number
  narrative_arc: string | null
  schedule: ScheduleBlock[]
  spaces_decor: SpaceDecor[]
  memorabilia_sacred_objects: SacredObject[]
  rituals: Ritual[]
  moodboard: MoodboardItem[]
  generated_images: GeneratedImage[]
  personal_arcs: Record<string, string>
  model_used: string | null
  generated_at: string
}

export interface ScheduleBlock {
  day: number
  time_start: string
  time_end?: string
  title: string
  description?: string
  space?: string
  narrative_beat?: string
}

export interface SpaceDecor {
  space_name: string
  atmosphere_notes?: string
  lighting?: string
  objects?: string[]
}

export interface SacredObject {
  name: string
  meaning?: string
  when_to_use?: string
}

export interface Ritual {
  name: string
  description?: string
  timing?: string
}

export interface MoodboardItem {
  url?: string
  caption?: string
  type?: 'image' | 'quote' | 'color'
}

export interface GeneratedImage {
  url: string
  prompt?: string
  caption?: string
}

// Modalities = track names from curriculum (wellness, ai, founder, community)
export const JOURNEY_MODALITIES: { value: TrackName; label: string; icon: string }[] = (
  ['wellness', 'ai', 'founder', 'community'] as TrackName[]
).map(track => ({
  value: track,
  label: TRACK_META[track].label,
  icon: TRACK_META[track].icon,
}))

export const JOURNEY_STATUS_LABELS: Record<JourneyStatus, string> = {
  draft: 'Draft',
  collecting_inputs: 'Collecting inputs',
  generating: 'Generating…',
  ready: 'Ready',
  archived: 'Archived',
}

export function formatJourneyDateRange(startAt: string, endAt: string): string {
  const start = new Date(startAt)
  const end = new Date(endAt)
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }
  if (start.toDateString() === end.toDateString()) {
    return start.toLocaleDateString('en-US', opts)
  }
  return `${start.toLocaleDateString('en-US', opts)} – ${end.toLocaleDateString('en-US', opts)}`
}
