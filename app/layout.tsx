import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Jarvis AI',
  description: 'Emotional Voice Companion & Intelligent Assistant'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
