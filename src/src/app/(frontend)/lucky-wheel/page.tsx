import type { Metadata } from 'next'
import LuckyWheel from '../components/LuckyWheel'

export const metadata: Metadata = {
  title: 'Lucky Wheel — Putar & Menang Hadiah Percuma!',
  description:
    'Putar roda bertuah CM8 VVIP dan menangi hadiah eksklusif! Welcome Bonus, RM10, RM30, RM50, sehingga RM100 kredit percuma. Percuma untuk semua agent CM8.',
  keywords: [
    'lucky wheel CM8',
    'roda bertuah',
    'hadiah percuma CM8',
    'bonus percuma slot',
    'CM8 VVIP lucky wheel',
    'free credit slot Malaysia',
    'spin and win',
    'kredit percuma',
  ],
  openGraph: {
    title: 'Lucky Wheel — Putar & Menang Hadiah Percuma!',
    description:
      'Putar roda bertuah CM8 VVIP dan menangi hadiah eksklusif sehingga RM100 kredit percuma!',
    url: 'https://www.cm8vvip.com/lucky-wheel',
    type: 'website',
    siteName: 'CM8 VVIP',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lucky Wheel — Putar & Menang!',
    description: 'Putar roda bertuah dan menangi hadiah eksklusif dari CM8 VVIP!',
  },
  alternates: {
    canonical: 'https://www.cm8vvip.com/lucky-wheel',
  },
}

export default function LuckyWheelPage() {
  return <LuckyWheel />
}
