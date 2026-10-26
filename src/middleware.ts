import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Excluir rutas públicas estáticas, API, imágenes y recursos internos
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/audio') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  ) {
    return NextResponse.next()
  }

  // 2. Rutas de login públicas (siempre accesibles sin comprobación previa)
  if (
    pathname === '/admin/login' ||
    pathname === '/campus/login' ||
    pathname === '/login'
  ) {
    return NextResponse.next()
  }

  // 3. Crear cliente Supabase adaptado para Edge Middleware
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://grfjnmpkoezeyhjhrzkw.supabase.co'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_0N0XR9pwO_83Y_t75aie1g_ajIRgD1O'

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
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

  // 4. Obtener usuario autenticado o cookie de rol
  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data?.user || null
  } catch {
    // Si falla la conexión a auth, continuar con detección por cookies
  }

  // Detectar rol efectivo (Supabase user metadata, email o cookie ade_user_role)
  const cookieRole = request.cookies.get('ade_user_role')?.value?.toLowerCase()
  const headerRole = request.headers.get('x-demo-role')?.toLowerCase()
  
  let effectiveRole: 'admin' | 'teacher' | 'student' | null = null

  if (user) {
    const metaRole = (user.user_metadata?.role as string)?.toLowerCase()
    const email = user.email?.toLowerCase() || ''
    
    if (metaRole === 'admin' || email.includes('admin') || cookieRole === 'admin') {
      effectiveRole = 'admin'
    } else if (metaRole === 'teacher' || email.includes('docente') || email.includes('teacher') || cookieRole === 'teacher') {
      effectiveRole = 'teacher'
    } else {
      effectiveRole = 'student'
    }
  } else if (headerRole === 'admin' || headerRole === 'teacher' || headerRole === 'student') {
    effectiveRole = headerRole
  } else if (cookieRole === 'admin' || cookieRole === 'teacher' || cookieRole === 'student') {
    effectiveRole = cookieRole
  }

  const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/dashboard/admin')
  const isDocenteRoute = pathname.startsWith('/campus/docente') || pathname === '/docente' || pathname.startsWith('/docente/') || pathname.startsWith('/dashboard/teacher')
  const isCampusRoute = pathname.startsWith('/campus')

  // =========================================================================
  // REGLAS ESTRICTAS DE RBAC:
  // =========================================================================

  // 1. REGLA DEL ESTUDIANTE:
  // Si el usuario tiene rol 'student' y trata de entrar a /admin o a /docente -> REDIRECCIÓN LIMPIA A /campus
  if (effectiveRole === 'student') {
    if (isAdminRoute || isDocenteRoute) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/campus'
      redirectUrl.search = ''
      return NextResponse.redirect(redirectUrl)
    }
  }

  // 2. REGLA DEL DOCENTE:
  // El docente solo tiene permisos en su portal y en vista previa de estudiante.
  // Si intenta acceder a rutas de administración -> REDIRECCIÓN A /campus/docente
  if (effectiveRole === 'teacher') {
    if (isAdminRoute) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/campus/docente'
      redirectUrl.search = ''
      return NextResponse.redirect(redirectUrl)
    }
  }

  // 3. REGLA DEL ADMINISTRADOR:
  // Si es 'admin', tiene paso irrestricto tanto en /admin, /dashboard, /campus/docente y /campus.
  // Su rol y token no se tocan.
  if (effectiveRole === 'admin') {
    // Si la cookie no estaba seteada, aseguramos que viaje en la respuesta
    if (cookieRole !== 'admin') {
      response.cookies.set('ade_user_role', 'admin', {
        path: '/',
        sameSite: 'lax',
        maxAge: 86400,
      })
    }
    return response
  }

  // 4. REGLA DE USUARIOS NO AUTENTICADOS (PROTECCIÓN DE ACCESO DIRECTO):
  if (!effectiveRole && !user) {
    if (isAdminRoute) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/admin/login'
      redirectUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(redirectUrl)
    }

    if (isDocenteRoute) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/campus/login'
      redirectUrl.searchParams.set('mode', 'teacher')
      return NextResponse.redirect(redirectUrl)
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Interceptar rutas protegidas:
     * - /admin/*
     * - /dashboard/admin/*
     * - /campus/docente/*
     * - /docente/*
     * - /dashboard/teacher/*
     */
    '/admin/:path*',
    '/dashboard/:path*',
    '/campus/docente/:path*',
    '/docente',
    '/docente/:path*'
  ],
}
