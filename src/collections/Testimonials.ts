import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'income', 'featured', 'updatedAt'],
    description: 'Testimoni agent & paparan pendapatan untuk homepage.',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nama',
    },
    {
      name: 'role',
      type: 'text',
      label: 'Peranan',
      defaultValue: 'Agent Aktif',
    },
    {
      name: 'content',
      type: 'textarea',
      label: 'Testimoni',
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      label: 'Gambar Profil',
    },
    {
      name: 'avatarUrl',
      type: 'text',
      label: 'Avatar URL (External)',
      admin: {
        description: 'URL gambar luaran untuk avatar.',
      },
    },
    {
      name: 'rating',
      type: 'number',
      label: 'Rating',
      min: 1,
      max: 5,
      defaultValue: 5,
    },
    // Income showcase fields
    {
      name: 'income',
      type: 'text',
      label: 'Pendapatan',
      admin: {
        description: 'Contoh: RM4,200',
      },
    },
    {
      name: 'period',
      type: 'text',
      label: 'Tempoh',
      defaultValue: '/minggu',
    },
    {
      name: 'growth',
      type: 'text',
      label: 'Pertumbuhan',
      admin: {
        description: 'Contoh: +32%',
      },
    },
    {
      name: 'bar',
      type: 'number',
      label: 'Progress Bar (%)',
      min: 0,
      max: 100,
      admin: {
        description: 'Lebar bar pendapatan dalam peratus.',
      },
    },
    {
      name: 'type',
      type: 'select',
      label: 'Jenis',
      options: [
        { label: 'Paparan Pendapatan', value: 'income' },
        { label: 'Testimoni', value: 'testimonial' },
      ],
      defaultValue: 'income',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Paparkan di Homepage',
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
      },
    },
  ],
}
