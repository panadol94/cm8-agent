/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: 'https://www.cm8vvip.com',
  generateRobotsTxt: true,
  outDir: './public',
  generateIndexSitemap: false,
  additionalPaths: async () => {
    return [
      {
        loc: '/wheel',
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.8,
      },
      {
        loc: '/wheel-dashboard',
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.3,
      },
      {
        loc: '/blog/apa-itu-cm8-vvip',
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.8,
      },
      {
        loc: '/blog/cara-daftar-cm8-vvip',
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.8,
      },
      // Batch 2 new articles
      {
        loc: '/blog/faq-cm8-vvip',
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.7,
      },
      {
        loc: '/blog/panduan-cm8-biasa-vs-vvip',
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.7,
      },
    ]
  },
}

export default config
