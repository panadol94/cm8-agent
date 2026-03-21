import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hubungi Kami',
  description:
    'Hubungi CM8 VVIP untuk pertanyaan mengenai menjadi agent, komisyen, atau sebarang masalah akaun. Kami sedia membantu.',
  alternates: { canonical: 'https://www.cm8vvip.com/contact' },
}

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: 'Hubungi CM8 VVIP',
            url: 'https://www.cm8vvip.com/contact',
          }),
        }}
      />

      <div className="page-hero">
        <h1 className="page-hero-title">Hubungi Kami</h1>
        <p className="page-hero-subtitle">
          Ada soalan atau perlukan bantuan? Pasukan CM8 VVIP sedia membantu anda.
          Hubungi kami melalui saluran di bawah.
        </p>
      </div>

      <section className="section">
        <div className="section-inner">
          <div className="section-tag">Cara Hubungi</div>
          <h2 className="section-title">Saluran Sokongan</h2>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>WhatsApp</h3>
              <p>
                Hubungi kami terus di WhatsApp untuk respons yang paling pantas. Sesuai
                untuk pertanyaan umum dan sokongan akaun.
              </p>
              <a
                href="https://wa.me/60172722902"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Hubungi WhatsApp →
              </a>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Telegram</h3>
              <p>
                Sertai komuniti Telegram rasmi kami untuk kemas kini terkini, tips
                strategik, dan sokongan dari pasukan kami.
              </p>
              <a
                href="https://t.me/cm8vvip"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Sertai Telegram →
              </a>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🏢</div>
              <h3>Daftar sebagai Agen</h3>
              <p>
                Daftar sebagai agent untuk akses kepada alat pengurusan lengkap,
                laporan komisyen, dan sokongan VIP.
              </p>
              <a href="/register" className="btn btn-primary">
                Daftar Sekarang →
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-cream">
        <div className="section-inner">
          <div className="section-tag">Soalan Lazim</div>
          <h2 className="section-title">Sebelum Hubungi Kami</h2>
          <div className="prose">
            <p>
              Banyak soalan boleh dijawab dengan segera. Lihat halaman{' '}
              <a href="/about">tentang kami</a> atau{' '}
              <a href="/benefits">faedah menjadi agent</a> untuk maklumat lebih lanjut.
            </p>
            <ul>
              <li>
                <strong>Daftar Agent:</strong> Pergi ke{' '}
                <a href="/register">halaman pendaftaran</a> dan isi borang untuk
                pendaftaran segera.
              </li>
              <li>
                <strong>Komisyen:</strong> Maklumat komisyen tersedia di dashboard
                agent selepas login.
              </li>
              <li>
                <strong>Isu Akaun:</strong> Sila berikan ID akaun dan keterangan
                masalah untuk bantuan yang lebih cepat.
              </li>
              <li>
                <strong>Teknikal:</strong> Nyatakan peranti dan pelayar yang digunakan
                apabila menghubungi kami.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Bersedia untuk Bermula?</h2>
          <p className="cta-subtitle">
            Daftar sebagai agent CM8 VVIP sekarang dan mula bina pendapatan pasif anda.
          </p>
          <a href="/register" className="btn btn-white btn-lg">
            Daftar Sebagai Agent →
          </a>
        </div>
      </section>
    </>
  )
}
