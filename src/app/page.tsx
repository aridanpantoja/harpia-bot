import { ChatForm } from '@/components/chat-form'
import { ChatMessage } from '@/components/chat-message'
import { ChatNavbar } from '@/components/chat-navbar'

const messages = [
  { message: 'Salve! Qual que é a tua duvida?', type: 'bot' },
  {
    message:
      'Tô atrás de saber como criar um Chatbot com dois palitos de dente, meia banana prata e uma caixa de fósforo! Tem como me ajudar?',
    type: 'user',
  },
  { message: 'Claro! Sei exatamente como te ajudar a fazer isso', type: 'bot' },
]

export default function Home() {
  return (
    <div className="flex h-full flex-col">
      <ChatNavbar />
      <div className="mx-auto flex flex-1 grow flex-col gap-4 p-6 text-base md:max-w-3xl md:gap-5 lg:max-w-[40rem] lg:gap-6 xl:max-w-[48rem]">
        <div className="space-y-4 md:space-y-6">
          {messages.map((message, index) => (
            <ChatMessage
              type={message.type as 'user' | 'bot'}
              key={index}
              message={message.message}
            />
          ))}
        </div>

        <ChatForm />
      </div>
    </div>
  )
}
