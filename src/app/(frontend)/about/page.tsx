import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tentang CM8 VVIP',
  description:
    'Kenali CM8 VVIP — platform agent terpercaya #1 di Malaysia. Baca kisah kami, misi, dan visi untuk membina rangkaian agent terbesar.',
}

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://cm8vvip.com' },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Tentang Kami',
                item: 'https://cm8vvip.com/about',
              },
            ],
          }),
        }}
      />

      <div className="page-hero">
        <h1 className="page-hero-title">Tentang CM8 VVIP</h1>
        <p className="page-hero-subtitle">
          Platform agent terpercaya yang telah membina ribuan agent berjaya di seluruh Malaysia.
        </p>
      </div>

      <section className="section">
        <div className="section-inner">
          <div className="about-grid">
            <div className="about-content">
              <div className="section-tag">Kisah Kami</div>
              <h2>Platform Yang Memberi Peluang Kepada Semua</h2>
              <p>
                CM8 VVIP ditubuhkan dengan misi untuk memberikan peluang pendapatan tanpa had kepada
                sesiapa sahaja yang berminat. Kami percaya bahawa setiap orang berhak mendapat
                peluang untuk berjaya.
              </p>
              <p>
                Dengan teknologi terkini dan sistem sokongan yang komprehensif, kami telah berjaya
                membina rangkaian agent yang aktif di seluruh Malaysia. Setiap agent kami dilengkapi
                dengan alat dan pengetahuan yang diperlukan untuk berjaya.
              </p>
              <p>
                Visi kami adalah untuk menjadi platform agent #1 di Asia Tenggara, dengan
                memberikan komisyen tertinggi, sokongan terbaik, dan pengalaman yang tiada
                tandingan.
              </p>
            </div>
            <div className="about-image">🏢</div>
          </div>
        </div>
      </section>

      <section className="section section-cream">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-tag">Kenapa Kami</div>
            <h2 className="section-title">Apa Yang Membezakan CM8 VVIP</h2>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3>Terbukti Sejak 2020</h3>
              <p>
                Lebih 5 tahun pengalaman dalam industri dengan rekod prestasi yang cemerlang dan
                ribuan agent yang berpuas hati.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Keselamatan Terjamin</h3>
              <p>
                Sistem keselamatan bertaraf dunia dengan enkripsi data dan perlindungan akaun yang
                kukuh untuk setiap agent.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Transaksi Pantas</h3>
              <p>
                Pemprosesan deposit dan pengeluaran yang pantas. Komisyen dibayar secara automatik
                setiap minggu tanpa gagal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Sertai Keluarga CM8 VVIP</h2>
          <p className="cta-subtitle">
            Ribuan agent telah membuktikan kejayaan mereka bersama kami. Kini giliran anda.
          </p>
          <a href="/register" className="btn btn-white btn-lg">
            Daftar Sebagai Agent →
          </a>
        </div>
      </section>
    </>
  )
}
