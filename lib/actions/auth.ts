'use server'
import { compare } from 'bcryptjs'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { prisma } from '@/lib/db'
import { createSession, destroySession, getSession } from '@/lib/auth'
import { loginLimiter } from '@/lib/ratelimit'

export async function login(username: string, password: string): Promise<{ error?: string }> {
  if (loginLimiter) {
    const headerStore = await headers()
    const ip = headerStore.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'anonymous'
    const { success } = await loginLimiter.limit(ip)
    if (!success) return { error: 'Too many login attempts. Please wait 15 minutes and try again.' }
  }

  const user = await prisma.adminUser.findUnique({ where: { username } })
  if (!user) return { error: 'Invalid username or password' }

  const valid = await compare(password, user.passwordHash)
  if (!valid) return { error: 'Invalid username or password' }

  await createSession({ userId: user.id, username: user.username, name: user.name, role: user.role })
  return {}
}

export async function logout() {
  await destroySession()
  redirect('/admin/login')
}

export { getSession }
