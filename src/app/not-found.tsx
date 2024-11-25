import { buttonVariants } from '@/components/ui/button'
import { BotOff } from 'lucide-react'
import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-center md:gap-6">
      <div className="flex items-center justify-center rounded-full bg-primary p-4">
        <BotOff className="size-10 text-primary-foreground" />
      </div>

      <h1 className="text-xl font-bold md:text-2xl">
        Página não encontrada (404)
      </h1>

      <Link href="/" className={buttonVariants()}>
        &larr; Voltar para home
      </Link>
    </div>
  )
}
