# ShipNotes - AI-Powered Changelog Generator

Turn your messy Git commits into beautiful, professional changelogs in seconds with AI.

## Features

- **GitHub Integration**: Connect with GitHub OAuth to access your repositories
- **Smart Commit Parsing**: Automatically categorizes commits using conventional commit standards
- **AI-Powered Rewriting**: Transforms technical commits into user-friendly release notes
- **Multiple Export Formats**: Download as Markdown, copy to clipboard, or export as HTML
- **Usage Tracking**: Free tier includes 3 changelog generations
- **Dark Mode UI**: Beautiful, developer-friendly interface

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Authentication**: GitHub OAuth
- **AI**: OpenAI GPT-4
- **Deployment**: Vercel-ready

## Quick Start

### Prerequisites

- Node.js 18+ installed
- GitHub account
- Supabase account (free tier works)
- OpenAI API key

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd shipnotes
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run this schema:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  github_id TEXT UNIQUE NOT NULL,
  github_username TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  subscription_status TEXT DEFAULT 'trial',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Changelogs table
CREATE TABLE changelogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  repo_name TEXT NOT NULL,
  repo_owner TEXT NOT NULL,
  commit_count INTEGER NOT NULL,
  technical_output TEXT NOT NULL,
  user_output TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Usage tracking table
CREATE TABLE usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_changelogs_user_id ON changelogs(user_id);
CREATE INDEX idx_usage_user_id ON usage(user_id);
CREATE INDEX idx_usage_action ON usage(action);
```

3. Get your project URL and anon key from Settings → API

### 3. Set Up GitHub OAuth

**IMPORTANT:** You need to set up TWO OAuth apps - one for development and one for production.

#### Development OAuth App

1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: ShipNotes (Development)
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback`
4. Click "Register application"
5. Copy your Client ID and generate a Client Secret

#### Production OAuth App

1. Create another OAuth App for production
2. Fill in:
   - **Application name**: ShipNotes
   - **Homepage URL**: `https://shipnotes.xyz`
   - **Authorization callback URL**: `https://shipnotes.xyz/api/auth/callback`
3. Copy the production Client ID and Client Secret

**Note:** You'll use the development credentials in `.env.local` and production credentials in Vercel environment variables.

### 4. Get OpenAI API Key

1. Go to [platform.openai.com](https://platform.openai.com)
2. Navigate to API keys
3. Create a new secret key
4. Copy the key (you won't be able to see it again!)

### 5. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Fill in your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret

OPENAI_API_KEY=your_openai_api_key
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
shipnotes/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/               # GitHub OAuth
│   │   ├── github/             # GitHub API endpoints
│   │   └── generate-changelog/ # Changelog generation
│   ├── dashboard/              # Repository list page
│   ├── repo/[owner]/[name]/    # Commit selection & generation
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   └── globals.css             # Global styles
├── components/
│   └── ui/                     # Reusable UI components
├── lib/
│   ├── supabase.ts             # Supabase client & helpers
│   ├── github.ts               # GitHub API utilities
│   ├── openai.ts               # OpenAI integration
│   ├── changelog-generator.ts  # Changelog logic
│   └── utils.ts                # Utility functions
└── public/                     # Static assets
```

## How It Works

1. **User Authentication**: Users sign in with GitHub OAuth
2. **Repository Selection**: View all accessible GitHub repositories
3. **Commit Analysis**: Fetch and filter commits from the last 30 days
4. **Changelog Generation**:
   - Technical version: Grouped by conventional commit types
   - User-friendly version: AI-rewritten for non-technical audiences
5. **Export Options**: Copy to clipboard or download as Markdown

## Development

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Update GitHub OAuth callback URL to your production domain
5. Deploy!

**Important**: Update your GitHub OAuth App settings with production URLs:
- Homepage URL: `https://yourdomain.com`
- Callback URL: `https://yourdomain.com/api/auth/callback`

## Usage Limits

- **Free Trial**: 3 changelog generations
- **Pro Plan**: Unlimited generations (implement Stripe integration)

## Future Enhancements

- [ ] Stripe payment integration
- [ ] Custom date range selection
- [ ] Multiple changelog styles (GitHub, Linear, Notion)
- [ ] Scheduled changelog generation
- [ ] Team collaboration features
- [ ] Webhook integration
- [ ] API access for programmatic generation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes.

## Troubleshooting

### GitHub OAuth "redirect_uri not associated" Error

If you see a GitHub error saying "The redirect_uri is not associated with this application":

1. Go to your GitHub OAuth App settings (GitHub → Settings → Developer settings → OAuth Apps)
2. Click on your ShipNotes app
3. Make sure the **Authorization callback URL** matches exactly:
   - For production: `https://shipnotes.xyz/api/auth/callback`
   - For development: `http://localhost:3000/api/auth/callback`
4. Save the changes
5. Make sure you're using the correct `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` for the environment (dev vs production)

### Stripe Webhook Not Working

1. Make sure your webhook endpoint URL is correct: `https://shipnotes.xyz/api/stripe/webhook`
2. Verify you've selected the correct events in Stripe dashboard
3. Check that `STRIPE_WEBHOOK_SECRET` matches the signing secret from Stripe
4. Look at webhook logs in Stripe dashboard for errors

## Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ by developers, for developers. Ship faster!**

Available at [shipnotes.xyz](https://shipnotes.xyz)
