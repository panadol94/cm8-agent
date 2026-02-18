import type { CollectionConfig } from 'payload'

export const CommissionTiers: CollectionConfig = {
  slug: 'commission-tiers',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'percentage', 'minDownline', 'order', 'active'],
    description: 'Struktur komisyen mengikut tier agent. Dipaparkan di homepage.',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nama Tier',
      admin: {
        description: 'Contoh: Agent Biasa, Senior Agent, Master Agent',
      },
    },
    {
      name: 'percentage',
      type: 'number',
      required: true,
      label: 'Komisyen (%)',
      min: 0,
      max: 100,
      admin: {
        description: 'Peratusan komisyen. Contoh: 25, 35, 45',
      },
    },
    {
      name: 'minDownline',
      type: 'number',
      label: 'Minimum Downline',
      defaultValue: 0,
      admin: {
        description: 'Jumlah minimum downline untuk layak tier ini.',
      },
    },
    {
      name: 'benefits',
      type: 'array',
      label: 'Kelebihan Tier',
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          label: 'Kelebihan',
        },
      ],
    },
    {
      name: 'color',
      type: 'text',
      label: 'Warna Badge',
      defaultValue: '#d4a853',
      admin: {
        description: 'Warna hex untuk badge tier di frontend. Contoh: #d4a853',
      },
    },
    {
      name: 'icon',
      type: 'select',
      label: 'Ikon',
      options: [
        { label: '⭐ Bintang', value: 'star' },
        { label: '👑 Mahkota', value: 'crown' },
        { label: '💎 Berlian', value: 'diamond' },
        { label: '🚀 Roket', value: 'rocket' },
      ],
      defaultValue: 'star',
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
    {
      name: 'active',
      type: 'checkbox',
      label: 'Aktif',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
