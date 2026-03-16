import type { Metadata } from 'next'
import WheelDemoClient from './wheel-demo-client'

export const metadata: Metadata = {
  title: 'Lucky Wheel — CM8VVIP',
  description: 'Putar rod a bertuah dan menangi hadiah eksklusif!',
  alternates: {
    canonical: 'https://www.cm8vvip.com/wheel',
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function WheelPage() {
  return <WheelDemoClient />
}
