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
  'cm8-malaysia-agent-slot-terbaik',
  'cara-daftar-agent-cm8',
  'slot-malaysia-strategi-menang',
  'cm8-vs-platform-lain',
  'jana-pendapatan-online-agent-slot',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.cm8vvip.com'

  // Main public pages (indexable only — NO dashboards, NO internal tools)
  const routes = [
    { path: '/', priority: 1, changeFrequency: 'daily' as const },
    { path: '/register', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/buat-duit-online', priority: 0.8, changeFrequency: 'daily' as const },
    { path: '/komisen-tanpa-modal', priority: 0.8, changeFrequency: 'daily' as const },
    { path: '/kiosk-mega888', priority: 0.8, changeFrequency: 'daily' as const },
    { path: '/kiosk-918kiss', priority: 0.8, changeFrequency: 'daily' as const },
    { path: '/agent-judi', priority: 0.8, changeFrequency: 'daily' as const },
    { path: '/hack-slot-malaysia', priority: 0.8, changeFrequency: 'daily' as const },
    { path: '/blog', priority: 0.8, changeFrequency: 'daily' as const },
    { path: '/benefits', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/cm8', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/cm8-play', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/wheel', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/checkin', priority: 0.6, changeFrequency: 'daily' as const },
    { path: '/info', priority: 0.6, changeFrequency: 'weekly' as const },
    { path: '/about', priority: 0.6, changeFrequency: 'monthly' as const },
    // Trust / legal pages
    { path: '/privacy-policy', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/terms', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/contact', priority: 0.5, changeFrequency: 'monthly' as const },
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
