import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = '-1003816675530' // Lucky Wheel VVVIP group
const MAINTENANCE_CHAT_ID = '-1003879318608' // Cm8vvip.com Maintenance group
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.cm8vvip.com'
const CLAIM_VALID_MINUTES = 10

const MEDIA_DIR = path.join(process.cwd(), 'media')
const SPINS_FILE = path.join(MEDIA_DIR, 'spins.json')
const APPROVED_FILE = path.join(MEDIA_DIR, 'approved-users.json')

async function getApprovedUsers(): Promise<string[]> {
  try {
    const data = await fs.readFile(APPROVED_FILE, 'utf-8')
    return JSON.parse(data).map((u: string) => u.toLowerCase())
  } catch {
    return []
  }
}

type SpinRecord = {
  prize: string
  device: string
  timestamp: string
  spunAtMs?: number
  claimId?: string
  ip?: string
}

async function getSpins(): Promise<Record<string, SpinRecord>> {
  try {
    const data = await fs.readFile(SPINS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return {}
  }
}

async function saveSpins(spins: Record<string, SpinRecord>) {
  await fs.mkdir(MEDIA_DIR, { recursive: true })
  await fs.writeFile(SPINS_FILE, JSON.stringify(spins, null, 2))
}

function generateClaimId(username: string): string {
  const clean = username.trim().toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 6) || 'cm8'
  const ts = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `CM8-${clean}-${ts}-${rand}`
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    req.headers.get('cf-connecting-ip') ||
    'unknown'
  )
}

function checkIpAlreadySpun(spins: Record<string, SpinRecord>, ip: string): string | null {
  if (!ip || ip === 'unknown') return null
  for (const [username, record] of Object.entries(spins)) {
    if (record.ip === ip) return username
  }
  return null
}

// GET - check if username already spun
export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get('username')
  if (!username) {
    return NextResponse.json({ error: 'Missing username' }, { status: 400 })
  }

  const key = username.trim().toLowerCase()
  const spins = await getSpins()
  const clientIp = getClientIp(req)

  // Check by username
  if (spins[key]) {
    const rec = spins[key]
    const spunAtMs = rec.spunAtMs || 0
    const claimDeadlineMs = spunAtMs ? spunAtMs + CLAIM_VALID_MINUTES * 60 * 1000 : null
    const claimExpired = claimDeadlineMs ? Date.now() > claimDeadlineMs : false

    return NextResponse.json({
      approved: true,
      alreadySpun: true,
      prize: rec.prize,
      claimId: rec.claimId || null,
      timestamp: rec.timestamp,
      claimExpired,
      claimValidMinutes: CLAIM_VALID_MINUTES,
      claimDeadline: claimDeadlineMs ? new Date(claimDeadlineMs).toISOString() : null,
    })
  }

  // Check by IP - prevent clear cache + new username trick
  const ipUser = checkIpAlreadySpun(spins, clientIp)
  if (ipUser) {
    const rec = spins[ipUser]
    return NextResponse.json({
      approved: true,
      alreadySpun: true,
      prize: rec.prize,
      claimId: rec.claimId || null,
      timestamp: rec.timestamp,
      claimExpired: true,
      ipBlocked: true,
      message: 'Peranti ini sudah digunakan untuk spin.',
    })
  }

  return NextResponse.json({ approved: true, alreadySpun: false })
}

// POST - record spin + send Telegram notification
export async function POST(req: NextRequest) {
  try {
    const { username, prize, device } = await req.json()

    if (!username || !prize) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const key = username.trim().toLowerCase()
    const clientIp = getClientIp(req)

    const spins = await getSpins()

    // Reject if already spun (by username)
    if (spins[key]) {
      return NextResponse.json({ error: 'Already spun', alreadySpun: true }, { status: 403 })
    }

    // Reject if IP already used (prevent cache clear abuse)
    const ipUser = checkIpAlreadySpun(spins, clientIp)
    if (ipUser) {
      return NextResponse.json({ error: 'Peranti ini sudah digunakan untuk spin.', alreadySpun: true, ipBlocked: true }, { status: 403 })
    }

    // Record the spin with IP
    const nowDate = new Date()
    const now = nowDate.toLocaleString('ms-MY', { timeZone: 'Asia/Kuala_Lumpur' })
    const claimId = generateClaimId(username)
    const spunAtMs = nowDate.getTime()
    spins[key] = { prize, device: device || 'Unknown', timestamp: now, spunAtMs, claimId, ip: clientIp }
    await saveSpins(spins)

    // Send Telegram notification
    if (TELEGRAM_BOT_TOKEN) {
      const totalSpins = Object.keys(spins).length
      const claimImageUrl = `${SITE_URL}/api/lucky-wheel/claim-image/${claimId}`
      const claimDeadline = new Date(spunAtMs + CLAIM_VALID_MINUTES * 60 * 1000).toLocaleString('ms-MY', { timeZone: 'Asia/Kuala_Lumpur' })
      const message = [
        `🎰 *Lucky Wheel Spin*`,
        ``,
        `👤 Username: \`${username.trim()}\``,
        `🏆 Prize: *${prize}*`,
        `📱 Device: ${device || 'Unknown'}`,
        `⏰ Masa: ${now}`,
        `🧾 Claim ID: \`${claimId}\``,
        `⏳ Sah claim: ${CLAIM_VALID_MINUTES} minit (hingga ${claimDeadline})`,
        `🖼️ Slip: ${claimImageUrl}`,
        `📊 Total spins: ${totalSpins}`, 
      ].join('\n')

      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown',
        }),
      }).catch(() => {})

      // Notify maintenance group for all winners (except No Luck)
      if (prize !== 'No Luck') {
        const winMsg = [
          `🎉 *Lucky Wheel Winner!*`,
          ``,
          `👤 ${username.trim()}`,
          `🏆 Hadiah: *${prize}*`,
          `⏰ ${now}`,
          `🧾 Claim ID: \`${claimId}\``,
        ].join('\n')

        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: MAINTENANCE_CHAT_ID,
            text: winMsg,
            parse_mode: 'Markdown',
          }),
        }).catch(() => {})
      }
    }

    return NextResponse.json({ ok: true, claimId })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
