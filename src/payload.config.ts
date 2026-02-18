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
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' | CM8 VVIP Admin',
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
  ],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [],
  cors: ['https://cm8vvip.com', 'http://localhost:3000'],
})
