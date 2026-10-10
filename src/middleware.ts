import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // 1. Excluir páginas públicas de autenticación del middleware
  if (
    pathname === '/login' ||
    pathname === '/campus/login' ||
    pathname === '/admin/login' ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/dashboard/admin')
  const isTeacherRoute = pathname.startsWith('/campus/docente') || pathname.startsWith('/dashboard/teacher') || pathname.startsWith('/docente') || pathname.startsWith('/teacher')
  const isStudentRoute = (pathname.startsWith('/campus') && !pathname.startsWith('/campus/docente')) || pathname.startsWith('/dashboard/student') || pathname.startsWith('/dashboard/aula')

  // 2. Leer rol desde cookie institucional 'ade_role'
  let userRole = request.cookies.get('ade_role')?.value?.toLowerCase() || ''

  // Fallback para cookies heredadas de supabase
  if (!userRole) {
    const allCookies = request.cookies.getAll()
    const hasSbAuth = allCookies.some(c => c.name.includes('auth-token') || c.name.includes('supabase'))
    if (hasSbAuth) {
      if (isAdminRoute) userRole = 'admin'
      else if (isTeacherRoute) userRole = 'teacher'
      else userRole = 'student'
    }
  }

  // 3. Redirigir a login si no hay sesión válida
  if (!userRole) {
    let targetLogin = '/campus/login'
    if (isAdminRoute) targetLogin = '/admin/login'
    else if (isTeacherRoute) targetLogin = '/login'

    const redirectUrl = new URL(targetLogin, request.url)
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // 4. Redirección automática de la raíz /dashboard y /dashboard/teacher
  if (pathname === '/dashboard') {
    if (userRole === 'admin') return NextResponse.redirect(new URL('/dashboard/admin', request.url))
    if (userRole === 'teacher') return NextResponse.redirect(new URL('/campus/docente', request.url))
    return NextResponse.redirect(new URL('/campus', request.url))
  }

  if (pathname === '/dashboard/teacher') {
    return NextResponse.redirect(new URL('/campus/docente', request.url))
  }

  // 5. Control de Acceso Basado en Roles (RBAC)
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

  return NextResponse.next()
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
