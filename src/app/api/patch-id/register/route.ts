import { NextResponse } from 'next/server'
import { getOtpStore, generateOTP, normalizePhone } from '../utils'

/* ── POST /api/patch-id/register ───────────────────────────── */
export async function POST(req: Request) {
  try {
    const { phone, countryCode } = await req.json()

    if (!phone || !countryCode) {
      return NextResponse.json({ error: 'Phone and country code required' }, { status: 400 })
    }

    if (!['+60', '+62'].includes(countryCode)) {
      return NextResponse.json(
        { error: 'Only Malaysia (+60) and Indonesia (+62) supported' },
        { status: 400 },
      )
    }

    const normalized = normalizePhone(countryCode, phone)

    const digits = normalized.replace(/^\+/, '')
    if (digits.length < 10 || digits.length > 14) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 })
    }

    const otp = generateOTP()
    const store = getOtpStore()

    // Remove expired entries
    const now = Date.now()
    for (const [key, entry] of store) {
      if (entry.expiresAt < now) store.delete(key)
    }

    store.set(normalized, {
      phone: normalized,
      otp,
      expiresAt: now + 5 * 60 * 1000,
      verified: false,
    })

    // Get bot username
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    let botUsername = 'cm8vvip_bot'

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
