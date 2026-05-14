"use client"
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { Search, ShoppingBag, Menu, User, LogOut, X, Facebook, Instagram, Twitter, Linkedin, Youtube, ChevronDown } from 'lucide-react'
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
  const [scrolled, setScrolled] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const { totalItems } = useCart()
  const router = useRouter()
  const searchInputRef = useRef<HTMLInputElement>(null)

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [searchOpen])

  // close mobile menu on route change
  useEffect(() => {
    setOpen(false)
  }, [router])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const navLinks = [
    { href: '/products', label: 'Products' },
    { href: '/about',    label: 'About' },
    { href: '/contact',  label: 'Contact' },
  ]

  const socialIcons: Record<string, JSX.Element> = {
    facebook:  <Facebook  size={16} />,
    instagram: <Instagram size={16} />,
    twitter:   <Twitter   size={16} />,
    linkedin:  <Linkedin  size={16} />,
    youtube:   <Youtube   size={16} />,
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled ? 'header-glass shadow-2xl' : 'bg-transparent'
        }`}
        style={{ borderBottom: scrolled ? '1px solid rgba(255,255,255,0.10)' : 'none' }}
      >
        {/* ── Main Bar ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
            <div className="relative">
              <img
                src="/logo.png"
                alt="Rose Chemicals Logo"
                className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute -inset-1 rounded-full bg-white/10 scale-0 group-hover:scale-100 transition-transform duration-300" />
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="font-bold text-white text-sm tracking-wide">Rose Chemicals</span>
              <span className="text-[10px] text-[#A8DADC] tracking-widest font-medium uppercase opacity-80">Premium Cleaning</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href} className="header-link px-4 py-2 rounded-lg hover:bg-white/10 transition-colors duration-200">
                {label}
              </Link>
            ))}
            <Link
              href="/request-quote"
              className="header-cta-button ml-4"
            >
              Request Quote
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Social Icons — large screens only */}
            <div className="hidden xl:flex items-center gap-1 mr-3 pr-3 border-r border-white/15">
              {(Object.entries(socialLinks) as [string, string][]).map(([key, url]) =>
                url ? (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={key}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
                  >
                    {socialIcons[key]}
                  </a>
                ) : null
              )}
            </div>

            {/* Search */}
            <div className={`relative flex items-center transition-all duration-300 ${searchOpen ? 'w-44 sm:w-60' : 'w-9'}`}>
              {searchOpen && (
                <form onSubmit={handleSearch} className="w-full">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-4 pr-10 py-2 rounded-xl bg-white/12 text-white placeholder:text-white/40
                               border border-white/20 focus:outline-none focus:border-[#A8DADC]/50 focus:bg-white/18
                               text-sm transition-all backdrop-blur-sm"
                  />
                </form>
              )}
              <button
                onClick={() => setSearchOpen(v => !v)}
                aria-label="Search"
                className={`p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200
                            ${searchOpen ? 'absolute right-1' : ''}`}
              >
                {searchOpen ? <X size={18} /> : <Search size={20} />}
              </button>
            </div>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Cart"
              className="relative p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#F4D35E] text-[#0f1e3a] text-[10px] font-black
                                 rounded-full min-w-[18px] h-[18px] flex items-center justify-center leading-none px-1">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>

            {/* User */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(v => !v)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10
                             transition-all duration-200 text-sm font-medium"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#457B9D] to-[#A8DADC] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden md:block max-w-[100px] truncate">{user?.name}</span>
                  <ChevronDown size={14} className={`hidden md:block transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl overflow-hidden shadow-2xl border border-white/10
                                  bg-[#0f1e3a]/95 backdrop-blur-xl z-50">
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-xs text-[#A8DADC] font-medium">Signed in as</p>
                      <p className="text-sm text-white font-semibold truncate">{user?.name}</p>
                    </div>
                    <div className="py-1">
                      {[
                        { href: '/profile', label: 'Profile' },
                        { href: '/orders',  label: 'My Orders' },
                      ].map(({ href, label }) => (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          {label}
                        </Link>
                      ))}
                      {user?.role === 'admin' && (
                        <Link
                          href="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2.5 text-sm text-[#A8DADC] hover:text-white hover:bg-white/10 transition-colors border-t border-white/10"
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false) }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#E63946] hover:bg-white/10 transition-colors"
                      >
                        <LogOut size={14} /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/auth/login" className="px-3 py-2 text-sm text-white/80 hover:text-white transition-colors font-medium">
                  Login
                </Link>
                <Link href="/auth/register" className="header-cta-button !py-2 !px-4 !text-sm">
                  Register
                </Link>
              </div>
            )}

            {/* Hamburger */}
            <button
              aria-label="Toggle menu"
              className="md:hidden p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
              onClick={() => setOpen(v => !v)}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* ── Mobile Drawer ── */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-400 ${
            open ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-[#0f1e3a]/97 backdrop-blur-xl border-t border-white/10 px-5 py-6 flex flex-col gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/85 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium text-sm"
              >
                {label}
              </Link>
            ))}

            <div className="h-px bg-white/10 my-3" />

            {isAuthenticated ? (
              <>
                <Link href="/profile" onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/85 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium text-sm">
                  Profile
                </Link>
                <Link href="/orders" onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/85 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium text-sm">
                  My Orders
                </Link>
                <button
                  onClick={() => { logout(); setOpen(false) }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#E63946] hover:bg-white/10 transition-all duration-200 font-medium text-sm"
                >
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link href="/auth/login" onClick={() => setOpen(false)}
                  className="flex items-center justify-center py-3 rounded-xl border border-white/20 text-white font-semibold text-sm hover:bg-white/10 transition-all">
                  Login
                </Link>
                <Link href="/auth/register" onClick={() => setOpen(false)}
                  className="header-cta-button text-center justify-center">
                  Register
                </Link>
              </div>
            )}

            <Link
              href="/request-quote"
              onClick={() => setOpen(false)}
              className="mt-2 header-cta-button text-center justify-center"
            >
              Request Quote
            </Link>

            {/* Social icons mobile */}
            <div className="flex items-center justify-center gap-5 pt-4 mt-2 border-t border-white/10">
              {(Object.entries(socialLinks) as [string, string][]).map(([key, url]) =>
                url ? (
                  <a key={key} href={url} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-all">
                    {socialIcons[key]}
                  </a>
                ) : null
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
