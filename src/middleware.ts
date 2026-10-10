import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // 1. Excluir páginas públicas de autenticación del middleware
  if (
    pathname === '/login' ||
    pathname === '/campus/login' ||
    pathname === '/admin/login'
  ) {
    return NextResponse.next()
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://grfjmpkoezeyhjhrzkw.supabase.co'
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_0N0XR9pwO_83Y_t75aie1g_ajIRgD1O'

  // Si Supabase no está configurado, continuar
  if (!url || !key || url.includes('placeholder')) {
    return response
  }

  try {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    })

    let user = null
    try {
      const {
        data,
      } = await supabase.auth.getUser()
      user = data?.user || null
    } catch (authErr) {
      user = null
    }

    const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/dashboard/admin')
    const isTeacherRoute = pathname.startsWith('/campus/docente') || pathname.startsWith('/dashboard/teacher') || pathname.startsWith('/docente') || pathname.startsWith('/teacher')
    const isStudentRoute = (pathname.startsWith('/campus') && !pathname.startsWith('/campus/docente')) || pathname.startsWith('/dashboard/student') || pathname.startsWith('/dashboard/aula')

    // 1. Obtener rol desde cookie institucional 'ade_role' o desde perfil/metadata de Supabase
    let userRole = request.cookies.get('ade_role')?.value?.toLowerCase() || ''

    if (user) {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle()

        if (profile?.role) {
          userRole = profile.role.toLowerCase()
        } else if (user.user_metadata?.role) {
          userRole = (user.user_metadata.role as string).toLowerCase()
        }
      } catch (profileErr) {
        userRole = (user.user_metadata?.role as string)?.toLowerCase() || userRole || 'student'
      }
    }

    // 2. Redirigir a login si no hay usuario de Supabase ni cookie de sesión institucional
    if (!user && !userRole) {
      let targetLogin = '/campus/login'
      if (isAdminRoute) targetLogin = '/admin/login'
      else if (isTeacherRoute) targetLogin = '/login'

      const redirectUrl = new URL(targetLogin, request.url)
      redirectUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(redirectUrl)
    }

    if (!userRole) {
      userRole = 'student'
    }

    // 3. Redirección automática de la raíz /dashboard y /dashboard/teacher
    if (pathname === '/dashboard') {
      if (userRole === 'admin') return NextResponse.redirect(new URL('/dashboard/admin', request.url))
      if (userRole === 'teacher') return NextResponse.redirect(new URL('/campus/docente', request.url))
      return NextResponse.redirect(new URL('/campus', request.url))
    }

    if (pathname === '/dashboard/teacher') {
      return NextResponse.redirect(new URL('/campus/docente', request.url))
    }

    // 4. Control de Acceso Basado en Roles (RBAC)
    if (isAdminRoute && userRole !== 'admin') {
      const fallback = userRole === 'teacher' ? '/campus/docente' : '/campus'
      return NextResponse.redirect(new URL(fallback, request.url))
    }

    if (isTeacherRoute && userRole !== 'teacher' && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/campus', request.url))
    }

    if (isStudentRoute && userRole !== 'student' && userRole !== 'admin') {
      const fallback = userRole === 'teacher' ? '/campus/docente' : '/dashboard/admin'
      return NextResponse.redirect(new URL(fallback, request.url))
    }

    return response
  } catch (err) {
    console.error('Middleware execution error:', err)
    return response
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/campus/:path*',
    '/docente/:path*',
    '/teacher/:path*',
  ],
}
