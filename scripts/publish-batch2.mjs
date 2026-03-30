import { Client } from 'pg';

const articles = [
  {
    title: "FAQ CM8 VVIP - Soalan Lazim Yang Sering Ditanya",
    slug: "faq-cm8-vvip",
    excerpt: "Berikut adalah beberapa soalan lazim tentang CM8 VVIP yang sering ditanya oleh pengguna baru dan juga agent.",
    seoMetaTitle: "FAQ CM8 VVIP - Soalan Lazim Dan Jawapan Untuk Pengguna Baru",
    seoMetaDescription: "Baca FAQ CM8 VVIP untuk tahu jawapan kepada soalan-soalan popular tentang platform ini.",
    content: "Dalam bahagian ini, kami kumpulkan soalan-soalan yang sering ditanya tentang CM8 VVIP.\n\nSoalan pertama: Apa beza CM8 VVIP dengan platform lain? Perbezaan utama terletak pada how the platform dikendalikan dan how the support system works.\n\nSoalan kedua: Cara untuk daftar CM8 VVIP? Proses pendaftaran adalah straight forward. Anda cuma perlu hubungi team official melalui channel rasmi.\n\nSoalan ketiga: Apakah itu agent CM8 VVIP dan bagaimana untuk jadi satu? Agent CM8 VVIP adalah authorised representative yang membantu platform dalam aspects tertentu.\n\nSoalan fourth: Apakah benefit menjadi agent CM8 VVIP? Benefits utama adalah commission yang jelas, support dari team headquarters, dan access kepada updates.\n\nSoalan fifth: Bagaimana CM8 VVIP handle data user dan privacy? Platform ini menggunakan encrypted communication channels untuk all user data.\n\nSoalan keenam: Where can I find official information about CM8 VVIP? All official information boleh dapat melalui website utama dan social media channels rasmi.\n\nSoalan ketujuh: What happen kalau ada masalah dengan account atau transactions? Anda boleh terus hubungi team support melalui official channels.\n\nSoalan kelapan: Ada tak guarantee profits kalau saya join sebagai agent? CM8 VVIP tidak provide sebarang guarantee profits.\n\nSoalan kesembilan: How to verify kalau sesuatu channel atau representative adalah sah? Anda boleh verify melalui official website contact page.\n\nSoalan kesepuluh: Apakah next steps kalau saya interested nak register sekarang? Langkah pertama adalah contacts authorized team melalui official channel.",
    category: "guide",
    status: "published"
  },
  {
    title: "Panduan CM8 Biasa vs VVIP - Pilih Yang Manakah Lebih Sesuai?",
    slug: "panduan-cm8-biasa-vs-vvip",
    excerpt: "Ramai yang confuse bezakan CM8 biasa dengan CM8 VVIP. Kedua-dua tier ini ada kelebihan masing-masing.",
    seoMetaTitle: "Panduan CM8 Biasa vs VVIP - Bezanya Dan Mana Yang Lebih Sesuai",
    seoMetaDescription: "Nak tahu beza CM8 biasa dengan CM8 VVIP? Baca panduan ringkas ini untuk faham kelebihan setiap tier.",
    content: "Apabila kita talk tentang CM8, sering ada confusion antara CM8 biasa dan CM8 VVIP tier. Kedua-duanya adalah bagian dari ecosystem yang sama.\n\nCM8 biasa adalah tier asas dalam ecosystem ini. Tier ini sesuai untuk pengguna yang just nak try out platform dan see how it works.\n\nCM8 VVIP pula adalah tier yang lebih premium. VIP extension bukan sekadar marketing gimmick - ia reflect kepada akses yang lebih luas, features yang lebih advanced, dan support yang lebih priority.\n\nDari perspective features, CM8 VVIP menawarkan beberapa exclusive benefits. Pertama adalah priority access kepada new features sebelum public release.\n\nDari perspective costs, CM8 VVIP mungkin memerlukan additional investment compare dengan tier biasa.\n\nDari perspective suitability, CM8 VVIP lebih sesuai untuk agent yang active, pengguna yang looking for more dedicated support, dan individuals yang plan to be long-term.\n\nCM8 biasa pula lebih sesuai untuk pengguna yang masih dalam evaluation phase, individual yang nak test waters dulu, dan pengguna dengan limited budget.\n\nDalam membuat decision antara CM8 biasa dan VVIP, factors perlu dipertimbangkan adalah current involvement level, budget dan financial capacity, dan your objectives.\n\nKesimpulan nya, pilihan antara CM8 biasa dan VVIP bergantung kepada individual circumstances. Evaluate your needs dan make informed decision.",
    category: "guide",
    status: "published"
  }
];

function generateId() { return Math.floor(Math.random() * 1000000) + 1; }
function buildLexicalContent(text) {
  const paragraphs = text.split('\n\n').filter(p => p.trim());
  const children = paragraphs.map(para => ({
    type: 'text', version: 1, text: para, style: {}, fields: {}
  }));
  return { root: { type: 'root', version: 1, children, direction: 'ltr', format: '', indent: 0 } };
}

const client = new Client({
  host: 'y8cw4owko88wgkokwgc8s0co',
  port: 5432,
  user: 'cm8user',
  password: 'cm8pass',
  database: 'cm8vvip'
});

async function publishNext(index) {
  if (index >= articles.length) {
    console.log('\nBatch 2 articles published successfully!');
    console.log('   - https://www.cm8vvip.com/blog/faq-cm8-vvip');
    console.log('   - https://www.cm8vvip.com/blog/panduan-cm8-biasa-vs-vvip');
    await client.end();
    return;
  }
  
  const article = articles[index];
  const now = new Date().toISOString();
  const content = JSON.stringify(buildLexicalContent(article.content));
  
  const query = `INSERT INTO blog_posts (id, title, slug, excerpt, content, category, status, published_date, created_at, updated_at, _status, seo_meta_title, seo_meta_description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, excerpt=EXCLUDED.excerpt, content=EXCLUDED.content, category=EXCLUDED.category, status=EXCLUDED.status, _status=EXCLUDED._status, updated_at=EXCLUDED.updated_at, seo_meta_title=EXCLUDED.seo_meta_title, seo_meta_description=EXCLUDED.seo_meta_description RETURNING id, slug, title;`;
  
  const values = [
    generateId(), 
    article.title, 
    article.slug, 
    article.excerpt, 
    content, 
    article.category, 
    article.status, 
    now, 
    now, 
    now, 
    article.status, 
    article.seoMetaTitle, 
    article.seoMetaDescription
  ];
  
  try {
    const result = await client.query(query, values);
    console.log('Published:', result.rows[0].title, '(slug:', result.rows[0].slug + ')');
    await publishNext(index + 1);
  } catch (err) {
    console.error('Error publishing:', article.title, err.message);
    await client.end();
    process.exit(1);
  }
}

console.log('Connecting to DB...');
client.connect().then(() => {
  console.log('Connected to DB!');
  return publishNext(0);
}).catch(err => {
  console.error('Connection error:', err.message);
  process.exit(1);
});