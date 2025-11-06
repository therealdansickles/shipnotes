import { NextRequest, NextResponse } from 'next/server'
import { getUserProfile } from '@/lib/github'
import { getUserByGithubId, createUser } from '@/lib/supabase'
import { rateLimit, rateLimitConfigs, createRateLimitResponse } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  // Apply rate limiting to prevent callback abuse
  const rateLimitResult = await rateLimit(request, rateLimitConfigs.auth, 'auth-callback')

  if (!rateLimitResult.success) {
    // For auth redirects, redirect to home with error
    return NextResponse.redirect(new URL('/?error=rate_limit', request.url))
  }

  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/?error=no_code', request.url))
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (tokenData.error) {
      return NextResponse.redirect(new URL('/?error=oauth_failed', request.url))
    }

    const accessToken = tokenData.access_token

    // Get user profile from GitHub
    const githubUser = await getUserProfile(accessToken)

    // Check if user exists in our database
    let user = await getUserByGithubId(githubUser.id.toString())

    if (!user) {
      // Create new user
      user = await createUser({
        github_id: githubUser.id.toString(),
        github_username: githubUser.login,
        email: githubUser.email || `${githubUser.login}@github.com`,
        avatar_url: githubUser.avatar_url,
        subscription_status: 'trial',
      })
    }

    // In a real app, you'd want to create a session here
    // For MVP, we'll just store the token in a cookie
    const response = NextResponse.redirect(new URL('/dashboard', request.url))

    // Set cookies (in production, use httpOnly and secure cookies)
    response.cookies.set('github_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })

    response.cookies.set('user_id', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
    })

    return response
  } catch (error) {
    logger.error('Authentication failed', error)
    return NextResponse.redirect(new URL('/?error=auth_failed', request.url))
  }
}
