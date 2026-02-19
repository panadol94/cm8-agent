import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Komisen Tanpa Modal 2026 — Jana Pendapatan Agent Slot Percuma',
  description:
    'Jana komisyen sehingga 90% tanpa modal permulaan. Daftar percuma sebagai agent CM8, tiada yuran tersembunyi. Panduan lengkap program agent tanpa modal.',
  keywords: [
    'komisen tanpa modal',
    'komisyen tanpa modal',
    'agent tanpa modal',
    'daftar agent percuma',
    'buat duit tanpa modal',
    'CM8 tanpa modal',
    'agent slot percuma',
    'komisyen agent percuma',
  ],
  openGraph: {
    title: 'Komisen Tanpa Modal — Agent CM8 Percuma',
    description: 'Jana komisyen 90% tanpa modal. Daftar agent percuma.',
    url: 'https://cm8vvip.com/komisen-tanpa-modal',
    siteName: 'CM8 VVIP',
    type: 'website',
  },
}

const faqs = [
  {
    q: 'Betulkah tiada modal langsung?',
    a: 'Ya, 100% tiada modal. Pendaftaran percuma, tiada maintenance fee, tiada yuran tersembunyi. Anda hanya perlu smartphone dan internet.',
  },
  {
    q: 'Bagaimana CM8 mampu beri komisyen tinggi tanpa modal?',
    a: 'CM8 menjana pendapatan dari margin platform gaming. Komisyen agent datang dari bahagian platform, bukan dari poket anda.',
  },
  {
    q: 'Ada tak kos tersembunyi yang perlu dibayar kemudian?',
    a: 'Tiada langsung. Pengiraan komisyen 100% telus melalui dashboard. Apa yang terpapar, itu yang anda terima.',
  },
  {
    q: 'Bila boleh mula dapat komisyen?',
    a: 'Sebaik sahaja pemain pertama anda mula bermain, komisyen dikira secara automatik dan dibayar setiap minggu.',
  },
]

export default function KomisenTanpaModalPage() {
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
                name: 'Komisen Tanpa Modal',
                item: 'https://cm8vvip.com/komisen-tanpa-modal',
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
            headline: 'Komisen Tanpa Modal — Jana Pendapatan Agent Slot Percuma',
            author: { '@type': 'Organization', name: 'CM8 VVIP' },
            publisher: { '@type': 'Organization', name: 'CM8 VVIP' },
            datePublished: '2026-01-20',
            dateModified: '2026-02-19',
          }),
        }}
      />

      <div className="page-hero">
        <h1 className="page-hero-title">Komisen Tanpa Modal — Daftar Percuma</h1>
        <p className="page-hero-subtitle">
          Jana komisyen sehingga 90% sebagai agent CM8 tanpa mengeluarkan sebarang modal. Daftar
          percuma, mula jana pendapatan hari ini.
        </p>
      </div>

      <section className="info-section">
        <div className="info-section-inner">
          <div className="section-tag">Tanpa Modal</div>
          <h2 className="info-section-title">Apa Maksud Komisen Tanpa Modal?</h2>
          <p className="info-section-desc">
            <strong>Komisen tanpa modal</strong> bermaksud anda boleh mula menjana pendapatan
            sebagai agent tanpa perlu mengeluarkan sebarang wang permulaan. Di platform{' '}
            <Link href="/cm8">CM8</Link>, pendaftaran agent adalah 100% percuma — tiada deposit,
            tiada yuran bulanan, tiada kos tersembunyi.
          </p>
          <p className="info-section-desc">
            Ini berbeza dengan banyak platform lain yang memerlukan agent menyediakan
            &quot;float&quot; atau modal permulaan yang besar. Di CM8, sistem platform menguruskan
            semua transaksi. Anda hanya fokus pada merekrut pemain dan memberikan perkhidmatan yang
            baik.
          </p>
          <p className="info-section-desc">
            Ramai yang skeptikal pada mulanya — &quot;Mana ada benda free yang bagus?&quot; Tetapi
            hakikatnya, ribuan agent CM8 yang bermula dengan sifar kini menjana{' '}
            <Link href="/buat-duit-online">pendapatan ribuan ringgit</Link> setiap minggu.
          </p>
        </div>
      </section>

      <section className="info-section info-section-alt">
        <div className="info-section-inner">
          <div className="section-tag">Perbandingan</div>
          <h2 className="info-section-title">📊 CM8 vs Platform Lain</h2>
          <div className="info-pillars">
            <div className="info-pillar">
              <h3>❌ Platform Biasa</h3>
              <p>
                Modal permulaan RM500 - RM5,000. Komisyen hanya 15-30%. Yuran bulanan RM50-RM200.
                Float pemain dari poket sendiri. Risiko kerugian tinggi.
              </p>
            </div>
            <div className="info-pillar">
              <h3>✅ CM8 VVIP</h3>
              <p>
                Modal: RM0 (percuma). Komisyen 60-90%. Tiada yuran bulanan. Transaksi diurus oleh
                platform. Risiko sifar kerana tiada modal.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="info-section">
        <div className="info-section-inner">
          <div className="section-tag">Struktur</div>
          <h2 className="info-section-title">💰 Struktur Komisyen CM8</h2>
          <p className="info-section-desc">
            Walaupun percuma, komisyen yang ditawarkan adalah yang tertinggi di pasaran:
          </p>
          <div className="info-how-to">
            <div className="how-to-step">
              <div className="how-to-num">60%</div>
              <div className="how-to-content">
                <h4>Newbie Agent</h4>
                <p>
                  Bermula dari hari pertama. Admin ajar cara promote. Akses dashboard dan bahan
                  pemasaran percuma.
                </p>
              </div>
            </div>
            <div className="how-to-step">
              <div className="how-to-num">80%</div>
              <div className="how-to-content">
                <h4>Solo Player Agent</h4>
                <p>Naik selepas capai target sales. Dashboard premium, sokongan prioriti 24/7.</p>
              </div>
            </div>
            <div className="how-to-step">
              <div className="how-to-num">90%</div>
              <div className="how-to-content">
                <h4>Team Builder Agent</h4>
                <p>
                  Komisyen tertinggi. Bina team sendiri, pendapatan downline, bonus dan insentif
                  khas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="info-section info-section-alt">
        <div className="info-section-inner">
          <div className="section-tag">Cara Mula</div>
          <h2 className="info-section-title">🚀 Cara Jana Komisen Tanpa Modal</h2>
          <div className="info-how-to">
            <div className="how-to-step">
              <div className="how-to-num">1</div>
              <div className="how-to-content">
                <h4>Daftar Percuma</h4>
                <p>
                  Isi borang di halaman <Link href="/register">pendaftaran</Link> atau terus hubungi
                  admin via WhatsApp. Selesai dalam 5 minit.
                </p>
              </div>
            </div>
            <div className="how-to-step">
              <div className="how-to-num">2</div>
              <div className="how-to-content">
                <h4>Terima Akses Dashboard</h4>
                <p>
                  Dashboard agent lengkap dengan alat pengurusan pemain, tracking komisyen, dan
                  bahan pemasaran.
                </p>
              </div>
            </div>
            <div className="how-to-step">
              <div className="how-to-num">3</div>
              <div className="how-to-content">
                <h4>Promosi & Kumpul Pemain</h4>
                <p>
                  Gunakan media sosial dan WhatsApp. Kongsi{' '}
                  <Link href="/hack-slot-malaysia">tips scanner slot</Link> untuk tarik perhatian.
                </p>
              </div>
            </div>
            <div className="how-to-step">
              <div className="how-to-num">4</div>
              <div className="how-to-content">
                <h4>Terima Komisyen Mingguan</h4>
                <p>Komisyen dikira automatik dan dibayar terus ke akaun bank anda setiap minggu.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="info-section">
        <div className="info-section-inner">
          <div className="section-tag">Soalan Lazim</div>
          <h2 className="info-section-title">❓ Soalan Lazim</h2>
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
                <Link href="/cm8">Apa Itu CM8?</Link>
              </h3>
              <p>Ketahui segala tentang platform CM8.</p>
            </div>
            <div className="info-pillar">
              <h3>
                <Link href="/agent-judi">Agent Judi Online</Link>
              </h3>
              <p>Panduan lengkap menjadi agent judi.</p>
            </div>
            <div className="info-pillar">
              <h3>
                <Link href="/buat-duit-online">Buat Duit Online</Link>
              </h3>
              <p>Cara-cara buat duit online di Malaysia.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Mula Jana Komisen Hari Ini</h2>
          <p className="cta-subtitle">Daftar percuma, tanpa modal, komisyen sehingga 90%.</p>
          <a
            href="https://masuk10.com/WhatsappVVIP"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-white btn-lg"
          >
            Daftar Percuma Sekarang →
          </a>
        </div>
      </section>
    </>
  )
}
