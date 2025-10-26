"use client"
import Link from 'next/link'
import { useState } from 'react'
import { Search, ShoppingBag, Menu, User, LogOut } from 'lucide-react'
import { useAuth } from '../src/contexts/AuthContext'
import { useCart } from '../src/contexts/CartContext'
import CartDrawer from './CartDrawer'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const { totalItems } = useCart()
  
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
            onClick={() => setIsCartOpen(true)}
            aria-label="cart" 
            className="relative p-2 rounded-full text-white hover:bg-header-icon-hover-bg hover:text-header-icon-hover transition-all duration-200 group"
          >
            <ShoppingBag size={22} className="group-hover:scale-110 transition-transform duration-200" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-header-cta text-header-cta-text text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
          
          {/* User Menu */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-2 rounded-full text-white hover:bg-header-icon-hover-bg hover:text-header-icon-hover transition-all duration-200 group"
              >
                <User size={22} className="group-hover:scale-110 transition-transform duration-200" />
                <span className="hidden md:block text-sm">{user?.name}</span>
              </button>
              
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="px-3 py-2 text-white hover:text-header-hover transition-colors text-sm"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="px-4 py-2 bg-header-cta text-header-cta-text rounded-lg font-semibold text-sm transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5"
              >
                Register
              </Link>
            </div>
          )}
          
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
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="px-6 py-4 flex flex-col gap-4">
          <Link 
            href="/products" 
            className="text-white font-medium text-sm header-link hover:text-header-hover py-2"
            onClick={() => setOpen(false)}
          >
            Products
          </Link>
          <Link 
            href="/about" 
            className="text-white font-medium text-sm header-link hover:text-header-hover py-2"
            onClick={() => setOpen(false)}
          >
            About
          </Link>
          <Link 
            href="/contact" 
            className="text-white font-medium text-sm header-link hover:text-header-hover py-2"
            onClick={() => setOpen(false)}
          >
            Contact
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link 
                href="/profile" 
                className="text-white font-medium text-sm header-link hover:text-header-hover py-2"
                onClick={() => setOpen(false)}
              >
                Profile
              </Link>
              <Link 
                href="/orders" 
                className="text-white font-medium text-sm header-link hover:text-header-hover py-2"
                onClick={() => setOpen(false)}
              >
                My Orders
              </Link>
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="text-left text-white font-medium text-sm header-link hover:text-header-hover py-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/auth/login" 
                className="text-white font-medium text-sm header-link hover:text-header-hover py-2"
                onClick={() => setOpen(false)}
              >
                Login
              </Link>
              <Link 
                href="/auth/register" 
                className="text-white font-medium text-sm header-link hover:text-header-hover py-2"
                onClick={() => setOpen(false)}
              >
                Register
              </Link>
            </>
          )}
          
          <Link 
            href="/request-quote"
            className="mt-2 px-4 py-3 bg-header-cta text-header-cta-text rounded-lg font-semibold text-sm text-center transition-all duration-200 hover:shadow-md header-cta-button"
            onClick={() => setOpen(false)}
          >
            Request Quote
          </Link>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  )
}
