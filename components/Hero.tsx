"use client"

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles, Shield, Leaf, Award, ChevronDown, Star } from 'lucide-react'
import { useEffect, useRef } from 'react'

const STATS = [
  { value: '15+',  label: 'Years', sub: 'of Excellence' },
  { value: '50K+', label: 'Clients', sub: 'Served Across India' },
  { value: '100+', label: 'Franchises', sub: 'Pan-India Network' },
  { value: 'B2B', label: 'Bulk Supply', sub: 'Wholesale Pricing' },
]

const FEATURES = [
  { emoji: '🧪', label: 'Raw materials' },
  { emoji: '📦', label: 'Products kit' },
  { emoji: '🗓️', label: 'Monthly packs' },
  { emoji: '🧴', label: 'Cleaning Liquids' },
  { emoji: '🧹', label: 'Brooms' },
  { emoji: '🧽', label: 'Carpet Brushes' },
]

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles = Array.from({ length: 50 }, () => ({
      x:  Math.random() * (canvas.width || 1000),
      y:  Math.random() * (canvas.height || 800),
      r:  Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.25,
      dy: (Math.random() - 0.5) * 0.25,
      opacity: Math.random() * 0.35 + 0.08,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(168, 218, 220, ${p.opacity})`
        ctx.fill()
        p.x = (p.x + p.dx + canvas.width)  % canvas.width
        p.y = (p.y + p.dy + canvas.height) % canvas.height
      }
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <section className="hero-bg relative min-h-[100svh] flex flex-col overflow-hidden">
      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} />

      {/* Ambient glow orbs */}
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />
      <div className="hero-orb hero-orb-3" />

      {/* ════ MAIN CONTENT ════ */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-6 pb-16 sm:pt-10 sm:pb-20">

          {/* Mobile: stacked | Desktop: side-by-side */}
          <div className="grid lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_480px] gap-8 sm:gap-10 lg:gap-6 items-center">

            {/* ── LEFT: TEXT CONTENT ── */}
            <div className="flex flex-col gap-5 sm:gap-6 order-2 lg:order-1">

              {/* Trust badge row */}
              <div className="fade-in flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase
                                 bg-[#F4D35E]/15 text-[#F4D35E] border border-[#F4D35E]/30">
                  <Star size={10} fill="currentColor" />
                  Trusted Since 2009
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold
                                 bg-[#A8DADC]/12 text-[#A8DADC] border border-[#A8DADC]/25">
                  <Sparkles size={10} />
                  Premium Cleaning Solutions
                </span>
              </div>

              {/* Headline */}
              <div className="fade-in-delay-1 text-center lg:text-left">
                <h1 className="text-[2.6rem] leading-[1.1] sm:text-5xl xl:text-6xl font-extrabold tracking-tight text-white">
                  Growing Together...
                  <br />
                  <span className="text-gradient-aqua">Empowering</span>{' '}
                  <span className="text-gradient-gold">Entrepreneurs...</span>
                </h1>
                <p className="mt-4 text-[15px] sm:text-lg text-white/60 leading-relaxed max-w-lg mx-auto lg:mx-0">
                  India&apos;s trusted cleaning chemicals brand — professional-grade formulas for homes,
                  businesses, and industries. Safe, effective, and eco-conscious.
                </p>
              </div>

              {/* CTA buttons */}
              <div className="fade-in-delay-2 flex flex-wrap justify-center lg:justify-start gap-3">
                <Link href="/products" className="btn-primary">
                  Shop Products <ArrowRight size={16} />
                </Link>
                <Link href="/request-quote" className="btn-ghost">
                  Get Bulk Quote
                </Link>
              </div>

              {/* Product category chips */}
              <div className="fade-in-delay-3 flex flex-wrap justify-center lg:justify-start gap-2">
                {FEATURES.map(f => (
                  <Link
                    key={f.label}
                    href={`/products?search=${encodeURIComponent(f.label)}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-medium
                               bg-white/06 border border-white/10 text-white/65
                               hover:bg-white/12 hover:text-white hover:border-[#A8DADC]/40
                               transition-all duration-200"
                  >
                    <span>{f.emoji}</span> {f.label}
                  </Link>
                ))}
              </div>

              {/* Stats mini-grid */}
              <div className="fade-in-delay-4 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {STATS.map(s => (
                  <div
                    key={s.label}
                    className="p-3 rounded-2xl bg-white/05 border border-white/08
                               hover:bg-white/09 hover:border-white/15 transition-all duration-200 cursor-default"
                  >
                    <p className="text-lg font-extrabold text-white leading-none">{s.value}</p>
                    <p className="text-[11px] font-bold text-[#A8DADC] mt-0.5">{s.label}</p>
                    <p className="text-[10px] text-white/40 leading-tight">{s.sub}</p>
                  </div>
                ))}
              </div>

              {/* Social proof mini strip */}
              <div className="fade-in-delay-4 flex items-center justify-center lg:justify-start gap-3 pt-1">
                <div className="flex -space-x-2">
                  {['#457B9D', '#A8DADC', '#F4D35E', '#7c9fc4'].map((c, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-[#0f1e3a] flex items-center justify-center text-[10px] font-bold text-white"
                      style={{ background: `linear-gradient(135deg, ${c}, rgba(255,255,255,0.3))` }}
                    >
                      {['R', 'A', 'S', 'K'][i]}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-white/50">
                  <span className="text-white font-semibold">50,000+</span> happy customers
                </p>
              </div>
            </div>

            {/* ── RIGHT: MASCOT ── */}
            <div className="relative flex items-end justify-center order-1 lg:order-2 slide-in-right">

              {/* Mascot stage — large circle glow platform */}
              <div className="relative">
                {/* Platform glow */}
                <div className="absolute -inset-8 rounded-full opacity-60"
                  style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 90%, rgba(69,123,157,0.5), transparent 70%)' }} />

                {/* Soft circular BG behind mascot */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#457B9D]/20 to-transparent blur-2xl" />

                {/* The actual mascot */}
                <div className="relative z-10 flex flex-col items-center">
                  <Image
                    src="/images/mascot.png"
                    alt="Rose Chemicals Expert — Your Cleaning Specialist"
                    width={420}
                    height={520}
                    priority
                    className="mascot-float w-[260px] sm:w-[320px] lg:w-[380px] xl:w-[420px]
                               object-contain object-bottom"
                    style={{ maxHeight: '520px' }}
                  />
                  {/* JOIN NOW Button below bucket */}
                  <div className="mt-[-25px] sm:mt-[-30px] z-30">
                    <Link href="/register" className="btn-primary !px-10 !py-3.5 rounded-full shadow-2xl hover:scale-105 transition-transform text-sm sm:text-base">
                      JOIN NOW
                    </Link>
                  </div>
                </div>

                {/* ── Floating Glass Cards ── */}

                {/* Card: ISO Badge — top left */}
                <div className="absolute left-0 top-10 z-20 -translate-x-1/4 lg:-translate-x-2/4 scale-90 sm:scale-100">
                  <div className="glass-card px-3 py-2 flex items-center gap-2.5 min-w-[120px] sm:min-w-[138px]">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#F4D35E] to-[#d4a800]
                                    flex items-center justify-center flex-shrink-0 text-sm sm:text-base shadow-lg">
                      🏅
                    </div>
                    <div>
                      <p className="text-white text-[11px] font-bold leading-tight">Premium Formula</p>
                      <p className="text-[#A8DADC] text-[9px] font-medium">Export Quality</p>
                    </div>
                  </div>
                </div>

                {/* Card: Franchise Options — right middle */}
                <div className="absolute right-0 top-1/4 z-20 translate-x-1/4 lg:translate-x-2/4 scale-90 sm:scale-100">
                  <div className="glass-card px-3 py-2 flex items-center gap-2.5 min-w-[120px] sm:min-w-[138px]">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#028090] to-[#00A896]
                                    flex items-center justify-center flex-shrink-0 text-sm sm:text-base shadow-lg">
                      🤝
                    </div>
                    <div>
                      <p className="text-white text-[11px] font-bold leading-tight">Franchise Options</p>
                      <p className="text-[#A8DADC] text-[9px] font-medium">Grow With Us</p>
                    </div>
                  </div>
                </div>

                {/* Card: Customers — bottom right */}
                <div className="absolute right-0 bottom-24 z-20 translate-x-1/6 lg:translate-x-1/2 scale-90 sm:scale-100">
                  <div className="glass-card px-3 py-2 flex items-center gap-2.5 min-w-[120px] sm:min-w-[138px]">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#a78bfa]
                                    flex items-center justify-center flex-shrink-0 text-sm sm:text-base shadow-lg">
                      ⭐
                    </div>
                    <div>
                      <p className="text-white text-[11px] font-bold leading-tight">50,000+ Clients</p>
                      <p className="text-[#A8DADC] text-[9px] font-medium">Pan-India Network</p>
                    </div>
                  </div>
                </div>

                {/* Name tag floating at mascot's head level */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-20">
                  <div className="glass px-4 py-1.5 rounded-full border border-[#A8DADC]/30 flex items-center gap-2">
                    <span className="text-[9px] font-bold text-[#A8DADC] tracking-widest uppercase">Meet Our Expert</span>
                    <span className="text-white text-[9px]">✨</span>
                  </div>
                </div>

                {/* Decorative sparkle dots */}
                {[
                  { top: '15%', left: '5%',  size: 8,  color: 'rgba(244,211,94,0.6)' },
                  { top: '60%', left: '2%',  size: 6,  color: 'rgba(168,218,220,0.5)' },
                  { top: '30%', right: '3%', size: 10, color: 'rgba(168,218,220,0.4)' },
                  { top: '75%', right: '6%', size: 6,  color: 'rgba(244,211,94,0.5)' },
                ].map((dot, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      width: dot.size, height: dot.size,
                      top: dot.top, left: (dot as any).left, right: (dot as any).right,
                      background: dot.color,
                      animation: `mascot-float ${5 + i}s ease-in-out infinite`,
                      animationDelay: `${i * 0.8}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll nudge */}
      <div className="relative z-10 flex justify-center pb-6 sm:pb-8">
        <a href="#products" className="flex flex-col items-center gap-1.5 text-white/30 hover:text-white/60 transition-colors">
          <span className="text-[10px] tracking-widest uppercase font-medium">Scroll to explore</span>
          <ChevronDown size={18} className="animate-bounce" />
        </a>
      </div>

      {/* Wave into light section */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none pointer-events-none" style={{ zIndex: 5 }}>
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-[50px] sm:h-[70px]">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#f0f7ff" />
        </svg>
      </div>
    </section>
  )
}
