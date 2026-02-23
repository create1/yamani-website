// Daily.co API utilities — server-side only (uses secret API key)

const DAILY_API_KEY = process.env.DAILY_API_KEY!
const DAILY_BASE = 'https://api.daily.co/v1'

interface DailyRoomOptions {
  name?: string
  privacy?: 'public' | 'private'
  exp?: number             // Unix timestamp: when the room expires
  max_participants?: number
  enable_recording?: 'cloud' | 'local' | 'raw-tracks'
  start_audio_off?: boolean
  start_video_off?: boolean
}

interface DailyRoom {
  id: string
  name: string
  api_created: boolean
  privacy: string
  url: string
  created_at: string
  config: Record<string, unknown>
}

async function dailyFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${DAILY_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${DAILY_API_KEY}`,
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Daily.co API error ${res.status}: ${err}`)
  }
  return res.json() as Promise<T>
}

/**
 * Create a Daily.co room for a session.
 * Room expires 2 hours after the scheduled start time.
 */
export async function createDailyRoom(sessionId: string, expiresAt?: Date): Promise<DailyRoom> {
  const name = `apotheos-${sessionId.slice(0, 8)}`
  const exp = expiresAt
    ? Math.floor(expiresAt.getTime() / 1000)
    : Math.floor(Date.now() / 1000) + 3 * 60 * 60 // default 3h from now

  const body: DailyRoomOptions = {
    name,
    privacy: 'private',
    exp,
    max_participants: 200,
    enable_recording: 'cloud',
    start_audio_off: true,
    start_video_off: true,
  }

  return dailyFetch<DailyRoom>('/rooms', {
    method: 'POST',
    body: JSON.stringify({ properties: body }),
  })
}

/**
 * Delete a Daily.co room.
 */
export async function deleteDailyRoom(roomName: string): Promise<void> {
  await dailyFetch(`/rooms/${roomName}`, { method: 'DELETE' })
}

/**
 * Create a meeting token for a participant.
 * is_owner = true gives instructor controls.
 */
export async function createDailyToken(opts: {
  roomName: string
  userName: string
  isOwner?: boolean
  exp?: number
}): Promise<{ token: string }> {
  return dailyFetch<{ token: string }>('/meeting-tokens', {
    method: 'POST',
    body: JSON.stringify({
      properties: {
        room_name: opts.roomName,
        user_name: opts.userName,
        is_owner: opts.isOwner ?? false,
        exp: opts.exp ?? Math.floor(Date.now() / 1000) + 4 * 60 * 60,
        enable_recording: opts.isOwner ? 'cloud' : undefined,
      },
    }),
  })
}

/**
 * Get info about an existing room.
 */
export async function getDailyRoom(roomName: string): Promise<DailyRoom> {
  return dailyFetch<DailyRoom>(`/rooms/${roomName}`)
}
