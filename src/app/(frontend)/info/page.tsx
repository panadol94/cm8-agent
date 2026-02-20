export const revalidate = 60

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'

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
export default async function InfoPage() {
  const payload = await getPayload({ config })
  const ss = await payload.findGlobal({ slug: 'site-settings' })

  const ssAny = ss as unknown as Record<string, string>
  const telegramGroupLink = ssAny?.telegramGroupLink || 'https://t.me/+7qOP1Y8RQcthYjll'
  const whatsappGroupLink = ssAny?.whatsappGroupLink || 'https://masuk10.com/WasapGrupVVIP'
  const adminWhatsappLink = ssAny?.adminWhatsappLink || 'https://masuk10.com/Wasapvvipcs'

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
              <div className="info-pillar-icon">
                {/* AI Scanner Icon */}
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient
                      id="scanGrad"
                      x1="0"
                      y1="0"
                      x2="48"
                      y2="48"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%" stopColor="#ff6b4a" />
                      <stop offset="100%" stopColor="#e63520" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="20"
                    cy="20"
                    r="12"
                    stroke="url(#scanGrad)"
                    strokeWidth="3"
                    fill="none"
                  />
                  <line
                    x1="29"
                    y1="29"
                    x2="42"
                    y2="42"
                    stroke="url(#scanGrad)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <line
                    x1="14"
                    y1="20"
                    x2="26"
                    y2="20"
                    stroke="url(#scanGrad)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="20"
                    y1="14"
                    x2="20"
                    y2="26"
                    stroke="url(#scanGrad)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
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
              <div className="info-pillar-icon">
                {/* Crown / Agent Icon */}
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient
                      id="crownGrad"
                      x1="0"
                      y1="0"
                      x2="48"
                      y2="48"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%" stopColor="#ffaa33" />
                      <stop offset="100%" stopColor="#ff6b4a" />
                    </linearGradient>
                  </defs>
                  <polyline
                    points="6,34 12,16 24,28 36,16 42,34"
                    stroke="url(#crownGrad)"
                    strokeWidth="3"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <rect x="6" y="34" width="36" height="5" rx="2.5" fill="url(#crownGrad)" />
                  <circle cx="6" cy="16" r="3" fill="url(#crownGrad)" />
                  <circle cx="24" cy="10" r="3" fill="url(#crownGrad)" />
                  <circle cx="42" cy="16" r="3" fill="url(#crownGrad)" />
                </svg>
              </div>
              <h3>Program Agent</h3>
              <p>
                Jana komisyen sehingga 90% dengan menjadi agent CM8. Tiada modal, tiada risiko —
                hanya peluang pendapatan tanpa had.
              </p>
              <a
                href={adminWhatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm"
              >
                Daftar Agent →
              </a>
            </div>
            <div className="info-pillar">
              <div className="info-pillar-icon">
                {/* Community / Chat Icon */}
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient
                      id="chatGrad"
                      x1="0"
                      y1="0"
                      x2="48"
                      y2="48"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%" stopColor="#ff8c42" />
                      <stop offset="100%" stopColor="#e63520" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M8 10 Q8 6 12 6 H36 Q40 6 40 10 V28 Q40 32 36 32 H28 L20 42 L20 32 H12 Q8 32 8 28 Z"
                    stroke="url(#chatGrad)"
                    strokeWidth="3"
                    fill="none"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="16"
                    y1="18"
                    x2="32"
                    y2="18"
                    stroke="url(#chatGrad)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="16"
                    y1="24"
                    x2="26"
                    y2="24"
                    stroke="url(#chatGrad)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3>Komuniti Agent</h3>
              <p>
                Sertai ribuan agent aktif dalam komuniti Telegram dan WhatsApp kami. Kongsi tips,
                strategi, dan sokongan bersama.
              </p>
              <a
                href={telegramGroupLink}
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
              href={adminWhatsappLink}
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
              href={telegramGroupLink}
              target="_blank"
              rel="noopener noreferrer"
              className="community-card"
            >
              <div className="community-icon">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient
                      id="tgBg"
                      x1="0"
                      y1="0"
                      x2="48"
                      y2="48"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%" stopColor="#1a1a2e" />
                      <stop offset="100%" stopColor="#16213e" />
                    </linearGradient>
                    <linearGradient
                      id="tgAccent"
                      x1="10"
                      y1="14"
                      x2="34"
                      y2="36"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%" stopColor="#ffaa33" />
                      <stop offset="100%" stopColor="#ff6b4a" />
                    </linearGradient>
                  </defs>
                  <circle cx="24" cy="24" r="22" fill="url(#tgBg)" />
                  <circle
                    cx="24"
                    cy="24"
                    r="22"
                    stroke="url(#tgAccent)"
                    strokeWidth="1"
                    opacity="0.4"
                  />
                  <path d="M34 14L10 23L18 26L22 36L27 29L34 14Z" fill="url(#tgAccent)" />
                  <line
                    x1="18"
                    y1="26"
                    x2="27"
                    y2="29"
                    stroke="url(#tgAccent)"
                    strokeWidth="1.5"
                    opacity="0.6"
                  />
                </svg>
              </div>
              <h3>Telegram Group</h3>
              <p>Update harian, tips scanner, dan perbincangan agent.</p>
              <span className="community-members">
                <span className="pulse-dot" /> 1,200+ ahli aktif
              </span>
              <span className="community-cta">Join Telegram →</span>
            </a>
            <a
              href={whatsappGroupLink}
              target="_blank"
              rel="noopener noreferrer"
              className="community-card"
            >
              <div className="community-icon">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient
                      id="waBg"
                      x1="0"
                      y1="0"
                      x2="48"
                      y2="48"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%" stopColor="#1a1a2e" />
                      <stop offset="100%" stopColor="#16213e" />
                    </linearGradient>
                    <linearGradient
                      id="waAccent"
                      x1="10"
                      y1="12"
                      x2="36"
                      y2="36"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%" stopColor="#ffaa33" />
                      <stop offset="100%" stopColor="#ff6b4a" />
                    </linearGradient>
                  </defs>
                  <circle cx="24" cy="24" r="22" fill="url(#waBg)" />
                  <circle
                    cx="24"
                    cy="24"
                    r="22"
                    stroke="url(#waAccent)"
                    strokeWidth="1"
                    opacity="0.4"
                  />
                  <path
                    d="M24 12C17.4 12 12 17.4 12 24C12 26.4 12.7 28.6 13.9 30.5L12 36L17.7 34.1C19.5 35.2 21.7 35.9 24 35.9C30.6 35.9 36 30.5 36 23.9C36 17.4 30.6 12 24 12Z"
                    stroke="url(#waAccent)"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M20 19C20 19 19 19 19 20C19 21 20 24 23 27C26 30 29 31 30 31C31 31 31 30 31 30L31 28C31 28 30 27.5 29 27C28 26.5 27.5 27 27 27.5C26.5 28 26 28 25 27C24 26 22 24 21.5 23C21 22 21.5 21.5 22 21C22.5 20.5 23 20 22.5 19C22 18 20 19 20 19Z"
                    fill="url(#waAccent)"
                  />
                </svg>
              </div>
              <h3>WhatsApp Group</h3>
              <p>Sokongan cepat, networking, dan peluang baru.</p>
              <span className="community-members">
                <span className="pulse-dot" /> 800+ ahli aktif
              </span>
              <span className="community-cta">Join WhatsApp →</span>
            </a>
            <a
              href={adminWhatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="community-card"
            >
              <div className="community-icon">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient
                      id="admBg"
                      x1="0"
                      y1="0"
                      x2="48"
                      y2="48"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%" stopColor="#1a1a2e" />
                      <stop offset="100%" stopColor="#16213e" />
                    </linearGradient>
                    <linearGradient
                      id="admAccent"
                      x1="10"
                      y1="10"
                      x2="38"
                      y2="38"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%" stopColor="#ffaa33" />
                      <stop offset="100%" stopColor="#ff6b4a" />
                    </linearGradient>
                  </defs>
                  <circle cx="24" cy="24" r="22" fill="url(#admBg)" />
                  <circle
                    cx="24"
                    cy="24"
                    r="22"
                    stroke="url(#admAccent)"
                    strokeWidth="1"
                    opacity="0.4"
                  />
                  <path
                    d="M15 22V20C15 15 19 11 24 11C29 11 33 15 33 20V22"
                    stroke="url(#admAccent)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <rect
                    x="12"
                    y="21"
                    width="5"
                    height="8"
                    rx="2.5"
                    stroke="url(#admAccent)"
                    strokeWidth="2"
                    fill="none"
                  />
                  <rect
                    x="31"
                    y="21"
                    width="5"
                    height="8"
                    rx="2.5"
                    stroke="url(#admAccent)"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M33 29V31C33 33 31 35 29 35H26"
                    stroke="url(#admAccent)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <circle cx="25" cy="35" r="2" fill="url(#admAccent)" />
                </svg>
              </div>
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
              href={adminWhatsappLink}
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
