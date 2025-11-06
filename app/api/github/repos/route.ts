import { NextRequest, NextResponse } from 'next/server'
import { getUserRepos } from '@/lib/github'
import { cookies } from 'next/headers'
import { rateLimit, rateLimitConfigs, createRateLimitResponse, addRateLimitHeaders } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  // Apply standard rate limiting
  const rateLimitResult = await rateLimit(request, rateLimitConfigs.standard, 'github-repos')

  if (!rateLimitResult.success) {
    return createRateLimitResponse(rateLimitResult)
  }

  const cookieStore = await cookies()
  const token = cookieStore.get('github_token')?.value

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const repos = await getUserRepos(token)
    const response = NextResponse.json(repos)
    return addRateLimitHeaders(response, rateLimitResult)
  } catch (error) {
    logger.error('Failed to fetch repositories from GitHub', error)
    return NextResponse.json({ error: 'Failed to fetch repositories' }, { status: 500 })
  }
}
