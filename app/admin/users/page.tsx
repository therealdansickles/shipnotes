'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Gift, UserCog } from "lucide-react"
import Link from "next/link"

type User = {
  id: string
  github_username: string
  email: string
  subscription_status: 'trial' | 'pro' | 'expired'
  role?: 'user' | 'admin' | 'super_admin'
  created_at: string
}

type GrantSubModal = {
  userId: string
  username: string
} | null

export default function AdminUsers() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [grantModal, setGrantModal] = useState<GrantSubModal>(null)
  const [grantForm, setGrantForm] = useState({
    plan: 'pro' as 'starter' | 'pro',
    reason: '',
    notes: '',
    expiresAt: ''
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    try {
      const response = await fetch('/api/admin/users')
      if (response.status === 403) {
        setError('Unauthorized - Admin access required')
        return
      }
      if (!response.ok) throw new Error('Failed to fetch users')

      const data = await response.json()
      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  async function handleGrantSubscription(userId: string) {
    try {
      const response = await fetch('/api/admin/subscriptions/grant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId: userId,
          plan: grantForm.plan,
          reason: grantForm.reason,
          notes: grantForm.notes,
          expiresAt: grantForm.expiresAt || null
        })
      })

      if (!response.ok) throw new Error('Failed to grant subscription')

      alert('Subscription granted successfully!')
      setGrantModal(null)
      setGrantForm({ plan: 'pro', reason: '', notes: '', expiresAt: '' })
      fetchUsers()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to grant subscription')
    }
  }

  async function handleUpdateRole(userId: string, newRole: User['role']) {
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      })

      if (!response.ok) throw new Error('Failed to update role')

      alert('Role updated successfully!')
      fetchUsers()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update role')
    }
  }

  const filteredUsers = users.filter(user =>
    user.github_username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark">
        <div className="text-lg">Loading users...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center dark">
        <Card className="p-8 max-w-md">
          <CardHeader>
            <CardTitle className="text-red-500">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => router.push('/')} variant="outline">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen dark bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">User Management</h1>
            <p className="text-muted-foreground">View and manage all ShipNotes users</p>
          </div>
          <Link href="/admin">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search by username or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Users ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Username</th>
                    <th className="text-left p-3">Email</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Role</th>
                    <th className="text-left p-3">Joined</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="border-b hover:bg-accent">
                      <td className="p-3 font-medium">{user.github_username}</td>
                      <td className="p-3 text-sm text-muted-foreground">{user.email}</td>
                      <td className="p-3">
                        <Badge variant={
                          user.subscription_status === 'pro' ? 'default' :
                          user.subscription_status === 'trial' ? 'secondary' :
                          'destructive'
                        }>
                          {user.subscription_status}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <select
                          value={user.role || 'user'}
                          onChange={(e) => handleUpdateRole(user.id, e.target.value as User['role'])}
                          className="bg-background border rounded px-2 py-1 text-sm"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                          <option value="super_admin">Super Admin</option>
                        </select>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setGrantModal({ userId: user.id, username: user.github_username })}
                        >
                          <Gift className="h-3 w-3 mr-1" />
                          Gift Sub
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Grant Subscription Modal */}
        {grantModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="max-w-md w-full mx-4">
              <CardHeader>
                <CardTitle>Grant Subscription to {grantModal.username}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Plan</label>
                  <select
                    value={grantForm.plan}
                    onChange={(e) => setGrantForm({ ...grantForm, plan: e.target.value as 'starter' | 'pro' })}
                    className="w-full bg-background border rounded px-3 py-2"
                  >
                    <option value="starter">Starter ($29/mo)</option>
                    <option value="pro">Pro ($49/mo)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Reason *</label>
                  <Input
                    placeholder="e.g., gift, support, promotion"
                    value={grantForm.reason}
                    onChange={(e) => setGrantForm({ ...grantForm, reason: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Expires At (optional)</label>
                  <Input
                    type="date"
                    value={grantForm.expiresAt}
                    onChange={(e) => setGrantForm({ ...grantForm, expiresAt: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Leave empty for lifetime access</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Notes (optional)</label>
                  <Input
                    placeholder="Additional notes..."
                    value={grantForm.notes}
                    onChange={(e) => setGrantForm({ ...grantForm, notes: e.target.value })}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => handleGrantSubscription(grantModal.userId)}
                    disabled={!grantForm.reason}
                    className="flex-1"
                  >
                    Grant Access
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setGrantModal(null)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
