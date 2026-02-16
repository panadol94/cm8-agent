import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import BannerCarousel from './BannerCarousel'
import AnimatedStats from './AnimatedStats'
import { PatchIDIcon, TelegramKomunitiIcon, WhatsAppKomunitiIcon, AdminIcon } from './CM8Icons'

export const metadata: Metadata = {
  title: 'CM8 VVIP — Platform Agent #1 Malaysia',
  description:
    'Jadi agent CM8 sekarang. Komisyen tinggi sehingga 60%, sokongan penuh 24/7, dan peluang pendapatan tanpa had.',
}

/* ============================================================
   SECTION DATA
   ============================================================ */

const incomeShowcase = [
  {
    name: 'Ah***d R.',
    role: 'Master Agent',
    income: 'RM4,200',
    period: '/minggu',
    growth: '+32%',
    avatar: '/avatars/agent-1.png',
    bar: 72,
  },
  {
    name: 'Sa***h M.',
    role: 'Agent Aktif',
    income: 'RM1,800',
    period: '/minggu',
    growth: '+18%',
    avatar: '/avatars/agent-2.png',
    bar: 31,
  },
  {
    name: 'Ri***l K.',
    role: 'Agent Baru',
    income: 'RM650',
    period: '/minggu',
    growth: '+45%',
    avatar: '/avatars/agent-3.png',
    bar: 11,
  },
  {
    name: 'Fa***z A.',
    role: 'Senior Agent',
    income: 'RM3,100',
    period: '/minggu',
    growth: '+27%',
    avatar: '/avatars/agent-4.jpg',
    bar: 53,
  },
  {
    name: 'Nu***a L.',
    role: 'Agent Aktif',
    income: 'RM2,400',
    period: '/minggu',
    growth: '+35%',
    avatar: '/avatars/agent-5.jpg',
    bar: 41,
  },
  {
    name: 'Ha***m S.',
    role: 'Master Agent',
    income: 'RM5,800',
    period: '/minggu',
    growth: '+22%',
    avatar: '/avatars/agent-6.jpg',
    bar: 100,
  },
  {
    name: 'Am***a Y.',
    role: 'Agent Baru',
    income: 'RM900',
    period: '/minggu',
    growth: '+52%',
    avatar: '/avatars/agent-7.jpg',
    bar: 16,
  },
  {
    name: 'Za***i T.',
    role: 'Agent Aktif',
    income: 'RM2,100',
    period: '/minggu',
    growth: '+29%',
    avatar: '/avatars/agent-1.png',
    bar: 36,
  },
  {
    name: 'Sy***a N.',
    role: 'Senior Agent',
    income: 'RM3,600',
    period: '/minggu',
    growth: '+24%',
    avatar: '/avatars/agent-8.jpg',
    bar: 62,
  },
  {
    name: 'Mo***d H.',
    role: 'Agent Baru',
    income: 'RM480',
    period: '/minggu',
    growth: '+68%',
    avatar: '/avatars/agent-9.jpg',
    bar: 8,
  },
  {
    name: 'Li***a W.',
    role: 'Master Agent',
    income: 'RM4,900',
    period: '/minggu',
    growth: '+19%',
    avatar: '/avatars/agent-2.png',
    bar: 84,
  },
  {
    name: 'Da***n J.',
    role: 'Agent Aktif',
    income: 'RM1,500',
    period: '/minggu',
    growth: '+41%',
    avatar: '/avatars/agent-10.jpg',
    bar: 26,
  },
  {
    name: 'Is***l B.',
    role: 'Senior Agent',
    income: 'RM3,800',
    period: '/minggu',
    growth: '+31%',
    avatar: '/avatars/agent-11.jpg',
    bar: 66,
  },
  {
    name: 'Ai***n Z.',
    role: 'Agent Baru',
    income: 'RM750',
    period: '/minggu',
    growth: '+57%',
    avatar: '/avatars/agent-3.png',
    bar: 13,
  },
  {
    name: 'Kh***r M.',
    role: 'Agent Aktif',
    income: 'RM2,800',
    period: '/minggu',
    growth: '+33%',
    avatar: '/avatars/agent-12.jpg',
    bar: 48,
  },
  {
    name: 'Ra***a P.',
    role: 'Master Agent',
    income: 'RM5,200',
    period: '/minggu',
    growth: '+26%',
    avatar: '/avatars/agent-13.jpg',
    bar: 90,
  },
  {
    name: 'Fi***i C.',
    role: 'Agent Baru',
    income: 'RM550',
    period: '/minggu',
    growth: '+61%',
    avatar: '/avatars/agent-14.jpg',
    bar: 10,
  },
  {
    name: 'Na***m R.',
    role: 'Agent Aktif',
    income: 'RM1,950',
    period: '/minggu',
    growth: '+38%',
    avatar: '/avatars/agent-1.png',
    bar: 34,
  },
  {
    name: 'Wa***n D.',
    role: 'Senior Agent',
    income: 'RM4,500',
    period: '/minggu',
    growth: '+21%',
    avatar: '/avatars/agent-15.jpg',
    bar: 78,
  },
  {
    name: 'Ti***h G.',
    role: 'Agent Aktif',
    income: 'RM2,600',
    period: '/minggu',
    growth: '+36%',
    avatar: '/avatars/agent-16.jpg',
    bar: 45,
  },
]

const agentSteps = [
  {
    num: '01',
    icon: '💎',
    title: 'VVIP Invitation Only',
    desc: 'Akses terhad melalui Private Invitation Link dari Master Agent sah.',
  },
  {
    num: '02',
    icon: '🛡️',
    title: 'Official Verification',
    desc: 'Pendaftaran profil perniagaan selamat dengan sekuriti gred bank.',
  },
  {
    num: '03',
    icon: '💼',
    title: 'Capital Allocation',
    desc: 'Komitmen modal permulaan untuk akses Tier-1 Commission (Max Yield).',
  },
  {
    num: '04',
    icon: '🎛️',
    title: 'System Authority',
    desc: 'Kuasa penuh Agent Command Center untuk operasi & kawalan kewangan.',
  },
  {
    num: '05',
    icon: '📈',
    title: 'Wealth Generation',
    desc: 'Automasi pendapatan pasif & nikmati ROI mingguan.',
  },
]

const exclusiveBenefits = [
  {
    icon: '⚡',
    title: 'Komisen Instant',
    desc: 'Komisyen dikreditkan secara automatik setiap deposit pemain.',
  },
  {
    icon: '🎯',
    title: 'Tiada Modal',
    desc: 'Bermula tanpa sebarang kos. 100% percuma untuk daftar.',
  },
  {
    icon: '🎓',
    title: 'Training Percuma',
    desc: 'Kursus lengkap cara promote & tingkatkan jualan.',
  },
  {
    icon: '📊',
    title: 'Dashboard Real-Time',
    desc: 'Pantau komisyen, pemain & prestasi secara live.',
  },
  { icon: '🛡️', title: 'Support 24/7', desc: 'Pasukan admin sentiasa standby untuk bantu anda.' },
  {
    icon: '🎁',
    title: 'Bonus Bulanan',
    desc: 'Insentif tambahan untuk agent yang aktif & berprestasi.',
  },
]

const liveFeedItems = [
  { type: 'join', text: 'Fa***z baru daftar sebagai agent', time: '2 minit lepas' },
  { type: 'commission', text: 'Ah***d terima RM680 komisyen', time: '5 minit lepas' },
  { type: 'join', text: 'Nu***l baru daftar sebagai agent', time: '8 minit lepas' },
  { type: 'milestone', text: 'Sa***h naik ke Master Agent!', time: '12 minit lepas' },
  { type: 'commission', text: 'Ri***l terima RM420 komisyen', time: '15 minit lepas' },
  { type: 'join', text: 'Am***n baru daftar sebagai agent', time: '18 minit lepas' },
  { type: 'commission', text: 'Ha***m terima RM1,200 komisyen', time: '22 minit lepas' },
  { type: 'milestone', text: 'Za***i naik ke Agent Aktif!', time: '25 minit lepas' },
  { type: 'join', text: 'Li***a baru daftar sebagai agent', time: '30 minit lepas' },
  { type: 'commission', text: 'Da***d terima RM550 komisyen', time: '33 minit lepas' },
]

const providers = [
  { icon: '🎰', name: 'MEGA888' },
  { icon: '🎲', name: '918KISS' },
  { icon: '🃏', name: 'PUSSY888' },
  { icon: '🎮', name: 'XE88' },
  { icon: '🎯', name: 'JOKER123' },
  { icon: '🎪', name: 'LIVE22' },
]

const promoCards = [
  {
    icon: '💰',
    title: 'Weekly Bonus',
    highlight: false,
    items: ['Auto Calculation', 'Contact Admin', 'Fast Payout', 'No Minimum'],
    cta: 'Claim Now',
    ctaLink: '/register',
  },
  {
    icon: '🔄',
    title: 'Rollover Rewards',
    highlight: true,
    items: ['100,000 → RM98', '300,000 → RM288', '600,000 → RM588', '900,000 → RM388'],
    cta: 'Contact Admin',
    ctaLink: 'https://wa.me/60123456789',
  },
  {
    icon: '🎉',
    title: 'Special Event',
    highlight: false,
    items: ['Weekly Bonus', 'Exclusive Rewards', 'One Player ID Benefits', 'Fast Support'],
    cta: 'View Event',
    ctaLink: '/benefits',
  },
]

const whyItems = [
  'Weekly Bonus',
  'Exclusive Rewards',
  'One Player ID Benefits',
  'Fast Support via Admin',
  'Komisyen Sehingga 60%',
  'Dashboard Real-Time',
]

const commissions = [
  {
    label: 'Agent Baru',
    rate: '30%',
    desc: 'Untuk agent yang baru bermula',
    features: ['Komisyen asas 30%', 'Akses dashboard', 'Sokongan asas', 'Bahan pemasaran'],
  },
  {
    label: 'Agent Aktif',
    rate: '45%',
    desc: 'Untuk agent berpengalaman',
    popular: true,
    features: [
      'Komisyen 45%',
      'Dashboard premium',
      'Sokongan prioriti 24/7',
      'Bahan pemasaran eksklusif',
      'Bonus bulanan',
    ],
  },
  {
    label: 'Master Agent',
    rate: '60%',
    desc: 'Untuk top performer',
    features: [
      'Komisyen tertinggi 60%',
      'Dashboard VIP',
      'Pengurus akaun peribadi',
      'Semua bahan pemasaran',
      'Bonus & insentif khas',
      'Pendapatan downline',
    ],
  },
]

const testimonials = [
  {
    name: 'Ahmad R.',
    role: 'Master Agent',
    text: 'Sejak sertai CM8 sebagai agent, pendapatan saya meningkat 3x ganda. Platform yang sangat stabil.',
    rating: 5,
  },
  {
    name: 'Sarah M.',
    role: 'Agent Aktif',
    text: 'Dalam masa 3 bulan sudah naik ke Agent Aktif. Komisyen memang tinggi dan pembayaran on time.',
    rating: 5,
  },
  {
    name: 'Rizal K.',
    role: 'Agent Aktif',
    text: 'Dashboard sangat mudah digunakan. Boleh pantau semua transaksi secara real-time.',
    rating: 5,
  },
]

const faqs = [
  {
    q: 'Bagaimana cara menjadi agent CM8?',
    a: 'Sangat mudah! Hanya isi borang pendaftaran dan pasukan kami akan menghubungi anda dalam masa 24 jam.',
  },
  {
    q: 'Berapa modal permulaan yang diperlukan?',
    a: 'Tiada modal permulaan diperlukan. Anda hanya perlu mendaftar dan kami sediakan semua alat pemasaran percuma.',
  },
  {
    q: 'Bagaimana komisyen dibayar?',
    a: 'Komisyen dibayar secara mingguan terus ke akaun bank anda. Tiada had minimum.',
  },
  {
    q: 'Adakah saya perlukan pengalaman?',
    a: 'Tidak! Kami menyediakan latihan penuh untuk agent baru.',
  },
  {
    q: 'Bolehkah saya jadi agent sambilan?',
    a: 'Ya, ramai agent kami menjalankan ini sebagai pendapatan sampingan.',
  },
]

/* ============================================================
   PAGE
   ============================================================ */
export default function HomePage() {
  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'CM8 VVIP',
            url: 'https://cm8vvip.com',
            description: 'Platform Agent #1 Malaysia',
          }),
        }}
      />

      {/* ===== HERO BANNER (real promo carousel) ===== */}
      <BannerCarousel />

      {/* ===== WINNER TICKER ===== */}
      <div className="winner-ticker">
        <span className="ticker-icon">📢</span>
        <div className="ticker-viewport">
          <span className="ticker-scroll">
            Tahniah kepada <strong>Ah***ng</strong> kerana memenangi iPhone 17 Pro Max
          </span>
        </div>
      </div>

      {/* ===== PREMIUM AGENT CTA ===== */}
      <div className="agent-cta-card">
        {/* Top: Headline + Commission */}
        <div className="agent-cta-top">
          <div className="agent-cta-headline">
            <span className="agent-cta-badge">👑 VIP AGENT</span>
            <h2 className="agent-cta-title">
              Jana Sehingga <span className="text-gradient">45% Komisen</span>
            </h2>
            <p className="agent-cta-subtitle">
              Setiap deposit pemain, anda untung. Tiada modal, tiada risiko.
            </p>
          </div>
          <div className="agent-cta-commission">
            <span className="commission-number">45%</span>
            <span className="commission-label">Komisen</span>
          </div>
        </div>

        {/* Middle: Benefits */}
        <div className="agent-cta-benefits">
          <div className="agent-benefit-item">
            <span className="benefit-check">⚡</span>
            <span>
              Komisen masuk <strong>instantly</strong>
            </span>
          </div>
          <div className="agent-benefit-item">
            <span className="benefit-check">🔒</span>
            <span>
              Support admin <strong>24/7</strong>
            </span>
          </div>
          <div className="agent-benefit-item">
            <span className="benefit-check">📈</span>
            <span>
              Dashboard tracking <strong>real-time</strong>
            </span>
          </div>
        </div>

        {/* Bottom: Social Proof + CTA */}
        <div className="agent-cta-bottom">
          <AnimatedStats />
          <div className="agent-cta-actions">
            <a
              href="https://masuk10.com/Signupvvip"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gradient btn-lg"
            >
              🚀 Jadi Agent Sekarang
            </a>
            <a
              href="https://masuk10.com/Signupvvip"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
            >
              Daftar Akaun CM8
            </a>
          </div>
        </div>
      </div>

      {/* ===== QUICK ACTIONS (Patch ID / Telegram / WhatsApp / Admin) ===== */}
      <div className="quick-actions">
        <a
          href="https://masuk10.com/Signupvvip"
          target="_blank"
          rel="noopener noreferrer"
          className="quick-action-btn qa-patch"
        >
          <div className="qa-icon-ring">
            <PatchIDIcon />
          </div>
          <div className="qa-text">
            <span className="quick-action-label">Patch ID</span>
            <span className="qa-sub">Daftar Akaun</span>
          </div>
          <span className="qa-arrow">›</span>
        </a>
        <a
          href="https://masuk10.com/TeleGrupVVIP"
          target="_blank"
          rel="noopener noreferrer"
          className="quick-action-btn qa-telegram"
        >
          <div className="qa-icon-ring">
            <TelegramKomunitiIcon />
          </div>
          <div className="qa-text">
            <span className="quick-action-label">Telegram</span>
            <span className="qa-sub">Grup Komuniti</span>
          </div>
          <span className="qa-arrow">›</span>
        </a>
        <a
          href="https://masuk10.com/WasapGrupVVIP"
          target="_blank"
          rel="noopener noreferrer"
          className="quick-action-btn qa-whatsapp"
        >
          <div className="qa-icon-ring">
            <WhatsAppKomunitiIcon />
          </div>
          <div className="qa-text">
            <span className="quick-action-label">WhatsApp</span>
            <span className="qa-sub">Grup Komuniti</span>
          </div>
          <span className="qa-arrow">›</span>
        </a>
        <a
          href="https://masuk10.com/WhatsappVVIP"
          target="_blank"
          rel="noopener noreferrer"
          className="quick-action-btn qa-admin"
        >
          <div className="qa-icon-ring">
            <AdminIcon />
          </div>
          <div className="qa-text">
            <span className="quick-action-label">Admin</span>
            <span className="qa-sub">Support 24/7</span>
          </div>
          <span className="qa-arrow">›</span>
        </a>
      </div>

      {/* ===== 1. INCOME SHOWCASE ===== */}
      <div className="section-title-bar">
        <h2>📊 Pendapatan Agent Sebenar</h2>
      </div>
      <p className="section-subtitle-bar">Contoh pendapatan mingguan agent kami</p>
      <div className="income-marquee-wrapper">
        <div className="income-marquee-track">
          {/* Original set */}
          {incomeShowcase.map((agent, i) => (
            <div key={`a-${i}`} className="income-card">
              <div className="income-card-top">
                <div className="income-avatar-ring">
                  <Image
                    src={agent.avatar}
                    alt={agent.name}
                    width={48}
                    height={48}
                    className="income-avatar-img"
                    unoptimized
                  />
                </div>
                <div className="income-info">
                  <div className="income-name">{agent.name}</div>
                  <div className="income-role">{agent.role}</div>
                </div>
                <div className="income-growth">{agent.growth}</div>
              </div>
              <div className="income-amount">
                <span className="income-value">{agent.income}</span>
                <span className="income-period">{agent.period}</span>
              </div>
              <div className="income-bar">
                <div className="income-bar-fill" style={{ width: `${agent.bar}%` }} />
              </div>
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {incomeShowcase.map((agent, i) => (
            <div key={`b-${i}`} className="income-card" aria-hidden="true">
              <div className="income-card-top">
                <div className="income-avatar-ring">
                  <Image
                    src={agent.avatar}
                    alt=""
                    width={48}
                    height={48}
                    className="income-avatar-img"
                    unoptimized
                  />
                </div>
                <div className="income-info">
                  <div className="income-name">{agent.name}</div>
                  <div className="income-role">{agent.role}</div>
                </div>
                <div className="income-growth">{agent.growth}</div>
              </div>
              <div className="income-amount">
                <span className="income-value">{agent.income}</span>
                <span className="income-period">{agent.period}</span>
              </div>
              <div className="income-bar">
                <div className="income-bar-fill" style={{ width: `${agent.bar}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== 2. STEPS PROCESS ===== */}
      <div className="section-title-bar">
        <h2>🏆 Langkah Jadi Agent</h2>
      </div>
      <p className="section-subtitle-bar">Mudah je, 4 langkah sahaja</p>
      <div className="steps-section">
        {agentSteps.map((step, i) => (
          <div key={i} className="step-item">
            <div className="step-icon-wrapper">
              <div className="step-number">{step.num}</div>
              <div className="step-icon">{step.icon}</div>
            </div>
            <div className="step-content">
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
            </div>
            {i < agentSteps.length - 1 && <div className="step-connector" />}
          </div>
        ))}
      </div>

      {/* ===== 3. BENEFITS SHOWCASE ===== */}
      <div className="section-title-bar">
        <h2>🔥 Kelebihan Eksklusif</h2>
      </div>
      <p className="section-subtitle-bar">Kenapa ramai pilih jadi agent CM8</p>
      <div className="benefits-showcase">
        {exclusiveBenefits.map((b, i) => (
          <div key={i} className="exc-benefit-card" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="exc-benefit-icon">{b.icon}</div>
            <h3 className="exc-benefit-title">{b.title}</h3>
            <p className="exc-benefit-desc">{b.desc}</p>
          </div>
        ))}
      </div>

      {/* ===== 4. LIVE ACTIVITY FEED ===== */}
      <div className="section-title-bar">
        <h2>📱 Aktiviti Semasa</h2>
      </div>
      <div className="live-feed-wrapper">
        <div className="live-feed-header">
          <span className="live-feed-pulse">
            <span className="pulse-dot" /> LIVE
          </span>
          <span className="live-feed-count">500+ agent aktif sekarang</span>
        </div>
        <div className="live-feed-viewport">
          <div className="live-feed-scroll">
            {[...liveFeedItems, ...liveFeedItems].map((item, i) => (
              <div key={i} className={`live-feed-item feed-${item.type}`}>
                <span className="feed-icon">
                  {item.type === 'join' ? '👤' : item.type === 'commission' ? '💰' : '🏆'}
                </span>
                <span className="feed-text">{item.text}</span>
                <span className="feed-time">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== PROMO CARDS (Weekly Bonus / Rollover / Special Event) ===== */}
      <div className="section-title-bar">
        <h2>🎁 Promotions</h2>
      </div>
      <div className="promo-grid">
        {promoCards.map((card, i) => (
          <div key={i} className={`promo-card${card.highlight ? ' highlight' : ''}`}>
            <div className="promo-card-header">
              <div className="promo-card-icon">{card.icon}</div>
              <div className="promo-card-title">{card.title}</div>
            </div>
            <ul className="promo-card-list">
              {card.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
            <a
              href={card.ctaLink}
              className={`btn ${card.highlight ? 'btn-gradient' : 'btn-outline'}`}
              target={card.ctaLink.startsWith('http') ? '_blank' : undefined}
              rel={card.ctaLink.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {card.cta}
            </a>
          </div>
        ))}
      </div>

      {/* ===== GAME PROVIDERS ===== */}
      <div className="section-title-bar">
        <h2>Top Game Providers</h2>
      </div>
      <p className="section-subtitle-bar">High Win Rate • Smooth Gameplay</p>
      <div className="provider-section">
        <div className="provider-grid">
          {providers.map((p, i) => (
            <a
              key={i}
              href="https://masuk10.com/Signupvvip"
              target="_blank"
              rel="noopener noreferrer"
              className="provider-tile"
            >
              <div className="provider-tile-icon">{p.icon}</div>
              <div className="provider-tile-name">{p.name}</div>
            </a>
          ))}
        </div>
      </div>

      {/* ===== COMMISSION STRUCTURE ===== */}
      <div className="section-title-bar">
        <h2>💎 Komisyen Agent</h2>
      </div>
      <div className="commission-grid">
        {commissions.map((c, i) => (
          <div key={i} className={`commission-card${c.popular ? ' popular' : ''}`}>
            {c.popular && <div className="commission-badge">Popular</div>}
            <div className="commission-label">{c.label}</div>
            <div className="commission-rate">{c.rate}</div>
            <div className="commission-desc">{c.desc}</div>
            <ul className="commission-features">
              {c.features.map((f, j) => (
                <li key={j}>{f}</li>
              ))}
            </ul>
            <a
              href="https://masuk10.com/Signupvvip"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gradient"
            >
              Daftar Sekarang
            </a>
          </div>
        ))}
      </div>

      {/* ===== TESTIMONIALS ===== */}
      <section className="testimonials-section">
        <div className="section-header">
          <div className="section-tag">Testimoni</div>
          <h2 className="section-title" style={{ color: 'white' }}>
            Apa Kata Agent Kami
          </h2>
        </div>
        <div className="testimonials-container">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card">
              <div className="testimonial-stars">{'★'.repeat(t.rating)}</div>
              <p className="testimonial-text">&ldquo;{t.text}&rdquo;</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{t.name[0]}</div>
                <div className="testimonial-info">
                  <h4>{t.name}</h4>
                  <p>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== WHY CM8 ===== */}
      <div className="why-section">
        <h2>Why CM8 VVIP?</h2>
        <ul className="why-checklist">
          {whyItems.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
        <div className="why-actions">
          <a
            href="https://masuk10.com/Signupvvip"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-gradient btn-lg"
          >
            Join Now
          </a>
          <a
            href="https://wa.me/60123456789"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-lg"
          >
            Contact Admin
          </a>
        </div>
      </div>

      {/* ===== FAQ ===== */}
      <div className="section-title-bar">
        <h2>❓ Soalan Lazim</h2>
      </div>
      <div className="faq-section">
        <div className="faq-list">
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

      {/* ===== CTA ===== */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Sedia Untuk Mula Jana Pendapatan?</h2>
          <p className="cta-subtitle">
            Daftar sebagai agent CM8 hari ini dan mula menikmati komisyen tertinggi di pasaran.
          </p>
          <a
            href="https://masuk10.com/Signupvvip"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-white btn-lg"
          >
            Daftar Sebagai Agent →
          </a>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="site-footer">
        <div className="footer-inner">
          <span>© 2024 CM8 VVIP</span>
          <span>•</span>
          <Link href="/about">Tentang</Link>
          <span>•</span>
          <Link href="/benefits">Kelebihan</Link>
          <span>•</span>
          <Link href="/blog">Blog</Link>
          <span>•</span>
          <div className="footer-social">
            <a href="https://wa.me/60123456789" target="_blank" rel="noopener noreferrer">
              💬
            </a>
            <a href="https://t.me/cm8vvip" target="_blank" rel="noopener noreferrer">
              ✈️
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}
