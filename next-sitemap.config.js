/** @type {import('next-sitemap').IConfig} */
module.exports = {
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
    ]
  },
}
