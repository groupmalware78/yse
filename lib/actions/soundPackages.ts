'use server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'

const isSQLite = process.env.DATABASE_URL?.startsWith('file:') ?? false
const serializeArr = (v: string[]) => isSQLite ? JSON.stringify(v) as unknown as string[] : v

export async function createSoundPackage(data: {
  name: string
  tagline: string
  priceRange: string
  capacity: string
  duration: string
  features: string[]
  popular?: boolean
  color?: string
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await prisma.soundPackage.create({ data: { ...data, features: serializeArr(data.features) } as any })
  revalidatePath('/admin/sound-system')
  revalidatePath('/sound-system')
}

export async function updateSoundPackage(id: number, data: Partial<{
  name: string
  tagline: string
  priceRange: string
  capacity: string
  duration: string
  features: string[]
  popular: boolean
  color: string
}>) {
  const payload = data.features !== undefined ? { ...data, features: serializeArr(data.features) } : data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await prisma.soundPackage.update({ where: { id }, data: payload as any })
  revalidatePath('/admin/sound-system')
  revalidatePath('/sound-system')
}

export async function deleteSoundPackage(id: number) {
  await prisma.soundPackage.delete({ where: { id } })
  revalidatePath('/admin/sound-system')
  revalidatePath('/sound-system')
}
