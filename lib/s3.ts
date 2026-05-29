import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'

export function getClient() {
  const endpoint = process.env.AWS_ENDPOINT_URL
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
  const region = process.env.AWS_DEFAULT_REGION ?? 'auto'

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error('Missing S3 env vars: AWS_ENDPOINT_URL, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY')
  }

  return new S3Client({
    endpoint,
    region,
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: true,
    // Tigris (and many S3-compatible services) return 501 on checksum headers
    // that the AWS SDK v3 adds by default. Disable them.
    requestChecksumCalculation: 'WHEN_REQUIRED',
    responseChecksumValidation: 'WHEN_REQUIRED',
  })
}

export function getBucket() {
  const bucket = process.env.AWS_S3_BUCKET_NAME
  if (!bucket) throw new Error('Missing S3 env var: AWS_S3_BUCKET_NAME')
  return bucket
}

export function getPublicUrl(key: string) {
  return `/api/audio?key=${encodeURIComponent(key)}`
}

export async function uploadToS3(buffer: Buffer, key: string, contentType: string) {
  await getClient().send(new PutObjectCommand({
    Bucket: getBucket(),
    Key: key,
    Body: buffer,
    ContentType: contentType,
  }))
  return getPublicUrl(key)
}

export async function getFromS3(key: string, range?: string) {
  return getClient().send(new GetObjectCommand({
    Bucket: getBucket(),
    Key: key,
    Range: range,
  }))
}

export async function deleteFromS3(key: string) {
  await getClient().send(new DeleteObjectCommand({ Bucket: getBucket(), Key: key }))
}
