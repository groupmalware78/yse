import { NextRequest, NextResponse } from 'next/server'
import { getFromS3 } from '@/lib/s3'
import { Readable } from 'stream'

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get('key')
  if (!key) return new NextResponse('Missing key', { status: 400 })

  const range = request.headers.get('range') ?? undefined
  const obj = await getFromS3(key, range)

  const headers: Record<string, string> = {
    'Content-Type': obj.ContentType ?? 'audio/mpeg',
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'public, max-age=31536000',
  }
  if (obj.ContentLength) headers['Content-Length'] = String(obj.ContentLength)
  if (obj.ContentRange)  headers['Content-Range']  = obj.ContentRange

  const webStream = Readable.toWeb(obj.Body as Readable) as ReadableStream

  return new NextResponse(webStream, {
    status: range ? 206 : 200,
    headers,
  })
}
