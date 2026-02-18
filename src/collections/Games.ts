import type { CollectionConfig } from 'payload'

export const Games: CollectionConfig = {
  slug: 'games',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'provider', 'updatedAt'],
    description: 'Senarai permainan slot untuk Patch ID Scanner.',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nama Permainan',
    },
    {
      name: 'provider',
      type: 'text',
      required: true,
      label: 'Provider ID',
      admin: {
        description:
          'ID provider, cth: pragmatic, jili, hacksaw. Mesti sama dengan Provider ID dalam Patch Providers.',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Gambar (Upload)',
    },
    {
      name: 'imageUrl',
      type: 'text',
      label: 'Gambar URL (External)',
      admin: {
        description: 'URL gambar luaran. Digunakan jika tiada upload.',
      },
    },
  ],
}
