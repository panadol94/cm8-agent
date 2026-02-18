import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  admin: {
    description: 'Gambar dan fail media untuk website.',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Alt Text',
    },
    {
      name: 'category',
      type: 'select',
      label: 'Kategori',
      options: [
        { label: 'Banner', value: 'banner' },
        { label: 'Avatar', value: 'avatar' },
        { label: 'Blog', value: 'blog' },
        { label: 'Provider Logo', value: 'provider' },
        { label: 'Game', value: 'game' },
        { label: 'Lain-lain', value: 'other' },
      ],
      defaultValue: 'other',
      admin: {
        position: 'sidebar',
      },
    },
  ],
  upload: {
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
        name: 'banner',
        width: 1920,
        height: 640,
        position: 'centre',
      },
    ],
    mimeTypes: ['image/*'],
  },
}
