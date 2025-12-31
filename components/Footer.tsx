'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';
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

    // Defaults
    const displaySettings = {
        siteName: settings?.siteName || 'Rose Chemicals',
        siteDescription: settings?.siteDescription || 'Premium cleaning solutions for homes and industries. Committed to quality and customer satisfaction.',
        contactEmail: 'contact@rosechemicals.in',
        contactPhone: '8610570490',
        address: '1st street, Tagore Nagar, Tiruppalai, Madurai, Tamil Nadu 625014',
        socialMedia: settings?.socialMedia || { facebook: '', instagram: '', twitter: '', linkedin: '', youtube: '' }
    };

    return (
        <footer className="bg-header-bg text-tile-text-primary border-t border-tertiary mt-auto">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-accent">{displaySettings.siteName}</h3>
                        <p className="text-sm text-tile-text-secondary leading-relaxed">
                            {displaySettings.siteDescription}
                        </p>
                        <div className="flex space-x-4">
                            {displaySettings.socialMedia.facebook && (
                                <Link href={displaySettings.socialMedia.facebook} target="_blank" className="text-tile-text-secondary hover:text-accent transition-colors">
                                    <Facebook size={20} />
                                </Link>
                            )}
                            {displaySettings.socialMedia.instagram && (
                                <Link href={displaySettings.socialMedia.instagram} target="_blank" className="text-tile-text-secondary hover:text-accent transition-colors">
                                    <Instagram size={20} />
                                </Link>
                            )}
                            {displaySettings.socialMedia.twitter && (
                                <Link href={displaySettings.socialMedia.twitter} target="_blank" className="text-tile-text-secondary hover:text-accent transition-colors">
                                    <Twitter size={20} />
                                </Link>
                            )}
                            {displaySettings.socialMedia.linkedin && (
                                <Link href={displaySettings.socialMedia.linkedin} target="_blank" className="text-tile-text-secondary hover:text-accent transition-colors">
                                    <Linkedin size={20} />
                                </Link>
                            )}
                            {displaySettings.socialMedia.youtube && (
                                <Link href={displaySettings.socialMedia.youtube} target="_blank" className="text-tile-text-secondary hover:text-accent transition-colors">
                                    <Youtube size={20} />
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-tile-text-primary">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/" className="text-tile-text-secondary hover:text-accent transition-colors">Home</Link></li>
                            <li><Link href="/products" className="text-tile-text-secondary hover:text-accent transition-colors">Products</Link></li>
                            <li><Link href="/about" className="text-tile-text-secondary hover:text-accent transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="text-tile-text-secondary hover:text-accent transition-colors">Contact</Link></li>
                            <li><Link href="/admin/login" className="text-tile-text-secondary hover:text-accent transition-colors">Admin Login</Link></li>
                        </ul>
                    </div>

                    {/* Legal Pages */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-tile-text-primary">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/shipping-policy" className="text-tile-text-secondary hover:text-accent transition-colors">Shipping Policy</Link></li>
                            <li><Link href="/terms-and-conditions" className="text-tile-text-secondary hover:text-accent transition-colors">Terms & Conditions</Link></li>
                            <li><Link href="/refund-policy" className="text-tile-text-secondary hover:text-accent transition-colors">Refund & Cancellation</Link></li>
                            <li><Link href="/privacy-policy" className="text-tile-text-secondary hover:text-accent transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-tile-text-primary">Contact Us</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-3 text-tile-text-secondary">
                                <MapPin size={18} className="text-accent flex-shrink-0" />
                                <span>{displaySettings.address}</span>
                            </li>
                            <li className="flex items-center gap-3 text-tile-text-secondary">
                                <Phone size={18} className="text-accent flex-shrink-0" />
                                <span>{displaySettings.contactPhone}</span>
                            </li>
                            <li className="flex items-center gap-3 text-tile-text-secondary">
                                <Mail size={18} className="text-accent flex-shrink-0" />
                                <span>{displaySettings.contactEmail}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-tertiary mt-12 pt-8 text-center text-sm text-tile-text-secondary">
                    <p>© {new Date().getFullYear()} {displaySettings.siteName}. All rights reserved.</p>
                    <p className="mt-2 text-xs">
                        <Link
                            href="https://a-generative-slice.github.io/A-generative-slice"
                            target="_blank"
                            className="text-tile-text-secondary hover:text-accent transition-colors opacity-75 hover:opacity-100 uppercase tracking-widest font-medium"
                        >
                            BUILT WITH VIBE OF <span className="font-extrabold text-white">A GENERATIVE SLICE</span>
                        </Link>
                    </p>
                </div>
            </div>
        </footer>
    );
}
