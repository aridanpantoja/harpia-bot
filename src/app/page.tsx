import { ChatContent } from '@/components/chat-content'
import { ChatInput } from '@/components/chat-input'
import { ChatNavbar } from '@/components/chat-navbar'

export default function Home() {
  return (
    <div className="flex h-full flex-col">
      <ChatNavbar />
      <ChatContent />
      <ChatInput />
    </div>
  )
}
