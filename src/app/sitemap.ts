import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cm8vvip.com'

  const routes = [
    '',
    '/buat-duit-online',
    '/komisen-tanpa-modal',
    '/ejen-slot',
    '/kiosk-mega888',
    '/agent-judi',
    '/patch-id',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  return [...routes]
}
