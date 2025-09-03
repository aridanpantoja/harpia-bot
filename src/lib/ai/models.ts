export const DEFAULT_CHAT_MODEL: string = 'chat-model';

export interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: ChatModel[] = [
  {
    id: 'chat-flash',
    name: 'Chat Flash',
    description: 'Model for all-purpose chat',
  },
  {
    id: 'chat-nano',
    name: 'Chat Nano',
    description: 'Model for all-purpose chat',
  },
];
