'use client'

import React from 'react'

/* ── Related Articles — Internal Linking Hub ─────────────────────────────────
   All 16 Mega888 / CM8 blog posts mapped to hub pages and each other.
   Hub pages: homepage (/), scanner (/kiosk-mega888), trusted (/adakah-agent-cm8-selamat),
   mega888 hub (/cm8), games (/cm8-play).
   Articles are clustered by theme for cross-linking value.
────────────────────────────────────────────────────────────────────────────── */

const MEGA888_ARTICLES: Array<{ slug: string; title: string; theme: 'scanner' | 'games' | 'agent' | 'trusted' }> = [
  // ── Scanner Hub (primary Mega888 SEO cluster) ──
  { slug: 'mega888-gacor-hari-ini',    title: 'Mega888 Gacor Hari Ini: Game Hot & RTP Tertinggi',           theme: 'scanner' },
  { slug: 'mega888-scanner-ai',         title: 'Mega888 AI Scanner: Cara Guna & Kelebihan Sepenuhnya',        theme: 'scanner' },
  { slug: 'mega888-download',            title: 'Mega888 Download: Panduan muat turun semua peranti',         theme: 'scanner' },
  { slug: 'mega888-apk',                 title: 'Mega888 APK: Install dan setup untuk Android & iOS',         theme: 'scanner' },
  { slug: 'mega888-login',               title: 'Mega888 Login: Cara akses akaun dengan selamat',            theme: 'scanner' },
  // ── Game Tips cluster ──
  { slug: 'mega888-game-terbaik',        title: 'Mega888 Game Terbaik 2026: Senarai game wajib cuba',        theme: 'games' },
  { slug: 'mega888-highroller',           title: 'Mega888 High Roller: Strategi untuk pemain VIP',              theme: 'games' },
  // ── Agent / Business cluster ──
  { slug: 'bisnes-online-tiada-modal',   title: 'Bisnes Online Tanpa Modal: 5 Model Menguntungkan',           theme: 'agent' },
  { slug: 'rahsia-tarik-high-roller',    title: 'Rahsia Agent Judi Tarik High Roller Deposit Besar',          theme: 'agent' },
  { slug: 'komisyen-tinggi-platform-cm8', title: 'Kenapa Komisyen CM8 Paling Tinggi (sehingga 90%)',         theme: 'agent' },
  { slug: 'pendapatan-pasif-agent-downline', title: 'Rahsia Jana Pendapatan Pasif Melalui Sistem Downline',  theme: 'agent' },
  { slug: 'cara-daftar-agent-cm8',       title: 'Cara Daftar Agent CM8: Guide Lengkap 2026',                 theme: 'agent' },
  { slug: 'jana-pendapatan-online-agent-slot', title: 'Cara Jana Pendapatan Online RM5,000 Sebulan',        theme: 'agent' },
  // ── Trust / Platform cluster ──
  { slug: 'adakah-agent-cm8-selamat',    title: 'Adakah Agent CM8 VVIP Selamat & Sah?',                     theme: 'trusted' },
  { slug: 'cm8-malaysia-agent-slot-terbaik', title: 'CM8 Malaysia: Agent Slot Terbaik & Paling Dipercayai', theme: 'trusted' },
  { slug: 'cm8-vs-platform-lain',         title: 'CM8 vs Platform Lain: Mana Lebih Bagus?',                  theme: 'trusted' },
]

const HUB_PAGES = [
  { href: '/',                         label: '🏠 Homepage',          desc: 'Laman utama' },
  { href: '/kiosk-mega888',            label: '🎯 AI Scanner',         desc: 'Scan RTP game' },
  { href: '/adakah-agent-cm8-selamat', label: '🛡️ Platform Trusted',  desc: 'Tentang keselamatan' },
  { href: '/cm8',                      label: '🎰 Mega888 Hub',         desc: 'Semua tentang Mega888' },
  { href: '/cm8-play',                 label: '🎮 Games',              desc: 'Senarai game Mega888' },
]

// Pick 4 related articles from different themes first, then fill with any
function getRelated(currentSlug: string, count = 4) {
  const others = MEGA888_ARTICLES.filter((a) => a.slug !== currentSlug)
  const currentTheme = MEGA888_ARTICLES.find((a) => a.slug === currentSlug)?.theme
  const different = others.filter((a) => a.theme !== currentTheme)
  const sameTheme = others.filter((a) => a.theme === currentTheme)
  return [...different, ...sameTheme].slice(0, count)
}

const hubStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
  padding: '0.4rem 0.85rem',
  background: 'rgba(168,85,247,0.12)',
  border: '1px solid rgba(168,85,247,0.3)',
  borderRadius: '100px',
  color: '#c084fc',
  fontSize: '0.78rem',
  fontWeight: 600 as const,
  textDecoration: 'none',
  transition: 'all 0.2s',
}

const hubHoverStyle = {
  background: 'rgba(168,85,247,0.25)',
  borderColor: '#a855f7',
}

const articleStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.65rem 0.85rem',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: '10px',
  color: '#e2e8f0',
  textDecoration: 'none',
  fontSize: '0.82rem',
  fontWeight: 500 as const,
  lineHeight: 1.3,
  transition: 'all 0.2s',
}

const articleHoverStyle = {
  background: 'rgba(245,158,11,0.1)',
  borderColor: '#f59e0b',
  color: '#fbbf24',
}

export default function RelatedArticles({ currentSlug }: { currentSlug: string }) {
  const related = getRelated(currentSlug)
  const current = MEGA888_ARTICLES.find((a) => a.slug === currentSlug)

  return (
    <aside style={{
      marginTop: '3rem',
      padding: '1.5rem',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 100%)',
      borderRadius: '16px',
      border: '1px solid rgba(255,255,255,0.08)',
    }}>
      {/* Hub Pages Navigation */}
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase' as const,
          color: '#a855f7',
          marginBottom: '0.75rem',
        }}>
          🧭 Pautan Penting Dalam Cluster Mega888
        </p>
        <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
          Navigasi pantas ke halaman paling dicari dalam ekosistem Mega888.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '0.5rem' }}>
          {HUB_PAGES.map((hub) => (
            <a
              key={hub.href}
              href={hub.href}
              style={hubStyle}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement
                Object.assign(el.style, hubHoverStyle)
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.background = hubStyle.background
                el.style.borderColor = 'rgba(168,85,247,0.3)'
              }}
            >
              {hub.label}
            </a>
          ))}
        </div>
      </div>

      {/* Related Articles */}
      {related.length > 0 && (
        <div>
          <p style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase' as const,
            color: '#f59e0b',
            marginBottom: '0.75rem',
          }}>
            📖 Artikel Berkaitan
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
            {related.map((article) => (
              <a
                key={article.slug}
                href={`/blog/${article.slug}`}
                style={articleStyle}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement
                  Object.assign(el.style, articleHoverStyle)
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.background = articleStyle.background
                  el.style.borderColor = articleStyle.border
                  el.style.color = articleStyle.color
                }}
              >
                <span style={{ fontSize: '0.7rem', flexShrink: 0, opacity: 0.6 }}>→</span>
                <span>{article.title}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Theme-specific CTA */}
      {current && (
        <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {current.theme === 'scanner' && (
            <a href="/kiosk-mega888" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.65rem 1.25rem',
              background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
              borderRadius: '100px', color: '#fff', textDecoration: 'none',
              fontSize: '0.85rem', fontWeight: 700,
            }}>
              🎯 Check RTP game sebelum spin! → AI Scanner analisa RTP live
            </a>
          )}
          {current.theme === 'games' && (
            <a href="/cm8-play" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.65rem 1.25rem',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              borderRadius: '100px', color: '#fff', textDecoration: 'none',
              fontSize: '0.85rem', fontWeight: 700,
            }}>
              🎮 Main Mega888 sekarang! → Senarai game terbaik
            </a>
          )}
          {current.theme === 'agent' && (
            <a href="/register" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.65rem 1.25rem',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              borderRadius: '100px', color: '#fff', textDecoration: 'none',
              fontSize: '0.85rem', fontWeight: 700,
            }}>
              🚀 Daftar jadi Agent CM8! → Free register, tiada modal
            </a>
          )}
          {current.theme === 'trusted' && (
            <a href="/adakah-agent-cm8-selamat" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.65rem 1.25rem',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              borderRadius: '100px', color: '#fff', textDecoration: 'none',
              fontSize: '0.85rem', fontWeight: 700,
            }}>
              🛡️ Baca tentang keselamatan platform → 100% selamat & legit
            </a>
          )}
        </div>
      )}
    </aside>
  )
}
