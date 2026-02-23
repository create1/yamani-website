import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { ALL_COURSES } from '@/lib/courses'

/**
 * POST /api/courses/seed
 * Seeds all courses from the canonical course catalogue into Supabase.
 * Protected by a simple SEED_SECRET environment variable.
 */
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const seedSecret = process.env.SEED_SECRET

  if (seedSecret && authHeader !== `Bearer ${seedSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const rows = ALL_COURSES.map(c => ({
      slug: c.slug,
      name: c.name,
      description: c.description,
      track: c.track,
      duration_min: c.duration_min,
      rotation_week: c.rotation_week,
      day_of_week: c.day_of_week,
      start_time: c.start_time,
      space: c.space,
      instructor: c.instructor,
      capacity: c.capacity,
      objectives: c.objectives,
    }))

    const { data, error } = await supabaseAdmin
      .from('courses')
      .upsert(rows, { onConflict: 'slug' })
      .select('id, slug')

    if (error) throw error

    return NextResponse.json({
      ok: true,
      seeded: data?.length ?? 0,
      courses: data,
    })
  } catch (err) {
    console.error('[courses/seed]', err)
    return NextResponse.json({ error: 'Seed failed', detail: String(err) }, { status: 500 })
  }
}
