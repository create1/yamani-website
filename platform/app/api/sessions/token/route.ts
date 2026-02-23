import { NextRequest, NextResponse } from 'next/server'
import { createDailyToken } from '@/lib/daily'

export async function POST(req: NextRequest) {
  try {
    const { roomName, userName, isOwner } = await req.json()
    if (!roomName || !userName) {
      return NextResponse.json({ error: 'roomName and userName required' }, { status: 400 })
    }

    const result = await createDailyToken({
      roomName,
      userName,
      isOwner: isOwner ?? false,
      exp: Math.floor(Date.now() / 1000) + 5 * 60 * 60, // 5 hours
    })

    return NextResponse.json({ token: result.token })
  } catch (err) {
    console.error('[sessions/token]', err)
    return NextResponse.json({ error: 'Failed to create token' }, { status: 500 })
  }
}
