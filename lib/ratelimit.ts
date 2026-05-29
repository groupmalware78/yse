import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  return new Redis({ url, token })
}

function makeRatelimit(requests: number, window: `${number} ${'s' | 'm' | 'h' | 'd'}`) {
  const redis = getRedis()
  if (!redis) return null
  return new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(requests, window) })
}

// 3 contact form submissions per IP per 10 minutes
export const contactLimiter = makeRatelimit(3, '10 m')

// 5 newsletter subscribe attempts per IP per hour
export const newsletterLimiter = makeRatelimit(5, '1 h')

// 5 login attempts per IP per 15 minutes
export const loginLimiter = makeRatelimit(5, '15 m')
