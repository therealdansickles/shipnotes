import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getSupabase, getUser } from '@/lib/supabase'

// Admin email addresses - must match the list in stats/route.ts
const ADMIN_EMAILS = [
  '111297543+therealdansickles@users.noreply.github.com',
  'therealdansickles@github.com',
]

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('user_id')?.value

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user from database
    const user = await getUser(userId)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const isAdmin = ADMIN_EMAILS.includes(user.email)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden - Admin access only' }, { status: 403 })
    }

    const supabase = getSupabase()

    // Fetch all users with their changelog counts
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    // Get changelog counts for each user
    const usersWithStats = await Promise.all(
      (users || []).map(async (user) => {
        const { count: changelogCount } = await supabase
          .from('changelogs')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)

        return {
          ...user,
          changelog_count: changelogCount || 0,
        }
      })
    )

    return NextResponse.json({ users: usersWithStats })
  } catch (error) {
    console.error('Admin users list error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
