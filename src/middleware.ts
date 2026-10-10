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

  const isAuthPage =
    pathname === '/login' ||
    pathname === '/campus/login' ||
    pathname === '/admin/login'

  const isProtectedRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/campus') ||
    pathname.startsWith('/docente') ||
    pathname.startsWith('/teacher')

  // En páginas públicas de login, permitir que la página cargue normalmente sin forzar redirecciones
  if (isAuthPage) {
    return response
  }

  if (!isProtectedRoute) {
    return response
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://grfjmpkoezeyhjhrzkw.supabase.co'
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_0N0XR9pwO_83Y_t75aie1g_ajIRgD1O'

  let user = null
  let userRole = 'student'

  if (supabaseUrl && supabaseKey && !supabaseUrl.includes('placeholder')) {
    try {
      const supabase = createServerClient(supabaseUrl, supabaseKey, {
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

      // 1. Obtención de usuario exclusiva
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()
      user = authUser

      if (user) {
        // Consulta del rol directamente en la tabla 'profiles'
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
      }
    } catch {
      user = null
    }
  }

  // 2. Si no hay user y la ruta requiere autenticación, redirigir a /login
  if (!user) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.searchParams.set('redirectTo', pathname)

    const redirectResponse = NextResponse.redirect(redirectUrl)
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value)
    })
    return redirectResponse
  }

  // 3. Si profile?.role === 'admin', PERMITE el paso inmediato a CUALQUIER ruta
  if (userRole === 'admin') {
    return response
  }

  // 4. Redirección de la raíz /dashboard para no-admin
  if (pathname === '/dashboard') {
    const dest = userRole === 'teacher' ? '/campus/docente' : '/campus'
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = dest
    redirectUrl.search = ''
    return NextResponse.redirect(redirectUrl)
  }

  // 5. RBAC para rol 'teacher'
  if (userRole === 'teacher') {
    const isTeacherAllowed =
      pathname.startsWith('/campus/docente') ||
      pathname.startsWith('/dashboard/teacher') ||
      pathname.startsWith('/docente') ||
      pathname.startsWith('/teacher') ||
      pathname.startsWith('/campus')

    if (isTeacherAllowed) {
      return response
    }
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/campus/docente'
    return NextResponse.redirect(redirectUrl)
  }

  // 6. RBAC para rol 'student'
  if (userRole === 'student') {
    const isStudentAllowed =
      pathname.startsWith('/campus') ||
      pathname.startsWith('/dashboard/student') ||
      pathname.startsWith('/dashboard/aula')

    if (isStudentAllowed) {
      return response
    }
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/campus'
    return NextResponse.redirect(redirectUrl)
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
