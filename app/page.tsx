import Header from '../components/Header'
import Hero from '../components/Hero'
import Featured from '../components/Featured'
import RequestQuoteFab from '../components/RequestQuoteFab'

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-semibold mb-6">Featured Products</h2>
        <Featured />
      </section>
      <RequestQuoteFab />
    </main>
  )
}
