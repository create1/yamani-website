import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const rawNext = searchParams.get('next')
  const next = (rawNext && rawNext.startsWith('/')) ? rawNext : '/dashboard'
  const error = searchParams.get('error')
  const error_description = searchParams.get('error_description')

  if (error) {
    const msg = error_description ?? error
    return NextResponse.redirect(`${origin}/auth/signin?error=${encodeURIComponent(msg)}`)
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey || supabaseUrl.startsWith('your-')) {
    return NextResponse.redirect(`${origin}/auth/signin?error=not-configured`)
  }

  const cookieStore = await cookies()
  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Ignored when called from Server Component / middleware
        }
      },
    },
  })

  if (token_hash && type) {
    const { error: otpError } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as 'email' | 'signup' | 'magiclink' | 'recovery',
    })
    if (!otpError) return NextResponse.redirect(`${origin}${next}`)
  }

  if (code) {
    const { error: codeError } = await supabase.auth.exchangeCodeForSession(code)
    if (!codeError) return NextResponse.redirect(`${origin}${next}`)
  }

  return NextResponse.redirect(`${origin}/auth/signin?error=Could not sign in. Try again.`)
}
