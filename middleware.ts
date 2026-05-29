import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const SESSION_COOKIE = 'yse_session'

function getSecret() {
  const secret = process.env.AUTH_SECRET
  if (!secret) return null
  return new TextEncoder().encode(secret)
}

async function isValidSession(token: string): Promise<boolean> {
  const secret = getSecret()
  if (!secret) return false
  try {
    await jwtVerify(token, secret)
    return true
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(SESSION_COOKIE)?.value

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const valid = token ? await isValidSession(token) : false
    if (!valid) {
      const url = new URL('/admin/login', request.url)
      url.searchParams.set('from', pathname)
      return NextResponse.redirect(url)
    }
  }

  if (pathname === '/admin') {
    const valid = token ? await isValidSession(token) : false
    return NextResponse.redirect(
      new URL(valid ? '/admin/dashboard' : '/admin/login', request.url)
    )
  }

  if (pathname === '/admin/login' && token) {
    const valid = await isValidSession(token)
    if (valid) return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  const response = NextResponse.next()
  response.headers.set('x-pathname', pathname)
  return response
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
