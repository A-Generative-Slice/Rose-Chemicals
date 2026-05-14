import './globals.css'
import { ReactNode } from 'react'
import { AuthProvider } from '../src/contexts/AuthContext'
import { CartProvider } from '../src/contexts/CartContext'

export const metadata = {
  title: {
    default: 'Rose Chemicals - Premium Cleaning Solutions',
    template: '%s | Rose Chemicals'
  },
  description: 'Professional cleaning products and solutions for homes and businesses. Quality guaranteed, trusted by thousands of customers across India.',
  keywords: ['cleaning products', 'disinfectants', 'floor cleaners', 'bathroom cleaners', 'kitchen cleaners', 'industrial cleaners', 'rose chemicals'],
  authors: [{ name: 'Rose Chemicals Team' }],
  creator: 'Rose Chemicals',
  publisher: 'Rose Chemicals',
  metadataBase: new URL('https://rosechemicals.com'),
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://rosechemicals.com',
    title: 'Rose Chemicals - Premium Cleaning Solutions',
    description: 'Professional cleaning products and solutions for homes and businesses. Quality guaranteed, trusted by thousands of customers.',
    siteName: 'Rose Chemicals',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Rose Chemicals - Premium Cleaning Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rose Chemicals - Premium Cleaning Solutions',
    description: 'Professional cleaning products and solutions for homes and businesses.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

import Footer from '../components/Footer'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0f1e3a] text-[#334155] antialiased min-h-screen flex flex-col" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif" }}>
        <AuthProvider>
          <CartProvider>
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
