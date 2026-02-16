'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Home', icon: HomeNavIcon, key: 'home' },
    { href: '/info', label: 'Info', icon: InfoNavIcon, key: 'info' },
    { href: '/patch-id', label: 'Patch ID', icon: PatchNavIcon, key: 'patch', center: true },
    { href: '/chat', label: 'Chat', icon: ChatGroupNavIcon, key: 'chat' },
    { href: '/blog', label: 'Blog', icon: BlogNavIcon, key: 'blog' },
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <nav className="btm-nav">
      {/* Curved background with center notch */}
      <svg className="btm-nav-bg" viewBox="0 0 400 66" preserveAspectRatio="none">
        <path
          d="M0,20 L150,20 C155,20 160,20 165,16 C170,10 175,0 200,0 C225,0 230,10 235,16 C240,20 245,20 250,20 L400,20 L400,66 L0,66 Z"
          fill="white"
        />
      </svg>
      {navItems.map(({ href, label, icon: Icon, key, center }) => {
        const active = isActive(href)
        const cls = `btm-nav-item ${active ? 'btm-active' : ''} ${center ? 'btm-center' : ''}`

        return (
          <Link key={key} href={href} className={cls}>
            {center && <div className="btm-center-glow" />}
            <Icon active={active} />
            <span className="btm-nav-label">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

/* ── Nav Icons ── */

function HomeNavIcon({ active }: { active: boolean }) {
  const c = active ? '#E63520' : '#9CA3AF'
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1V9.5z"
        fill={active ? c : 'none'}
        stroke={c}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function InfoNavIcon({ active }: { active: boolean }) {
  const c = active ? '#E63520' : '#9CA3AF'
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke={c}
        strokeWidth="1.8"
        fill={active ? `${c}15` : 'none'}
      />
      <path d="M12 16v-4" stroke={c} strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="8.5" r="1" fill={c} />
    </svg>
  )
}

function PatchNavIcon({ active }: { active: boolean }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3l-7 3.5v5c0 4.2 3 8.1 7 9 4-.9 7-4.8 7-9v-5L12 3z"
        fill={active ? '#E63520' : 'white'}
        stroke={active ? '#E63520' : 'white'}
        strokeWidth="1.5"
      />
      <path
        d="M12 8l1.1 2.2 2.4.4-1.75 1.7.4 2.4L12 13.6l-2.15 1.1.4-2.4-1.75-1.7 2.4-.4L12 8z"
        fill={active ? 'white' : '#E63520'}
      />
    </svg>
  )
}

function ChatGroupNavIcon({ active }: { active: boolean }) {
  const c = active ? '#E63520' : '#9CA3AF'
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
        fill={active ? `${c}15` : 'none'}
        stroke={c}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8 10h.01M12 10h.01M16 10h.01" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

function BlogNavIcon({ active }: { active: boolean }) {
  const c = active ? '#E63520' : '#9CA3AF'
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect
        x="4"
        y="3"
        width="16"
        height="18"
        rx="2"
        stroke={c}
        strokeWidth="1.8"
        fill={active ? `${c}15` : 'none'}
      />
      <path d="M8 7h8M8 11h8M8 15h4" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
