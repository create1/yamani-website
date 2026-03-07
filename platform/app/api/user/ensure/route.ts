import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * Ensures the current user has a row in public.users (for dashboard, journeys, etc.).
 * Call once after login so profile/journey creation works even if the DB trigger didn't run.
 */
export async function POST(_req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseUrl || !supabaseKey || supabaseUrl.startsWith('your-')) {
      return NextResponse.json({ error: 'Not configured' }, { status: 503 })
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll() {
          // Route handlers don't need to write cookies for this read-only auth check
        },
      },
    })

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const name =
      (user.user_metadata?.full_name as string) ||
      user.email?.split('@')[0] ||
      ''

    const { error } = await supabaseAdmin.from('users').upsert(
      {
        id: user.id,
        email: user.email ?? '',
        name: name || 'Guest',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id', ignoreDuplicates: true }
    )

    if (error) {
      console.error('[api/user/ensure]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[api/user/ensure]', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
