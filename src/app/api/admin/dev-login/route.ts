import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const redirectPath = searchParams.get('redirect') || '/dashboard/admin'

  const targetUrl = new URL(redirectPath, request.url)
  const response = NextResponse.redirect(targetUrl)

  // Asignar cookie de sesión administrativa para desarrollo
  response.cookies.set('ade_user_role', 'admin', {
    path: '/',
    maxAge: 86400 * 7,
    sameSite: 'lax',
    httpOnly: false,
  })

  return response
}
