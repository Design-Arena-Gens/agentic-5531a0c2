"use client"
import { useEffect, useMemo, useRef, useState } from 'react'
import HUD from '../components/HUD'
import ChatLog from '../components/ChatLog'
import Controls from '../components/Controls'
import { useSpeechIO } from '../lib/speech'
import { MemoryStore } from '../lib/memory'
import { saveMessage, loadMessages } from '../lib/memory'

export default function Home() {
  const [messages, setMessages] = useState<Array<{ role: 'user'|'assistant'; content: string }>>([])
  const [listening, setListening] = useState(false)
  const [thinking, setThinking] = useState(false)
  const memory = useMemo(() => new MemoryStore('jarvis-memory'), [])
  const { startListening, stopListening, isSpeaking, speak, waveformRef, hotwordHeard, lastTranscript } = useSpeechIO({ hotword: 'hey jarvis' })

  useEffect(() => {
    loadMessages(memory).then(setMessages).catch(() => {})
  }, [memory])

  useEffect(() => {
    if (!hotwordHeard) return
    if (lastTranscript.trim().length === 0) return
    void handleUserInput(lastTranscript)
  }, [hotwordHeard])

  async function handleUserInput(text: string) {
    const input = text.replace(/^(hey\s+)?jarvis[,\s]*/i, '').trim()
    if (!input) return
    const updated = [...messages, { role: 'user' as const, content: input }]
    setMessages(updated)
    await saveMessage(memory, { role: 'user', content: input })
    setThinking(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated })
      })
      const data = await res.json()
      const reply: string = data.reply || 'I am here.'
      const finalMsgs = [...updated, { role: 'assistant' as const, content: reply }]
      setMessages(finalMsgs)
      await saveMessage(memory, { role: 'assistant', content: reply })
      await speak(reply)
    } catch (e) {
      console.error(e)
    } finally {
      setThinking(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <HUD listening={listening} speaking={isSpeaking} thinking={thinking} waveformRef={waveformRef} />
        <div className="flex flex-col gap-4">
          <Controls
            onStart={() => { startListening(); setListening(true) }}
            onStop={() => { stopListening(); setListening(false) }}
            onSubmit={handleUserInput}
          />
          <ChatLog messages={messages} />
        </div>
      </div>
    </main>
  )
}
