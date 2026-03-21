export const dynamic = 'force-dynamic'

import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: 'https://www.cm8vvip.com/cm8' },
  title: 'CM8 Malaysia — Platform Agent Gaming & Analisis Provider 2026',
  description:
    'CM8 (CashMarket 8) ialah platform rujukan agent gaming online terbesar di Malaysia. Daftar percuma, komisyen sehingga 90%, analisis RTP provider, dan sokongan komuniti 24/7.',
  keywords: [
    'CM8',
    'CM8 Malaysia',
    'CM8 agent',
    'CM8 platform',
    'CM8 VVIP',
    'CM8 login',
    'CM8 register',
    'CM8 daftar',
    'platform agent Malaysia',
    'agent gaming Malaysia',
    'CM8 affiliate',
  ],
  openGraph: {
    title: 'CM8 Malaysia — Platform Agent Gaming & Analisis Provider',
    description:
      'Platform rujukan agent gaming online Malaysia. Komisyen sehingga 90%, analisis RTP provider, daftar percuma.',
    url: 'https://www.cm8vvip.com/cm8',
    siteName: 'CM8 VVIP',
    type: 'website',
  },
}

const cm8Faqs = [
  {
    q: 'Apa itu CM8?',
    a: 'CM8 (CashMarket 8) ialah platform perantara agent gaming online yang telah beroperasi di Malaysia sejak 2020. CM8 menghubungkan agent dengan pelbagai provider gaming dan menyediakan alat pengurusan serta program komisyen yangtelus.',
  },
  {
    q: 'Adakah CM8 platform yang sah?',
    a: 'CM8 beroperasi sebagai platform perantara agent yang berdaftar dan telah melayan ribuan agent aktif sejak 2020. Pembayaran komisyen dibuat secara konsisten setiap minggu terus ke akaun agent.',
  },
  {
    q: 'Bagaimana cara daftar CM8?',
    a: 'Pendaftaran adalah percuma. Anda boleh hubungi admin CM8 melalui WhatsApp atau lengkapkan borang di halaman pendaftaran. Proses normally selesai dalam kurang dari 5 minit.',
  },
  {
    q: 'Berapa komisyen yang ditawarkan CM8?',
    a: 'CM8 menawarkan program komisyen 3 tier: Newbie Agent (60%), Solo Player Agent (80%), dan Team Builder Agent (90%). Bayaran dibuat secara mingguan.',
  },
  {
    q: 'Apakah kelebihan CM8 berbanding platform lain?',
    a: 'CM8 menyediakan komisyen kompetitif, alat pengurusan agent (dashboard), akses kepada 20+ provider gaming, sokongan komuniti, dan latihan untuk agent baharu.',
  },
  {
    q: 'Provider gaming apa yang disokong CM8?',
    a: 'CM8 menyediakan akses kepada Mega888, 918Kiss, JILI, Pragmatic Play, Hacksaw Gaming, Habanero, Playtech, Spade Gaming, dan 20+ provider lain.',
  },
  {
    q: 'Apa itu AI Scanner CM8?',
    a: 'AI Scanner CM8 memberikan analisis data RTP (Return to Player) dari pelbagai provider gaming. Ia membantu agent dan pemain membuat keputusan berdasarkan maklumat yang tersedia.',
  },
  {
    q: 'Bolehkah saya jadi agent CM8 secara part-time?',
    a: 'Ya! Ramai agent CM8 menjalankan urusan ini secara part-time. Anda boleh menetapkan jadual sendiri dan bekerja pada masa yang sesuai.',
  },
  {
    q: 'Berapa pendapatan purata agent CM8?',
    a: 'Pendapatan agent bergantung pada usaha dan saiz rangkaian. Agent baharu biasanya menjana RM500-RM2,000 seminggu, manakala agent berpengalaman dengan rangkaian yang lebih besar boleh menjana RM5,000-RM15,000 seminggu.',
  },
  {
    q: 'Adakah CM8 menyediakan latihan untuk agent baru?',
    a: 'Ya. CM8 menyediakan panduan, tutorial video, bahan pemasaran, dan sokongan mentor. Agent baharu juga boleh belajar dari komuniti agent aktif melalui Telegram.',
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
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.cm8vvip.com' },
              { '@type': 'ListItem', position: 2, name: 'CM8', item: 'https://www.cm8vvip.com/cm8' },
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
            '@type': 'Organization',
            name: 'CM8 VVIP',
            url: 'https://www.cm8vvip.com/cm8',
            description:
              'CM8 (CashMarket 8) — platform perantara agent gaming online di Malaysia. Komisyen sehingga 90%, akses kepada 20+ provider, dan sokongan komuniti agent.',
            foundingDate: '2020',
            areaServed: 'Malaysia',
            sameAs: [
              'https://t.me/cm8vvip',
            ],
          }),
        }}
      />

      <div className="page-hero">
        <h1 className="page-hero-title">CM8 Malaysia — Platform Agent Gaming Online</h1>
        <p className="page-hero-subtitle">
          CM8 (CashMarket 8) ialah platform perantara agent gaming online Malaysia yang dipercayai
          sejak 2020. Komisyen sehingga 90%, akses kepada 20+ provider, dan komuniti agent aktif.
        </p>
      </div>

      <section className="info-section">
        <div className="info-section-inner">
          <div className="section-tag">Pengenalan</div>
          <h2 className="info-section-title">Apa Itu CM8?</h2>
          <p className="info-section-desc">
            <strong>CM8</strong> (CashMarket 8) ialah platform perantara yang menghubungkan agent
            dengan pelbagai provider gaming online. Beroperasi sejak 2020, CM8 telah membina
            rangkaian lebih daripada <strong>1,200 agent aktif</strong> di seluruh Malaysia.
          </p>
          <p className="info-section-desc">
            CM8 menyediakan program komisyen bertingkat sehingga 90%, alat pengurusan agent
            (dashboard), akses kepada <strong>20+ provider gaming</strong> termasuk Mega888 dan
            918Kiss, serta komuniti sokongan aktif melalui{' '}
            <strong>Telegram</strong> dan <strong>WhatsApp</strong>.
          </p>
          <p className="info-section-desc">
            Sama ada anda mencari pendapatan sampingan atau peluang lebih besar, CM8 menawarkan
            infrastruktur dan sokongan untuk membantu agent berjaya. Agent yang konsisten boleh
            menjana antara <strong>RM500 hingga RM15,000 seminggu</strong> bergantung pada
            usaha dan saiz rangkaian.
          </p>
          <p className="info-section-desc">
            Pendaftaran adalah percuma dan mengambil masa kurang 5 minit. Komisyen dibayar
            secara automatik setiap minggu terus ke akaun anda.
          </p>
        </div>
      </section>

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
              <h3>🔍 AI Scanner RTP</h3>
              <p>
                CM8 menyediakan alat analisis data RTP dari pelbagai provider gaming. Scanner
                menyokong Mega888, 918Kiss, dan 20+ provider lain — memberikan maklumat
                kepada agent untuk membuat keputusan yang lebih baik.
              </p>
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
            <div className="info-pillar">
              <h3>📱 Dashboard Canggih</h3>
              <p>
                Dashboard agent CM8 memberikan data real-time tentang pemain, komisyen, dan prestasi
                anda. Pantau segala-galanya dari smartphone atau komputer anda.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="info-section">
        <div className="info-section-inner">
          <div className="section-tag">Alat Agent</div>
          <h2 className="info-section-title">🤖 Alat Pengurusan Agent CM8</h2>
          <p className="info-section-desc">
            CM8 menyediakan pelbagai alat untuk membantu agent mengurus operasi dengan lebih cekap.
            Alat-alat ini termasuk analisis data provider dan dashboard pengurusan.
          </p>
          <div className="info-pillars">
            <div className="info-pillar">
              <h3>AI Scanner RTP</h3>
              <p>
                Analisis data RTP provider gaming dari
                20+ provider. Maklumat ini membantu agent membuat keputusan yang
                lebih baik berdasarkan data yang tersedia.
              </p>
            </div>
            <div className="info-pillar">
              <h3>Dashboard Real-Time</h3>
              <p>
                Pantau jualan, komisyen, dan prestasi anda secara langsung. Data dikemas kini setiap
                saat — tiada kelewatan atau ketidaktepatan.
              </p>
            </div>
            <div className="info-pillar">
              <h3>Sistem Downline Automatik</h3>
              <p>
                Override commission dikira secara automatik. Apabila downline anda menjana
                pendapatan, anda turut menerima komisyen tanpa perlu buat apa-apa.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="info-section info-section-alt">
        <div className="info-section-inner">
          <div className="section-tag">Platform</div>
          <h2 className="info-section-title">🎰 Platform Game CM8</h2>
          <p className="info-section-desc">
            CM8 menyokong pelbagai platform gaming terkemuka di Malaysia. Sebagai agent CM8, anda
            boleh menawarkan permainan dari semua platform ini kepada pemain anda.
          </p>
          <div className="info-pillars">
            <div className="info-pillar">
              <h3>Mega888</h3>
              <p>
                Platform slot paling popular di Malaysia. CM8 menyediakan{' '}
                <Link href="/kiosk-mega888">kiosk Mega888</Link> lengkap dengan scanner AI untuk
                analisis RTP setiap slot. Ratusan permainan tersedia.
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
                JILI, Pragmatic Play, Hacksaw, Habanero, Playtech, Spade Gaming, BNG, BetSoft,
                NoLimit City, Relax Gaming, dan banyak lagi. Lihat semua provider di halaman{' '}
                <Link href="/cm8-play">CM8 Play</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="info-section">
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
                  melalui WhatsApp. Proses mengambil masa kurang 5 minit.
                </p>
              </div>
            </div>
            <div className="how-to-step">
              <div className="how-to-num">2</div>
              <div className="how-to-content">
                <h4>Terima Akses Dashboard</h4>
                <p>
                  Sebaik sahaja pendaftaran disahkan, anda akan menerima akses ke dashboard agent
                  CM8. Di sini anda boleh pantau jualan, komisyen, dan downline anda secara
                  real-time.
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

      <section className="info-section info-section-alt">
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

      <section className="info-section">
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
                <Link href="/cm8-play">Platform Gaming CM8</Link>
              </h3>
              <p>Ketahui pelbagai provider gaming dan cara akses kiosk CM8.</p>
            </div>
            <div className="info-pillar">
              <h3>
                <Link href="/komisen-tanpa-modal">Komisen Tanpa Modal</Link>
              </h3>
              <p>Jana komisyen sehingga 90% tanpa sebarang modal permulaan.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Sedia Untuk Mula Dengan CM8?</h2>
          <p className="cta-subtitle">
            Daftar percuma dan mula jana pendapatan sebagai agent CM8 hari ini.
          </p>
          <a
            href="https://masuk10.com/Wasapvvipcs"
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
