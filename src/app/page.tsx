'use client'

import { ChatMessage } from '@/components/chat-message'
import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useChat } from 'ai/react'
import { ArrowUp, Bot, Save } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit } = useChat()

  return (
    <div className="flex h-full flex-col">
      <header className="sticky top-0 z-50 w-full gap-2 border-b bg-background">
        <div className="relative flex h-14 items-center justify-between px-4">
          <Button variant="outline" size="icon">
            <Save />
          </Button>
          <Link
            href="/"
            className="absolute right-1/2 flex translate-x-1/2 gap-2 font-semibold text-muted-foreground"
          >
            <Bot />
            <h1>UFPA BOT</h1>
          </Link>
          <ModeToggle />
        </div>
      </header>

      <main className="mx-auto h-full w-full grow md:max-w-3xl md:gap-5 lg:max-w-[40rem] lg:gap-6 xl:max-w-[48rem]">
        <div className="mx-auto flex w-full flex-1 grow flex-col gap-4 p-6 text-base md:max-w-3xl md:gap-5 lg:max-w-[40rem] lg:gap-6 xl:max-w-[48rem]">
          <div className="flex-1 grow">
            <div className="mb-20 space-y-4 md:space-y-6">
              {messages.map((message, index) => (
                <ChatMessage
                  type={message.role as 'user' | 'assistant'}
                  key={index}
                  message={message.content}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="fixed inset-x-0 bottom-0 flex h-20 w-full items-center bg-background">
        <div className="mx-auto flex w-full items-center md:max-w-3xl md:gap-5 lg:max-w-[40rem] lg:gap-6 xl:max-w-[48rem]">
          <form className="mt-auto flex w-full gap-2" onSubmit={handleSubmit}>
            <Input
              placeholder="Mensagem ChatBot UFPA"
              value={input}
              onChange={handleInputChange}
            />

            <Button size="icon">
              <ArrowUp />
            </Button>
          </form>
        </div>
      </footer>
    </div>
  )
}
