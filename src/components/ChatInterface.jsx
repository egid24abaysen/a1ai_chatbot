import { useState, useRef, useEffect, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { streamGroqResponse, PERSONAS, MODELS } from '../utils/groq'
import { gsap } from 'gsap'

function TypingIndicator({ persona }) {
  return (
    <div className="flex items-end gap-3 msg-enter">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
        style={{ background: `${persona.color}33`, border: `1px solid ${persona.color}44` }}>
        {persona.emoji}
      </div>
      <div className="glass rounded-2xl rounded-bl-sm px-5 py-4">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-violet-400 typing-dot" />
          <div className="w-2 h-2 rounded-full bg-violet-400 typing-dot" />
          <div className="w-2 h-2 rounded-full bg-violet-400 typing-dot" />
        </div>
      </div>
    </div>
  )
}

function Message({ msg, persona, onCopy }) {
  const isUser = msg.role === 'user'
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    onCopy?.()
  }

  return (
    <div className={`flex items-end gap-3 msg-enter ${isUser ? 'flex-row-reverse' : ''}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
          style={{ background: `${persona.color}33`, border: `1px solid ${persona.color}44` }}>
          {persona.emoji}
        </div>
      )}

      <div className={`max-w-[75%] group relative ${isUser ? 'ml-auto' : ''}`}>
        <div className={`rounded-2xl px-5 py-3.5 text-sm ${isUser
          ? 'bg-violet-600/30 border border-violet-500/30 text-white rounded-tr-sm'
          : 'glass text-slate-200 rounded-bl-sm'
        }`}>
          {isUser ? (
            <p className="leading-relaxed">{msg.content}</p>
          ) : (
            <div className="prose-chat">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
              {msg.streaming && (
                <span className="inline-block w-0.5 h-4 bg-violet-400 ml-0.5 animate-pulse align-middle" />
              )}
            </div>
          )}
        </div>

        {/* Copy button + metadata */}
        {!msg.streaming && (
          <div className={`flex items-center gap-2 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity ${isUser ? 'justify-end' : 'justify-start'}`}>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors px-2 py-0.5 rounded"
            >
              {copied ? '✓ copied' : '⎘ copy'}
            </button>
            {msg.meta && (
              <span className="text-xs font-mono text-slate-600">
                {msg.meta.tps} tok/s • {msg.meta.tokens} tokens
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ChatInterface({ isOpen, onClose }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [persona, setPersona] = useState(PERSONAS.assistant)
  const [model, setModel] = useState(MODELS[0].id)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({ totalTokens: 0, totalMessages: 0, avgTps: 0 })
  const [showStats, setShowStats] = useState(false)
  const [sessionTps, setSessionTps] = useState([])

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const modalRef = useRef(null)
  const overlayRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(scrollToBottom, [messages])

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 })
      gsap.fromTo(modalRef.current, { y: 40, opacity: 0, scale: 0.97 }, { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' })
      setTimeout(() => inputRef.current?.focus(), 400)
    }
  }, [isOpen])

  const handleClose = () => {
    gsap.to(modalRef.current, { y: 30, opacity: 0, scale: 0.97, duration: 0.3, ease: 'power2.in' })
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, onComplete: onClose })
  }

  const sendMessage = useCallback(async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setError(null)

    const newMessages = [...messages, { role: 'user', content: userMsg, id: Date.now() }]
    setMessages(newMessages)
    setLoading(true)

    const aiMsgId = Date.now() + 1
    setMessages(prev => [...prev, { role: 'assistant', content: '', streaming: true, id: aiMsgId }])

    const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }))

    await streamGroqResponse(
      apiMessages,
      persona,
      model,
      (text) => {
        setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, content: text } : m))
      },
      (text, meta) => {
        setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, content: text, streaming: false, meta } : m))
        setLoading(false)
        setStats(prev => ({
          totalTokens: prev.totalTokens + meta.tokens,
          totalMessages: prev.totalMessages + 1,
          avgTps: Math.round((prev.avgTps * prev.totalMessages + meta.tps) / (prev.totalMessages + 1))
        }))
        setSessionTps(prev => [...prev.slice(-9), meta.tps])
      },
      (err) => {
        setError(err)
        setLoading(false)
        setMessages(prev => prev.filter(m => m.id !== aiMsgId))
      }
    )
  }, [input, loading, messages, persona, model])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => {
    setMessages([])
    setStats({ totalTokens: 0, totalMessages: 0, avgTps: 0 })
    setSessionTps([])
  }

  if (!isOpen) return null

  const maxTps = Math.max(...sessionTps, 1)

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(2, 4, 8, 0.85)', backdropFilter: 'blur(12px)' }}
    >
      <div
        ref={modalRef}
        className="w-full max-w-3xl h-[90vh] max-h-[800px] flex flex-col glass rounded-3xl overflow-hidden"
        style={{ border: '1px solid rgba(124, 58, 237, 0.2)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl transition-all duration-300"
              style={{ background: `${persona.color}33`, border: `1px solid ${persona.color}44` }}>
              {persona.emoji}
            </div>
            <div>
              <div className="font-bold text-sm" style={{ fontFamily: 'Syne, sans-serif' }}>{persona.name}</div>
              <div className="text-xs font-mono" style={{ color: persona.color }}>{persona.description}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Model selector */}
            <select
              value={model}
              onChange={e => setModel(e.target.value)}
              className="text-xs font-mono bg-transparent border border-white/10 rounded-lg px-2 py-1.5 text-slate-400 focus:outline-none focus:border-violet-500"
            >
              {MODELS.map(m => (
                <option key={m.id} value={m.id} style={{ background: '#0a1628' }}>{m.name}</option>
              ))}
            </select>

            {/* Stats toggle */}
            <button
              onClick={() => setShowStats(!showStats)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${showStats ? 'bg-violet-600/30 text-violet-300' : 'text-slate-500 hover:text-slate-300'}`}
            >
              📊
            </button>

            {/* Clear */}
            <button
              onClick={clearChat}
              className="px-3 py-1.5 rounded-lg text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors"
              title="Clear chat"
            >
              ↺
            </button>

            {/* Close */}
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Persona switcher */}
        <div className="flex gap-2 px-6 py-3 border-b border-white/5 overflow-x-auto flex-shrink-0">
          {Object.values(PERSONAS).map(p => (
            <button
              key={p.id}
              onClick={() => setPersona(p)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${persona.id === p.id ? 'text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
              style={persona.id === p.id ? { background: `${p.color}33`, border: `1px solid ${p.color}44`, color: p.color } : {}}
            >
              <span>{p.emoji}</span> {p.name}
            </button>
          ))}
        </div>

        {/* Stats panel */}
        {showStats && (
          <div className="px-6 py-4 border-b border-white/5 bg-black/20 flex-shrink-0">
            <div className="flex items-start gap-8">
              {/* Counters */}
              <div className="flex gap-6">
                {[
                  { label: 'Total Tokens', value: stats.totalTokens.toLocaleString() },
                  { label: 'Messages', value: stats.totalMessages },
                  { label: 'Avg tok/s', value: stats.avgTps },
                ].map(s => (
                  <div key={s.label}>
                    <div className="text-lg font-bold gradient-text-violet font-mono">{s.value}</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* TPS sparkline */}
              {sessionTps.length > 1 && (
                <div className="flex-1">
                  <div className="text-xs text-slate-500 mb-2 uppercase tracking-wide">Tokens/sec history</div>
                  <div className="flex items-end gap-1 h-8">
                    {sessionTps.map((tps, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm transition-all duration-300"
                        style={{
                          height: `${(tps / maxTps) * 100}%`,
                          background: `rgba(124, 58, 237, ${0.4 + (tps / maxTps) * 0.6})`,
                          minHeight: '4px'
                        }}
                        title={`${tps} tok/s`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto chat-scroll px-6 py-6 space-y-6">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="text-5xl mb-4">{persona.emoji}</div>
              <div className="font-bold text-lg mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
                {persona.name} is ready
              </div>
              <p className="text-sm text-slate-500 max-w-xs">{persona.description} — start typing below</p>
              {/* Suggestion chips */}
              <div className="flex flex-wrap gap-2 mt-6 justify-center">
                {getPersonaSuggestions(persona.id).map(s => (
                  <button
                    key={s}
                    onClick={() => setInput(s)}
                    className="text-xs px-3 py-2 rounded-xl glass hover:border-violet-500/30 transition-all text-slate-400 hover:text-slate-200"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map(msg => (
            <Message key={msg.id} msg={msg} persona={persona} />
          ))}

          {loading && messages[messages.length - 1]?.streaming === false && (
            <TypingIndicator persona={persona} />
          )}

          {error && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-300">
              <span>⚠</span> {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-t border-white/5 flex-shrink-0">
          <div className="flex items-end gap-3 glass rounded-2xl p-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${persona.name}...`}
              rows={1}
              disabled={loading}
              className="flex-1 bg-transparent resize-none outline-none text-sm text-slate-200 placeholder-slate-600 px-3 py-2 max-h-32 overflow-y-auto"
              style={{ minHeight: '40px' }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 flex-shrink-0"
              style={{
                background: input.trim() && !loading ? persona.color : 'rgba(255,255,255,0.05)',
                opacity: !input.trim() || loading ? 0.5 : 1
              }}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              )}
            </button>
          </div>
          <p className="text-center text-xs text-slate-600 mt-2 font-mono">
            ↵ send • shift+↵ newline • powered by groq
          </p>
        </div>
      </div>
    </div>
  )
}

function getPersonaSuggestions(personaId) {
  const suggestions = {
    assistant: ['Explain quantum computing', 'Write a haiku about AI', 'What is consciousness?'],
    coder: ['Review my React code', 'Why is my CSS broken?', 'Explain async/await'],
    coach: ['I need motivation', 'Help me set a goal', 'How do I build habits?'],
    philosopher: ['What is the nature of time?', 'Do we have free will?', 'What is beauty?']
  }
  return suggestions[personaId] || suggestions.assistant
}
