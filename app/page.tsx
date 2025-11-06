'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { UpgradeButton } from "@/components/ui/upgrade-button"
import { Github, Sparkles, FileText, Zap, Clock, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/user')
        if (response.ok) {
          setIsLoggedIn(true)
        }
      } catch (error) {
        console.log('Not logged in')
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [])

  const handleAuthClick = () => {
    if (isLoggedIn) {
      router.push('/dashboard')
    } else {
      router.push('/api/auth/github')
    }
  }

  return (
    <div className="min-h-screen dark">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Header */}
        <nav className="flex justify-between items-center mb-20">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6" />
            <span className="text-xl font-bold">ShipNotes</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAuthClick}
            disabled={isLoading}
          >
            <Github className="h-4 w-4 mr-2" />
            {isLoading ? 'Loading...' : isLoggedIn ? 'Dashboard' : 'Login'}
          </Button>
        </nav>

        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-block mb-4 px-4 py-2 bg-accent rounded-full text-sm text-muted-foreground">
            Stop writing changelogs manually
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Ship faster with
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              AI-powered changelogs
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Turn your messy Git commits into beautiful, professional changelogs in seconds.
            Your users deserve better than "fixed stuff" and "WIP".
          </p>
          <div className="flex gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="text-lg h-14 px-8"
              onClick={handleAuthClick}
              disabled={isLoading}
            >
              <Github className="h-5 w-5 mr-2" />
              {isLoading ? 'Loading...' : isLoggedIn ? 'Go to Dashboard' : 'Get Started with GitHub'}
            </Button>
            <Button size="lg" variant="outline" className="text-lg h-14 px-8">
              View Example
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-background"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-background"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border-2 border-background"></div>
              </div>
              <span>500+ developers shipping faster</span>
            </div>
          </div>
        </div>

        {/* Demo Section */}
        <div className="mb-32">
          <Card className="p-8 bg-gradient-to-br from-background to-accent border-2">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="text-sm text-muted-foreground mb-2">BEFORE</div>
                <div className="font-mono text-sm bg-background p-4 rounded-lg border space-y-2">
                  <div className="text-red-400">• fix: button thing</div>
                  <div className="text-red-400">• update stuff</div>
                  <div className="text-red-400">• WIP</div>
                  <div className="text-red-400">• fix bug idk</div>
                  <div className="text-red-400">• merge branch xyz</div>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                  AFTER <Sparkles className="h-3 w-3" />
                </div>
                <div className="text-sm bg-background p-4 rounded-lg border space-y-3">
                  <div>
                    <div className="text-green-400 font-semibold">✨ New Features</div>
                    <div className="text-muted-foreground ml-4">Added user authentication flow</div>
                  </div>
                  <div>
                    <div className="text-blue-400 font-semibold">🐛 Bug Fixes</div>
                    <div className="text-muted-foreground ml-4">Fixed critical payment processing error</div>
                    <div className="text-muted-foreground ml-4">Resolved login redirect issue</div>
                  </div>
                  <div>
                    <div className="text-purple-400 font-semibold">🎨 Improvements</div>
                    <div className="text-muted-foreground ml-4">Enhanced button responsiveness</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Features */}
        <div className="mb-32">
          <h2 className="text-3xl font-bold text-center mb-12">Everything you need to ship</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 hover:border-primary transition-colors">
              <CardContent className="pt-6">
                <Zap className="h-10 w-10 mb-4 text-yellow-400" />
                <h3 className="text-xl font-bold mb-2">Generate in Seconds</h3>
                <p className="text-muted-foreground">
                  Select your commits, click generate. Get professional changelogs instantly.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:border-primary transition-colors">
              <CardContent className="pt-6">
                <Sparkles className="h-10 w-10 mb-4 text-purple-400" />
                <h3 className="text-xl font-bold mb-2">AI-Powered</h3>
                <p className="text-muted-foreground">
                  Smart categorization and rewriting. Turns tech talk into human language.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:border-primary transition-colors">
              <CardContent className="pt-6">
                <FileText className="h-10 w-10 mb-4 text-blue-400" />
                <h3 className="text-xl font-bold mb-2">Multiple Formats</h3>
                <p className="text-muted-foreground">
                  Export as Markdown, HTML, or plain text. Copy with one click.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-32">
          <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
          <div className="space-y-8 max-w-3xl mx-auto">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Connect GitHub</h3>
                <p className="text-muted-foreground">
                  Sign in with GitHub in one click. No complex setup required.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Select Repository</h3>
                <p className="text-muted-foreground">
                  Choose any repo and we'll fetch your recent commits automatically.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Generate & Ship</h3>
                <p className="text-muted-foreground">
                  Get both technical and user-friendly versions. Copy, download, or share instantly.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-32">
          <h2 className="text-3xl font-bold text-center mb-12">Simple, transparent pricing</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-8 flex flex-col">
              <CardContent className="pt-6 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold mb-2">Free Trial</h3>
                <div className="text-4xl font-bold mb-4">$0</div>
                <p className="text-muted-foreground mb-6">Perfect to try it out</p>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-xs">✓</div>
                    <span>3 changelog generations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-xs">✓</div>
                    <span>All export formats</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-xs">✓</div>
                    <span>30 days of commits</span>
                  </li>
                </ul>
                <Link href="/api/auth/github" className="w-full">
                  <Button variant="outline" className="w-full">
                    Start Free
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="p-8 border-primary border-2 relative flex flex-col">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <CardContent className="pt-6 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <div className="text-4xl font-bold mb-4">
                  $29<span className="text-lg text-muted-foreground">/month</span>
                </div>
                <p className="text-muted-foreground mb-6">Ship faster, forever</p>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-xs">✓</div>
                    <span className="font-semibold">Unlimited changelogs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-xs">✓</div>
                    <span>AI-powered rewriting</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-xs">✓</div>
                    <span>Custom date ranges</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-xs">✓</div>
                    <span>Priority support</span>
                  </li>
                </ul>
                <UpgradeButton className="w-full" showIcon={false} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="p-12 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-2">
            <CardContent>
              <h2 className="text-4xl font-bold mb-4">Ready to ship better changelogs?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join hundreds of developers who are shipping faster
              </p>
              <Button
                size="lg"
                className="text-lg h-14 px-8"
                onClick={handleAuthClick}
                disabled={isLoading}
              >
                <Github className="h-5 w-5 mr-2" />
                {isLoading ? 'Loading...' : isLoggedIn ? 'Go to Dashboard' : 'Get Started Free'}
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                No credit card required • 3 free changelogs
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© 2025 dpop Studios. Ship faster, build better.</p>
        </footer>
      </div>
    </div>
  )
}
