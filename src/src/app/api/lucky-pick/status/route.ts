import { NextResponse } from 'next/server'
import fs from 'fs'
import { LUCKY_PICK_FILE, LuckyPickData, PRIZES } from '../config'

function getTodayMY(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kuala_Lumpur' })
}

export async function GET() {
  try {
    let totalPlays = 0
    let todayPlays = 0
    let todayWinners = 0
    const today = getTodayMY()

    if (fs.existsSync(LUCKY_PICK_FILE)) {
      const data: LuckyPickData = JSON.parse(fs.readFileSync(LUCKY_PICK_FILE, 'utf-8'))
      totalPlays = data.plays.length
      for (const p of data.plays) {
        const playDate = new Date(p.timestamp).toLocaleDateString('en-CA', { timeZone: 'Asia/Kuala_Lumpur' })
        if (playDate === today) {
          todayPlays++
          if (p.prizeValue > 0) todayWinners++
        }
      }
    }

    return NextResponse.json({
      active: true,
      totalPlays,
      todayPlays,
      todayWinners,
      prizes: PRIZES.map(p => ({ label: p.label, emoji: p.emoji })),
    })
  } catch {
    return NextResponse.json({ active: false })
  }
}
