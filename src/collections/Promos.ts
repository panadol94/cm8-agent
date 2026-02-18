import type { CollectionConfig } from 'payload'

export const Promos: CollectionConfig = {
  slug: 'promos',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'highlight', 'order', 'updatedAt'],
    description: 'Kad promosi yang dipaparkan di homepage.',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Tajuk Promosi',
    },
    {
      name: 'items',
      type: 'array',
      label: 'Senarai Poin',
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          label: 'Teks',
        },
      ],
    },
    {
      name: 'ctaText',
      type: 'text',
      label: 'Teks Butang CTA',
      defaultValue: 'Claim Now',
    },
    {
      name: 'ctaLink',
      type: 'text',
      label: 'Link CTA',
    },
    {
      name: 'icon',
      type: 'select',
      label: 'Ikon',
      options: [
        { label: '💡 Bonus', value: 'bonus' },
        { label: '⭐ Star', value: 'star' },
        { label: '👑 VIP', value: 'vip' },
      ],
      defaultValue: 'bonus',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'highlight',
      type: 'checkbox',
      label: 'Highlight (Featured)',
      defaultValue: false,
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
