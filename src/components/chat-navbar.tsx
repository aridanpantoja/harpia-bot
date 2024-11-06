import { SidebarTrigger } from '@/components/ui/sidebar'

export function ChatNavbar() {
  return (
    <header className="flex gap-2">
      <SidebarTrigger />
      <h1>UFPA Bot</h1>
    </header>
  )
}
