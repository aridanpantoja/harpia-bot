/** biome-ignore-all lint/suspicious/noConsole: testing */
import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';
import { auth } from '@clerk/nextjs/server';
import {
  convertToModelMessages,
  createUIMessageStream,
  JsonToSseTransformStream,
  smoothStream,
  stepCountIs,
  streamText,
  type UIMessage,
} from 'ai';
import { SYSTEM_PROMPT } from '@/config/prompt';
import { hybridSearchTool } from '@/lib/ai/tools/hybrid-search';
import {
  convertToUIMessages,
  generateTitleFromUserMessage,
} from '@/lib/ai/utils';
import {
  getChatById,
  getMessageCountByUserId,
  getMessagesByChatId,
  saveChat,
  saveMessages,
} from '@/lib/db/queries';
import type { DBMessage } from '@/lib/db/schema';
import { generateUUID } from '@/lib/utils';

export const maxDuration = 30;
export const MAX_MESSAGES_PER_DAY = 50;

type PostRequestBody = {
  chatId: string;
  message: UIMessage;
};

// Função helper para logging com timing
const logWithTiming = (startTime: number, message: string) => {
  console.log(`[+${Date.now() - startTime}ms] ${message}`);
};

export async function POST(req: Request) {
  const startTime = Date.now();
  logWithTiming(startTime, '🚀 Iniciando rota /api/chat');

  const { message, chatId }: PostRequestBody = await req.json();
  logWithTiming(startTime, '✅ Request parseado');

  const { userId } = await auth();
  logWithTiming(startTime, `🔐 Auth validado - userId: ${userId}`);

  if (!userId) {
    logWithTiming(startTime, '❌ Unauthorized');
    return new Response('Unauthorized', { status: 401 });
  }

  // OTIMIZAÇÃO 1: Paralelizar queries do DB
  const dbStartTime = Date.now();
  const [messageCount, chat] = await Promise.all([
    getMessageCountByUserId({ id: userId, differenceInHours: 24 }),
    getChatById({ id: chatId }),
  ]);
  logWithTiming(
    startTime,
    `📊 Queries DB completadas em ${Date.now() - dbStartTime}ms`
  );
  logWithTiming(
    startTime,
    `📊 messageCount: ${messageCount}, chat: ${chat ? 'exists' : 'new'}`
  );

  if (messageCount > MAX_MESSAGES_PER_DAY) {
    logWithTiming(startTime, '⚠️ Rate limit exceeded');
    return new Response('Rate limit exceeded', { status: 429 });
  }

  if (chat && chat.userId !== userId) {
    logWithTiming(startTime, '🚫 Forbidden');
    return new Response('Forbidden', { status: 403 });
  }

  // Verificar se é um chat novo (será salvo apenas no onFinish)
  const isNewChat = !chat;
  logWithTiming(
    startTime,
    `📋 Chat status: ${isNewChat ? 'NOVO (será salvo no final)' : 'EXISTENTE'}`
  );

  // Preparar mensagem do usuário
  const userMessage = {
    id: message.id,
    chatId,
    parts: message.parts,
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
  } satisfies DBMessage;

  // OTIMIZAÇÃO 3: Carregar mensagens em paralelo
  const messagesStartTime = Date.now();
  const messagesFromDb = await getMessagesByChatId({ id: chatId });
  logWithTiming(
    startTime,
    `📜 Mensagens carregadas em ${Date.now() - messagesStartTime}ms: ${messagesFromDb.length} mensagens`
  );

  const uiMessages = [...convertToUIMessages(messagesFromDb), message];
  logWithTiming(
    startTime,
    `🔄 Mensagens convertidas: ${uiMessages.length} total`
  );

  // NOVA LÓGICA: Mensagem do usuário será salva apenas no onFinish
  logWithTiming(
    startTime,
    '⏳ Mensagem do usuário será salva ao final da stream'
  );

  // OTIMIZAÇÃO 4: Debug detalhado do stream
  logWithTiming(startTime, '🤖 Iniciando stream com modelo OpenAI...');

  const streamStartTime = Date.now();
  const stream = createUIMessageStream({
    execute: ({ writer: dataStream }) => {
      logWithTiming(
        startTime,
        `⚡ Executando streamText em ${Date.now() - streamStartTime}ms...`
      );

      const result = streamText({
        model: openai('gpt-3.5-turbo'), //google('gemini-2.5-flash'),
        system: SYSTEM_PROMPT,
        messages: convertToModelMessages(uiMessages),
        stopWhen: stepCountIs(10),
        experimental_transform: smoothStream({ chunking: 'word' }),
        tools: {
          hybridSearchTool,
        },
        onFinish: ({ usage }) => {
          logWithTiming(
            startTime,
            `🏁 Modelo finalizado - tokens: ${usage?.totalTokens || 'unknown'}`
          );
        },
      });

      result.consumeStream();
      logWithTiming(
        startTime,
        `🌊 Stream iniciado e consumindo em ${Date.now() - streamStartTime}ms...`
      );

      dataStream.merge(
        result.toUIMessageStream({
          sendReasoning: false,
        })
      );
    },
    generateId: generateUUID,
    onFinish: async ({ responseMessage }) => {
      const finishStartTime = Date.now();
      logWithTiming(startTime, '✅ Stream finalizado, salvando resposta...');

      try {
        // NOVA LÓGICA: Salvar chat primeiro se for novo
        if (isNewChat) {
          logWithTiming(startTime, '📝 Chat novo detectado, gerando título...');
          const titleStartTime = Date.now();

          try {
            const title = await generateTitleFromUserMessage({
              message: JSON.stringify(message),
            });
            logWithTiming(
              startTime,
              `📝 Título gerado em ${Date.now() - titleStartTime}ms: "${title}"`
            );

            await saveChat({
              id: chatId,
              title,
              userId,
            });
            logWithTiming(startTime, '💾 Chat salvo no DB');
          } catch (error) {
            console.error('Erro ao gerar título:', error);
            // Fallback: salvar com título padrão
            await saveChat({
              id: chatId,
              title: 'Nova Conversa',
              userId,
            });
            logWithTiming(startTime, '💾 Chat salvo com título padrão');
          }
        }

        // Salvar mensagem do usuário e resposta do modelo juntas
        const messagesToSave = [
          // Mensagem do usuário
          userMessage,
          // Resposta do modelo
          {
            id: responseMessage.id,
            role: responseMessage.role,
            parts: responseMessage.parts,
            createdAt: new Date(),
            updatedAt: new Date(),
            chatId,
          },
        ];

        await saveMessages({ messages: messagesToSave });
        logWithTiming(
          startTime,
          `🏁 Mensagens salvas (usuário + modelo) em ${Date.now() - finishStartTime}ms`
        );
        logWithTiming(
          startTime,
          `🎉 PROCESSO COMPLETO - Total: ${Date.now() - startTime}ms`
        );
      } catch (error) {
        console.error('Erro ao salvar resposta:', error);
        // Se falhou ao salvar e é um chat novo, tentar rollback seria ideal
        if (isNewChat) {
          console.error('⚠️ Chat novo não foi salvo devido ao erro');
        }
      }
    },
    onError: (error) => {
      logWithTiming(startTime, `❌ Erro no stream: ${error}`);
      console.error('Erro detalhado:', error);
      return 'Oops, an error occurred!';
    },
  });

  logWithTiming(startTime, '📤 Retornando stream response');
  return new Response(stream.pipeThrough(new JsonToSseTransformStream()));
}
