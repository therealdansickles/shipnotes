'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Calendar, Clock } from 'lucide-react'

const blogPosts = [
  {
    slug: 'how-to-write-better-changelogs',
    title: 'How to Write Better Changelogs in 2025 (Best Practices + AI Tool)',
    description: 'Learn proven best practices for writing clear, effective changelogs that your users will actually read and understand.',
    date: 'November 7, 2025',
    readTime: '8 min read',
    category: 'Best Practices',
  },
  {
    slug: 'keep-a-changelog-vs-shipnotes',
    title: 'Keep a Changelog vs ShipNotes: Which Approach Is Better?',
    description: 'A balanced comparison of the Keep a Changelog standard and modern AI-powered automation for your team.',
    date: 'November 7, 2025',
    readTime: '10 min read',
    category: 'Comparison',
  },
  {
    slug: 'communicate-code-changes-non-technical',
    title: 'How to Communicate Code Changes to Non-Technical Stakeholders',
    description: 'Bridge the gap between technical and non-technical team members with these communication strategies.',
    date: 'November 7, 2025',
    readTime: '12 min read',
    category: 'Communication',
  },
  {
    slug: 'git-commit-best-practices',
    title: 'Git Commit Messages Best Practices: A Complete Guide for Teams',
    description: 'Master the art of writing clear, consistent git commit messages that enable automation and improve team collaboration.',
    date: 'November 7, 2025',
    readTime: '15 min read',
    category: 'Developer Guide',
  },
  {
    slug: 'translation-layer-for-teams',
    title: 'The Translation Layer: Why Every Development Team Needs One',
    description: 'Introducing a new paradigm for technical communication: the translation layer that speaks every stakeholder\'s language.',
    date: 'November 7, 2025',
    readTime: '10 min read',
    category: 'Thought Leadership',
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen dark">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80">
            <Image src="/shipnotes-icon.png" alt="ShipNotes" width={32} height={32} className="h-8 w-8" />
            <span className="text-lg sm:text-xl font-bold">ShipNotes</span>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-xl text-muted-foreground mb-12">
            Insights on developer communication, changelog best practices, and the translation layer concept.
          </p>

          <div className="space-y-6">
            {blogPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <Card className="hover:border-primary transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <span className="text-primary font-medium">{post.category}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {post.date}
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </div>
                    </div>
                    <CardTitle className="text-2xl hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-base">{post.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-primary font-medium">
                      Read article
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <Card className="p-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-2">
              <CardContent>
                <h2 className="text-2xl font-bold mb-4">Want to automate your changelog process?</h2>
                <p className="text-muted-foreground mb-6">
                  Try ShipNotes and turn git commits into stakeholder-appropriate updates in seconds.
                </p>
                <Link href="/">
                  <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
                    Start Translating for Free
                  </button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
