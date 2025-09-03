import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Rose Chemicals',
  description: 'Premium Cleaning Tools, Delivered.'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-[#334155] antialiased">
        {children}
      </body>
    </html>
  )
}
