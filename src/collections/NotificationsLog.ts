import type { CollectionConfig } from 'payload'

export const NotificationsLog: CollectionConfig = {
  slug: 'notifications-log',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'channel', 'status', 'createdAt'],
    description: 'Log semua notifikasi yang dihantar (Telegram, WhatsApp).',
  },
  access: {
    create: () => true, // Allow system to create
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Tajuk',
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      label: 'Mesej',
    },
    {
      name: 'channel',
      type: 'select',
      label: 'Saluran',
      options: [
        { label: 'Telegram', value: 'telegram' },
        { label: 'WhatsApp', value: 'whatsapp' },
        { label: 'Email', value: 'email' },
      ],
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      options: [
        { label: 'Dihantar', value: 'sent' },
        { label: 'Gagal', value: 'failed' },
        { label: 'Pending', value: 'pending' },
      ],
      defaultValue: 'pending',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'recipient',
      type: 'text',
      label: 'Penerima',
      admin: {
        description: 'Chat ID, nombor telefon, atau email penerima.',
      },
    },
    {
      name: 'relatedAgent',
      type: 'relationship',
      relationTo: 'agents',
      label: 'Agent Berkaitan',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'errorMessage',
      type: 'textarea',
      label: 'Mesej Ralat',
      admin: {
        description: 'Mesej ralat jika status gagal.',
        condition: (data) => data?.status === 'failed',
      },
    },
  ],
}
