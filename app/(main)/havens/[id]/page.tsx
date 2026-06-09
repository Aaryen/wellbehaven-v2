'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Users, Sparkles, Send } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { createClient } from '@/lib/supabase/client'
import type { Message, Room } from '@/types'

// ─── Helpers ────────────────────────────────────────────────────────────────

const HAVEN_SYSTEM_PROMPT = `You are Haven, a warm AI companion present in a peer support circle.
You are NOT a therapist, doctor, or crisis service.

In this circle, multiple people share their experiences. Your role:
- Acknowledge what people share with genuine warmth and empathy
- Ask one gentle, open follow-up question to invite deeper sharing
- Keep responses short (2–3 sentences max)
- Never give advice, diagnoses, or tell people what to do
- Normalize difficult emotions — they are valid and human
- If someone seems in crisis, gently mention: "If things feel overwhelming, you can call or text 988."`

const AVATAR_COLORS = [
  { bg: 'bg-violet-100', text: 'text-violet-700' },
  { bg: 'bg-sky-100', text: 'text-sky-700' },
  { bg: 'bg-amber-100', text: 'text-amber-700' },
  { bg: 'bg-rose-100', text: 'text-rose-700' },
  { bg: 'bg-teal-100', text: 'text-teal-700' },
  { bg: 'bg-orange-100', text: 'text-orange-700' },
  { bg: 'bg-fuchsia-100', text: 'text-fuchsia-700' },
  { bg: 'bg-lime-100', text: 'text-lime-700' },
]

function avatarColor(name: string) {
  const sum = [...name].reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  return AVATAR_COLORS[sum % AVATAR_COLORS.length]
}

function timeAgo(ts: string) {
  try {
    return formatDistanceToNow(new Date(ts), { addSuffix: true })
  } catch {
    return ''
  }
}

function mapMessage(row: Record<string, unknown>): Message {
  return {
    id: row.id as string,
    roomId: row.room_id as string,
    userId: row.user_id as string,
    username: row.username as string,
    content: row.content as string,
    translatedContent: (row.translated_content as string) ?? null,
    isHaven: (row.is_haven as boolean) ?? false,
    createdAt: row.created_at as string,
  }
}

function mapRoom(row: Record<string, unknown>): Room {
  return {
    id: row.id as string,
    title: row.title as string,
    desc: row.desc as string,
    category: row.category as string,
    members: (row.members as number) ?? 0,
    capacity: (row.capacity as number) ?? 20,
    weeklyPrompt: (row.weekly_prompt as string) ?? '',
    createdAt: row.created_at as string,
  }
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function MessageBubble({
  message,
  isOwn,
}: {
  message: Message
  isOwn: boolean
}) {
  const color = avatarColor(message.username)
  const initial = message.username.charAt(0).toUpperCase()

  if (message.isHaven) {
    return (
      <div className="flex gap-3 items-start">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#2E5E32] text-base shadow-sm">
          🌿
        </div>
        <div className="max-w-[75%] sm:max-w-[65%]">
          <p className="mb-1 text-xs font-semibold text-[#2E5E32]">{message.username}</p>
          <div className="rounded-2xl rounded-tl-sm border border-[#c8e6ca] bg-[#F0FAF0] px-4 py-3 text-sm leading-relaxed text-[#162018] shadow-sm">
            {message.content}
          </div>
          <p className="mt-1 text-xs text-zinc-400">{timeAgo(message.createdAt)}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex gap-3 items-start ${isOwn ? 'flex-row-reverse' : ''}`}>
      <div
        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold shadow-sm ${color.bg} ${color.text}`}
      >
        {initial}
      </div>
      <div className={`max-w-[75%] sm:max-w-[65%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
        <p className={`mb-1 text-xs font-medium text-zinc-500 ${isOwn ? 'text-right' : ''}`}>
          {isOwn ? 'You' : message.username}
        </p>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
            isOwn
              ? 'rounded-tr-sm bg-[#2E5E32] text-white'
              : 'rounded-tl-sm border border-zinc-100 bg-white text-[#162018]'
          }`}
        >
          {message.content}
        </div>
        <p className="mt-1 text-xs text-zinc-400">{timeAgo(message.createdAt)}</p>
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 items-start">
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#2E5E32] text-base">
        🌿
      </div>
      <div className="rounded-2xl rounded-tl-sm border border-[#c8e6ca] bg-[#F0FAF0] px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#5E9462] [animation-delay:0ms]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#5E9462] [animation-delay:150ms]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#5E9462] [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  )
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function HavenRoomPage() {
  const { id: roomId } = useParams<{ id: string }>()

  const [room, setRoom] = useState<Room | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [username, setUsername] = useState<string | null>(null)
  const [joinName, setJoinName] = useState('')
  const [havenTyping, setHavenTyping] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [input, setInput] = useState('')
  const [showPrompt, setShowPrompt] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  const endRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const messagesAreaRef = useRef<HTMLDivElement>(null)
  const supabaseRef = useRef(createClient())
  const didInitialScroll = useRef(false)

  const [userId] = useState<string>(() => {
    if (typeof window === 'undefined') return 'ssr'
    const key = 'wbh_userid'
    const stored = localStorage.getItem(key)
    if (stored) return stored
    const id = crypto.randomUUID()
    localStorage.setItem(key, id)
    return id
  })

  // Restore username
  useEffect(() => {
    const name = localStorage.getItem('wbh_username')
    if (name) setUsername(name)
  }, [])

  // Load room + messages
  useEffect(() => {
    const sb = supabaseRef.current
    let cancelled = false

    async function load() {
      setLoading(true)
      setLoadError(null)

      const [{ data: roomData, error: roomErr }, { data: msgData, error: msgErr }] =
        await Promise.all([
          sb.from('rooms').select('*').eq('id', roomId).single(),
          sb
            .from('messages')
            .select('*')
            .eq('room_id', roomId)
            .order('created_at', { ascending: true }),
        ])

      if (cancelled) return

      if (roomErr || !roomData) {
        setLoadError('Could not load this circle. It may have been removed.')
      } else {
        setRoom(mapRoom(roomData as Record<string, unknown>))
      }

      if (!msgErr && msgData) {
        setMessages(msgData.map((r) => mapMessage(r as Record<string, unknown>)))
      }

      setLoading(false)
    }

    load()
    return () => { cancelled = true }
  }, [roomId])

  // Realtime subscription
  useEffect(() => {
    const sb = supabaseRef.current
    const channel = sb
      .channel(`circle:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const msg = mapMessage(payload.new as Record<string, unknown>)
          setMessages((prev) =>
            prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]
          )
        }
      )
      .subscribe()

    return () => { void sb.removeChannel(channel) }
  }, [roomId])

  // Scroll to bottom on new messages
  useEffect(() => {
    if (loading) return
    if (!didInitialScroll.current) {
      // Instant on first load
      if (messagesAreaRef.current) {
        messagesAreaRef.current.scrollTop = messagesAreaRef.current.scrollHeight
      }
      didInitialScroll.current = true
    } else {
      endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, havenTyping, loading])

  function handleJoin(e: React.FormEvent) {
    e.preventDefault()
    const name = joinName.trim()
    if (!name) return
    localStorage.setItem('wbh_username', name)
    setUsername(name)
  }

  function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void handleSend()
    }
  }

  async function handleSend() {
    const content = input.trim()
    if (!content || !username || sending) return

    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    setSending(true)

    try {
      const { error: insertErr } = await supabaseRef.current.from('messages').insert({
        room_id: roomId,
        user_id: userId,
        username,
        content,
        is_haven: false,
      })

      if (insertErr) {
        console.error('[WellbeHaven] Send failed:', insertErr.message)
        setInput(content)
        return
      }

      await callHaven(content)
    } finally {
      setSending(false)
    }
  }

  async function callHaven(userContent: string) {
    setHavenTyping(true)
    try {
      // Build context from last 10 messages, always ending with a user turn
      const context = messages
        .slice(-10)
        .map((m) => ({
          role: m.isHaven ? ('assistant' as const) : ('user' as const),
          content: m.isHaven ? m.content : `[${m.username}]: ${m.content}`,
        }))

      context.push({ role: 'user', content: `[${username}]: ${userContent}` })

      // Anthropic requires the first message to be role 'user'
      const firstUser = context.findIndex((m) => m.role === 'user')
      const apiMessages = firstUser > 0 ? context.slice(firstUser) : context

      const res = await fetch('/api/haven', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages, systemPrompt: HAVEN_SYSTEM_PROMPT }),
      })

      if (!res.ok) return

      const { content: aiContent } = await res.json()
      if (!aiContent) return

      await supabaseRef.current.from('messages').insert({
        room_id: roomId,
        user_id: 'haven-ai',
        username: 'Haven 🌿',
        content: aiContent,
        is_haven: true,
      })
    } finally {
      setHavenTyping(false)
    }
  }

  // ── Join modal ──────────────────────────────────────────────────────────────

  if (!username) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-2xl border border-[#E8F0E9] bg-white p-8 shadow-sm">
          <p className="mb-4 text-center text-3xl">🌿</p>
          <h2 className="mb-1 text-center text-xl font-semibold text-[#162018]">
            {room?.title ?? 'Join this circle'}
          </h2>
          <p className="mb-6 text-center text-sm leading-relaxed text-zinc-500">
            Choose an anonymous name to join. Nothing real required — just something
            you&apos;re comfortable with.
          </p>
          <form onSubmit={handleJoin} className="space-y-3">
            <input
              required
              autoFocus
              value={joinName}
              onChange={(e) => setJoinName(e.target.value)}
              placeholder="e.g. River, Sage, or anything you like…"
              maxLength={32}
              className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E5E32]/30"
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-[#2E5E32] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#245028]"
            >
              Enter circle
            </button>
          </form>
          <Link
            href="/havens"
            className="mt-4 block text-center text-xs text-zinc-400 hover:text-zinc-600"
          >
            ← Back to circles
          </Link>
        </div>
      </div>
    )
  }

  // ── Error state ─────────────────────────────────────────────────────────────

  if (loadError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-4xl">🍂</p>
        <p className="text-sm text-zinc-500">{loadError}</p>
        <Link
          href="/havens"
          className="rounded-xl bg-[#2E5E32] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#245028]"
        >
          Back to circles
        </Link>
      </div>
    )
  }

  // ── Main chat layout ─────────────────────────────────────────────────────────

  return (
    <div className="mx-auto flex h-[calc(100vh-6rem)] max-w-3xl flex-col">

      {/* ── Header ── */}
      <div className="relative flex flex-shrink-0 items-center gap-3 border-b border-[#E8F0E9] bg-white px-4 py-3">
        <Link
          href="/havens"
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-zinc-500 transition-colors hover:bg-[#E8F0E9] hover:text-[#2E5E32]"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        <div className="min-w-0 flex-1">
          <h1 className="truncate font-semibold text-[#162018]">
            {room?.title ?? '…'}
          </h1>
          {room && (
            <p className="text-xs text-zinc-400">
              Joined as{' '}
              <span className="font-medium text-[#2E5E32]">{username}</span>
            </p>
          )}
        </div>

        {/* Member count */}
        {room && (
          <div className="flex items-center gap-1 rounded-full bg-[#E8F0E9] px-2.5 py-1 text-xs font-medium text-[#2E5E32]">
            <Users className="h-3 w-3" />
            {room.members}
          </div>
        )}

        {/* Weekly prompt button */}
        {room?.weeklyPrompt && (
          <div className="relative">
            <button
              onClick={() => setShowPrompt((v) => !v)}
              className="flex h-8 items-center gap-1.5 rounded-xl bg-[#E8F0E9] px-3 text-xs font-medium text-[#2E5E32] transition-colors hover:bg-[#d0e4d2]"
            >
              <Sparkles className="h-3 w-3" />
              <span className="hidden sm:inline">Prompt</span>
            </button>

            {showPrompt && (
              <>
                {/* backdrop */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowPrompt(false)}
                />
                {/* popover */}
                <div className="absolute right-0 top-10 z-20 w-72 rounded-2xl border border-[#E8F0E9] bg-white p-4 shadow-lg">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#5E9462]">
                    This week&apos;s prompt
                  </p>
                  <p className="text-sm leading-relaxed text-[#162018]">
                    &ldquo;{room.weeklyPrompt}&rdquo;
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ── Messages area ── */}
      <div
        ref={messagesAreaRef}
        className="flex-1 overflow-y-auto bg-[#FDFAF5] px-4 py-6"
      >
        {loading ? (
          <div className="flex h-full flex-col gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-3">
                <div className="h-9 w-9 animate-pulse rounded-full bg-[#E8F0E9]" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-3 w-24 animate-pulse rounded bg-[#E8F0E9]" />
                  <div className="h-10 w-3/4 animate-pulse rounded-2xl bg-[#E8F0E9]" />
                </div>
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <span className="text-5xl">🌿</span>
            <p className="font-medium text-[#162018]">This circle is quiet.</p>
            <p className="max-w-xs text-sm text-zinc-500">
              Be the first to share. Whatever is on your mind, this is a safe space.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isOwn={msg.userId === userId}
              />
            ))}
            {havenTyping && <TypingIndicator />}
            <div ref={endRef} />
          </div>
        )}
      </div>

      {/* ── Input bar ── */}
      <div className="flex-shrink-0 border-t border-[#E8F0E9] bg-white px-4 py-3">
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={sending}
            placeholder="Share how you're feeling… (Enter to send)"
            rows={1}
            className="flex-1 resize-none rounded-2xl border border-zinc-200 bg-[#FDFAF5] px-4 py-3 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#2E5E32]/30 disabled:opacity-50"
            style={{ maxHeight: '120px' }}
          />
          <button
            onClick={() => void handleSend()}
            disabled={!input.trim() || sending}
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-[#2E5E32] text-white transition-colors hover:bg-[#245028] disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 text-center text-xs text-zinc-400">
          Shift + Enter for a new line &nbsp;·&nbsp; Enter to send
        </p>
      </div>
    </div>
  )
}
