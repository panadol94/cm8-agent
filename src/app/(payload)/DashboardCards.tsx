import React from 'react'
import Link from 'next/link'
import './DashboardCards.scss'

const sections = [
  {
    group: '👥 Pengurusan Agent',
    color: '#3b82f6',
    cards: [
      {
        icon: '👤',
        title: 'Agent',
        desc: 'Lihat, luluskan, atau tolak pendaftaran agent baru.',
        href: '/admin/collections/agents',
        addHref: null,
        badge: 'Senarai',
      },
      {
        icon: '📊',
        title: 'Tier Komisyen',
        desc: 'Atur peratusan komisyen mengikut tier dan downline.',
        href: '/admin/collections/commission-tiers',
        addHref: '/admin/collections/commission-tiers/create',
        badge: null,
      },
      {
        icon: '🔔',
        title: 'Log Notifikasi',
        desc: 'Semak semua notifikasi yang dihantar via Telegram.',
        href: '/admin/collections/notifications-log',
        addHref: null,
        badge: 'Log',
      },
    ],
  },
  {
    group: '📝 Kandungan',
    color: '#f59e0b',
    cards: [
      {
        icon: '🖼️',
        title: 'Banner',
        desc: 'Upload banner promo untuk carousel di homepage.',
        href: '/admin/collections/banners',
        addHref: '/admin/collections/banners/create',
        badge: null,
      },
      {
        icon: '✍️',
        title: 'Blog',
        desc: 'Tulis dan terbitkan artikel blog.',
        href: '/admin/collections/blog-posts',
        addHref: '/admin/collections/blog-posts/create',
        badge: null,
      },
      {
        icon: '⭐',
        title: 'Testimoni',
        desc: 'Urus testimoni agent untuk dipapar di website.',
        href: '/admin/collections/testimonials',
        addHref: '/admin/collections/testimonials/create',
        badge: null,
      },
      {
        icon: '❓',
        title: 'FAQ',
        desc: 'Tambah soalan lazim untuk bahagian FAQ.',
        href: '/admin/collections/faqs',
        addHref: '/admin/collections/faqs/create',
        badge: null,
      },
      {
        icon: '🎁',
        title: 'Promo',
        desc: 'Kad promosi yang dipapar di homepage.',
        href: '/admin/collections/promos',
        addHref: '/admin/collections/promos/create',
        badge: null,
      },
    ],
  },
  {
    group: '🎮 Permainan',
    color: '#22c55e',
    cards: [
      {
        icon: '🏢',
        title: 'Provider Homepage',
        desc: 'Provider yang dipaparkan di homepage (logo).',
        href: '/admin/collections/providers',
        addHref: '/admin/collections/providers/create',
        badge: null,
      },
      {
        icon: '🔧',
        title: 'Patch Providers',
        desc: 'Provider untuk Patch ID Scanner.',
        href: '/admin/collections/patch-providers',
        addHref: '/admin/collections/patch-providers/create',
        badge: null,
      },
      {
        icon: '🎰',
        title: 'Permainan',
        desc: 'Senarai game untuk Patch ID Scanner.',
        href: '/admin/collections/games',
        addHref: '/admin/collections/games/create',
        badge: null,
      },
    ],
  },
  {
    group: '⚙️ Sistem',
    color: '#8b5cf6',
    cards: [
      {
        icon: '👨‍💻',
        title: 'Pengguna Admin',
        desc: 'Urus akaun admin (Super Admin, Editor, Viewer).',
        href: '/admin/collections/users',
        addHref: '/admin/collections/users/create',
        badge: null,
      },
      {
        icon: '📁',
        title: 'Media',
        desc: 'Semua gambar dan fail yang dimuat naik.',
        href: '/admin/collections/media',
        addHref: '/admin/collections/media/create',
        badge: null,
      },
    ],
  },
]

const globalLinks = [
  {
    icon: '🌐',
    title: 'Tetapan Laman',
    desc: 'Logo, hero section, SEO, footer, dan lain-lain.',
    href: '/admin/globals/site-settings',
  },
  {
    icon: '📢',
    title: 'Popup / Pengumuman',
    desc: 'Toggle popup announcement di homepage.',
    href: '/admin/globals/popup-announcement',
  },
]

const DashboardCards: React.FC = () => {
  return (
    <div className="cm8-dashboard">
      {/* Welcome Header */}
      <div className="cm8-dashboard__welcome">
        <h2>📢 Selamat Datang ke CM8 Admin</h2>
        <p>Pilih bahagian yang anda ingin urus. Semua kandungan boleh diubah terus dari sini.</p>
      </div>

      {/* Quick Actions */}
      <div className="cm8-dashboard__quick">
        <h3>⚡ Tindakan Pantas</h3>
        <div className="cm8-dashboard__quick-row">
          <Link href="/admin/collections/agents" className="cm8-quick-btn cm8-quick-btn--blue">
            👥 Lihat Agent Baru
          </Link>
          <Link
            href="/admin/collections/banners/create"
            className="cm8-quick-btn cm8-quick-btn--amber"
          >
            🖼️ Tambah Banner
          </Link>
          <Link
            href="/admin/collections/blog-posts/create"
            className="cm8-quick-btn cm8-quick-btn--green"
          >
            ✍️ Tulis Blog
          </Link>
          <Link href="/admin/globals/site-settings" className="cm8-quick-btn cm8-quick-btn--purple">
            🌐 Tetapan Laman
          </Link>
        </div>
      </div>

      {/* Global Settings */}
      <div className="cm8-dashboard__section">
        <h3>🔧 Tetapan Global</h3>
        <div className="cm8-dashboard__grid cm8-dashboard__grid--2">
          {globalLinks.map((g) => (
            <Link key={g.href} href={g.href} className="cm8-card cm8-card--global">
              <div className="cm8-card__icon">{g.icon}</div>
              <div className="cm8-card__body">
                <div className="cm8-card__title">{g.title}</div>
                <div className="cm8-card__desc">{g.desc}</div>
              </div>
              <span className="cm8-card__arrow">→</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Collection Groups */}
      {sections.map((section) => (
        <div key={section.group} className="cm8-dashboard__section">
          <h3 style={{ borderLeftColor: section.color }}>{section.group}</h3>
          <div className="cm8-dashboard__grid">
            {section.cards.map((card) => (
              <div key={card.href} className="cm8-card">
                <Link href={card.href} className="cm8-card__main">
                  <div className="cm8-card__icon">{card.icon}</div>
                  <div className="cm8-card__body">
                    <div className="cm8-card__title">
                      {card.title}
                      {card.badge && <span className="cm8-card__badge">{card.badge}</span>}
                    </div>
                    <div className="cm8-card__desc">{card.desc}</div>
                  </div>
                  <span className="cm8-card__arrow">→</span>
                </Link>
                {card.addHref && (
                  <Link href={card.addHref} className="cm8-card__add">
                    + Tambah
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default DashboardCards
