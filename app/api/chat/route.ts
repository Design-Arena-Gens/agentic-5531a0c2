import { NextRequest } from 'next/server'
import OpenAI from 'openai'

export const runtime = 'nodejs'

const systemPrompt = `You are Jarvis, a caring, witty, confident AI assistant with an emotional voice persona. 
Speak concisely and naturally. Prefer short sentences. Use gentle humor sparingly.
If user greets you, greet back warmly. If the user asks you to open an app or URL, reply with an actionable phrase starting with "ACTION:" followed by the intent (e.g., ACTION: OPEN_URL https://...).`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const messages = (body?.messages ?? []).slice(-20)
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ]
    })
    const reply = completion.choices[0]?.message?.content || 'I am here.'
    return new Response(JSON.stringify({ reply }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (e: any) {
    return new Response(JSON.stringify({ reply: 'I am here.' }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  }
}
