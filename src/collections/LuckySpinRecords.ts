import type { CollectionConfig } from 'payload'

export const LuckySpinRecords: CollectionConfig = {
  slug: 'lucky-spin-records',
  labels: {
    singular: 'Lucky Spin Record',
    plural: 'Lucky Spin Records',
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
    defaultColumns: ['agentId', 'rewardWon', 'spunAt', 'ipAddress', 'isValid'],
    listSearchableFields: ['agentId', 'rewardWon'],
    description: 'Rekod semua spin yang telah dilakukan.',
  },
  fields: [
    {
      name: 'agentId',
      type: 'text',
      required: true,
      label: 'Agent ID',
      admin: {
        placeholder: 'cth: AGENT001',
      },
    },
    {
      name: 'rewardWon',
      type: 'text',
      required: true,
      label: 'Hadiah Menang',
      admin: {
        placeholder: 'cth: RM100',
      },
    },
    {
      name: 'rewardType',
      type: 'text',
      label: 'Jenis Hadiah',
    },
    {
      name: 'spunAt',
      type: 'date',
      required: true,
      label: 'Tarikh & Masa Spin',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'ipAddress',
      type: 'text',
      label: 'IP Address',
    },
    {
      name: 'userAgent',
      type: 'text',
      label: 'User Agent',
    },
    {
      name: 'isValid',
      type: 'checkbox',
      defaultValue: true,
      label: 'Valid',
      admin: {
        position: 'sidebar',
        description: 'Tandakan false jika disyaki fraud.',
      },
    },
  ],
}
