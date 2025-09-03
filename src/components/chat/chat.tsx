'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { generateUUID } from '@/lib/utils';
import { WidthWrapper } from '../common/width-wrapper';
import { ChatHeader } from './chat-header';
import { ChatInput } from './chat-input';
import { Conversation } from './conversation';
import { OnBoarding } from './on-boarding';

type ChatProps = {
  chatId: string;
  initialMessages: UIMessage[];
  userId: string | null;
};

export function Chat({ chatId, initialMessages, userId }: ChatProps) {
  const { messages, status, sendMessage } = useChat({
    id: chatId,
    messages: initialMessages,
    generateId: generateUUID,
    transport: new DefaultChatTransport({
      api: '/api/chat',
      prepareSendMessagesRequest({ messages: chatMessages, id, body }) {
        return {
          body: {
            chatId: id,
            message: chatMessages.at(-1),
            ...body,
          },
        };
      },
    }),
    onError: () => {
      toast.error('Algo deu errado! Desculpe pelo inconveniente.');
    },
  });

  useEffect(() => {
    if (userId && messages.length === 1) {
      window.history.replaceState({}, '', `/c/${chatId}`);
    }
  }, [messages, chatId, userId]);

  const showOnboarding = messages.length === 0 || !messages;

  return (
    <div className="flex h-full min-h-screen min-w-0 flex-1 flex-col bg-background">
      <ChatHeader />

      <WidthWrapper className="flex h-full max-w-3xl flex-1 flex-col">
        <div className="relative flex flex-1 flex-col gap-6 pt-16">
          {showOnboarding ? (
            <OnBoarding onSendMessage={sendMessage} />
          ) : (
            <Conversation chatId={chatId} messages={messages} />
          )}
        </div>

        <div className="sticky bottom-0 z-50 w-full rounded-t-2xl bg-background pb-4">
          <ChatInput
            disabled={!userId}
            onSendMessage={sendMessage}
            status={status}
          />
        </div>
      </WidthWrapper>
    </div>
  );
}
