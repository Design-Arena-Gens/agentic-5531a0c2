"use client"
import { useCallback, useEffect, useRef, useState } from 'react'

type UseSpeechIOArgs = { hotword: string }

type WebkitRecognition = typeof window extends any ? any : never

export function useSpeechIO({ hotword }: UseSpeechIOArgs) {
  const waveformRef = useRef<AnalyserNode | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const recognitionRef = useRef<WebkitRecognition | null>(null)
  const [hotwordHeard, setHotwordHeard] = useState(false)
  const [lastTranscript, setLastTranscript] = useState('')
  const [isSpeaking, setIsSpeaking] = useState(false)

  // Setup audio analyser for waveform
  const ensureAnalyser = useCallback(async () => {
    if (typeof window === 'undefined') return
    if (audioContextRef.current && waveformRef.current) return
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaStreamRef.current = stream
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    audioContextRef.current = ctx
    const source = ctx.createMediaStreamSource(stream)
    const analyser = ctx.createAnalyser()
    analyser.fftSize = 1024
    source.connect(analyser)
    waveformRef.current = analyser
  }, [])

  // Setup speech recognition
  const setupRecognition = useCallback(() => {
    const WSR: any = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    if (!WSR) return null
    const rec = new WSR()
    rec.lang = 'en-US'
    rec.continuous = true
    rec.interimResults = true
    rec.onresult = (ev: any) => {
      const idx = ev.resultIndex
      const res = ev.results[idx]
      const transcript = res[0]?.transcript || ''
      const text = transcript.toLowerCase()
      setLastTranscript(transcript)
      if (text.includes(hotword.toLowerCase())) {
        setHotwordHeard(true)
        // reset flag after a tick to allow re-trigger
        setTimeout(() => setHotwordHeard(false), 600)
      }
    }
    rec.onend = () => {
      try { rec.start() } catch {}
    }
    recognitionRef.current = rec
    return rec
  }, [hotword])

  const startListening = useCallback(async () => {
    await ensureAnalyser()
    if (!recognitionRef.current) setupRecognition()
    try { recognitionRef.current?.start() } catch {}
  }, [ensureAnalyser, setupRecognition])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
  }, [])

  const speak = useCallback(async (text: string) => {
    // Try ElevenLabs through API first
    try {
      const res = await fetch('/api/tts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) })
      if (res.ok) {
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const audio = new Audio(url)
        setIsSpeaking(true)
        await audio.play()
        await new Promise<void>((resolve) => {
          audio.onended = () => { setIsSpeaking(false); resolve() }
          audio.onerror = () => { setIsSpeaking(false); resolve() }
        })
        URL.revokeObjectURL(url)
        return
      }
    } catch {}

    // Fallback: Web Speech Synthesis
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = 'en-US'
    utter.rate = 1.02
    utter.pitch = 1.05
    setIsSpeaking(true)
    utter.onend = () => setIsSpeaking(false)
    speechSynthesis.speak(utter)
  }, [])

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop()
      mediaStreamRef.current?.getTracks().forEach(t => t.stop())
      audioContextRef.current?.close()
    }
  }, [])

  return { waveformRef, hotwordHeard, lastTranscript, isSpeaking, startListening, stopListening, speak }
}
