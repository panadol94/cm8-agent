import type { Metadata } from 'next'
import LuckyPick from '../components/LuckyPick'

export const metadata: Metadata = {
  title: 'Lucky Pick \u2014 Menang Sehingga RM388!',
  description:
    'Pilih kad bertuah anda! Peluang menang dari RM3 hingga RM388 setiap hari. Percuma untuk ahli CM8 VVIP.',
  keywords: [
    'CM8 lucky pick',
    'hadiah percuma',
    'RM388 percuma',
    'CM8 VVIP event',
    'kad bertuah',
    'lucky card',
  ],
  openGraph: {
    title: 'Lucky Pick \u2014 Menang Sehingga RM388!',
    description: 'Pilih kad bertuah anda! Peluang menang dari RM3 hingga RM388.',
    url: 'https://www.cm8vvip.com/lucky-pick',
    type: 'website',
    siteName: 'CM8 VVIP',
  },
  robots: { index: false, follow: false },
}

export default function LuckyPickPage() {
  return <LuckyPick />
}
