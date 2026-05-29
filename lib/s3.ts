import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

function getClient() {
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
  })
}

function getBucket() {
  const bucket = process.env.AWS_S3_BUCKET_NAME
  if (!bucket) throw new Error('Missing S3 env var: AWS_S3_BUCKET_NAME')
  return bucket
}

export function getPublicUrl(key: string) {
  const endpoint = process.env.AWS_ENDPOINT_URL
  const bucket = process.env.AWS_S3_BUCKET_NAME
  return `${endpoint}/${bucket}/${key}`
}

export async function uploadToS3(buffer: Buffer, key: string, contentType: string) {
  const client = getClient()
  const bucket = getBucket()

  await client.send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  }))

  return getPublicUrl(key)
}

export async function deleteFromS3(key: string) {
  const client = getClient()
  await client.send(new DeleteObjectCommand({ Bucket: getBucket(), Key: key }))
}
