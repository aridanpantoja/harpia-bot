'use client'

import { useChatContext } from '@/hooks/use-chat-context'
import { ArrowUp } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import Link from 'next/link'
import { siteConfig } from '@/config'

export function ChatInput() {
  const { input, handleInputChange, handleSubmit, isLoading } = useChatContext()

  return (
    <div className="fixed inset-x-0 bottom-0 flex w-full items-center bg-background/80 pb-4 backdrop-blur-lg">
      <div className="mx-auto flex w-full flex-col items-center justify-start gap-4 px-4 md:max-w-3xl md:px-0 lg:max-w-[40rem] xl:max-w-[48rem]">
        <form
          className="flex h-14 w-full items-center gap-2 rounded-full border-input bg-muted-foreground/40 ring-offset-background focus-within:border-none focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
          onSubmit={handleSubmit}
        >
          <Input
            placeholder="Pergunte ao Chatbot"
            className="pl-6 placeholder:text-muted-foreground"
            value={input}
            onChange={handleInputChange}
          />

          <Button
            size="icon"
            className="mr-2 flex-shrink-0 rounded-full"
            disabled={!input || isLoading}
          >
            <ArrowUp />
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          A Harpia pode cometer erros. Por isso, confira o{' '}
          <Link
            href={siteConfig.links.ps2025}
            target="_blank"
            className="text-primary underline underline-offset-2"
          >
            edital aqui
          </Link>
        </p>
      </div>
    </div>
  )
}
