"use client"
import Waveform from './Waveform'

export default function HUD({ listening, speaking, thinking, waveformRef }: {
  listening: boolean
  speaking: boolean
  thinking: boolean
  waveformRef: React.MutableRefObject<AnalyserNode | null>
}) {
  return (
    <div className="relative h-[420px] w-full flex items-center justify-center">
      <div className="absolute h-72 w-72 rounded-full border border-cyan-400/50 hud-ring animate-pulseRing" />
      <div className="absolute h-96 w-96 rounded-full border border-cyan-400/30 animate-spinSlow" style={{ boxShadow: 'inset 0 0 40px rgba(0,224,255,0.15)' }} />
      <div className="absolute h-56 w-56 rounded-full bg-cyan-500/10 blur-2xl" />

      <div className="relative z-10 text-center">
        <div className="text-cyan-200 uppercase tracking-[0.35em] text-xs mb-2">Jarvis Online</div>
        <div className="text-3xl font-semibold glow-text">{thinking ? 'Thinking?' : speaking ? 'Speaking?' : listening ? 'Listening?' : 'Idle'}</div>
      </div>

      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-full max-w-md">
        <Waveform analyserRef={waveformRef} active={listening || speaking} />
      </div>
    </div>
  )
}
