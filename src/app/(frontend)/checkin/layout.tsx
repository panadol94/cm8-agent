import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Check-in Harian CM8',
  description: 'Check-in harian untuk dapatkan reward dan bonus. Login setiap hari untuk kumpul mata ganjaran.',
  alternates: { canonical: 'https://www.cm8vvip.com/checkin' },
}

export default function CheckinLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
