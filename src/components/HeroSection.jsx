import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const DEMO_MESSAGES = [
  { role: 'user', text: 'Explain quantum entanglement' },
  { role: 'ai', text: 'Quantum entanglement is a phenomenon where two particles become correlated...', typing: true },
]

export default function HeroSection({ onOpenChat }) {
  const heroRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const ctaRef = useRef(null)
  const cardRef = useRef(null)
  const orbsRef = useRef([])
  const statsRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger entrance
      const tl = gsap.timeline({ delay: 0.8 })
      tl.fromTo('.hero-badge',
        { opacity: 0, y: 20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }
      )
      .fromTo(titleRef.current.querySelectorAll('.word'),
        { opacity: 0, y: 80, rotationX: -40 },
        { opacity: 1, y: 0, rotationX: 0, duration: 0.8, stagger: 0.08, ease: 'power4.out' }
      )
      .fromTo(subtitleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
        '-=0.4'
      )
      .fromTo(ctaRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' },
        '-=0.3'
      )
      .fromTo(cardRef.current,
        { opacity: 0, x: 60, rotationY: 15 },
        { opacity: 1, x: 0, rotationY: 0, duration: 1, ease: 'power3.out' },
        '-=0.6'
      )

      // Floating orbs
      orbsRef.current.forEach((orb, i) => {
        if (!orb) return
        gsap.to(orb, {
          y: `${-30 - i * 10}px`,
          x: `${(i % 2 === 0 ? 1 : -1) * 15}px`,
          duration: 4 + i * 0.8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.5
        })
      })

      // Stats count up
      gsap.fromTo('.stat-num',
        { textContent: 0 },
        {
          textContent: (i, el) => el.dataset.target,
          duration: 2,
          delay: 1.5,
          snap: { textContent: 1 },
          ease: 'power2.out',
          onUpdate: function() {
            document.querySelectorAll('.stat-num').forEach(el => {
              el.textContent = Math.round(parseFloat(el.textContent)).toLocaleString() + (el.dataset.suffix || '')
            })
          }
        }
      )

      // Hero card 3D tilt on mouse
      const card = cardRef.current
      const handleMouseMove = (e) => {
        const rect = card.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width - 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5
        gsap.to(card, {
          rotationY: x * 12,
          rotationX: -y * 8,
          duration: 0.3,
          ease: 'power2.out',
          transformPerspective: 1000
        })
      }
      const handleMouseLeave = () => {
        gsap.to(card, { rotationY: 0, rotationX: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' })
      }
      card.addEventListener('mousemove', handleMouseMove)
      card.addEventListener('mouseleave', handleMouseLeave)

      // Scroll parallax
      gsap.to('.hero-content', {
        y: -60,
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      })

      return () => {
        card.removeEventListener('mousemove', handleMouseMove)
        card.removeEventListener('mouseleave', handleMouseLeave)
      }
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center grid-bg overflow-hidden pt-24">
      {/* Orbs */}
      <div ref={el => orbsRef.current[0] = el} className="orb w-96 h-96 bg-violet-600 top-20 -left-20" />
      <div ref={el => orbsRef.current[1] = el} className="orb w-80 h-80 bg-cyan-500 bottom-20 right-0" />
      <div ref={el => orbsRef.current[2] = el} className="orb w-64 h-64 bg-emerald-500 top-1/2 left-1/2" style={{ opacity: 0.15 }} />

      <div className="hero-content max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Left: Text */}
        <div>
          <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 text-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-mono">Powered by Groq • Llama 3.3 70B</span>
          </div>

          <h1
            ref={titleRef}
            className="text-6xl lg:text-7xl font-extrabold leading-tight mb-6"
            style={{ fontFamily: 'Syne, sans-serif', perspective: '1000px' }}
          >
            <div style={{ overflow: 'hidden' }}>
              <span className="word inline-block">Think.</span>
            </div>
            <div style={{ overflow: 'hidden' }}>
              <span className="word inline-block gradient-text">Create.</span>
            </div>
            <div style={{ overflow: 'hidden' }}>
              <span className="word inline-block">Transcend.</span>
            </div>
          </h1>

          <p ref={subtitleRef} className="text-lg text-slate-400 leading-relaxed mb-10 max-w-lg">
            a1ai ChatBot is your AI-powered intelligence interface. Switch personas, stream responses in real-time, and explore ideas at the speed of thought.
          </p>

          <div ref={ctaRef} className="flex flex-wrap gap-4">
            <button
              onClick={onOpenChat}
              className="btn-glow relative px-8 py-4 rounded-2xl font-semibold text-base bg-violet-700 hover:bg-violet-600 transition-colors duration-200 group"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Chatting
                <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
              </span>
            </button>
            <a
              href="#features"
              className="px-8 py-4 rounded-2xl font-semibold text-base glass hover:bg-white/5 transition-all duration-200 text-slate-300"
            >
              See Features
            </a>
          </div>

          {/* Stats */}
          <div ref={statsRef} className="flex gap-10 mt-14 pt-10 border-t border-white/5">
            {[
              { label: 'Tokens/sec', target: 400, suffix: '+' },
              { label: 'Free RPM', target: 30, suffix: '' },
              { label: 'Personas', target: 4, suffix: '' },
            ].map(stat => (
              <div key={stat.label}>
                <div className="stat-number text-3xl font-bold gradient-text-violet">
                  <span className="stat-num" data-target={stat.target} data-suffix={stat.suffix}>0</span>
                </div>
                <div className="text-xs text-slate-500 mt-1 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Chat Preview Card */}
        <div ref={cardRef} className="hero-card relative">
          {/* Glow behind card */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-cyan-500/20 rounded-3xl blur-xl transform scale-95" />

          <div className="relative glass rounded-3xl p-6 scanlines">
            {/* Card header */}
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-900 flex items-center justify-center text-lg">
                    🤖
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0a1628]" />
                </div>
                <div>
                  <div className="font-semibold text-sm">A1Ai ChatBot</div>
                  <div className="text-xs text-emerald-400 font-mono">online • streaming</div>
                </div>
              </div>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
              </div>
            </div>

            {/* Messages */}
            <div className="space-y-4">
              <div className="flex justify-end">
                <div className="bg-violet-600/30 border border-violet-500/30 rounded-2xl rounded-tr-sm px-4 py-3 text-sm max-w-xs">
                  Explain quantum entanglement in simple terms
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-purple-900 flex items-center justify-center text-xs flex-shrink-0">
                  🤖
                </div>
                <div className="glass rounded-2xl rounded-tl-sm px-4 py-3 text-sm max-w-xs text-slate-300">
                  <span className="text-violet-300 font-semibold">Quantum entanglement</span> occurs when two particles become correlated — measuring one instantly affects the other, regardless of distance.
                  <span className="inline-block w-0.5 h-4 bg-violet-400 ml-1 animate-pulse align-middle" />
                </div>
              </div>

              {/* Token stats */}
              <div className="flex items-center gap-3 pt-2 text-xs text-slate-500 font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  342 tok/s
                </span>
                <span>•</span>
                <span>llama-3.3-70b</span>
                <span>•</span>
                <span className="text-emerald-400">0.84s</span>
              </div>
            </div>

            {/* Input bar */}
            <div className="mt-5 flex items-center gap-3 glass rounded-2xl px-4 py-3">
              <span className="text-slate-500 text-sm flex-1">Ask anything...</span>
              <button
                onClick={onOpenChat}
                className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center hover:bg-violet-500 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 text-xs animate-bounce">
        <span>scroll</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </section>
  )
}
