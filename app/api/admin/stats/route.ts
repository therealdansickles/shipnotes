import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import clientPromise from '@/lib/mongodb'

// Admin email addresses - add your email here
const ADMIN_EMAILS = [
  'dansickles@gmail.com',
  // Add more admin emails as needed
]

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('session_token')?.value

    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)

    // Get user from session
    const session = await db.collection('sessions').findOne({ session_token: sessionToken })
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await db.collection('users').findOne({ github_id: session.github_id })
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const isAdmin = ADMIN_EMAILS.includes(user.email)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden - Admin access only' }, { status: 403 })
    }

    // Fetch stats
    const totalUsers = await db.collection('users').countDocuments()
    const proUsers = await db.collection('users').countDocuments({ is_pro: true })
    const freeUsers = totalUsers - proUsers

    const changelogCollection = db.collection('changelogs')
    const totalChangelogs = await changelogCollection.countDocuments()

    // Get today's date range
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const changelogsToday = await changelogCollection.countDocuments({
      created_at: { $gte: today, $lt: tomorrow }
    })

    // Get this week's date range
    const weekStart = new Date(today)
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())
    const changelogsThisWeek = await changelogCollection.countDocuments({
      created_at: { $gte: weekStart }
    })

    // Get this month's date range
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
    const changelogsThisMonth = await changelogCollection.countDocuments({
      created_at: { $gte: monthStart }
    })

    return NextResponse.json({
      totalUsers,
      totalChangelogs,
      proUsers,
      freeUsers,
      changelogsToday,
      changelogsThisWeek,
      changelogsThisMonth,
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
