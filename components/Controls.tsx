"use client"
import { useState } from 'react'

export default function Controls({ onStart, onStop, onSubmit }: { onStart: () => void, onStop: () => void, onSubmit: (text: string) => void }) {
  const [text, setText] = useState('')
  return (
    <div className="bg-white/5 rounded-xl p-4 backdrop-blur border border-white/10 flex flex-col gap-3">
      <div className="flex gap-3">
        <button onClick={onStart} className="px-4 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40">Start Listening</button>
        <button onClick={onStop} className="px-4 py-2 rounded-lg bg-pink-500/20 hover:bg-pink-500/30 border border-pink-400/40">Stop</button>
      </div>
      <div className="flex gap-2">
        <input value={text} onChange={e=>setText(e.target.value)} placeholder="Type a command" className="flex-1 bg-black/30 border border-white/10 rounded-md px-3 py-2 outline-none focus:border-cyan-400/50" />
        <button onClick={()=>{ if(!text.trim()) return; onSubmit(text); setText('') }} className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 border border-white/20">Send</button>
      </div>
    </div>
  )
}
