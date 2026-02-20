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
            {
              type: 'row',
              fields: [
                {
                  name: 'ctaButton1Text',
                  type: 'text',
                  label: 'Butang CTA 1 — Teks',
                  defaultValue: '🚀 Jadi Agent Sekarang',
                  admin: { width: '50%', description: 'Teks butang utama (oren/gradient)' },
                },
                {
                  name: 'ctaButton1Link',
                  type: 'text',
                  label: 'Butang CTA 1 — Link',
                  defaultValue: 'https://masuk10.com/Wasapvvipcs',
                  admin: { width: '50%', description: 'URL yang dituju bila klik butang utama' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'ctaButton2Text',
                  type: 'text',
                  label: 'Butang CTA 2 — Teks',
                  defaultValue: 'Daftar Akaun CM8',
                  admin: { width: '50%', description: 'Teks butang kedua (outline)' },
                },
                {
                  name: 'ctaButton2Link',
                  type: 'text',
                  label: 'Butang CTA 2 — Link',
                  defaultValue: 'https://masuk10.com/Wasapvvipcs',
                  admin: { width: '50%', description: 'URL yang dituju bila klik butang kedua' },
                },
              ],
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
          label: '🔗 Pautan Komuniti',
          description:
            'Link-link komuniti yang dipapar di seluruh website (Halaman Info, Blog, dll).',
          fields: [
            {
              name: 'telegramGroupLink',
              type: 'text',
              label: 'Link Telegram Group',
              defaultValue: 'https://t.me/+7qOP1Y8RQcthYjll',
              admin: {
                description: 'Link group Telegram komuniti agent. Dipapar di halaman Info & Blog.',
              },
            },
            {
              name: 'whatsappGroupLink',
              type: 'text',
              label: 'Link WhatsApp Group',
              defaultValue: 'https://masuk10.com/WasapGrupVVIP',
              admin: {
                description: 'Link group WhatsApp komuniti agent.',
              },
            },
            {
              name: 'adminWhatsappLink',
              type: 'text',
              label: 'Link WhatsApp Admin',
              defaultValue: 'https://masuk10.com/Wasapvvipcs',
              admin: {
                description:
                  'Link WhatsApp untuk chat terus dengan admin / pendaftaran agent baru.',
              },
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
        {
          label: '🎮 Scanner Config',
          description: 'Tetapan untuk Patch ID Scanner — kawal distribution RTP yang dipaparkan.',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'scannerMinRtp',
                  type: 'number',
                  label: 'Min RTP (%)',
                  defaultValue: 30,
                  min: 10,
                  max: 50,
                  admin: {
                    description: 'Percentage terendah yang boleh keluar (default: 30%)',
                    width: '50%',
                  },
                },
                {
                  name: 'scannerMaxRtp',
                  type: 'number',
                  label: 'Max RTP (%)',
                  defaultValue: 97,
                  min: 85,
                  max: 99,
                  admin: {
                    description: 'Percentage tertinggi yang boleh keluar (default: 97%)',
                    width: '50%',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'scannerHotThreshold',
                  type: 'number',
                  label: 'HOT Threshold (%)',
                  defaultValue: 85,
                  min: 70,
                  max: 95,
                  admin: {
                    description: 'RTP ≥ nilai ini = 🔥 HOT',
                    width: '50%',
                  },
                },
                {
                  name: 'scannerWarmThreshold',
                  type: 'number',
                  label: 'WARM Threshold (%)',
                  defaultValue: 65,
                  min: 40,
                  max: 80,
                  admin: {
                    description: 'RTP ≥ nilai ini = ⚡ WARM, bawah = ❄️ COLD',
                    width: '50%',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'scannerHotPercent',
                  type: 'number',
                  label: '% Game HOT',
                  defaultValue: 10,
                  min: 1,
                  max: 30,
                  admin: {
                    description: 'Berapa % game yang akan jadi HOT (default: 10%)',
                    width: '33%',
                  },
                },
                {
                  name: 'scannerWarmPercent',
                  type: 'number',
                  label: '% Game WARM',
                  defaultValue: 30,
                  min: 10,
                  max: 60,
                  admin: {
                    description: 'Berapa % game yang akan jadi WARM (default: 30%)',
                    width: '33%',
                  },
                },
                {
                  name: 'scannerColdPercent',
                  type: 'number',
                  label: '% Game COLD',
                  defaultValue: 60,
                  admin: {
                    description: 'Auto-kira: selebihnya jadi ❄️ COLD',
                    width: '33%',
                    readOnly: true,
                  },
                },
              ],
            },
            {
              name: 'scannerSeedInterval',
              type: 'select',
              label: 'Tukar Result Setiap',
              defaultValue: '60',
              options: [
                { label: '15 minit', value: '15' },
                { label: '30 minit', value: '30' },
                { label: '1 jam', value: '60' },
                { label: '3 jam', value: '180' },
              ],
              admin: {
                description:
                  'Result scan akan berubah setiap interval ini. Semua user nampak result sama dalam tempoh yang sama.',
              },
            },
          ],
        },
      ],
    },
  ],
}
