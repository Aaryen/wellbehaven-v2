import type { Message } from '@/types'
import { Heart } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface ChatMessageProps {
  message: Message
  isOwn?: boolean
}

function Avatar({ username, isHaven }: { username: string; isHaven: boolean }) {
  if (isHaven) {
    return (
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[#2E5E32]">
        <Heart className="h-4 w-4 text-white" />
      </div>
    )
  }
  return (
    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[#E8F0E9] text-xs font-semibold text-[#2E5E32]">
      {username.charAt(0).toUpperCase()}
    </div>
  )
}

export default function ChatMessage({ message, isOwn }: ChatMessageProps) {
  const time = (() => {
    try {
      return formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })
    } catch {
      return ''
    }
  })()

  if (message.isHaven) {
    return (
      <div className="flex items-start gap-3">
        <Avatar username="Haven" isHaven />
        <div className="max-w-[75%]">
          <p className="mb-1 text-xs font-medium text-[#5E9462]">Haven</p>
          <div className="rounded-2xl rounded-tl-sm border border-[#E8F0E9] bg-[#F4F9F4] px-4 py-3 text-sm leading-relaxed text-[#162018]">
            {message.content}
          </div>
          {time && <p className="mt-1 text-xs text-zinc-400">{time}</p>}
        </div>
      </div>
    )
  }

  if (isOwn) {
    return (
      <div className="flex items-start justify-end gap-3">
        <div className="max-w-[75%] text-right">
          <div className="rounded-2xl rounded-tr-sm bg-[#2E5E32] px-4 py-3 text-sm leading-relaxed text-white">
            {message.content}
          </div>
          {time && <p className="mt-1 text-xs text-zinc-400">{time}</p>}
        </div>
        <Avatar username={message.username} isHaven={false} />
      </div>
    )
  }

  return (
    <div className="flex items-start gap-3">
      <Avatar username={message.username} isHaven={false} />
      <div className="max-w-[75%]">
        <p className="mb-1 text-xs font-medium text-zinc-500">{message.username}</p>
        <div className="rounded-2xl rounded-tl-sm bg-zinc-100 px-4 py-3 text-sm leading-relaxed text-[#162018]">
          {message.content}
        </div>
        {time && <p className="mt-1 text-xs text-zinc-400">{time}</p>}
      </div>
    </div>
  )
}
