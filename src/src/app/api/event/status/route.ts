import { NextResponse } from 'next/server'
import fs from 'fs'
import { CURRENT_EVENT, EVENTS_FILE } from '../config'

/**
 * GET /api/event/status
 * Returns current event status (public — no sensitive data)
 */
export async function GET() {
  const event = CURRENT_EVENT

  if (!event.active) {
    return NextResponse.json({ active: false })
  }

  const now = new Date()
  const start = new Date(event.startTime)
  const end = new Date(event.endTime)

  let status: 'upcoming' | 'active' | 'ended'
  if (now < start) status = 'upcoming'
  else if (now > end) status = 'ended'
  else status = 'active'

  // Load play data
  let totalPlays = 0
  let totalWinners = 0
  try {
    if (fs.existsSync(EVENTS_FILE)) {
      const data = JSON.parse(fs.readFileSync(EVENTS_FILE, 'utf-8'))
      if (data[event.id]) {
        totalPlays = data[event.id].plays?.length || 0
        totalWinners = data[event.id].winners || 0
      }
    }
  } catch {
    // ignore
  }

  return NextResponse.json({
    active: true,
    status,
    title: event.title,
    prize: event.prize,
    startTime: event.startTime,
    endTime: event.endTime,
    maxWinners: event.maxWinners,
    winnersRemaining: Math.max(0, event.maxWinners - totalWinners),
    totalPlays,
    totalWinners,
    boxes: event.boxes,
    claimMinutes: event.claimMinutes,
  })
}
