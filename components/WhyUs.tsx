"use client"

import { Shield, Leaf, Zap, Headphones, Award, Truck } from 'lucide-react'

const REASONS = [
  {
    icon: <Shield size={28} />,
    color: 'from-[#1D3557] to-[#457B9D]',
    glow: 'rgba(29,53,87,0.4)',
    title: 'ISO Certified Quality',
    desc: 'Every product meets strict international quality standards before reaching your hands.',
  },
  {
    icon: <Leaf size={28} />,
    color: 'from-[#2d6a4f] to-[#52b788]',
    glow: 'rgba(45,106,79,0.4)',
    title: 'Eco-Safe Formulations',
    desc: 'Biodegradable, non-toxic formulas that are safe for your family, pets, and the planet.',
  },
  {
    icon: <Zap size={28} />,
    color: 'from-[#d97706] to-[#F4D35E]',
    glow: 'rgba(217,119,6,0.4)',
    title: 'Powerful Performance',
    desc: 'Industrial-strength results at home. One application eliminates 99.9% of germs.',
  },
  {
    icon: <Headphones size={28} />,
    color: 'from-[#7c3aed] to-[#a78bfa]',
    glow: 'rgba(124,58,237,0.4)',
    title: '24/7 Expert Support',
    desc: 'Our chemical specialists are always ready to help you choose the right product.',
  },
  {
    icon: <Award size={28} />,
    color: 'from-[#be123c] to-[#E63946]',
    glow: 'rgba(190,18,60,0.4)',
    title: '15+ Years of Trust',
    desc: 'A legacy brand that thousands of homes and businesses have trusted since 2009.',
  },
  {
    icon: <Truck size={28} />,
    color: 'from-[#0369a1] to-[#38bdf8]',
    glow: 'rgba(3,105,161,0.4)',
    title: 'Pan-India Delivery',
    desc: 'Fast, reliable shipping across India with bulk-order discounts available.',
  },
]

export default function WhyUs() {
  return (
    <section className="section-dark relative overflow-hidden py-20 sm:py-28">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#457B9D]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#A8DADC]/08 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-14 sm:mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase
                           bg-[#A8DADC]/15 text-[#A8DADC] border border-[#A8DADC]/25 mb-4">
            Why Choose Us
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            The Rose Chemicals{' '}
            <span className="text-gradient-aqua">Difference</span>
          </h2>
          <p className="mt-4 text-white/55 max-w-xl mx-auto text-base">
            We're not just selling cleaning products — we're delivering peace of mind.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {REASONS.map((r, i) => (
            <div
              key={r.title}
              className="glass-card p-6 sm:p-7 flex flex-col gap-4 group cursor-default"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${r.color} flex items-center justify-center
                             text-white transition-all duration-300 group-hover:scale-110`}
                style={{ boxShadow: `0 8px 24px ${r.glow}` }}
              >
                {r.icon}
              </div>

              {/* Text */}
              <div>
                <h3 className="text-white font-bold text-base mb-2 group-hover:text-[#A8DADC] transition-colors">
                  {r.title}
                </h3>
                <p className="text-white/55 text-sm leading-relaxed">
                  {r.desc}
                </p>
              </div>

              {/* Bottom accent line */}
              <div
                className={`h-0.5 rounded-full bg-gradient-to-r ${r.color} opacity-0 group-hover:opacity-60 transition-opacity duration-300`}
              />
            </div>
          ))}
        </div>

        {/* CTA strip */}
        <div className="mt-14 text-center">
          <a
            href="/request-quote"
            className="btn-primary inline-flex"
          >
            Get a Custom Quote Today
          </a>
          <p className="mt-3 text-white/35 text-sm">Free consultation — no commitment required</p>
        </div>
      </div>
    </section>
  )
}
