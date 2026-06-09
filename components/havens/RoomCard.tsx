'use client'

import type { Room } from '@/types'
import Link from 'next/link'
import { Users, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react'

const EMOJI: Record<string, string> = {
  Divorce: '🌿',
  Grief: '🕊️',
  Anxiety: '🌊',
  Burnout: '🍂',
  Loneliness: '🌙',
  Trauma: '🌱',
}

interface RoomCardProps {
  room: Room
  expandedId: string | null
  onToggle: (id: string | null) => void
}

export default function RoomCard({ room, expandedId, onToggle }: RoomCardProps) {
  const isExpanded = expandedId === room.id
  const emoji = EMOJI[room.category] ?? '🌿'

  return (
    <div className="rounded-2xl border border-[#E8F0E9] bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-2xl leading-none">{emoji}</span>
        <div className="min-w-0 flex-1">
          <span className="mb-2 inline-block rounded-full bg-[#E8F0E9] px-2.5 py-0.5 text-xs font-medium text-[#2E5E32]">
            {room.category}
          </span>
          <h3 className="font-semibold text-[#162018]">{room.title}</h3>
          <p className={`mt-1 text-sm text-zinc-500 ${isExpanded ? '' : 'line-clamp-2'}`}>
            {room.desc}
          </p>
          {room.weeklyPrompt && (
            <p className="mt-2 text-xs italic text-[#5E9462]">
              &ldquo;{room.weeklyPrompt}&rdquo;
            </p>
          )}
        </div>
        {/* mobile expand toggle */}
        <button
          onClick={() => onToggle(isExpanded ? null : room.id)}
          className="p-1 text-zinc-400 hover:text-zinc-600 sm:hidden"
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
          <Users className="h-3.5 w-3.5" />
          <span>
            {room.members} / {room.capacity}
          </span>
        </div>
        {/* Desktop: always visible; Mobile: only when expanded */}
        <Link
          href={`/havens/${room.id}`}
          className={`inline-flex items-center gap-1.5 rounded-xl bg-[#2E5E32] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#245028] ${
            isExpanded ? 'flex' : 'hidden sm:flex'
          }`}
        >
          Enter Circle <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  )
}
