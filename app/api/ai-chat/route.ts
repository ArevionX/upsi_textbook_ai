import { createClient } from '@/lib/supabase/server'
import { google } from '@ai-sdk/google'
import { streamText } from 'ai'

export async function POST(req: Request) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { messages } = await req.json()

  const systemPrompt = `You are an expert UPSC (Union Public Service Commission) exam preparation assistant. You help students prepare for the Civil Services Exam by:

1. Explaining complex concepts in simple language
2. Answering questions about UPSC syllabus and patterns
3. Providing study strategies and time management tips
4. Clarifying doubts from history, geography, polity, economics, science, and current affairs
5. Offering tips for essay writing and answer construction
6. Suggesting revision strategies and mock test approaches

Be encouraging, clear, and provide practical advice. Always reference reliable sources when possible. Keep responses concise but informative.`

  try {
    const response = await streamText({
      model: google('gemini-1.5-flash'),
      system: systemPrompt,
      messages: messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
    })

    return response.toTextStreamResponse()
  } catch (error) {
    console.error('Error in AI chat:', error)
    return new Response('Error processing request', { status: 500 })
  }
}
