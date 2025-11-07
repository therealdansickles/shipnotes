import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-middleware'
import { getAllUsers } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const authCheck = await requireAdmin(req)
  if (authCheck instanceof NextResponse) {
    return authCheck
  }

  try {
    const searchParams = req.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    const users = await getAllUsers(limit, offset)
    return NextResponse.json(users)
  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
