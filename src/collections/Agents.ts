import type { CollectionConfig } from 'payload'

export const Agents: CollectionConfig = {
  slug: 'agents',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'whatsapp', 'status', 'createdAt'],
    description: 'Senarai agent yang mendaftar melalui website.',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nama Penuh',
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      label: 'Nombor Telefon',
    },
    {
      name: 'whatsapp',
      type: 'text',
      label: 'Nombor WhatsApp',
    },
    {
      name: 'experience',
      type: 'select',
      label: 'Pengalaman',
      options: [
        { label: 'Baru (Tiada Pengalaman)', value: 'baru' },
        { label: 'Berpengalaman', value: 'berpengalaman' },
      ],
      defaultValue: 'baru',
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Mesej Tambahan',
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Dihubungi', value: 'contacted' },
        { label: 'Diluluskan', value: 'approved' },
        { label: 'Ditolak', value: 'rejected' },
      ],
      defaultValue: 'pending',
      admin: {
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation }) => {
        if (operation === 'create') {
          const botToken = process.env.TELEGRAM_BOT_TOKEN
          const chatId = process.env.TELEGRAM_CHAT_ID

          if (botToken && chatId) {
            const message = [
              '🆕 <b>Agent Baru Mendaftar!</b>',
              '',
              `👤 <b>Nama:</b> ${doc.name}`,
              `📱 <b>Phone:</b> ${doc.phone}`,
              doc.whatsapp ? `💬 <b>WhatsApp:</b> ${doc.whatsapp}` : '',
              `📊 <b>Pengalaman:</b> ${doc.experience === 'berpengalaman' ? 'Berpengalaman' : 'Baru'}`,
              doc.message ? `📝 <b>Mesej:</b> ${doc.message}` : '',
              '',
              `🔗 <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://cm8vvip.com'}/admin/collections/agents/${doc.id}">Lihat di Admin</a>`,
            ]
              .filter(Boolean)
              .join('\n')

            try {
              await fetch(
                `https://api.telegram.org/bot${botToken}/sendMessage`,
                {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: 'HTML',
                  }),
                },
              )
            } catch (error) {
              console.error('Telegram notification failed:', error)
            }
          }
        }
      },
    ],
  },
}
