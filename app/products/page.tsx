import { Metadata } from 'next'
import Header from '../../components/Header'
import ProductCategories from '../../components/ProductCategories'
import RequestQuoteFab from '../../components/RequestQuoteFab'

export const metadata: Metadata = {
  title: 'Products | Rose Chemicals',
  description: 'Browse our complete range of premium cleaning tools including brooms, brushes, and specialized cleaning equipment for industrial and commercial use.',
}

export default function ProductsPage() {
  return (
    <main>
      <Header />
      
      {/* Hero Section for Products Page */}
      <section className="bg-hero-bg py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Our Products
          </h1>
          <p className="text-xl text-hero-subtext max-w-3xl mx-auto leading-relaxed">
            Discover our comprehensive range of premium cleaning tools and equipment. 
            From industrial-grade brooms to specialized brushes, we have everything you need 
            for professional cleaning solutions.
          </p>
        </div>
      </section>

      {/* Products Section with Category Filtering */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-tile-bg mb-4">
            Browse Our Products
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl">
            Explore our extensive catalog of cleaning tools by category. Each product is 
            carefully selected for quality and durability to meet professional cleaning standards.
          </p>
        </div>
        
        <ProductCategories />
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-hero-bg rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-tile-bg mb-2">Quality Assured</h3>
              <p className="text-gray-600">
                All our products undergo rigorous quality testing to ensure durability and performance.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-hero-bg rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-tile-bg mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Quick and reliable shipping across India with tracking for all orders.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-hero-bg rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-tile-bg mb-2">Expert Support</h3>
              <p className="text-gray-600">
                Professional guidance to help you choose the right cleaning tools for your needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      <RequestQuoteFab />
    </main>
  )
}
