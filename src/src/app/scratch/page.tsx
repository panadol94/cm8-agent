import type { Metadata } from 'next'
import ScratchEvent from '../../../components/ScratchEvent'

export const metadata: Metadata = {
  title: 'Scratch Event — Menang RM20! | CM8 VVIP',
  description: 'Join CM8 Scratch Event! Win RM20 for every winning attempt.',
  robots: { index: false, follow: false },
}

export default function ScratchPage() {
  return <ScratchEvent />
}
