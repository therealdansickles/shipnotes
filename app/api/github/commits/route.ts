import { NextRequest, NextResponse } from 'next/server'
import { getRepoCommits } from '@/lib/github'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get('github_token')?.value

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const owner = searchParams.get('owner')
  const repo = searchParams.get('repo')
  const days = parseInt(searchParams.get('days') || '30')

  if (!owner || !repo) {
    return NextResponse.json({ error: 'Missing owner or repo parameter' }, { status: 400 })
  }

  try {
    const commits = await getRepoCommits(token, owner, repo, days)
    return NextResponse.json(commits)
  } catch (error) {
    console.error('Error fetching commits:', error)
    return NextResponse.json({ error: 'Failed to fetch commits' }, { status: 500 })
  }
}
