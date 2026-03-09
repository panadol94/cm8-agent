import { MetadataRoute } from 'next'

// Blog post slugs — keep in sync with blog page data
const blogSlugs = [
  'cara-guna-scanner-ai-mega888',
  'bisnes-online-tiada-modal',
  'rahsia-tarik-high-roller',
  'adakah-agent-cm8-selamat',
  'cara-jadi-agent-cm8-berjaya',
  'komisyen-tinggi-platform-cm8',
  'pendapatan-pasif-agent-downline',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.cm8vvip.com'

  // Main pages (public, indexable)
  const routes = [
    { path: '', priority: 1, changeFrequency: 'daily' as const },
    { path: '/buat-duit-online', priority: 0.8, changeFrequency: 'daily' as const },
    { path: '/komisen-tanpa-modal', priority: 0.8, changeFrequency: 'daily' as const },
    { path: '/kiosk-mega888', priority: 0.8, changeFrequency: 'daily' as const },
    { path: '/kiosk-918kiss', priority: 0.8, changeFrequency: 'daily' as const },
    { path: '/agent-judi', priority: 0.8, changeFrequency: 'daily' as const },
    { path: '/hack-slot-malaysia', priority: 0.8, changeFrequency: 'daily' as const },
    { path: '/register', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/benefits', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/info', priority: 0.6, changeFrequency: 'weekly' as const },
    { path: '/about', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/blog', priority: 0.7, changeFrequency: 'daily' as const },
    { path: '/cm8', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/cm8-play', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/patch-id', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/lucky-wheel', priority: 0.6, changeFrequency: 'weekly' as const },
    { path: '/checkin', priority: 0.6, changeFrequency: 'daily' as const },
  ].map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))

  // Blog article pages
  const blogRoutes = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...routes, ...blogRoutes]
}
