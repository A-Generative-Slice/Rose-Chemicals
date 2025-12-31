'use client';

import { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  Upload,
  Eye,
  EyeOff,
  Mail,
  Shield,
  Globe,
  CreditCard,
  Truck,
  Bell,
  Database,
  Smartphone,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';
import { adminAPI } from '../../services/api';

interface GeneralSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  logo: string;
  favicon: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialMedia: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    youtube: string;
  };
}

interface EmailSettings {
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
  emailTemplates: {
    welcomeEmail: boolean;
    orderConfirmation: boolean;
    orderStatusUpdate: boolean;
    passwordReset: boolean;
    promotional: boolean;
  };
}

interface PaymentSettings {
  razorpayEnabled: boolean;
  razorpayKeyId: string;
  razorpayKeySecret: string;
  codEnabled: boolean;
  minOrderForCod: number;
  maxOrderForCod: number;
  processingFee: number;
}

interface ShippingSettings {
  freeShippingThreshold: number;
  standardShippingRate: number;
  expressShippingRate: number;
  internationalShipping: boolean;
  estimatedDeliveryDays: {
    standard: number;
    express: number;
  };
  shippingZones: Array<{
    name: string;
    rate: number;
    deliveryDays: number;
  }>;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
  };
  apiRateLimit: number;
}

export default function SettingsManagement() {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    siteName: 'Rose Chemicals',
    siteDescription: 'Premium chemical solutions for all your needs',
    siteUrl: 'https://rosechemicals.com',
    logo: '',
    favicon: '',
    contactEmail: 'info@rosechemicals.com',
    contactPhone: '+91 98765 43210',
    address: '1st street, Tagore Nagar, Tiruppalai, Madurai, Tamil Nadu 625014',
    socialMedia: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
      youtube: ''
    }
  });

  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUser: '',
    smtpPassword: '',
    fromEmail: 'noreply@rosechemicals.com',
    fromName: 'Rose Chemicals',
    emailTemplates: {
      welcomeEmail: true,
      orderConfirmation: true,
      orderStatusUpdate: true,
      passwordReset: true,
      promotional: false
    }
  });

  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    razorpayEnabled: true,
    razorpayKeyId: '',
    razorpayKeySecret: '',
    codEnabled: true,
    minOrderForCod: 500,
    maxOrderForCod: 50000,
    processingFee: 0
  });

  const [shippingSettings, setShippingSettings] = useState<ShippingSettings>({
    freeShippingThreshold: 2000,
    standardShippingRate: 100,
    expressShippingRate: 200,
    internationalShipping: false,
    estimatedDeliveryDays: {
      standard: 7,
      express: 3
    },
    shippingZones: [
      { name: 'Mumbai Metropolitan', rate: 50, deliveryDays: 2 },
      { name: 'Maharashtra', rate: 100, deliveryDays: 5 },
      { name: 'Rest of India', rate: 150, deliveryDays: 7 }
    ]
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorAuth: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSpecialChars: true
    },
    apiRateLimit: 100
  });

  const [showPasswords, setShowPasswords] = useState({
    smtpPassword: false,
    razorpayKeySecret: false
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getSettings();
      if (response.success && response.settings) {
        const s = response.settings;

        if (s.general) {
          setGeneralSettings(prev => ({
            ...prev,
            ...s.general,
            socialMedia: { ...prev.socialMedia, ...(s.general.socialMedia || {}) }
          }));
        }

        if (s.email) {
          setEmailSettings(prev => ({
            ...prev,
            ...s.email,
            emailTemplates: { ...prev.emailTemplates, ...(s.email.emailTemplates || {}) }
          }));
        }

        if (s.payment) {
          setPaymentSettings(prev => ({
            ...prev,
            ...s.payment
          }));
        }

        if (s.shipping) {
          setShippingSettings(prev => ({
            ...prev,
            ...s.shipping,
            estimatedDeliveryDays: { ...prev.estimatedDeliveryDays, ...(s.shipping.estimatedDeliveryDays || {}) },
            shippingZones: s.shipping.shippingZones || prev.shippingZones
          }));
        }

        if (s.security) {
          setSecuritySettings(prev => ({
            ...prev,
            ...s.security,
            passwordPolicy: { ...prev.passwordPolicy, ...(s.security.passwordPolicy || {}) }
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);

      const settings = {
        general: generalSettings,
        email: emailSettings,
        payment: paymentSettings,
        shipping: shippingSettings,
        security: securitySettings
      };

      await adminAPI.updateSettings(settings);

      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      {/* Site Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Site Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Name
            </label>
            <input
              type="text"
              value={generalSettings.siteName}
              onChange={(e) => setGeneralSettings(prev => ({ ...prev, siteName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site URL
            </label>
            <input
              type="url"
              value={generalSettings.siteUrl || ''}
              onChange={(e) => setGeneralSettings(prev => ({ ...prev, siteUrl: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Site Description
          </label>
          <textarea
            value={generalSettings.siteDescription || ''}
            onChange={(e) => setGeneralSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Email
            </label>
            <input
              type="email"
              value={generalSettings.contactEmail || ''}
              onChange={(e) => setGeneralSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Phone
            </label>
            <input
              type="tel"
              value={generalSettings.contactPhone || ''}
              onChange={(e) => setGeneralSettings(prev => ({ ...prev, contactPhone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Address
          </label>
          <textarea
            value={generalSettings.address || ''}
            onChange={(e) => setGeneralSettings(prev => ({ ...prev, address: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Facebook
            </label>
            <input
              type="url"
              value={generalSettings.socialMedia?.facebook || ''}
              onChange={(e) => setGeneralSettings(prev => ({
                ...prev,
                socialMedia: { ...prev.socialMedia, facebook: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://facebook.com/yourpage"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instagram
            </label>
            <input
              type="url"
              value={generalSettings.socialMedia?.instagram || ''}
              onChange={(e) => setGeneralSettings(prev => ({
                ...prev,
                socialMedia: { ...prev.socialMedia, instagram: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://instagram.com/yourpage"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Twitter
            </label>
            <input
              type="url"
              value={generalSettings.socialMedia?.twitter || ''}
              onChange={(e) => setGeneralSettings(prev => ({
                ...prev,
                socialMedia: { ...prev.socialMedia, twitter: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://twitter.com/yourpage"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LinkedIn
            </label>
            <input
              type="url"
              value={generalSettings.socialMedia?.linkedin || ''}
              onChange={(e) => setGeneralSettings(prev => ({
                ...prev,
                socialMedia: { ...prev.socialMedia, linkedin: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://linkedin.com/company/yourpage"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      {/* Razorpay Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Razorpay Integration</h3>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={paymentSettings.razorpayEnabled}
              onChange={(e) => setPaymentSettings(prev => ({ ...prev, razorpayEnabled: e.target.checked }))}
              className="sr-only"
            />
            <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${paymentSettings.razorpayEnabled ? 'bg-blue-600' : 'bg-gray-300'
              }`}>
              <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${paymentSettings.razorpayEnabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
            </div>
          </label>
        </div>

        {paymentSettings.razorpayEnabled && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Razorpay Key ID
              </label>
              <input
                type="text"
                value={paymentSettings.razorpayKeyId}
                onChange={(e) => setPaymentSettings(prev => ({ ...prev, razorpayKeyId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="rzp_test_..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Razorpay Key Secret
              </label>
              <div className="relative">
                <input
                  type={showPasswords.razorpayKeySecret ? 'text' : 'password'}
                  value={paymentSettings.razorpayKeySecret}
                  onChange={(e) => setPaymentSettings(prev => ({ ...prev, razorpayKeySecret: e.target.value }))}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter key secret"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('razorpayKeySecret')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.razorpayKeySecret ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cash on Delivery */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Cash on Delivery (COD)</h3>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={paymentSettings.codEnabled}
              onChange={(e) => setPaymentSettings(prev => ({ ...prev, codEnabled: e.target.checked }))}
              className="sr-only"
            />
            <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${paymentSettings.codEnabled ? 'bg-blue-600' : 'bg-gray-300'
              }`}>
              <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${paymentSettings.codEnabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
            </div>
          </label>
        </div>

        {paymentSettings.codEnabled && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Order (₹)
              </label>
              <input
                type="number"
                value={paymentSettings.minOrderForCod}
                onChange={(e) => setPaymentSettings(prev => ({ ...prev, minOrderForCod: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Order (₹)
              </label>
              <input
                type="number"
                value={paymentSettings.maxOrderForCod}
                onChange={(e) => setPaymentSettings(prev => ({ ...prev, maxOrderForCod: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Processing Fee (₹)
              </label>
              <input
                type="number"
                value={paymentSettings.processingFee}
                onChange={(e) => setPaymentSettings(prev => ({ ...prev, processingFee: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        )}
      </div>

    </div>
  );

  const renderShippingSettings = () => (
    <div className="space-y-6">
      {/* General Shipping */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Rates</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Free Shipping Threshold (₹)
            </label>
            <input
              type="number"
              value={shippingSettings.freeShippingThreshold}
              onChange={(e) => setShippingSettings(prev => ({ ...prev, freeShippingThreshold: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Standard Shipping (₹)
            </label>
            <input
              type="number"
              value={shippingSettings.standardShippingRate}
              onChange={(e) => setShippingSettings(prev => ({ ...prev, standardShippingRate: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Express Shipping (₹)
            </label>
            <input
              type="number"
              value={shippingSettings.expressShippingRate}
              onChange={(e) => setShippingSettings(prev => ({ ...prev, expressShippingRate: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Delivery Times */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Estimated Delivery Times</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Standard Delivery (days)
            </label>
            <input
              type="number"
              value={shippingSettings.estimatedDeliveryDays.standard}
              onChange={(e) => setShippingSettings(prev => ({
                ...prev,
                estimatedDeliveryDays: {
                  ...prev.estimatedDeliveryDays,
                  standard: Number(e.target.value)
                }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Express Delivery (days)
            </label>
            <input
              type="number"
              value={shippingSettings.estimatedDeliveryDays.express}
              onChange={(e) => setShippingSettings(prev => ({
                ...prev,
                estimatedDeliveryDays: {
                  ...prev.estimatedDeliveryDays,
                  express: Number(e.target.value)
                }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Shipping Zones */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Zones</h3>
        <div className="space-y-4">
          {shippingSettings.shippingZones.map((zone, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-gray-200 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zone Name
                </label>
                <input
                  type="text"
                  value={zone.name}
                  onChange={(e) => {
                    const updatedZones = [...shippingSettings.shippingZones];
                    updatedZones[index].name = e.target.value;
                    setShippingSettings(prev => ({ ...prev, shippingZones: updatedZones }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rate (₹)
                </label>
                <input
                  type="number"
                  value={zone.rate}
                  onChange={(e) => {
                    const updatedZones = [...shippingSettings.shippingZones];
                    updatedZones[index].rate = Number(e.target.value);
                    setShippingSettings(prev => ({ ...prev, shippingZones: updatedZones }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Days
                </label>
                <input
                  type="number"
                  value={zone.deliveryDays}
                  onChange={(e) => {
                    const updatedZones = [...shippingSettings.shippingZones];
                    updatedZones[index].deliveryDays = Number(e.target.value);
                    setShippingSettings(prev => ({ ...prev, shippingZones: updatedZones }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      {/* Authentication */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Authentication Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-500">Require 2FA for admin accounts</p>
            </div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={securitySettings.twoFactorAuth}
                onChange={(e) => setSecuritySettings(prev => ({ ...prev, twoFactorAuth: e.target.checked }))}
                className="sr-only"
              />
              <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${securitySettings.twoFactorAuth ? 'bg-blue-600' : 'bg-gray-300'
                }`}>
                <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${securitySettings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                  }`} />
              </div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                value={securitySettings.sessionTimeout}
                onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Login Attempts
              </label>
              <input
                type="number"
                value={securitySettings.maxLoginAttempts}
                onChange={(e) => setSecuritySettings(prev => ({ ...prev, maxLoginAttempts: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Password Policy */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Password Policy</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Password Length
            </label>
            <input
              type="number"
              min="6"
              max="32"
              value={securitySettings.passwordPolicy.minLength}
              onChange={(e) => setSecuritySettings(prev => ({
                ...prev,
                passwordPolicy: {
                  ...prev.passwordPolicy,
                  minLength: Number(e.target.value)
                }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={securitySettings.passwordPolicy.requireUppercase}
                onChange={(e) => setSecuritySettings(prev => ({
                  ...prev,
                  passwordPolicy: {
                    ...prev.passwordPolicy,
                    requireUppercase: e.target.checked
                  }
                }))}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="ml-2 text-sm text-gray-700">
                Require uppercase letters
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={securitySettings.passwordPolicy.requireNumbers}
                onChange={(e) => setSecuritySettings(prev => ({
                  ...prev,
                  passwordPolicy: {
                    ...prev.passwordPolicy,
                    requireNumbers: e.target.checked
                  }
                }))}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="ml-2 text-sm text-gray-700">
                Require numbers
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={securitySettings.passwordPolicy.requireSpecialChars}
                onChange={(e) => setSecuritySettings(prev => ({
                  ...prev,
                  passwordPolicy: {
                    ...prev.passwordPolicy,
                    requireSpecialChars: e.target.checked
                  }
                }))}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="ml-2 text-sm text-gray-700">
                Require special characters
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Settings Management</h2>
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500">Manage your store configuration</p>
        </div>
        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={20} />
              Save Changes
            </>
          )}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Social Media Settings Section */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <Globe size={20} />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Social Media Links</h2>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Facebook
                  </label>
                  <input
                    type="url"
                    value={generalSettings.socialMedia?.facebook || ''}
                    onChange={(e) => setGeneralSettings(prev => ({
                      ...prev,
                      socialMedia: { ...prev.socialMedia, facebook: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instagram
                  </label>
                  <input
                    type="url"
                    value={generalSettings.socialMedia?.instagram || ''}
                    onChange={(e) => setGeneralSettings(prev => ({
                      ...prev,
                      socialMedia: { ...prev.socialMedia, instagram: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://instagram.com/yourpage"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Twitter
                  </label>
                  <input
                    type="url"
                    value={generalSettings.socialMedia?.twitter || ''}
                    onChange={(e) => setGeneralSettings(prev => ({
                      ...prev,
                      socialMedia: { ...prev.socialMedia, twitter: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://twitter.com/yourpage"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    value={generalSettings.socialMedia?.linkedin || ''}
                    onChange={(e) => setGeneralSettings(prev => ({
                      ...prev,
                      socialMedia: { ...prev.socialMedia, linkedin: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://linkedin.com/company/yourpage"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    YouTube
                  </label>
                  <input
                    type="url"
                    value={generalSettings.socialMedia?.youtube || ''}
                    onChange={(e) => setGeneralSettings(prev => ({
                      ...prev,
                      socialMedia: { ...prev.socialMedia, youtube: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://youtube.com/@yourchannel"
                  />
                </div>
              </div>
            </div>
          </section>


        </>
      )}
    </div>
  );
}