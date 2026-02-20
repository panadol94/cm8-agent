import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'

/* Placeholder blog post detail — will be fetched from CMS */
const postData: Record<string, { title: string; category: string; date: string; content: string }> =
  {
    'cara-jadi-agent-cm8-berjaya': {
      title: '5 Cara Menjadi Agent CM8 Yang Berjaya',
      category: 'Panduan Agent',
      date: '15 Feb 2026',
      content: `
      <h2>1. Fahami Platform Dengan Mendalam</h2>
      <p>Sebelum mula memasarkan, pastikan anda memahami sepenuhnya platform CM8. Ketahui semua permainan yang ditawarkan, kelebihan platform, dan cara sistem komisyen berfungsi.</p>
      
      <h2>2. Bina Rangkaian Sosial Media</h2>
      <p>Gunakan platform seperti Facebook, Instagram, dan TikTok untuk menjangkau lebih ramai pelanggan. Kongsikan testimoni, promosi terkini, dan tips berguna.</p>
      
      <h2>3. Berikan Perkhidmatan Terbaik</h2>
      <p>Pelanggan yang berpuas hati akan kembali dan merujuk rakan-rakan mereka kepada anda. Sentiasa responsif dan bantu pelanggan anda dengan segera.</p>
      
      <h2>4. Gunakan Bahan Pemasaran Yang Disediakan</h2>
      <p>CM8 menyediakan pelbagai bahan pemasaran profesional. Gunakan banner, poster, dan copywriting yang telah disediakan untuk menjimatkan masa anda.</p>
      
      <h2>5. Bina Downline Anda</h2>
      <p>Jangan hanya fokus pada pelanggan sahaja. Ajak rakan-rakan yang berminat untuk menjadi agent juga. Dengan sistem downline CM8, setiap transaksi mereka turut menjana komisyen untuk anda.</p>
    `,
    },
    'komisyen-tinggi-platform-cm8': {
      title: 'Kenapa Komisyen CM8 Paling Tinggi Di Pasaran (Sehingga 90%)',
      category: 'Tips & Strategi',
      date: '12 Feb 2026',
      content: `
      <p>Dalam industri ejen kasino dalam talian di Malaysia, kadar komisyen adalah faktor penentu utama. Ramai agent beralih ke <strong>CM8 VVIP</strong> kerana kami menawarkan struktur komisyen yang paling kompetitif, mencecah sehingga <strong>90%</strong> tanpa kos tersembunyi.</p>

      <h2>Perbandingan Komisyen: CM8 vs Platform Lain</h2>
      <p>Kebanyakan platform standard menawarkan komisyen sekitar 20% - 30%. Di CM8, kami bermula dengan asas yang lebih tinggi dan struktur kenaikan pangkat yang jelas:</p>
      <ul>
        <li><strong>Newbie Agent:</strong> 60% (vs 15% di tempat lain)</li>
        <li><strong>Solo Player Agent:</strong> 80% (vs 25% di tempat lain)</li>
        <li><strong>Team Builder Agent:</strong> 90% (Eksklusif untuk CM8)</li>
      </ul>

      <h2>Tiada 'Hidden Cost' atau 'Platform Fee'</h2>
      <p>Sering kali, agent terpedaya dengan tawaran komisyen tinggi tetapi dipotong pelbagai yuran (maintenance fee, platform fee). Di CM8 VVIP, <strong>apa yang anda lihat, itu yang anda dapat</strong>. Pengiraan adalah telus melalui dashboard agent kami.</p>

      <h2>Bagaimana Cara Naikkan Komisyen ke 90%?</h2>
      <p>Kunci utama adalah <strong>konsistensi deposit</strong> dan <strong>jumlah turnover</strong> kumpulan anda. Sebagai Rakan Niaga VVIP, anda diberikan akses kepada:</p>
      <ol>
        <li>Sistem penjejakan real-time untuk memantau prestasi downline.</li>
        <li>Bahan marketing premium untuk menarik 'High Rollers'.</li>
        <li>Sokongan admin peribadi untuk menyelesaikan isu pemain dengan pantas.</li>
      </ol>

      <p>Jangan lepaskan peluang untuk menjana pendapatan 5 angka seminggu. <a href="/register">Daftar sebagai agent CM8</a> hari ini dan nikmati struktur komisyen terbaik di pasaran.</p>
      `,
    },
    'pendapatan-pasif-agent-downline': {
      title: 'Rahsia Jana Pendapatan Pasif RM10k/Bulan Melalui Sistem Downline',
      category: 'Tips & Strategi',
      date: '10 Feb 2026',
      content: `
      <p>Ramai yang menyangka menjadi agent bermaksud perlu mencari pemain setiap hari. Itu cara lama. <strong>Top Agent CM8</strong> menggunakan strategi "Smart Downline" untuk menjana pendapatan pasif walaupun ketika mereka sedang bercuti.</p>

      <h2>Apa Itu Sistem Downline CM8?</h2>
      <p>Sistem downline membolehkan anda merekrut agent lain di bawah rangkaian anda. Anda bukan sahaja mendapat komisyen daripada pemain terus anda, tetapi juga <strong>override commission</strong> daripada jualan agent di bawah anda.</p>

      <h2>Kuasa Gandaan (The Power of Leverage)</h2>
      <p>Bayangkan anda mempunyai 10 agent di bawah anda. Setiap agent mempunyai 50 pemain aktif. Secara tidak langsung, anda mempunyai akses kepada 500 pemain tanpa perlu menguruskan mereka seorang demi seorang.</p>
      <blockquote>"Saya bermula solo, tapi kini saya ada 5 Master Agent di bawah saya. Pendapatan pasif saya melebihi RM15,000 sebulan tanpa perlu reply WhatsApp pemain." – <em>Master Agent Ah Meng</em></blockquote>

      <h2>Strategi Membina Empayar Downline</h2>
      <h3>1. Fokus Kualiti, Bukan Kuantiti</h3>
      <p>Cari agent yang "lapar" kejayaan, bukan sekadar mereka yang nak cuba-cuba. Berikan mereka training (gunakan materi dari Blog CM8) supaya mereka pandai mencari sales.</p>

      <h3>2. Tawarkan Insentif Sendiri</h3>
      <p>Leader yang bagus akan buat contest kecil untuk downline mereka. Contoh: "Siapa hit sales RM10k minggu ni dapat bonus RM200". Ini membakar semangat team anda.</p>

      <h3>3. Gunakan Sistem Dashboard Sepenuhnya</h3>
      <p>Pantau siapa agent yang aktif dan siapa yang tidur. Fokus masa anda untuk bantu agent yang aktif berkembang. Dashboard VVIP kami memudahkan anda melihat prestasi setiap level downline.</p>

      <p>Sudah bersedia untuk membina empayar perniagaan anda sendiri? <a href="/info">Pelajari Model Bisnes VVIP</a> kami sekarang.</p>
      `,
    },
  }

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = postData[slug]
  return {
    title: post?.title || 'Blog Post',
    description: post?.title ? `Baca artikel: ${post.title} — CM8 VVIP` : 'Artikel dari CM8 VVIP',
  }
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params
  const post = postData[slug]

  if (!post) {
    return (
      <>
        <div className="page-hero">
          <h1 className="page-hero-title">Artikel Tidak Ditemui</h1>
          <p className="page-hero-subtitle">Maaf, artikel yang anda cari tidak wujud.</p>
        </div>
        <section className="section" style={{ textAlign: 'center' }}>
          <Link href="/blog" className="btn btn-primary">
            Kembali ke Blog
          </Link>
        </section>
      </>
    )
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            datePublished: '2026-02-15',
            author: { '@type': 'Organization', name: 'CM8 VVIP' },
            publisher: { '@type': 'Organization', name: 'CM8 VVIP' },
          }),
        }}
      />

      {/* Hero */}
      <div className="page-hero">
        <span className="section-tag" style={{ marginBottom: 12 }}>
          {post.category}
        </span>
        <h1 className="page-hero-title">{post.title}</h1>
        <p className="page-hero-subtitle">{post.date}</p>
      </div>

      <section className="section">
        <div className="blog-article-wrapper">
          {/* Meta Bar */}
          <div className="blog-article-meta">
            <div className="blog-article-meta-item">
              <span className="meta-icon">✍️</span>
              <span>CM8 VVIP Team</span>
            </div>
            <div className="blog-article-meta-divider" />
            <div className="blog-article-meta-item">
              <span className="meta-icon">📅</span>
              <span>{post.date}</span>
            </div>
            <div className="blog-article-meta-divider" />
            <div className="blog-article-meta-item">
              <span className="meta-icon">📖</span>
              <span>5 min read</span>
            </div>
          </div>

          {/* Article Content */}
          <article className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />

          {/* Share Bar */}
          <div className="blog-share-bar">
            <span className="blog-share-label">Share</span>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(post.title + ' — CM8 VVIP')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="blog-share-btn"
              aria-label="Share on WhatsApp"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
            <a
              href={`https://t.me/share/url?url=cm8vvip.com/blog/${slug}&text=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="blog-share-btn"
              aria-label="Share on Telegram"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=cm8vvip.com/blog/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="blog-share-btn"
              aria-label="Share on Facebook"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          </div>

          {/* Back Button */}
          <div className="blog-nav-bottom">
            <Link href="/blog" className="btn btn-outline">
              ← Kembali ke Blog
            </Link>
            <a
              href="https://masuk10.com/Wasapvvipcs"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gradient"
            >
              Daftar Jadi Agent →
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Sedia Untuk Bermula?</h2>
          <p className="cta-subtitle">
            Daftar sebagai agent CM8 dan mula jana pendapatan hari ini.
          </p>
          <a
            href="https://masuk10.com/Wasapvvipcs"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-white btn-lg"
          >
            Daftar Sekarang →
          </a>
        </div>
      </section>
    </>
  )
}
