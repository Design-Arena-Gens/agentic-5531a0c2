import { NextRequest } from 'next/server'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json()
    const elevenKey = process.env.ELEVENLABS_API_KEY
    const voiceId = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM' // default voice
    if (!elevenKey) return new Response('No TTS key', { status: 204 })
    const resp = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': elevenKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text,
        voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.4 },
        model_id: 'eleven_multilingual_v2'
      })
    })
    if (!resp.ok) return new Response('TTS failed', { status: 500 })
    const buf = Buffer.from(await resp.arrayBuffer())
    return new Response(buf, { status: 200, headers: { 'Content-Type': 'audio/mpeg' } })
  } catch (e) {
    return new Response('err', { status: 500 })
  }
}
