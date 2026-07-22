import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://promptpilot.dev'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dashboard/', '/editor/', '/settings/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
