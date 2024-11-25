'use client'

import { ChatRequestOptions, Message } from 'ai'
import { useChat } from 'ai/react'
import React, { createContext, ReactNode, useEffect, useState } from 'react'

export interface ChatContextData {
  messages: Message[]
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  handleClearHistory: () => void
  isMessagesLoading: boolean
  isLoading: boolean
  reload: (
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>
}

export const ChatContext = createContext<ChatContextData>({} as ChatContextData)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isMessagesLoading, setIsMessagesLoading] = useState(true)
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
    reload,
  } = useChat()

  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages')

    if (savedMessages) {
      setMessages(JSON.parse(savedMessages))
    }

    setIsMessagesLoading(false)
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
        isMessagesLoading,
        isLoading,
        reload,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}
