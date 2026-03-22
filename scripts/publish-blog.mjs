/**
 * Publish 2 SEO blog posts to CM8 VVIP Payload CMS
 * Usage: DATABASE_URL=... PAYLOAD_SECRET=... node scripts/publish-blog.mjs
 */

import pg from 'pg';
const { Client } = pg;
import crypto from 'crypto';

// Simple Payload-style document insert
// We insert directly into the blog_posts table with Payload's required fields

const DATABASE_URL = process.env.DATABASE_URL;
const PAYLOAD_SECRET = process.env.PAYLOAD_SECRET;

if (!DATABASE_URL || !PAYLOAD_SECRET) {
  console.error('Missing DATABASE_URL or PAYLOAD_SECRET');
  process.exit(1);
}

// Parse DATABASE_URL
const dbUrl = new URL(DATABASE_URL);
const dbConfig = {
  host: dbUrl.hostname,
  port: parseInt(dbUrl.port) || 5432,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.replace('/', ''),
};

async function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function generateId() {
  return Math.floor(Math.random() * 1000000) + 1;
}

function createDocId() {
  return `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Build rich text content for Payload lexical editor
function buildLexicalContent(text) {
  const paragraphs = text.split('\n\n').filter(p => p.trim());
  const children = paragraphs.map(para => ({
    type: 'text',
    version: 1,
    text: para,
    style: {},
    fields: {},
  }));
  
  return {
    root: {
      type: 'root',
      version: 1,
      children,
      direction: 'ltr',
      format: '',
      indent: 0,
    },
  };
}

const articles = [
  {
    title: 'Apa Itu CM8 VVIP? Panduan Ringkas Untuk Pengguna Baru',
    slug: 'apa-itu-cm8-vvip',
    excerpt: 'CM8 VVIP ialah platform yang dibina untuk pengguna yang mahukan pengalaman lebih teratur, lebih jelas, dan lebih mudah diurus. Jika anda baru pertama kali dengar tentang CM8, panduan ringkas ini akan bantu anda faham apa yang ditawarkan.',
    metaTitle: 'Apa Itu CM8 VVIP? Panduan Ringkas Untuk Pengguna Baru di Malaysia',
    metaDescription: 'CM8 VVIP ialah platform yang dibina untuk pengguna yang mahukan pengalaman lebih teratur. Baca panduan ringkas untuk faham apa yang ditawarkan.',
    content: `CM8 VVIP ialah platform yang dibina untuk pengguna yang mahukan pengalaman lebih teratur, lebih jelas, dan lebih mudah diurus. Jika anda baru pertama kali dengar tentang CM8, panduan ringkas ini akan bantu anda faham apa yang ditawarkan, siapa yang sesuai gunakannya, dan bagaimana untuk bermula.

Secara umum, CM8 VVIP memberi fokus kepada pengalaman pengguna yang lebih kemas. Ini termasuk akses kepada maklumat yang lebih tersusun, bantuan daripada team sokongan, dan aliran pendaftaran yang lebih jelas untuk pengguna baru. Sebab itu ramai yang mencari istilah seperti cm8, cm8 vvip, cm8 malaysia, dan cm8 agent apabila mahu tahu lebih lanjut tentang platform ini.

Salah satu kelebihan utama CM8 VVIP ialah pendekatan yang lebih mesra pengguna. Anda tidak perlu meneka sendiri langkah seterusnya. Dari pendaftaran awal hinggalah ke bantuan selepas itu, semuanya disusun supaya lebih mudah difahami. Bagi pengguna di Malaysia, ini penting kerana ramai mahukan proses yang cepat, jelas, dan terus kepada point.

CM8 juga sesuai untuk pengguna yang mahu berurusan dengan saluran yang lebih rasmi. Daripada bergantung pada maklumat yang bercampur-campur, pengguna boleh rujuk halaman rasmi CM8, bercakap dengan team yang betul, dan gunakan maklumat yang lebih konsisten. Ini membantu mengurangkan kekeliruan, terutama untuk pengguna baru yang masih belum biasa dengan aliran platform.

Kalau anda sedang menilai sama ada CM8 sesuai untuk anda, mulakan dengan tiga perkara asas. Pertama, faham fungsi utama platform. Kedua, rujuk halaman penting seperti halaman utama, halaman CM8, dan halaman contact. Ketiga, hubungi team sekiranya anda perlukan penerangan lanjut sebelum meneruskan pendaftaran.

Pendek kata, CM8 VVIP diwujudkan untuk memberi pengalaman yang lebih tersusun kepada pengguna yang mahukan saluran yang lebih jelas dan bantuan yang lebih mudah dicapai. Jika anda mahu tahu langkah seterusnya, artikel kedua akan terangkan cara daftar CM8 VVIP dan bagaimana untuk hubungi team dengan betul.`,
    category: 'guide',
    status: 'published',
  },
  {
    title: 'Cara Daftar CM8 VVIP Dan Hubungi Team',
    slug: 'cara-daftar-cm8-vvip',
    excerpt: 'Ramai pengguna mencari cara daftar CM8 VVIP tetapi tidak pasti saluran mana yang patut digunakan terlebih dahulu. Cara paling selamat ialah bermula dengan saluran rasmi, semak maklumat yang betul, dan elakkan bergantung pada maklumat yang tidak jelas sumbernya.',
    metaTitle: 'Cara Daftar CM8 VVIP Dan Hubungi Team Rasmi',
    metaDescription: 'Cara paling selamat daftar CM8 VVIP ialah bermula dengan saluran rasmi. Baca panduan lengkap untuk tahu langkah pendaftaran dan cara hubungi team.',
    content: `Ramai pengguna mencari cara daftar CM8 VVIP tetapi tidak pasti saluran mana yang patut digunakan terlebih dahulu. Cara paling selamat ialah bermula dengan saluran rasmi, semak maklumat yang betul, dan elakkan bergantung pada maklumat yang tidak jelas sumbernya. Dalam panduan ini, anda boleh lihat langkah ringkas untuk daftar CM8 dan cara hubungi team dengan lebih selamat.

Langkah pertama ialah pergi ke saluran rasmi CM8. Dari sana, anda boleh semak maklumat terkini tentang pendaftaran, bantuan pengguna, dan cara untuk bercakap dengan team. Jika anda perlukan bantuan terus, halaman contact adalah rujukan paling sesuai kerana di situlah maklumat hubungan rasmi dikumpulkan.

Langkah kedua ialah beritahu team bahawa anda mahu mendapatkan maklumat tentang CM8 VVIP. Biasanya team akan bantu anda faham proses asas, terangkan saluran yang sesuai, dan tunjukkan langkah yang perlu diambil. Kalau anda seorang pengguna baru, jangan terus ikut maklumat yang tidak disahkan dari sumber luar. Lebih baik semak dengan team rasmi dahulu.

Langkah ketiga ialah lengkapkan maklumat yang diperlukan. Bergantung pada proses semasa, anda mungkin diminta berikan maklumat asas untuk tujuan pengesahan atau pendaftaran. Pastikan anda hanya berurusan melalui saluran rasmi dan jangan kongsi maklumat sensitif dengan pihak yang tidak jelas.

Selepas proses asas selesai, team CM8 biasanya akan bantu anda untuk langkah seterusnya. Ini mungkin termasuk penerangan ringkas tentang cara guna platform, rujukan ke halaman yang betul, dan maklumat tambahan yang relevan untuk pengguna baru. sebab itu penting untuk gunakan saluran yang sah sejak awal.

Beberapa tips mudah boleh bantu anda elakkan masalah semasa pendaftaran. Pertama, simpan hanya pautan rasmi. Kedua, semak semula nombor WhatsApp atau saluran Telegram sebelum berinteraksi. Ketiga, jangan terpedaya dengan mesej yang menggunakan nama brand tetapi datang dari akaun yang meragukan.

Secara ringkas, cara daftar CM8 VVIP tidak rumit jika anda ikut saluran yang betul. Mula dengan halaman rasmi, semak maklumat melalui team, dan gunakan contact page jika anda perlukan bantuan. Pendekatan ini lebih selamat, lebih jelas, dan lebih sesuai untuk pengguna baru di Malaysia.`,
    category: 'guide',
    status: 'published',
  },
];

async function insertBlogPost(client, article) {
  const now = new Date().toISOString();
  const docId = createDocId();
  const content = buildLexicalContent(article.content);

  // Payload v3 uses a specific table structure with JSONB fields
  // The blog_posts table has these main columns
  const query = `
    INSERT INTO blog_posts (
      id, title, slug, excerpt, content, category, status, published_date,
      created_at, updated_at, _status, _uuid,
      meta_title, meta_description
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
    )
    ON CONFLICT (slug) DO UPDATE SET
      title = EXCLUDED.title,
      excerpt = EXCLUDED.excerpt,
      content = EXCLUDED.content,
      updated_at = EXCLUDED.updated_at
    RETURNING id, slug, title;
  `;

  const values = [
    generateId(),
    article.title,
    article.slug,
    article.excerpt,
    JSON.stringify(content),
    article.category,
    article.status,
    now,
    now,
    now,
    article.status,
    docId,
    article.metaTitle,
    article.metaDescription,
  ];

  try {
    const result = await client.query(query, values);
    console.log(`✓ Inserted/Updated: "${article.title}" (slug: ${article.slug})`);
    return result.rows[0];
  } catch (err) {
    console.error(`✗ Error inserting "${article.title}":`, err.message);
    throw err;
  }
}

async function main() {
  console.log('🔌 Connecting to database...');
  const client = new Client(dbConfig);

  try {
    await client.connect();
    console.log('✅ Connected!\n');

    // First check if table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_tables
        WHERE table_schema = 'public'
        AND table_name = 'blog_posts'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      console.error('❌ Table blog_posts does not exist. Run Payload migration first.');
      process.exit(1);
    }

    // Insert articles
    for (const article of articles) {
      await insertBlogPost(client, article);
    }

    console.log('\n🎉 Done! Published articles:');
    for (const a of articles) {
      console.log(`   - https://www.cm8vvip.com/blog/${a.slug}`);
    }
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
