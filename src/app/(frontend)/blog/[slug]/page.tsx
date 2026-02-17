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
              💬
            </a>
            <a
              href={`https://t.me/share/url?url=cm8vvip.com/blog/${slug}&text=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="blog-share-btn"
              aria-label="Share on Telegram"
            >
              ✈️
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=cm8vvip.com/blog/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="blog-share-btn"
              aria-label="Share on Facebook"
            >
              📘
            </a>
          </div>

          {/* Back Button */}
          <div className="blog-nav-bottom">
            <Link href="/blog" className="btn btn-outline">
              ← Kembali ke Blog
            </Link>
            <a
              href="https://masuk10.com/WhatsappVVIP"
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
            href="https://masuk10.com/WhatsappVVIP"
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
