import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

export default function Navigation({ onOpenChat }) {
  const navRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    // Animate nav in
    gsap.fromTo(navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.5 }
    )

    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'nav-blur' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-sm font-bold">
              A
            </div>
            <div className="absolute -inset-1 bg-gradient-to-br from-violet-600 to-cyan-500 rounded-xl opacity-30 blur-sm" />
          </div>
          <span className="font-bold text-lg tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
            a1ai Chat<span className="text-violet-400">Bot</span>
          </span>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
          {['Features', 'Personas', 'About'].map(item => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="hover:text-white transition-colors duration-200 relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-violet-400 group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={onOpenChat}
          className="btn-glow relative px-5 py-2 rounded-xl font-medium text-sm bg-[#0a1628] hover:bg-violet-950 transition-colors duration-200"
        >
          Launch Chat →
        </button>
      </div>
    </nav>
  )
}
