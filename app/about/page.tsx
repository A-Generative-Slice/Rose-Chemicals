import { Metadata } from 'next'
import Header from '../../components/Header'
import RequestQuoteFab from '../../components/RequestQuoteFab'

export const metadata: Metadata = {
  title: 'About Us | Rose Chemicals',
  description: 'Growing Together. Empowering Entrepreneurs. Learn about our mission to empower local manufacturing.',
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
            Growing Together. Empowering Entrepreneurs.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 py-16">

        {/* Story */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-tile-bg mb-6 text-center">
            Our Story
          </h2>
          <div className="max-w-4xl mx-auto text-lg text-gray-700 leading-relaxed text-center">
            <p>
              Rose Chemicals was founded with a clear vision to create entrepreneurs, not just customers.
              We empower individuals to manufacture and sell cleaning and home-care products locally through
              knowledge, training, and ongoing support. By enabling production at the local level, we
              significantly reduce transportation costs and ensure faster, affordable supply. This model
              helps entrepreneurs build sustainable businesses while delivering quality products to their
              communities. Rose Chemicals grows by helping others grow.
            </p>
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="bg-tile-bg text-white rounded-lg p-10 flex flex-col justify-center">
            <h3 className="text-2xl font-bold mb-4 border-b border-white/20 pb-2">VISION STATEMENT</h3>
            <p className="text-gray-100 leading-relaxed text-lg italic">
              &ldquo;To grow the organization by enabling our clients with the knowledge, cost-effective
              products, and support they need to become independent entrepreneurs, while reducing
              production and transportation costs.&rdquo;
            </p>
            <p className="mt-4 font-semibold text-hero-cta-text">
              Tagline: &ldquo;Growing Together. Empowering Entrepreneurs.&rdquo;
            </p>
          </div>
          <div className="bg-gray-100 text-gray-800 rounded-lg p-10 flex flex-col justify-center border border-gray-200">
            <h3 className="text-2xl font-bold mb-4 border-b border-gray-300 pb-2 text-tile-bg">MISSION STATEMENT</h3>
            <p className="text-gray-700 leading-relaxed text-lg italic">
              &ldquo;To provide quality home-care and cleaning solutions through efficient manufacturing,
              affordable pricing, and practical training, empowering individuals to start and grow their
              own businesses.&rdquo;
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-tile-bg mb-10 text-center">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">1. Empowerment</h3>
              <p className="text-gray-600 leading-relaxed">
                We are committed to empowering our clients with knowledge, training, and reliable support
                to help them become confident and independent entrepreneurs.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">2. Cost Efficiency & Innovation</h3>
              <p className="text-gray-600 leading-relaxed">
                We continuously improve our processes to reduce production and transportation costs,
                delivering high-quality products at affordable prices through smart and sustainable innovation.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">3. Trust & Quality</h3>
              <p className="text-gray-600 leading-relaxed">
                We uphold the highest standards of quality, transparency, and ethical practices, building
                long-term trust with our customers, franchise partners, and communities.
              </p>
            </div>
          </div>
        </div>

        {/* Franchise Opportunity Section */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 md:p-12 border border-blue-100">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-tile-bg mb-4">
              🌟 ROSE CHEMICALS – FRANCHISE OPPORTUNITY
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A low-investment business model empowering you to manufacture and sell home & industrial cleaning products.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">

            {/* What we provide */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                ✅ What Rose Chemicals Provides
              </h3>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="font-bold text-blue-600 whitespace-nowrap">Formulations</div>
                  <div className="text-gray-700">Floor cleaner, toilet cleaner, dishwash liquid, detergent liquid, phenyl, handwash, etc.</div>
                </li>
                <li className="flex gap-4">
                  <div className="font-bold text-blue-600 whitespace-nowrap">Raw Materials</div>
                  <div className="text-gray-700">All required chemicals supplied directly by Rose Chemicals at controlled cost.</div>
                </li>
                <li className="flex gap-4">
                  <div className="font-bold text-blue-600 whitespace-nowrap">Training</div>
                  <div className="text-gray-700">Manufacturing process, Quality control, Safe handling, Costing & pricing.</div>
                </li>
                <li className="flex gap-4">
                  <div className="font-bold text-blue-600 whitespace-nowrap">Support</div>
                  <div className="text-gray-700">Label & packaging guidance, Product naming, Sales strategy, WhatsApp & phone support.</div>
                </li>
              </ul>
            </div>

            {/* Model Details */}
            <div className="space-y-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  💰 Investment & Returns
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li><strong>Starting Investment:</strong> Very low (suitable for SHGs, NGOs, individuals)</li>
                  <li><strong>Profit Margin:</strong> 30% – 200% depending on product</li>
                  <li><strong>Demand:</strong> Daily-use products → fast sales</li>
                  <li><strong>ROI:</strong> Possible within 3–6 months</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  👥 Who Can Take This?
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">NGOs & SHGs</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Women Entrepreneurs</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Youth</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Small Traders</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Rural/Semi-urban</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  🤝 Franchise Models
                </h3>
                <ul className="list-disc list-inside text-gray-700 grid grid-cols-2 gap-2">
                  <li>Manufacturing + Local Sales</li>
                  <li>NGO / SHG Livelihood</li>
                  <li>District / Area Distributor</li>
                  <li>Training + Production Unit</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Box */}
          <div className="mt-12 bg-tile-bg text-white p-8 rounded-xl text-center">
            <h3 className="text-2xl font-bold mb-6">📞 Start Your Journey Today</h3>
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 text-lg">
              <div>
                <div className="font-semibold text-gray-300 text-sm uppercase tracking-wider mb-1">Visit Us</div>
                <div>1st street, Tagore Nagar, Tiruppalai, Madurai, Tamil Nadu 625014</div>
              </div>
              <div className="hidden md:block w-px h-12 bg-white/20"></div>
              <div>
                <div className="font-semibold text-gray-300 text-sm uppercase tracking-wider mb-1">Call Us</div>
                <div>8610570490</div>
              </div>
              <div className="hidden md:block w-px h-12 bg-white/20"></div>
              <div>
                <div className="font-semibold text-gray-300 text-sm uppercase tracking-wider mb-1">Email Us</div>
                <div>contact@rosechemicals.in</div>
              </div>
            </div>
            <div className="mt-8">
              <a
                href="/contact"
                className="inline-block px-8 py-3 bg-white text-tile-bg font-bold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Contact Us Now
              </a>
            </div>
          </div>

        </div>

      </section>

      <RequestQuoteFab />
    </main>
  )
}
