import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CM8 Chat — Komuniti Agent Live Chat',
  description:
    'Sembang secara live dengan komuniti agent CM8 VVIP. Berkongsi tips, strategi, dan pengalaman bersama agent-agent lain. Chat room percuma untuk semua agent.',
  keywords: [
    'CM8 chat',
    'agent chat room',
    'komuniti agent CM8',
    'live chat agent slot',
    'CM8 VVIP komuniti',
    'sembang agent online',
    'chat room slot Malaysia',
  ],
  openGraph: {
    title: 'CM8 Chat — Komuniti Agent Live Chat',
    description:
      'Sembang secara live dengan komuniti agent CM8 VVIP. Chat room percuma untuk semua agent.',
    url: 'https://www.cm8vvip.com/chat',
    type: 'website',
    siteName: 'CM8 VVIP',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CM8 Chat — Komuniti Agent Live Chat',
    description:
      'Sembang secara live dengan komuniti agent CM8 VVIP. Chat room percuma untuk semua agent.',
  },
  alternates: {
    canonical: 'https://www.cm8vvip.com/chat',
  },
}

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'CM8 Chat — Komuniti Agent Live Chat',
            description:
              'Sembang secara live dengan komuniti agent CM8 VVIP. Chat room percuma untuk semua agent.',
            url: 'https://www.cm8vvip.com/chat',
            publisher: {
              '@type': 'Organization',
              name: 'CM8 VVIP',
              url: 'https://www.cm8vvip.com',
            },
          }),
        }}
      />
      {children}
    </>
  )
}
