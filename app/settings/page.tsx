'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, ArrowLeft, Trash2, Crown, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UpgradeButton } from '@/components/ui/upgrade-button'

type User = {
  id: string
  github_username: string
  email: string
  avatar_url?: string
  subscription_status: 'trial' | 'pro' | 'expired'
  created_at: string
}

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/user')

      if (response.status === 401) {
        router.push('/')
        return
      }

      const data = await response.json()
      setUser(data)
    } catch (error) {
      console.error('Error fetching user:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true)
      return
    }

    setDeleting(true)

    try {
      const response = await fetch('/api/user/delete', {
        method: 'POST',
      })

      if (response.ok) {
        // Redirect to home page
        router.push('/?deleted=true')
      } else {
        alert('Failed to delete account. Please try again or contact support.')
        setDeleting(false)
      }
    } catch (error) {
      console.error('Error deleting account:', error)
      alert('Failed to delete account. Please try again or contact support.')
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen dark flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen dark">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6" />
            <span className="text-xl font-bold">ShipNotes</span>
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-8">Account Settings</h1>

        {/* Profile Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your account information from GitHub</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              {user.avatar_url && (
                <img
                  src={user.avatar_url}
                  alt={user.github_username}
                  className="h-16 w-16 rounded-full"
                />
              )}
              <div>
                <p className="font-semibold text-lg">{user.github_username}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Member since: {new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>Manage your ShipNotes subscription</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {user.subscription_status === 'pro' ? (
                    <>
                      <Crown className="h-5 w-5 text-yellow-500" />
                      <span className="font-semibold text-lg">ShipNotes Pro</span>
                    </>
                  ) : (
                    <span className="font-semibold text-lg">Free Trial</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {user.subscription_status === 'pro'
                    ? 'Unlimited changelog generations'
                    : 'Limited to 3 changelog generations'}
                </p>
              </div>
              {user.subscription_status !== 'pro' && (
                <UpgradeButton />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Irreversible actions that affect your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Delete Account</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Permanently delete your ShipNotes account and all associated data. This action cannot be undone.
                </p>
                <ul className="text-sm text-muted-foreground mb-4 space-y-1 list-disc pl-5">
                  <li>All your generated changelogs will be permanently deleted</li>
                  <li>Your usage history will be removed</li>
                  <li>Your subscription will be cancelled (if applicable)</li>
                  <li>You will be signed out immediately</li>
                </ul>

                {!showDeleteConfirm ? (
                  <Button
                    variant="destructive"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Account
                  </Button>
                ) : (
                  <div className="border border-destructive rounded-lg p-4 bg-destructive/10">
                    <p className="font-semibold mb-3 text-destructive">
                      Are you absolutely sure?
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      This will permanently delete your account and all data. This action cannot be undone.
                    </p>
                    <div className="flex gap-3">
                      <Button
                        variant="destructive"
                        onClick={handleDeleteAccount}
                        disabled={deleting}
                        className="gap-2"
                      >
                        {deleting ? (
                          <>
                            <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4" />
                            Yes, delete my account
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowDeleteConfirm(false)}
                        disabled={deleting}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Need help? <Link href="/support" className="text-primary hover:underline">Contact Support</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
