'use server'
import { compare } from 'bcryptjs'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { createSession, destroySession, getSession } from '@/lib/auth'

export async function login(username: string, password: string): Promise<{ error?: string }> {
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
