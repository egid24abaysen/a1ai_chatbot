// Groq API integration with streaming
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || ''
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

export const PERSONAS = {
  assistant: {
    id: 'assistant',
    name: 'Neural',
    emoji: '🤖',
    color: '#7c3aed',
    description: 'General AI Assistant',
    systemPrompt: 'You are Neural, a highly intelligent AI assistant. Be helpful, precise, and insightful. Use markdown formatting for better readability.'
  },
  coder: {
    id: 'coder',
    name: 'Byte',
    emoji: '💻',
    color: '#06b6d4',
    description: 'Sarcastic Code Genius',
    systemPrompt: 'You are Byte, a sarcastic but brilliant coding assistant. You love pointing out inefficiencies in code but always provide working solutions. Use dark humor sparingly. Format code with proper markdown code blocks.'
  },
  coach: {
    id: 'coach',
    name: 'Apex',
    emoji: '🔥',
    color: '#10b981',
    description: 'Motivational Life Coach',
    systemPrompt: 'You are Apex, an intense motivational coach who speaks with energy and purpose. Use powerful action words, short punchy sentences, and push the user to achieve greatness. Occasionally use ALL CAPS for emphasis.'
  },
  philosopher: {
    id: 'philosopher',
    name: 'Sage',
    emoji: '🌌',
    color: '#f59e0b',
    description: 'Deep Thinker & Philosopher',
    systemPrompt: 'You are Sage, a philosophical AI who explores ideas deeply. Ask thought-provoking questions, reference great thinkers, and help users see multiple perspectives. Use poetic language and metaphors.'
  }
}

export const MODELS = [
  { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B', speed: 'Fast' },
  { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B', speed: 'Blazing' },
  { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', speed: 'Smart' },
]

export async function streamGroqResponse(messages, persona, model, onChunk, onDone, onError) {
  const systemMessage = {
    role: 'system',
    content: persona.systemPrompt
  }

  if (!GROQ_API_KEY) {
    onError('Missing `VITE_GROQ_API_KEY`. Add it to your local `.env` file.')
    return
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: model,
        messages: [systemMessage, ...messages],
        stream: true,
        max_tokens: 1024,
        temperature: 0.8
      })
    })

    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.error?.message || 'API Error')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let fullText = ''
    let tokenCount = 0
    const startTime = Date.now()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n').filter(line => line.startsWith('data: '))

      for (const line of lines) {
        const data = line.slice(6)
        if (data === '[DONE]') continue
        try {
          const parsed = JSON.parse(data)
          const delta = parsed.choices?.[0]?.delta?.content || ''
          if (delta) {
            fullText += delta
            tokenCount++
            onChunk(fullText)
          }
        } catch {}
      }
    }

    const elapsed = (Date.now() - startTime) / 1000
    const tps = Math.round(tokenCount / elapsed)
    onDone(fullText, { tokens: tokenCount, tps, model })
  } catch (err) {
    onError(err.message)
  }
}
