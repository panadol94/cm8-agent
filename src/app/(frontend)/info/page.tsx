import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Info CM8 VVIP — Scanner Slot AI, Program Agent & Komuniti',
  description:
    'Ketahui tentang CM8 VVIP: Scanner slot AI untuk analisis RTP Mega888, program agent komisyen sehingga 90%, dan komuniti agent terbesar di Malaysia. Panduan lengkap untuk bermula.',
  keywords: [
    'CM8 agent',
    'scanner slot Mega888',
    'RTP slot Malaysia',
    'agent CM8 komisyen',
    'cara jadi agent CM8',
    'CM8 VVIP',
    'scanner AI slot',
    'komuniti agent Malaysia',
    'patch ID CM8',
    'Mega888 scanner',
    '918Kiss scanner',
    'slot percentage scan',
  ],
  openGraph: {
    title: 'Info CM8 VVIP — Scanner Slot AI, Program Agent & Komuniti',
    description:
      'Scanner slot AI, program agent komisyen tinggi, dan komuniti terbesar. Semua yang anda perlu tahu tentang CM8 VVIP.',
    url: 'https://cm8vvip.com/info',
    siteName: 'CM8 VVIP',
    type: 'website',
  },
}

/* ============================================================
   FAQ DATA (longer for SEO + rich snippets)
   ============================================================ */
const infoFaqs = [
  {
    q: 'Apa itu CM8 VVIP?',
    a: 'CM8 VVIP adalah platform agent dan scanner slot terkemuka di Malaysia. Kami menyediakan teknologi AI Scanner untuk analisis peratusan slot, program komisyen agent sehingga 90%, serta komuniti sokongan yang aktif.',
  },
  {
    q: 'Bagaimana AI Scanner slot berfungsi?',
    a: 'AI Scanner kami menganalisis data real-time daripada platform CM8 seperti Mega888 dan 918Kiss untuk mengenal pasti slot yang mempunyai peratusan RTP (Return to Player) tinggi. Anda hanya perlu masukkan ID CM8 anda di halaman Patch ID.',
  },
  {
    q: 'Berapa komisyen yang boleh saya dapat sebagai agent?',
    a: 'Komisyen bermula dari 60% untuk Newbie Agent, 80% untuk Solo Player Agent, dan sehingga 90% untuk Team Builder Agent. Komisyen dibayar secara mingguan terus ke akaun bank anda tanpa had minimum.',
  },
  {
    q: 'Adakah saya perlu modal untuk menjadi agent?',
    a: 'Tidak perlu sebarang modal. Pendaftaran adalah percuma. Anda akan menerima bahan pemasaran, akses dashboard, dan sokongan penuh dari pasukan kami tanpa sebarang bayaran.',
  },
  {
    q: 'Bagaimana cara menggunakan Patch ID?',
    a: 'Pergi ke halaman Patch ID, masukkan nombor ID CM8 anda, dan klik Scan. Sistem kami akan menganalisis akaun anda dan memberikan senarai slot dengan peratusan menang tertinggi dalam masa beberapa saat.',
  },
  {
    q: 'Apakah platform slot yang disokong oleh scanner?',
    a: 'Scanner kami menyokong pelbagai platform termasuk Mega888, 918Kiss, Pussy888, XE88, Joker123, dan Live22. Semua analisis dilakukan secara real-time.',
  },
  {
    q: 'Bagaimana cara menyertai komuniti CM8?',
    a: 'Anda boleh menyertai komuniti kami melalui Telegram Group atau WhatsApp Group. Link boleh didapati di bahagian Komuniti atau melalui butang Chat Group di navigasi bawah.',
  },
  {
    q: 'Adakah scanner ini selamat digunakan?',
    a: 'Ya, scanner kami 100% selamat. Kami hanya membaca data peratusan, tidak mengubah sebarang data akaun anda. Privasi dan keselamatan pengguna adalah keutamaan kami.',
  },
]

const scannerSteps = [
  {
    step: 'Buka halaman Patch ID',
    desc: 'Klik ikon Patch ID di navigasi bawah atau pergi ke cm8vvip.com/patch-id',
  },
  {
    step: 'Masukkan ID CM8 anda',
    desc: 'Taipkan nombor ID CM8 anda dalam kotak carian yang disediakan',
  },
  {
    step: 'Klik butang Scan',
    desc: 'Tekan butang Scan dan tunggu beberapa saat untuk analisis dilakukan',
  },
  {
    step: 'Lihat keputusan',
    desc: 'Semak senarai slot dengan peratusan RTP tertinggi dan buat pilihan terbaik',
  },
]

/* ============================================================
   PAGE
   ============================================================ */
export default function InfoPage() {
  return (
    <>
      {/* ── Structured Data: BreadcrumbList ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://cm8vvip.com' },
              { '@type': 'ListItem', position: 2, name: 'Info', item: 'https://cm8vvip.com/info' },
            ],
          }),
        }}
      />

      {/* ── Structured Data: Organization ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'CM8 VVIP',
            url: 'https://cm8vvip.com',
            description:
              'Platform agent dan scanner slot AI #1 di Malaysia. Komisyen sehingga 90%, scanner RTP slot real-time, dan komuniti agent terbesar.',
            sameAs: ['https://t.me/cm8vvip'],
          }),
        }}
      />

      {/* ── Structured Data: HowTo (Scanner) ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'Cara Guna AI Scanner Slot CM8',
            description:
              'Panduan langkah demi langkah untuk menggunakan AI Scanner slot di platform CM8 VVIP.',
            step: scannerSteps.map((s, i) => ({
              '@type': 'HowToStep',
              position: i + 1,
              name: s.step,
              text: s.desc,
            })),
          }),
        }}
      />

      {/* ── Structured Data: FAQPage ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: infoFaqs.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }),
        }}
      />

      {/* ===== HERO ===== */}
      <div className="info-hero">
        <div className="info-hero-inner">
          <div className="section-tag">Pusat Maklumat</div>
          <h1 className="info-hero-title">
            Semua Tentang{' '}
            <Image
              src="/cm8-logo.png"
              alt="CM8 VVIP Logo"
              width={280}
              height={80}
              className="info-hero-logo"
              priority
              quality={100}
            />
          </h1>
          <p className="info-hero-subtitle">
            Scanner slot AI, program agent komisyen tinggi, dan komuniti terbesar di Malaysia.
            Ketahui bagaimana CM8 VVIP boleh membantu anda jana pendapatan.
          </p>
          <div className="info-hero-stats">
            <div className="info-stat">
              <span className="info-stat-num">500+</span>
              <span className="info-stat-label">Agent Aktif</span>
            </div>
            <div className="info-stat-divider" />
            <div className="info-stat">
              <span className="info-stat-num">6</span>
              <span className="info-stat-label">Platform Game</span>
            </div>
            <div className="info-stat-divider" />
            <div className="info-stat">
              <span className="info-stat-num">24/7</span>
              <span className="info-stat-label">Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== SECTION 1: APA ITU CM8 VVIP ===== */}
      <section className="info-section">
        <div className="info-section-inner">
          <div className="section-tag">Pengenalan</div>
          <h2 className="info-section-title">Apa Itu CM8 VVIP?</h2>
          <p className="info-section-desc">
            CM8 VVIP adalah <strong>platform all-in-one</strong> untuk dunia slot gaming di
            Malaysia. Kami menggabungkan tiga elemen utama yang menjadikan kami platform pilihan #1:
          </p>
          <div className="info-pillars">
            <div className="info-pillar">
              <div className="info-pillar-icon">🔍</div>
              <h3>AI Slot Scanner</h3>
              <p>
                Teknologi canggih yang menganalisis peratusan RTP slot secara real-time. Ketahui
                slot mana yang &apos;panas&apos; sebelum anda bermain.
              </p>
              <Link href="/patch-id" className="btn btn-outline btn-sm">
                Cuba Scanner →
              </Link>
            </div>
            <div className="info-pillar">
              <div className="info-pillar-icon">👑</div>
              <h3>Program Agent</h3>
              <p>
                Jana komisyen sehingga 90% dengan menjadi agent CM8. Tiada modal, tiada risiko —
                hanya peluang pendapatan tanpa had.
              </p>
              <a
                href="https://masuk10.com/WhatsappVVIP"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm"
              >
                Daftar Agent →
              </a>
            </div>
            <div className="info-pillar">
              <div className="info-pillar-icon">💬</div>
              <h3>Komuniti Agent</h3>
              <p>
                Sertai ribuan agent aktif dalam komuniti Telegram dan WhatsApp kami. Kongsi tips,
                strategi, dan sokongan bersama.
              </p>
              <a
                href="https://masuk10.com/TeleGrupVVIP"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm"
              >
                Join Komuniti →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 2: AI SCANNER ===== */}
      <section className="info-section info-section-alt">
        <div className="info-section-inner">
          <div className="section-tag">Teknologi</div>
          <h2 className="info-section-title">🔍 AI Slot Scanner</h2>
          <p className="info-section-desc">
            Scanner slot AI kami menganalisis data <strong>real-time</strong> daripada platform
            seperti <strong>Mega888</strong>, <strong>918Kiss</strong>, <strong>Pussy888</strong>,
            dan lain-lain untuk mengenal pasti slot dengan peratusan RTP (Return to Player)
            tertinggi.
          </p>

          <div className="info-scanner-features">
            <div className="scanner-feature">
              <span className="scanner-feature-icon">⚡</span>
              <div>
                <h4>Analisis Real-Time</h4>
                <p>Data dikemas kini secara langsung untuk ketepatan maksimum.</p>
              </div>
            </div>
            <div className="scanner-feature">
              <span className="scanner-feature-icon">🎯</span>
              <div>
                <h4>Multi-Platform</h4>
                <p>Menyokong Mega888, 918Kiss, Pussy888, XE88, Joker123, Live22.</p>
              </div>
            </div>
            <div className="scanner-feature">
              <span className="scanner-feature-icon">🔒</span>
              <div>
                <h4>100% Selamat</h4>
                <p>Hanya membaca data peratusan, tidak mengubah akaun anda.</p>
              </div>
            </div>
            <div className="scanner-feature">
              <span className="scanner-feature-icon">📊</span>
              <div>
                <h4>Laporan Terperinci</h4>
                <p>Senarai slot tersusun mengikut peratusan menang tertinggi.</p>
              </div>
            </div>
          </div>

          <h3 className="info-subsection-title">Cara Guna Scanner</h3>
          <div className="info-how-to">
            {scannerSteps.map((s, i) => (
              <div key={i} className="how-to-step">
                <div className="how-to-num">{i + 1}</div>
                <div className="how-to-content">
                  <h4>{s.step}</h4>
                  <p>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link href="/patch-id" className="btn btn-gradient btn-lg">
              🔍 Cuba Scanner Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* ===== SECTION 3: VVIP PARTNERSHIP STRUCTURE ===== */}
      <section className="info-section">
        <div className="info-section-inner">
          <div className="section-tag">Business Model</div>
          <h2 className="info-section-title">💎 The VVIP Partnership Structure</h2>
          <p className="info-section-desc">
            Model perniagaan VVIP direka untuk mereka yang serius membina empayar pendapatan pasif.
            Kami memposisikan anda sebagai <strong>Rakan Niaga Strategik</strong>, bukan sekadar
            agent biasa.
          </p>

          <div className="vvip-structure-steps">
            {/* Step 1 */}
            <div className="vvip-step-card">
              <div className="vvip-step-header">
                <div className="vvip-step-num">01</div>
                <h3 className="vvip-step-title">Secure Exclusive Access</h3>
              </div>
              <p className="vvip-step-desc">
                Platform CM8 VVIP mengekalkan standard kualiti tinggi. Pendaftaran hanya dibuka
                melalui <strong>Referral Only</strong>. Hubungi Elite Partner kami untuk mendapatkan
                kod akses rasmi.
              </p>
            </div>

            {/* Step 2 */}
            <div className="vvip-step-card">
              <div className="vvip-step-header">
                <div className="vvip-step-num">02</div>
                <h3 className="vvip-step-title">Profile Establishment</h3>
              </div>
              <p className="vvip-step-desc">
                Lengkapkan pendaftaran profesional anda. Kami memerlukan butiran asas (Username &
                Banking Details) untuk tujuan pengurusan transaksi & pembayaran komisen automatik
                yang selamat.
              </p>
            </div>

            {/* Step 3 */}
            <div className="vvip-step-card highlight-step">
              <div className="vvip-step-header">
                <div className="vvip-step-num">03</div>
                <h3 className="vvip-step-title">Strategic Capital Injection</h3>
              </div>
              <p className="vvip-step-desc">
                Berbeza dengan agent biasa, Rakan Niaga VVIP meletakkan modal permulaan strategik.
                Ini membuka akses kepada:
              </p>
              <ul className="vvip-step-list">
                <li>🚀 Max Commission Cap (Tier-1)</li>
                <li>💳 High Credit Limit untuk High Rollers</li>
                <li>🎁 Priority Status & Support Lane 24/7</li>
              </ul>
            </div>

            {/* Step 4 */}
            <div className="vvip-step-card">
              <div className="vvip-step-header">
                <div className="vvip-step-num">04</div>
                <h3 className="vvip-step-title">Full System Handover</h3>
              </div>
              <p className="vvip-step-desc">
                Sebaik sahaja modal disahkan, anda menerima <strong>Authorised Agent Panel</strong>.
                Ini adalah pejabat digital anda—lengkap dengan alatan untuk create ID pemain, pantau
                turnover, dan kawal aliran tunai.
              </p>
            </div>

            {/* Step 5 */}
            <div className="vvip-step-card">
              <div className="vvip-step-header">
                <div className="vvip-step-num">05</div>
                <h3 className="vvip-step-title">Passive Income Realization</h3>
              </div>
              <p className="vvip-step-desc">
                Fokus anda hanyalah pada pengembangan rangkaian. Biarkan sistem kami menguruskan
                teknikal. Lihat bagaimana rolling pemain anda bertukar menjadi{' '}
                <strong>keuntungan bersih</strong> mingguan.
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <a
              href="https://masuk10.com/WhatsappVVIP"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gradient btn-lg"
            >
              🚀 Apply for Partnership
            </a>
          </div>
        </div>
      </section>

      {/* ===== SECTION 4: KOMUNITI ===== */}
      <section className="info-section info-section-dark">
        <div className="info-section-inner">
          <div
            className="section-tag"
            style={{ background: 'rgba(255,255,255,0.1)', color: '#ff8c42' }}
          >
            Komuniti
          </div>
          <h2 className="info-section-title" style={{ color: 'white' }}>
            💬 Sertai Komuniti CM8
          </h2>
          <p className="info-section-desc" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Jangan berjuang sendiri. Sertai ribuan agent aktif dalam komuniti kami untuk kongsi
            tips, strategi, dan dapatkan sokongan terus dari pasukan CM8.
          </p>
          <div className="info-community-grid">
            <a
              href="https://masuk10.com/TeleGrupVVIP"
              target="_blank"
              rel="noopener noreferrer"
              className="community-card"
            >
              <div className="community-icon">✈️</div>
              <h3>Telegram Group</h3>
              <p>Update harian, tips scanner, dan perbincangan agent.</p>
              <span className="community-members">
                <span className="pulse-dot" /> 1,200+ ahli aktif
              </span>
              <span className="community-cta">Join Telegram →</span>
            </a>
            <a
              href="https://masuk10.com/WasapGrupVVIP"
              target="_blank"
              rel="noopener noreferrer"
              className="community-card"
            >
              <div className="community-icon">💬</div>
              <h3>WhatsApp Group</h3>
              <p>Sokongan cepat, networking, dan peluang baru.</p>
              <span className="community-members">
                <span className="pulse-dot" /> 800+ ahli aktif
              </span>
              <span className="community-cta">Join WhatsApp →</span>
            </a>
            <a
              href="https://masuk10.com/WhatsappVVIP"
              target="_blank"
              rel="noopener noreferrer"
              className="community-card"
            >
              <div className="community-icon">👤</div>
              <h3>Hubungi Admin</h3>
              <p>Perlukan bantuan peribadi? Chat terus dengan admin kami.</p>
              <span className="community-members">Respon dalam 5 minit</span>
              <span className="community-cta">Chat Admin →</span>
            </a>
          </div>
        </div>
      </section>

      {/* ===== SECTION 5: FAQ ===== */}
      <section className="info-section">
        <div className="info-section-inner">
          <div className="section-tag">Soalan Lazim</div>
          <h2 className="info-section-title">❓ Soalan Lazim</h2>
          <p className="info-section-desc">
            Jawapan kepada soalan yang paling kerap ditanya tentang CM8 VVIP, scanner slot AI,
            program agent, dan komuniti kami.
          </p>
          <div className="info-faq-list">
            {infoFaqs.map((f, i) => (
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

      {/* ===== SEO CONTENT (sr-only for search engines) ===== */}
      <div className="sr-only" aria-hidden="true">
        <h2>Scanner Slot AI CM8 Malaysia</h2>
        <p>
          CM8 VVIP menyediakan scanner slot AI terbaik di Malaysia untuk platform Mega888, 918Kiss,
          Pussy888, XE88, Joker123, dan Live22. Scan peratusan RTP slot secara real-time untuk
          mengetahui slot mana yang mempunyai peluang menang tertinggi. Teknologi AI kami
          menganalisis ribuan data point untuk memberikan cadangan tepat kepada pengguna.
        </p>
        <h2>Cara Jadi Agent CM8 di Malaysia</h2>
        <p>
          Menjadi agent CM8 adalah mudah dan percuma. Daftar secara online, terima ID agent anda,
          dan mula promote untuk jana komisyen sehingga 90%. Ramai agent kami berjaya menjana
          pendapatan RM4,000 hingga RM10,000 seminggu. Tiada modal diperlukan, tiada risiko, dan
          komisyen dibayar setiap minggu terus ke akaun bank anda.
        </p>
        <h2>Komuniti Agent CM8 Terbesar</h2>
        <p>
          Sertai lebih 2,000 agent aktif dalam komuniti Telegram dan WhatsApp CM8 VVIP. Dapatkan
          tips terkini, strategi pemasaran, dan sokongan langsung dari pasukan admin kami yang
          tersedia 24/7.
        </p>
      </div>

      {/* ===== CTA ===== */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Sedia Untuk Bermula?</h2>
          <p className="cta-subtitle">
            Daftar sebagai agent, guna scanner AI, atau sertai komuniti kami hari ini.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="https://masuk10.com/WhatsappVVIP"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-white btn-lg"
            >
              Daftar Agent →
            </a>
            <Link
              href="/patch-id"
              className="btn btn-outline btn-lg"
              style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)' }}
            >
              Cuba Scanner →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
