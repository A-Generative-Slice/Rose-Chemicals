import { Metadata } from 'next'
import Header from '../../components/Header'
import RequestQuoteFab from '../../components/RequestQuoteFab'

export const metadata: Metadata = {
  title: 'Contact Us | Rose Chemicals',
  description: 'Get in touch with Rose Chemicals. Contact us for product inquiries, support, or to discuss your cleaning equipment needs.',
}

export default function ContactPage() {
  return (
    <main>
      <Header />
      
      {/* Hero Section */}
      <section className="bg-hero-bg py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-hero-subtext max-w-3xl mx-auto leading-relaxed">
            We're here to help! Get in touch with our team for product inquiries, 
            support, or to discuss your specific cleaning equipment needs.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-bold text-tile-bg mb-6">
              Send us a Message
            </h2>
            <p className="text-gray-600 mb-8">
              Fill out the form below and we'll get back to you as soon as possible. 
              Our team is ready to assist you with any questions or requirements.
            </p>
            
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hero-bg focus:border-transparent transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hero-bg focus:border-transparent transition-colors"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hero-bg focus:border-transparent transition-colors"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hero-bg focus:border-transparent transition-colors"
                    placeholder="Enter your company name"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hero-bg focus:border-transparent transition-colors"
                >
                  <option value="">Select a subject</option>
                  <option value="product-inquiry">Product Inquiry</option>
                  <option value="bulk-order">Bulk Order</option>
                  <option value="support">Technical Support</option>
                  <option value="partnership">Partnership Opportunity</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hero-bg focus:border-transparent transition-colors resize-vertical"
                  placeholder="Tell us about your requirements or ask any questions..."
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-hero-bg text-white py-3 px-6 rounded-lg font-semibold hover:bg-hero-bg-dark transition-colors duration-200 transform hover:-translate-y-0.5 hover:shadow-lg"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold text-tile-bg mb-6">
              Get in Touch
            </h2>
            <p className="text-gray-600 mb-8">
              Reach out to us through any of the following channels. 
              We're here to provide expert guidance and support.
            </p>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="bg-hero-bg rounded-full p-3 flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-tile-bg mb-1">Office Address</h3>
                  <p className="text-gray-600">
                    Rose Chemicals<br />
                    Industrial Area, Sector 45<br />
                    Gurgaon, Haryana 122003<br />
                    India
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-hero-bg rounded-full p-3 flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-tile-bg mb-1">Phone Numbers</h3>
                  <p className="text-gray-600">
                    Sales: +91 98765 43210<br />
                    Support: +91 98765 43211<br />
                    WhatsApp: +91 98765 43212
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-hero-bg rounded-full p-3 flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-tile-bg mb-1">Email Addresses</h3>
                  <p className="text-gray-600">
                    General: info@rosechemicals.com<br />
                    Sales: sales@rosechemicals.com<br />
                    Support: support@rosechemicals.com
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-hero-bg rounded-full p-3 flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-tile-bg mb-1">Business Hours</h3>
                  <p className="text-gray-600">
                    Monday - Friday: 9:00 AM - 7:00 PM<br />
                    Saturday: 9:00 AM - 5:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-tile-bg mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <a 
                  href="/request-quote" 
                  className="block w-full bg-hero-bg text-white py-3 px-4 rounded-lg text-center font-semibold hover:bg-hero-bg-dark transition-colors"
                >
                  Request a Quote
                </a>
                <a 
                  href="/products" 
                  className="block w-full border-2 border-hero-bg text-hero-bg py-3 px-4 rounded-lg text-center font-semibold hover:bg-hero-bg hover:text-white transition-colors"
                >
                  Browse Products
                </a>
                <a 
                  href="tel:+919876543210" 
                  className="block w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg text-center font-semibold hover:bg-gray-300 transition-colors"
                >
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-tile-bg mb-8 text-center">
            Find Our Location
          </h2>
          <div className="bg-gray-300 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-gray-600">
                Interactive map coming soon<br />
                Rose Chemicals, Gurgaon, Haryana
              </p>
            </div>
          </div>
        </div>
      </section>

      <RequestQuoteFab />
    </main>
  )
}
