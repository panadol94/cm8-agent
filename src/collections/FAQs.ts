import type { CollectionConfig } from 'payload'

export const FAQs: CollectionConfig = {
  slug: 'faqs',
  labels: {
    singular: 'FAQ',
    plural: 'Soalan Lazim (FAQ)',
  },
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'category', 'order'],
    listSearchableFields: ['question', 'answer'],
    description: 'Soalan lazim (FAQ) untuk website. Filter mengikut kategori.',
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
      label: '❓ Soalan',
      admin: {
        placeholder: 'cth: Bagaimana cara jadi agent CM8?',
      },
    },
    {
      name: 'answer',
      type: 'textarea',
      required: true,
      label: '💬 Jawapan',
      admin: {
        placeholder: 'Tulis jawapan yang jelas dan ringkas...',
      },
    },
    // Sidebar
    {
      name: 'category',
      type: 'select',
      label: '📁 Kategori',
      options: [
        { label: '🌐 Umum', value: 'general' },
        { label: '👥 Agent', value: 'agent' },
        { label: '💰 Komisyen', value: 'commission' },
        { label: '⚙️ Teknikal', value: 'technical' },
      ],
      defaultValue: 'general',
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
