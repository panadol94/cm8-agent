import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Agent Judi Online Malaysia 2026 — Panduan Lengkap & Cara Daftar',
  description:
    'Panduan lengkap menjadi agent judi online di Malaysia. Komisyen sehingga 90%, daftar percuma, tanpa modal. Jadi agent CM8 hari ini.',
  keywords: [
    'agent judi',
    'agent judi online',
    'agent judi Malaysia',
    'agent slot online',
    'cara jadi agent judi',
    'daftar agent judi',
    'agent kasino online',
    'agent CM8',
    'agent Mega888',
    'agent 918Kiss',
  ],
  openGraph: {
    title: 'Agent Judi Online Malaysia — Panduan 2026',
    description: 'Panduan lengkap jadi agent judi online. Komisyen 90%, daftar percuma.',
    url: 'https://cm8vvip.com/agent-judi',
    siteName: 'CM8 VVIP',
    type: 'website',
  },
}

const faqs = [
  {
    q: 'Apa tugas seorang agent judi online?',
    a: 'Agent judi online bertindak sebagai perantara antara platform gaming dan pemain. Tugas utama termasuk merekrut pemain, memproses deposit dan withdrawal, dan memberikan sokongan pelanggan.',
  },
  {
    q: 'Berapa modal yang diperlukan untuk jadi agent?',
    a: 'Di CM8, anda boleh mendaftar sebagai agent secara percuma tanpa sebarang modal. Semua transaksi diuruskan melalui sistem platform.',
  },
  {
    q: 'Adakah menjadi agent judi online berisiko?',
    a: 'Sebagai agent, risiko anda minimum kerana anda tidak perlu menyediakan modal besar. Platform CM8 menguruskan semua aspek teknikal dan kewangan.',
  },
  {
    q: 'Berapa lama untuk mula menjana pendapatan?',
    a: 'Ramai agent mula menjana pendapatan dalam minggu pertama. Komisyen dikira secara real-time dan dibayar setiap minggu.',
  },
  {
    q: 'Bolehkah jadi agent di beberapa platform serentak?',
    a: 'Ya, tetapi CM8 sudah menyokong 20+ provider termasuk Mega888, 918Kiss, JILI, Pragmatic Play, dan banyak lagi.',
  },
]

export default function AgentJudiPage() {
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
                name: 'Agent Judi',
                item: 'https://cm8vvip.com/agent-judi',
              },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Agent Judi Online Malaysia 2026',
            author: { '@type': 'Organization', name: 'CM8 VVIP' },
            publisher: { '@type': 'Organization', name: 'CM8 VVIP' },
            datePublished: '2026-01-10',
            dateModified: '2026-02-19',
          }),
        }}
      />

      <div className="page-hero">
        <h1 className="page-hero-title">Agent Judi Online Malaysia 2026</h1>
        <p className="page-hero-subtitle">
          Panduan lengkap menjadi agent judi online yang berjaya. Komisyen sehingga 90%, daftar
          percuma, sokongan penuh dari platform CM8.
        </p>
      </div>

      <section className="info-section">
        <div className="info-section-inner">
          <div className="section-tag">Pengenalan</div>
          <h2 className="info-section-title">Apa Itu Agent Judi Online?</h2>
          <p className="info-section-desc">
            <strong>Agent judi online</strong> adalah individu yang bertindak sebagai perantara
            antara platform gaming dan pemain. Agent menyediakan perkhidmatan seperti pendaftaran
            akaun, pemprosesan deposit dan withdrawal, serta sokongan pelanggan kepada pemain.
          </p>
          <p className="info-section-desc">
            Dalam model perniagaan ini, agent memperoleh <strong>komisyen</strong> daripada setiap
            transaksi yang dibuat oleh pemain mereka. Di platform <Link href="/cm8">CM8</Link>,
            komisyen boleh mencecah sehingga <strong>90%</strong> — paling tinggi di pasaran
            Malaysia.
          </p>
          <p className="info-section-desc">
            Berbeza dengan pekerjaan biasa, menjadi agent judi online memberikan anda kebebasan masa
            dan lokasi. Ramai agent CM8 menjadikan ini sebagai{' '}
            <Link href="/buat-duit-online">sumber pendapatan utama</Link> mereka.
          </p>
        </div>
      </section>

      <section className="info-section info-section-alt">
        <div className="info-section-inner">
          <div className="section-tag">Panduan</div>
          <h2 className="info-section-title">🚀 Cara Jadi Agent Judi Online</h2>
          <div className="info-how-to">
            <div className="how-to-step">
              <div className="how-to-num">1</div>
              <div className="how-to-content">
                <h4>Pilih Platform Yang Tepat</h4>
                <p>
                  Pilih platform yang menawarkan komisyen tinggi dan sokongan baik.{' '}
                  <Link href="/cm8">CM8</Link> menawarkan komisyen 90% dan sokongan 24/7.
                </p>
              </div>
            </div>
            <div className="how-to-step">
              <div className="how-to-num">2</div>
              <div className="how-to-content">
                <h4>Daftar Sebagai Agent</h4>
                <p>
                  <Link href="/register">Daftar secara percuma</Link> di CM8. Proses mengambil masa
                  kurang 5 minit. <Link href="/komisen-tanpa-modal">Tiada modal diperlukan</Link>.
                </p>
              </div>
            </div>
            <div className="how-to-step">
              <div className="how-to-num">3</div>
              <div className="how-to-content">
                <h4>Bina Rangkaian Pemain</h4>
                <p>
                  Gunakan media sosial, WhatsApp, dan Telegram untuk mencari pemain. CM8 menyediakan
                  bahan pemasaran percuma.
                </p>
              </div>
            </div>
            <div className="how-to-step">
              <div className="how-to-num">4</div>
              <div className="how-to-content">
                <h4>Urus Pemain & Bina Downline</h4>
                <p>
                  Berikan perkhidmatan terbaik. Rekrut agent lain untuk jana pendapatan pasif
                  melalui override commission.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="info-section">
        <div className="info-section-inner">
          <div className="section-tag">Komisyen</div>
          <h2 className="info-section-title">💰 Struktur Komisyen Agent CM8</h2>
          <div className="info-pillars">
            <div className="info-pillar">
              <h3>🌟 Newbie Agent — 60%</h3>
              <p>
                Untuk agent baru. Tiada target minimum. Akses dashboard asas dan bahan pemasaran
                percuma.
              </p>
            </div>
            <div className="info-pillar">
              <h3>👑 Solo Player — 80%</h3>
              <p>
                Untuk agent dengan 5+ pemain aktif. Dashboard premium dan sokongan prioriti 24/7.
              </p>
            </div>
            <div className="info-pillar">
              <h3>💎 Team Builder — 90%</h3>
              <p>Tier tertinggi. Komisyen 90%, pendapatan downline, bonus dan insentif khas.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="info-section info-section-alt">
        <div className="info-section-inner">
          <div className="section-tag">Platform</div>
          <h2 className="info-section-title">🎰 Platform Gaming Yang Disokong</h2>
          <div className="info-pillars">
            <div className="info-pillar">
              <h3>
                <Link href="/kiosk-mega888">Mega888</Link>
              </h3>
              <p>
                Platform slot #1 di Malaysia. Ratusan permainan slot, fishing, dan live casino.
                Tersedia dengan AI scanner.
              </p>
            </div>
            <div className="info-pillar">
              <h3>
                <Link href="/kiosk-918kiss">918Kiss</Link>
              </h3>
              <p>Platform slot klasik yang dipercayai jutaan pemain. Interface mesra pengguna.</p>
            </div>
            <div className="info-pillar">
              <h3>
                <Link href="/cm8-play">20+ Provider</Link>
              </h3>
              <p>JILI, Pragmatic Play, Hacksaw, Habanero, Playtech, BNG, Spade Gaming, dan lagi.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="info-section">
        <div className="info-section-inner">
          <div className="section-tag">Soalan Lazim</div>
          <h2 className="info-section-title">❓ Soalan Lazim — Agent Judi</h2>
          <div className="info-faq-list">
            {faqs.map((f, i) => (
              <details key={i} className="faq-item">
                <summary className="faq-question">
                  {f.q}
                  <span className="faq-icon">+</span>
                </summary>
                <div className="faq-answer">
                  <div className="faq-answer-inner">{f.a}</div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="info-section info-section-alt">
        <div className="info-section-inner">
          <div className="section-tag">Artikel Berkaitan</div>
          <h2 className="info-section-title">📚 Baca Lagi</h2>
          <div className="info-pillars">
            <div className="info-pillar">
              <h3>
                <Link href="/buat-duit-online">Buat Duit Online</Link>
              </h3>
              <p>Pelbagai cara buat duit online di Malaysia.</p>
            </div>
            <div className="info-pillar">
              <h3>
                <Link href="/komisen-tanpa-modal">Komisen Tanpa Modal</Link>
              </h3>
              <p>Jana komisyen tinggi tanpa modal permulaan.</p>
            </div>
            <div className="info-pillar">
              <h3>
                <Link href="/hack-slot-malaysia">Hack Slot Malaysia</Link>
              </h3>
              <p>Teknologi AI scanner untuk pemain anda.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Mula Jadi Agent Hari Ini</h2>
          <p className="cta-subtitle">Daftar percuma, tanpa modal, komisyen sehingga 90%.</p>
          <a
            href="https://masuk10.com/WhatsappVVIP"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-white btn-lg"
          >
            Daftar Agent Sekarang →
          </a>
        </div>
      </section>
    </>
  )
}
