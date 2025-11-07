import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-middleware'
import { revokeManualSubscription } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const authCheck = await requireAdmin(req)
  if (authCheck instanceof NextResponse) {
    return authCheck
  }

  const { userId } = authCheck

  try {
    const body = await req.json()
    const { subscriptionId } = body

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Missing subscriptionId' },
        { status: 400 }
      )
    }

    const subscription = await revokeManualSubscription(subscriptionId, userId)

    return NextResponse.json(subscription)
  } catch (error) {
    console.error('Revoke subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to revoke subscription' },
      { status: 500 }
    )
  }
}
