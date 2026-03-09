import type { CollectionConfig } from 'payload'

export const ScanUsage: CollectionConfig = {
  slug: 'scan-usage',
  labels: {
    singular: 'Rekod Scan',
    plural: '📊 Rekod Scan',
  },
  admin: {
    useAsTitle: 'phone',
    group: '🎮 Permainan',
    defaultColumns: ['phone', 'cm8Username', 'date', 'scanCount', 'bonusScans', 'isBanned'],
    listSearchableFields: ['phone', 'cm8Username'],
    description: 'Rekod penggunaan scan harian setiap pengguna. Boleh ban atau tambah bonus scan.',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'phone',
          type: 'text',
          label: '📱 No. Telefon',
          required: true,
          index: true,
          admin: {
            width: '50%',
            description: 'Nombor telefon pengguna (dari OTP login)',
          },
        },
        {
          name: 'cm8Username',
          type: 'text',
          label: '🎮 CM8 Game ID',
          admin: {
            width: '50%',
            description: 'ID permainan CM8 pengguna (jika ada)',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'date',
          type: 'text',
          label: '📅 Tarikh',
          required: true,
          index: true,
          admin: {
            width: '33%',
            description: 'Format: YYYY-MM-DD',
          },
        },
        {
          name: 'scanCount',
          type: 'number',
          label: '🔢 Jumlah Scan',
          defaultValue: 0,
          min: 0,
          admin: {
            width: '33%',
            description: 'Berapa kali user dah scan hari ini',
          },
        },
        {
          name: 'bonusScans',
          type: 'number',
          label: '🎁 Bonus Scan',
          defaultValue: 0,
          min: 0,
          admin: {
            width: '33%',
            description: 'Scan tambahan yang diberi oleh admin',
          },
        },
      ],
    },
    {
      name: 'isBanned',
      type: 'checkbox',
      label: '🚫 Disekat',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Tandakan untuk sekat pengguna ini daripada menggunakan scanner.',
      },
    },
  ],
}
