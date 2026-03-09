import type { CollectionConfig } from 'payload'

export const NotificationsLog: CollectionConfig = {
  slug: 'notifications-log',
  labels: {
    singular: 'Log Notifikasi',
    plural: 'Log Notifikasi',
  },
  admin: {
    useAsTitle: 'title',
    group: '👥 Pengurusan Agent',
    defaultColumns: ['title', 'channel', 'status', 'recipient', 'createdAt'],
    listSearchableFields: ['title', 'recipient'],
    description:
      'Log semua notifikasi yang dihantar (Telegram, WhatsApp, Email). Filter mengikut saluran atau status.',
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
      label: 'Tajuk Notifikasi',
      admin: {
        placeholder: 'cth: Agent Baru Mendaftar',
      },
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      label: 'Mesej',
      admin: {
        description: 'Kandungan yang dihantar.',
      },
    },
    {
      name: 'recipient',
      type: 'text',
      label: '📬 Penerima',
      admin: {
        description: 'Chat ID, nombor telefon, atau email penerima.',
        placeholder: 'cth: 60123456789 atau chat_id',
      },
    },
    // Sidebar
    {
      name: 'channel',
      type: 'select',
      label: '📡 Saluran',
      options: [
        { label: '✈️ Telegram', value: 'telegram' },
        { label: '💬 WhatsApp', value: 'whatsapp' },
        { label: '📧 Email', value: 'email' },
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
        { label: '✅ Dihantar', value: 'sent' },
        { label: '❌ Gagal', value: 'failed' },
        { label: '🟡 Pending', value: 'pending' },
      ],
      defaultValue: 'pending',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'relatedAgent',
      type: 'relationship',
      relationTo: 'agents',
      label: '👤 Agent Berkaitan',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'errorMessage',
      type: 'textarea',
      label: '⚠️ Mesej Ralat',
      admin: {
        description: 'Mesej ralat jika notifikasi gagal dihantar.',
        condition: (data) => data?.status === 'failed',
      },
    },
  ],
}
