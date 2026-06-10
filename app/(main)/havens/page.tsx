'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Search, Plus, X, Users, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Room } from '@/types'

const CATEGORIES = ['All', 'Divorce', 'Grief', 'Anxiety', 'Burnout', 'Loneliness', 'Trauma']

const CATEGORY_EMOJI: Record<string, string> = {
  Divorce: '💔',
  Grief: '🕯️',
  Anxiety: '🌊',
  Burnout: '🔥',
  Loneliness: '🌙',
  Trauma: '🫂',
}

const CARD_BORDER = '#5E9462'
const CARD_BG = 'rgba(94,148,98,0.12)'

const SEED_ROOMS = [
  {
    title: 'Going through a divorce',
    desc: "Separation unravels everything — identity, routine, family. This circle is for people in the middle of it, not just surviving but trying to understand who they are on the other side.",
    category: 'Divorce',
    capacity: 25,
    weekly_prompt: "What's one thing you thought you'd never get through — that you did?",
  },
  {
    title: 'Losing a parent',
    desc: "Grief after a parent dies doesn't follow a timeline. Whether it just happened or it's been years, this is a space to say what you can't always say out loud.",
    category: 'Grief',
    capacity: 25,
    weekly_prompt: 'What do you miss most that no one else would think to ask about?',
  },
  {
    title: 'Morning anxiety & dread',
    desc: "Waking up with a weight on your chest before the day has even started. If mornings feel like a battle, you're not alone — and you don't have to explain why.",
    category: 'Anxiety',
    capacity: 25,
    weekly_prompt: "What's the first thing you do that helps — even a little?",
  },
  {
    title: 'Early sobriety support',
    desc: "The first weeks and months of sobriety are hard in ways people don't warn you about. This circle is for honest conversation — the pride and the struggle.",
    category: 'Burnout',
    capacity: 25,
    weekly_prompt: 'What surprised you most about early sobriety?',
  },
  {
    title: 'Recovering from work burnout',
    desc: "When you gave everything to your job and it emptied you out. Recovery isn't just rest — it's rebuilding your relationship with yourself.",
    category: 'Burnout',
    capacity: 25,
    weekly_prompt: "What did you lose that you're still trying to get back?",
  },
  {
    title: 'Loneliness after moving cities',
    desc: "You made a brave choice and now you're sitting in a new city not knowing anyone. This circle is for people who chose change and are still waiting for it to feel like home.",
    category: 'Loneliness',
    capacity: 25,
    weekly_prompt: 'What do you miss most about where you came from?',
  },
  {
    title: 'Leaving a toxic relationship',
    desc: "Getting out is only the beginning. Whether you're processing what happened or rebuilding your sense of self, this is a space with no judgment — only understanding.",
    category: 'Trauma',
    capacity: 25,
    weekly_prompt: "What's something you're slowly learning to trust again?",
  },
  {
    title: 'Pregnancy loss & infertility',
    desc: "Some grief has no funeral. This circle holds space for pregnancy loss, failed IVF, miscarriage, and the silence that surrounds infertility.",
    category: 'Grief',
    capacity: 25,
    weekly_prompt: 'What do you wish people understood without you having to explain it?',
  },
  {
    title: 'Parenting through depression',
    desc: "Loving your children deeply while struggling to get out of bed. This circle is for parents who are doing their best in the hardest possible circumstances.",
    category: 'Anxiety',
    capacity: 25,
    weekly_prompt: 'What does "good enough" parenting look like on your worst days?',
  },
  {
    title: 'Debt, shame & financial anxiety',
    desc: "Money problems carry a shame that makes them almost impossible to talk about. This circle makes it possible — no judgment, no advice, just people who understand.",
    category: 'Trauma',
    capacity: 25,
    weekly_prompt: "What's the story you tell yourself about how this happened?",
  },
]

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

function HavenCard({
  room,
  isExpanded,
  onToggle,
}: {
  room: Room
  isExpanded: boolean
  onToggle: () => void
}) {
  const emoji = CATEGORY_EMOJI[room.category] ?? '🌿'
  const fillPct = Math.min(100, Math.round((room.members / room.capacity) * 100))

  return (
    <div
      onClick={onToggle}
      className="cursor-pointer bg-white sm:cursor-default"
      style={{
        borderRadius: 16,
        boxShadow: '0 1px 4px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)',
        borderLeft: `4px solid ${CARD_BORDER}`,
        padding: '1.25rem 1.25rem 1.25rem 1.125rem',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget
        el.style.transform = 'translateY(-3px)'
        el.style.boxShadow = '0 8px 24px rgba(0,0,0,0.11), 0 0 0 1px rgba(0,0,0,0.05)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget
        el.style.transform = 'translateY(0)'
        el.style.boxShadow = '0 1px 4px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)'
      }}
    >
      {/* Emoji avatar + title row */}
      <div className="flex items-start gap-3">
        <div
          className="flex flex-shrink-0 items-center justify-center rounded-full"
          style={{
            width: 48,
            height: 48,
            backgroundColor: CARD_BG,
            fontSize: '1.5rem',
            lineHeight: 1,
          }}
        >
          {emoji}
        </div>

        <div className="min-w-0 flex-1">
          <span
            className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{ backgroundColor: CARD_BG, color: CARD_BORDER }}
          >
            {room.category}
          </span>
          <h3
            className="mt-1.5 leading-snug text-[#162018]"
            style={{ fontSize: '1.1rem', fontWeight: 700 }}
          >
            {room.title}
          </h3>
        </div>
      </div>

      {/* Description */}
      <p
        className={`mt-3 ${isExpanded ? '' : 'line-clamp-2'}`}
        style={{ fontSize: '0.82rem', color: '#6A8070', marginBottom: '0.75rem', lineHeight: 1.55 }}
      >
        {room.desc}
      </p>

      {/* Weekly prompt */}
      {room.weeklyPrompt && (
        <p
          className="italic"
          style={{ fontSize: '0.78rem', color: '#5E9462', marginBottom: '1rem' }}
        >
          📌 &ldquo;{room.weeklyPrompt}&rdquo;
        </p>
      )}

      {/* Member bar */}
      <div
        className="overflow-hidden rounded-full bg-zinc-100"
        style={{ height: 4, marginBottom: '0.75rem' }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${fillPct}%`, backgroundColor: CARD_BORDER }}
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs text-zinc-400">
          <Users className="h-3.5 w-3.5" />
          {room.members} / {room.capacity} members
        </span>
        <Link
          href={`/havens/${room.id}`}
          onClick={(e) => e.stopPropagation()}
          className={`items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold text-white transition-colors ${
            isExpanded ? 'inline-flex' : 'hidden sm:inline-flex'
          }`}
          style={{ backgroundColor: '#2E5E32' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#245028' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#2E5E32' }}
        >
          Enter Circle <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  )
}

export default function HavensPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [showNewRoom, setShowNewRoom] = useState(false)
  const [newRoom, setNewRoom] = useState({ title: '', desc: '', category: 'Anxiety' })
  const [creating, setCreating] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const seeded = useRef(false)
  const supabaseRef = useRef(createClient())

  useEffect(() => {
    let cancelled = false

    async function init() {
      setLoading(true)
      try {
        const res = await fetch('/api/rooms')
        const rows: Record<string, unknown>[] = res.ok
          ? ((await res.json()).rooms ?? [])
          : []

        if (cancelled) return

        if (rows.length === 0 && !seeded.current) {
          seeded.current = true
          const { data, error } = await supabaseRef.current
            .from('rooms')
            .insert(
              SEED_ROOMS.map((r) => ({
                title: r.title,
                desc: r.desc,
                category: r.category,
                capacity: r.capacity,
                weekly_prompt: r.weekly_prompt,
                members: 0,
                is_active: true,
              }))
            )
            .select()

          if (cancelled) return

          if (error) {
            console.error('[WellbeHaven] Room seeding failed:', error.message)
          } else {
            setRooms((data ?? []).map(mapRoom))
          }
        } else {
          setRooms(rows.map(mapRoom))
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    init()
    return () => { cancelled = true }
  }, [])

  const filtered = rooms.filter((r) => {
    const categoryOk = activeCategory === 'All' || r.category.toLowerCase() === activeCategory.toLowerCase()
    const searchOk =
      !search ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.desc.toLowerCase().includes(search.toLowerCase())
    return categoryOk && searchOk
  })

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)
    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRoom),
      })
      if (res.ok) {
        const { room } = await res.json()
        setRooms((prev) => [mapRoom(room), ...prev])
        setShowNewRoom(false)
        setNewRoom({ title: '', desc: '', category: 'Anxiety' })
      }
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#162018]">SaveHavens</h1>
          <p className="mt-1 text-sm text-zinc-500">Find your circle</p>
        </div>
        <button
          onClick={() => setShowNewRoom(true)}
          className="flex items-center gap-2 rounded-2xl bg-[#2E5E32] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#245028]"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New SaveHaven</span>
          <span className="sm:hidden">New</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          placeholder="Search havens…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-zinc-200 bg-white py-3 pl-10 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-[#2E5E32]/30"
        />
      </div>

      {/* Category filters */}
      <div className="mb-8 flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-[#2E5E32] text-white'
                : 'bg-[#E8F0E9] text-[#2E5E32] hover:bg-[#d0e4d2]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Rooms */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-2xl bg-[#E8F0E9]" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-zinc-400">No havens found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((room) => (
            <HavenCard
              key={room.id}
              room={room}
              isExpanded={expandedId === room.id}
              onToggle={() =>
                setExpandedId((prev) => (prev === room.id ? null : room.id))
              }
            />
          ))}
        </div>
      )}

      {/* New Room Modal */}
      {showNewRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#162018]">Create SaveHaven</h2>
              <button
                onClick={() => setShowNewRoom(false)}
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">
                  Title
                </label>
                <input
                  required
                  value={newRoom.title}
                  onChange={(e) => setNewRoom((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Grief after job loss"
                  className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-[#2E5E32]/30"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={newRoom.desc}
                  onChange={(e) => setNewRoom((p) => ({ ...p, desc: e.target.value }))}
                  placeholder="Who is this circle for?"
                  className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-[#2E5E32]/30"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">
                  Category
                </label>
                <select
                  value={newRoom.category}
                  onChange={(e) =>
                    setNewRoom((p) => ({ ...p, category: e.target.value }))
                  }
                  className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-[#2E5E32]/30"
                >
                  {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewRoom(false)}
                  className="flex-1 rounded-xl border border-zinc-200 py-2.5 text-sm font-medium transition-colors hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 rounded-xl bg-[#2E5E32] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#245028] disabled:opacity-60"
                >
                  {creating ? 'Creating…' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
