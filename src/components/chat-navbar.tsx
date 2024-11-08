import { Bot } from 'lucide-react'
import Link from 'next/link'
import { ModeToggle } from '@/components/mode-toggle'
import { ClearChat } from '@/components/clear-chat'

export function ChatNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full gap-2 border-b bg-background">
      <div className="relative flex h-14 items-center justify-between px-4">
        <div>
          <ClearChat />
        </div>

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
  )
}
