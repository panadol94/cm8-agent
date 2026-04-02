import type { CollectionConfig } from 'payload'

export const LuckySpinRewards: CollectionConfig = {
  slug: 'lucky-spin-rewards',
  labels: {
    singular: 'Lucky Spin Reward',
    plural: 'Lucky Spin Rewards',
  },
  access: {
    create: () => true,
    read: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'rewardName',
    group: '🎰 Lucky Spin',
    defaultColumns: ['rewardName', 'rewardType', 'stock', 'claimedCount', 'isActive', 'position'],
    listSearchableFields: ['rewardName', 'rewardType'],
    description: 'Konfigurasi hadiah fixed pool lucky spin.',
  },
  fields: [
    {
      name: 'rewardName',
      type: 'text',
      required: true,
      label: 'Nama Hadiah',
      admin: {
        placeholder: 'cth: RM100',
      },
    },
    {
      name: 'rewardType',
      type: 'select',
      label: 'Jenis Hadiah',
      options: [
        { label: '💵 Tunai', value: 'cash' },
        { label: '🥇 Emas', value: 'gold' },
        { label: '🎁 Bonus', value: 'bonus' },
      ],
      defaultValue: 'cash',
    },
    {
      name: 'stock',
      type: 'number',
      required: true,
      label: 'Jumlah Hadiah',
      min: 0,
      admin: {
        placeholder: 'cth: 80',
        description: 'Jumlah hadiah sebenar dalam fixed pool.',
      },
    },
    {
      name: 'claimedCount',
      type: 'number',
      label: 'Sudah Dituntut / Dapat',
      defaultValue: 0,
      min: 0,
      admin: {
        readOnly: true,
        description: 'Auto kira selepas peserta spin.',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Aktif',
    },
    {
      name: 'position',
      type: 'number',
      required: true,
      label: 'Position (Wheel Order)',
      admin: {
        placeholder: '1-10',
        description: 'Kedudukan di wheel (1 = paling atas).',
      },
    },
  ],
}
