import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const pathname = request.nextUrl.pathname

  // 1. Excluir recursos estáticos, imágenes, fuentes, favicon y llamadas API
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return response
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://grfjmpkoezeyhjhrzkw.supabase.co'
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_0N0XR9pwO_83Y_t75aie1g_ajIRgD1O'

  // 2. Cliente oficial Supabase SSR estándar
  let user = null
  let supabase = null

  if (supabaseUrl && supabaseKey && !supabaseUrl.includes('placeholder')) {
    try {
      supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            response = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      })

      const { data } = await supabase.auth.getUser()
      user = data?.user || null
    } catch {
      user = null
    }
  }

  const isAuthPage =
    pathname === '/login' ||
    pathname === '/campus/login' ||
    pathname === '/admin/login'

  const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/dashboard/admin')
  const isTeacherRoute = pathname.startsWith('/campus/docente') || pathname.startsWith('/dashboard/teacher') || pathname.startsWith('/docente') || pathname.startsWith('/teacher')
  const isStudentRoute = (pathname.startsWith('/campus') && !pathname.startsWith('/campus/docente')) || pathname.startsWith('/dashboard/student') || pathname.startsWith('/dashboard/aula')

  // 3. Caso usuario NO autenticado
  if (!user) {
    if (isAuthPage) {
      return response
    }

    let targetLogin = '/campus/login'
    if (isAdminRoute) targetLogin = '/admin/login'
    else if (isTeacherRoute) targetLogin = '/login'

    // Si ya estamos en el login destino, retornar next() sin redirigir
    if (pathname === targetLogin) {
      return response
    }

    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = targetLogin
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // 4. Caso usuario AUTENTICADO: Resolver rol
  let userRole = (user.user_metadata?.role as string)?.toLowerCase() || 'student'
  if (supabase) {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()

      if (profile?.role) {
        userRole = profile.role.toLowerCase()
      }
    } catch {
      // Mantener fallback de user_metadata
    }
  }

  // Si está autenticado y visita una página de login, dirigir a su home
  if (isAuthPage) {
    let home = '/campus'
    if (userRole === 'admin') home = '/dashboard/admin'
    else if (userRole === 'teacher') home = '/campus/docente'

    if (pathname === home) {
      return response
    }

    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = home
    redirectUrl.search = ''
    return NextResponse.redirect(redirectUrl)
  }

  // Redirección de la raíz /dashboard
  if (pathname === '/dashboard') {
    let dest = '/campus'
    if (userRole === 'admin') dest = '/dashboard/admin'
    else if (userRole === 'teacher') dest = '/campus/docente'

    if (pathname === dest) {
      return response
    }

    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = dest
    return NextResponse.redirect(redirectUrl)
  }

  if (pathname === '/dashboard/teacher') {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/campus/docente'
    return NextResponse.redirect(redirectUrl)
  }

  // RBAC para roles protegidos
  if (isAdminRoute && userRole !== 'admin') {
    const fallback = userRole === 'teacher' ? '/campus/docente' : '/campus'
    if (pathname === fallback) {
      return response
    }
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = fallback
    return NextResponse.redirect(redirectUrl)
  }

  if (isTeacherRoute && userRole !== 'teacher' && userRole !== 'admin') {
    if (pathname === '/campus') {
      return response
    }
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/campus'
    return NextResponse.redirect(redirectUrl)
  }

  if (isStudentRoute && userRole !== 'student' && userRole !== 'admin') {
    const fallback = userRole === 'teacher' ? '/campus/docente' : '/dashboard/admin'
    if (pathname === fallback) {
      return response
    }
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = fallback
    return NextResponse.redirect(redirectUrl)
  }

  // Si todo coincide y el usuario tiene permisos, paso directo sin bucle ni nuevas cabeceras
  return response
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/campus/:path*',
    '/docente/:path*',
    '/teacher/:path*',
    '/login',
  ],
}
