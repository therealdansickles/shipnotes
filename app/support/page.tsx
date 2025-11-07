import Link from 'next/link'
import Image from 'next/image'
import { Mail, Github, MessageCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata = {
  title: 'Support - ShipNotes',
  description: 'Get help with ShipNotes',
}

export default function SupportPage() {
  return (
    <div className="min-h-screen dark">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <Link href="/" className="flex items-center gap-1 sm:gap-2 hover:opacity-80">
            <Image src="/shipnotes-icon.png" alt="ShipNotes" width={24} height={24} className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="text-lg sm:text-xl font-bold">ShipNotes</span>
          </Link>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">How can we help?</h1>
          <p className="text-muted-foreground mb-6 sm:mb-8 text-base sm:text-lg">
            We're here to help you get the most out of ShipNotes. Choose the best way to reach us below.
          </p>

          {/* Contact Methods */}
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
                  Email Support
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Get help from our team via email
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                  We typically respond within 24 hours (often much faster).
                </p>
                <a
                  href="mailto:hello@dpopstudios.xyz"
                  className="inline-flex items-center gap-2 text-primary hover:underline font-medium text-sm break-all"
                >
                  hello@dpopstudios.xyz
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Github className="h-4 w-4 sm:h-5 sm:w-5" />
                  GitHub Issues
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Report bugs or request features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                  Found a bug or have a feature idea? Open an issue on GitHub.
                </p>
                <a
                  href="https://github.com/therealdansickles/shipnotes/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:underline font-medium text-sm"
                >
                  Open an Issue →
                </a>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Frequently Asked Questions</h2>

            <div className="space-y-4 sm:space-y-6">
              <div>
                <h3 className="font-semibold mb-2 text-base sm:text-lg">How do I get started with ShipNotes?</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Simply sign in with your GitHub account, select a repository, and click "Generate Changelog".
                  You'll get both a technical changelog and an AI-rewritten version in seconds.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-base sm:text-lg">What repositories can I use?</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  You can use any repository you have access to on GitHub - both public and private repositories
                  you own or collaborate on.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-base sm:text-lg">How does the free trial work?</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  New users get 3 free changelog generations. After that, you'll need to upgrade to ShipNotes Pro
                  for unlimited access.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-base sm:text-lg">Can I cancel my subscription anytime?</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Yes! You can cancel your ShipNotes Pro subscription at any time. Your access will continue
                  until the end of your current billing period.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-base sm:text-lg">Do you offer refunds?</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  We offer refunds within 14 days of your initial purchase if you're unsatisfied with the service.
                  Contact us at{' '}
                  <a href="mailto:support@shipnotes.xyz" className="text-primary hover:underline">
                    support@shipnotes.xyz
                  </a>{' '}
                  to request a refund.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-base sm:text-lg">Is my data secure?</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Yes! We take security seriously. All data is encrypted in transit and at rest. We use industry-standard
                  security practices including Row-Level Security, rate limiting, and secure authentication.
                  Read more in our{' '}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-base sm:text-lg">Can I delete my account and data?</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Yes. You can delete your account and all associated data at any time from your account settings.
                  This action is permanent and cannot be undone.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-base sm:text-lg">What happens to my commits?</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  We only read your commit messages to generate changelogs. Your actual code is never accessed
                  or stored. Commit messages are sent to OpenAI for AI processing but without any personal identifiers.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-base sm:text-lg">Can I export my changelogs?</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Yes! You can copy changelogs to your clipboard or download them in Markdown, HTML, or plain text format.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-base sm:text-lg">How accurate is the AI rewriting?</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  The AI does an excellent job of making technical commits user-friendly, but we always recommend
                  reviewing the output before publishing. You have full control to edit or use the technical version instead.
                </p>
              </div>
            </div>
          </div>

          {/* Additional Resources */}
          <div className="border-t border-border pt-6 sm:pt-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Additional Resources</h2>
            <div className="space-y-2 sm:space-y-3">
              <Link href="/privacy" className="block text-primary hover:underline text-sm sm:text-base">
                → Privacy Policy
              </Link>
              <Link href="/terms" className="block text-primary hover:underline text-sm sm:text-base">
                → Terms of Service
              </Link>
              <a
                href="https://github.com/therealdansickles/shipnotes"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-primary hover:underline text-sm sm:text-base"
              >
                → View on GitHub
              </a>
            </div>
          </div>

          {/* Still need help? */}
          <div className="mt-8 sm:mt-12 p-4 sm:p-6 border border-border rounded-lg bg-accent/50">
            <h3 className="font-semibold mb-2 flex items-center gap-2 text-base sm:text-lg">
              <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              Still need help?
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
              Can't find what you're looking for? Send us an email and we'll get back to you as soon as possible.
            </p>
            <a
              href="mailto:hello@dpopstudios.xyz"
              className="inline-flex items-center gap-2 text-primary hover:underline font-medium text-sm break-all"
            >
              Contact Support →
            </a>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-8 sm:mt-12 text-center">
          <Link href="/" className="text-sm sm:text-base text-primary hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
