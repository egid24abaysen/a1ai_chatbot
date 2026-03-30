import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PERSONAS } from '../utils/groq'

gsap.registerPlugin(ScrollTrigger)

const PERSONA_DEMOS = {
  assistant: "Hello! I'm A1Ai ChatBot, your intelligent AI companion. I can help you understand complex topics, write code, analyze data, or simply have a thoughtful conversation. What shall we explore today?",
  coder: "Oh great, another dev who needs help. Fine. I'll look at your spaghetti code and *sigh* fix it properly. But seriously, have you tried console.log debugging? ...Actually, let me just show you the RIGHT way to do this.",
  coach: "LISTEN UP! Today is NOT just another day — it's YOUR day to BREAKTHROUGH! Every challenge is just an opportunity wearing a disguise. What goal are we CRUSHING today?!",
  philosopher: "The question itself contains multitudes... To understand something, must we not first question what it means to understand? As Socrates knew, wisdom begins with acknowledging our ignorance. What truth are you seeking?"
}

export default function PersonasSection({ onOpenChat }) {
  const sectionRef = useRef(null)
  const [active, setActive] = useState('assistant')

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.personas-title',
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 0.8,
          scrollTrigger: { trigger: '.personas-title', start: 'top 80%' }
        }
      )
      gsap.fromTo('.persona-card-anim',
        { opacity: 0, x: -40 },
        {
          opacity: 1, x: 0, duration: 0.6, stagger: 0.12,
          scrollTrigger: { trigger: '.persona-list', start: 'top 75%' }
        }
      )
      gsap.fromTo('.persona-preview',
        { opacity: 0, x: 40 },
        {
          opacity: 1, x: 0, duration: 0.8,
          scrollTrigger: { trigger: '.persona-preview', start: 'top 75%' }
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const currentPersona = PERSONAS[active]

  return (
    <section ref={sectionRef} id="personas" className="py-32 relative overflow-hidden">
      <div className="orb w-80 h-80 bg-cyan-600 opacity-10 bottom-0 left-0" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="personas-title text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs text-cyan-400 font-mono mb-6">
            ◈ PERSONAS
          </div>
          <h2 className="text-5xl lg:text-6xl font-extrabold mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
            One AI,{' '}
            <span className="gradient-text">infinite voices</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Each persona has a unique personality, communication style, and area of expertise.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Persona list */}
          <div className="persona-list space-y-4">
            {Object.values(PERSONAS).map(persona => (
              <button
                key={persona.id}
                onClick={() => setActive(persona.id)}
                className={`persona-card-anim w-full text-left glass rounded-2xl p-5 transition-all duration-300 group ${active === persona.id ? 'border-violet-500/50 bg-violet-950/30' : 'hover:border-white/10'}`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background: active === persona.id ? `${persona.color}33` : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${active === persona.id ? persona.color + '66' : 'rgba(255,255,255,0.05)'}`
                    }}
                  >
                    {persona.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>{persona.name}</span>
                      {active === persona.id && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-mono" style={{ background: `${persona.color}33`, color: persona.color }}>
                          active
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-slate-400 mt-0.5">{persona.description}</div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${active === persona.id ? 'border-violet-400' : 'border-white/10'}`}>
                    {active === persona.id && <div className="w-2 h-2 rounded-full bg-violet-400" />}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Preview */}
          <div className="persona-preview relative">
            <div className="absolute inset-0 rounded-3xl blur-xl opacity-20 transition-all duration-500"
              style={{ background: `radial-gradient(circle, ${currentPersona.color}, transparent)` }} />

            <div className="relative glass rounded-3xl p-7">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6 pb-5 border-b border-white/5">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                  style={{ background: `${currentPersona.color}33`, border: `1px solid ${currentPersona.color}44` }}>
                  {currentPersona.emoji}
                </div>
                <div>
                  <div className="font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>{currentPersona.name}</div>
                  <div className="text-xs font-mono" style={{ color: currentPersona.color }}>{currentPersona.description}</div>
                </div>
                <div className="ml-auto flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-emerald-400 font-mono">live</span>
                </div>
              </div>

              {/* Sample message */}
              <div className="text-sm text-slate-300 leading-relaxed bg-white/3 rounded-2xl p-5 border border-white/5">
                <div className="flex gap-3">
                  <span className="text-xl flex-shrink-0">{currentPersona.emoji}</span>
                  <p>{PERSONA_DEMOS[active]}</p>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={onOpenChat}
                className="mt-6 w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-90"
                style={{ background: `${currentPersona.color}`, color: 'white' }}
              >
                Chat with {currentPersona.name} →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
