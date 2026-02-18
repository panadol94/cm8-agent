import type { CollectionConfig } from 'payload'

export const PatchProviders: CollectionConfig = {
  slug: 'patch-providers',
  labels: {
    singular: 'Patch Provider',
    plural: 'Patch Providers',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'providerId', 'active', 'order', 'updatedAt'],
    listSearchableFields: ['name', 'providerId'],
    description:
      'Provider untuk Patch ID Scanner (Pragmatic, JILI, dll). Setiap provider ada ID unik.',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Nama Provider',
          admin: {
            placeholder: 'cth: Pragmatic Play',
            width: '50%',
          },
        },
        {
          name: 'providerId',
          type: 'text',
          required: true,
          unique: true,
          label: '🔑 Provider ID',
          admin: {
            description: 'ID unik yang digunakan oleh system. Huruf kecil sahaja.',
            placeholder: 'cth: pragmatic, jili, hacksaw',
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          label: '🖼️ Logo (Upload)',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'logoUrl',
          type: 'text',
          label: '🔗 Logo URL (External)',
          admin: {
            description: 'Guna URL luaran jika tiada upload.',
            placeholder: 'https://example.com/logo.png',
            width: '50%',
          },
        },
      ],
    },
    // Sidebar
    {
      name: 'order',
      type: 'number',
      label: 'Susunan',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Nombor kecil = papar dulu.',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      label: '✅ Aktif',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Nyahaktif untuk sembunyikan tanpa delete.',
      },
    },
  ],
}
