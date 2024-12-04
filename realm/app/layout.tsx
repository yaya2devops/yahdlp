import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

// Initialize Inter font
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'yahDLP - Top-Tier PII Detection & Redaction',
  description: 'A Must-have PII Detection Tool for sensitive data handling and privacy compliance',
  metadataBase: new URL('https://dlp.yah.qa'), 
  icons: {
    icon: '/yahdlp.png',
    apple: '/yahdlp.png',
    shortcut: '/yahdlp.png',
  },
  keywords: ['PII detection', 'data privacy', 'security', 'compliance', 'data protection'],
  openGraph: {
    title: 'yahDLP - PII Detection Tool',
    description: 'A Must-have PII Detection Tool for sensitive data handling and privacy compliance',
    images: [
      {
        url: '/yahdlp.png',
        width: 800,
        height: 600,
        alt: 'yahDLP Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'yahDLP - PII Detection Tool',
    description: 'A Must-have PII Detection Tool for sensitive data handling and privacy compliance',
    images: ['/yahdlp.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}