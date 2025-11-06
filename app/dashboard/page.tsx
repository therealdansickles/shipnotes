'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UpgradeButton } from '@/components/ui/upgrade-button'
import { Sparkles, Star, GitBranch, Clock, Search, Crown } from 'lucide-react'
import Link from 'next/link'

type Repo = {
  id: number
  name: string
  full_name: string
  owner: {
    login: string
    avatar_url: string
  }
  description: string | null
  stargazers_count: number
  updated_at: string
  private: boolean
}

type User = {
  id: string
  github_username: string
  email: string
  subscription_status: 'trial' | 'pro' | 'expired'
}

export default function Dashboard() {
  const [repos, setRepos] = useState<Repo[]>([])
  const [filteredRepos, setFilteredRepos] = useState<Repo[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    fetchRepos()
    fetchUser()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = repos.filter(repo =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredRepos(filtered)
    } else {
      setFilteredRepos(repos)
    }
  }, [searchQuery, repos])

  const fetchRepos = async () => {
    try {
      const response = await fetch('/api/github/repos')

      if (response.status === 401) {
        window.location.href = '/'
        return
      }

      const data = await response.json()
      setRepos(data)
      setFilteredRepos(data)
    } catch (error) {
      console.error('Error fetching repos:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/user')

      if (response.ok) {
        const data = await response.json()
        setUser(data)
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      'day'
    )
  }

  return (
    <div className="min-h-screen dark">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80">
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="text-lg sm:text-xl font-bold">ShipNotes</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/settings" className="text-sm text-muted-foreground hover:text-foreground hidden sm:block">
              Settings
            </Link>
            {user?.subscription_status === 'pro' ? (
              <div className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/50 px-2 sm:px-4 py-1 sm:py-2 rounded-lg">
                <Crown className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
                <span className="text-xs sm:text-sm font-semibold text-yellow-500">Pro</span>
              </div>
            ) : (
              <UpgradeButton variant="default" size="sm" />
            )}
          </div>
        </div>

        {/* Title & Search */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-1 sm:mb-2">Your Repositories</h1>
          <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
            Select a repository to generate a changelog
          </p>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading your repositories...</p>
          </div>
        )}

        {/* Repos Grid */}
        {!loading && filteredRepos.length === 0 && (
          <Card className="p-12 text-center">
            <CardContent>
              <p className="text-muted-foreground">
                {searchQuery ? 'No repositories found matching your search.' : 'No repositories found.'}
              </p>
            </CardContent>
          </Card>
        )}

        {!loading && filteredRepos.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRepos.map((repo) => (
              <Link
                key={repo.id}
                href={`/repo/${repo.owner.login}/${repo.name}`}
              >
                <Card className="h-full hover:border-primary transition-all hover:shadow-lg cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <GitBranch className="h-5 w-5 text-muted-foreground" />
                        <CardTitle className="text-lg">{repo.name}</CardTitle>
                      </div>
                      {repo.private && (
                        <span className="text-xs bg-accent px-2 py-1 rounded">Private</span>
                      )}
                    </div>
                    <CardDescription className="line-clamp-2">
                      {repo.description || 'No description available'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        <span>{repo.stargazers_count}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Updated {formatDate(repo.updated_at)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
