import type { CollectionConfig } from 'payload'

export const Banners: CollectionConfig = {
  slug: 'banners',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'order', 'active', 'updatedAt'],
    description: 'Banner carousel di bahagian atas homepage.',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Tajuk',
      admin: {
        description: 'Nama dalaman untuk mengenal pasti banner.',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Gambar Banner',
    },
    {
      name: 'link',
      type: 'text',
      label: 'Link (Optional)',
      admin: {
        description: 'URL apabila banner diklik.',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Susunan',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      label: 'Aktif',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
