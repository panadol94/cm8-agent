import { NextResponse } from 'next/server'
import { getOtpStore, normalizePhone } from '../utils'

/* ── POST /api/patch-id/verify ─────────────────────────────── */
export async function POST(req: Request) {
  try {
    const { phone, countryCode, otp } = await req.json()

    if (!phone || !countryCode || !otp) {
      return NextResponse.json({ error: 'Phone, country code, and OTP required' }, { status: 400 })
    }

    const normalized = normalizePhone(countryCode, phone)
    const store = getOtpStore()
    const entry = store.get(normalized)

    if (!entry) {
      return NextResponse.json({ error: 'OTP tidak ditemui. Sila daftar semula.' }, { status: 404 })
    }

    if (Date.now() > entry.expiresAt) {
      store.delete(normalized)
      return NextResponse.json(
        { error: 'OTP telah tamat tempoh. Sila minta semula.' },
        { status: 410 },
      )
    }

    if (entry.otp !== otp.trim()) {
      return NextResponse.json({ error: 'OTP salah. Sila cuba lagi.' }, { status: 401 })
    }

    // Mark as verified
    entry.verified = true
    store.set(normalized, entry)

    return NextResponse.json({
      verified: true,
      phone: normalized,
      cm8Username: entry.cm8Username || null,
      message: 'Berjaya! Anda kini boleh menggunakan Patch ID Scanner.',
    })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
