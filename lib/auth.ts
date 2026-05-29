import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

export const SESSION_COOKIE = 'yse_session'
export const SESSION_MAX_AGE = 15 * 60 // 15 minutes in seconds

function getSecret() {
  const secret = process.env.AUTH_SECRET
  if (!secret) throw new Error('AUTH_SECRET env var is not set')
  return new TextEncoder().encode(secret)
}

export interface SessionPayload {
  userId: number
  username: string
  name: string
  role: string
}

export function cookieOptions(maxAge = SESSION_MAX_AGE) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge,
    path: '/',
  }
}

export async function signToken(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret())
}

export async function createSession(payload: SessionPayload) {
  const token = await signToken(payload)
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, cookieOptions())
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, getSecret())
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}

export async function destroySession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

// Used by middleware — verifies the token and issues a fresh one for sliding expiration
export async function verifyAndRefresh(token: string): Promise<{ payload: SessionPayload; newToken: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    const sessionPayload = payload as unknown as SessionPayload
    const newToken = await signToken(sessionPayload)
    return { payload: sessionPayload, newToken }
  } catch {
    return null
  }
}
