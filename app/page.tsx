import Header from '../components/Header'
import Hero from '../components/Hero'
import Featured from '../components/Featured'
import RequestQuoteFab from '../components/RequestQuoteFab'
import WhyUs from '../components/WhyUs'

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <section id="products" className="section-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase
                             bg-[#1D3557]/08 text-[#1D3557] border border-[#1D3557]/15 mb-4">
              Our Catalog
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f1e3a] tracking-tight">
              Featured Products
            </h2>
            <p className="mt-3 text-[#457B9D] text-base max-w-xl mx-auto">
              Professional-grade formulations trusted by homes and industries across India
            </p>
          </div>
          <Featured />
        </div>
      </section>
      <WhyUs />
      <RequestQuoteFab />
    </main>
  )
}
