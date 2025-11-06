'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles, ArrowLeft, GitCommit, Copy, Download, Check } from 'lucide-react'
import Link from 'next/link'

type Commit = {
  sha: string
  commit: {
    message: string
    author: {
      name: string
      date: string
    }
  }
}

export default function RepoPage() {
  const params = useParams()
  const router = useRouter()
  const owner = params.owner as string
  const name = params.name as string

  const [commits, setCommits] = useState<Commit[]>([])
  const [selectedCommits, setSelectedCommits] = useState<Commit[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [technicalChangelog, setTechnicalChangelog] = useState('')
  const [userFriendlyChangelog, setUserFriendlyChangelog] = useState('')
  const [copiedTech, setCopiedTech] = useState(false)
  const [copiedUser, setCopiedUser] = useState(false)
  const [remainingGenerations, setRemainingGenerations] = useState(3)

  useEffect(() => {
    fetchCommits()
  }, [])

  useEffect(() => {
    // Auto-select all commits initially
    if (commits.length > 0 && selectedCommits.length === 0) {
      setSelectedCommits(commits)
    }
  }, [commits])

  const fetchCommits = async () => {
    try {
      const response = await fetch(`/api/github/commits?owner=${owner}&repo=${name}&days=30`)

      if (response.status === 401) {
        router.push('/')
        return
      }

      const data = await response.json()
      setCommits(data)
    } catch (error) {
      console.error('Error fetching commits:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleCommit = (commit: Commit) => {
    if (selectedCommits.find(c => c.sha === commit.sha)) {
      setSelectedCommits(selectedCommits.filter(c => c.sha !== commit.sha))
    } else {
      setSelectedCommits([...selectedCommits, commit])
    }
  }

  const generateChangelog = async () => {
    if (selectedCommits.length === 0) return

    setGenerating(true)

    try {
      const response = await fetch('/api/generate-changelog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commits: selectedCommits,
          repoOwner: owner,
          repoName: name,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setTechnicalChangelog(data.technical)
        setUserFriendlyChangelog(data.userFriendly)
        setRemainingGenerations(data.remainingGenerations)
      } else {
        alert(data.error || 'Failed to generate changelog')
      }
    } catch (error) {
      console.error('Error generating changelog:', error)
      alert('Failed to generate changelog')
    } finally {
      setGenerating(false)
    }
  }

  const copyToClipboard = async (text: string, setFunc: (val: boolean) => void) => {
    await navigator.clipboard.writeText(text)
    setFunc(true)
    setTimeout(() => setFunc(false), 2000)
  }

  const downloadChangelog = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
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
            <Sparkles className="h-6 w-6" />
            <span className="text-xl font-bold">Shiplog</span>
          </Link>
        </div>

        {/* Repo Info */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {owner} / {name}
          </h1>
          <p className="text-muted-foreground">
            Last 30 days of commits • {selectedCommits.length} of {commits.length} selected
          </p>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading commits...</p>
          </div>
        )}

        {!loading && commits.length === 0 && (
          <Card className="p-12 text-center">
            <CardContent>
              <p className="text-muted-foreground">
                No commits found in the last 30 days.
              </p>
            </CardContent>
          </Card>
        )}

        {!loading && commits.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Commits List */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Commits</h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCommits(commits)}
                  >
                    Select All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCommits([])}
                  >
                    Clear
                  </Button>
                </div>
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {commits.map((commit) => (
                  <Card
                    key={commit.sha}
                    className={`cursor-pointer transition-all ${
                      selectedCommits.find(c => c.sha === commit.sha)
                        ? 'border-primary bg-accent'
                        : 'hover:border-muted-foreground'
                    }`}
                    onClick={() => toggleCommit(commit)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={!!selectedCommits.find(c => c.sha === commit.sha)}
                          onChange={() => {}}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-mono text-sm truncate mb-1">
                            {commit.commit.message.split('\n')[0]}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{commit.commit.author.name}</span>
                            <span>•</span>
                            <span>{formatDate(commit.commit.author.date)}</span>
                            <span>•</span>
                            <span className="font-mono">{commit.sha.substring(0, 7)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-6">
                <Button
                  onClick={generateChangelog}
                  disabled={selectedCommits.length === 0 || generating}
                  className="w-full"
                  size="lg"
                >
                  {generating ? (
                    <>
                      <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-2" />
                      Generate Changelog
                    </>
                  )}
                </Button>
                <p className="text-center text-sm text-muted-foreground mt-2">
                  {remainingGenerations} free generations remaining
                </p>
              </div>
            </div>

            {/* Right: Changelog Output */}
            <div className="space-y-6">
              {/* Technical Changelog */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Technical Changelog</CardTitle>
                      <CardDescription>Grouped by conventional commit types</CardDescription>
                    </div>
                    {technicalChangelog && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(technicalChangelog, setCopiedTech)}
                        >
                          {copiedTech ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadChangelog(technicalChangelog, 'CHANGELOG.md')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {!technicalChangelog && (
                    <p className="text-muted-foreground text-center py-8">
                      Generate a changelog to see the output
                    </p>
                  )}
                  {technicalChangelog && (
                    <pre className="text-sm bg-background p-4 rounded border max-h-[400px] overflow-y-auto whitespace-pre-wrap">
                      {technicalChangelog}
                    </pre>
                  )}
                </CardContent>
              </Card>

              {/* User-Friendly Changelog */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        User-Friendly Version
                        <Sparkles className="h-5 w-5 text-purple-400" />
                      </CardTitle>
                      <CardDescription>AI-rewritten for your users</CardDescription>
                    </div>
                    {userFriendlyChangelog && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(userFriendlyChangelog, setCopiedUser)}
                        >
                          {copiedUser ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadChangelog(userFriendlyChangelog, 'RELEASE_NOTES.md')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {!userFriendlyChangelog && (
                    <p className="text-muted-foreground text-center py-8">
                      Generate a changelog to see the AI-powered version
                    </p>
                  )}
                  {userFriendlyChangelog && (
                    <pre className="text-sm bg-background p-4 rounded border max-h-[400px] overflow-y-auto whitespace-pre-wrap">
                      {userFriendlyChangelog}
                    </pre>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
