import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { Message } from 'ai'
import ReactMarkdown from 'react-markdown'

export function ChatMessage({ message }: { message: Message }) {
  return (
    <article
      className={cn(
        'my-4 first:mt-0 md:my-6 [&:nth-last-child(3)]:mb-2',
        message.role === 'assistant'
          ? 'flex w-full items-center gap-2'
          : 'relative ml-auto w-fit max-w-[70%] rounded-xl border border-muted-foreground/5 bg-muted-foreground/10 px-5 py-2.5',
      )}
    >
      {message.role === 'assistant' && (
        <Avatar className="size-8 self-start">
          <AvatarImage src="/harpia-logo.svg" alt="Harpia" />
          <AvatarFallback>HA</AvatarFallback>
        </Avatar>
      )}
      {message.role === 'assistant' ? (
        <ReactMarkdown
          className="block space-y-4 text-pretty"
          components={{
            a: ({ children, ...props }) => (
              <a
                className="font-medium text-primary underline underline-offset-4"
                target="_blank"
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
