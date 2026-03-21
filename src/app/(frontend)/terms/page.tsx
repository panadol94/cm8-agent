import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Syarat & Terma | CM8 VVIP',
  description:
    'Syarat dan terma perkhidmatan CM8 VVIP. Sila baca dengan teliti sebelum mendaftar sebagai agent.',
  alternates: { canonical: 'https://www.cm8vvip.com/terms' },
}

export default function TermsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Syarat dan Terma CM8 VVIP',
            url: 'https://www.cm8vvip.com/terms',
          }),
        }}
      />

      <div className="page-hero">
        <h1 className="page-hero-title">Syarat &amp; Terma</h1>
        <p className="page-hero-subtitle">
          Syarat dan terma perkhidmatan CM8 VVIP. Dengan mendaftar sebagai agent, anda
          bersetuju dengan terma-terma berikut.
        </p>
      </div>

      <section className="section">
        <div className="section-inner prose">
          <div className="section-tag">Perkhidmatan Agent</div>
          <h2>Penerimaan Agent</h2>
          <p>
            Untuk menjadi agent CM8 VVIP, anda mestilah berumur sekurang-kurangnya 18 tahun
            dan mempunyai kapasiti undang-undang untuk entering into a contract. Setiap
            agent bertanggungjawab untuk setiap aktiviti yang berlaku di bawah akaun mereka.
          </p>

          <h2>Kewajipan Agent</h2>
          <p>Sebagai agent CM8 VVIP, anda bersetuju untuk:</p>
          <ul>
            <li>Menguruskan pelanggan dan downline dengan penuh tanggungjawab</li>
            <li>Mematuhi semua undang-undang dan kawal selia tempatan yang berkuat kuasa</li>
            <li>Menyimpan maklumat akaun dan kata laluan dengan selamat</li>
            <li>Tidak melibatkan diri dalam aktiviti penipuan atau pengubahan wang</li>
            <li>Mematihi dasar know-your-customer (KYC) platform</li>
          </ul>

          <h2>Komisyen dan Pembayaran</h2>
          <p>
            Kadar komisyen dan syarat pembayaran ditetapkan oleh CM8 VVIP dan mungkin
            berubah dari semasa ke semasa. Komisyen yang layak akan dibayar pada kitar
            pembayaran yang ditentukan oleh platform. Anda bertanggungjawab untuk
            memastikan maklumat pembayaran yang tepat dan terkini.
          </p>

          <h2>Risiko dan Tanggungjawab</h2>
          <p>
            Setiap aktiviti perdagangan dan urusan di bawah platform adalah tanggungjawab
            masing-masing agent dan pelanggan. CM8 VVIP tidak bertanggungjawab atas
            sebarang kerugian kewangan yang timbul daripada penggunaan platform.
          </p>

          <h2>Penamatan Akaun</h2>
          <p>
            CM8 VVIP berhak untuk menamatan atau menggantung mana-mana akaun agent yang
            melanggar syarat perkhidmatan ini, terlibat dalam aktiviti penipuan, atau
            melanggar mana-mana undang-undang yang berkenaan. Dana yang tinggal akan
            diproses mengikut budi bicara CM8 VVIP.
          </p>

          <h2>Sekatan Pasaran</h2>
          <p>
            Perkhidmatan CM8 VVIP tidak tersedia untuk penduduk atau warganegara negara
            yang melarang penggunaan platform pertaruhan dalam talian. Ia adalah
            tanggungjawab agent untuk memastikan mereka mematuhi undang-undang jurisdiction
            masing-masing.
          </p>

          <h2>Pengubahan Terma</h2>
          <p>
            CM8 VVIP berhak untuk mengubah syarat dan terma ini pada bila-bila masa
            dengan notis yang wajar. Continued use of the platform after any changes
            constitutes acceptance of the revised terms.
          </p>

          <h2>Hubungi Kami</h2>
          <p>
            Untuk sebarang pertanyaan mengenai syarat dan terma ini, sila hubungi kami di{' '}
            <a href="https://wa.me/601XXXXXXXX" target="_blank" rel="noopener noreferrer">
              +601XXXXXXXX
            </a>{' '}
            atau melalui halaman{' '}
            <a href="/contact">hubungi kami</a>.
          </p>
        </div>
      </section>
    </>
  )
}
