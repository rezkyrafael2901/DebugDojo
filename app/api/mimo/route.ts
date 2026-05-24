import { NextRequest } from 'next/server'

export const runtime = 'nodejs'

const endpoint = process.env.MIMO_ENDPOINT || 'https://token-plan-sgp.xiaomimimo.com/v1'
const model = process.env.MIMO_MODEL || 'mimo-v2.5-pro'

export async function POST(req: NextRequest) {
  try {
    const { messages, temperature = 0.75, maxTokens = 900, mode = 'stream' } = await req.json()
    const apiKey = process.env.MIMO_API_KEY
    if (!apiKey) return new Response('MIMO_API_KEY not configured', { status: 500 })

    const res = await fetch(`${endpoint}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
      body: JSON.stringify({ model, messages, temperature, max_tokens: maxTokens, stream: mode === 'stream' }),
    })

    if (!res.ok) {
      const text = await res.text()
      return new Response(`MiMo error ${res.status}: ${text.slice(0, 300)}`, { status: res.status })
    }

    if (mode === 'json') {
      const data = await res.json()
      return Response.json(data)
    }

    return new Response(res.body, {
      headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' },
    })
  } catch (error) {
    return new Response(error instanceof Error ? error.message : 'Server error', { status: 500 })
  }
}
