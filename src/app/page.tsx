import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { ArrowUp, Bot } from 'lucide-react'

export default function Home() {
  return (
    <>
      <header className="flex gap-2">
        <SidebarTrigger />
        <h1>UFPA Bot</h1>
      </header>
      <div className="mx-auto flex flex-1 grow flex-col gap-4 text-base md:max-w-3xl md:gap-5 lg:max-w-[40rem] lg:gap-6 xl:max-w-[48rem]">
        <div className="space-y-4 md:space-y-6">
          <article className="flex w-full items-center gap-3">
            <div className="self-start rounded-full border bg-primary p-2">
              <Bot className="size-5 text-primary-foreground" />
            </div>
            <p>Salve! Qual que é a tua duvida?</p>
          </article>

          <article className="relative ml-auto w-full max-w-[70%] rounded-3xl bg-muted-foreground/5 px-5 py-2.5">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit.
            Necessitatibus corrupti incidunt id iste provident eaque maiores,
            repellendus itaque velit, pariatur voluptate quod veritatis
            asperiores perspiciatis, at placeat delectus saepe accusamus.
          </article>

          <article className="flex w-full items-center gap-3">
            <div className="self-start rounded-full border bg-primary p-2">
              <Bot className="size-5 text-primary-foreground" />
            </div>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Necessitatibus corrupti incidunt id iste provident eaque maiores,
              repellendus itaque velit, pariatur voluptate quod veritatis
              asperiores perspiciatis, at placeat delectus saepe accusamus.
            </p>
          </article>
        </div>

        <div className="mt-auto">
          <form className="flex gap-2">
            <Input placeholder="Mensagem UFPABot" />
            <Button size="icon">
              <ArrowUp />
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}
