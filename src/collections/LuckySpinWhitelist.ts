import type { CollectionConfig } from 'payload'

export const LuckySpinWhitelist: CollectionConfig = {
  slug: 'lucky-spin-whitelist',
  labels: {
    singular: 'Lucky Spin Whitelist',
    plural: 'Lucky Spin Whitelist',
  },
  access: {
    create: () => true,
    read: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'agentId',
    group: '🎰 Lucky Spin',
    defaultColumns: ['agentId', 'isActive', 'hasSpun', 'createdAt'],
    listSearchableFields: ['agentId'],
    description: 'Senarai agent ID yang layak untuk Lucky Spin.',
  },
  fields: [
    {
      name: 'agentId',
      type: 'text',
      required: true,
      label: 'Agent ID',
      unique: true,
      admin: {
        placeholder: 'cth: AGENT001',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Aktif',
      admin: {
        position: 'sidebar',
        description: 'Aktifkan/nyahaktifkan agent ini.',
      },
    },
    {
      name: 'hasSpun',
      type: 'checkbox',
      defaultValue: false,
      label: 'Telah Spin',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Otomatik ditetapkan selepas spin.',
      },
    },
    {
      name: 'createdAt',
      type: 'date',
      label: 'Tarikh Didaftarkan',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
}
