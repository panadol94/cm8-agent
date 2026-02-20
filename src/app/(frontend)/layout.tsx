import React from 'react'
import Link from 'next/link'
import './styles.css'
import Image from 'next/image'
import BottomNav from './BottomNav'
import ScrollReveal from './ScrollReveal'
import { RefreshRouteOnSave } from './RefreshRouteOnSave'
import VisitorTracker from './components/VisitorTracker'
import FloatingSocials from './components/FloatingSocials'

export const metadata = {
  title: {
    default: 'CM8 VVIP — Buat Duit Online & Agent Slot Tanpa Modal #1 Malaysia',
    template: '%s | CM8 VVIP',
  },
  description:
    'Jana income pasif sebagai Agent Slot CM8 VVIP. Daftar percuma, tiada modal. Akses tips hack slot & scanner live. Komisyen sehingga 90%!',
  keywords: [
    'CM8',
    'CM8 agent',
    'agent CM8',
    'CM8 VVIP',
    'agent slot',
    'agent slot tanpa modal',
    'buat duit online',
    'buat duit tanpa modal',
    'income pasif',
    'hack slot',
    'cara hack slot',
    'mega888 agent',
    '918kiss agent',
    'pussy888 agent',
    'company trusted',
    'judi online malaysia',
    'slot game online',
    'daftar agent percuma',
  ],
  authors: [{ name: 'CM8 VVIP' }],
  creator: 'CM8 VVIP',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://cm8vvip.com'),
  openGraph: {
    type: 'website',
    locale: 'ms_MY',
    siteName: 'CM8 VVIP',
    title: 'CM8 VVIP — Buat Duit Online & Agent Slot Tanpa Modal',
    description:
      'Jana income pasif sebagai Agent Slot CM8 VVIP. Daftar percuma, tiada modal. Akses tips hack slot & scanner live.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'CM8 VVIP Agent Platform' }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="ms">
      <head>
        <link rel="icon" href="/cm8-logo.png" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body>
        {/* Sticky Header */}
        <header className="site-header">
          <div className="header-inner">
            <Link href="/" className="header-logo">
              <Image src="/cm8-logo.png" alt="CM8" width={48} height={48} />
            </Link>
            <div className="header-right">
              <span className="header-url">VVIP URL: cm8vvip.com</span>
              <span className="header-globe">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="12" cy="12" r="9.5" stroke="#c23616" strokeWidth="1.5" />
                  <ellipse cx="12" cy="12" rx="4" ry="9.5" stroke="#c23616" strokeWidth="1.5" />
                  <line x1="2.5" y1="12" x2="21.5" y2="12" stroke="#c23616" strokeWidth="1.5" />
                  <line
                    x1="4"
                    y1="7"
                    x2="20"
                    y2="7"
                    stroke="#c23616"
                    strokeWidth="1"
                    opacity="0.5"
                  />
                  <line
                    x1="4"
                    y1="17"
                    x2="20"
                    y2="17"
                    stroke="#c23616"
                    strokeWidth="1"
                    opacity="0.5"
                  />
                </svg>
              </span>
            </div>
          </div>
        </header>

        <ScrollReveal />
        <RefreshRouteOnSave />

        <main>{children}</main>

        <VisitorTracker />
        <FloatingSocials />

        {/* Bottom Navigation */}
        <BottomNav />
      </body>
    </html>
  )
}
