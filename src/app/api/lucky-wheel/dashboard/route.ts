import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const MEDIA_DIR = path.join(process.cwd(), 'media')
const SPINS_FILE = path.join(MEDIA_DIR, 'spins.json')

// Simple admin password check via query param
const ADMIN_KEY = process.env.DASHBOARD_ADMIN_KEY || 'cm8admin2026'

type SpinRecord = {
  prize: string
  device: string
  timestamp: string
  spunAtMs?: number
  claimId?: string
}

async function getSpins(): Promise<Record<string, SpinRecord>> {
  try {
    const data = await fs.readFile(SPINS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return {}
  }
}

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key')
  if (key !== ADMIN_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const spins = await getSpins()
  const entries = Object.entries(spins).map(([username, rec]) => ({
    username,
    prize: rec.prize,
    device: rec.device,
    timestamp: rec.timestamp,
    spunAtMs: rec.spunAtMs || 0,
    claimId: rec.claimId || '',
  }))

  // Sort by time descending (newest first)
  entries.sort((a, b) => b.spunAtMs - a.spunAtMs)

  // Stats
  const total = entries.length
  const noLuck = entries.filter(e => e.prize === 'No Luck').length
  const rm10 = entries.filter(e => e.prize === 'RM10').length
  const rm30 = entries.filter(e => e.prize === 'RM30').length
  const rm50 = entries.filter(e => e.prize === 'RM50').length
  const rm100 = entries.filter(e => e.prize === 'RM100').length

  return NextResponse.json({
    stats: { total, noLuck, rm10, rm30, rm50, rm100, winners: total - noLuck },
    spins: entries,
  })
}
