import type { CollectionConfig } from 'payload'

export const Promos: CollectionConfig = {
  slug: 'promos',
  labels: {
    singular: 'Promosi',
    plural: 'Senarai Promosi',
  },
  admin: {
    useAsTitle: 'title',
    group: '📝 Kandungan',
    defaultColumns: ['title', 'icon', 'highlight', 'order', 'updatedAt'],
    listSearchableFields: ['title'],
    description: 'Kad promosi yang dipaparkan di homepage. Toggle "Highlight" untuk featured.',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Tajuk Promosi',
      admin: {
        placeholder: 'cth: Bonus Selamat Datang',
      },
    },
    {
      name: 'items',
      type: 'array',
      label: 'Senarai Poin',
      labels: {
        singular: 'Poin',
        plural: 'Poin',
      },
      admin: {
        description: 'Poin-poin yang dipapar dalam kad promosi.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          label: 'Teks',
          admin: {
            placeholder: 'cth: Bonus 100% first deposit',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'ctaText',
          type: 'text',
          label: 'Teks Butang CTA',
          defaultValue: 'Claim Now',
          admin: {
            placeholder: 'cth: Claim Now',
            width: '50%',
          },
        },
        {
          name: 'ctaLink',
          type: 'text',
          label: 'Link CTA',
          admin: {
            placeholder: 'cth: https://wa.me/60123456789',
            description: 'URL yang dibuka apabila butang diklik.',
            width: '50%',
          },
        },
      ],
    },
    // Sidebar
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
      label: '⭐ Highlight (Featured)',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Aktifkan untuk jadikan kad ini lebih menonjol.',
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
