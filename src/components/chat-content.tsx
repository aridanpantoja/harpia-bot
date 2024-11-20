'use client'

import { useChatContext } from '@/providers/chat-provider'
import { ChatMessage } from '@/components/chat-message'
import { ChatLoading } from '@/components/chat-loading'
import { useEffect, useRef, useState } from 'react'
import { Button } from './ui/button'
import { ArrowDown } from 'lucide-react'

export function ChatContent() {
  const { messages, isLoading } = useChatContext()
  const [showGoToBottom, setShowGoToBottom] = useState(false)
  const [isAtBottom, setIsAtBottom] = useState(true)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const handleScroll = () => {
    const scrollContainer = document.documentElement
    const isNearBottom =
      scrollContainer.scrollHeight -
        scrollContainer.scrollTop -
        window.innerHeight <
      100
    setShowGoToBottom(!isNearBottom)
    setIsAtBottom(isNearBottom)
  }

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (isAtBottom) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isLoading, isAtBottom])

  return (
    <main className="relative mx-auto h-full w-full grow md:max-w-3xl md:gap-5 lg:max-w-[40rem] lg:gap-6 xl:max-w-[48rem]">
      <div className="mx-auto flex w-full flex-1 grow flex-col gap-4 p-6 text-base md:max-w-3xl md:gap-5 lg:max-w-[40rem] lg:gap-6 xl:max-w-[48rem]">
        <div className="flex-1 grow">
          <div className="mb-36 space-y-4 md:space-y-6">
            {isLoading === false ? (
              messages.map((message) => (
                <ChatMessage message={message} key={message.id} />
              ))
            ) : (
              <ChatLoading />
            )}
            <div ref={chatEndRef}></div>
          </div>
        </div>
      </div>
      {showGoToBottom && (
        <Button
          size="icon"
          onClick={scrollToBottom}
          className="fixed bottom-28 left-1/2 -translate-x-1/2 transform rounded-full bg-primary p-3"
        >
          <ArrowDown />
        </Button>
      )}
    </main>
  )
}
