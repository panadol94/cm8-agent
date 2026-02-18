import type { CollectionConfig } from 'payload'

export const Games: CollectionConfig = {
  slug: 'games',
  labels: {
    singular: 'Permainan',
    plural: 'Senarai Permainan',
  },
  admin: {
    useAsTitle: 'name',
    group: '🎮 Permainan',
    defaultColumns: ['name', 'provider', 'updatedAt'],
    listSearchableFields: ['name', 'provider'],
    description:
      'Senarai permainan slot untuk Patch ID Scanner. Setiap game mesti ada Provider ID.',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: '🎰 Nama Permainan',
          admin: {
            placeholder: 'cth: Sweet Bonanza',
            width: '50%',
          },
        },
        {
          name: 'provider',
          type: 'text',
          required: true,
          label: 'Provider ID',
          admin: {
            description: 'Mesti sama dengan Provider ID dalam Patch Providers.',
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
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: '🖼️ Gambar (Upload)',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'imageUrl',
          type: 'text',
          label: '🔗 Gambar URL (External)',
          admin: {
            description: 'Guna URL luaran jika tiada upload. Salah satu sahaja diperlukan.',
            placeholder: 'https://example.com/game-image.png',
            width: '50%',
          },
        },
      ],
    },
  ],
}
