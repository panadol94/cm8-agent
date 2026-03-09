import type { CollectionConfig } from 'payload'

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  labels: {
    singular: 'Artikel',
    plural: 'Blog & Artikel',
  },
  admin: {
    useAsTitle: 'title',
    group: '📝 Kandungan',
    defaultColumns: ['title', 'category', 'status', 'publishedDate'],
    listSearchableFields: ['title', 'slug'],
    description:
      'Artikel blog untuk SEO dan content marketing. Filter mengikut kategori atau status.',
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: '📝 Kandungan',
          description: 'Tulis dan urus kandungan artikel.',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              label: 'Tajuk Artikel',
              admin: {
                placeholder: 'cth: 5 Tips Jadi Agent Berjaya',
              },
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              label: 'Slug (URL)',
              admin: {
                description:
                  'Auto-generated dari tajuk. Ini jadi URL artikel, cth: /blog/cara-jadi-agent-cm8',
                placeholder: 'auto-generate dari tajuk',
              },
              hooks: {
                beforeValidate: [
                  ({ value, data }) => {
                    if (!value && data?.title) {
                      return data.title
                        .toLowerCase()
                        .replace(/[^a-z0-9\s-]/g, '')
                        .replace(/\s+/g, '-')
                        .replace(/-+/g, '-')
                        .trim()
                    }
                    return value
                  },
                ],
              },
            },
            {
              name: 'excerpt',
              type: 'textarea',
              label: 'Ringkasan',
              admin: {
                description:
                  'Ringkasan pendek (1-2 ayat). Dipapar di senarai blog dan sebagai SEO meta description.',
                placeholder: 'Tulis ringkasan pendek artikel di sini...',
              },
            },
            {
              name: 'featuredImage',
              type: 'upload',
              relationTo: 'media',
              label: '🖼️ Gambar Utama',
              admin: {
                description: 'Gambar yang dipapar sebagai thumbnail dan header artikel.',
              },
            },
            {
              name: 'content',
              type: 'richText',
              required: true,
              label: 'Kandungan Penuh',
            },
          ],
        },
        {
          label: '🔍 SEO',
          description: 'Tetapan SEO untuk artikel ini. Jika kosong, akan guna tajuk & ringkasan.',
          fields: [
            {
              name: 'seo',
              type: 'group',
              label: 'SEO Settings',
              fields: [
                {
                  name: 'metaTitle',
                  type: 'text',
                  label: 'Meta Title',
                  admin: {
                    placeholder: 'cth: Tips Jadi Agent CM8 | CM8 VVIP',
                    description: 'Tajuk yang dipapar di Google. Max 60 aksara.',
                  },
                },
                {
                  name: 'metaDescription',
                  type: 'textarea',
                  label: 'Meta Description',
                  admin: {
                    placeholder: 'Tulis description untuk Google di sini...',
                    description: 'Penerangan di Google search. Max 160 aksara.',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    // Sidebar
    {
      name: 'category',
      type: 'select',
      label: '📁 Kategori',
      options: [
        { label: '💡 Tips & Strategi', value: 'tips' },
        { label: '📚 Panduan Agent', value: 'guide' },
        { label: '📰 Berita', value: 'news' },
        { label: '🎉 Promosi', value: 'promo' },
      ],
      defaultValue: 'tips',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      options: [
        { label: '📝 Draf', value: 'draft' },
        { label: '✅ Diterbitkan', value: 'published' },
      ],
      defaultValue: 'draft',
      admin: {
        position: 'sidebar',
        description: 'Tukar ke "Diterbitkan" untuk live.',
      },
    },
    {
      name: 'publishedDate',
      type: 'date',
      label: '📅 Tarikh Terbit',
      admin: {
        position: 'sidebar',
        description: 'Auto-set apabila diterbitkan.',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-set publishedDate when status changes to published
        if (data && data.status === 'published' && !data.publishedDate) {
          data.publishedDate = new Date().toISOString()
        }
        return data
      },
    ],
  },
}
