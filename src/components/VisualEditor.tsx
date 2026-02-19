import React from 'react'

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
    id: 'blog',
    label: '✍️ Blog & Artikel',
    desc: 'Tulis dan terbitkan artikel',
    href: '/admin/collections/blog-posts',
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

const quickActions = [
  {
    icon: '🖼️',
    label: '+ Banner',
    href: '/admin/collections/banners/create',
    bg: 'rgba(245,158,11,0.15)',
    color: '#fbbf24',
    border: 'rgba(245,158,11,0.3)',
  },
  {
    icon: '✍️',
    label: '+ Blog',
    href: '/admin/collections/blog-posts/create',
    bg: 'rgba(34,197,94,0.15)',
    color: '#4ade80',
    border: 'rgba(34,197,94,0.3)',
  },
  {
    icon: '⭐',
    label: '+ Testimoni',
    href: '/admin/collections/testimonials/create',
    bg: 'rgba(59,130,246,0.15)',
    color: '#60a5fa',
    border: 'rgba(59,130,246,0.3)',
  },
  {
    icon: '🎁',
    label: '+ Promo',
    href: '/admin/collections/promos/create',
    bg: 'rgba(139,92,246,0.15)',
    color: '#a78bfa',
    border: 'rgba(139,92,246,0.3)',
  },
]

const extraLinks = [
  { icon: '👥', label: 'Senarai Agent', href: '/admin/collections/agents' },
  { icon: '📊', label: 'Tier Komisyen', href: '/admin/collections/commission-tiers' },
  { icon: '🎰', label: 'Senarai Game', href: '/admin/collections/games' },
  { icon: '🔧', label: 'Patch Provider', href: '/admin/collections/patch-providers' },
  { icon: '🔔', label: 'Log Notifikasi', href: '/admin/collections/notifications-log' },
  { icon: '👨‍💻', label: 'Pengguna Admin', href: '/admin/collections/users' },
  { icon: '📁', label: 'Galeri Media', href: '/admin/collections/media' },
]

const VisualEditor: React.FC = () => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cm8vvip.com'

  return (
    <div style={{ maxWidth: '100%', padding: 0 }}>
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b4e 100%)',
          borderRadius: 12,
          padding: '20px 24px',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap' as const,
          gap: 16,
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 4px', color: '#fff' }}>
            🎯 Visual Editor
          </h2>
          <p style={{ fontSize: '0.82rem', margin: 0, color: '#aaa' }}>
            Klik mana-mana section untuk edit. Preview website di sebelah kanan.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
          {quickActions.map((a) => (
            <a
              key={a.href}
              href={a.href}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '7px 14px',
                borderRadius: 8,
                fontSize: '0.78rem',
                fontWeight: 600,
                textDecoration: 'none',
                background: a.bg,
                color: a.color,
                border: `1px solid ${a.border}`,
                transition: 'all 0.15s ease',
              }}
            >
              {a.icon} {a.label}
            </a>
          ))}
        </div>
      </div>

      {/* Main Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '340px 1fr',
          gap: 16,
          minHeight: 'calc(100vh - 250px)',
        }}
      >
        {/* Left Panel */}
        <div
          style={{
            background: 'var(--theme-elevation-0, #fff)',
            border: '1px solid var(--theme-elevation-150, #e5e5e5)',
            borderRadius: 12,
            padding: 16,
            overflowY: 'auto' as const,
            maxHeight: 'calc(100vh - 250px)',
          }}
        >
          <div
            style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.05em',
              color: 'var(--theme-elevation-500, #888)',
              marginBottom: 10,
              paddingLeft: 4,
            }}
          >
            📝 Bahagian Website
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 4 }}>
            {editSections.map((s) => (
              <a
                key={s.id}
                href={s.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  borderRadius: 8,
                  textDecoration: 'none',
                  color: 'inherit',
                  border: '1px solid transparent',
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: s.color,
                    flexShrink: 0,
                  }}
                />
                <span style={{ flex: 1 }}>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: 'var(--theme-text, #222)',
                    }}
                  >
                    {s.label}
                  </span>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '0.72rem',
                      color: 'var(--theme-elevation-500, #888)',
                      marginTop: 1,
                    }}
                  >
                    {s.desc}
                  </span>
                </span>
                <span style={{ fontSize: '0.9rem', opacity: 0.4 }}>✏️</span>
              </a>
            ))}
          </div>

          <div
            style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.05em',
              color: 'var(--theme-elevation-500, #888)',
              marginTop: 20,
              marginBottom: 10,
              paddingLeft: 4,
            }}
          >
            📂 Lain-lain
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
            {extraLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '6px 10px',
                  borderRadius: 6,
                  fontSize: '0.72rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: 'var(--theme-elevation-600, #666)',
                  background: 'var(--theme-elevation-50, #f5f5f5)',
                  border: '1px solid var(--theme-elevation-100, #eee)',
                }}
              >
                {l.icon} {l.label}
              </a>
            ))}
          </div>
        </div>

        {/* Right Preview */}
        <div
          style={{
            border: '1px solid var(--theme-elevation-150, #e5e5e5)',
            borderRadius: 12,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column' as const,
            background: '#fff',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 14px',
              background: 'var(--theme-elevation-50, #f5f5f5)',
              borderBottom: '1px solid var(--theme-elevation-150, #e5e5e5)',
            }}
          >
            <div style={{ display: 'flex', gap: 5 }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: '#ef4444',
                  display: 'inline-block',
                }}
              />
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: '#f59e0b',
                  display: 'inline-block',
                }}
              />
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: '#22c55e',
                  display: 'inline-block',
                }}
              />
            </div>
            <span
              style={{
                flex: 1,
                fontSize: '0.75rem',
                color: 'var(--theme-elevation-500, #888)',
                fontFamily: 'monospace',
                background: 'var(--theme-elevation-0, #fff)',
                padding: '4px 10px',
                borderRadius: 4,
                border: '1px solid var(--theme-elevation-100, #eee)',
              }}
            >
              {siteUrl}
            </span>
            <a
              href={siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                color: '#3b82f6',
                textDecoration: 'none',
                padding: '4px 10px',
                borderRadius: 4,
              }}
            >
              ↗ Buka
            </a>
          </div>
          <iframe
            src={siteUrl}
            style={{ flex: 1, width: '100%', minHeight: 'calc(100vh - 290px)', border: 'none' }}
            title="Website Preview"
            sandbox="allow-scripts allow-same-origin allow-popups"
          />
        </div>
      </div>
    </div>
  )
}

export default VisualEditor
