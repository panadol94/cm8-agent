/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://cm8vvip.com',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  robotsTxtOptions: {
    additionalSitemaps: [],
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api'],
      },
    ],
  },
  additionalPaths: async () => {
    return [
      { loc: '/', changefreq: 'daily', priority: 1.0 },
      { loc: '/register', changefreq: 'weekly', priority: 0.9 },
      { loc: '/about', changefreq: 'monthly', priority: 0.7 },
      { loc: '/benefits', changefreq: 'monthly', priority: 0.8 },
      { loc: '/blog', changefreq: 'daily', priority: 0.8 },
    ]
  },
}
