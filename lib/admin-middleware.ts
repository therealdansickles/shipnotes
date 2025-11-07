import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getUser, isAdmin } from './supabase'

export async function requireAdmin(req: NextRequest) {
  try {
    const cookieStore = cookies()
    const userIdCookie = cookieStore.get('userId')

    if (!userIdCookie) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const userId = userIdCookie.value
    const adminCheck = await isAdmin(userId)

    if (!adminCheck) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      )
    }

    const user = await getUser(userId)
    return { user, userId }
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    )
  }
}
