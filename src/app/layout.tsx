import { cn } from '@/lib/utils'
import { Providers } from '@/providers'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { siteConfig } from '@/config'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: siteConfig.name,
  metadataBase: new URL(siteConfig.url),
  description: siteConfig.description,
  keywords: [
    'Chatbot',
    'PS 2025',
    'UFPA',
    'Universidade Federal do Pará',
    'Pará',
    'Edital PS 2025',
  ],
  authors: [
    { name: 'Aridan Pantoja', url: 'https://github.com/aridanpantoja' },
    { name: 'Karol Wojtyla', url: 'https://github.com/kwojtyla' },
  ],
  creator: 'Aridan & Team',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="h-full" suppressHydrationWarning>
      <body className={cn('h-full w-full antialiased', inter.className)}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
