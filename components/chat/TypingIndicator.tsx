export default function TypingIndicator({ username }: { username?: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        <span className="h-2 w-2 animate-bounce rounded-full bg-[#5E9462] [animation-delay:0ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-[#5E9462] [animation-delay:150ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-[#5E9462] [animation-delay:300ms]" />
      </div>
      {username && (
        <span className="text-xs text-zinc-400">{username} is typing…</span>
      )}
    </div>
  )
}
