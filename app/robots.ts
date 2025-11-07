import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/settings/'],
      },
      {
        userAgent: 'GPTBot', // OpenAI's crawler
        allow: '/',
      },
      {
        userAgent: 'ChatGPT-User', // ChatGPT search
        allow: '/',
      },
      {
        userAgent: 'PerplexityBot', // Perplexity AI
        allow: '/',
      },
      {
        userAgent: 'ClaudeBot', // Anthropic's crawler
        allow: '/',
      },
    ],
    sitemap: 'https://shipnotes.xyz/sitemap.xml',
  }
}
