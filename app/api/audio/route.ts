import { NextRequest, NextResponse } from 'next/server'
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Readable } from 'stream'

function getClient() {
  return new S3Client({
    endpoint: process.env.AWS_ENDPOINT_URL,
    region: process.env.AWS_DEFAULT_REGION ?? 'auto',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
    forcePathStyle: true,
  })
}

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get('key')
  if (!key) return new NextResponse('Missing key', { status: 400 })

  const range = request.headers.get('range') ?? undefined

  const obj = await getClient().send(new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: key,
    Range: range,
  }))

  const headers: Record<string, string> = {
    'Content-Type': obj.ContentType ?? 'audio/mpeg',
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'public, max-age=31536000',
  }
  if (obj.ContentLength) headers['Content-Length'] = String(obj.ContentLength)
  if (obj.ContentRange)  headers['Content-Range']  = obj.ContentRange

  const nodeStream = obj.Body as Readable
  const webStream = Readable.toWeb(nodeStream) as ReadableStream

  return new NextResponse(webStream, {
    status: range ? 206 : 200,
    headers,
  })
}
