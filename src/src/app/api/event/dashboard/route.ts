import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import { CURRENT_EVENT, EVENTS_FILE } from '../config'
import type { EventData } from '../config'

const ADMIN_KEY = process.env.DASHBOARD_ADMIN_KEY || 'cm8admin2026'

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key')
  if (key !== ADMIN_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const event = CURRENT_EVENT

  // Load event data
  let allData: Record<string, EventData> = {}
  try {
    if (fs.existsSync(EVENTS_FILE)) {
      allData = JSON.parse(fs.readFileSync(EVENTS_FILE, 'utf-8'))
    }
  } catch {
    allData = {}
  }

  const eventData = allData[event.id] || { winners: 0, plays: [] }

  // Build play records with more info
  const plays = eventData.plays.map((p, idx) => ({
    index: idx + 1,
    fingerprint: p.fingerprint.substring(0, 12) + '...',
    fingerprintFull: p.fingerprint,
    result: p.result,
    boxPicked: p.boxPicked + 1, // 1-indexed for display
    ip: p.ip || 'unknown',
    playerId: p.playerId || '-',
    whatsappNumber: p.whatsappNumber || '-',
    timestamp: new Date(p.timestamp).toLocaleString('ms-MY', { timeZone: 'Asia/Kuala_Lumpur' }),
    timestampMs: p.timestamp,
  }))

  // Sort newest first
  plays.sort((a, b) => b.timestampMs - a.timestampMs)

  // Stats
  const totalPlays = plays.length
  const totalWinners = plays.filter(p => p.result === 'win').length
  const totalLosers = plays.filter(p => p.result === 'lose').length
  const winnersRemaining = Math.max(0, event.maxWinners - totalWinners)

  // Win rate actual
  const actualWinRate = totalPlays > 0 ? ((totalWinners / totalPlays) * 100).toFixed(1) : '0'

  // Per-box breakdown
  const boxStats = Array.from({ length: event.boxes }, (_, i) => {
    const boxPlays = plays.filter(p => p.boxPicked === i + 1)
    return {
      box: i + 1,
      total: boxPlays.length,
      wins: boxPlays.filter(p => p.result === 'win').length,
      losses: boxPlays.filter(p => p.result === 'lose').length,
    }
  })

  // Unique IPs
  const uniqueIPs = new Set(plays.map(p => p.ip)).size

  return NextResponse.json({
    event: {
      id: event.id,
      title: event.title,
      code: event.code,
      prize: event.prize,
      startTime: event.startTime,
      endTime: event.endTime,
      maxWinners: event.maxWinners,
      configuredWinRate: event.winRate,
      active: event.active,
    },
    stats: {
      totalPlays,
      totalWinners,
      totalLosers,
      winnersRemaining,
      actualWinRate,
      uniqueIPs,
      boxStats,
    },
    plays,
  })
}
