'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin, Youtube, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { settingsAPI } from '../src/services/api';

interface FooterSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
    youtube: string;
  };
}

const SOCIAL_ICONS: Record<string, JSX.Element> = {
  facebook:  <Facebook  size={18} />,
  instagram: <Instagram size={18} />,
  twitter:   <Twitter   size={18} />,
  linkedin:  <Linkedin  size={18} />,
  youtube:   <Youtube   size={18} />,
}

const QUICK_LINKS = [
  { href: '/',               label: 'Home' },
  { href: '/products',       label: 'Products' },
  { href: '/about',          label: 'About Us' },
  { href: '/contact',        label: 'Contact' },
  { href: '/request-quote',  label: 'Request Quote' },
]

const LEGAL_LINKS = [
  { href: '/shipping-policy',       label: 'Shipping Policy' },
  { href: '/terms-and-conditions',  label: 'Terms & Conditions' },
  { href: '/refund-policy',         label: 'Refund & Cancellation' },
  { href: '/privacy-policy',        label: 'Privacy Policy' },
]

export default function Footer() {
  const [settings, setSettings] = useState<FooterSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await settingsAPI.getPublicSettings();
        if (response.success && response.settings) {
          setSettings(response.settings);
        }
      } catch (error) {
        console.error('Failed to fetch footer settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const ds = {
    siteName: settings?.siteName || 'Rose Chemicals',
    siteDescription: settings?.siteDescription || 'Premium cleaning solutions for homes and industries. Committed to quality and customer satisfaction.',
    contactEmail: 'contact@rosechemicals.in',
    contactPhone: '8610570490',
    address: '1st street, Tagore Nagar, Tiruppalai, Madurai, Tamil Nadu 625014',
    socialMedia: settings?.socialMedia || { facebook: '', instagram: '', twitter: '', linkedin: '', youtube: '' },
  };

  return (
    <footer className="footer-glass text-white relative overflow-hidden mt-auto">
      {/* Decorative orbs */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#457B9D]/06 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-[#A8DADC]/05 rounded-full blur-[60px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">

        {/* ── Top grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 sm:gap-8 pb-12 border-b border-white/08">

          {/* Brand column */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <img src="/logo.jpg" alt="Rose Chemicals" className="h-10 w-auto object-contain" />
              <div>
                <p className="font-bold text-white text-sm tracking-wide">{ds.siteName}</p>
                <p className="text-[10px] text-[#A8DADC] tracking-widest uppercase opacity-70">Premium Cleaning</p>
              </div>
            </div>

            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              {ds.siteDescription}
            </p>

            {/* Mascot mini */}
            <div className="flex items-center gap-3 glass rounded-2xl p-3 w-fit">
              <img
                src="/images/mascot.jpg"
                alt="Rosie"
                className="w-12 h-12 object-contain mascot-float"
              />
              <div>
                <p className="text-white text-xs font-bold">Meet Rosie!</p>
                <p className="text-[#A8DADC] text-[10px]">Always here to help 🌿</p>
              </div>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-2">
              {(Object.entries(ds.socialMedia) as [string, string][]).map(([key, url]) =>
                url ? (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={key}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/08 text-white/60
                               hover:text-white hover:bg-white/15 border border-white/08 hover:border-white/20
                               transition-all duration-200"
                  >
                    {SOCIAL_ICONS[key]}
                  </a>
                ) : null
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold text-sm mb-4 tracking-wide uppercase">Quick Links</h4>
            <ul className="flex flex-col gap-2.5">
              {QUICK_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="flex items-center gap-1.5 text-sm text-white/50 hover:text-[#A8DADC] transition-colors group"
                  >
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold text-sm mb-4 tracking-wide uppercase">Legal</h4>
            <ul className="flex flex-col gap-2.5">
              {LEGAL_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="flex items-center gap-1.5 text-sm text-white/50 hover:text-[#A8DADC] transition-colors group"
                  >
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Admin */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold text-sm mb-4 tracking-wide uppercase">Staff</h4>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link
                  href="/admin/login"
                  className="flex items-center gap-1.5 text-sm text-white/50 hover:text-[#A8DADC] transition-colors group"
                >
                  <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200" />
                  Admin Login
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="flex items-center gap-1.5 text-sm text-white/50 hover:text-[#A8DADC] transition-colors group"
                >
                  <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200" />
                  Help Desk
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold text-sm mb-4 tracking-wide uppercase">Contact Us</h4>
            <ul className="flex flex-col gap-4">
              <li>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(ds.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-sm text-white/50 hover:text-white transition-colors group"
                >
                  <MapPin size={16} className="text-[#A8DADC] flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span className="leading-relaxed">{ds.address}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:+91${ds.contactPhone}`}
                  className="flex items-center gap-3 text-sm text-white/50 hover:text-white transition-colors group"
                >
                  <Phone size={16} className="text-[#A8DADC] flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span>+91 {ds.contactPhone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${ds.contactEmail}`}
                  className="flex items-center gap-3 text-sm text-white/50 hover:text-white transition-colors group"
                >
                  <Mail size={16} className="text-[#A8DADC] flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="break-all">{ds.contactEmail}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-8 text-xs text-white/30">
          <p>© {new Date().getFullYear()} {ds.siteName}. All rights reserved.</p>
          <p>
            <a
              href="https://a-generative-slice.github.io/A-generative-slice"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#A8DADC] transition-colors tracking-widest uppercase font-medium"
            >
              Built with vibe of{' '}
              <span className="font-extrabold text-white/50">A Generative Slice</span>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
