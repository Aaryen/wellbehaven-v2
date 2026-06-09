'use client'

import { useState } from 'react'
import ChatMessage from '@/components/chat/ChatMessage'
import ChatInput from '@/components/chat/ChatInput'
import TypingIndicator from '@/components/chat/TypingIndicator'
import type { Message } from '@/types'

interface ChatAreaProps {
  roomId: string
}

export default function ChatArea({ roomId: _ }: ChatAreaProps) {
  const [messages] = useState<Message[]>([])

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-3">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>
      <TypingIndicator />
      <ChatInput onSend={() => {}} />
    </div>
  )
}
