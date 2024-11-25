import { ClearChat } from '@/components/clear-chat'
import { ModeToggle } from '@/components/mode-toggle'
import Image from 'next/image'
import Link from 'next/link'

export function ChatNavbar() {
  return (
    <header className="fixed top-0 z-50 w-full gap-2 border-b bg-background">
      <div className="relative flex h-12 items-center justify-between px-4">
        <div>
          <ClearChat />
        </div>

        <Link
          href="/"
          className="absolute right-1/2 flex translate-x-1/2 items-center gap-1 font-semibold"
        >
          <Image
            src={'/harpia-logo.svg'}
            alt="Logo da Harpia"
            width={32}
            height={32}
          />
          <h1 className="text-lg">Harpia</h1>
        </Link>
        <ModeToggle />
      </div>
    </header>
  )
}
