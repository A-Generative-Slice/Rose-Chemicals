import { Metadata } from 'next'
import Header from '../../components/Header'
import RequestQuoteFab from '../../components/RequestQuoteFab'

export const metadata: Metadata = {
  title: 'Request Quote | Rose Chemicals',
  description: 'Request a personalized quote for your cleaning equipment needs. Get competitive pricing and expert recommendations from Rose Chemicals.',
}

export default function RequestQuotePage() {
  return (
    <main>
      <Header />
      
      {/* Hero Section */}
      <section className="bg-hero-bg py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Request a Quote
          </h1>
          <p className="text-xl text-hero-subtext max-w-3xl mx-auto leading-relaxed">
            Get personalized pricing for your cleaning equipment needs. Our experts will 
            provide competitive quotes and professional recommendations tailored to your requirements.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-16">
          {/* Quote Form */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-tile-bg mb-6">
              Tell us about your requirements
            </h2>
            <p className="text-gray-600 mb-8">
              Fill out this detailed form to help us understand your needs better. 
              We'll get back to you with a comprehensive quote within 24 hours.
            </p>
            
            <form className="space-y-8">
              {/* Personal Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-tile-bg mb-4">Contact Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hero-bg focus:border-transparent transition-colors"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hero-bg focus:border-transparent transition-colors"
                      placeholder="Enter your last name"
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
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hero-bg focus:border-transparent transition-colors"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
              </div>

              {/* Business Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-tile-bg mb-4">Business Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hero-bg focus:border-transparent transition-colors"
                      placeholder="Enter your company name"
                    />
                  </div>
                  <div>
                    <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
                      Industry *
                    </label>
                    <select
                      id="industry"
                      name="industry"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hero-bg focus:border-transparent transition-colors"
                    >
                      <option value="">Select your industry</option>
                      <option value="hospitality">Hospitality & Hotels</option>
                      <option value="healthcare">Healthcare & Hospitals</option>
                      <option value="education">Education & Schools</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="retail">Retail & Commercial</option>
                      <option value="office">Office Buildings</option>
                      <option value="residential">Residential Cleaning</option>
                      <option value="industrial">Industrial Facilities</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                      Business Address
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hero-bg focus:border-transparent transition-colors resize-vertical"
                      placeholder="Enter your complete business address"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Product Requirements */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-tile-bg mb-4">Product Requirements</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Product Categories (Select all that apply) *
                    </label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {[
                        'Brooms & Sweeping Tools',
                        'Carpet & Floor Brushes',
                        'Sink & Toilet Brushes',
                        'Long Handle Brushes',
                        'Cobweb Cleaners',
                        'Specialized Cleaning Tools',
                        'Industrial Equipment',
                        'Other (specify in description)'
                      ].map((category) => (
                        <label key={category} className="flex items-center">
                          <input
                            type="checkbox"
                            name="productCategories"
                            value={category}
                            className="w-4 h-4 text-hero-bg border-gray-300 rounded focus:ring-hero-bg"
                          />
                          <span className="ml-2 text-sm text-gray-700">{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                        Estimated Quantity
                      </label>
                      <select
                        id="quantity"
                        name="quantity"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hero-bg focus:border-transparent transition-colors"
                      >
                        <option value="">Select quantity range</option>
                        <option value="1-10">1-10 pieces</option>
                        <option value="11-50">11-50 pieces</option>
                        <option value="51-100">51-100 pieces</option>
                        <option value="101-500">101-500 pieces</option>
                        <option value="500+">500+ pieces</option>
                        <option value="bulk">Bulk Order (1000+ pieces)</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                        Budget Range
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hero-bg focus:border-transparent transition-colors"
                      >
                        <option value="">Select budget range</option>
                        <option value="under-5000">Under ₹5,000</option>
                        <option value="5000-15000">₹5,000 - ₹15,000</option>
                        <option value="15000-50000">₹15,000 - ₹50,000</option>
                        <option value="50000-100000">₹50,000 - ₹1,00,000</option>
                        <option value="100000+">₹1,00,000+</option>
                        <option value="flexible">Flexible</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
                      Required Timeline
                    </label>
                    <select
                      id="timeline"
                      name="timeline"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hero-bg focus:border-transparent transition-colors"
                    >
                      <option value="">Select timeline</option>
                      <option value="immediate">Immediate (within 1 week)</option>
                      <option value="2-4weeks">2-4 weeks</option>
                      <option value="1-2months">1-2 months</option>
                      <option value="3months+">3+ months</option>
                      <option value="ongoing">Ongoing relationship</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Requirements *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hero-bg focus:border-transparent transition-colors resize-vertical"
                  placeholder="Please describe your specific requirements, preferred brands, special features needed, delivery location, and any other important details..."
                ></textarea>
              </div>

              {/* Additional Services */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-tile-bg mb-4">Additional Services</h3>
                <div className="space-y-3">
                  {[
                    'Product demonstration required',
                    'Bulk discount needed',
                    'Regular supply contract',
                    'Custom branding/labeling',
                    'Training for staff',
                    'Maintenance support'
                  ].map((service) => (
                    <label key={service} className="flex items-center">
                      <input
                        type="checkbox"
                        name="additionalServices"
                        value={service}
                        className="w-4 h-4 text-hero-bg border-gray-300 rounded focus:ring-hero-bg"
                      />
                      <span className="ml-2 text-sm text-gray-700">{service}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full bg-hero-bg text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-hero-bg-dark transition-colors duration-200 transform hover:-translate-y-0.5 hover:shadow-lg"
              >
                Submit Quote Request
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Benefits */}
            <div className="bg-tile-bg text-white rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Why Choose Our Quote Service?</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-hero-accent mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Free, no-obligation quotes</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-hero-accent mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Expert product recommendations</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-hero-accent mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Competitive pricing</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-hero-accent mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>24-hour response time</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-hero-accent mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Bulk order discounts</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-hero-accent mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Flexible payment terms</span>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-tile-bg mb-4">Need Help?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Our sales team is ready to assist you with your quote request.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-hero-bg rounded-full p-2">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-sm">Sales Hotline</div>
                    <div className="text-gray-600 text-sm">+91 98765 43210</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-hero-bg rounded-full p-2">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-sm">Email</div>
                    <div className="text-gray-600 text-sm">sales@rosechemicals.com</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quote Process */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-tile-bg mb-4">Quote Process</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="bg-hero-bg text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <div className="font-medium text-sm">Submit Request</div>
                    <div className="text-gray-600 text-xs">Fill out the detailed form</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-hero-bg text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <div className="font-medium text-sm">Review & Analysis</div>
                    <div className="text-gray-600 text-xs">Our experts analyze your needs</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-hero-bg text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <div className="font-medium text-sm">Receive Quote</div>
                    <div className="text-gray-600 text-xs">Get detailed pricing within 24 hours</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-hero-bg text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <div className="font-medium text-sm">Finalize Order</div>
                    <div className="text-gray-600 text-xs">Confirm and place your order</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <RequestQuoteFab />
    </main>
  )
}
