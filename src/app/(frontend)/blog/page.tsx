'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'

/* ── Slot Machine Counter ── */
function SlotCounter({ value, suffix = '' }: { value: string; suffix?: string }) {
  const [display, setDisplay] = useState(value.split('').map(() => '0'))
  const [done, setDone] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  const animate = useCallback(() => {
    if (hasAnimated.current) return
    hasAnimated.current = true

    const chars = value.split('')
    const totalDuration = 1500 // ms
    const stagger = 200 // ms between columns

    chars.forEach((char, i) => {
      const isDigit = /\d/.test(char)
      if (!isDigit) {
        // Non-digit chars appear instantly
        setDisplay((prev) => {
          const n = [...prev]
          n[i] = char
          return n
        })
        return
      }

      const colDelay = i * stagger
      const rollCount = 8 + i * 3 // more rolls for later digits
      const interval = (totalDuration - colDelay) / rollCount

      let tick = 0
      const timer = setInterval(() => {
        tick++
        if (tick >= rollCount) {
          clearInterval(timer)
          setDisplay((prev) => {
            const n = [...prev]
            n[i] = char
            return n
          })
          if (i === chars.length - 1) setDone(true)
        } else {
          setDisplay((prev) => {
            const n = [...prev]
            n[i] = String(Math.floor(Math.random() * 10))
            return n
          })
        }
      }, interval)

      // Delayed start for stagger effect
      setTimeout(() => {}, colDelay)
    })
  }, [value])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) animate()
      },
      { threshold: 0.5 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [animate])

  return (
    <div ref={ref} className={`slot-counter ${done ? 'slot-done' : ''}`}>
      <div className="slot-digits">
        {display.map((ch, i) => (
          <span key={i} className={`slot-digit ${done ? '' : 'slot-rolling'}`}>
            {ch}
          </span>
        ))}
      </div>
      {suffix && <span className="slot-suffix">{suffix}</span>}
    </div>
  )
}

/* ── Blog post data ── */
const posts = [
  {
    slug: 'cara-guna-scanner-ai-mega888',
    title: 'Cara Guna Scanner AI Mega888 & 918Kiss Untuk Tarik Pemain',
    excerpt:
      'Rahsia bagaimana Top Agent menggunakan data RTP Live dan Scanner AI untuk gandakan deposit harian pemain.',
    category: 'Panduan Agent',
    date: '20 Feb 2026',
    image:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    readTime: 6,
    views: 4520,
    tags: ['#Scanner', '#Mega888', '#HackSlot'],
  },
  {
    slug: 'bisnes-online-tiada-modal',
    title: 'Sebenar: 5 Bisnes Online Tanpa Modal Paling Menguntungkan',
    excerpt:
      'Jangan tertipu lagi. Kenali 5 model perniagaan online 100% tanpa modal yang boleh jana RM5,000 sebulan.',
    category: 'Tips & Strategi',
    date: '18 Feb 2026',
    image:
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    readTime: 8,
    views: 8900,
    tags: ['#TanpaModal', '#BisnesOnline', '#IncomePasif'],
  },
  {
    slug: 'rahsia-tarik-high-roller',
    title: 'Rahsia Agent Judi Tarik "High Roller" Deposit Besar',
    excerpt:
      'Bongkar strategi elit bagaimana untuk mencari dan mengekalkan VIP Player yang sanggup deposit RM10k sekali masuk.',
    category: 'Tips & Strategi',
    date: '17 Feb 2026',
    image:
      'https://images.unsplash.com/photo-1565373676839-4d642b59196b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80',
    readTime: 7,
    views: 6100,
    tags: ['#HighRoller', '#Strategi', '#VIP'],
  },
  {
    slug: 'adakah-agent-cm8-selamat',
    title: 'Adakah Menjadi Agent CM8 VVIP Selamat & Sah?',
    excerpt:
      'Penjelasan telus tentang status dan tahap keselamatan sistem CM8 VVIP untuk ketenangan minda agent.',
    category: 'Panduan Agent',
    date: '16 Feb 2026',
    image:
      'https://images.unsplash.com/photo-1533022130541-e9dbdeb4fc44?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    readTime: 4,
    views: 11200,
    tags: ['#Trusted', '#Selamat', '#Platform'],
  },
  {
    slug: 'cara-jadi-agent-cm8-berjaya',
    title: '5 Cara Menjadi Agent CM8 Yang Berjaya',
    excerpt:
      'Panduan lengkap untuk agent baru yang ingin berjaya dalam industri. Ketahui strategi-strategi yang telah terbukti berkesan.',
    category: 'Panduan Agent',
    date: '15 Feb 2026',
    image: '/blog/agent-success.png',
    readTime: 5,
    views: 2847,
    tags: ['#Agent', '#Panduan', '#Berjaya'],
  },
  {
    slug: 'komisyen-tinggi-platform-cm8',
    title: 'Kenapa Komisyen CM8 Paling Tinggi Di Pasaran',
    excerpt:
      'Bandingkan komisyen CM8 dengan platform lain dan ketahui kenapa ribuan agent memilih kami sebagai platform utama mereka.',
    category: 'Tips & Strategi',
    date: '12 Feb 2026',
    image: '/blog/high-commission.png',
    readTime: 4,
    views: 1923,
    tags: ['#Komisyen', '#CM8', '#Platform'],
  },
  {
    slug: 'pendapatan-pasif-agent-downline',
    title: 'Jana Pendapatan Pasif Melalui Sistem Downline',
    excerpt:
      'Ketahui bagaimana sistem downline CM8 boleh menjana pendapatan pasif untuk anda walaupun anda sedang tidur.',
    category: 'Tips & Strategi',
    date: '10 Feb 2026',
    image: '/blog/passive-income.png',
    readTime: 6,
    views: 3412,
    tags: ['#Downline', '#Pasif', '#Pendapatan'],
  },
]

const categories = ['Semua', ...Array.from(new Set(posts.map((p) => p.category)))]

export default function BlogPage() {
  const [filter, setFilter] = useState('Semua')

  const featured = posts[0]
  const rest = filter === 'Semua' ? posts.slice(1) : posts.filter((p) => p.category === filter)

  return (
    <>
      {/* JSON-LD */}
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
                name: 'Blog',
                item: 'https://cm8vvip.com/blog',
              },
            ],
          }),
        }}
      />

      {/* ── Hero ── */}
      <div className="page-hero">
        <h1 className="page-hero-title">Blog CM8 VVIP</h1>
        <p className="page-hero-subtitle">
          Tips, panduan, dan berita terkini untuk agent-agent CM8.
        </p>
      </div>

      <section className="section">
        <div className="section-inner">
          {/* ── 1. Featured Article (Hero Card) ── */}
          {filter === 'Semua' && (
            <a
              href={`/blog/${featured.slug}`}
              className="blog-featured blog-animate"
              style={{ animationDelay: '0.1s' }}
            >
              <div className="blog-featured-img-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={featured.image} alt={featured.title} className="blog-featured-img" />
                <div className="blog-featured-overlay" />
              </div>
              <div className="blog-featured-content">
                <div className="blog-featured-meta-top">
                  <span className="blog-badge-featured">⭐ FEATURED</span>
                  <span className="blog-badge-category">{featured.category}</span>
                </div>
                <h2 className="blog-featured-title">{featured.title}</h2>
                <p className="blog-featured-excerpt">{featured.excerpt}</p>
                <div className="blog-featured-meta-bottom">
                  <span>📖 {featured.readTime} min</span>
                  <span>👁 {featured.views.toLocaleString()}</span>
                  <span>{featured.date}</span>
                </div>
                <div className="blog-tags">
                  {featured.tags.map((t) => (
                    <span key={t} className="blog-tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          )}

          {/* ── 3. Category Filter Chips ── */}
          <div className="blog-filter-bar blog-animate" style={{ animationDelay: '0.2s' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`blog-filter-chip ${filter === cat ? 'active' : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* ── Card Grid ── */}
          <div className="blog-grid">
            {rest.map((p, i) => (
              <a
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="blog-card blog-animate"
                style={{ animationDelay: `${0.3 + i * 0.12}s` }}
              >
                {/* ── Image with hover overlay ── */}
                <div className="blog-card-image">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={p.title} className="blog-card-img" />
                  <div className="blog-card-img-overlay">
                    <span>Baca Artikel →</span>
                  </div>
                </div>

                <div className="blog-card-body">
                  {/* ── 2. Reading Time & Views ── */}
                  <div className="blog-card-stats">
                    <span>📖 {p.readTime} min</span>
                    <span>👁 {p.views.toLocaleString()}</span>
                  </div>

                  <span className="blog-card-category">{p.category}</span>
                  <h3 className="blog-card-title">{p.title}</h3>
                  <p className="blog-card-excerpt">{p.excerpt}</p>

                  {/* ── 6. Tag Badges ── */}
                  <div className="blog-tags">
                    {p.tags.map((t) => (
                      <span key={t} className="blog-tag">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="blog-card-meta">
                    <span>{p.date}</span>
                    <span className="blog-read-more">Baca Lagi →</span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {rest.length === 0 && (
            <div className="blog-empty">
              <p>Tiada artikel dalam kategori ini.</p>
            </div>
          )}

          {/* ── 5. Newsletter / WhatsApp Signup — PREMIUM ── */}
          {/* ── Frosted Glass Newsletter Card ── */}
          <div className="nl-border-wrap blog-animate" style={{ animationDelay: '0.6s' }}>
            <div className="blog-newsletter">
              {/* Soft floating particles */}
              <div className="nl-particles">
                <span />
                <span />
                <span />
                <span />
              </div>

              {/* Content */}
              <div className="nl-content">
                <div className="nl-badge">
                  <span className="nl-badge-dot" />
                  LIVE · EXCLUSIVE CHANNEL
                </div>

                <h3 className="blog-newsletter-title">
                  Dapatkan Tips &<br />
                  Strategi Terkini
                </h3>
                <p className="blog-newsletter-subtitle">
                  Join channel WhatsApp kami untuk terima tips, promosi, dan strategi terkini terus
                  ke telefon anda.
                </p>

                {/* Stats row — slot machine animation */}
                <div className="nl-stats">
                  <div className="nl-stat">
                    <div className="nl-stat-num">
                      <SlotCounter value="10" suffix="K+" />
                    </div>
                    <span className="nl-stat-label">Members</span>
                  </div>
                  <div className="nl-stat-divider" />
                  <div className="nl-stat">
                    <div className="nl-stat-num">
                      <SlotCounter value="500" suffix="+" />
                    </div>
                    <span className="nl-stat-label">Tips Shared</span>
                  </div>
                  <div className="nl-stat-divider" />
                  <div className="nl-stat">
                    <div className="nl-stat-num">
                      <SlotCounter value="24" suffix="/7" />
                    </div>
                    <span className="nl-stat-label">Updates</span>
                  </div>
                </div>

                <a
                  href="https://whatsapp.com/channel/0029Vb7cSULCxoAtcGaunK37"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="blog-newsletter-btn"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.025.507 3.932 1.395 5.608L.05 23.708a.5.5 0 00.606.606l6.1-1.345A11.937 11.937 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.758 0-3.442-.46-4.938-1.323l-.354-.21-3.67.808.823-3.607-.23-.367A9.935 9.935 0 012 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10z" />
                  </svg>
                  Join WhatsApp Channel
                  <span className="btn-arrow">→</span>
                </a>
                <p className="nl-disclaimer">
                  🔒 100% Percuma · Tiada spam · Boleh keluar bila-bila
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
