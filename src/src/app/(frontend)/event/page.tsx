import type { Metadata } from 'next'
import PickABox from '../components/PickABox'

export const metadata: Metadata = {
  title: 'Event Pick A Box — Menang RM10 Percuma!',
  description:
    'Masukkan kod event dan pilih kotak bertuah anda! Peluang menang RM10 kredit percuma dari CM8 VVIP. Terhad kepada 30 pemenang sahaja!',
  keywords: [
    'CM8 event',
    'pick a box',
    'hadiah percuma',
    'RM10 percuma',
    'CM8 VVIP event',
    'lucky box',
    'kotak bertuah',
  ],
  openGraph: {
    title: 'Event Pick A Box — Menang RM10 Percuma!',
    description:
      'Pilih kotak bertuah anda dan menangi RM10! Terhad kepada 30 pemenang sahaja.',
    url: 'https://www.cm8vvip.com/event',
    type: 'website',
    siteName: 'CM8 VVIP',
  },
  robots: {
    index: false, // Don't index event pages
    follow: false,
  },
}

export default function EventPage() {
  return <PickABox />
}
