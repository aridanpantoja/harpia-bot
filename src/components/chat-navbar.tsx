import { SidebarTrigger } from '@/components/ui/sidebar'

export function ChatNavbar() {
  return (
    <header className="relative flex items-center gap-2 border-b bg-background px-6 py-4">
      <SidebarTrigger />
      <h2 className="absolute right-1/2 max-w-[50%] translate-x-1/2 truncate text-muted-foreground">
        Como criar um Chatbot com dois palitos de dente, meia banana prata e uma
        caixa de fósforo
      </h2>
    </header>
  )
}
