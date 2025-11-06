import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getUser } from '@/lib/supabase'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const userId = cookieStore.get('user_id')?.value

  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const user = await getUser(userId)

    return NextResponse.json({
      id: user.id,
      github_username: user.github_username,
      email: user.email,
      avatar_url: user.avatar_url,
      subscription_status: user.subscription_status,
      created_at: user.created_at,
    })
  } catch (error) {
    logger.error('Failed to fetch user from database', error)
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}
