export const revalidate = 60

import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CM8 Play — Semua Game Slot & Provider di CM8 Malaysia 2026',
  description:
    'Senarai lengkap semua provider dan game slot di CM8. Mega888, 918Kiss, JILI, Pragmatic Play, Hacksaw dan 20+ provider lain. Daftar dan main sekarang.',
  keywords: [
    'CM8 play',
    'CM8 game',
    'CM8 slot',
    'game slot CM8',
    'main slot CM8',
    'provider CM8',
    'CM8 Mega888',
    'CM8 918Kiss',
    'CM8 JILI',
    'CM8 Pragmatic Play',
    'slot online Malaysia',
  ],
  openGraph: {
    title: 'CM8 Play — Semua Game Slot & Provider',
    description: 'Senarai lengkap provider dan game slot di CM8.',
    url: 'https://cm8vvip.com/cm8-play',
    siteName: 'CM8 VVIP',
    type: 'website',
  },
}

const providers = [
  {
    name: 'Mega888',
    desc: 'Platform slot #1 Malaysia dengan 200+ permainan. Grafik moden dan koleksi terlengkap.',
    link: '/kiosk-mega888',
  },
  {
    name: '918Kiss',
    desc: 'Platform klasik dipercayai jutaan pemain sejak 2010. Slot nostalgik yang terbukti popular.',
    link: '/kiosk-918kiss',
  },
  {
    name: 'JILI',
    desc: 'Permainan slot moden dengan grafik berkualiti tinggi dan RTP kompetitif.',
  },
  {
    name: 'Pragmatic Play',
    desc: 'Provider global #1 dengan koleksi slot terbesar termasuk Sweet Bonanza dan Gates of Olympus.',
  },
  {
    name: 'Hacksaw Gaming',
    desc: 'Slot inovatif dengan mekanik unik dan potensi kemenangan besar.',
  },
  { name: 'Habanero', desc: 'Slot bertema Asia dengan RTP tinggi dan volatiliti sederhana.' },
  {
    name: 'Playtech',
    desc: 'Provider veteran dengan permainan pelbagai termasuk slot dan live casino.',
  },
  {
    name: 'Spade Gaming',
    desc: 'Slot popular di Asia Tenggara dengan tema tempatan yang menarik.',
  },
  {
    name: 'NoLimit City',
    desc: 'Slot high-volatility untuk pemain berani dengan potensi kemenangan besar.',
  },
  { name: 'BNG', desc: 'Permainan slot moden berkualiti HD dengan animasi lancar.' },
  { name: 'BetSoft', desc: 'Slot cinema-quality 3D yang mengagumkan secara visual.' },
  { name: 'Relax Gaming', desc: 'Provider dengan Dream Drop Jackpot dan koleksi slot premium.' },
]

const faqs = [
  {
    q: 'Berapa banyak game yang ada di CM8?',
    a: 'CM8 menyediakan lebih daripada 1,000 permainan dari 20+ provider termasuk Mega888, 918Kiss, JILI, Pragmatic Play, Hacksaw Gaming, dan banyak lagi.',
  },
  {
    q: 'Bolehkah main semua game tanpa akaun berasingan?',
    a: 'Ya! Dengan satu akaun CM8, anda boleh akses semua provider dan permainan. Tiada perlu daftar berasingan untuk setiap platform.',
  },
  {
    q: 'Platform mana yang paling popular?',
    a: 'Mega888 dan 918Kiss adalah yang paling popular di Malaysia. JILI dan Pragmatic Play juga semakin popular terutamanya Sweet Bonanza dan Gates of Olympus.',
  },
  {
    q: 'Ada scanner untuk semua provider?',
    a: 'Ya, AI Scanner CM8 menyokong semua provider utama. Scan peratusan RTP setiap slot secara real-time untuk memilih slot terpanas.',
  },
  {
    q: 'Slot mana yang mempunyai RTP tertinggi?',
    a: 'RTP slot berubah secara dinamik. Gunakan AI Scanner untuk kenal pasti slot dengan RTP tertinggi pada masa itu. Secara amnya, slot dari Pragmatic Play dan JILI sering mempunyai RTP tinggi.',
  },
  {
    q: 'Bolehkah main dari telefon?',
    a: 'Ya! Semua provider di CM8 dioptimumkan untuk telefon bimbit. Anda boleh bermain dari Android atau iPhone tanpa sebarang masalah.',
  },
  {
    q: 'Adakah kredit boleh digunakan untuk semua provider?',
    a: 'Ya, kredit CM8 anda boleh digunakan untuk bermain di mana-mana provider. Satu baki kredit, akses ke 1,000+ permainan.',
  },
  {
    q: 'Berapa minimum deposit untuk bermain?',
    a: 'Deposit minimum di CM8 adalah serendah RM10. Hubungi agent CM8 anda untuk membuat deposit dengan pantas dan selamat.',
  },
  {
    q: 'Adakah CM8 Play selamat?',
    a: 'Ya, CM8 menggunakan enkripsi SSL dan sistem keselamatan yang kukuh. Semua provider adalah sah dan dipercayai. Privasi dan keselamatan anda terjamin.',
  },
  {
    q: 'Bagaimana cara jadi agent CM8 Play?',
    a: 'Daftar percuma sebagai agent CM8 dan anda boleh menawarkan semua provider ini kepada pemain anda. Jana komisyen sehingga 90% tanpa modal.',
  },
]

export default function CM8PlayPage() {
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
                name: 'CM8 Play',
                item: 'https://cm8vvip.com/cm8-play',
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
            headline: 'CM8 Play — Semua Game Slot & Provider di CM8',
            author: { '@type': 'Organization', name: 'CM8 VVIP' },
            publisher: { '@type': 'Organization', name: 'CM8 VVIP' },
            datePublished: '2026-01-15',
            dateModified: '2026-02-20',
          }),
        }}
      />

      <div className="page-hero">
        <h1 className="page-hero-title">CM8 Play — Semua Game & Provider</h1>
        <p className="page-hero-subtitle">
          Akses 1,000+ permainan slot dari 20+ provider terkemuka. Satu akaun, semua game. Main dan
          menang dengan bantuan AI Scanner.
        </p>
      </div>

      <section className="info-section">
        <div className="info-section-inner">
          <div className="section-tag">Platform</div>
          <h2 className="info-section-title">🎰 Apa Itu CM8 Play?</h2>
          <p className="info-section-desc">
            <strong>CM8 Play</strong> adalah ekosistem gaming yang menyediakan akses kepada lebih
            daripada <strong>1,000 permainan slot</strong> dari 20+ provider gaming terkemuka di
            dunia. Dengan satu akaun <Link href="/cm8">CM8</Link>, anda boleh bermain semua
            permainan tanpa perlu mendaftar di platform berasingan.
          </p>
          <p className="info-section-desc">
            Setiap provider di CM8 Play dilengkapi dengan{' '}
            <Link href="/hack-slot-malaysia">AI Scanner</Link> yang menganalisis peratusan RTP
            secara real-time. Ini memberikan anda kelebihan untuk memilih slot yang
            &apos;panas&apos; pada bila-bila masa.
          </p>
          <p className="info-section-desc">
            Sama ada anda seorang pemain kasual atau serius, CM8 Play mempunyai sesuatu untuk semua
            orang. Dari slot klasik 918Kiss hingga slot moden Pragmatic Play, semuanya boleh diakses
            dalam satu platform yang mudah dan selamat.
          </p>
        </div>
      </section>

      <section className="info-section info-section-alt">
        <div className="info-section-inner">
          <div className="section-tag">Provider</div>
          <h2 className="info-section-title">🏆 Provider Game di CM8</h2>
          <p className="info-section-desc">
            Berikut adalah senarai provider gaming yang tersedia di CM8 Play. Setiap provider
            menawarkan pengalaman permainan yang unik.
          </p>
          <div className="info-pillars">
            {providers.map((p) => (
              <div key={p.name} className="info-pillar">
                <h3>{p.link ? <Link href={p.link}>{p.name}</Link> : p.name}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="info-section">
        <div className="info-section-inner">
          <div className="section-tag">Popular</div>
          <h2 className="info-section-title">🔥 Slot Paling Popular di CM8</h2>
          <p className="info-section-desc">
            Ini adalah antara permainan slot paling popular di CM8 Play yang dimainkan oleh ribuan
            pemain setiap hari.
          </p>
          <div className="info-pillars">
            <div className="info-pillar">
              <h3>Sweet Bonanza</h3>
              <p>
                Slot Pragmatic Play paling popular di Asia. Tumble feature dan multiplier besar
                membuatkan ia menjadi kegemaran ramai. Gunakan{' '}
                <Link href="/patch-id">AI Scanner</Link> untuk cek RTP sebelum bermain.
              </p>
            </div>
            <div className="info-pillar">
              <h3>Gates of Olympus</h3>
              <p>
                Slot bertema dewa Yunani dari Pragmatic Play. Multiplier sehingga 500x dan potensi
                kemenangan yang besar membuatnya sangat popular.
              </p>
            </div>
            <div className="info-pillar">
              <h3>Great Blue (918Kiss)</h3>
              <p>
                Slot klasik 918Kiss yang terbukti popular sejak bertahun-tahun. RTP yang stabil dan
                feature bonus yang menarik.
              </p>
            </div>
            <div className="info-pillar">
              <h3>Ocean King (Mega888)</h3>
              <p>
                Fishing game paling popular di <Link href="/kiosk-mega888">Mega888</Link>. Gameplay
                yang menarik dan potensi kemenangan yang konsisten.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="info-section info-section-alt">
        <div className="info-section-inner">
          <div className="section-tag">Panduan</div>
          <h2 className="info-section-title">🚀 Cara Mula Bermain di CM8</h2>
          <div className="info-how-to">
            <div className="how-to-step">
              <div className="how-to-num">1</div>
              <div className="how-to-content">
                <h4>Daftar Akaun CM8</h4>
                <p>
                  Hubungi <Link href="/agent-judi">agent CM8</Link> atau daftar melalui halaman{' '}
                  <Link href="/register">pendaftaran</Link>. Proses mengambil masa kurang 5 minit.
                </p>
              </div>
            </div>
            <div className="how-to-step">
              <div className="how-to-num">2</div>
              <div className="how-to-content">
                <h4>Top Up Kredit</h4>
                <p>
                  Buat deposit melalui agent anda. Deposit minimum serendah RM10. Proses pantas dan
                  selamat.
                </p>
              </div>
            </div>
            <div className="how-to-step">
              <div className="how-to-num">3</div>
              <div className="how-to-content">
                <h4>Scan & Pilih Slot</h4>
                <p>
                  Gunakan <Link href="/patch-id">AI Scanner</Link> untuk kenal pasti slot dengan RTP
                  terbaik dari mana-mana provider.
                </p>
              </div>
            </div>
            <div className="how-to-step">
              <div className="how-to-num">4</div>
              <div className="how-to-content">
                <h4>Main & Menang</h4>
                <p>
                  Pilih slot kegemaran anda dan mula bermain. Withdraw bila-bila masa melalui agent
                  anda — proses pantas dan selamat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="info-section">
        <div className="info-section-inner">
          <div className="section-tag">Agent</div>
          <h2 className="info-section-title">💰 Jadi Agent CM8 Play</h2>
          <p className="info-section-desc">
            Dengan 1,000+ permainan dari 20+ provider, menjadi{' '}
            <Link href="/agent-judi">agent CM8</Link> bermakna anda mempunyai portfolio produk yang
            sangat besar untuk ditawarkan kepada pemain.
          </p>
          <div className="info-pillars">
            <div className="info-pillar">
              <h3>Komisyen 90%</h3>
              <p>
                Jana <Link href="/komisen-tanpa-modal">komisyen sehingga 90%</Link> dari semua
                permainan — Mega888, 918Kiss, JILI, Pragmatic Play, dan semua provider lain.
              </p>
            </div>
            <div className="info-pillar">
              <h3>Daftar Percuma</h3>
              <p>
                Tiada modal diperlukan. <Link href="/buat-duit-online">Mula buat duit online</Link>{' '}
                sebagai agent CM8 hari ini tanpa sebarang kos.
              </p>
            </div>
            <div className="info-pillar">
              <h3>AI Scanner Untuk Pemain</h3>
              <p>
                Berikan kelebihan unik kepada pemain anda dengan AI Scanner. Ini membantu anda
                mengekalkan pemain dan meningkatkan komisyen.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="info-section info-section-alt">
        <div className="info-section-inner">
          <div className="section-tag">Soalan Lazim</div>
          <h2 className="info-section-title">❓ Soalan Lazim — CM8 Play</h2>
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

      <section className="info-section">
        <div className="info-section-inner">
          <div className="section-tag">Artikel Berkaitan</div>
          <h2 className="info-section-title">📚 Baca Lagi</h2>
          <div className="info-pillars">
            <div className="info-pillar">
              <h3>
                <Link href="/kiosk-mega888">Kiosk Mega888</Link>
              </h3>
              <p>Panduan lengkap Mega888 — daftar, download, dan tips menang.</p>
            </div>
            <div className="info-pillar">
              <h3>
                <Link href="/kiosk-918kiss">Kiosk 918Kiss</Link>
              </h3>
              <p>Panduan lengkap 918Kiss — daftar, download, dan tips bermain.</p>
            </div>
            <div className="info-pillar">
              <h3>
                <Link href="/hack-slot-malaysia">Hack Slot Malaysia</Link>
              </h3>
              <p>AI Scanner untuk analisis RTP slot secara real-time.</p>
            </div>
            <div className="info-pillar">
              <h3>
                <Link href="/cm8">Apa Itu CM8?</Link>
              </h3>
              <p>Ketahui segala tentang platform CM8 dan ekosistemnya.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Mula Main di CM8 Sekarang</h2>
          <p className="cta-subtitle">1,000+ game, 20+ provider, AI Scanner percuma.</p>
          <a
            href="https://masuk10.com/Wasapvvipcs"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-white btn-lg"
          >
            Daftar & Main →
          </a>
        </div>
      </section>
    </>
  )
}
