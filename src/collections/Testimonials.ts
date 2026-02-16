import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'name',
    description: 'Testimoni dari agent yang berjaya.',
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
      required: true,
      label: 'Testimoni',
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      label: 'Gambar Profil',
    },
    {
      name: 'rating',
      type: 'number',
      label: 'Rating',
      min: 1,
      max: 5,
      defaultValue: 5,
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
  ],
}
