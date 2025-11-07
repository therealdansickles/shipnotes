import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-middleware'
import { updateUserRole, logAdminActivity } from '@/lib/supabase'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authCheck = await requireAdmin(req)
  if (authCheck instanceof NextResponse) {
    return authCheck
  }

  const { userId } = authCheck

  try {
    const body = await req.json()
    const { role } = body

    if (!role || !['user', 'admin', 'super_admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      )
    }

    const { id } = await params
    const updatedUser = await updateUserRole(id, role)

    await logAdminActivity(userId, 'update_role', id, {
      new_role: role
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Update role error:', error)
    return NextResponse.json(
      { error: 'Failed to update user role' },
      { status: 500 }
    )
  }
}
