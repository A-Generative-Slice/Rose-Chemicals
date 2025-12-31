"use client"
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Search, ShoppingBag, Menu, User, LogOut, Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../src/contexts/AuthContext'
import { settingsAPI } from '../src/services/api'
import { useCart } from '../src/contexts/CartContext'
import CartDrawer from './CartDrawer'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [socialLinks, setSocialLinks] = useState({ facebook: '', instagram: '', twitter: '', linkedin: '', youtube: '' })
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const { totalItems } = useCart()
  const router = useRouter()

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await settingsAPI.getPublicSettings()
        if (response.success && response.settings?.socialMedia) {
          setSocialLinks(response.settings.socialMedia)
        }
      } catch (error) {
        console.error('Failed to fetch social links:', error)
      }
    }
    fetchSettings()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-header-bg shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 font-semibold text-lg text-white hover:opacity-90 transition-opacity"
        >
          <img src="/logo.png" alt="Rose Chemicals Logo" className="h-10 w-auto object-contain" />
          <span className="hidden md:block">Rose Chemicals</span>
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
          {/* Social Icons - Desktop Only */}
          <div className="hidden lg:flex items-center gap-2 mr-2 border-r border-white/20 pr-4">
            {socialLinks.facebook && (
              <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">
                <Facebook size={18} />
              </a>
            )}
            {socialLinks.instagram && (
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">
                <Instagram size={18} />
              </a>
            )}
            {socialLinks.twitter && (
              <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">
                <Twitter size={18} />
              </a>
            )}
            {socialLinks.linkedin && (
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">
                <Linkedin size={18} />
              </a>
            )}
            {socialLinks.youtube && (
              <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">
                <Youtube size={18} />
              </a>
            )}
          </div>
          <div className={`relative flex items-center transition-all duration-300 ${searchOpen ? 'w-48 md:w-64' : 'w-10'}`}>
            {searchOpen && (
              <form onSubmit={handleSearch} className="w-full">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 rounded-full bg-white/10 text-white placeholder:text-white/50 border border-white/20 focus:outline-none focus:bg-white/20 transition-all text-sm"
                  autoFocus
                />
              </form>
            )}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="search"
              className={`p-2 rounded-full text-white hover:bg-header-icon-hover-bg hover:text-header-icon-hover transition-all duration-200 group ${searchOpen ? 'absolute right-0' : ''}`}
            >
              <Search size={22} className="group-hover:scale-110 transition-transform duration-200" />
            </button>
          </div>
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
        className={`md:hidden border-t border-header-border transition-all duration-300 ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
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

          {/* Social Icons - Mobile */}
          <div className="flex items-center justify-center gap-6 pt-4 border-t border-white/10 mt-2">
            {socialLinks.facebook && (
              <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">
                <Facebook size={24} />
              </a>
            )}
            {socialLinks.instagram && (
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">
                <Instagram size={24} />
              </a>
            )}
            {socialLinks.twitter && (
              <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">
                <Twitter size={24} />
              </a>
            )}
            {socialLinks.linkedin && (
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">
                <Linkedin size={24} />
              </a>
            )}
            {socialLinks.youtube && (
              <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">
                <Youtube size={24} />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  )
}
