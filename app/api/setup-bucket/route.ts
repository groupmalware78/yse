import { NextResponse } from 'next/server'
import { configureBucket } from '@/lib/s3'
import { getSession } from '@/lib/actions/auth'

export async function POST() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await configureBucket()
  return NextResponse.json({ ok: true, message: 'Bucket CORS and public-read policy applied.' })
}
