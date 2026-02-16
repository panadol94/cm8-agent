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

      <div className="page-hero">
        <span className="section-tag" style={{ marginBottom: 16 }}>
          {post.category}
        </span>
        <h1 className="page-hero-title">{post.title}</h1>
        <p className="page-hero-subtitle">{post.date}</p>
      </div>

      <section className="section">
        <div className="section-inner" style={{ maxWidth: 800, margin: '0 auto' }}>
          <article
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
            style={{ lineHeight: 1.8, fontSize: '1.05rem', color: '#374151' }}
          />
          <div style={{ marginTop: 48, textAlign: 'center' }}>
            <Link href="/blog" className="btn btn-outline">
              ← Kembali ke Blog
            </Link>
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
          <a href="/register" className="btn btn-white btn-lg">
            Daftar Sekarang →
          </a>
        </div>
      </section>
    </>
  )
}
