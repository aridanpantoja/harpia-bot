import { ReactNode } from 'react'
import { ChatProvider } from '@/providers/chat-provider'
import { ThemeProvider } from '@/providers/theme-provider'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ChatProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </ChatProvider>
  )
}
