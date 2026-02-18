import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role', 'updatedAt'],
    description: 'Pengguna admin yang boleh mengakses panel ini.',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nama Penuh',
    },
    {
      name: 'role',
      type: 'select',
      label: 'Peranan',
      options: [
        { label: 'Super Admin', value: 'super-admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Viewer', value: 'viewer' },
      ],
      defaultValue: 'editor',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      label: 'Avatar',
    },
  ],
}
