'use client'

import { useState, KeyboardEvent } from 'react'
import { Send } from 'lucide-react'

interface ChatInputProps {
  onSend: (content: string) => void
  disabled?: boolean
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState('')

  function handleSend() {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex items-end gap-2 border-t border-[#E8F0E9] bg-white px-4 py-3">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="Share how you're feeling…"
        rows={1}
        className="flex-1 resize-none rounded-2xl border border-zinc-200 bg-[#FDFAF5] px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#2E5E32]/30 disabled:opacity-50"
        style={{ maxHeight: '120px', overflowY: 'auto' }}
      />
      <button
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-[#2E5E32] text-white transition-colors hover:bg-[#245028] disabled:opacity-40"
      >
        <Send className="h-4 w-4" />
      </button>
    </div>
  )
}
