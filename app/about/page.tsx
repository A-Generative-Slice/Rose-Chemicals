import { Metadata } from 'next'
import Header from '../../components/Header'
import RequestQuoteFab from '../../components/RequestQuoteFab'

export const metadata: Metadata = {
  title: 'About Us | Rose Chemicals',
  description: 'Learn about Rose Chemicals - your trusted partner for premium cleaning tools and equipment. Discover our history, mission, and commitment to quality.',
}

export default function AboutPage() {
  return (
    <main>
      <Header />
      
      {/* Hero Section */}
      <section className="bg-hero-bg py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About Rose Chemicals
          </h1>
          <p className="text-xl text-hero-subtext max-w-3xl mx-auto leading-relaxed">
            Your trusted partner for premium cleaning tools and equipment since inception. 
            We are committed to providing quality products that meet professional cleaning standards.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-tile-bg mb-6">
              Our Story
            </h2>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              Rose Chemicals was founded with a simple mission: to provide high-quality 
              cleaning tools and equipment that professionals can rely on. Over the years, 
              we have built a reputation for excellence in the cleaning industry.
            </p>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              From humble beginnings to becoming a trusted name in cleaning solutions, 
              our journey has been driven by innovation, quality, and customer satisfaction. 
              We understand the unique needs of different industries and provide tailored 
              solutions for each client.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              Today, we serve businesses across India, providing everything from basic 
              cleaning tools to specialized industrial equipment. Our commitment to quality 
              and service remains unwavering.
            </p>
          </div>
          <div className="bg-gray-100 rounded-lg p-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-hero-bg mb-2">500+</div>
                <div className="text-gray-600">Products Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-hero-bg mb-2">1000+</div>
                <div className="text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-hero-bg mb-2">5+</div>
                <div className="text-gray-600">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-hero-bg mb-2">24/7</div>
                <div className="text-gray-600">Customer Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-tile-bg text-white rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
            <p className="text-gray-100 leading-relaxed">
              To provide innovative, high-quality cleaning solutions that help businesses 
              maintain clean, safe, and productive environments. We strive to exceed 
              customer expectations through superior products and exceptional service.
            </p>
          </div>
          <div className="bg-hero-accent text-white rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
            <p className="text-gray-100 leading-relaxed">
              To become the leading provider of cleaning solutions in India, known for 
              our commitment to quality, innovation, and customer satisfaction. We aim 
              to set new standards in the cleaning industry.
            </p>
          </div>
        </div>

        {/* Values */}
        <div>
          <h2 className="text-3xl font-bold text-tile-bg mb-8 text-center">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-hero-bg rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-tile-bg mb-3">Quality First</h3>
              <p className="text-gray-600">
                We never compromise on quality. Every product we offer meets the highest 
                standards of durability and performance.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-hero-bg rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-tile-bg mb-3">Customer Focus</h3>
              <p className="text-gray-600">
                Our customers are at the heart of everything we do. We listen, understand, 
                and deliver solutions that exceed expectations.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-hero-bg rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-tile-bg mb-3">Innovation</h3>
              <p className="text-gray-600">
                We continuously innovate to bring you the latest and most effective 
                cleaning solutions available in the market.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-hero-bg py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Experience the Rose Chemicals Difference?
          </h2>
          <p className="text-xl text-gray-100 mb-8">
            Join thousands of satisfied customers who trust us for their cleaning needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/products" 
              className="px-8 py-3 bg-white text-hero-bg rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Browse Products
            </a>
            <a 
              href="/contact" 
              className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-hero-bg transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      <RequestQuoteFab />
    </main>
  )
}
