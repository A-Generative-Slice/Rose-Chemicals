export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-hero-bg pb-32 md:pb-0">
      <div className="flex flex-col md:flex-row items-center justify-between gap-12 w-full">
        <div className="flex flex-col items-center md:items-start text-left md:text-left flex-1">
          <h1 className="fade-in text-3xl md:text-6xl font-semibold text-hero-headline leading-tight md:leading-normal text-left md:text-left w-fit md:w-full">
            Growing <br className="md:hidden" />
            <span className="inline-block pl-7 md:pl-0">Together...</span> <br className="md:hidden" />
            <span className="inline-block pl-12 md:pl-0 mt-8 md:mt-0">Empowering</span> <br className="md:hidden" />
            <span className="inline-block pl-20 md:pl-0">Entrepreneurs...</span>
          </h1>
          <div className="mt-8 flex gap-4 w-full md:w-auto px-6 md:px-0">
            <a
              href="/contact"
              className="inline-block px-8 py-3 bg-hero-cta text-hero-cta-text font-medium rounded-lg
                         shadow-md hover:shadow-lg hover:bg-highlight-light
                         transform transition-all duration-200 hover:-translate-y-0.5"
            >
              Join Us
            </a>
          </div>
        </div>

        <div className="relative w-64 h-64 md:w-96 md:h-96 flex-shrink-0 animate-float">
          <img
            src="/images/mascot.png"
            alt="Rose Chemicals Mascot"
            className="w-full h-full object-contain drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  )
}
