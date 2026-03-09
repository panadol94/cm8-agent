import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, signToken, getDbClient, COOKIE_NAME } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { phone, password } = await req.json()

    if (!phone || !password) {
      return NextResponse.json(
        { error: 'Sila masukkan nombor telefon dan kata laluan.' },
        { status: 400 },
      )
    }

    const cleanPhone = phone.replace(/[\s\-]/g, '')
    const client = getDbClient()
    await client.connect()

    try {
      const result = await client.query(
        `SELECT id, phone, password_hash, cm8_player_id, points, current_streak, last_checkin_date, status
         FROM cm8_users WHERE phone = $1`,
        [cleanPhone],
      )

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: 'Nombor telefon atau kata laluan tidak sah.' },
          { status: 401 },
        )
      }

      const user = result.rows[0]

      if (user.status !== 'active') {
        return NextResponse.json(
          { error: 'Akaun anda telah dinyahaktifkan.' },
          { status: 403 },
        )
      }

      const isValid = await verifyPassword(password, user.password_hash)
      if (!isValid) {
        return NextResponse.json(
          { error: 'Nombor telefon atau kata laluan tidak sah.' },
          { status: 401 },
        )
      }

      const token = await signToken({ userId: user.id, phone: user.phone })

      const response = NextResponse.json({
        success: true,
        message: 'Log masuk berjaya!',
        user: {
          id: user.id,
          phone: user.phone,
          cm8PlayerId: user.cm8_player_id,
          points: user.points,
          currentStreak: user.current_streak,
          lastCheckinDate: user.last_checkin_date,
        },
      })

      response.cookies.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
      })

      return response
    } finally {
      await client.end()
    }
  } catch (error: unknown) {
    console.error('[login] Error:', error)
    return NextResponse.json(
      { error: 'Ralat pelayan. Sila cuba lagi.' },
      { status: 500 },
    )
  }
}
