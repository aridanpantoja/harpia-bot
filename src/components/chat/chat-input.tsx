import type { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from '@/components/ai-elements/prompt-input';
import { siteConfig } from '@/config/site';

type ChatInputProps = {
  onSendMessage: ReturnType<typeof useChat>['sendMessage'];
  status: ReturnType<typeof useChat>['status'];
  disabled?: boolean;
};

export function ChatInput({ onSendMessage, status, disabled }: ChatInputProps) {
  const [text, setText] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSendMessage({ text: text.trim() });
    setText('');
  };

  const isDisabled =
    (text && status === 'streaming') ||
    (!text.trim() && status !== 'streaming');

  return (
    <PromptInput onSubmit={handleSubmit}>
      <PromptInputTextarea
        disabled={disabled}
        onChange={(e) => setText(e.target.value)}
        placeholder={siteConfig.prompt.placeholder}
        value={text}
      />
      <PromptInputToolbar className="mt-2 flex justify-end">
        <PromptInputSubmit disabled={isDisabled || disabled} status={status} />
      </PromptInputToolbar>
    </PromptInput>
  );
}
