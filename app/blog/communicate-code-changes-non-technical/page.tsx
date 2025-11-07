'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function BlogPost() {
  return (
    <div className="min-h-screen dark">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/blog" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        <article className="prose prose-invert max-w-none">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">How to Communicate Code Changes to Non-Technical Stakeholders</h1>
            <p className="text-xl text-muted-foreground">Coming soon: Bridge the communication gap between developers and business stakeholders.</p>
          </div>
        </article>
      </div>
    </div>
  )
}
