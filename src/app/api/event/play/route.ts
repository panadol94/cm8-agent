import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import { CURRENT_EVENT, EVENTS_FILE, TELEGRAM_BOT_TOKEN, MAINTENANCE_GROUP_ID } from '../config'
import type { EventData, PlayRecord } from '../config'

/**
 * POST /api/event/play
 * Body: { code: string, fingerprint: string, boxPicked: number, playerId: string, whatsappNumber: string }
 *
 * Server-side prize determination. Checks fingerprint, determines win/lose, records play.
 */
export async function POST(req: NextRequest) {
  try {
    const { code, fingerprint, boxPicked, playerId, whatsappNumber } = await req.json()

    // Basic validation
    if (!code || !fingerprint || boxPicked === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!playerId || !playerId.trim()) {
      return NextResponse.json({ error: 'Sila masukkan ID Player CM8' }, { status: 400 })
    }

    const whatsapp = String(whatsappNumber || '').trim()
    const whatsappDigits = whatsapp.replace(/\D/g, '')
    if (!whatsappDigits || whatsappDigits.length < 10 || whatsappDigits.length > 15) {
      return NextResponse.json({ error: 'Sila masukkan nombor WhatsApp yang sah' }, { status: 400 })
    }

    const event = CURRENT_EVENT

    // Validate code
    if (code.toUpperCase().trim() !== event.code) {
      return NextResponse.json({ error: 'Kod event tidak sah!' }, { status: 400 })
    }

    // Check active & timing
    if (!event.active) {
      return NextResponse.json({ error: 'Event tidak aktif' }, { status: 400 })
    }

    const now = new Date()
    const start = new Date(event.startTime)
    const end = new Date(event.endTime)

    if (now < start || now > end) {
      return NextResponse.json({ error: 'Event tidak dalam waktu aktif' }, { status: 400 })
    }

    // Validate box number
    if (boxPicked < 0 || boxPicked >= event.boxes) {
      return NextResponse.json({ error: 'Invalid box selection' }, { status: 400 })
    }

    // Load or create event data
    let allData: Record<string, EventData> = {}
    try {
      if (fs.existsSync(EVENTS_FILE)) {
        allData = JSON.parse(fs.readFileSync(EVENTS_FILE, 'utf-8'))
      }
    } catch {
      allData = {}
    }

    if (!allData[event.id]) {
      allData[event.id] = { winners: 0, plays: [] }
    }

    const eventData = allData[event.id]

    // Check if fingerprint already played (server-side enforcement)
    const alreadyPlayed = eventData.plays.some(p => p.fingerprint === fingerprint)
    if (alreadyPlayed) {
      return NextResponse.json({ 
        error: 'Anda sudah bermain! Satu percubaan sahaja.',
        alreadyPlayed: true 
      }, { status: 400 })
    }

    // Determine result
    let result: 'win' | 'lose'
    
    if (eventData.winners >= event.maxWinners) {
      // Max winners reached — always lose
      result = 'lose'
    } else {
      // Random based on win rate
      const roll = Math.random() * 100
      result = roll < event.winRate ? 'win' : 'lose'
    }

    // Get client IP for tracking
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
               req.headers.get('x-real-ip') || 
               'unknown'

    // Record play
    const play: PlayRecord = {
      fingerprint,
      timestamp: Date.now(),
      result,
      boxPicked,
      ip,
      playerId: playerId.trim(),
      whatsappNumber: whatsappDigits,
    }

    eventData.plays.push(play)
    if (result === 'win') {
      eventData.winners++
    }

    // Save to file
    try {
      fs.writeFileSync(EVENTS_FILE, JSON.stringify(allData, null, 2), 'utf-8')
    } catch (err) {
      console.error('Failed to write events file:', err)
      // Still return result even if save fails
    }

    // Send Telegram notification for winners
    if (result === 'win' && TELEGRAM_BOT_TOKEN) {
      const msg = `🎁 *EVENT WINNER!*\n\n` +
        `Event: ${event.title}\n` +
        `Prize: ${event.prize}\n` +
        `Player ID: ${playerId.trim()}\n` +
        `WhatsApp: ${whatsappDigits}\n` +
        `Winner #${eventData.winners} / ${event.maxWinners}\n` +
        `Box: #${boxPicked + 1}\n` +
        `Time: ${new Date().toLocaleString('ms-MY', { timeZone: 'Asia/Kuala_Lumpur' })}\n` +
        `Total plays: ${eventData.plays.length}`

      fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: MAINTENANCE_GROUP_ID,
          text: msg,
          parse_mode: 'Markdown',
        }),
      }).catch(err => console.error('Telegram notification error:', err))
    }

    // Build response
    const response: Record<string, unknown> = {
      result,
      boxPicked,
      totalPlays: eventData.plays.length,
      totalWinners: eventData.winners,
      maxWinners: event.maxWinners,
    }

    if (result === 'win') {
      response.prize = event.prize
      response.claimMinutes = event.claimMinutes
      response.claimDeadline = new Date(Date.now() + event.claimMinutes * 60 * 1000).toISOString()
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Event play error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
