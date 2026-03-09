import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import { LUCKY_PICK_FILE, LuckyPickData, PRIZES } from '../config'

const ADMIN_KEY = 'cm8admin2026'

function getTodayMY(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kuala_Lumpur' })
}

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key')
  if (key !== ADMIN_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    let data: LuckyPickData = { plays: [] }
    if (fs.existsSync(LUCKY_PICK_FILE)) {
      data = JSON.parse(fs.readFileSync(LUCKY_PICK_FILE, 'utf-8'))
    }

    const today = getTodayMY()
    const plays = data.plays.map((p, i) => ({
      index: i + 1,
      userId: p.userId,
      phone: p.phone,
      prize: p.prize,
      prizeValue: p.prizeValue,
      cardPicked: p.cardPicked + 1,
      ip: p.ip || 'unknown',
      timestamp: new Date(p.timestamp).toLocaleString('ms-MY', { timeZone: 'Asia/Kuala_Lumpur' }),
      timestampMs: p.timestamp,
      claimed: p.claimed,
      isToday: new Date(p.timestamp).toLocaleDateString('en-CA', { timeZone: 'Asia/Kuala_Lumpur' }) === today,
    }))

    const totalPlays = plays.length
    const winners = plays.filter(p => p.prizeValue > 0)
    const todayPlays = plays.filter(p => p.isToday)
    const todayWinners = todayPlays.filter(p => p.prizeValue > 0)

    const uniqueUsers = new Set(data.plays.map(p => p.userId)).size
    const uniqueIPs = new Set(data.plays.map(p => p.ip)).size

    const prizeBreakdown = PRIZES.map(pr => ({
      label: pr.label,
      emoji: pr.emoji,
      count: data.plays.filter(p => p.prize === pr.label).length,
      todayCount: data.plays.filter(p => {
        const d = new Date(p.timestamp).toLocaleDateString('en-CA', { timeZone: 'Asia/Kuala_Lumpur' })
        return p.prize === pr.label && d === today
      }).length,
    }))

    return NextResponse.json({
      plays: plays.reverse(),
      stats: {
        totalPlays,
        totalWinners: winners.length,
        todayPlays: todayPlays.length,
        todayWinners: todayWinners.length,
        uniqueUsers,
        uniqueIPs,
        prizeBreakdown,
      },
    })
  } catch (err) {
    console.error('Dashboard error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
