import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Daftar Sebagai Agent CM8 VVIP — Pendaftaran Percuma',
  description:
    'Daftar sebagai agent CM8 VVIP secara percuma. Tiada modal diperlukan. Jana komisyen sehingga 90% dengan menjadi agent slot online #1 Malaysia.',
  keywords: [
    'daftar agent CM8',
    'daftar agent slot',
    'pendaftaran agent percuma',
    'jadi agent CM8',
    'daftar agent judi online',
    'CM8 VVIP daftar',
    'agent slot tanpa modal',
    'buat duit online daftar',
    'komisyen agent slot',
  ],
  openGraph: {
    title: 'Daftar Sebagai Agent CM8 VVIP — Pendaftaran Percuma',
    description:
      'Daftar percuma sebagai agent CM8 VVIP. Jana komisyen sehingga 90% tanpa modal. Pasukan kami akan menghubungi anda dalam 24 jam.',
    url: 'https://www.cm8vvip.com/register',
    type: 'website',
    siteName: 'CM8 VVIP',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Daftar Sebagai Agent CM8 VVIP',
    description:
      'Daftar percuma sebagai agent CM8 VVIP. Jana komisyen sehingga 90% tanpa modal.',
  },
  alternates: {
    canonical: 'https://www.cm8vvip.com/register',
  },
}

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Daftar Sebagai Agent CM8 VVIP',
            description:
              'Daftar sebagai agent CM8 VVIP secara percuma. Jana komisyen sehingga 90% tanpa modal.',
            url: 'https://www.cm8vvip.com/register',
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
