import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import { getUserFromCookie, getDbClient } from '@/lib/auth'
import {
  pickPrize, FOMO_PRIZES, LUCKY_PICK_FILE,
  TELEGRAM_BOT_TOKEN, MAINTENANCE_GROUP_ID,
  LuckyPickRecord, LuckyPickData,
} from '../config'

function loadData(): LuckyPickData {
  try {
    if (fs.existsSync(LUCKY_PICK_FILE)) {
      return JSON.parse(fs.readFileSync(LUCKY_PICK_FILE, 'utf-8'))
    }
  } catch {}
  return { plays: [] }
}

function saveData(data: LuckyPickData) {
  const dir = LUCKY_PICK_FILE.substring(0, LUCKY_PICK_FILE.lastIndexOf('/'))
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(LUCKY_PICK_FILE, JSON.stringify(data, null, 2))
}

function getTodayMY(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kuala_Lumpur' })
}

async function notifyTelegram(record: LuckyPickRecord) {
  if (!TELEGRAM_BOT_TOKEN || record.prizeValue === 0) return
  const lines = [
    '\u{1F0CF} *LUCKY PICK WINNER!*',
    '',
    'Phone: ' + record.phone,
    'Prize: *' + record.prize + '*',
    'Value: RM' + record.prizeValue,
    'Card: #' + (record.cardPicked + 1),
    'Time: ' + new Date(record.timestamp).toLocaleString('ms-MY', { timeZone: 'Asia/Kuala_Lumpur' }),
  ]
  try {
    await fetch(
      'https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/sendMessage',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: MAINTENANCE_GROUP_ID,
          text: lines.join('\n'),
          parse_mode: 'Markdown',
        }),
      }
    )
  } catch {}
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromCookie()
    if (!user) {
      return NextResponse.json({ error: 'Sila login terlebih dahulu' }, { status: 401 })
    }

    const { cardPicked } = await req.json()
    if (typeof cardPicked !== 'number' || cardPicked < 0 || cardPicked > 8) {
      return NextResponse.json({ error: 'Kad tidak sah' }, { status: 400 })
    }

    // Must have checked in today to play Lucky Pick
    const today = getTodayMY()
    let checkedInToday = false
    try {
      const client = getDbClient()
      await client.connect()
      try {
        const result = await client.query(
          'SELECT 1 FROM cm8_checkins WHERE user_id = $1 AND checkin_date = $2 LIMIT 1',
          [user.userId, today]
        )
        checkedInToday = result.rows.length > 0
      } finally {
        await client.end()
      }
    } catch (e) {
      console.error('Check-in verify error:', e)
    }

    if (!checkedInToday) {
      return NextResponse.json({
        error: 'Sila check-in harian terlebih dahulu sebelum bermain Lucky Pick!',
        needCheckin: true,
      }, { status: 403 })
    }

    const data = loadData()

    const alreadyPlayed = data.plays.some(p => {
      const playDate = new Date(p.timestamp).toLocaleDateString('en-CA', { timeZone: 'Asia/Kuala_Lumpur' })
      return p.userId === user.userId && playDate === today
    })

    if (alreadyPlayed) {
      return NextResponse.json({
        error: 'Anda sudah bermain hari ini! Cuba lagi esok \u{1F0CF}',
        alreadyPlayed: true,
      }, { status: 429 })
    }

    const prize = pickPrize()

    const shuffledFomo = [...FOMO_PRIZES].sort(() => Math.random() - 0.5)
    const fomoCards: { index: number; label: string }[] = []
    let fomoIdx = 0
    for (let i = 0; i < 9; i++) {
      if (i !== cardPicked) {
        fomoCards.push({ index: i, label: shuffledFomo[fomoIdx++] })
      }
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') || 'unknown'

    const record: LuckyPickRecord = {
      userId: user.userId,
      phone: user.phone,
      prize: prize.label,
      prizeValue: prize.value,
      cardPicked,
      fomoCards,
      timestamp: Date.now(),
      ip,
      claimed: false,
    }

    data.plays.push(record)
    saveData(data)

    notifyTelegram(record)

    return NextResponse.json({
      prize: prize.label,
      prizeValue: prize.value,
      prizeColor: prize.color,
      prizeEmoji: prize.emoji,
      fomoCards,
      isWinner: prize.value > 0,
    })
  } catch (err) {
    console.error('Lucky Pick play error:', err)
    return NextResponse.json({ error: 'Ralat server. Cuba lagi.' }, { status: 500 })
  }
}
