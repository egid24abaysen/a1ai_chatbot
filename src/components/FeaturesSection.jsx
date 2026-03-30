import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const FEATURES = [
  {
    icon: '⚡',
    color: '#7c3aed',
    title: 'Blazing Fast Streaming',
    desc: 'Real-time token streaming via Groq\'s LPU inference. Watch thoughts materialize at 300-400 tokens per second.',
    badge: '400 tok/s'
  },
  {
    icon: '🎭',
    color: '#06b6d4',
    title: 'Persona Engine',
    desc: 'Switch between A1Ai ChatBot, Byte (sarcastic coder), Apex (motivational coach), and Sage (philosopher) instantly.',
    badge: '4 Personas'
  },
  {
    icon: '📊',
    color: '#10b981',
    title: 'Token Analytics',
    desc: 'Live tokens-per-second counter, response time tracking, and daily usage charts to visualize AI performance.',
    badge: 'Live Stats'
  },
  {
    icon: '✍️',
    color: '#f59e0b',
    title: 'Markdown Rendering',
    desc: 'Full markdown support with syntax-highlighted code blocks, tables, and rich formatting for complex responses.',
    badge: 'GFM'
  },
  {
    icon: '🔒',
    color: '#ec4899',
    title: 'Privacy First',
    desc: 'No backend, no data storage. All conversations stay in your browser. Keys stored locally, never transmitted.',
    badge: 'Local Only'
  },
  {
    icon: '🌐',
    color: '#8b5cf6',
    title: 'Multi-Model Support',
    desc: 'Switch between Llama 3.3 70B, Llama 3.1 8B Instant, and Mixtral 8x7B. All free via Groq Cloud.',
    badge: '3 Models'
  }
]

export default function FeaturesSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo('.features-title',
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: {
            trigger: '.features-title',
            start: 'top 80%',
          }
        }
      )

      // Cards stagger
      gsap.fromTo('.feature-card',
        { opacity: 0, y: 80, scale: 0.9 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.features-grid',
            start: 'top 75%',
          }
        }
      )

      // Horizontal scroll marquee for mobile-style effect
      gsap.to('.marquee-inner', {
        x: '-50%',
        duration: 20,
        ease: 'none',
        repeat: -1
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="features" className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="orb w-96 h-96 bg-violet-800 opacity-10 top-0 right-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="features-title text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs text-violet-400 font-mono mb-6">
            ◈ CAPABILITIES
          </div>
          <h2 className="text-5xl lg:text-6xl font-extrabold mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
            Built for the{' '}
            <span className="gradient-text">frontier</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Every feature is designed to make AI conversation feel effortless, powerful, and genuinely useful.
          </p>
        </div>

        {/* Feature grid */}
        <div className="features-grid grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="feature-card glass rounded-2xl p-7 group hover:border-violet-500/40 transition-all duration-300 cursor-default"
              style={{ '--accent': f.color }}
            >
              {/* Icon + badge */}
              <div className="flex items-start justify-between mb-5">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                  style={{ background: `${f.color}22`, border: `1px solid ${f.color}33` }}
                >
                  {f.icon}
                </div>
                <span
                  className="text-xs px-2.5 py-1 rounded-full font-mono"
                  style={{ background: `${f.color}22`, color: f.color, border: `1px solid ${f.color}44` }}
                >
                  {f.badge}
                </span>
              </div>

              <h3 className="text-lg font-bold mb-3 group-hover:text-white transition-colors" style={{ fontFamily: 'Syne, sans-serif' }}>
                {f.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>

              {/* Hover glow line */}
              <div
                className="mt-6 h-px w-0 group-hover:w-full transition-all duration-500"
                style={{ background: `linear-gradient(90deg, ${f.color}, transparent)` }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Marquee strip */}
      <div className="mt-24 overflow-hidden border-y border-white/5 py-4">
        <div className="marquee-inner flex gap-8 whitespace-nowrap">
          {Array(4).fill(['Llama 3.3 70B', 'Groq LPU', 'Real-Time Streaming', 'Persona Engine', 'Token Analytics', 'Markdown', 'Privacy First', 'Open Source']).flat().map((item, i) => (
            <span key={i} className="text-xs font-mono text-slate-600 uppercase tracking-widest flex items-center gap-2">
              <span className="text-violet-600">◆</span> {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
