import { PROMPT } from '@/lib/prompt'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { streamText } from 'ai'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    baseURL: process.env.CLOUDFLARE_AI_GATEWAY_URL,
  })

  const model = google('gemini-1.5-flash-latest')

  const result = await streamText({
    model,
    system: PROMPT,
    messages,
  })

  return result.toDataStreamResponse()
}
