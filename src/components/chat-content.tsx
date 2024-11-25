'use client'

import { useChatContext } from '@/hooks/use-chat-context'
import { ChatMessage } from '@/components/chat-message'
import { ChatLoading } from '@/components/chat-loading'
import { useEffect, useRef, useState } from 'react'
import { Button } from './ui/button'
import { ArrowDown, Check, Copy, RefreshCcw } from 'lucide-react'

export function ChatContent() {
  const { messages, isMessagesLoading, reload, isLoading } = useChatContext()
  const [copied, setCopied] = useState(false)
  const [showGoToBottom, setShowGoToBottom] = useState(false)
  const [isAtBottom, setIsAtBottom] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  async function handleCopy() {
    if (messages.length === 0) return null
    try {
      await navigator.clipboard.writeText(messages[messages.length - 1].content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      return null
    }
  }

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
  }, [messages, isMessagesLoading, isAtBottom])

  return (
    <main className="relative mx-auto mt-14 h-full w-full grow md:max-w-3xl md:gap-5 lg:max-w-[40rem] lg:gap-6 xl:max-w-[48rem]">
      <div className="mx-auto flex w-full flex-1 grow flex-col gap-4 p-6 text-base md:max-w-3xl md:gap-5 lg:max-w-[40rem] lg:gap-6 xl:max-w-[48rem]">
        <div className="flex-1 grow">
          <div className="mb-32">
            {!isMessagesLoading ? (
              <>
                {messages.map((message) => (
                  <ChatMessage message={message} key={message.id} />
                ))}

                {!isLoading && (
                  <div className="ml-10 space-x-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={async () => await reload()}
                      className="h-6 w-6 text-xs [&_svg]:size-3.5"
                    >
                      <RefreshCcw />
                    </Button>

                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleCopy}
                      className="h-6 w-6 text-xs [&_svg]:size-3.5"
                    >
                      {copied ? <Check /> : <Copy />}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <ChatLoading />
            )}
            <div ref={chatEndRef}></div>
          </div>
        </div>
      </div>
      {showGoToBottom && !isAtBottom && (
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
