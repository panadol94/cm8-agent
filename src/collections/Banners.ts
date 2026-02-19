import type { CollectionConfig } from 'payload'

export const Banners: CollectionConfig = {
  slug: 'banners',
  labels: {
    singular: 'Banner',
    plural: 'Banner Carousel',
  },
  admin: {
    useAsTitle: 'title',
    group: '📝 Kandungan',
    defaultColumns: ['title', 'active', 'order', 'updatedAt'],
    listSearchableFields: ['title'],
    description: 'Banner carousel di bahagian atas homepage. Susun mengikut "Susunan".',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Tajuk Banner',
      admin: {
        description: 'Nama dalaman untuk mengenal pasti banner. Tidak dipapar di frontend.',
        placeholder: 'cth: Promosi Raya 2026',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: '🖼️ Gambar Banner (Upload)',
      admin: {
        description: 'Upload gambar banner. Saiz disyorkan: 1920 x 640 piksel.',
      },
    },
    {
      name: 'imageUrl',
      type: 'text',
      label: '🔗 Gambar URL (External)',
      admin: {
        description: 'Guna URL jika tiada upload. Salah satu sahaja diperlukan.',
        placeholder: 'cth: /banners/banner-cm8-1.png',
      },
    },
    {
      name: 'link',
      type: 'text',
      label: '🔗 Link (Optional)',
      admin: {
        description: 'URL apabila banner diklik. Kosongkan jika tiada.',
        placeholder: 'cth: https://cm8vvip.com/promo',
      },
    },
    // Sidebar
    {
      name: 'order',
      type: 'number',
      label: 'Susunan',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Nombor kecil = papar dulu.',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      label: '✅ Aktif',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Nyahaktif untuk sembunyikan tanpa delete.',
      },
    },
  ],
}
