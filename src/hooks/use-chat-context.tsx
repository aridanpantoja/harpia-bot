import { ChatContext, ChatContextData } from '@/providers/chat-provider'
import { useContext } from 'react'

export function useChatContext(): ChatContextData {
  const context = useContext(ChatContext)

  if (!context) {
    throw new Error('useChatProvider must be used within a ChatProvider')
  }

  return context
}
