import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory rate limiter
// For production with multiple instances, consider using Upstash Redis
type RateLimitStore = Map<string, { count: number; resetTime: number }>

const stores: Record<string, RateLimitStore> = {}

export type RateLimitConfig = {
  interval: number // Time window in milliseconds
  uniqueTokenPerInterval: number // Max requests per interval
}

export const rateLimitConfigs = {
  // Expensive operations (uses OpenAI API)
  strict: {
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 5, // 5 requests per minute
  },
  // Auth endpoints
  auth: {
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 10, // 10 requests per minute
  },
  // General API endpoints
  standard: {
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 30, // 30 requests per minute
  },
}

function getStore(name: string): RateLimitStore {
  if (!stores[name]) {
    stores[name] = new Map()
  }
  return stores[name]
}

function getIdentifier(request: NextRequest): string {
  // Use IP address as identifier
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown'

  // Also include user agent to prevent simple IP rotation
  const userAgent = request.headers.get('user-agent') || ''

  return `${ip}:${userAgent.substring(0, 50)}`
}

export async function rateLimit(
  request: NextRequest,
  config: RateLimitConfig,
  storeName: string = 'default'
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  const identifier = getIdentifier(request)
  const store = getStore(storeName)

  const now = Date.now()
  const tokenData = store.get(identifier)

  // Clean up old entries periodically (every 100 requests)
  if (Math.random() < 0.01) {
    for (const [key, value] of store.entries()) {
      if (value.resetTime < now) {
        store.delete(key)
      }
    }
  }

  if (!tokenData || tokenData.resetTime < now) {
    // New window
    store.set(identifier, {
      count: 1,
      resetTime: now + config.interval,
    })
    return {
      success: true,
      limit: config.uniqueTokenPerInterval,
      remaining: config.uniqueTokenPerInterval - 1,
      reset: now + config.interval,
    }
  }

  if (tokenData.count >= config.uniqueTokenPerInterval) {
    // Rate limit exceeded
    return {
      success: false,
      limit: config.uniqueTokenPerInterval,
      remaining: 0,
      reset: tokenData.resetTime,
    }
  }

  // Increment count
  tokenData.count++
  store.set(identifier, tokenData)

  return {
    success: true,
    limit: config.uniqueTokenPerInterval,
    remaining: config.uniqueTokenPerInterval - tokenData.count,
    reset: tokenData.resetTime,
  }
}

export function createRateLimitResponse(
  result: { success: boolean; limit: number; remaining: number; reset: number }
): NextResponse {
  const response = NextResponse.json(
    {
      error: 'Too many requests. Please try again later.',
      retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
    },
    { status: 429 }
  )

  response.headers.set('X-RateLimit-Limit', result.limit.toString())
  response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
  response.headers.set('X-RateLimit-Reset', result.reset.toString())
  response.headers.set('Retry-After', Math.ceil((result.reset - Date.now()) / 1000).toString())

  return response
}

// Helper to add rate limit headers to successful responses
export function addRateLimitHeaders(
  response: NextResponse,
  result: { limit: number; remaining: number; reset: number }
): NextResponse {
  response.headers.set('X-RateLimit-Limit', result.limit.toString())
  response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
  response.headers.set('X-RateLimit-Reset', result.reset.toString())
  return response
}
