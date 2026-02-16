import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Patch ID Scanner — Scan Slot RTP Real-Time',
  description:
    'Gunakan AI Patch ID Scanner untuk scan percentage slot secara real-time. Dapatkan data RTP terkini untuk Mega888, Kiss918, Pragmatic Play, JILI dan 10+ provider lain. 100% percuma di CM8 VVIP.',
  keywords: [
    'patch id',
    'patch id CM8',
    'scan slot percentage',
    'slot scanner',
    'RTP scanner',
    'Mega888 RTP',
    'Kiss918 scanner',
    'slot percentage checker',
    'CM8 scanner',
    'AI slot scanner',
    'scan percentage slot online',
    'check RTP slot Malaysia',
    'patch id scanner percuma',
    'slot RTP real-time',
    'scanner Pragmatic Play',
    'JILI slot RTP',
  ],
  openGraph: {
    title: 'Patch ID Scanner — Scan Slot RTP Real-Time | CM8 VVIP',
    description:
      'AI Scanner percuma untuk check percentage slot. Data real-time untuk 16+ provider termasuk Mega888, Kiss918, Pragmatic Play & JILI.',
    url: 'https://cm8vvip.com/patch-id',
    type: 'website',
    siteName: 'CM8 VVIP',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Patch ID Scanner — Scan Slot RTP Real-Time',
    description:
      'AI Scanner percuma untuk check percentage slot. Data real-time untuk 16+ provider.',
  },
  alternates: {
    canonical: 'https://cm8vvip.com/patch-id',
  },
}

export default function PatchIDLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'CM8 VVIP Patch ID Scanner',
            description:
              'AI-powered slot RTP scanner yang menyemak percentage slot secara real-time untuk 16+ provider termasuk Mega888, Kiss918, Pragmatic Play dan JILI.',
            url: 'https://cm8vvip.com/patch-id',
            applicationCategory: 'UtilityApplication',
            operatingSystem: 'Web',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'MYR',
              availability: 'https://schema.org/InStock',
            },
            provider: {
              '@type': 'Organization',
              name: 'CM8 VVIP',
              url: 'https://cm8vvip.com',
              sameAs: ['https://t.me/cm8vvip'],
            },
            featureList: [
              'Real-time RTP scanning',
              'AI-powered analysis',
              '16+ game providers',
              'Device intelligence detection',
              'Free to use',
            ],
          }),
        }}
      />

      {/* Breadcrumb JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://cm8vvip.com' },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Patch ID Scanner',
                item: 'https://cm8vvip.com/patch-id',
              },
            ],
          }),
        }}
      />

      {/* FAQ JSON-LD for rich snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'Apa itu Patch ID Scanner CM8 VVIP?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Patch ID Scanner adalah tool AI percuma yang menganalisis RTP (Return to Player) slot secara real-time. Ia menyokong 16+ provider termasuk Mega888, Kiss918, Pragmatic Play, JILI dan banyak lagi.',
                },
              },
              {
                '@type': 'Question',
                name: 'Bagaimana cara guna Patch ID Scanner?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Masukkan ID CM8 anda, pilih provider yang anda mahu scan, dan tekan butang Execute Scan. Scanner akan menganalisis percentage slot secara automatik dan paparkan keputusan dalam beberapa saat.',
                },
              },
              {
                '@type': 'Question',
                name: 'Adakah Patch ID Scanner percuma?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Ya, Patch ID Scanner adalah 100% percuma untuk semua pengguna CM8 VVIP. Tiada bayaran tersembunyi.',
                },
              },
              {
                '@type': 'Question',
                name: 'Berapa kerap data dikemaskini?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Data percentage slot dikemaskini setiap 5 minit untuk memastikan keputusan yang tepat dan terkini.',
                },
              },
            ],
          }),
        }}
      />

      {children}

      {/* Hidden SEO Content */}
      <div className="sr-only" aria-hidden="false">
        <h2>Patch ID Scanner CM8 VVIP</h2>
        <p>
          Patch ID Scanner adalah tool AI percuma oleh CM8 VVIP yang membolehkan anda menyemak
          percentage slot (RTP - Return to Player) secara real-time. Scanner ini menyokong lebih
          dari 16 provider permainan termasuk Mega888, Kiss918, Pragmatic Play, JILI, BNG, Hacksaw
          Gaming, Habanero, JDB, Playtech, BetSoft, Spade Gaming, NoLimit City, Relax Gaming, FC
          Slot, VA Slot, dan Acewin Slot.
        </p>
        <p>
          Guna scanner untuk melihat game mana yang sedang HOT (RTP tinggi), WARM (sederhana), atau
          COLD (rendah). Data dikemaskini setiap 5 minit untuk ketepatan maksimum.
        </p>
        <h3>Provider Yang Disokong</h3>
        <ul>
          <li>Mega888 - Platform slot #1 di Malaysia</li>
          <li>Kiss918 (918Kiss) - Slot klasik kegemaran ramai</li>
          <li>Pragmatic Play - Provider antarabangsa premium</li>
          <li>JILI - Slot Asia yang popular</li>
          <li>BNG (Booongo) - Slot moden berkualiti tinggi</li>
          <li>Hacksaw Gaming - Slot inovatif dari Eropah</li>
        </ul>
      </div>
    </>
  )
}
