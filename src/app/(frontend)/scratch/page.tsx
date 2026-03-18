import type { Metadata } from 'next'
import ScratchEvent from '../components/ScratchEvent'

export const metadata: Metadata = {
  title: 'Scratch Event — Menang RM20! | CM8 VVIP',
  description: 'Join CM8 Scratch Event! Win RM20 for every winning attempt. Limited to 50 winners only. High 60% win rate!',
  keywords: ['CM8 scratch event', 'scratch card', 'RM20 prize', 'CM8 VVIP'],
  openGraph: {
    title: 'CM8 Scratch Event - Win RM20!',
    description: 'Join now! Limited winners, high win rate!',
  },
  robots: { index: false, follow: false },
}

export default function ScratchPage() {
  return <ScratchEvent />
}
