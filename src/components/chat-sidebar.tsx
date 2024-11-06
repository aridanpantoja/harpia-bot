import { Bot, Settings } from 'lucide-react'
import Link from 'next/link'
import { ReactNode } from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenuButton,
  SidebarProvider,
} from './ui/sidebar'

export function ChatSidebar({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar variant="inset">
        <SidebarHeader>
          <SidebarMenuButton asChild size="lg">
            <Link href="/" className="text-primary">
              <div className="rounded-full border bg-primary p-2">
                <Bot className="size-5 text-primary-foreground" />
              </div>
              <span className="text-base font-medium">UFPA Bot</span>
            </Link>
          </SidebarMenuButton>
        </SidebarHeader>
        <SidebarContent></SidebarContent>
        <SidebarFooter>
          <SidebarMenuButton>
            <Settings />
            <span>Configurações</span>
          </SidebarMenuButton>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="overflow-hidden">{children}</SidebarInset>
    </SidebarProvider>
  )
}
