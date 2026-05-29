import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SignJWT, jwtVerify } from 'jose'
import { SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/auth'

function getSecret() {
  const secret = process.env.AUTH_SECRET
  if (!secret) return null
  return new TextEncoder().encode(secret)
}

// Verifies the token and returns a refreshed one; null if invalid
async function verifyAndRefresh(token: string): Promise<string | null> {
  const secret = getSecret()
  if (!secret) return null
  try {
    const { payload } = await jwtVerify(token, secret)
    // Re-sign with a fresh expiry — sliding window
    const newToken = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(`${SESSION_MAX_AGE}s`)
      .sign(secret)
    return newToken
  } catch {
    return null
  }
}

function cookieOpts(maxAge = SESSION_MAX_AGE) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge,
    path: '/',
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(SESSION_COOKIE)?.value

  // /admin redirect
  if (pathname === '/admin') {
    const newToken = token ? await verifyAndRefresh(token) : null
    const dest = new URL(newToken ? '/admin/dashboard' : '/admin/login', request.url)
    const res = NextResponse.redirect(dest)
    if (newToken) res.cookies.set(SESSION_COOKIE, newToken, cookieOpts())
    return res
  }

  // Protect all other /admin routes
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const newToken = token ? await verifyAndRefresh(token) : null
    if (!newToken) {
      const url = new URL('/admin/login', request.url)
      url.searchParams.set('from', pathname)
      return NextResponse.redirect(url)
    }
    const response = NextResponse.next()
    response.cookies.set(SESSION_COOKIE, newToken, cookieOpts())
    response.headers.set('x-pathname', pathname)
    return response
  }

  // Redirect logged-in users away from login page
  if (pathname === '/admin/login' && token) {
    const newToken = await verifyAndRefresh(token)
    if (newToken) {
      const res = NextResponse.redirect(new URL('/admin/dashboard', request.url))
      res.cookies.set(SESSION_COOKIE, newToken, cookieOpts())
      return res
    }
  }

  const response = NextResponse.next()
  response.headers.set('x-pathname', pathname)
  return response
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
