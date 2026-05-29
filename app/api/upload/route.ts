import { NextRequest, NextResponse } from 'next/server'
import { uploadToS3 } from '@/lib/s3'
import { getSession } from '@/lib/actions/auth'

const ALLOWED_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/aac']
const MAX_SIZE = 50 * 1024 * 1024 // 50 MB

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const form = await request.formData()
  const file = form.get('file') as File | null
  const folder = (form.get('folder') as string | null) ?? 'uploads'

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Only audio files are allowed' }, { status: 400 })
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File exceeds 50 MB limit' }, { status: 400 })
  }

  const ext = file.name.split('.').pop() ?? 'mp3'
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase()
  const key = `${folder}/${Date.now()}-${safeName}`

  const buffer = Buffer.from(await file.arrayBuffer())
  const url = await uploadToS3(buffer, key, file.type)

  return NextResponse.json({ url, key })
}
