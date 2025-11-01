"use client"

export default function ChatLog({ messages }: { messages: Array<{ role: 'user'|'assistant'; content: string }> }) {
  return (
    <div className="bg-white/5 rounded-xl p-4 backdrop-blur border border-white/10 min-h-[320px]">
      <div className="text-sm text-white/70 mb-3">Conversation</div>
      <div className="flex flex-col gap-3 max-h-[420px] overflow-auto pr-2">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'text-cyan-200' : 'text-pink-200'}>
            <span className="uppercase tracking-wider text-[10px] mr-2 opacity-70">{m.role}</span>
            {m.content}
          </div>
        ))}
        {messages.length === 0 && (
          <div className="text-white/50">Say ?Hey Jarvis? and ask for help.</div>
        )}
      </div>
    </div>
  )
}
