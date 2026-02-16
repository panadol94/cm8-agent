import { NextResponse } from 'next/server'

/* ================================================================
   Patch ID OTP — In-memory store
   Shared across register / verify / bot-webhook routes
   ================================================================ */

export interface OTPEntry {
  phone: string // normalized: +60123456789
  otp: string // 6-digit code
  expiresAt: number // Date.now() + 5min
  verified: boolean
}

declare global {
  var __patchOtpStore: Map<string, OTPEntry> | undefined
}

export function getOtpStore(): Map<string, OTPEntry> {
  if (!global.__patchOtpStore) global.__patchOtpStore = new Map()
  return global.__patchOtpStore
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function normalizePhone(countryCode: string, phone: string): string {
  // Strip leading 0 if present
  const cleaned = phone.replace(/\D/g, '').replace(/^0+/, '')
  return `${countryCode}${cleaned}`
}

/* ── POST /api/patch-id/register ───────────────────────────── */
export async function POST(req: Request) {
  try {
    const { phone, countryCode } = await req.json()

    if (!phone || !countryCode) {
      return NextResponse.json({ error: 'Phone and country code required' }, { status: 400 })
    }

    // Validate country code
    if (!['+60', '+62'].includes(countryCode)) {
      return NextResponse.json(
        { error: 'Only Malaysia (+60) and Indonesia (+62) supported' },
        { status: 400 },
      )
    }

    // Normalize phone
    const normalized = normalizePhone(countryCode, phone)

    // Validate phone length
    const digits = normalized.replace(/^\+/, '')
    if (digits.length < 10 || digits.length > 14) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 })
    }

    // Generate OTP
    const otp = generateOTP()
    const store = getOtpStore()

    // Remove expired entries
    const now = Date.now()
    for (const [key, entry] of store) {
      if (entry.expiresAt < now) store.delete(key)
    }

    // Store OTP (5 min expiry)
    store.set(normalized, {
      phone: normalized,
      otp,
      expiresAt: now + 5 * 60 * 1000,
      verified: false,
    })

    // Get bot username from token
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    let botUsername = 'cm8vvip_bot' // fallback

    if (botToken) {
      try {
        const res = await fetch(`https://api.telegram.org/bot${botToken}/getMe`)
        if (res.ok) {
          const data = await res.json()
          botUsername = data.result?.username || botUsername
        }
      } catch {
        /* use fallback */
      }
    }

    console.log(`[PATCH-ID] OTP for ${normalized}: ${otp}`)

    return NextResponse.json({
      success: true,
      botUsername,
      message: `OTP generated. Send phone to @${botUsername} to receive code.`,
    })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
