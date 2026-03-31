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
    defaultColumns: ['rewardName', 'rewardType', 'probability', 'isActive', 'position'],
    listSearchableFields: ['rewardName', 'rewardType'],
    description: 'Konfigurasi hadiah dan вероятность menang.',
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
      name: 'probability',
      type: 'number',
      required: true,
      label: 'Probability (%)',
      min: 0,
      max: 100,
      admin: {
        placeholder: '0-100',
        description: 'Peratus вероятность menang. Jumlah semua = 100%.',
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
