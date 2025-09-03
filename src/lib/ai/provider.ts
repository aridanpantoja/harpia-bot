import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';
import { customProvider } from 'ai';

export const myProvider = customProvider({
  languageModels: {
    'chat-flash': google('gemini-2.5-flash'),
    'chat-nano': openai('gpt-5-nano'),
  },
});
