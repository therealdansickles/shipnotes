import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, rateLimitConfigs, createRateLimitResponse } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  // Apply rate limiting to prevent auth abuse
  const rateLimitResult = await rateLimit(request, rateLimitConfigs.auth, 'auth-github')

  if (!rateLimitResult.success) {
    return createRateLimitResponse(rateLimitResult)
  }

  const clientId = process.env.GITHUB_CLIENT_ID

  if (!clientId) {
    return NextResponse.json({ error: 'GitHub OAuth not configured' }, { status: 500 })
  }

  const redirectUri = `${request.nextUrl.origin}/api/auth/callback`
  const scope = 'read:user user:email repo'

  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`

  return NextResponse.redirect(githubAuthUrl)
}
