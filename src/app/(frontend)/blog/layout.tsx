import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog CM8 VVIP — Tips, Panduan & Strategi Agent Slot',
  description:
    'Baca artikel terkini tentang tips menjadi agent berjaya, strategi pemasaran slot online, cara buat duit online, dan berita terkini dari CM8 VVIP.',
  keywords: [
    'blog CM8 VVIP',
    'tips agent slot',
    'panduan agent judi',
    'strategi buat duit online',
    'cara jadi agent berjaya',
    'komisyen agent slot',
    'tips scanner RTP slot',
    'scanner AI slot',
    'income pasif Malaysia',
  ],
  openGraph: {
    title: 'Blog CM8 VVIP — Tips, Panduan & Strategi Agent Slot',
    description:
      'Tips, panduan, dan berita terkini untuk agent-agent CM8. Strategi pemasaran slot online dan cara buat duit tanpa modal.',
    url: 'https://www.cm8vvip.com/blog',
    type: 'website',
    siteName: 'CM8 VVIP',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Blog CM8 VVIP — Tips, Panduan & Strategi Agent Slot' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog CM8 VVIP — Tips & Panduan Agent',
    description:
      'Tips, panduan, dan berita terkini untuk agent-agent CM8 VVIP.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://www.cm8vvip.com/blog',
  },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
