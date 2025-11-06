import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const clientId = process.env.GITHUB_CLIENT_ID

  if (!clientId) {
    return NextResponse.json({ error: 'GitHub OAuth not configured' }, { status: 500 })
  }

  const redirectUri = `${request.nextUrl.origin}/api/auth/callback`
  const scope = 'read:user user:email repo'

  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`

  return NextResponse.redirect(githubAuthUrl)
}
