import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-middleware'
import { getAdminStats } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const authCheck = await requireAdmin(req)
  if (authCheck instanceof NextResponse) {
    return authCheck
  }

  try {
    const stats = await getAdminStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
