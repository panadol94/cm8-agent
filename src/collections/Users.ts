import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Pengguna',
    plural: 'Pengguna Admin',
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role', 'updatedAt'],
    listSearchableFields: ['name', 'email'],
    description:
      'Pengguna admin yang boleh mengakses panel ini. Setiap pengguna ada peranan tersendiri.',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nama Penuh',
      admin: {
        placeholder: 'cth: Ahmad Admin',
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      label: '📸 Avatar',
      admin: {
        description: 'Gambar profil pengguna.',
      },
    },
    // Sidebar
    {
      name: 'role',
      type: 'select',
      label: '🛡️ Peranan',
      options: [
        { label: '👑 Super Admin', value: 'super-admin' },
        { label: '✏️ Editor', value: 'editor' },
        { label: '👁️ Viewer', value: 'viewer' },
      ],
      defaultValue: 'editor',
      admin: {
        position: 'sidebar',
        description: 'Super Admin: full access. Editor: edit content. Viewer: read only.',
      },
    },
  ],
}
