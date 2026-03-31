import type { CollectionConfig } from 'payload'
import { hashPassword } from '../lib/auth'

export const LuckySpinSettings: CollectionConfig = {
  slug: 'lucky-spin-settings',
  labels: {
    singular: 'Lucky Spin Setting',
    plural: 'Lucky Spin Settings',
  },
  access: {
    create: () => true,
    read: () => true,
    update: () => true,
    delete: () => false,
  },
  admin: {
    useAsTitle: 'id',
    group: '🎰 Lucky Spin',
    defaultColumns: ['eventStatus', 'eventStart', 'eventEnd', 'timezone'],
    description: 'Konfigurasi event Lucky Spin.',
  },
  fields: [
    {
      name: 'eventStatus',
      type: 'checkbox',
      defaultValue: false,
      label: 'Event Aktif',
      admin: {
        position: 'sidebar',
        description: 'Aktifkan event Lucky Spin.',
      },
    },
    {
      name: 'eventStart',
      type: 'date',
      label: 'Tarikh Mula Event',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'eventEnd',
      type: 'date',
      label: 'Tarikh Tamat Event',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'timezone',
      type: 'text',
      label: 'Timezone',
      defaultValue: 'Asia/Kuching',
      admin: {
        placeholder: 'Asia/Kuching',
        description: 'Timezone untuk validation masa event.',
      },
    },
    {
      name: 'adminUsername',
      type: 'text',
      label: 'Admin Username',
      required: true,
      admin: {
        description: 'Username untuk login admin Lucky Spin.',
      },
    },
    {
      name: 'adminPassword',
      type: 'text',
      label: 'Admin Password (Hashed)',
      required: true,
      admin: {
        description: 'Password untuk login admin Lucky Spin. Akan di-hash secara automatik.',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data }) => {
        if (data?.adminPassword && !data.adminPassword.startsWith('$') && !data.adminPassword.includes(':')) {
          data.adminPassword = await hashPassword(data.adminPassword)
        }
        return data
      },
    ],
  },
}
