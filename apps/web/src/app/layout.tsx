import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Fortress — Institutional Wealth Management',
    template: '%s | Fortress',
  },
  description:
    'Institutional-grade wealth management and investment platform. Manage your portfolio, track investments, and grow your wealth with Fortress.',
  keywords: ['wealth management', 'investment', 'portfolio', 'fintech'],
  authors: [{ name: 'Fortress Fund' }],
  openGraph: {
    title: 'Fortress — Institutional Wealth Management',
    description: 'Institutional-grade wealth management platform.',
    url: 'https://fortress-fund.com',
    siteName: 'Fortress',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-body bg-fortress-midnight text-slate-100 antialiased">
        {children}
      </body>
    </html>
  )
}
