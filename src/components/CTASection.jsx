import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function CTASection({ onOpenChat }) {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.cta-content',
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: '.cta-content', start: 'top 80%' }
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="about" className="py-32 relative overflow-hidden">
      {/* Big orbs */}
      <div className="orb w-[600px] h-[600px] bg-violet-700 opacity-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-4xl mx-auto px-6 text-center cta-content">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs text-violet-400 font-mono mb-10">
          ◈ READY TO START
        </div>

        <h2 className="text-6xl lg:text-7xl font-extrabold mb-8 leading-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
          Your AI. Your{' '}
          <span className="gradient-text">rules.</span>
        </h2>

        <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          No signup required. No credit card. Just pure, blazing-fast AI conversation powered by the world's fastest inference engine.
        </p>

        <button
          onClick={onOpenChat}
          className="btn-glow relative px-12 py-5 rounded-2xl font-bold text-xl bg-violet-700 hover:bg-violet-600 transition-colors duration-200 group inline-flex items-center gap-3"
        >
          a1ai ChatChat
          <span className="text-2xl group-hover:translate-x-1 transition-transform duration-200">→</span>
        </button>

        <div className="flex items-center justify-center gap-6 mt-10 text-sm text-slate-500">
          {['Free forever', 'No account needed', 'Open source'].map((item, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span> {item}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto px-6 mt-24 pt-10 border-t border-white/5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="text-lg">🤖</span>
            <span style={{ fontFamily: 'Syne, sans-serif' }}>A1Ai ChatBot</span>
            <span>—</span>
            <span>Built with Groq + Llama 3.3</span>
          </div>
          <div className="text-xs text-slate-600 font-mono">
            Free API • No backend • Privacy first
          </div>
        </div>
      </div>
    </section>
  )
}
