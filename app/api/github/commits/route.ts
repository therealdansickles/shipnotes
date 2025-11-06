import { NextRequest, NextResponse } from 'next/server'
import { getRepoCommits } from '@/lib/github'
import { cookies } from 'next/headers'
import { rateLimit, rateLimitConfigs, createRateLimitResponse, addRateLimitHeaders } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  // Apply standard rate limiting
  const rateLimitResult = await rateLimit(request, rateLimitConfigs.standard, 'github-commits')

  if (!rateLimitResult.success) {
    return createRateLimitResponse(rateLimitResult)
  }

  const cookieStore = await cookies()
  const token = cookieStore.get('github_token')?.value

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const owner = searchParams.get('owner')
  const repo = searchParams.get('repo')
  const daysParam = searchParams.get('days') || '30'

  // Validate days parameter (1-365 range)
  const days = Math.min(Math.max(parseInt(daysParam), 1), 365)

  if (!owner || !repo) {
    return NextResponse.json({ error: 'Missing owner or repo parameter' }, { status: 400 })
  }

  try {
    const commits = await getRepoCommits(token, owner, repo, days)
    const response = NextResponse.json(commits)
    return addRateLimitHeaders(response, rateLimitResult)
  } catch (error) {
    logger.error('Failed to fetch commits from GitHub', error)
    return NextResponse.json({ error: 'Failed to fetch commits' }, { status: 500 })
  }
}
