"use client"
import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg text-primary hover:opacity-90 transition-opacity">
          Rose Chemicals
        </Link>
        <nav className="hidden md:flex gap-6 items-center text-sm">
          <Link href="/products" className="header-nav-link">Products</Link>
          <Link href="/about" className="header-nav-link">About</Link>
          <Link href="/contact" className="header-nav-link">Contact</Link>
        </nav>
        <div className="flex items-center gap-4">
          <button aria-label="search" className="p-2 rounded-full hover:bg-gray-100 transition-colors">🔍</button>
          <button aria-label="cart" className="p-2 rounded-full hover:bg-gray-100 transition-colors">🧾</button>
          <button 
            className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors" 
            onClick={() => setOpen(v => !v)}
          >
            ☰
          </button>
        </div>
      </div>

      <div 
        className={`md:hidden border-t border-gray-100 transition-all duration-300 ${
          open ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="px-6 py-4 flex flex-col gap-3">
          <Link href="/products" className="header-nav-link">Products</Link>
          <Link href="/about" className="header-nav-link">About</Link>
          <Link href="/contact" className="header-nav-link">Contact</Link>
        </div>
      </div>
    </header>
  )
}
