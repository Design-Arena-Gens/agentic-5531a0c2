"use client"
import { useEffect, useRef } from 'react'

export default function Waveform({ analyserRef, active }: { analyserRef: React.MutableRefObject<AnalyserNode | null>, active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    let raf = 0
    function draw() {
      const canvas = canvasRef.current
      const analyser = analyserRef.current
      if (!canvas || !analyser) { raf = requestAnimationFrame(draw); return }
      const ctx = canvas.getContext('2d')
      if (!ctx) { raf = requestAnimationFrame(draw); return }
      const w = canvas.width = canvas.clientWidth
      const h = canvas.height = 120
      ctx.clearRect(0,0,w,h)
      const data = new Uint8Array(analyser.frequencyBinCount)
      analyser.getByteTimeDomainData(data)
      ctx.strokeStyle = 'rgba(0,224,255,0.9)'
      ctx.lineWidth = 2
      ctx.beginPath()
      for (let i=0; i<data.length; i++) {
        const x = (i / (data.length-1)) * w
        const y = (data[i] / 255) * h
        if (i===0) ctx.moveTo(x,y)
        else ctx.lineTo(x,y)
      }
      ctx.stroke()
      raf = requestAnimationFrame(draw)
    }
    if (active) raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [active, analyserRef])

  return <canvas ref={canvasRef} className="w-full h-[120px]" />
}
