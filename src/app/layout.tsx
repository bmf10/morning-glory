import type { Metadata } from 'next'
import { Roboto, Roboto_Mono } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { HouseIcon, LogOut } from 'lucide-react'
import { Providers } from './provider'

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  weight: ['400', '700'],
})

const robotoMono = Roboto_Mono({
  variable: '--font-roboto-mono',
  subsets: ['latin'],
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  title: 'Morning Glory',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${robotoMono.variable} antialiased`}>
        <Providers>
          <div className="bg-blue-500 flex justify-end items-center p-6 gap-4 text-white">
            <Link href="#" className="flex items-center gap-2">
              <HouseIcon />
              Home
            </Link>
            <Link href="#" className="flex items-center gap-2">
              <LogOut />
              Logout
            </Link>
          </div>
          {children}
        </Providers>
      </body>
    </html>
  )
}
