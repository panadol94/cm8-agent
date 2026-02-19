import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Agents } from './collections/Agents'
import { Testimonials } from './collections/Testimonials'
import { FAQs } from './collections/FAQs'
import { BlogPosts } from './collections/BlogPosts'
import { Providers } from './collections/Providers'
import { Banners } from './collections/Banners'
import { Promos } from './collections/Promos'
import { PatchProviders } from './collections/PatchProviders'
import { Games } from './collections/Games'
import { CommissionTiers } from './collections/CommissionTiers'
import { NotificationsLog } from './collections/NotificationsLog'
import { SiteSettings } from './globals/SiteSettings'
import { PopupAnnouncement } from './globals/PopupAnnouncement'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      beforeDashboard: ['./app/(payload)/DashboardCards'],
    },
    livePreview: {
      url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      globals: ['site-settings'],
      collections: ['banners', 'promos', 'faqs', 'testimonials', 'providers'],
      breakpoints: [
        { label: '📱 Mobile', name: 'mobile', width: 375, height: 667 },
        { label: '💻 Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
    meta: {
      titleSuffix: ' | CM8 VVIP Admin',
      title: 'CM8 VVIP Admin',
      description: 'Panel pentadbiran CM8 VVIP — urus agent, komisyen, dan kandungan laman.',
      icons: [{ url: '/cm8-logo.png', type: 'image/png' }],
      openGraph: {
        title: 'CM8 VVIP Admin Panel',
        description: 'Panel pentadbiran CM8 VVIP',
        images: [{ url: '/og-image.jpg' }],
      },
    },
  },
  collections: [
    Users,
    Media,
    Agents,
    Testimonials,
    FAQs,
    BlogPosts,
    Providers,
    Banners,
    Promos,
    PatchProviders,
    Games,
    CommissionTiers,
    NotificationsLog,
  ],
  globals: [SiteSettings, PopupAnnouncement],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    push: true,
  }),
  sharp,
  plugins: [],
  cors: ['https://cm8vvip.com', 'http://localhost:3000'],
})
