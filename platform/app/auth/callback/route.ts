import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const next = searchParams.get('next') ?? '/dashboard'
  const error = searchParams.get('error')
  const error_description = searchParams.get('error_description')

  // Handle error from Supabase
  if (error) {
    const msg = error_description ?? error
    return NextResponse.redirect(`${origin}/auth/signin?error=${encodeURIComponent(msg)}`)
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey || supabaseUrl.startsWith('your-')) {
    return NextResponse.redirect(`${origin}/auth/signin?error=not-configured`)
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  // Handle magic link / email OTP
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type: type as 'email' | 'signup' | 'magiclink' | 'recovery' })
    if (!error) return NextResponse.redirect(`${origin}${next}`)
  }

  // Handle OAuth / PKCE code exchange
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(`${origin}${next}`)
  }

  return NextResponse.redirect(`${origin}/auth/signin?error=Could not sign in. Try again.`)
}
