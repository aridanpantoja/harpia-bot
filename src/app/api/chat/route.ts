import { google } from '@ai-sdk/google'
import { streamText } from 'ai'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const model = google('models/gemini-1.5-flash')

  const result = await streamText({
    model,
    messages,
  })

  return result.toDataStreamResponse()
}
