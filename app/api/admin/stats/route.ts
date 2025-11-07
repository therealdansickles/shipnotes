import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getSupabase, getUser } from '@/lib/supabase'

// Admin email addresses - add your email here
const ADMIN_EMAILS = [
  '111297543+therealdansickles@users.noreply.github.com',
  'therealdansickles@github.com', // Also allow the current email
  // Add more admin emails as needed
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
      return NextResponse.json({
        error: 'Forbidden - Admin access only',
        userEmail: user.email,
        adminEmails: ADMIN_EMAILS
      }, { status: 403 })
    }

    const supabase = getSupabase()

    // Fetch stats
    // Total users
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    // Indie users
    const { count: indieUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('subscription_status', 'indie')

    // Starter users
    const { count: starterUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('subscription_status', 'starter')

    // Pro users
    const { count: proUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('subscription_status', 'pro')

    const paidUsers = (indieUsers || 0) + (starterUsers || 0) + (proUsers || 0)
    const freeUsers = (totalUsers || 0) - paidUsers

    // Total changelogs
    const { count: totalChangelogs } = await supabase
      .from('changelogs')
      .select('*', { count: 'exact', head: true })

    // Get today's date range
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const { count: changelogsToday } = await supabase
      .from('changelogs')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString())
      .lt('created_at', tomorrow.toISOString())

    // Get this week's date range
    const weekStart = new Date(today)
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())

    const { count: changelogsThisWeek } = await supabase
      .from('changelogs')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', weekStart.toISOString())

    // Get this month's date range
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)

    const { count: changelogsThisMonth } = await supabase
      .from('changelogs')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', monthStart.toISOString())

    return NextResponse.json({
      totalUsers: totalUsers || 0,
      totalChangelogs: totalChangelogs || 0,
      indieUsers: indieUsers || 0,
      starterUsers: starterUsers || 0,
      proUsers: proUsers || 0,
      freeUsers,
      changelogsToday: changelogsToday || 0,
      changelogsThisWeek: changelogsThisWeek || 0,
      changelogsThisMonth: changelogsThisMonth || 0,
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
