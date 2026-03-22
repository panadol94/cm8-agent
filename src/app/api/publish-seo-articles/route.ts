import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export const dynamic = 'force-dynamic'

// GET /api/publish-seo-articles - Creates 2 SEO blog articles
// Requires secret query param: ?secret=YOUR_PAYLOAD_SECRET
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const secret = searchParams.get('secret')

  // Validate secret
  if (secret !== (process.env.PAYLOAD_SECRET || 'dev-seed')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await getPayload({ config })

  const articles = [
    {
      title: 'Apa Itu CM8 VVIP? Panduan Ringkas Untuk Pengguna Baru',
      slug: 'apa-itu-cm8-vvip',
      excerpt: 'CM8 VVIP ialah platform yang dibina untuk pengguna yang mahukan pengalaman lebih teratur, lebih jelas, dan lebih mudah diurus. Jika anda baru pertama kali dengar tentang CM8, panduan ringkas ini akan bantu anda faham apa yang ditawarkan.',
      content: {
        root: {
          type: 'root',
          children: [
            {
              type: 'text',
              version: 1,
              text: 'CM8 VVIP ialah platform yang dibina untuk pengguna yang mahukan pengalaman lebih teratur, lebih jelas, dan lebih mudah diurus. Jika anda baru pertama kali dengar tentang CM8, panduan ringkas ini akan bantu anda faham apa yang ditawarkan, siapa yang sesuai gunakannya, dan bagaimana untuk bermula.',
              style: {},
              fields: {},
            },
            {
              type: 'text',
              version: 1,
              text: 'Secara umum, CM8 VVIP memberi fokus kepada pengalaman pengguna yang lebih kemas. Ini termasuk akses kepada maklumat yang lebih tersusun, bantuan daripada team sokongan, dan aliran pendaftaran yang lebih jelas untuk pengguna baru. Sebab itu ramai yang mencari istilah seperti cm8, cm8 vvip, cm8 malaysia, dan cm8 agent apabila mahu tahu lebih lanjut tentang platform ini.',
              style: {},
              fields: {},
            },
            {
              type: 'text',
              version: 1,
              text: 'Salah satu kelebihan utama CM8 VVIP ialah pendekatan yang lebih mesra pengguna. Anda tidak perlu meneka sendiri langkah seterusnya. Dari pendaftaran awal hinggalah ke bantuan selepas itu, semuanya disusun supaya lebih mudah difahami. Bagi pengguna di Malaysia, ini penting kerana ramai mahukan proses yang cepat, jelas, dan terus kepada point.',
              style: {},
              fields: {},
            },
            {
              type: 'text',
              version: 1,
              text: 'CM8 juga sesuai untuk pengguna yang mahu berurusan dengan saluran yang lebih rasmi. Daripada bergantung pada maklumat yang bercampur-campur, pengguna boleh rujuk halaman rasmi CM8, bercakap dengan team yang betul, dan gunakan maklumat yang lebih konsisten. Ini membantu mengurangkan kekeliruan, terutama untuk pengguna baru yang masih belum biasa dengan aliran platform.',
              style: {},
              fields: {},
            },
            {
              type: 'text',
              version: 1,
              text: 'Kalau anda sedang menilai sama ada CM8 sesuai untuk anda, mulakan dengan tiga perkara asas. Pertama, faham fungsi utama platform. Kedua, rujuk halaman penting seperti halaman utama, halaman CM8, dan halaman contact. Ketiga, hubungi team sekiranya anda perlukan penerangan lanjut sebelum meneruskan pendaftaran.',
              style: {},
              fields: {},
            },
            {
              type: 'text',
              version: 1,
              text: 'Pendek kata, CM8 VVIP diwujudkan untuk memberi pengalaman yang lebih tersusun kepada pengguna yang mahukan saluran yang lebih jelas dan bantuan yang lebih mudah dicapai. Jika anda mahu tahu langkah seterusnya, artikel kedua akan terangkan cara daftar CM8 VVIP dan bagaimana untuk hubungi team dengan betul.',
              style: {},
              fields: {},
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
      seo: {
        metaTitle: 'Apa Itu CM8 VVIP? Panduan Ringkas Untuk Pengguna Baru di Malaysia',
        metaDescription: 'CM8 VVIP ialah platform yang dibina untuk pengguna yang mahukan pengalaman lebih teratur. Baca panduan ringkas untuk faham apa yang ditawarkan.',
      },
      category: 'guide',
      status: 'published',
    },
    {
      title: 'Cara Daftar CM8 VVIP Dan Hubungi Team',
      slug: 'cara-daftar-cm8-vvip',
      excerpt: 'Ramai pengguna mencari cara daftar CM8 VVIP tetapi tidak pasti saluran mana yang patut digunakan terlebih dahulu. Cara paling selamat ialah bermula dengan saluran rasmi, semak maklumat yang betul, dan elakkan bergantung pada maklumat yang tidak jelas sumbernya.',
      content: {
        root: {
          type: 'root',
          children: [
            {
              type: 'text',
              version: 1,
              text: 'Ramai pengguna mencari cara daftar CM8 VVIP tetapi tidak pasti saluran mana yang patut digunakan terlebih dahulu. Cara paling selamat ialah bermula dengan saluran rasmi, semak maklumat yang betul, dan elakkan bergantung pada maklumat yang tidak jelas sumbernya. Dalam panduan ini, anda boleh lihat langkah ringkas untuk daftar CM8 dan cara hubungi team dengan lebih selamat.',
              style: {},
              fields: {},
            },
            {
              type: 'text',
              version: 1,
              text: 'Langkah pertama ialah pergi ke saluran rasmi CM8. Dari sana, anda boleh semak maklumat terkini tentang pendaftaran, bantuan pengguna, dan cara untuk bercakap dengan team. Jika anda perlukan bantuan terus, halaman contact adalah rujukan paling sesuai kerana di situlah maklumat hubungan rasmi dikumpulkan.',
              style: {},
              fields: {},
            },
            {
              type: 'text',
              version: 1,
              text: 'Langkah kedua ialah beritahu team bahawa anda mahu mendapatkan maklumat tentang CM8 VVIP. Biasanya team akan bantu anda faham proses asas, terangkan saluran yang sesuai, dan tunjukkan langkah yang perlu diambil. Kalau anda seorang pengguna baru, jangan terus ikut maklumat yang tidak disahkan dari sumber luar. Lebih baik semak dengan team rasmi dahulu.',
              style: {},
              fields: {},
            },
            {
              type: 'text',
              version: 1,
              text: 'Langkah ketiga ialah lengkapkan maklumat yang diperlukan. Bergantung pada proses semasa, anda mungkin diminta berikan maklumat asas untuk tujuan pengesahan atau pendaftaran. Pastikan anda hanya berurusan melalui saluran rasmi dan jangan kongsi maklumat sensitif dengan pihak yang tidak jelas.',
              style: {},
              fields: {},
            },
            {
              type: 'text',
              version: 1,
              text: 'Selepas proses asas selesai, team CM8 biasanya akan bantu anda untuk langkah seterusnya. Ini mungkin termasuk penerangan ringkas tentang cara guna platform, rujukan ke halaman yang betul, dan maklumat tambahan yang relevan untuk pengguna baru. sebab itu penting untuk gunakan saluran yang sah sejak awal.',
              style: {},
              fields: {},
            },
            {
              type: 'text',
              version: 1,
              text: 'Beberapa tips mudah boleh bantu anda elakkan masalah semasa pendaftaran. Pertama, simpan hanya pautan rasmi. Kedua, semak semula nombor WhatsApp atau saluran Telegram sebelum berinteraksi. Ketiga, jangan terpedaya dengan mesej yang menggunakan nama brand tetapi datang dari akaun yang meragukan.',
              style: {},
              fields: {},
            },
            {
              type: 'text',
              version: 1,
              text: 'Secara ringkas, cara daftar CM8 VVIP tidak rumit jika anda ikut saluran yang betul. Mula dengan halaman rasmi, semak maklumat melalui team, dan gunakan contact page jika anda perlukan bantuan. Pendekatan ini lebih selamat, lebih jelas, dan lebih sesuai untuk pengguna baru di Malaysia.',
              style: {},
              fields: {},
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
      seo: {
        metaTitle: 'Cara Daftar CM8 VVIP Dan Hubungi Team Rasmi',
        metaDescription: 'Cara paling selamat daftar CM8 VVIP ialah bermula dengan saluran rasmi. Baca panduan lengkap untuk tahu langkah pendaftaran dan cara hubungi team.',
      },
      category: 'guide',
      status: 'published',
    },
  ]

  const results = []

  for (const article of articles) {
    try {
      // Check if article already exists
      const existing = await payload.find({
        collection: 'blog-posts',
        where: { slug: { equals: article.slug } },
        limit: 1,
      })

      let result
      if (existing.docs.length > 0) {
        // Update existing
        result = await payload.update({
          collection: 'blog-posts',
          id: existing.docs[0].id,
          data: article,
        })
        results.push({ action: 'updated', slug: article.slug, id: result.id })
      } else {
        // Create new
        result = await payload.create({
          collection: 'blog-posts',
          data: article,
        })
        results.push({ action: 'created', slug: article.slug, id: result.id })
      }
    } catch (err) {
      results.push({ action: 'error', slug: article.slug, error: String(err) })
    }
  }

  return NextResponse.json({
    success: true,
    message: 'SEO articles published',
    results,
  })
}
