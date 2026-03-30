import { useState } from 'react'
import ParticleCanvas from './components/ParticleCanvas'
import CustomCursor from './components/CustomCursor'
import Navigation from './components/Navigation'
import HeroSection from './components/HeroSection'
import FeaturesSection from './components/FeaturesSection'
import PersonasSection from './components/PersonasSection'
import CTASection from './components/CTASection'
import ChatInterface from './components/ChatInterface'

export default function App() {
  const [chatOpen, setChatOpen] = useState(false)

  return (
    <div className="relative min-h-screen" style={{ background: 'var(--bg-void)' }}>
      {/* Background layer */}
      <ParticleCanvas />
      <CustomCursor />

      {/* Content layer */}
      <div className="relative z-10">
        <Navigation onOpenChat={() => setChatOpen(true)} />
        <HeroSection onOpenChat={() => setChatOpen(true)} />
        <FeaturesSection />
        <PersonasSection onOpenChat={() => setChatOpen(true)} />
        <CTASection onOpenChat={() => setChatOpen(true)} />
      </div>

      {/* Chat overlay */}
      <ChatInterface
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
      />
    </div>
  )
}
