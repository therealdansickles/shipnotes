import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Privacy Policy - ShipNotes',
  description: 'Privacy Policy for ShipNotes - How we collect, use, and protect your data',
}

export default function PrivacyPage() {
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
        <div className="prose prose-invert max-w-none">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <section className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              dpop Studios LLC, doing business as ShipNotes (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service at shipnotes.xyz.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              By using ShipNotes, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          <section className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Information We Collect</h2>

            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 mt-4 sm:mt-6">1. Information from GitHub</h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              When you sign in with GitHub OAuth, we collect:
            </p>
            <ul className="list-disc pl-5 sm:pl-6 text-sm sm:text-base text-muted-foreground space-y-2 mt-2">
              <li>Your GitHub username</li>
              <li>Your GitHub user ID</li>
              <li>Your email address associated with your GitHub account</li>
              <li>Your GitHub profile picture URL</li>
              <li>Access to your repositories (read-only)</li>
              <li>Commit history from repositories you select</li>
            </ul>

            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 mt-4 sm:mt-6">2. Usage Data</h3>
            <p className="text-muted-foreground leading-relaxed">
              We automatically collect:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-2">
              <li>Changelog generation events (timestamps, repository names)</li>
              <li>Export and copy actions</li>
              <li>IP addresses (for rate limiting and security)</li>
              <li>Browser type and version (via user agent)</li>
              <li>Pages visited and time spent on our service</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">3. Payment Information</h3>
            <p className="text-muted-foreground leading-relaxed">
              If you subscribe to ShipNotes Pro:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-2">
              <li>Payment processing is handled entirely by Stripe</li>
              <li>We do not store credit card numbers or payment details</li>
              <li>We receive only your email address and subscription status from Stripe</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">4. Generated Content</h3>
            <p className="text-muted-foreground leading-relaxed">
              We store:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-2">
              <li>Changelogs you generate (both technical and AI-rewritten versions)</li>
              <li>Repository names and commit counts</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use your information to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-2">
              <li><strong>Provide our service:</strong> Generate changelogs from your Git commits</li>
              <li><strong>Authenticate you:</strong> Verify your identity via GitHub OAuth</li>
              <li><strong>Process payments:</strong> Manage your subscription via Stripe</li>
              <li><strong>Improve our service:</strong> Analyze usage patterns to enhance features</li>
              <li><strong>Prevent abuse:</strong> Enforce rate limits and detect fraudulent activity</li>
              <li><strong>Communicate with you:</strong> Send important service updates (if necessary)</li>
              <li><strong>AI Processing:</strong> Send commit messages to OpenAI for rewriting (anonymized, no personal identifiers)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Third-Party Services</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              ShipNotes integrates with the following third-party services:
            </p>

            <div className="space-y-4">
              <div className="border border-border rounded-lg p-3 sm:p-4">
                <h3 className="text-base sm:text-lg font-semibold mb-2">GitHub</h3>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  We use GitHub OAuth for authentication and to access your repository data. See GitHub&apos;s{' '}
                  <a href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement"
                     className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                    Privacy Policy
                  </a>.
                </p>
              </div>

              <div className="border border-border rounded-lg p-3 sm:p-4">
                <h3 className="text-base sm:text-lg font-semibold mb-2">Supabase (Database)</h3>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  We use Supabase to store your user profile, generated changelogs, and usage data. Data is encrypted at rest. See Supabase&apos;s{' '}
                  <a href="https://supabase.com/privacy"
                     className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                    Privacy Policy
                  </a>.
                </p>
              </div>

              <div className="border border-border rounded-lg p-3 sm:p-4">
                <h3 className="text-base sm:text-lg font-semibold mb-2">OpenAI</h3>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  We send your commit messages to OpenAI&apos;s GPT-4 API for AI-powered rewriting. Commit messages are sent without personal identifiers. See OpenAI&apos;s{' '}
                  <a href="https://openai.com/policies/privacy-policy"
                     className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                    Privacy Policy
                  </a>.
                </p>
              </div>

              <div className="border border-border rounded-lg p-3 sm:p-4">
                <h3 className="text-base sm:text-lg font-semibold mb-2">Stripe</h3>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  We use Stripe for payment processing. Stripe handles all payment information securely. See Stripe&apos;s{' '}
                  <a href="https://stripe.com/privacy"
                     className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                    Privacy Policy
                  </a>.
                </p>
              </div>

              <div className="border border-border rounded-lg p-3 sm:p-4">
                <h3 className="text-base sm:text-lg font-semibold mb-2">Vercel (Hosting)</h3>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Our service is hosted on Vercel. They may collect analytics data. See Vercel&apos;s{' '}
                  <a href="https://vercel.com/legal/privacy-policy"
                     className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                    Privacy Policy
                  </a>.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Data Storage and Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement industry-standard security measures to protect your data:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-2">
              <li><strong>Encryption:</strong> Data is encrypted in transit (HTTPS/TLS) and at rest</li>
              <li><strong>Authentication:</strong> Secure GitHub OAuth with httpOnly cookies</li>
              <li><strong>Database Security:</strong> Row-level security policies on all database tables</li>
              <li><strong>Rate Limiting:</strong> Protection against abuse and unauthorized access</li>
              <li><strong>Access Control:</strong> Backend uses service role keys with strict permissions</li>
              <li><strong>Secure Logging:</strong> Sensitive data is automatically redacted from logs</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              However, no method of transmission over the internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              We retain your data as follows:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-2">
              <li><strong>Account Data:</strong> Retained while your account is active</li>
              <li><strong>Generated Changelogs:</strong> Stored indefinitely unless you delete them</li>
              <li><strong>Usage Logs:</strong> Retained for up to 90 days for analytics</li>
              <li><strong>Payment Records:</strong> Retained as required by law (typically 7 years)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You have the following rights regarding your data:
            </p>

            <div className="space-y-3">
              <div>
                <h3 className="font-semibold mb-1">Right to Access</h3>
                <p className="text-muted-foreground text-sm">You can view all your data in your account dashboard.</p>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Right to Deletion</h3>
                <p className="text-muted-foreground text-sm">You can delete your account and all associated data at any time from your account settings.</p>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Right to Data Portability</h3>
                <p className="text-muted-foreground text-sm">You can export your changelogs in Markdown, HTML, or plain text format.</p>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Right to Withdraw Consent</h3>
                <p className="text-muted-foreground text-sm">You can revoke GitHub access at any time through GitHub settings or by deleting your account.</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use strictly necessary cookies for:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-2">
              <li><strong>Authentication:</strong> Storing your GitHub access token (httpOnly, secure)</li>
              <li><strong>Session Management:</strong> Maintaining your logged-in state</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              These cookies are essential for the service to function and are exempt from consent requirements under GDPR.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">International Data Transfers</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your data may be transferred to and processed in countries other than your own. Our service providers (Supabase, OpenAI, Stripe, Vercel) operate globally and maintain appropriate safeguards to protect your data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Children&apos;s Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              ShipNotes is not intended for users under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Changes to This Privacy Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-2">
              <li>Updating the &quot;Last updated&quot; date at the top of this policy</li>
              <li>Posting the new policy on this page</li>
              <li>Sending an email notification for material changes (if you&apos;ve provided your email)</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Your continued use of ShipNotes after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about this Privacy Policy or want to exercise your rights, please contact us:
            </p>
            <div className="mt-4 p-3 sm:p-4 border border-border rounded-lg">
              <p className="text-xs sm:text-sm text-muted-foreground">
                Email: <a href="mailto:hello@dpopstudios.xyz" className="text-primary hover:underline break-all">hello@dpopstudios.xyz</a>
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                Support: <Link href="/support" className="text-primary hover:underline">Contact Form</Link>
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">GDPR Compliance (EU Users)</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you are in the European Economic Area (EEA), you have additional rights under GDPR:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-2">
              <li>Right to rectification of inaccurate data</li>
              <li>Right to restriction of processing</li>
              <li>Right to object to processing</li>
              <li>Right to lodge a complaint with a supervisory authority</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Our lawful basis for processing your data is: (1) Contractual necessity to provide our service, and (2) Legitimate interest in improving our service and preventing fraud.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">CCPA Compliance (California Users)</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you are a California resident, you have rights under the California Consumer Privacy Act (CCPA):
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-2">
              <li>Right to know what personal information we collect and how we use it</li>
              <li>Right to delete your personal information</li>
              <li>Right to opt-out of the sale of personal information (we do not sell your data)</li>
              <li>Right to non-discrimination for exercising your rights</li>
            </ul>
          </section>

          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border">
            <p className="text-xs sm:text-sm text-muted-foreground mb-4">
              This Privacy Policy is effective as of the date listed above. For questions or concerns, please reach out to us at{' '}
              <a href="mailto:hello@dpopstudios.xyz" className="text-primary hover:underline break-all">hello@dpopstudios.xyz</a>.
            </p>
            <p className="text-xs text-muted-foreground">
              ShipNotes is a product operated by dpop Studios LLC. This Privacy Policy is issued by dpop Studios LLC.
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
