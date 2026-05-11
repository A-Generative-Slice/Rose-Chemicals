"use client"

import Link from 'next/link'
import { ArrowRight, Sparkles, Shield, Leaf, Award, ChevronDown } from 'lucide-react'
import { useEffect, useRef } from 'react'

const STATS = [
  { icon: <Award size={15} />, value: '15+', label: 'Years Experience' },
  { icon: <Shield size={15} />, value: 'ISO Certified', label: 'Quality Assured' },
  { icon: <Sparkles size={15} />, value: '50K+', label: 'Happy Customers' },
  { icon: <Leaf size={15} />,  value: 'Eco-Safe', label: 'Formulations' },
]

const FEATURES = [
  { emoji: '🧴', label: 'Floor Cleaners' },
  { emoji: '🚿', label: 'Bathroom Care' },
  { emoji: '🍽️', label: 'Kitchen Solutions' },
  { emoji: '🏭', label: 'Industrial Grade' },
  { emoji: '🌿', label: 'Eco Friendly' },
  { emoji: '🛡️', label: 'Disinfectants' },
]

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Animated particle dots in background
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

    const PARTICLE_COUNT = 40
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      r:  Math.random() * 2.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.4 + 0.1,
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

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <section className="hero-bg relative min-h-screen flex flex-col">
      {/* Canvas particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* Floating orbs */}
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />
      <div className="hero-orb hero-orb-3" />

      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 sm:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

            {/* ── LEFT COLUMN: Text ── */}
            <div className="flex flex-col gap-6 sm:gap-8">

              {/* Pill badge */}
              <div className="fade-in">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase
                                 bg-[#A8DADC]/15 text-[#A8DADC] border border-[#A8DADC]/25">
                  <Sparkles size={12} />
                  Premium Cleaning Solutions Since 2009
                </span>
              </div>

              {/* Headline */}
              <div className="fade-in-delay-1">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] text-white tracking-tight">
                  Clean Spaces,{' '}
                  <br className="hidden sm:block" />
                  <span className="text-gradient-aqua">Brighter</span>{' '}
                  <span className="text-gradient-gold">Tomorrow</span>
                </h1>
                <p className="mt-5 text-base sm:text-lg text-white/65 leading-relaxed max-w-lg">
                  Trusted by homes &amp; industries across India. Our premium cleaning chemicals deliver
                  professional-grade results — safe, effective, and eco-conscious.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="fade-in-delay-2 flex flex-wrap gap-3 sm:gap-4">
                <Link href="/products" className="btn-primary">
                  Explore Products <ArrowRight size={16} />
                </Link>
                <Link href="/request-quote" className="btn-ghost">
                  Get a Quote
                </Link>
              </div>

              {/* Feature chips */}
              <div className="fade-in-delay-3 flex flex-wrap gap-2">
                {FEATURES.map(f => (
                  <span
                    key={f.label}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                               bg-white/08 border border-white/12 text-white/70 hover:text-white hover:border-white/25
                               transition-all duration-200 cursor-default"
                  >
                    <span>{f.emoji}</span> {f.label}
                  </span>
                ))}
              </div>

              {/* Stats row */}
              <div className="fade-in-delay-4 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {STATS.map(s => (
                  <div
                    key={s.label}
                    className="flex flex-col gap-1 p-3 rounded-xl bg-white/06 border border-white/10
                               hover:bg-white/10 hover:border-white/20 transition-all duration-200 cursor-default"
                  >
                    <div className="flex items-center gap-2 text-[#A8DADC]">
                      {s.icon}
                      <span className="text-sm font-bold text-white">{s.value}</span>
                    </div>
                    <span className="text-[11px] text-white/50 leading-tight">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT COLUMN: Mascot + Floating Cards ── */}
            <div className="relative flex items-center justify-center lg:justify-end slide-in-right">

              {/* Main mascot container */}
              <div className="relative w-[280px] sm:w-[340px] lg:w-[400px] aspect-square">

                {/* Glow ring */}
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-[#457B9D]/30 to-[#A8DADC]/20
                                blur-3xl animate-pulse" />

                {/* Mascot image */}
                <img
                  src="/mascot.png"
                  alt="Rosie - Rose Chemicals Mascot"
                  className="mascot-bubble relative z-10 w-full h-full object-contain"
                />

                {/* Mascot name badge */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20">
                  <div className="glass px-4 py-2 rounded-full text-center">
                    <p className="text-xs font-bold text-white tracking-wide">Meet Rosie!</p>
                    <p className="text-[10px] text-[#A8DADC]">Your Cleaning Expert</p>
                  </div>
                </div>

                {/* ── Floating Info Cards ── */}

                {/* Card 1 – top left */}
                <div className="absolute -left-4 sm:-left-10 top-8 z-20">
                  <div className="glass-card px-4 py-3 flex items-center gap-3 min-w-[140px]">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#F4D35E] to-[#f0c330] flex items-center justify-center text-lg flex-shrink-0">
                      ✨
                    </div>
                    <div>
                      <p className="text-white text-xs font-bold leading-tight">Trusted Quality</p>
                      <p className="text-[#A8DADC] text-[10px]">ISO 9001:2015</p>
                    </div>
                  </div>
                </div>

                {/* Card 2 – right middle */}
                <div className="absolute -right-4 sm:-right-8 top-1/3 z-20">
                  <div className="glass-card px-4 py-3 flex items-center gap-3 min-w-[150px]">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#457B9D] to-[#A8DADC] flex items-center justify-center text-lg flex-shrink-0">
                      🌿
                    </div>
                    <div>
                      <p className="text-white text-xs font-bold leading-tight">Eco Safe</p>
                      <p className="text-[#A8DADC] text-[10px]">Green Certified</p>
                    </div>
                  </div>
                </div>

                {/* Card 3 – bottom right */}
                <div className="absolute -right-2 sm:-right-6 bottom-16 z-20">
                  <div className="glass-card px-4 py-3 flex items-center gap-3 min-w-[140px]">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E63946] to-[#ff6b7a] flex items-center justify-center text-lg flex-shrink-0">
                      🏆
                    </div>
                    <div>
                      <p className="text-white text-xs font-bold leading-tight">50,000+</p>
                      <p className="text-[#A8DADC] text-[10px]">Happy Customers</p>
                    </div>
                  </div>
                </div>

                {/* Decorative small dots */}
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full bg-[#A8DADC]/30"
                    style={{
                      width:  `${6 + i * 3}px`,
                      height: `${6 + i * 3}px`,
                      top:    `${10 + i * 15}%`,
                      right:  i % 2 === 0 ? `${-5 + i}%` : 'auto',
                      left:   i % 2 !== 0 ? `${-5 + i}%` : 'auto',
                      animationDelay: `${i * 0.5}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="relative z-10 flex justify-center pb-8">
        <a href="#products" className="flex flex-col items-center gap-2 text-white/40 hover:text-white/70 transition-colors group">
          <span className="text-xs tracking-widest uppercase">Explore</span>
          <ChevronDown size={20} className="animate-bounce" />
        </a>
      </div>

      {/* Bottom wave into next section */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none pointer-events-none" style={{ zIndex: 5 }}>
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-[60px] sm:h-[80px]">
          <path
            d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z"
            fill="rgba(240,247,255,1)"
          />
        </svg>
      </div>
    </section>
  )
}
