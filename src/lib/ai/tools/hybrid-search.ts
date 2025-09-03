import { openai } from '@ai-sdk/openai';
import { embed, tool } from 'ai';
import { sql } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/lib/db/drizzle';

export const hybridSearchTool = tool({
  description:
    'Buscar informações específicas sobre o Processo Seletivo 2025 da UFPA nos documentos oficiais',
  inputSchema: z.object({
    query: z.string().describe('Consulta do usuário sobre o processo seletivo'),
  }),
  execute: async ({ query }) => {
    try {
      const { embedding } = await embed({
        model: openai.textEmbeddingModel('text-embedding-3-small'),
        value: query,
        providerOptions: {
          openai: {
            dimensions: 1536,
          },
        },
      });

      const result = await db.execute(sql`
        SELECT * FROM public.hybrid_search(
          ${query},                                      -- query_text
          ${JSON.stringify(embedding)}::vector,          -- query_embedding
          ${5},                                         -- match_count
          ${1},                                          -- full_text_weight
          ${1},                                          -- semantic_weight
          ${50}                                          -- rrf_k
        );
      `);

      console.log(result);

      return {
        success: true,
        documents: result ?? [],
        total: result.length ?? 0,
      };
    } catch {
      return {
        success: false,
        documents: [],
        total: 0,
      };
    }
  },
});
