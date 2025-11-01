import { NextRequest } from 'next/server'
export const runtime = 'nodejs'
export async function POST(req: NextRequest) {
  return new Response(JSON.stringify({ status: 'ok', message: 'Spotify integration stub' }), { status: 200, headers: { 'Content-Type': 'application/json' } })
}
