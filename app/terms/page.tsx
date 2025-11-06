import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service - ShipNotes',
  description: 'Terms of Service for ShipNotes',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen dark">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <Link href="/" className="flex items-center gap-1 sm:gap-2 hover:opacity-80">
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="text-lg sm:text-xl font-bold">ShipNotes</span>
          </Link>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <section className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">1. Acceptance of Terms</h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              By accessing or using ShipNotes (&quot;the Service&quot;), operated by dpop Studios LLC (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, do not use the Service.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              We reserve the right to update these Terms at any time. Continued use of the Service after changes constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">2. Description of Service</h2>
            <p className="text-muted-foreground leading-relaxed">
              ShipNotes is a web-based service that:
            </p>
            <ul className="list-disc pl-5 sm:pl-6 text-sm sm:text-base text-muted-foreground space-y-2 mt-2">
              <li>Integrates with GitHub to access your repository commit history</li>
              <li>Automatically categorizes commits using conventional commit standards</li>
              <li>Generates technical changelogs grouped by commit type</li>
              <li>Uses artificial intelligence (OpenAI GPT-4) to rewrite changelogs in user-friendly language</li>
              <li>Provides export options (Markdown, HTML, plain text)</li>
            </ul>
          </section>

          <section className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">3. User Accounts</h2>

            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 mt-4 sm:mt-6">3.1 Account Creation</h3>
            <p className="text-muted-foreground leading-relaxed">
              You must have a GitHub account to use ShipNotes. By signing in with GitHub OAuth, you authorize us to access your GitHub data as described in our{' '}
              <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
            </p>

            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 mt-4 sm:mt-6">3.2 Account Security</h3>
            <p className="text-muted-foreground leading-relaxed">
              You are responsible for:
            </p>
            <ul className="list-disc pl-5 sm:pl-6 text-sm sm:text-base text-muted-foreground space-y-2 mt-2">
              <li>Maintaining the security of your GitHub account</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized access</li>
            </ul>

            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 mt-4 sm:mt-6">3.3 Account Termination</h3>
            <p className="text-muted-foreground leading-relaxed">
              You may delete your account at any time from your account settings. We may suspend or terminate your account if you violate these Terms.
            </p>
          </section>

          <section className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">4. Subscription Plans</h2>

            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 mt-4 sm:mt-6">4.1 Free Trial</h3>
            <p className="text-muted-foreground leading-relaxed">
              New users receive 3 free changelog generations. After using your free generations, you must upgrade to ShipNotes Pro to continue using the service.
            </p>

            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 mt-4 sm:mt-6">4.2 ShipNotes Pro</h3>
            <p className="text-muted-foreground leading-relaxed">
              ShipNotes Pro is a paid subscription that includes:
            </p>
            <ul className="list-disc pl-5 sm:pl-6 text-sm sm:text-base text-muted-foreground space-y-2 mt-2">
              <li>Unlimited changelog generations</li>
              <li>AI-powered changelog rewriting</li>
              <li>All export formats</li>
              <li>Priority support</li>
            </ul>

            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 mt-4 sm:mt-6">4.3 Billing</h3>
            <ul className="list-disc pl-5 sm:pl-6 text-sm sm:text-base text-muted-foreground space-y-2 mt-2">
              <li>Subscriptions are billed monthly through Stripe</li>
              <li>You authorize us to charge your payment method on a recurring basis</li>
              <li>Prices are in USD and may change with 30 days notice</li>
              <li>You can cancel your subscription at any time</li>
            </ul>

            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 mt-4 sm:mt-6">4.4 Refund Policy</h3>
            <p className="text-muted-foreground leading-relaxed">
              We offer refunds within 14 days of your initial purchase if you are unsatisfied with the service. To request a refund, contact us at{' '}
              <a href="mailto:hello@dpopstudios.xyz" className="text-primary hover:underline">hello@dpopstudios.xyz</a>. Refunds are not available for renewals.
            </p>

            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 mt-4 sm:mt-6">4.5 Cancellation</h3>
            <p className="text-muted-foreground leading-relaxed">
              You may cancel your subscription at any time. Your subscription will remain active until the end of the current billing period. No partial refunds are provided for mid-cycle cancellations.
            </p>
          </section>

          <section className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">5. Acceptable Use</h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree not to:
            </p>
            <ul className="list-disc pl-5 sm:pl-6 text-sm sm:text-base text-muted-foreground space-y-2 mt-2">
              <li>Use the Service for any illegal purpose</li>
              <li>Violate any laws in your jurisdiction</li>
              <li>Infringe on intellectual property rights</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Reverse engineer, decompile, or disassemble the Service</li>
              <li>Use automated tools to abuse or overload our systems</li>
              <li>Share your account with others</li>
              <li>Resell or redistribute the Service without permission</li>
              <li>Upload malicious code or viruses</li>
              <li>Interfere with other users&apos; use of the Service</li>
            </ul>
          </section>

          <section className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">6. Intellectual Property</h2>

            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 mt-4 sm:mt-6">6.1 Our Rights</h3>
            <p className="text-muted-foreground leading-relaxed">
              ShipNotes, including its design, code, and content, is protected by copyright, trademark, and other intellectual property laws. We retain all rights not expressly granted to you.
            </p>

            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 mt-4 sm:mt-6">6.2 Your Content</h3>
            <p className="text-muted-foreground leading-relaxed">
              You retain ownership of your repository data and commit messages. By using the Service, you grant us a limited license to:
            </p>
            <ul className="list-disc pl-5 sm:pl-6 text-sm sm:text-base text-muted-foreground space-y-2 mt-2">
              <li>Access your GitHub repositories (with your permission)</li>
              <li>Process your commit messages to generate changelogs</li>
              <li>Send commit messages to OpenAI for AI processing</li>
              <li>Store generated changelogs in our database</li>
            </ul>

            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 mt-4 sm:mt-6">6.3 Generated Changelogs</h3>
            <p className="text-muted-foreground leading-relaxed">
              Changelogs generated by ShipNotes belong to you. You may use them for any purpose, including commercial use.
            </p>
          </section>

          <section className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">7. Third-Party Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              ShipNotes integrates with third-party services (GitHub, OpenAI, Stripe). Your use of these services is subject to their respective terms:
            </p>
            <ul className="list-disc pl-5 sm:pl-6 text-sm sm:text-base text-muted-foreground space-y-2 mt-2">
              <li><a href="https://docs.github.com/en/site-policy/github-terms/github-terms-of-service" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">GitHub Terms of Service</a></li>
              <li><a href="https://openai.com/policies/terms-of-use" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">OpenAI Terms of Use</a></li>
              <li><a href="https://stripe.com/legal/consumer" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Stripe Terms</a></li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              We are not responsible for the practices of these third-party services.
            </p>
          </section>

          <section className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">8. Disclaimer of Warranties</h2>
            <p className="text-muted-foreground leading-relaxed">
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="list-disc pl-5 sm:pl-6 text-sm sm:text-base text-muted-foreground space-y-2 mt-2">
              <li>Warranties of merchantability or fitness for a particular purpose</li>
              <li>Warranties that the Service will be uninterrupted or error-free</li>
              <li>Warranties regarding the accuracy of AI-generated content</li>
              <li>Warranties that defects will be corrected</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              We do not guarantee that AI-generated changelogs will be perfect or suitable for your needs. You are responsible for reviewing all generated content before use.
            </p>
          </section>

          <section className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">9. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, SHIPNOTES AND ITS AFFILIATES SHALL NOT BE LIABLE FOR:
            </p>
            <ul className="list-disc pl-5 sm:pl-6 text-sm sm:text-base text-muted-foreground space-y-2 mt-2">
              <li>Any indirect, incidental, special, consequential, or punitive damages</li>
              <li>Loss of profits, revenue, data, or use</li>
              <li>Business interruption</li>
              <li>Errors or inaccuracies in AI-generated content</li>
              <li>Unauthorized access to your data</li>
              <li>Third-party conduct or content</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Our total liability to you for any claims arising from your use of the Service shall not exceed the amount you paid us in the 12 months preceding the claim, or $100, whichever is greater.
            </p>
          </section>

          <section className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">10. Indemnification</h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree to indemnify and hold harmless ShipNotes, its affiliates, and their respective officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses (including legal fees) arising from:
            </p>
            <ul className="list-disc pl-5 sm:pl-6 text-sm sm:text-base text-muted-foreground space-y-2 mt-2">
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
              <li>Any content you submit through the Service</li>
            </ul>
          </section>

          <section className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">11. Data and Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our collection and use of your data is governed by our{' '}
              <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>, which is incorporated into these Terms by reference.
            </p>
          </section>

          <section className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">12. Service Modifications</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to:
            </p>
            <ul className="list-disc pl-5 sm:pl-6 text-sm sm:text-base text-muted-foreground space-y-2 mt-2">
              <li>Modify or discontinue the Service (or any part thereof) at any time</li>
              <li>Change pricing with 30 days notice</li>
              <li>Impose limits on features or access</li>
              <li>Update features and functionality</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              We are not liable for any modification, suspension, or discontinuation of the Service.
            </p>
          </section>

          <section className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">13. Termination</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may terminate or suspend your access immediately, without prior notice, if you:
            </p>
            <ul className="list-disc pl-5 sm:pl-6 text-sm sm:text-base text-muted-foreground space-y-2 mt-2">
              <li>Violate these Terms</li>
              <li>Engage in fraudulent or illegal activity</li>
              <li>Fail to pay subscription fees</li>
              <li>Abuse our systems or other users</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Upon termination, your right to use the Service ceases immediately. Sections that should survive termination (including but not limited to liability limitations, indemnification, and dispute resolution) will remain in effect.
            </p>
          </section>

          <section className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">14. Dispute Resolution</h2>

            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 mt-4 sm:mt-6">14.1 Governing Law</h3>
            <p className="text-muted-foreground leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the United States and the State of [Your State], without regard to conflict of law principles.
            </p>

            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 mt-4 sm:mt-6">14.2 Informal Resolution</h3>
            <p className="text-muted-foreground leading-relaxed">
              Before filing a claim, you agree to contact us at{' '}
              <a href="mailto:hello@dpopstudios.xyz" className="text-primary hover:underline">hello@dpopstudios.xyz</a>{' '}
              to attempt to resolve the dispute informally. We will attempt to resolve disputes in good faith within 30 days.
            </p>

            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 mt-4 sm:mt-6">14.3 Arbitration</h3>
            <p className="text-muted-foreground leading-relaxed">
              If informal resolution fails, disputes shall be resolved through binding arbitration rather than in court, except that you may assert claims in small claims court if they qualify.
            </p>
          </section>

          <section className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">15. General Provisions</h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-1">15.1 Entire Agreement</h3>
                <p className="text-muted-foreground text-sm">
                  These Terms and our Privacy Policy constitute the entire agreement between you and ShipNotes.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-1">15.2 Severability</h3>
                <p className="text-muted-foreground text-sm">
                  If any provision is found unenforceable, the remaining provisions will remain in full effect.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-1">15.3 Waiver</h3>
                <p className="text-muted-foreground text-sm">
                  Failure to enforce any right or provision does not constitute a waiver of that right.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-1">15.4 Assignment</h3>
                <p className="text-muted-foreground text-sm">
                  You may not assign these Terms without our consent. We may assign these Terms without restriction.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-1">15.5 Force Majeure</h3>
                <p className="text-muted-foreground text-sm">
                  We are not liable for delays or failures caused by circumstances beyond our reasonable control.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">16. Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              For questions about these Terms, please contact us:
            </p>
            <div className="mt-4 p-3 sm:p-4 border border-border rounded-lg">
              <p className="text-xs sm:text-sm text-muted-foreground">
                Email: <a href="mailto:hello@dpopstudios.xyz" className="text-primary hover:underline break-all">hello@dpopstudios.xyz</a>
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                Support: <a href="mailto:hello@dpopstudios.xyz" className="text-primary hover:underline break-all">hello@dpopstudios.xyz</a>
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                Website: <a href="https://shipnotes.xyz" className="text-primary hover:underline break-all">https://shipnotes.xyz</a>
              </p>
            </div>
          </section>

          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border">
            <p className="text-xs sm:text-sm text-muted-foreground mb-4">
              By using ShipNotes, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
            <p className="text-xs text-muted-foreground">
              ShipNotes is a product operated by dpop Studios LLC. These Terms constitute a binding agreement between you and dpop Studios LLC.
            </p>
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
