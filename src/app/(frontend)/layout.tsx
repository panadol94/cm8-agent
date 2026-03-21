import React from 'react'
import Link from 'next/link'
import './styles.css'
import Image from 'next/image'
import BottomNav from './BottomNav'
import ScrollReveal from './ScrollReveal'
import { RefreshRouteOnSave } from './RefreshRouteOnSave'
import VisitorTracker from './components/VisitorTracker'
import FloatingSocials from './components/FloatingSocials'
import GlowingLoginBar from './components/GlowingLoginBar'
import BackgroundMusic from './components/BackgroundMusic'
import WelcomePopup from './components/WelcomePopup'

export const metadata = {
  title: {
    default: 'CM8 VVIP — Platform Agent Slot Malaysia #1',
    template: '%s | CM8 VVIP',
  },
  description:
    'Jana income pasif sebagai Agent Slot CM8 VVIP. Daftar percuma, tiada modal. Akses scanner RTP Live & data kemenangan pemain. Komisyen sehingga 90%!',
  keywords: [
    'CM8 VVIP',
    'CM8 agent',
    'agent CM8',
    'agent slot Malaysia',
    'buat duit online Malaysia',
    'income pasif',
    'komisyen slot',
    'platform affiliate slot',
    'daftar agent percuma',
  ],
  authors: [{ name: 'CM8 VVIP' }],
  creator: 'CM8 VVIP',
  metadataBase: new URL('https://www.cm8vvip.com'),
  alternates: {
    canonical: 'https://www.cm8vvip.com/',
  },
  openGraph: {
    type: 'website',
    locale: 'ms_MY',
    siteName: 'CM8 VVIP',
    title: 'CM8 VVIP — Buat Duit Online & Agent Slot Tanpa Modal',
    description:
      'Jana income pasif sebagai Agent Slot CM8 VVIP. Daftar percuma, tiada modal. Akses scanner RTP Live & data kemenangan pemain.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'CM8 VVIP — Platform Agent Slot Malaysia' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CM8 VVIP — Platform Agent Slot Malaysia',
    description: 'Jana income pasif sebagai Agent CM8 VVIP. Komisyen sehingga 90%!',
    images: ['/og-image.jpg'],
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
  verification: {
    google: 'vvSVFWP0CLiaaihXsoT6iHWFnQiKv0H6279HJkxJkkQ',
  },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="ms">
      <head>
        <link rel="icon" href="/cm8-logo.png" />
        <meta name="theme-color" content="#ffffff" />
        {/* Organization Schema JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'CM8 VVIP',
              url: 'https://www.cm8vvip.com',
              description: 'Platform affiliate slot CM8 VVIP Malaysia - jana komisyen sehingga 90%',
              logo: 'https://www.cm8vvip.com/cm8-logo.png',
              sameAs: [
                'https://www.facebook.com/cm8vvip',
                'https://twitter.com/cm8vvip',
                'https://instagram.com/cm8vvip',
              ],
            }),
          }}
        />
      </head>
      <body>
        {/* Sticky Header */}
        <header className="site-header">
          <div className="header-inner">
            <Link href="/" className="header-logo">
              <Image src="/cm8-logo.png" alt="CM8 VVIP - Platform Agent Slot #1 Malaysia" width={48} height={48} />
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

        {/* Glowing Login/Register Bar */}
        <GlowingLoginBar />

        <ScrollReveal />
        <RefreshRouteOnSave />

        <main>{children}</main>

        <VisitorTracker />
        <FloatingSocials />
        <BackgroundMusic />
        <WelcomePopup />

        {/* Bottom Navigation */}
        <BottomNav />
      </body>
    </html>
  )
}
