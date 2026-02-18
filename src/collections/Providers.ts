import type { CollectionConfig } from 'payload'

export const Providers: CollectionConfig = {
  slug: 'providers',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'order', 'showOnHomepage', 'updatedAt'],
    description: 'Provider permainan yang dipaparkan di homepage.',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nama Provider',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo (Upload)',
    },
    {
      name: 'logoUrl',
      type: 'text',
      label: 'Logo URL (External)',
      admin: {
        description: 'URL gambar luaran. Digunakan jika tiada upload.',
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
      name: 'showOnHomepage',
      type: 'checkbox',
      label: 'Papar di Homepage',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
