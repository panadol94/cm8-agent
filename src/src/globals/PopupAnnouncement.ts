import type { GlobalConfig } from 'payload'

export const PopupAnnouncement: GlobalConfig = {
  slug: 'popup-announcement',
  label: 'Popup / Pengumuman',
  admin: {
    description: 'Popup modal yang dipaparkan di homepage. Boleh toggle on/off.',
  },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      label: 'Aktifkan Popup',
      defaultValue: false,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Tajuk',
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Kandungan',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Gambar (Optional)',
    },
    {
      name: 'ctaText',
      type: 'text',
      label: 'Teks Butang',
      defaultValue: 'Okay',
    },
    {
      name: 'ctaLink',
      type: 'text',
      label: 'Link Butang (Optional)',
      admin: {
        description: 'Jika ada, butang akan redirect ke link ini.',
      },
    },
    {
      name: 'showOnce',
      type: 'checkbox',
      label: 'Papar Sekali Sahaja',
      defaultValue: true,
      admin: {
        description: 'Jika aktif, popup hanya dipapar sekali per sesi.',
      },
    },
    {
      name: 'backgroundColor',
      type: 'text',
      label: 'Warna Latar',
      defaultValue: '#1a1a2e',
    },
  ],
}
