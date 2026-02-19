import React from 'react'
import Link from 'next/link'
import './DashboardCards.scss'

/* ── Section edit hotspots ──────────────────────── */
const editSections = [
  {
    id: 'hero',
    label: '🎨 Hero & Tajuk',
    desc: 'Edit tajuk, subtitle, gambar hero',
    href: '/admin/globals/site-settings',
    color: '#f59e0b',
  },
  {
    id: 'cta',
    label: '🚀 Butang CTA',
    desc: 'Tukar teks & link butang',
    href: '/admin/globals/site-settings',
    color: '#ef4444',
  },
  {
    id: 'banner',
    label: '🖼️ Banner Carousel',
    desc: 'Upload, susun, aktif/nyahaktif banner',
    href: '/admin/collections/banners',
    color: '#8b5cf6',
  },
  {
    id: 'promo',
    label: '🎁 Promosi',
    desc: 'Edit kad promosi di homepage',
    href: '/admin/collections/promos',
    color: '#22c55e',
  },
  {
    id: 'testimonial',
    label: '⭐ Testimoni',
    desc: 'Urus bukti pendapatan agent',
    href: '/admin/collections/testimonials',
    color: '#3b82f6',
  },
  {
    id: 'faq',
    label: '❓ FAQ',
    desc: 'Tambah/edit soalan lazim',
    href: '/admin/collections/faqs',
    color: '#06b6d4',
  },
  {
    id: 'provider',
    label: '🎮 Game Provider',
    desc: 'Logo provider di homepage',
    href: '/admin/collections/providers',
    color: '#10b981',
  },
  {
    id: 'popup',
    label: '📢 Popup Pengumuman',
    desc: 'Toggle & edit popup',
    href: '/admin/globals/popup-announcement',
    color: '#f97316',
  },
  {
    id: 'seo',
    label: '🔍 SEO & Meta',
    desc: 'Title, description, keywords, OG image',
    href: '/admin/globals/site-settings',
    color: '#6366f1',
  },
  {
    id: 'footer',
    label: '📋 Footer & Sosial',
    desc: 'Edit footer text & pautan sosial',
    href: '/admin/globals/site-settings',
    color: '#78716c',
  },
]

/* ── Quick action shortcuts ──────────────────────── */
const quickActions = [
  { icon: '🖼️', label: '+ Banner', href: '/admin/collections/banners/create', color: 'amber' },
  {
    icon: '✍️',
    label: '+ Blog',
    href: '/admin/collections/blog-posts/create',
    color: 'green',
  },
  {
    icon: '⭐',
    label: '+ Testimoni',
    href: '/admin/collections/testimonials/create',
    color: 'blue',
  },
  {
    icon: '🎁',
    label: '+ Promo',
    href: '/admin/collections/promos/create',
    color: 'purple',
  },
]

const DashboardCards: React.FC = () => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cm8vvip.com'

  return (
    <div className="cm8-visual-editor">
      {/* Header */}
      <div className="cm8-ve__header">
        <div className="cm8-ve__header-left">
          <h2>🎯 Visual Editor</h2>
          <p>Klik mana-mana section untuk edit terus. Preview website di sebelah kanan.</p>
        </div>
        <div className="cm8-ve__header-actions">
          {quickActions.map((a) => (
            <Link key={a.href} href={a.href} className={`cm8-ve__quick cm8-ve__quick--${a.color}`}>
              {a.icon} {a.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Main Layout: Edit Panel + Preview */}
      <div className="cm8-ve__layout">
        {/* Left: Edit Sections */}
        <div className="cm8-ve__panel">
          <div className="cm8-ve__panel-title">📝 Bahagian Website</div>
          <div className="cm8-ve__sections">
            {editSections.map((s) => (
              <Link
                key={s.id}
                href={s.href}
                className="cm8-ve__section-card"
                style={{ '--accent': s.color } as React.CSSProperties}
              >
                <div className="cm8-ve__section-dot" />
                <div className="cm8-ve__section-info">
                  <div className="cm8-ve__section-label">{s.label}</div>
                  <div className="cm8-ve__section-desc">{s.desc}</div>
                </div>
                <span className="cm8-ve__section-arrow">✏️</span>
              </Link>
            ))}
          </div>

          {/* Extra: All Collections */}
          <div className="cm8-ve__panel-title" style={{ marginTop: 20 }}>
            📂 Lain-lain
          </div>
          <div className="cm8-ve__extra-links">
            <Link href="/admin/collections/agents" className="cm8-ve__extra">
              👥 Senarai Agent
            </Link>
            <Link href="/admin/collections/commission-tiers" className="cm8-ve__extra">
              📊 Tier Komisyen
            </Link>
            <Link href="/admin/collections/games" className="cm8-ve__extra">
              🎰 Senarai Game
            </Link>
            <Link href="/admin/collections/patch-providers" className="cm8-ve__extra">
              🔧 Patch Provider
            </Link>
            <Link href="/admin/collections/notifications-log" className="cm8-ve__extra">
              🔔 Log Notifikasi
            </Link>
            <Link href="/admin/collections/users" className="cm8-ve__extra">
              👨‍💻 Pengguna Admin
            </Link>
            <Link href="/admin/collections/media" className="cm8-ve__extra">
              📁 Galeri Media
            </Link>
          </div>
        </div>

        {/* Right: Live Website Preview */}
        <div className="cm8-ve__preview">
          <div className="cm8-ve__preview-bar">
            <div className="cm8-ve__preview-dots">
              <span className="cm8-ve__dot cm8-ve__dot--red" />
              <span className="cm8-ve__dot cm8-ve__dot--yellow" />
              <span className="cm8-ve__dot cm8-ve__dot--green" />
            </div>
            <div className="cm8-ve__preview-url">{siteUrl}</div>
            <a
              href={siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cm8-ve__preview-open"
            >
              ↗ Buka
            </a>
          </div>
          <iframe
            src={siteUrl}
            className="cm8-ve__iframe"
            title="Website Preview"
            sandbox="allow-scripts allow-same-origin allow-popups"
          />
        </div>
      </div>
    </div>
  )
}

export default DashboardCards
