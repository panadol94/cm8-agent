import type { CollectionConfig } from 'payload'

export const FAQs: CollectionConfig = {
  slug: 'faqs',
  admin: {
    useAsTitle: 'question',
    description: 'Soalan lazim (FAQ) untuk website.',
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
      label: 'Soalan',
    },
    {
      name: 'answer',
      type: 'textarea',
      required: true,
      label: 'Jawapan',
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
      name: 'category',
      type: 'select',
      label: 'Kategori',
      options: [
        { label: 'Umum', value: 'general' },
        { label: 'Agent', value: 'agent' },
        { label: 'Komisyen', value: 'commission' },
        { label: 'Teknikal', value: 'technical' },
      ],
      defaultValue: 'general',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
