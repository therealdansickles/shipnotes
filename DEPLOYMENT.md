# ShipNotes Deployment Guide

This guide covers deploying ShipNotes to production with all necessary security configurations.

## Prerequisites

Before deploying, ensure you have:

- [ ] Node.js 18+ installed
- [ ] A Vercel account (recommended) or another hosting provider
- [ ] A Supabase account and project
- [ ] A GitHub OAuth application (production)
- [ ] An OpenAI API account with API key
- [ ] A Stripe account for payment processing

## Environment Variables

### Required Environment Variables

Create a `.env.local` file (for local development) and configure the same variables in your production environment:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# GitHub OAuth Configuration
GITHUB_CLIENT_ID=your-github-oauth-client-id
GITHUB_CLIENT_SECRET=your-github-oauth-client-secret

# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key

# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
NEXT_PUBLIC_STRIPE_PRO_PAYMENT_LINK=https://buy.stripe.com/your-payment-link

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-production-domain.com
```

### Where to Find These Values

#### Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
   - `NEXT_PUBLIC_SUPABASE_URL`: Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `anon` `public` key
   - `SUPABASE_SERVICE_ROLE_KEY`: `service_role` `secret` key ⚠️ Keep this secret!

#### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in:
   - Application name: `ShipNotes Production`
   - Homepage URL: `https://your-domain.com`
   - Authorization callback URL: `https://your-domain.com/api/auth/callback`
4. After creation:
   - `GITHUB_CLIENT_ID`: Your Client ID
   - `GITHUB_CLIENT_SECRET`: Generate a new client secret

#### OpenAI

1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy the key (starts with `sk-`)
4. Set usage limits to prevent unexpected charges

#### Stripe

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Switch to **Live mode** (toggle in top-right)
3. Go to **Developers** → **API keys**
   - `STRIPE_SECRET_KEY`: Secret key (starts with `sk_live_`)
4. Create a Payment Link:
   - Go to **Products** → Create a product for "ShipNotes Pro"
   - Create a Payment Link for this product
   - Copy the URL
5. Set up webhook:
   - Go to **Developers** → **Webhooks**
   - Click **Add endpoint**
   - Endpoint URL: `https://your-domain.com/api/stripe/webhook`
   - Listen to events: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy the signing secret (starts with `whsec_`)

## Database Setup

### 1. Run the Schema Migration

1. Open your [Supabase SQL Editor](https://app.supabase.com/project/_/sql)
2. Copy the contents of `supabase-schema.sql`
3. Run the SQL script
4. Verify tables were created: `users`, `changelogs`, `usage`

### 2. Verify Row Level Security

Run this query to confirm RLS is enabled:

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('users', 'changelogs', 'usage');
```

All tables should show `rowsecurity = true`.

## Deployment Steps

### Deploying to Vercel (Recommended)

1. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```

2. **Connect your repository**:
   - Push your code to GitHub
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click **New Project**
   - Import your GitHub repository

3. **Configure environment variables**:
   - In the Vercel project settings, go to **Environment Variables**
   - Add all variables from your `.env.local`
   - Make sure `NEXT_PUBLIC_APP_URL` matches your Vercel domain

4. **Deploy**:
   ```bash
   vercel --prod
   ```
   Or push to your `main` branch for automatic deployment

5. **Update OAuth callback**:
   - Once deployed, update your GitHub OAuth app's callback URL to match your Vercel domain
   - Update `NEXT_PUBLIC_APP_URL` in Vercel environment variables

### Post-Deployment Verification

1. **Test authentication flow**:
   - Visit your production site
   - Click "Sign in with GitHub"
   - Verify callback works and you're redirected to dashboard

2. **Test changelog generation**:
   - Select a repository
   - Generate a changelog
   - Verify both technical and AI-rewritten versions appear

3. **Test rate limiting**:
   - Make multiple rapid requests
   - Verify you receive 429 status after hitting limits
   - Check response headers for `X-RateLimit-*` headers

4. **Test Stripe webhook**:
   - Use [Stripe CLI](https://stripe.com/docs/stripe-cli) to test webhook locally:
     ```bash
     stripe listen --forward-to localhost:3000/api/stripe/webhook
     stripe trigger checkout.session.completed
     ```
   - Verify subscription status updates in database

5. **Check security headers**:
   - Visit [securityheaders.com](https://securityheaders.com)
   - Enter your production URL
   - Verify you have A or A+ rating

## Security Checklist

Before going live, verify:

- [ ] All environment variables are set in production
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is kept secret (never in client code)
- [ ] `GITHUB_CLIENT_SECRET` is kept secret
- [ ] `STRIPE_SECRET_KEY` is kept secret
- [ ] GitHub OAuth callback URL matches production domain
- [ ] Stripe webhook endpoint is configured for production
- [ ] RLS policies are enabled on all Supabase tables
- [ ] HTTPS is enabled (automatic with Vercel)
- [ ] Rate limiting is working (test with multiple requests)
- [ ] Error logs don't expose sensitive data
- [ ] Security headers are present (check in browser DevTools)
- [ ] OpenAI usage limits are set to prevent bill shock

## Monitoring & Maintenance

### Recommended Monitoring

1. **Error Tracking**: Set up [Sentry](https://sentry.io) or similar
2. **Uptime Monitoring**: Use [UptimeRobot](https://uptimerobot.com) or Vercel Analytics
3. **Cost Monitoring**:
   - OpenAI usage dashboard
   - Stripe revenue dashboard
   - Supabase database size

### Regular Maintenance

1. **Weekly**:
   - Check OpenAI costs
   - Review error logs
   - Monitor Stripe subscriptions

2. **Monthly**:
   - Update dependencies (`npm update`)
   - Review and rotate API keys if needed
   - Check database size and optimize if needed

## Troubleshooting

### Common Issues

**Issue**: "Not authenticated" errors
- Check cookies are being set (httpOnly, secure, sameSite)
- Verify domain matches between OAuth app and deployment

**Issue**: "Stripe webhook failed"
- Verify webhook secret matches Stripe dashboard
- Check webhook endpoint is publicly accessible
- Review Stripe webhook logs for error details

**Issue**: Rate limit not working
- Rate limiting is in-memory, resets on server restart
- For multi-instance deployments, consider Upstash Redis

**Issue**: Database permission errors
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set correctly
- Check RLS policies are properly configured
- Review Supabase logs for detailed errors

## Scaling Considerations

When you outgrow the basic setup:

1. **Rate Limiting**: Migrate to [Upstash Redis](https://upstash.com) for distributed rate limiting
2. **Caching**: Add Redis cache for GitHub API responses
3. **Queue System**: Use [Inngest](https://www.inngest.com) or similar for background changelog generation
4. **Database**: Monitor Supabase usage and upgrade plan as needed

## Support

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review logs in Vercel dashboard
3. Check Supabase logs for database errors
4. Review Stripe webhook logs for payment issues

---

**🎉 Congratulations!** Your ShipNotes instance is now ready for production use.
