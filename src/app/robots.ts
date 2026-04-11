import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.cm8vvip.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/api/media/'],
        disallow: [
          '/luckyspin-admin/',
          '/luckyspin-admin/dashboard',
          '/wheel-dashboard',
          '/test',
          '/chat',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
