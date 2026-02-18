import type { CollectionConfig } from 'payload'

export const Agents: CollectionConfig = {
  slug: 'agents',
  labels: {
    singular: 'Agent',
    plural: 'Senarai Agent',
  },
  access: {
    create: () => true, // Allow public registration
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'status', 'experience', 'createdAt'],
    listSearchableFields: ['name', 'phone', 'whatsapp'],
    description:
      'Senarai agent yang mendaftar melalui website. Gunakan filter untuk cari agent mengikut status.',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: '📋 Maklumat Asas',
          description: 'Maklumat pendaftaran agent.',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  label: 'Nama Penuh',
                  admin: {
                    placeholder: 'cth: Ahmad bin Ali',
                    width: '50%',
                  },
                },
                {
                  name: 'experience',
                  type: 'select',
                  label: 'Pengalaman',
                  options: [
                    { label: '🟢 Baru (Tiada Pengalaman)', value: 'baru' },
                    { label: '🔵 Berpengalaman', value: 'berpengalaman' },
                  ],
                  defaultValue: 'baru',
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'phone',
                  type: 'text',
                  required: true,
                  label: 'Nombor Telefon',
                  admin: {
                    placeholder: 'cth: 0123456789',
                    width: '50%',
                  },
                },
                {
                  name: 'whatsapp',
                  type: 'text',
                  label: 'Nombor WhatsApp',
                  admin: {
                    placeholder: 'cth: 60123456789 (jika berbeza)',
                    description: 'Kosongkan jika sama dengan nombor telefon.',
                    width: '50%',
                  },
                },
              ],
            },
            {
              name: 'message',
              type: 'textarea',
              label: 'Mesej Tambahan',
              admin: {
                description: 'Mesej yang ditulis oleh agent semasa pendaftaran.',
                placeholder: 'Apa-apa mesej dari agent...',
              },
            },
          ],
        },
        {
          label: '📝 Nota Admin',
          description: 'Nota dalaman untuk follow-up agent ini.',
          fields: [
            {
              name: 'notes',
              type: 'array',
              label: 'Nota Admin',
              labels: {
                singular: 'Nota',
                plural: 'Nota',
              },
              admin: {
                description: 'Tambah nota setiap kali follow-up atau ada perkembangan baru.',
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'note',
                  type: 'textarea',
                  required: true,
                  label: 'Nota',
                  admin: {
                    placeholder: 'cth: Sudah hubungi, berminat untuk join...',
                  },
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'addedBy',
                      type: 'text',
                      label: 'Ditambah oleh',
                      admin: {
                        readOnly: true,
                        width: '50%',
                      },
                    },
                    {
                      name: 'addedAt',
                      type: 'date',
                      label: 'Tarikh',
                      admin: {
                        readOnly: true,
                        width: '50%',
                        date: {
                          pickerAppearance: 'dayAndTime',
                        },
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    // Sidebar fields
    {
      name: 'status',
      type: 'select',
      label: 'Status Agent',
      options: [
        { label: '🟡 Pending', value: 'pending' },
        { label: '📞 Dihubungi', value: 'contacted' },
        { label: '✅ Diluluskan', value: 'approved' },
        { label: '❌ Ditolak', value: 'rejected' },
      ],
      defaultValue: 'pending',
      admin: {
        position: 'sidebar',
        description: 'Tukar status selepas follow-up.',
      },
    },
    {
      name: 'whatsappLink',
      type: 'text',
      label: '💬 WhatsApp Link',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Auto-generated. Klik untuk chat terus dengan agent.',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        if (data) {
          // Auto-generate WhatsApp link
          const waNumber = data.whatsapp || data.phone
          if (waNumber) {
            const clean = waNumber.replace(/\D/g, '')
            data.whatsappLink = `https://wa.me/${clean}`
          }

          // Auto-fill note metadata
          if (data.notes && Array.isArray(data.notes)) {
            data.notes = data.notes.map(
              (note: { addedAt?: string; addedBy?: string; note: string }) => {
                if (!note.addedAt) {
                  note.addedAt = new Date().toISOString()
                }
                if (!note.addedBy && req.user) {
                  note.addedBy = (req.user as { email?: string }).email || 'Admin'
                }
                return note
              },
            )
          }
        }
        return data
      },
    ],
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
              await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  chat_id: chatId,
                  text: message,
                  parse_mode: 'HTML',
                }),
              })
            } catch (error) {
              console.error('Telegram notification failed:', error)
            }
          }
        }
      },
    ],
  },
}
