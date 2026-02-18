import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: {
    singular: 'Testimoni',
    plural: 'Testimoni & Pendapatan',
  },
  admin: {
    useAsTitle: 'name',
    group: '📝 Kandungan',
    defaultColumns: ['name', 'type', 'income', 'featured', 'order'],
    listSearchableFields: ['name'],
    description: 'Testimoni agent & paparan pendapatan untuk homepage. Filter mengikut jenis.',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: '👤 Profil',
          description: 'Maklumat asas testimoni atau agent.',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  label: 'Nama',
                  admin: {
                    placeholder: 'cth: Aisyah binti Hassan',
                    width: '50%',
                  },
                },
                {
                  name: 'role',
                  type: 'text',
                  label: 'Peranan',
                  defaultValue: 'Agent Aktif',
                  admin: {
                    placeholder: 'cth: Agent Aktif, Senior Agent',
                    width: '50%',
                  },
                },
              ],
            },
            {
              name: 'content',
              type: 'textarea',
              label: 'Testimoni',
              admin: {
                placeholder: 'Tulis testimoni agent di sini...',
                description: 'Testimoni yang diberikan oleh agent. Dipaparkan di homepage.',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'avatar',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Gambar Profil (Upload)',
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'avatarUrl',
                  type: 'text',
                  label: 'Avatar URL (External)',
                  admin: {
                    description: 'Guna URL luaran jika tiada upload. Salah satu sahaja diperlukan.',
                    placeholder: 'https://example.com/avatar.jpg',
                    width: '50%',
                  },
                },
              ],
            },
            {
              name: 'rating',
              type: 'number',
              label: '⭐ Rating',
              min: 1,
              max: 5,
              defaultValue: 5,
              admin: {
                description: 'Rating 1-5 bintang. Default: 5.',
              },
            },
          ],
        },
        {
          label: '💰 Pendapatan',
          description: 'Hanya perlu diisi jika jenis = Paparan Pendapatan.',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'income',
                  type: 'text',
                  label: 'Pendapatan',
                  admin: {
                    placeholder: 'cth: RM4,200',
                    description: 'Jumlah pendapatan yang dipaparkan.',
                    width: '33%',
                  },
                },
                {
                  name: 'period',
                  type: 'text',
                  label: 'Tempoh',
                  defaultValue: '/minggu',
                  admin: {
                    placeholder: 'cth: /minggu, /bulan',
                    width: '33%',
                  },
                },
                {
                  name: 'growth',
                  type: 'text',
                  label: 'Pertumbuhan',
                  admin: {
                    placeholder: 'cth: +32%',
                    description: 'Peratusan pertumbuhan pendapatan.',
                    width: '33%',
                  },
                },
              ],
            },
            {
              name: 'bar',
              type: 'number',
              label: 'Progress Bar (%)',
              min: 0,
              max: 100,
              admin: {
                description:
                  'Lebar bar pendapatan (0-100%). Dipapar sebagai visual bar di frontend.',
              },
            },
          ],
        },
      ],
    },
    // Sidebar
    {
      name: 'type',
      type: 'select',
      label: 'Jenis',
      options: [
        { label: '💰 Paparan Pendapatan', value: 'income' },
        { label: '💬 Testimoni', value: 'testimonial' },
      ],
      defaultValue: 'income',
      admin: {
        position: 'sidebar',
        description: 'Tentukan jenis entry ini.',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: '⭐ Paparkan di Homepage',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
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
  ],
}
