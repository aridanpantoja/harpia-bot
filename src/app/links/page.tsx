import { buttonVariants } from '@/components/ui/button'
import { siteConfig } from '@/config'
import {
  Code,
  MessageCircleMore,
  Paperclip,
  TableOfContents,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const LINKS = [
  {
    name: 'Testar Harpia',
    href: '/',
    Icon: MessageCircleMore,
    target: '_self',
  },
  {
    name: 'Edital PS 2025',
    href: siteConfig.links.ps2025,
    Icon: Paperclip,
    target: '_blank',
  },
  {
    name: 'Formulário de uso',
    href: siteConfig.links.form,
    Icon: TableOfContents,
    target: '_blank',
  },
  {
    name: 'Github',
    href: siteConfig.links.github,
    Icon: Code,
    target: '_blank',
  },
]

export default function LinksPage() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col items-center gap-6 rounded-2xl border bg-muted/50 p-8">
        <div className="flex flex-col items-center text-center">
          <Image
            src="/harpia-logo.svg"
            alt="Logo da Harpia"
            width={96}
            height={96}
          />
          <h1 className="mb-2 mt-1 text-2xl font-bold">Harpia Bot</h1>
          <p className="text-muted-foreground">Todos os links do Harpia Bot</p>
        </div>
        <div className="w-full space-y-3">
          {LINKS.map((link, i) => (
            <Link
              href={link.href}
              key={i}
              target={link.target}
              className={buttonVariants({
                className: 'h-fit w-full flex-wrap justify-between',
                variant: 'outline',
              })}
            >
              {link.name}

              <link.Icon />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
