import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://grfjmpkoezeyhjhrzkw.supabase.co'
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_0N0XR9pwO_83Y_t75aie1g_ajIRgD1O'
  const pathname = request.nextUrl.pathname

  // Safely check if Supabase is properly configured with real credentials
  const isValidConfig = url && key && !url.includes('placeholder') && !url.includes('your-supabase')

  if (!isValidConfig) {
    if (pathname.startsWith('/dashboard')) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/login'
      redirectUrl.searchParams.set('error', 'supabase_not_configured')
      return NextResponse.redirect(redirectUrl)
    }
    return response
  }

  try {
    let res = response
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          res = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          )
        },
      },
    })

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (pathname.startsWith('/dashboard')) {
      if (!user) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/login'
        redirectUrl.searchParams.set('redirectTo', pathname)
        return NextResponse.redirect(redirectUrl)
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      const role = profile?.role

      if (pathname.startsWith('/dashboard/admin')) {
        if (role !== 'admin') {
          const redirectUrl = request.nextUrl.clone()
          redirectUrl.pathname = '/login'
          redirectUrl.searchParams.set('error', 'unauthorized_admin')
          return NextResponse.redirect(redirectUrl)
        }
      } else if (pathname.startsWith('/dashboard/teacher')) {
        if (role !== 'teacher' && role !== 'admin') {
          const redirectUrl = request.nextUrl.clone()
          redirectUrl.pathname = '/login'
          redirectUrl.searchParams.set('error', 'unauthorized_teacher')
          return NextResponse.redirect(redirectUrl)
        }
      } else if (pathname.startsWith('/dashboard/student')) {
        if (role !== 'student') {
          const redirectUrl = request.nextUrl.clone()
          redirectUrl.pathname = '/login'
          redirectUrl.searchParams.set('error', 'unauthorized_student')
          return NextResponse.redirect(redirectUrl)
        }
      }
    }

    return res
  } catch (err) {
    console.error('Middleware execution error:', err)
    return response
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
