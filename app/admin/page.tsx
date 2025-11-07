'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Users, FileText, Crown, TrendingUp } from 'lucide-react'
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

export default function AdminPage() {
  const router = useRouter()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)

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
              <CardTitle className="text-sm font-medium">Pro Subscribers</CardTitle>
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
      </div>
    </div>
  )
}
