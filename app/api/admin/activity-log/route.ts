import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-middleware'
import { getAdminActivityLog } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const authCheck = await requireAdmin(req)
  if (authCheck instanceof NextResponse) {
    return authCheck
  }

  try {
    const searchParams = req.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '50')

    const activityLog = await getAdminActivityLog(limit)
    return NextResponse.json(activityLog)
  } catch (error) {
    console.error('Get activity log error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activity log' },
      { status: 500 }
    )
  }
}
