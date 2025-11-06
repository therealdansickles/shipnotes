import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getSupabase } from '@/lib/supabase'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const userId = cookieStore.get('user_id')?.value

  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const supabase = getSupabase()

    // Delete user's data (CASCADE will delete changelogs and usage)
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId)

    if (error) {
      logger.error('Failed to delete user account', error)
      return NextResponse.json(
        { error: 'Failed to delete account' },
        { status: 500 }
      )
    }

    // Clear cookies
    const response = NextResponse.json({ success: true })
    response.cookies.delete('github_token')
    response.cookies.delete('user_id')

    logger.info('User account deleted', { userId })

    return response
  } catch (error) {
    logger.error('Error deleting user account', error)
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    )
  }
}
