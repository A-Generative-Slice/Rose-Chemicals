"use client"
import Link from 'next/link'
import { useState } from 'react'
import { Search, ShoppingBag, Menu } from 'lucide-react'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [cartItems] = useState(3) // Mock cart items count
  
  return (
    <header className="sticky top-0 z-40 bg-header-bg shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link 
          href="/" 
          className="font-semibold text-lg text-white hover:opacity-90 transition-opacity"
        >
          Rose Chemicals
        </Link>
        <nav className="hidden md:flex gap-8 items-center">
          <Link 
            href="/products" 
            className="text-white font-medium text-sm header-link hover:text-header-hover"
          >
            Products
          </Link>
          <Link 
            href="/about" 
            className="text-white font-medium text-sm header-link hover:text-header-hover"
          >
            About
          </Link>
          <Link 
            href="/contact" 
            className="text-white font-medium text-sm header-link hover:text-header-hover"
          >
            Contact
          </Link>
          <Link 
            href="/request-quote"
            className="ml-4 px-4 py-2 bg-header-cta text-header-cta-text rounded-lg font-semibold text-sm transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5 header-cta-button"
          >
            Request Quote
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <button 
            aria-label="search" 
            className="p-2 rounded-full text-white hover:bg-header-icon-hover-bg hover:text-header-icon-hover transition-all duration-200 group"
          >
            <Search size={22} className="group-hover:scale-110 transition-transform duration-200" />
          </button>
          <button 
            aria-label="cart" 
            className="relative p-2 rounded-full text-white hover:bg-header-icon-hover-bg hover:text-header-icon-hover transition-all duration-200 group"
          >
            <ShoppingBag size={22} className="group-hover:scale-110 transition-transform duration-200" />
            {cartItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-header-cta text-header-cta-text text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartItems}
              </span>
            )}
          </button>
          <button 
            className="md:hidden p-2 text-white hover:bg-header-icon-hover-bg hover:text-header-icon-hover rounded-full transition-all duration-200 group" 
            onClick={() => setOpen(v => !v)}
          >
            <Menu size={22} className="group-hover:scale-110 transition-transform duration-200" />
          </button>
        </div>
      </div>

      <div 
        className={`md:hidden border-t border-header-border transition-all duration-300 ${
          open ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="px-6 py-4 flex flex-col gap-4">
          <Link 
            href="/products" 
            className="text-white font-medium text-sm header-link hover:text-header-hover py-2"
          >
            Products
          </Link>
          <Link 
            href="/about" 
            className="text-white font-medium text-sm header-link hover:text-header-hover py-2"
          >
            About
          </Link>
          <Link 
            href="/contact" 
            className="text-white font-medium text-sm header-link hover:text-header-hover py-2"
          >
            Contact
          </Link>
          <Link 
            href="/request-quote"
            className="mt-2 px-4 py-3 bg-header-cta text-header-cta-text rounded-lg font-semibold text-sm text-center transition-all duration-200 hover:shadow-md header-cta-button"
          >
            Request Quote
          </Link>
        </div>
      </div>
    </header>
  )
}
