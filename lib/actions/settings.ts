'use server'
import { revalidatePath } from 'next/cache'
import { compare, hash } from 'bcryptjs'
import { prisma } from '@/lib/db'
import { getSession } from './auth'

export async function getSettings() {
  return prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  })
}

export async function saveSettings(data: {
  siteName: string
  tagline: string
  contactEmail: string
  contactPhone: string
  whatsapp: string
  address: string
}) {
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: data,
    create: { id: 1, ...data },
  })
  revalidatePath('/contact')
  revalidatePath('/admin/settings')
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<{ error?: string }> {
  const session = await getSession()
  if (!session) return { error: 'Not authenticated' }

  const user = await prisma.adminUser.findUnique({ where: { id: session.userId } })
  if (!user) return { error: 'User not found' }

  const valid = await compare(currentPassword, user.passwordHash)
  if (!valid) return { error: 'Current password is incorrect' }

  if (newPassword.length < 8) return { error: 'New password must be at least 8 characters' }

  await prisma.adminUser.update({
    where: { id: session.userId },
    data: { passwordHash: await hash(newPassword, 12) },
  })
  return {}
}
