import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-middleware'
import { grantManualSubscription } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const authCheck = await requireAdmin(req)
  if (authCheck instanceof NextResponse) {
    return authCheck
  }

  const { userId } = authCheck

  try {
    const body = await req.json()
    const { targetUserId, plan, reason, expiresAt, notes } = body

    if (!targetUserId || !plan || !reason) {
      return NextResponse.json(
        { error: 'Missing required fields: targetUserId, plan, reason' },
        { status: 400 }
      )
    }

    if (!['starter', 'pro'].includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan. Must be "starter" or "pro"' },
        { status: 400 }
      )
    }

    const subscription = await grantManualSubscription(
      targetUserId,
      userId,
      plan,
      reason,
      expiresAt || null,
      notes
    )

    return NextResponse.json(subscription)
  } catch (error) {
    console.error('Grant subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to grant subscription' },
      { status: 500 }
    )
  }
}
