'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Users, FileText, Crown, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

type AdminStats = {
  totalUsers: number
  totalChangelogs: number
  proUsers: number
  freeUsers: number
  changelogsToday: number
  changelogsThisWeek: number
  changelogsThisMonth: number
}

type UserData = {
  id: string
  github_username: string
  email: string
  avatar_url?: string
  subscription_status: 'trial' | 'starter' | 'pro' | 'expired'
  created_at: string
  changelog_count: number
}

export default function AdminPage() {
  const router = useRouter()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [users, setUsers] = useState<UserData[]>([])
  const [usersExpanded, setUsersExpanded] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null)

  useEffect(() => {
    fetchAdminStats()
  }, [])

  const fetchAdminStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')

      if (response.status === 401) {
        router.push('/')
        return
      }

      if (response.status === 403) {
        const data = await response.json()
        setError('You do not have admin access')
        setDebugInfo(data)
        return
      }

      if (response.ok) {
        const data = await response.json()
        setStats(data)
        setIsAdmin(true)
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error)
      setError('Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    setLoadingUsers(true)
    try {
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoadingUsers(false)
    }
  }

  const updateUserSubscription = async (userId: string, newStatus: 'trial' | 'starter' | 'pro' | 'expired') => {
    setUpdatingUserId(userId)
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscription_status: newStatus }),
      })

      if (response.ok) {
        // Update local state
        setUsers(users.map(user =>
          user.id === userId
            ? { ...user, subscription_status: newStatus }
            : user
        ))
        // Refresh stats to reflect changes
        fetchAdminStats()
      }
    } catch (error) {
      console.error('Error updating user subscription:', error)
    } finally {
      setUpdatingUserId(null)
    }
  }

  const toggleUsersExpanded = () => {
    if (!usersExpanded && users.length === 0) {
      fetchUsers()
    }
    setUsersExpanded(!usersExpanded)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pro':
        return 'bg-yellow-500/20 text-yellow-500'
      case 'starter':
        return 'bg-green-500/20 text-green-500'
      case 'trial':
        return 'bg-blue-500/20 text-blue-500'
      case 'expired':
        return 'bg-red-500/20 text-red-500'
      default:
        return 'bg-gray-500/20 text-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen dark flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen dark flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader>
            <CardTitle className="text-red-500">Admin Access Denied</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {debugInfo && (
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-semibold">Your Email:</p>
                  <p className="text-sm text-muted-foreground font-mono bg-accent p-2 rounded">
                    {debugInfo.userEmail || 'Not found'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold">Required Admin Emails:</p>
                  <div className="text-sm text-muted-foreground font-mono bg-accent p-2 rounded">
                    {debugInfo.adminEmails?.map((email: string) => (
                      <div key={email}>{email}</div>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Make sure your GitHub email matches one of the admin emails above.
                </p>
              </div>
            )}
            <Link href="/dashboard">
              <Button className="w-full">Go to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen dark">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <Image src="/shipnotes-icon.png" alt="ShipNotes" width={24} height={24} className="h-6 w-6" />
            <span className="text-xl font-bold">ShipNotes Admin</span>
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats?.proUsers || 0} Pro • {stats?.freeUsers || 0} Free
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Changelogs</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalChangelogs || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                All time generations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
              <Crown className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.proUsers || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                ${((stats?.proUsers || 0) * 29).toLocaleString()} MRR
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.changelogsThisMonth || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Changelogs generated
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Activity Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Today</CardTitle>
              <CardDescription>Changelog generations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.changelogsToday || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>This Week</CardTitle>
              <CardDescription>Changelog generations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.changelogsThisWeek || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>This Month</CardTitle>
              <CardDescription>Changelog generations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.changelogsThisMonth || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Admin tools and utilities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
              <Link href="/dashboard">
                <Button variant="outline" className="w-full justify-start">
                  View Dashboard
                </Button>
              </Link>
              <Link href="/settings">
                <Button variant="outline" className="w-full justify-start">
                  Settings
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Users Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Users</CardTitle>
                <CardDescription>Manage user subscriptions and view activity</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleUsersExpanded}
                disabled={loadingUsers}
              >
                {loadingUsers ? (
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                ) : usersExpanded ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-2" />
                    Collapse
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-2" />
                    Expand
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          {usersExpanded && (
            <CardContent>
              {users.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No users found
                </div>
              ) : (
                <div className="space-y-4">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border rounded-lg bg-accent/50"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {user.avatar_url ? (
                          <Image
                            src={user.avatar_url}
                            alt={user.github_username}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">{user.github_username}</p>
                          <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeColor(user.subscription_status)}`}>
                              {user.subscription_status.toUpperCase()}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {user.changelog_count} changelogs
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Joined {formatDate(user.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto flex-wrap">
                        <Button
                          size="sm"
                          variant={user.subscription_status === 'trial' ? 'default' : 'outline'}
                          onClick={() => updateUserSubscription(user.id, 'trial')}
                          disabled={updatingUserId === user.id || user.subscription_status === 'trial'}
                          className="flex-1 sm:flex-none"
                        >
                          Trial
                        </Button>
                        <Button
                          size="sm"
                          variant={user.subscription_status === 'starter' ? 'default' : 'outline'}
                          onClick={() => updateUserSubscription(user.id, 'starter')}
                          disabled={updatingUserId === user.id || user.subscription_status === 'starter'}
                          className="flex-1 sm:flex-none"
                        >
                          Starter
                        </Button>
                        <Button
                          size="sm"
                          variant={user.subscription_status === 'pro' ? 'default' : 'outline'}
                          onClick={() => updateUserSubscription(user.id, 'pro')}
                          disabled={updatingUserId === user.id || user.subscription_status === 'pro'}
                          className="flex-1 sm:flex-none"
                        >
                          Pro
                        </Button>
                        <Button
                          size="sm"
                          variant={user.subscription_status === 'expired' ? 'default' : 'outline'}
                          onClick={() => updateUserSubscription(user.id, 'expired')}
                          disabled={updatingUserId === user.id || user.subscription_status === 'expired'}
                          className="flex-1 sm:flex-none"
                        >
                          Expired
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
