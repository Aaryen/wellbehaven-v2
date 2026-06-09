'use client'

import { useState, useEffect, useRef } from 'react'
import ChatInput from '@/components/chat/ChatInput'
import TypingIndicator from '@/components/chat/TypingIndicator'
import { Heart, Trash2 } from 'lucide-react'

interface HavenMessage {
  role: 'user' | 'assistant'
  content: string
}

const SYSTEM_PROMPT = `You are Haven, a warm and empathetic AI companion. You are not a therapist, doctor, or crisis service.

Your purpose is to:
- Create a safe, judgment-free space for someone to process their emotions
- Listen deeply and reflect back what you hear
- Ask gentle, thoughtful questions that help people explore their feelings
- Offer comfort without toxic positivity
- Validate that difficult emotions are normal and human
- Keep responses warm, concise (2–4 sentences), and conversational
- Never give medical advice, diagnoses, or tell people what to do
- Guide people gently toward their own insights

If someone expresses thoughts of self-harm or crisis, say warmly:
"I hear you, and I want you to be safe. Please reach out to the 988 Suicide & Crisis Lifeline by calling or texting 988 — they're there for you right now."`

const GREETING = "Hello. I'm Haven — a quiet space just for you. What's on your heart today?"

export default function HavenPage() {
  const [messages, setMessages] = useState<HavenMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [ready, setReady] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stored = localStorage.getItem('haven-conversation')
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as HavenMessage[]
        setMessages(parsed)
        setReady(true)
        return
      } catch {
        // ignore parse error
      }
    }
    // First visit: show greeting after short delay
    setIsTyping(true)
    const t = setTimeout(() => {
      setMessages([{ role: 'assistant', content: GREETING }])
      setIsTyping(false)
      setReady(true)
    }, 700)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!ready) return
    localStorage.setItem('haven-conversation', JSON.stringify(messages))
  }, [messages, ready])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  async function sendMessage(content: string) {
    const updated: HavenMessage[] = [...messages, { role: 'user', content }]
    setMessages(updated)
    setIsTyping(true)

    try {
      // Anthropic requires the first message to have role 'user'.
      // The greeting is a synthetic assistant message — drop everything before
      // the first user turn so the API payload always starts with 'user'.
      const firstUserIdx = updated.findIndex((m) => m.role === 'user')
      const apiMessages = firstUserIdx >= 0 ? updated.slice(firstUserIdx) : updated

      const res = await fetch('/api/haven', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages, systemPrompt: SYSTEM_PROMPT }),
      })

      if (res.ok) {
        const { content: aiContent } = await res.json()
        setMessages((prev) => [...prev, { role: 'assistant', content: aiContent }])
      } else {
        const { error } = await res.json().catch(() => ({ error: 'Unknown error' }))
        console.error('[Haven API]', error)
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              "I'm having trouble connecting right now. Please try again in a moment.",
          },
        ])
      }
    } catch (err) {
      console.error('[Haven API] Network error:', err)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "Something went wrong on my end. Please try again.",
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  function clear() {
    localStorage.removeItem('haven-conversation')
    setMessages([])
    setReady(false)
    setIsTyping(true)
    setTimeout(() => {
      setMessages([{ role: 'assistant', content: GREETING }])
      setIsTyping(false)
      setReady(true)
    }, 700)
  }

  return (
    <div className="mx-auto flex h-[calc(100dvh-6rem-env(safe-area-inset-bottom))] sm:h-[calc(100dvh-6.5rem-env(safe-area-inset-bottom))] max-w-2xl flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E8F0E9] px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#2E5E32]">
            <Heart className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-[#162018]">Haven</h1>
            <p className="text-xs text-zinc-500">Private AI companion · end-to-end private</p>
          </div>
        </div>
        <button
          onClick={clear}
          className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Clear
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="mr-3 mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl bg-[#2E5E32]">
                <Heart className="h-3.5 w-3.5 text-white" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'rounded-br-sm bg-[#2E5E32] text-white'
                  : 'rounded-bl-sm bg-[#E8F0E9] text-[#162018]'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl bg-[#2E5E32]">
              <Heart className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="rounded-2xl rounded-bl-sm bg-[#E8F0E9] px-4 py-3">
              <TypingIndicator />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Disclaimer */}
      <p className="border-t border-[#E8F0E9] px-4 py-2 text-center text-xs text-zinc-400">
        Haven is an AI companion, not a mental health professional.{' '}
        <a href="tel:988" className="underline">
          Call 988
        </a>{' '}
        if you&apos;re in crisis.
      </p>

      <ChatInput onSend={sendMessage} disabled={isTyping} />
    </div>
  )
}
