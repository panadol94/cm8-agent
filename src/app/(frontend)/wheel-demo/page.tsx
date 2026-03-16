import type { Metadata } from 'next'
import WheelDemoClient from './wheel-demo-client'

export const metadata: Metadata = {
  title: 'Wheel Demo Event — CM8VVIP',
  description: 'Demo Lucky Wheel berasaskan whitelist ID Agent dan nombor WhatsApp.',
  alternates: {
    canonical: 'https://www.cm8vvip.com/wheel-demo',
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function WheelDemoPage() {
  return <WheelDemoClient />
}
