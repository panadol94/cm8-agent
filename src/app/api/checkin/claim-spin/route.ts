import { NextResponse } from 'next/server'
import { getUserFromCookie, getDbClient } from '@/lib/auth'

export async function POST() {
  try {
    const payload = await getUserFromCookie()
    if (!payload) {
      return NextResponse.json({ error: 'Sila log masuk terlebih dahulu.' }, { status: 401 })
    }

    const client = getDbClient()
    await client.connect()

    try {
      // Get user with lock
      const userResult = await client.query(
        'SELECT id, points FROM cm8_users WHERE id = $1 FOR UPDATE',
        [payload.userId],
      )

      if (userResult.rows.length === 0) {
        return NextResponse.json({ error: 'Pengguna tidak dijumpai.' }, { status: 404 })
      }

      const user = userResult.rows[0]

      if (user.points < 10) {
        return NextResponse.json(
          { error: `Mata tidak mencukupi. Anda ada ${user.points} mata, perlu 10 mata.` },
          { status: 400 },
        )
      }

      // Deduct 10 points
      const newPoints = user.points - 10
      await client.query('UPDATE cm8_users SET points = $1 WHERE id = $2', [newPoints, user.id])

      // Create spin voucher
      const voucher = await client.query(
        'INSERT INTO cm8_spin_vouchers (user_id) VALUES ($1) RETURNING id, created_at',
        [user.id],
      )

      return NextResponse.json({
        success: true,
        message: 'Voucher spin berjaya ditebus! Anda boleh spin Lucky Wheel sekali lagi.',
        voucher: {
          id: voucher.rows[0].id,
          createdAt: voucher.rows[0].created_at,
        },
        remainingPoints: newPoints,
      })
    } finally {
      await client.end()
    }
  } catch (error: unknown) {
    console.error('[claim-spin] Error:', error)
    return NextResponse.json(
      { error: 'Ralat pelayan. Sila cuba lagi.' },
      { status: 500 },
    )
  }
}
