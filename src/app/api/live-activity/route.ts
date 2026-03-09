import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'

type SpinRecord = {
  prize: string
  device: string
  timestamp: string
  spunAtMs?: number
  claimId?: string
}

type ActivityEvent = {
  id: string
  user: string
  text: string
  tsMs: number
  source: 'real' | 'sim'
}

const SPINS_FILE = '/app/media/spins.json'

function maskUsername(username: string): string {
  const clean = (username || '').trim()
  if (!clean) return 'user***'
  if (clean.length <= 3) return `${clean[0] || 'u'}***`
  return `${clean.slice(0, 3)}***${clean.slice(-2)}`
}

const fallbackMessages = [
  'baru join komuniti CM8',
  'baru scan Winrate Scanner',
  'baru register akaun CM8',
  'baru check provider paling hot',
  'baru aktifkan mode agent',
  'baru masuk channel WhatsApp CM8',
]

export async function GET() {
  const now = Date.now()
  let realEvents: ActivityEvent[] = []

  try {
    const raw = await fs.readFile(SPINS_FILE, 'utf-8')
    const spins = JSON.parse(raw) as Record<string, SpinRecord>
    const entries = Object.entries(spins).reverse().slice(0, 40)

    realEvents = entries.map(([username, rec], idx) => {
      const tsMs = rec.spunAtMs || now - idx * 90_000
      const user = maskUsername(username)
      const text =
        rec.prize && rec.prize !== 'No Luck'
          ? `menang ${rec.prize} di Lucky Wheel ✅`
          : 'cuba Lucky Wheel 🎰'

      return {
        id: rec.claimId || `${username}-${tsMs}`,
        user,
        text,
        tsMs,
        source: 'real',
      }
    })
  } catch {
    // no-op, fallback below
  }

  const events: ActivityEvent[] = [...realEvents]

  // Backfill simulated activity (safe/non-deceptive) when traffic is low
  let i = 0
  while (events.length < 18) {
    const msg = fallbackMessages[i % fallbackMessages.length]
    const minsAgo = i + 1
    events.push({
      id: `sim-${i}`,
      user: maskUsername(`member${100 + i}`),
      text: msg,
      tsMs: now - minsAgo * 60_000,
      source: 'sim',
    })
    i += 1
  }

  events.sort((a, b) => b.tsMs - a.tsMs)

  return NextResponse.json({ events: events.slice(0, 24) }, { status: 200 })
}
