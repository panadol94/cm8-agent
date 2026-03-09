import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tap Coin CM8',
  description: 'Main tap coin dan kumpul ganjaran di CM8 VVIP.',
  alternates: { canonical: 'https://www.cm8vvip.com/tap-coin' },
}

export default function TapCoinLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
