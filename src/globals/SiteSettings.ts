import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Tetapan Laman',
  admin: {
    description: 'Tetapan umum untuk website CM8 VVIP.',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Umum',
          fields: [
            {
              name: 'siteName',
              type: 'text',
              label: 'Nama Laman',
              defaultValue: 'CM8 VVIP',
            },
            {
              name: 'tagline',
              type: 'text',
              label: 'Tagline',
              defaultValue: 'Platform Agent #1 Malaysia',
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              label: 'Logo',
            },
            {
              name: 'favicon',
              type: 'upload',
              relationTo: 'media',
              label: 'Favicon',
            },
          ],
        },
        {
          label: 'Hero Section',
          fields: [
            {
              name: 'heroTitle',
              type: 'text',
              label: 'Tajuk Hero',
              defaultValue: 'Jadi Agent CM8 Sekarang',
            },
            {
              name: 'heroSubtitle',
              type: 'textarea',
              label: 'Subtitle Hero',
              defaultValue:
                'Jana pendapatan lumayan dengan menjadi agent platform CM8. Komisyen tinggi, sokongan penuh, dan peluang tanpa had.',
            },
            {
              name: 'heroCTA',
              type: 'text',
              label: 'Teks Butang CTA',
              defaultValue: 'Daftar Sekarang',
            },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Gambar Hero',
            },
          ],
        },
        {
          label: 'Hubungi Kami',
          fields: [
            {
              name: 'whatsappNumber',
              type: 'text',
              label: 'Nombor WhatsApp',
              admin: {
                description: 'Format: 60123456789 (tanpa + atau -)',
              },
            },
            {
              name: 'telegramLink',
              type: 'text',
              label: 'Link Telegram',
            },
          ],
        },
        {
          label: 'Footer',
          fields: [
            {
              name: 'footerText',
              type: 'textarea',
              label: 'Teks Footer',
              defaultValue: '© 2026 CM8 VVIP. Semua hak cipta terpelihara.',
            },
            {
              name: 'socialLinks',
              type: 'array',
              label: 'Pautan Sosial',
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  options: [
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'Twitter', value: 'twitter' },
                    { label: 'YouTube', value: 'youtube' },
                    { label: 'TikTok', value: 'tiktok' },
                  ],
                },
                {
                  name: 'url',
                  type: 'text',
                  label: 'URL',
                },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'metaTitle',
              type: 'text',
              label: 'Meta Title',
              defaultValue: 'CM8 VVIP — Buat Duit Online & Agent Slot Tanpa Modal #1 Malaysia',
            },
            {
              name: 'metaDescription',
              type: 'textarea',
              label: 'Meta Description',
              defaultValue:
                'Jana income pasif sebagai Agent Slot CM8 VVIP. Daftar percuma, tiada modal.',
            },
            {
              name: 'keywords',
              type: 'textarea',
              label: 'Keywords',
              admin: {
                description: 'Pisahkan dengan koma. Contoh: agent cm8, buat duit online',
              },
            },
            {
              name: 'ogImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Open Graph Image',
            },
          ],
        },
        {
          label: 'Ticker',
          fields: [
            {
              name: 'tickerEnabled',
              type: 'checkbox',
              label: 'Aktifkan Ticker',
              defaultValue: true,
            },
            {
              name: 'tickerMessages',
              type: 'array',
              label: 'Mesej Ticker',
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  required: true,
                  label: 'Teks',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
