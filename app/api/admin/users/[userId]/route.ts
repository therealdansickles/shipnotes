import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getSupabase, getUser } from '@/lib/supabase'

// Admin email addresses - must match the list in stats/route.ts
const ADMIN_EMAILS = [
  '111297543+therealdansickles@users.noreply.github.com',
  'therealdansickles@github.com',
]

type RouteContext = {
  params: Promise<{
    userId: string
  }>
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const cookieStore = await cookies()
    const adminUserId = cookieStore.get('user_id')?.value

    if (!adminUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get admin user from database
    const adminUser = await getUser(adminUserId)
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const isAdmin = ADMIN_EMAILS.includes(adminUser.email)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden - Admin access only' }, { status: 403 })
    }

    const { userId } = await context.params
    const body = await request.json()
    const { subscription_status } = body

    if (!['trial', 'indie', 'starter', 'pro', 'founding', 'expired'].includes(subscription_status)) {
      return NextResponse.json(
        { error: 'Invalid subscription status. Must be trial, indie, starter, pro, founding, or expired' },
        { status: 400 }
      )
    }

    const supabase = getSupabase()

    // Update user subscription status
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({ subscription_status })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
    })
  } catch (error) {
    console.error('Admin update user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
