import './globals.css'
import type { Metadata } from 'next'
import { Instrument_Serif, Inter_Tight } from 'next/font/google'
import SmoothScroll from '@/components/SmoothScroll'
import Preloader from '@/components/Preloader/Preloader'

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--serif',
  display: 'swap',
})

const interTight = Inter_Tight({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Star Brand Studio',
  description: 'Creative studio',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} ${interTight.variable}`}>
      <body>
        <Preloader />
        <SmoothScroll />
        {children}
      </body>
    </html>
  )
}
