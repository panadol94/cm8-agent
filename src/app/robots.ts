import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.cm8vvip.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/api/media/'],
        disallow: [
          '/admin/',
          '/api/',
          '/checkin-dashboard/',
          '/event-dashboard/',
          '/lucky-pick-dashboard/',
          '/lucky-wheel-dashboard/',
          '/scratch-dashboard/',
          '/wheel-dashboard/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
