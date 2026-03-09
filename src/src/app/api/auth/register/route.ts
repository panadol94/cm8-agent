import { NextRequest, NextResponse } from 'next/server'
import { hashPassword, getDbClient } from '@/lib/auth'

function generateReferralCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

export async function POST(req: NextRequest) {
  try {
    const { phone, password, cm8PlayerId, referralCode } = await req.json()

    if (!phone || !password || !cm8PlayerId) {
      return NextResponse.json(
        { error: 'Sila isi semua maklumat: nombor telefon, kata laluan, dan Player ID.' },
        { status: 400 },
      )
    }

    // Validate phone format (Malaysian)
    const cleanPhone = phone.replace(/[\s\-]/g, '')
    if (!/^(\+?60|0)\d{9,10}$/.test(cleanPhone)) {
      return NextResponse.json(
        { error: 'Format nombor telefon tidak sah. Contoh: 0123456789' },
        { status: 400 },
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Kata laluan mestilah sekurang-kurangnya 6 aksara.' },
        { status: 400 },
      )
    }

    const client = getDbClient()
    await client.connect()

    try {
      // Check if phone already registered
      const existing = await client.query('SELECT id FROM cm8_users WHERE phone = $1', [cleanPhone])
      if (existing.rows.length > 0) {
        return NextResponse.json(
          { error: 'Nombor telefon ini sudah didaftarkan.' },
          { status: 409 },
        )
      }

      const passwordHash = await hashPassword(password)
      const myReferralCode = generateReferralCode()

      // Check referral code if provided
      let referrerId: number | null = null
      if (referralCode && referralCode.trim()) {
        const referrerResult = await client.query(
          'SELECT id FROM cm8_users WHERE referral_code = $1 AND status = $2',
          [referralCode.trim().toUpperCase(), 'active'],
        )
        if (referrerResult.rows.length > 0) {
          referrerId = referrerResult.rows[0].id
        }
      }

      const result = await client.query(
        `INSERT INTO cm8_users (phone, password_hash, cm8_player_id, referral_code, referred_by) 
         VALUES ($1, $2, $3, $4, $5) RETURNING id, phone, cm8_player_id, points, current_streak, referral_code`,
        [cleanPhone, passwordHash, cm8PlayerId, myReferralCode, referrerId],
      )

      const user = result.rows[0]

      // Award 1 point to referrer
      if (referrerId) {
        await client.query(
          'UPDATE cm8_users SET points = points + 1, referral_count = referral_count + 1 WHERE id = $1',
          [referrerId],
        )
      }

      return NextResponse.json({
        success: true,
        message: referrerId
          ? 'Pendaftaran berjaya! Anda didaftarkan melalui rujukan. Sila log masuk.'
          : 'Pendaftaran berjaya! Sila log masuk.',
        user: {
          id: user.id,
          phone: user.phone,
          cm8PlayerId: user.cm8_player_id,
        },
      })
    } finally {
      await client.end()
    }
  } catch (error: unknown) {
    console.error('[register] Error:', error)
    return NextResponse.json(
      { error: 'Ralat pelayan. Sila cuba lagi.' },
      { status: 500 },
    )
  }
}
