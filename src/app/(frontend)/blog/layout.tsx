import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog CM8 VVIP',
  description:
    'Baca artikel terkini tentang tips menjadi agent berjaya, strategi pemasaran, dan berita terkini dari CM8 VVIP.',
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
