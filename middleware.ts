import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('yse_admin')?.value

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!token || !isValidToken(token)) {
      const url = new URL('/admin/login', request.url)
      url.searchParams.set('from', pathname)
      return NextResponse.redirect(url)
    }
  }

  // Redirect root /admin to dashboard if already logged in
  if (pathname === '/admin') {
    if (token && isValidToken(token)) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // If already logged in and trying to access login, redirect to dashboard
  if (pathname === '/admin/login' && token && isValidToken(token)) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return NextResponse.next()
}

function isValidToken(token: string): boolean {
  try {
    const decoded = atob(token)
    const [, , ts] = decoded.split(':')
    const issued = parseInt(ts, 10)
    // Token expires after 8 hours
    return Date.now() - issued < 8 * 60 * 60 * 1000
  } catch {
    return false
  }
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
