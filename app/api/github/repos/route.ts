import { NextRequest, NextResponse } from 'next/server'
import { getUserRepos } from '@/lib/github'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get('github_token')?.value

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const repos = await getUserRepos(token)
    return NextResponse.json(repos)
  } catch (error) {
    console.error('Error fetching repos:', error)
    return NextResponse.json({ error: 'Failed to fetch repositories' }, { status: 500 })
  }
}
