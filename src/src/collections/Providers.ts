import type { CollectionConfig } from 'payload'

export const Providers: CollectionConfig = {
  slug: 'providers',
  labels: {
    singular: 'Provider',
    plural: 'Provider Homepage',
  },
  admin: {
    useAsTitle: 'name',
    group: '🎮 Permainan',
    defaultColumns: ['name', 'showOnHomepage', 'order', 'updatedAt'],
    listSearchableFields: ['name'],
    description:
      'Provider permainan yang dipaparkan di homepage. Toggle "Papar di Homepage" untuk kawal visibility.',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nama Provider',
      admin: {
        placeholder: 'cth: Pragmatic Play',
      },
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
      name: 'showOnHomepage',
      type: 'checkbox',
      label: '🏠 Papar di Homepage',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
