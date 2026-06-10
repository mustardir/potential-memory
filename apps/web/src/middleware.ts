import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = [
  '/dashboard',
  '/wallet',
  '/investments',
  '/transactions',
  '/settings',
  '/admin',
]

const authRoutes = ['/login', '/register']

// iron-session v8 uses a sealed cookie; we decode it in middleware
// by checking for the cookie's presence (full decode happens in API routes)
// For admin gating we rely on the server-side requireAdmin() call in the page.
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = protectedRoutes.some((r) => pathname.startsWith(r))
  const isAuthRoute = authRoutes.some((r) => pathname.startsWith(r))

  // Check for session cookie existence (iron-session sealed cookie)
  const sessionCookie = request.cookies.get('fortress_session')
  const hasSession = !!sessionCookie?.value

  if (isProtected && !hasSession) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthRoute && hasSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
