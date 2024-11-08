'use client'

import { useChatContext } from '@/providers/chat-provider'
import { ChatMessage } from '@/components/chat-message'
import { ChatLoading } from '@/components/chat-loading'

export function ChatContent() {
  const { messages, isLoading } = useChatContext()

  return (
    <main className="mx-auto h-full w-full grow md:max-w-3xl md:gap-5 lg:max-w-[40rem] lg:gap-6 xl:max-w-[48rem]">
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
          </div>
        </div>
      </div>
    </main>
  )
}
