import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://grfjmpkoezeyhjhrzkw.supabase.co'
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_0N0XR9pwO_83Y_t75aie1g_ajIRgD1O'
  const pathname = request.nextUrl.pathname

  // 1. Recursos y páginas públicas de autenticación
  const isPublicAuthRoute = 
    pathname === '/login' ||
    pathname === '/campus/login' ||
    pathname === '/admin/login'

  // 2. Definición de grupos de rutas protegidas
  const isAdminRoute = 
    (pathname.startsWith('/admin') && pathname !== '/admin/login') ||
    pathname.startsWith('/dashboard/admin')

  const isTeacherRoute = 
    pathname.startsWith('/dashboard/teacher') ||
    pathname.startsWith('/campus/docente') ||
    pathname.startsWith('/docente') ||
    pathname.startsWith('/teacher')

  const isStudentRoute = 
    pathname.startsWith('/dashboard/student') ||
    pathname.startsWith('/dashboard/aula') ||
    pathname.startsWith('/dashboard/progreso') ||
    pathname.startsWith('/dashboard/biblioteca') ||
    pathname.startsWith('/dashboard/certificados') ||
    pathname.startsWith('/dashboard/pagos') ||
    (pathname.startsWith('/campus') && !pathname.startsWith('/campus/docente') && pathname !== '/campus/login') ||
    pathname === '/dashboard'

  // Si no es una ruta protegida, continuar directamente
  if (!isAdminRoute && !isTeacherRoute && !isStudentRoute) {
    return response
  }

  // Comprobar si Supabase tiene credenciales reales
  const isValidConfig = url && key && !url.includes('placeholder') && !url.includes('your-supabase')
  if (!isValidConfig) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.searchParams.set('error', 'supabase_not_configured')
    return NextResponse.redirect(redirectUrl)
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

    const {
      data: { user },
    } = await supabase.auth.getUser()

    // 1. Si no hay usuario autenticado, redirigir al login correspondiente
    if (!user) {
      const redirectUrl = request.nextUrl.clone()
      if (isAdminRoute) {
        redirectUrl.pathname = '/admin/login'
      } else if (isTeacherRoute) {
        redirectUrl.pathname = '/login'
      } else {
        redirectUrl.pathname = '/campus/login'
      }
      redirectUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // 2. Obtener rol de public.profiles con fallback a user_metadata o 'student'
    let userRole = 'student'
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
      userRole = (user.user_metadata?.role as string)?.toLowerCase() || 'student'
    }

    // 3. Redirección automática de la raíz /dashboard al panel del rol correspondiente
    if (pathname === '/dashboard') {
      const redirectUrl = request.nextUrl.clone()
      if (userRole === 'admin') {
        redirectUrl.pathname = '/dashboard/admin'
      } else if (userRole === 'teacher') {
        redirectUrl.pathname = '/dashboard/teacher'
      } else {
        redirectUrl.pathname = '/dashboard/student'
      }
      return NextResponse.redirect(redirectUrl)
    }

    // 4. Control de Acceso Basado en Roles (RBAC)
    if (isAdminRoute) {
      if (userRole !== 'admin') {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = userRole === 'teacher' ? '/dashboard/teacher' : '/dashboard/student'
        return NextResponse.redirect(redirectUrl)
      }
    } else if (isTeacherRoute) {
      if (userRole !== 'teacher' && userRole !== 'admin') {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/dashboard/student'
        return NextResponse.redirect(redirectUrl)
      }
    } else if (isStudentRoute) {
      // Un estudiante o admin tiene acceso TOTAL a /dashboard/student y subrutas
      if (userRole !== 'student' && userRole !== 'admin') {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = userRole === 'teacher' ? '/dashboard/teacher' : '/dashboard/admin'
        return NextResponse.redirect(redirectUrl)
      }
    }

    return response
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
