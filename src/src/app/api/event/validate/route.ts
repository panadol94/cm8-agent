import { NextRequest, NextResponse } from 'next/server'
import { CURRENT_EVENT } from '../config'

/**
 * POST /api/event/validate
 * Body: { code: string, fingerprint: string }
 * 
 * Validates event code, checks timing, and checks if fingerprint already played.
 */
export async function POST(req: NextRequest) {
  try {
    const { code, fingerprint } = await req.json()

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Sila masukkan kod event' }, { status: 400 })
    }

    const event = CURRENT_EVENT

    // Check if event is active
    if (!event.active) {
      return NextResponse.json({ error: 'Tiada event aktif buat masa ini' }, { status: 404 })
    }

    // Check code
    if (code.toUpperCase().trim() !== event.code) {
      return NextResponse.json({ error: 'Kod event tidak sah!' }, { status: 400 })
    }

    // Check timing
    const now = new Date()
    const start = new Date(event.startTime)
    const end = new Date(event.endTime)

    if (now < start) {
      const startFormatted = start.toLocaleString('ms-MY', { 
        timeZone: 'Asia/Kuala_Lumpur',
        day: 'numeric', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      })
      return NextResponse.json({ 
        error: `Event belum bermula! Bermula pada ${startFormatted}`,
        notStarted: true,
        startTime: event.startTime,
      }, { status: 400 })
    }

    if (now > end) {
      return NextResponse.json({ error: 'Event telah tamat!', ended: true }, { status: 400 })
    }

    // Check if fingerprint already played
    if (fingerprint) {
      const fs = await import('fs')
      const { EVENTS_FILE } = await import('../config')
      try {
        if (fs.existsSync(EVENTS_FILE)) {
          const data = JSON.parse(fs.readFileSync(EVENTS_FILE, 'utf-8'))
          const eventData = data[event.id]
          if (eventData && eventData.plays) {
            const alreadyPlayed = eventData.plays.some(
              (p: { fingerprint: string }) => p.fingerprint === fingerprint
            )
            if (alreadyPlayed) {
              return NextResponse.json({ 
                error: 'Anda sudah bermain! Satu percubaan sahaja.',
                alreadyPlayed: true 
              }, { status: 400 })
            }
          }
        }
      } catch {
        // File doesn't exist yet — no plays recorded
      }
    }

    // Return event info (without sensitive details)
    return NextResponse.json({
      valid: true,
      title: event.title,
      prize: event.prize,
      boxes: event.boxes,
      claimMinutes: event.claimMinutes,
      endTime: event.endTime,
    })
  } catch (error) {
    console.error('Event validate error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
