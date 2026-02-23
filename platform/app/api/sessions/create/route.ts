import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { createDailyRoom } from '@/lib/daily'

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json()
    if (!sessionId) return NextResponse.json({ error: 'sessionId required' }, { status: 400 })

    // Fetch session
    const { data: session, error: sessionErr } = await supabaseAdmin
      .from('sessions')
      .select('*, course:courses(name, duration_min)')
      .eq('id', sessionId)
      .single()

    if (sessionErr || !session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Calculate expiry: scheduled date + duration + 30 min buffer
    const scheduledAt = new Date(session.scheduled_date)
    const durationMin = session.course?.duration_min ?? 120
    const expiresAt = new Date(scheduledAt.getTime() + (durationMin + 30) * 60 * 1000)

    // Create Daily.co room
    const room = await createDailyRoom(sessionId, expiresAt)

    // Update session record
    const { error: updateErr } = await supabaseAdmin
      .from('sessions')
      .update({
        daily_room_url: room.url,
        daily_room_name: room.name,
        status: 'live',
      })
      .eq('id', sessionId)

    if (updateErr) throw updateErr

    return NextResponse.json({ roomUrl: room.url, roomName: room.name })
  } catch (err) {
    console.error('[sessions/create]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
