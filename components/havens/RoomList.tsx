import type { Room } from '@/types'
import RoomCard from './RoomCard'

interface RoomListProps {
  rooms: Room[]
  expandedId: string | null
  onToggle: (id: string | null) => void
}

export default function RoomList({ rooms, expandedId, onToggle }: RoomListProps) {
  if (rooms.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-zinc-400">No havens found.</p>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {rooms.map((room) => (
        <RoomCard
          key={room.id}
          room={room}
          expandedId={expandedId}
          onToggle={onToggle}
        />
      ))}
    </div>
  )
}
