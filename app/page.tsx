'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { UpgradeButton } from "@/components/ui/upgrade-button"
import { Github, Sparkles, FileText, Zap, Clock, TrendingUp } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

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
        <nav className="flex justify-between items-center mb-12 sm:mb-20">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/shipnotes-icon.png" alt="ShipNotes" width={24} height={24} className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="text-lg sm:text-xl font-bold">ShipNotes</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/support" className="text-sm text-muted-foreground hover:text-foreground hidden sm:block">
              Support
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAuthClick}
              disabled={isLoading}
            >
              <Github className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">{isLoading ? 'Loading...' : isLoggedIn ? 'Dashboard' : 'Login'}</span>
              <span className="sm:hidden">{isLoading ? '...' : isLoggedIn ? 'Dashboard' : 'Login'}</span>
            </Button>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="text-center mb-16 sm:mb-20 mt-4 sm:mt-8">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 leading-tight px-2">
            Every Team Speaks a
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Different Language
            </span>
          </h1>
          <p className="text-2xl sm:text-3xl font-bold mb-6">
            Now They Can All Understand Each Other.
          </p>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto px-4">
            Turn git commits into updates everyone actually understands, from developers to designers, executives to investors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="text-lg h-14 px-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-200 border-0"
              onClick={handleAuthClick}
              disabled={isLoading}
            >
              <Github className="h-5 w-5 mr-2" />
              {isLoading ? 'Loading...' : isLoggedIn ? 'Go to Dashboard' : 'Start Translating Today for Free'}
            </Button>
            <Link href="/repo/therealdansickles/shipnotes">
              <Button size="lg" variant="outline" className="text-lg h-14 px-8 border-2 hover:bg-accent w-full sm:w-auto">
                View Example
              </Button>
            </Link>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground px-4">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-background flex items-center justify-center text-white text-xs font-bold">
                  A
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-background flex items-center justify-center text-white text-xs font-bold">
                  M
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border-2 border-background flex items-center justify-center text-white text-xs font-bold">
                  S
                </div>
              </div>
              <span className="text-center">Fast-moving teams translating their work</span>
            </div>
          </div>
        </div>

        {/* The Translation Problem */}
        <div className="mb-32">
          <h2 className="text-3xl font-bold text-center mb-4">The Translation Problem</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            One source of truth, infinite translations. See how ShipNotes speaks everyone's language.
          </p>
          <Card className="p-8 bg-gradient-to-br from-background to-accent border-2">
            {/* Git Commit Input */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <GitCommit className="h-4 w-4" />
                <span className="text-sm font-semibold">GIT COMMIT (One Input)</span>
              </div>
              <div className="font-mono text-sm bg-background p-4 rounded-lg border">
                <span className="text-red-400">fix:</span> resolved race condition in useState hook causing re-renders
              </div>
            </div>

            {/* Arrow */}
            <div className="text-center text-muted-foreground text-sm mb-6">
              ↓ Translated into ↓
            </div>

            {/* Translated Outputs */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-4 bg-background border-blue-500/50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-blue-400 text-sm font-semibold">🎨 For Designers</span>
                </div>
                <p className="text-sm">Fixed the flickering issue on page load</p>
              </Card>

              <Card className="p-4 bg-background border-purple-500/50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-purple-400 text-sm font-semibold">💼 For Executives</span>
                </div>
                <p className="text-sm">Improved site performance and user experience</p>
              </Card>

              <Card className="p-4 bg-background border-green-500/50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-400 text-sm font-semibold">📢 For Marketing</span>
                </div>
                <p className="text-sm">Site now loads smoothly for all users</p>
              </Card>

              <Card className="p-4 bg-background border-yellow-500/50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-yellow-400 text-sm font-semibold">💰 For Investors</span>
                </div>
                <p className="text-sm">Reduced technical debt, improved retention metrics</p>
              </Card>

              <Card className="p-4 bg-background border-orange-500/50 md:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-orange-400 text-sm font-semibold">👨‍💻 For Developers</span>
                </div>
                <p className="text-sm">Resolved race condition in React state management preventing unnecessary component re-renders</p>
              </Card>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Same commit. Different languages. Everyone understands.
            </p>
          </Card>
        </div>

        {/* One Input, Infinite Outputs */}
        <div className="mb-32">
          <h2 className="text-3xl font-bold text-center mb-12">One Input, Infinite Outputs</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 hover:border-primary transition-colors">
              <CardContent className="pt-6">
                <Zap className="h-10 w-10 mb-4 text-yellow-400" />
                <h3 className="text-xl font-bold mb-2">Instant Translation</h3>
                <p className="text-muted-foreground">
                  One git commit becomes five different updates. Each stakeholder gets exactly what they need to understand.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:border-primary transition-colors">
              <CardContent className="pt-6">
                <Sparkles className="h-10 w-10 mb-4 text-purple-400" />
                <h3 className="text-xl font-bold mb-2">Built by Creatives</h3>
                <p className="text-muted-foreground">
                  We're creative technologists who lived this problem. We built the translation layer we wished existed.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:border-primary transition-colors">
              <CardContent className="pt-6">
                <FileText className="h-10 w-10 mb-4 text-blue-400" />
                <h3 className="text-xl font-bold mb-2">Every Stakeholder's Language</h3>
                <p className="text-muted-foreground">
                  Designers, executives, marketers, investors, developers—everyone gets updates in their own language.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-24 sm:mb-32">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">How it works</h2>
          <div className="space-y-6 sm:space-y-8 max-w-3xl mx-auto px-4">
            <div className="flex gap-4 sm:gap-6">
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm sm:text-base">
                1
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Connect GitHub</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Sign in with GitHub in one click. No complex setup required.
                </p>
              </div>
            </div>

            <div className="flex gap-4 sm:gap-6">
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm sm:text-base">
                2
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Select Your Commits</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Choose your repo and the commits you want to translate. We fetch everything automatically.
                </p>
              </div>
            </div>

            <div className="flex gap-4 sm:gap-6">
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm sm:text-base">
                3
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Translate & Share</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Get versions for designers, executives, marketing, investors, and developers. Everyone understands instantly.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Who Uses ShipNotes */}
        <div className="mb-32">
          <h2 className="text-3xl font-bold text-center mb-4">Who Uses ShipNotes</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Modern teams ship too fast for traditional communication. ShipNotes bridges the gap.
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="p-6 hover:border-primary transition-colors">
              <CardContent className="pt-6">
                <div className="h-12 w-12 mb-4 flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Fast-Moving Startups</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Developers ship code. Non-technical founders need to understand what's happening. ShipNotes translates between both worlds instantly.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:border-primary transition-colors">
              <CardContent className="pt-6">
                <div className="h-12 w-12 mb-4 flex items-center justify-center bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Creative Agencies</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Your developers speak code. Your creative directors speak design. ShipNotes speaks both, so everyone stays in sync on client projects.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:border-primary transition-colors">
              <CardContent className="pt-6">
                <div className="h-12 w-12 mb-4 flex items-center justify-center bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Product Teams</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Engineering ships features. Product and design need impact summaries. ShipNotes translates technical commits into product updates.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:border-primary transition-colors">
              <CardContent className="pt-6">
                <div className="h-12 w-12 mb-4 flex items-center justify-center bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Web3 Projects</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Core developers work in GitHub. Your community wants updates they can understand. ShipNotes bridges the technical gap.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-32">
          <h2 className="text-3xl font-bold text-center mb-12">Simple, transparent pricing</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="p-8 flex flex-col">
              <CardContent className="pt-6 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold mb-2">Free</h3>
                <div className="text-4xl font-bold mb-4">$0</div>
                <p className="text-muted-foreground mb-6">Test the translation layer</p>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-xs">✓</div>
                    <span>3 changelogs to test</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-xs">✓</div>
                    <span>All output formats</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-xs">✓</div>
                    <span>See how it works</span>
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
                <h3 className="text-2xl font-bold mb-2">Starter</h3>
                <div className="text-4xl font-bold mb-4">
                  $29<span className="text-lg text-muted-foreground">/month</span>
                </div>
                <p className="text-muted-foreground mb-6">For growing teams</p>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-xs">✓</div>
                    <span>Unlimited changelogs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-xs">✓</div>
                    <span>2 output formats</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-xs">✓</div>
                    <span>AI-powered translation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-xs">✓</div>
                    <span>Custom date ranges</span>
                  </li>
                </ul>
                <UpgradeButton variant="outline" className="w-full border-2" showIcon={false} />
              </CardContent>
            </Card>

            <Card className="p-8 flex flex-col">
              <CardContent className="pt-6 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <div className="text-4xl font-bold mb-4">
                  $49<span className="text-lg text-muted-foreground">/month</span>
                </div>
                <p className="text-muted-foreground mb-6">For scaling teams</p>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-xs">✓</div>
                    <span>Everything in Starter</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-xs">✓</div>
                    <span>Unlimited output formats</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-xs">✓</div>
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-xs">✓</div>
                    <span>Coming: Slack/Discord</span>
                  </li>
                </ul>
                <UpgradeButton variant="outline" className="w-full border-2" showIcon={false} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center px-4">
          <Card className="p-8 sm:p-12 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-2">
            <CardContent>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Ready to speak everyone's language?</h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8">
                Join fast-moving teams who translate their work instantly
              </p>
              <Button
                size="lg"
                className="text-base sm:text-lg h-12 sm:h-14 px-6 sm:px-8 w-full sm:w-auto"
                onClick={handleAuthClick}
                disabled={isLoading}
              >
                <Github className="h-5 w-5 mr-2" />
                {isLoading ? 'Loading...' : isLoggedIn ? 'Go to Dashboard' : 'Start Translating for Free'}
              </Button>
              <p className="text-xs sm:text-sm text-muted-foreground mt-4">
                No credit card required • 3 free translations to test
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
