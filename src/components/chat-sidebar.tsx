import { Bot, Settings } from 'lucide-react'
import Link from 'next/link'
import { ReactNode } from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarProvider,
} from './ui/sidebar'

const latestChats = [
  'Como criar um Chatbot com dois palitos de dente, meia banana prata e uma caixa de fósforo',
  'Qual a diferença entre um Chatbot e um ChatGPT?',
  'Cite as principais diferenças entre um Chatbot e um ChatGPT?',
]

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
        <SidebarContent className="p-2">
          <SidebarMenu className="space-y-2">
            {latestChats.map((chat, i) => (
              <Link href="/" key={i}>
                <SidebarMenuButton>
                  <span>{chat}</span>
                </SidebarMenuButton>
              </Link>
            ))}
          </SidebarMenu>
        </SidebarContent>
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
