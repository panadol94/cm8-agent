export const revalidate = 60

import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CM8 — Platform Agent & Scanner Slot #1 Malaysia 2026',
  description:
    'CM8 adalah platform agent slot terbesar di Malaysia. Daftar percuma, komisyen sehingga 90%, AI scanner slot real-time, dan sokongan 24/7. Mula jana pendapatan hari ini.',
  keywords: [
    'CM8',
    'CM8 Malaysia',
    'CM8 agent',
    'CM8 platform',
    'CM8 slot',
    'CM8 scanner',
    'CM8 VVIP',
    'CM8 login',
    'CM8 register',
    'CM8 daftar',
    'platform agent Malaysia',
  ],
  openGraph: {
    title: 'CM8 — Platform Agent & Scanner Slot #1 Malaysia',
    description:
      'Platform agent slot terbesar di Malaysia. Komisyen 90%, AI scanner, daftar percuma.',
    url: 'https://cm8vvip.com/cm8',
    siteName: 'CM8 VVIP',
    type: 'website',
  },
}

const cm8Faqs = [
  {
    q: 'Apa itu CM8?',
    a: 'CM8 adalah singkatan untuk CashMarket 8, platform agent slot dan gaming online terbesar di Malaysia. Kami menyediakan teknologi AI scanner, program komisyen agent sehingga 90%, dan komuniti sokongan aktif.',
  },
  {
    q: 'Adakah CM8 platform yang sah?',
    a: 'Ya, CM8 beroperasi sebagai platform perantara agent yang telah beroperasi sejak 2020. Kami mempunyai ribuan agent aktif dan rekod pembayaran yang konsisten.',
  },
  {
    q: 'Bagaimana cara daftar CM8?',
    a: 'Anda boleh mendaftar secara percuma melalui halaman pendaftaran kami atau menghubungi admin melalui WhatsApp. Proses pendaftaran mengambil masa kurang dari 5 minit.',
  },
  {
    q: 'Berapa komisyen yang ditawarkan CM8?',
    a: 'CM8 menawarkan komisyen bermula dari 60% untuk Newbie Agent, 80% untuk Solo Player Agent, dan sehingga 90% untuk Team Builder Agent. Bayaran dibuat secara mingguan.',
  },
  {
    q: 'Apakah kelebihan CM8 berbanding platform lain?',
    a: 'CM8 menawarkan komisyen tertinggi di pasaran, AI scanner slot real-time, dashboard agent yang lengkap, sokongan 24/7, dan tiada yuran tersembunyi.',
  },
]

export default function CM8Page() {
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
              { '@type': 'ListItem', position: 2, name: 'CM8', item: 'https://cm8vvip.com/cm8' },
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
            mainEntity: cm8Faqs.map((f) => ({
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
            headline: 'CM8 — Platform Agent & Scanner Slot #1 Malaysia',
            description:
              'Panduan lengkap tentang platform CM8, cara daftar, komisyen, dan kelebihan menjadi agent CM8.',
            author: { '@type': 'Organization', name: 'CM8 VVIP' },
            publisher: { '@type': 'Organization', name: 'CM8 VVIP' },
            datePublished: '2026-01-01',
            dateModified: '2026-02-19',
          }),
        }}
      />

      {/* Hero */}
      <div className="page-hero">
        <h1 className="page-hero-title">CM8 — Platform Agent Slot #1 Malaysia</h1>
        <p className="page-hero-subtitle">
          Platform agent dan scanner slot terbesar di Malaysia dengan komisyen sehingga 90%,
          teknologi AI scanner, dan komuniti ribuan agent aktif.
        </p>
      </div>

      {/* Section 1: Apa Itu CM8 */}
      <section className="info-section">
        <div className="info-section-inner">
          <div className="section-tag">Pengenalan</div>
          <h2 className="info-section-title">Apa Itu CM8?</h2>
          <p className="info-section-desc">
            <strong>CM8</strong> (CashMarket 8) adalah platform agent slot dan gaming online yang
            paling dipercayai di Malaysia. Sejak penubuhannya pada tahun 2020, CM8 telah membina
            rangkaian lebih daripada <strong>1,200 agent aktif</strong> di seluruh Malaysia yang
            menjana pendapatan tetap setiap minggu.
          </p>
          <p className="info-section-desc">
            Berbeza dengan platform lain, CM8 bukan sekadar tempat untuk mendaftar sebagai agent.
            CM8 adalah <strong>ekosistem lengkap</strong> yang menyediakan teknologi{' '}
            <Link href="/patch-id">AI Scanner slot</Link>, program komisyen bertingkat sehingga 90%,
            dashboard pengurusan agent yang canggih, serta komuniti sokongan yang aktif melalui{' '}
            <strong>Telegram</strong> dan <strong>WhatsApp</strong>.
          </p>
          <p className="info-section-desc">
            Sama ada anda ingin <Link href="/buat-duit-online">buat duit online</Link> secara
            sampingan atau menjadikannya pendapatan utama, CM8 menyediakan semua alat yang anda
            perlukan untuk berjaya. Ramai agent kami yang bermula tanpa pengalaman kini menjana{' '}
            <strong>RM3,000 - RM15,000 seminggu</strong>.
          </p>
        </div>
      </section>

      {/* Section 2: Kelebihan CM8 */}
      <section className="info-section info-section-alt">
        <div className="info-section-inner">
          <div className="section-tag">Kelebihan</div>
          <h2 className="info-section-title">🏆 Kenapa Pilih CM8?</h2>
          <div className="info-pillars">
            <div className="info-pillar">
              <h3>💰 Komisyen Tertinggi</h3>
              <p>
                Komisyen sehingga 90% — paling tinggi di pasaran Malaysia. Tiada yuran tersembunyi,
                tiada potongan platform. Apa yang anda lihat, itu yang anda dapat. Bayaran dibuat
                secara mingguan terus ke akaun bank anda.
              </p>
              <Link href="/komisen-tanpa-modal" className="btn btn-outline btn-sm">
                Pelajari Komisyen →
              </Link>
            </div>
            <div className="info-pillar">
              <h3>🔍 AI Scanner Slot</h3>
              <p>
                Teknologi eksklusif CM8 yang menganalisis peratusan RTP slot secara real-time.
                Scanner kami menyokong platform seperti Mega888, 918Kiss, dan 20+ provider lain.
                Ketahui slot mana yang &apos;panas&apos; sebelum bermain.
              </p>
              <Link href="/hack-slot-malaysia" className="btn btn-outline btn-sm">
                Tentang Scanner →
              </Link>
            </div>
            <div className="info-pillar">
              <h3>👥 Komuniti Terbesar</h3>
              <p>
                Sertai komuniti 1,200+ agent aktif di Telegram dan WhatsApp. Kongsi strategi, tips,
                dan dapatkan sokongan terus dari pasukan CM8 dan agent-agent berpengalaman.
              </p>
              <Link href="/info" className="btn btn-outline btn-sm">
                Lihat Komuniti →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Platform Yang Disokong */}
      <section className="info-section">
        <div className="info-section-inner">
          <div className="section-tag">Platform</div>
          <h2 className="info-section-title">🎰 Platform Game CM8</h2>
          <p className="info-section-desc">
            CM8 menyokong pelbagai platform gaming terkemuka di Malaysia. Sebagai agent CM8, anda
            boleh menawarkan permainan dari semua platform ini kepada pemain anda:
          </p>
          <div className="info-pillars">
            <div className="info-pillar">
              <h3>Mega888</h3>
              <p>
                Platform slot paling popular di Malaysia. CM8 menyediakan{' '}
                <Link href="/kiosk-mega888">kiosk Mega888</Link> lengkap dengan scanner AI untuk
                analisis RTP setiap slot.
              </p>
            </div>
            <div className="info-pillar">
              <h3>918Kiss</h3>
              <p>
                Platform slot klasik yang dipercayai jutaan pemain. Dapatkan akses ke{' '}
                <Link href="/kiosk-918kiss">kiosk 918Kiss</Link> dan nikmati komisyen tertinggi di
                pasaran.
              </p>
            </div>
            <div className="info-pillar">
              <h3>20+ Provider Lain</h3>
              <p>
                JILI, Pragmatic Play, Hacksaw, Habanero, Playtech, Spade Gaming, dan banyak lagi.
                Lihat semua provider di halaman <Link href="/cm8-play">CM8 Play</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Cara Mula */}
      <section className="info-section info-section-alt">
        <div className="info-section-inner">
          <div className="section-tag">Panduan</div>
          <h2 className="info-section-title">🚀 Cara Bermula Dengan CM8</h2>
          <div className="info-how-to">
            <div className="how-to-step">
              <div className="how-to-num">1</div>
              <div className="how-to-content">
                <h4>Daftar Sebagai Agent</h4>
                <p>
                  Pendaftaran adalah <strong>100% percuma</strong>. Tiada modal diperlukan. Isi
                  borang di halaman <Link href="/register">pendaftaran</Link> atau hubungi admin
                  melalui WhatsApp.
                </p>
              </div>
            </div>
            <div className="how-to-step">
              <div className="how-to-num">2</div>
              <div className="how-to-content">
                <h4>Terima Akses Dashboard</h4>
                <p>
                  Sebaik sahaja pendaftaran disahkan, anda akan menerima akses ke dashboard agent
                  CM8. Di sini anda boleh pantau jualan, komisyen, dan downline anda.
                </p>
              </div>
            </div>
            <div className="how-to-step">
              <div className="how-to-num">3</div>
              <div className="how-to-content">
                <h4>Mula Jana Pendapatan</h4>
                <p>
                  Gunakan bahan pemasaran yang disediakan, kongsi link referral anda, dan mula
                  kumpul pemain. Komisyen dikira secara automatik dan dibayar setiap minggu.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="info-section">
        <div className="info-section-inner">
          <div className="section-tag">Soalan Lazim</div>
          <h2 className="info-section-title">❓ Soalan Lazim Tentang CM8</h2>
          <div className="info-faq-list">
            {cm8Faqs.map((f, i) => (
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

      {/* Related Links */}
      <section className="info-section info-section-alt">
        <div className="info-section-inner">
          <div className="section-tag">Artikel Berkaitan</div>
          <h2 className="info-section-title">📚 Baca Lagi</h2>
          <div className="info-pillars">
            <div className="info-pillar">
              <h3>
                <Link href="/buat-duit-online">Buat Duit Online</Link>
              </h3>
              <p>Panduan lengkap cara buat duit online di Malaysia tanpa modal besar.</p>
            </div>
            <div className="info-pillar">
              <h3>
                <Link href="/agent-judi">Agent Judi Online</Link>
              </h3>
              <p>Ketahui apa itu agent judi dan bagaimana menjadi agent yang berjaya.</p>
            </div>
            <div className="info-pillar">
              <h3>
                <Link href="/hack-slot-malaysia">Hack Slot Malaysia</Link>
              </h3>
              <p>Ketahui teknologi AI scanner slot dan cara ia membantu pemain.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Sedia Untuk Mula Dengan CM8?</h2>
          <p className="cta-subtitle">
            Daftar percuma dan mula jana pendapatan sebagai agent CM8 hari ini.
          </p>
          <a
            href="https://masuk10.com/WhatsappVVIP"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-white btn-lg"
          >
            Daftar Agent CM8 Sekarang →
          </a>
        </div>
      </section>
    </>
  )
}
