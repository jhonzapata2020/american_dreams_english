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

  // Helper de redirección seguro que solo transfiere cookies necesarias y rompe bucles
  const redirectClean = (targetPath: string) => {
    const targetUrl = new URL(targetPath, request.url)
    
    // Si la URL actual es exactamente igual a la de destino, retornar next() sin redirigir
    if (request.nextUrl.pathname === targetUrl.pathname && request.nextUrl.search === targetUrl.search) {
      return response
    }

    const redirectResponse = NextResponse.redirect(targetUrl)
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value)
    })
    return redirectResponse
  }

  // 2. CASO USUARIO NO AUTENTICADO: Único caso donde se redirige al login
  if (!user) {
    if (isAuthPage) {
      return response
    }

    let targetLogin = '/campus/login'
    if (isAdminRoute) targetLogin = '/admin/login'
    else if (isTeacherRoute) targetLogin = '/login'

    if (pathname === targetLogin) {
      return response
    }

    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = targetLogin
    redirectUrl.searchParams.set('redirectTo', pathname)
    return redirectClean(redirectUrl.toString())
  }

  // 3. CASO USUARIO AUTENTICADO: Determinar rol
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
      // Mantener fallback
    }
  }

  // Si visita página de login y tiene parámetro error/unauthorized, no redirigir automáticamente
  const hasErrorParam = request.nextUrl.searchParams.has('error') || request.nextUrl.searchParams.has('unauthorized')
  if (isAuthPage) {
    if (hasErrorParam) {
      return response
    }
    const home = userRole === 'admin' ? '/dashboard/admin' : userRole === 'teacher' ? '/campus/docente' : '/campus'
    return redirectClean(home)
  }

  // Redirección de la raíz /dashboard
  if (pathname === '/dashboard') {
    const dest = userRole === 'admin' ? '/dashboard/admin' : userRole === 'teacher' ? '/campus/docente' : '/campus'
    return redirectClean(dest)
  }

  if (pathname === '/dashboard/teacher') {
    const dest = userRole === 'teacher' || userRole === 'admin' ? '/campus/docente' : '/campus'
    return redirectClean(dest)
  }

  // 4. CONTROL DE ACCESO (RBAC) - DIRECTO AL PORTAL DEL USUARIO (NUNCA A /LOGIN)
  if (isAdminRoute) {
    if (userRole === 'admin') {
      return response // Paso directo permitido al admin
    }
    // Usuario autenticado que NO es admin -> redirigir a su propio portal, NUNCA a login
    const userPortal = userRole === 'teacher' ? '/campus/docente' : '/campus'
    return redirectClean(userPortal)
  }

  if (isTeacherRoute) {
    if (userRole === 'teacher' || userRole === 'admin') {
      return response // Paso permitido
    }
    // Estudiante en ruta docente -> enviar a su campus
    return redirectClean('/campus')
  }

  if (isStudentRoute) {
    if (userRole === 'student' || userRole === 'admin') {
      return response // Paso permitido
    }
    // Docente en ruta de estudiante -> enviar a su portal docente
    return redirectClean('/campus/docente')
  }

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
