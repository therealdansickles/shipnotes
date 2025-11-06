import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { generateTechnicalChangelog, generateUserFriendlyChangelog } from '@/lib/changelog-generator'
import { createChangelog, trackUsage, getUserUsageCount } from '@/lib/supabase'
import { GitHubCommit } from '@/lib/github'

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const userId = cookieStore.get('user_id')?.value

  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { commits, repoOwner, repoName } = body

    if (!commits || !Array.isArray(commits)) {
      return NextResponse.json({ error: 'Invalid commits data' }, { status: 400 })
    }

    // Check usage limits (trial users get 3 generations)
    const usageCount = await getUserUsageCount(userId, 'generate')

    if (usageCount >= 3) {
      // In production, check subscription status
      return NextResponse.json(
        { error: 'Usage limit reached. Please upgrade to Pro.' },
        { status: 403 }
      )
    }

    // Generate changelogs
    const technicalChangelog = generateTechnicalChangelog(commits as GitHubCommit[])
    const userFriendlyChangelog = await generateUserFriendlyChangelog(commits as GitHubCommit[])

    // Save to database
    await createChangelog({
      user_id: userId,
      repo_name: repoName,
      repo_owner: repoOwner,
      commit_count: commits.length,
      technical_output: technicalChangelog,
      user_output: userFriendlyChangelog,
    })

    // Track usage
    await trackUsage(userId, 'generate')

    return NextResponse.json({
      technical: technicalChangelog,
      userFriendly: userFriendlyChangelog,
      usageCount: usageCount + 1,
      remainingGenerations: 3 - (usageCount + 1),
    })
  } catch (error) {
    console.error('Error generating changelog:', error)
    return NextResponse.json(
      { error: 'Failed to generate changelog' },
      { status: 500 }
    )
  }
}
