import { cn } from '@/lib/utils'
import { Bot } from 'lucide-react'

interface ChatMessageProps {
  message: string
  type: 'user' | 'bot'
}

export function ChatMessage({ message, type }: ChatMessageProps) {
  return (
    <article
      className={cn(
        'w-full',
        type === 'bot'
          ? 'flex items-center gap-3'
          : 'relative ml-auto max-w-[70%] rounded-3xl bg-muted-foreground/5 px-5 py-2.5',
      )}
    >
      {type === 'bot' && (
        <div className="self-start rounded-full border bg-primary p-2">
          <Bot className="size-5 text-primary-foreground" />
        </div>
      )}
      <p>{message}</p>
    </article>
  )
}
