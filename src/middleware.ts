import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // 1. Excluir recursos estáticos, imágenes, favicon y rutas API
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  // Inicializar respuesta base
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://grfjmpkoezeyhjhrzkw.supabase.co'
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_0N0XR9pwO_83Y_t75aie1g_ajIRgD1O'

  // 2. Cliente Supabase SSR con helper de cookies deduplicado y seguro contra desbordamiento de cabeceras
  let supabaseUser = null
  if (url && key && !url.includes('placeholder')) {
    try {
      const supabase = createServerClient(url, key, {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            // Actualizar request cookies
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            // Actualizar response cookies de forma controlada sin recrear cabeceras recursivamente
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set({
                name,
                value,
                ...options,
                // Forzar opciones estándar para evitar proliferación de chunks huérfanos
                path: options?.path || '/',
                sameSite: 'lax',
              })
            })
          },
        },
      })

      const { data } = await supabase.auth.getUser()
      supabaseUser = data?.user || null
    } catch {
      supabaseUser = null
    }
  }

  // 3. Determinar rol del usuario (desde cookie institucional o metadata de Supabase)
  let userRole = request.cookies.get('ade_role')?.value?.toLowerCase() || ''
  if (!userRole && supabaseUser) {
    userRole = (supabaseUser.user_metadata?.role as string)?.toLowerCase() || 'student'
  }

  const isPublicAuthRoute =
    pathname === '/login' ||
    pathname === '/campus/login' ||
    pathname === '/admin/login'

  // Helper para redirección segura que rompe bucles y transfiere cookies sin inflar cabeceras
  const safeRedirect = (targetPath: string) => {
    const targetUrl = new URL(targetPath, request.url)
    
    // Romper cualquier bucle: si ya está en la ruta destino, continuar con next()
    if (request.nextUrl.pathname === targetUrl.pathname && request.nextUrl.search === targetUrl.search) {
      return response
    }

    const redirectResponse = NextResponse.redirect(targetUrl)

    // Preservar solo cookies válidas establecidas en este ciclo
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value)
    })

    return redirectResponse
  }

  // 4. Si el usuario ya está autenticado y visita una página pública de login, redirigir a su portal
  if (isPublicAuthRoute) {
    if (supabaseUser || userRole) {
      const homePath = userRole === 'admin' 
        ? '/dashboard/admin' 
        : userRole === 'teacher' 
        ? '/campus/docente' 
        : '/campus'
      
      return safeRedirect(homePath)
    }
    return response
  }

  const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/dashboard/admin')
  const isTeacherRoute = pathname.startsWith('/campus/docente') || pathname.startsWith('/dashboard/teacher') || pathname.startsWith('/docente') || pathname.startsWith('/teacher')
  const isStudentRoute = (pathname.startsWith('/campus') && !pathname.startsWith('/campus/docente')) || pathname.startsWith('/dashboard/student') || pathname.startsWith('/dashboard/aula')

  // 5. Redirigir a login si no hay sesión autenticada
  if (!supabaseUser && !userRole) {
    let targetLogin = '/campus/login'
    if (isAdminRoute) targetLogin = '/admin/login'
    else if (isTeacherRoute) targetLogin = '/login'

    if (pathname === targetLogin) {
      return response
    }

    const redirectUrl = new URL(targetLogin, request.url)
    redirectUrl.searchParams.set('redirectTo', pathname)
    return safeRedirect(redirectUrl.toString())
  }

  if (!userRole) {
    userRole = 'student'
  }

  // 6. Redirección automática de la raíz /dashboard y /dashboard/teacher
  if (pathname === '/dashboard') {
    const dest = userRole === 'admin' 
      ? '/dashboard/admin' 
      : userRole === 'teacher' 
      ? '/campus/docente' 
      : '/campus'
    return safeRedirect(dest)
  }

  if (pathname === '/dashboard/teacher') {
    return safeRedirect('/campus/docente')
  }

  // 7. Control de Acceso Basado en Roles (RBAC)
  if (isAdminRoute && userRole !== 'admin') {
    const fallback = userRole === 'teacher' ? '/campus/docente' : '/campus'
    return safeRedirect(fallback)
  }

  if (isTeacherRoute && userRole !== 'teacher' && userRole !== 'admin') {
    return safeRedirect('/campus')
  }

  if (isStudentRoute && userRole !== 'student' && userRole !== 'admin') {
    const fallback = userRole === 'teacher' ? '/campus/docente' : '/dashboard/admin'
    return safeRedirect(fallback)
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
