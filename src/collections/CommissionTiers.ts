import type { CollectionConfig } from 'payload'

export const CommissionTiers: CollectionConfig = {
  slug: 'commission-tiers',
  labels: {
    singular: 'Tier Komisyen',
    plural: 'Struktur Komisyen',
  },
  admin: {
    useAsTitle: 'name',
    group: '👥 Pengurusan Agent',
    defaultColumns: ['name', 'percentage', 'minDownline', 'icon', 'active'],
    listSearchableFields: ['name'],
    description: 'Struktur komisyen mengikut tier agent. Dipaparkan di homepage sebagai kad tier.',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Nama Tier',
          admin: {
            description: 'Contoh: Agent Biasa, Senior Agent, Master Agent',
            placeholder: 'cth: Master Agent',
            width: '50%',
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
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'minDownline',
          type: 'number',
          label: 'Minimum Downline',
          defaultValue: 0,
          admin: {
            description: 'Jumlah minimum downline untuk layak tier ini.',
            width: '50%',
          },
        },
        {
          name: 'color',
          type: 'text',
          label: '🎨 Warna Badge',
          defaultValue: '#d4a853',
          admin: {
            description: 'Warna hex untuk badge tier di frontend. Contoh: #d4a853',
            placeholder: '#d4a853',
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'benefits',
      type: 'array',
      label: 'Kelebihan Tier',
      labels: {
        singular: 'Kelebihan',
        plural: 'Kelebihan',
      },
      admin: {
        description: 'Senarai kelebihan yang dipapar di kad tier.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          label: 'Kelebihan',
          admin: {
            placeholder: 'cth: Komisyen 45% setiap jualan',
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
      },
    },
  ],
}
