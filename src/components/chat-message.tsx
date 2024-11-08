import { cn } from '@/lib/utils'
import { Bot } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface ChatMessageProps {
  message: string
  type: 'user' | 'assistant'
}

export function ChatMessage({ message, type }: ChatMessageProps) {
  return (
    <article
      className={cn(
        '',
        type === 'assistant'
          ? 'flex w-full items-center gap-3'
          : 'relative ml-auto w-fit max-w-[70%] rounded-xl bg-muted-foreground/5 px-5 py-2.5',
      )}
    >
      {type === 'assistant' && (
        <div className="self-start rounded-full border bg-primary p-2">
          <Bot className="size-5 text-primary-foreground" />
        </div>
      )}
      {type === 'assistant' ? (
        <ReactMarkdown
          className="block space-y-4 text-pretty"
          components={{
            a: ({ children, ...props }) => (
              <a
                className="font-medium text-primary underline underline-offset-4"
                {...props}
              >
                {children}
              </a>
            ),
            ul: (props) => (
              <ul className="ml-4 list-disc space-y-2" {...props} />
            ),
            ol: (props) => (
              <ol className="ml-4 list-decimal space-y-2" {...props} />
            ),
          }}
        >
          {message}
        </ReactMarkdown>
      ) : (
        <p>{message}</p>
      )}
    </article>
  )
}
