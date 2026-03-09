import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Media',
    plural: 'Galeri Media',
  },
  access: {
    read: () => true,
  },
  admin: {
    group: '⚙️ Sistem',
    description: 'Semua gambar dan fail media untuk website. Gunakan kategori untuk susun.',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Alt Text (SEO)',
      admin: {
        description: 'Penerangan gambar untuk SEO dan accessibility.',
        placeholder: 'cth: Logo CM8 VVIP berwarna emas',
      },
    },
    // Sidebar
    {
      name: 'category',
      type: 'select',
      label: '📁 Kategori',
      options: [
        { label: '🖼️ Banner', value: 'banner' },
        { label: '👤 Avatar', value: 'avatar' },
        { label: '📝 Blog', value: 'blog' },
        { label: '🎮 Provider Logo', value: 'provider' },
        { label: '🎰 Game', value: 'game' },
        { label: '📦 Lain-lain', value: 'other' },
      ],
      defaultValue: 'other',
      admin: {
        position: 'sidebar',
      },
    },
  ],
  upload: {
    staticDir: 'media',
    // Generate these image sizes only for images, videos are kept as is
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 512,
        position: 'centre',
      },
      {
        name: 'mobileBanner',
        width: 800,
        height: 450,
        position: 'centre',
      },
      {
        name: 'banner',
        width: 1920,
        height: 640,
        position: 'centre',
      },
    ],
    mimeTypes: ['image/*', 'video/*'],
  },
}
