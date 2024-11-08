import { PROMPT } from '@/lib/prompt'
import { google } from '@ai-sdk/google'
import { streamText } from 'ai'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const model = google('models/gemini-1.5-flash')

  const result = await streamText({
    model,
    system: PROMPT,
    messages,
  })

  return result.toDataStreamResponse()
}
