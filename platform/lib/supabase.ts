import { createClient, SupabaseClient } from '@supabase/supabase-js'

// ── Lazy client factory (avoids crashing during build with placeholder env vars)
let _supabase: SupabaseClient | null = null
let _supabaseAdmin: SupabaseClient | null = null

function isConfigured(url: string | undefined, key: string | undefined): boolean {
  return !!(url && key && !url.startsWith('your-') && !key.startsWith('your-'))
}

export function supabaseReady(): boolean {
  return isConfigured(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  )
}

function getClient(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!isConfigured(url, key)) {
      return createClient('https://placeholder.supabase.co', 'placeholder-anon-key')
    }
    _supabase = createClient(url!, key!)
  }
  return _supabase
}

function getAdminClient(): SupabaseClient {
  if (!_supabaseAdmin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key || url.startsWith('your-')) {
      return createClient('https://placeholder.supabase.co', 'placeholder-service-key')
    }
    _supabaseAdmin = createClient(url, key)
  }
  return _supabaseAdmin
}

// Proxy objects so callers can do `supabase.from(...)` directly
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getClient()
    const value = (client as unknown as Record<string | symbol, unknown>)[prop]
    return typeof value === 'function' ? value.bind(client) : value
  },
})

export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getAdminClient()
    const value = (client as unknown as Record<string | symbol, unknown>)[prop]
    return typeof value === 'function' ? value.bind(client) : value
  },
})

export type UserRole = 'student' | 'instructor' | 'admin'
export type MembershipTier = 'community' | 'seeker' | 'founder' | 'visionary'
export type TrackName = 'wellness' | 'ai' | 'founder' | 'community'
export type MaterialType = 'slide' | 'pdf' | 'link' | 'video'
export type SessionStatus = 'scheduled' | 'live' | 'ended' | 'cancelled'

export interface User {
  id: string
  email: string
  name: string
  membership_tier: MembershipTier
  role: UserRole
  created_at: string
}

export interface Course {
  id: string
  slug: string
  name: string
  description: string
  track: TrackName
  duration_min: number
  rotation_week: number | null
  day_of_week: string
  start_time: string
  space: string
  instructor?: string
  capacity?: number
  created_at: string
}

export interface Session {
  id: string
  course_id: string
  scheduled_date: string
  daily_room_url: string | null
  daily_room_name: string | null
  recording_url: string | null
  status: SessionStatus
  created_at: string
  course?: Course
}

export interface Enrollment {
  id: string
  user_id: string
  course_id: string
  enrolled_at: string
  course?: Course
}

export interface Message {
  id: string
  session_id: string
  user_id: string
  body: string
  created_at: string
  user?: Pick<User, 'name' | 'role'>
  attendance_type?: 'remote' | 'in-room'
}

export interface Material {
  id: string
  course_id: string
  session_id: string | null
  title: string
  type: MaterialType
  storage_path: string
  created_at: string
}
