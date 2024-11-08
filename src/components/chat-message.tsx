import { cn } from '@/lib/utils'
import { Message } from 'ai'
import { Bot } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

export function ChatMessage({ message }: { message: Message }) {
  return (
    <article
      className={cn(
        '',
        message.role === 'assistant'
          ? 'flex w-full items-center gap-2'
          : 'relative ml-auto w-fit max-w-[70%] rounded-xl border border-muted-foreground/5 bg-muted-foreground/10 px-5 py-2.5',
      )}
    >
      {message.role === 'assistant' && (
        <div className="self-start rounded-full border bg-primary p-2">
          <Bot className="size-4 text-primary-foreground" />
        </div>
      )}
      {message.role === 'assistant' ? (
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
          {message.content}
        </ReactMarkdown>
      ) : (
        <p>{message.content}</p>
      )}
    </article>
  )
}
