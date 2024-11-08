import { cn } from '@/lib/utils'
import { Providers } from '@/providers'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Chatbot UFPA',
  description: 'Tire suas dúvidas sobre o PS 2025 da UFPA',
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
