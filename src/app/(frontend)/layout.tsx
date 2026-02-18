import React from 'react'
import Link from 'next/link'
import './styles.css'
import Image from 'next/image'
import BottomNav from './BottomNav'
import ScrollReveal from './ScrollReveal'

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
              <span className="header-globe">🌐</span>
            </div>
          </div>
        </header>

        <ScrollReveal />

        <main>{children}</main>

        {/* Bottom Navigation */}
        <BottomNav />
      </body>
    </html>
  )
}
