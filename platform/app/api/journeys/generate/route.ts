import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { supabaseAdmin } from '@/lib/supabase'
import type { ScheduleBlock, SpaceDecor, SacredObject, Ritual } from '@/lib/journeys'

// Mock AI response for Phase 1. Replace with real LLM call when ready.
function mockGenerateJourneyOutput(_payload: {
  goals: string
  modalities: string[]
  startAt: string
  endAt: string
  locationName?: string
  foodPreferences?: string
}): {
  narrative_arc: string
  schedule: ScheduleBlock[]
  spaces_decor: SpaceDecor[]
  memorabilia_sacred_objects: SacredObject[]
  rituals: Ritual[]
} {
  return {
    narrative_arc: `**The Call** — You have set an intention to step more fully into your life. This journey is a threshold: between who you have been and who you are becoming.\n\n**The Crossing** — Over these hours, you will move through spaces designed for presence: movement to ground the body, silence to quiet the mind, and ritual to mark what matters.\n\n**The Return** — You will leave with a clearer sense of direction and a simple practice to carry forward. The hero's journey is never truly over; it continues in the small choices of each day.`,
    schedule: [
      { day: 1, time_start: '09:00', time_end: '09:30', title: 'Arrival & grounding', description: 'Settle in. Tea or water. Brief silence.', space: 'Main space', narrative_beat: 'Threshold' },
      { day: 1, time_start: '09:30', time_end: '10:30', title: 'Movement & breath', description: 'Gentle movement and breathwork to arrive in the body.', space: 'Movement or open space', narrative_beat: 'Descent' },
      { day: 1, time_start: '10:30', time_end: '11:00', title: 'Rest & integration', description: 'Quiet time. Journaling prompt provided.', narrative_beat: 'Integration' },
      { day: 1, time_start: '11:00', time_end: '11:45', title: 'Closing circle', description: 'Shared reflection and intention for the path ahead.', narrative_beat: 'Return' },
    ],
    spaces_decor: [
      { space_name: 'Main space', atmosphere_notes: 'Warm, uncluttered. Natural light if possible.', lighting: 'Soft; avoid harsh overhead.', objects: ['Cushions or chairs in a circle', 'A single candle or small altar at the center'] },
    ],
    memorabilia_sacred_objects: [
      { name: 'A stone or small object from the land', meaning: 'An anchor for the intention you set today.', when_to_use: 'Place it where you will see it daily.' },
      { name: 'Written intention on paper', meaning: 'A physical reminder of the commitment you made.', when_to_use: 'Keep in a pocket or on your altar.' },
    ],
    rituals: [
      { name: 'Opening silence', description: '2–3 minutes of shared silence after everyone is seated.', timing: 'Start of the journey' },
      { name: 'Closing intention', description: 'Each person names one intention for the days ahead.', timing: 'End of the journey' },
    ],
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = req.cookies
    const supabaseAuth = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return cookieStore.get(name)?.value },
          set() {},
          remove() {},
        },
      }
    )
    const { data: { user } } = await supabaseAuth.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { journeyId } = body
    if (!journeyId) return NextResponse.json({ error: 'journeyId required' }, { status: 400 })

    const { data: journey, error: journeyErr } = await supabaseAdmin
      .from('journeys')
      .select('id, host_id, start_at, end_at, location_id, selected_modalities, location:locations(name)')
      .eq('id', journeyId)
      .single()

    if (journeyErr || !journey) return NextResponse.json({ error: 'Journey not found' }, { status: 404 })
    if (journey.host_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { data: input } = await supabaseAdmin
      .from('journey_inputs')
      .select('goals_text, food_preferences')
      .eq('journey_id', journeyId)
      .eq('user_id', user.id)
      .maybeSingle()

    const goals = (input?.goals_text ?? '') || 'I want to deepen my presence and clarity.'
    const foodPrefs = input?.food_preferences ?? ''

    await supabaseAdmin.from('journeys').update({ status: 'generating' }).eq('id', journeyId)

    const generated = mockGenerateJourneyOutput({
      goals,
      modalities: journey.selected_modalities ?? [],
      startAt: journey.start_at,
      endAt: journey.end_at,
      locationName: (journey.location as { name?: string } | null)?.name,
      foodPreferences: foodPrefs,
    })

    const { error: insertErr } = await supabaseAdmin.from('journey_outputs').insert({
      journey_id: journeyId,
      version: 1,
      narrative_arc: generated.narrative_arc,
      schedule: generated.schedule,
      spaces_decor: generated.spaces_decor,
      memorabilia_sacred_objects: generated.memorabilia_sacred_objects,
      rituals: generated.rituals,
      moodboard: [],
      generated_images: [],
      personal_arcs: {},
      model_used: 'mock',
    })

    if (insertErr) {
      await supabaseAdmin.from('journeys').update({ status: 'draft' }).eq('id', journeyId)
      throw insertErr
    }

    await supabaseAdmin.from('journeys').update({ status: 'ready', updated_at: new Date().toISOString() }).eq('id', journeyId)

    return NextResponse.json({ ok: true, journeyId })
  } catch (err) {
    console.error('[journeys/generate]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
