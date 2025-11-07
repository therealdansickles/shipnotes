import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ShipNotes - Translate Your Code for Every Team',
    short_name: 'ShipNotes',
    description: 'AI-powered tool that translates git commits into updates everyone understands',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#6366f1',
    icons: [
      {
        src: '/shipnotes-icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/shipnotes-icon-light.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['developer tools', 'productivity', 'business'],
  }
}
