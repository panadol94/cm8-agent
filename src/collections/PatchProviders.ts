import type { CollectionConfig } from 'payload'

export const PatchProviders: CollectionConfig = {
  slug: 'patch-providers',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'providerId', 'order', 'active', 'updatedAt'],
    description: 'Provider untuk Patch ID Scanner (Pragmatic, JILI, dll).',
  },
  fields: [
    {
      name: 'providerId',
      type: 'text',
      required: true,
      unique: true,
      label: 'Provider ID',
      admin: {
        description: 'ID unik, cth: pragmatic, jili, hacksaw',
      },
    },
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
