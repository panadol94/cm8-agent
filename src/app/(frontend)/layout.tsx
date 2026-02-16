import React from 'react'
import Link from 'next/link'
import './styles.css'
import Image from 'next/image'
import BottomNav from './BottomNav'
import ScrollReveal from './ScrollReveal'

export const metadata = {
  title: {
    default: 'CM8 VVIP — Platform Agent #1 Malaysia',
    template: '%s | CM8 VVIP',
  },
  description:
    'Jadi agent CM8 sekarang. Komisyen tinggi sehingga 60%, sokongan penuh 24/7, dan peluang pendapatan tanpa had. Daftar sebagai agent CM8 VVIP hari ini.',
  keywords: [
    'CM8',
    'CM8 agent',
    'agent CM8',
    'CM8 VVIP',
    'jadi agent casino online',
    'platform agent Malaysia',
    'komisyen agent tinggi',
    'daftar agent CM8',
  ],
  authors: [{ name: 'CM8 VVIP' }],
  creator: 'CM8 VVIP',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://cm8vvip.com'),
  openGraph: {
    type: 'website',
    locale: 'ms_MY',
    siteName: 'CM8 VVIP',
    title: 'CM8 VVIP — Platform Agent #1 Malaysia',
    description: 'Jadi agent CM8 sekarang. Komisyen tinggi, sokongan penuh 24/7.',
  },
  robots: {
    index: true,
    follow: true,
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
