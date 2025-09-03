export default function Hero(){
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-50 via-white to-gray-50">
      <div className="max-w-4xl text-center px-6">
        <h1 className="fade-in text-4xl md:text-6xl font-semibold text-gray-900">
          Premium Cleaning Tools, Delivered.
        </h1>
        <p className="fade-in mt-4 text-lg text-gray-600">
          Quality brooms, brushes, mops and more — crafted for professionals.
        </p>
        <div className="mt-8">
          <a 
            href="/products" 
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg 
                     shadow-md hover:shadow-lg hover:bg-blue-700 
                     transform transition-all duration-200 hover:-translate-y-0.5"
          >
            Shop Catalogue
          </a>
        </div>
      </div>
    </section>
  )
}
