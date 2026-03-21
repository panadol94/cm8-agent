import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dasar Privasi | CM8 VVIP',
  description:
    'Dasar privasi CM8 VVIP. Ketahui bagaimana kami mengumpul, menggunakan, dan melindungi data peribadi anda.',
  alternates: { canonical: 'https://www.cm8vvip.com/privacy-policy' },
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Dasar Privasi CM8 VVIP',
            url: 'https://www.cm8vvip.com/privacy-policy',
          }),
        }}
      />

      <div className="page-hero">
        <h1 className="page-hero-title">Dasar Privasi</h1>
        <p className="page-hero-subtitle">
          Kami menghormati privasi anda. Dasar ini menjelaskan bagaimana CM8 VVIP mengumpul,
          menggunakan, dan melindungi maklumat peribadi anda.
        </p>
      </div>

      <section className="section">
        <div className="section-inner prose">
          <div className="section-tag">Keselamatan Data</div>
          <h2>Pengumpulan Maklumat</h2>
          <p>
            CM8 VVIP mengumpul maklumat peribadi yang anda berikan secara sukarela semasa
            pendaftaran sebagai agent, termasuk nama, nombor telefon, dan maklumat akaun.
          </p>
          <p>
            Kami juga mengumpul data teknikal seperti alamat IP, jenis pelayar, dan aktiviti
            di platform untuk meningkatkan pengalaman pengguna dan keselamatan akaun anda.
          </p>

          <h2>Penggunaan Data</h2>
          <p>Maklumat anda digunakan untuk:</p>
          <ul>
            <li>Mendaftarkan dan menguruskan akaun agent anda</li>
            <li>Memproses komisyen dan pembayaran dengan tepat</li>
            <li>Menghantar notifikasi penting berkaitan akaun</li>
            <li>Meningkatkan perkhidmatan dan pengalaman pengguna</li>
            <li>Mematuhi keperluan undang-undang dan kawal selia</li>
          </ul>

          <h2>Perlindungan Data</h2>
          <p>
            Kami menggunakan langkah keselamatan bertaraf industri termasuk enkripsi SSL,
            firewall, dan kawalan akses yang ketat untuk melindungi data anda daripada
            akses tanpa kebenaran.
          </p>
          <p>
            Data peribadi anda tidak akan dijual,ディ散布, atau dipindahkan kepada pihak
            ketiga untuk tujuan pemasaran tanpa persetujuan anda.
          </p>

          <h2>Cookies</h2>
          <p>
            Platform kami menggunakan cookies untuk menyimpan keutamaan sesi, menganalisis
            trafik, dan memastikan fungsi platform berjalan dengan baik. Anda boleh
            mengawal tetapan cookies melalui pelayar anda.
          </p>

          <h2>Hak Anda</h2>
          <p>
            Anda mempunyai hak untuk mengakses, mengemas kini, atau memadam maklumat peribadi
            anda pada bila-bila masa. Untuk sebarang permintaan berkaitan data anda, sila
            hubungi kami di{' '}
            <a href="https://wa.me/601XXXXXXXX" target="_blank" rel="noopener noreferrer">
              +601XXXXXXXX
            </a>
            .
          </p>

          <h2>Hubungi Kami</h2>
          <p>
            Jika anda mempunyai sebarang pertanyaan mengenai dasar privasi ini, jangan
            sangsi untuk menghubungi kami di{' '}
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
