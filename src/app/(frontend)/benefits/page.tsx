export const revalidate = 60

import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kelebihan Agent CM8',
  description:
    'Ketahui semua kelebihan menjadi agent CM8 VVIP. Komisyen tinggi, alat pemasaran percuma, sokongan 24/7, dan banyak lagi.',
}

const benefits = [
  {
    icon: '💰',
    title: 'Komisyen Sehingga 90%',
    desc: 'Nikmati komisyen tertinggi di pasaran. Semakin ramai downline anda, semakin tinggi peratusan komisyen yang anda dapat.',
  },
  {
    icon: '📱',
    title: 'Dashboard Real-Time',
    desc: 'Pantau semua transaksi, komisyen, dan prestasi anda secara langsung melalui dashboard yang canggih dan mudah digunakan.',
  },
  {
    icon: '🎨',
    title: 'Bahan Pemasaran Percuma',
    desc: 'Dapatkan banner, poster, copywriting, dan bahan pemasaran profesional secara percuma. Hanya muat turun dan gunakan.',
  },
  {
    icon: '🏦',
    title: 'Pembayaran Mingguan',
    desc: 'Komisyen dibayar setiap minggu terus ke akaun bank anda. Tiada had minimum pengeluaran dan proses 100% automatik.',
  },
  {
    icon: '👨‍💼',
    title: 'Pengurus Akaun Peribadi',
    desc: 'Setiap agent diberi pengurus akaun peribadi untuk membantu anda mencapai sasaran dan menyelesaikan sebarang masalah.',
  },
  {
    icon: '📈',
    title: 'Pendapatan Downline',
    desc: 'Bina rangkaian downline anda dan jana pendapatan pasif. Setiap transaksi downline anda turut menjana komisyen untuk anda.',
  },
  {
    icon: '🎓',
    title: 'Latihan & Bimbingan',
    desc: 'Dapatkan latihan penuh dari hari pertama. Kami sediakan video tutorial, panduan, dan sesi bimbingan berkala.',
  },
  {
    icon: '🌐',
    title: 'Platform Stabil 24/7',
    desc: 'Sistem dengan uptime 99.9% memastikan anda dan pelanggan anda sentiasa boleh bermain tanpa gangguan.',
  },
]

export default function BenefitsPage() {
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
                name: 'Kelebihan',
                item: 'https://cm8vvip.com/benefits',
              },
            ],
          }),
        }}
      />

      <div className="page-hero">
        <h1 className="page-hero-title">Kelebihan Agent CM8</h1>
        <p className="page-hero-subtitle">
          Ketahui semua kelebihan eksklusif yang anda akan dapat sebagai agent CM8 VVIP.
        </p>
      </div>

      <section className="section">
        <div className="section-inner">
          <div className="benefits-grid">
            {benefits.map((b, i) => (
              <div key={i} className="benefit-card">
                <div className="benefit-icon">{b.icon}</div>
                <div className="benefit-content">
                  <h3>{b.title}</h3>
                  <p>{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Sedia Untuk Bermula?</h2>
          <p className="cta-subtitle">
            Jangan lepaskan peluang ini. Daftar sekarang dan mula jana pendapatan sebagai agent CM8.
          </p>
          <a href="/register" className="btn btn-white btn-lg">
            Daftar Sebagai Agent →
          </a>
        </div>
      </section>
    </>
  )
}
