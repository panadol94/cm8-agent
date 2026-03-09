import { Metadata } from 'next'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://www.cm8vvip.com/' },
}

export default function EventDashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
