'use client'

import { Message } from 'ai'
import { useChat } from 'ai/react'
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

interface ChatContextData {
  messages: Message[]
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  handleClearHistory: () => void
  isLoading: boolean
}

const ChatContext = createContext<ChatContextData>({} as ChatContextData)

export function useChatContext(): ChatContextData {
  const context = useContext(ChatContext)

  if (!context) {
    throw new Error('useChatProvider must be used within a ChatProvider')
  }

  return context
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const { messages, input, handleInputChange, handleSubmit, setMessages } =
    useChat()

  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages')

    if (savedMessages) {
      setMessages(JSON.parse(savedMessages))
    }

    setIsLoading(false)
  }, [setMessages])

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(messages))
    }
  }, [messages])

  function handleClearHistory() {
    localStorage.removeItem('chatMessages')
    setMessages([])
  }

  return (
    <ChatContext.Provider
      value={{
        messages,
        input,
        handleInputChange,
        handleSubmit,
        handleClearHistory,
        isLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}
