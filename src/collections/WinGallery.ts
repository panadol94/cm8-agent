import type { CollectionConfig } from 'payload'

export const WinGallery: CollectionConfig = {
  slug: 'win-gallery',
  labels: {
    singular: 'Win Screenshot',
    plural: 'Win Gallery',
  },
  admin: {
    useAsTitle: 'playerName',
    group: '📝 Kandungan',
    defaultColumns: ['playerName', 'amount', 'gameName', 'active', 'order'],
    listSearchableFields: ['playerName', 'gameName'],
    description: 'Screenshot kemenangan pemain CM8 untuk dipapar di homepage gallery.',
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: '📱 Screenshot Kemenangan',
      admin: {
        description: 'Upload screenshot telefon (portrait/vertical). Saiz disyorkan: 1080 x 1920.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'playerName',
          type: 'text',
          label: 'Provider',
          admin: {
            placeholder: 'cth: Pragmatic Play',
            description: 'Nama provider (optional). Dipapar di overlay bawah gambar.',
            width: '33%',
          },
        },
        {
          name: 'amount',
          type: 'text',
          label: 'Jumlah Menang',
          admin: {
            placeholder: 'cth: RM4,160',
            description: 'Jumlah kemenangan (optional).',
            width: '33%',
          },
        },
        {
          name: 'gameName',
          type: 'text',
          label: 'Nama Game',
          admin: {
            placeholder: 'cth: Pho Sho',
            description: 'Nama game yang dimainkan (optional).',
            width: '33%',
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
