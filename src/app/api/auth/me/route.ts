import { NextResponse } from 'next/server'
import { getUserFromCookie, getDbClient } from '@/lib/auth'

export async function GET() {
  try {
    const payload = await getUserFromCookie()
    if (!payload) {
      return NextResponse.json({ error: 'Tidak log masuk.' }, { status: 401 })
    }

    const client = getDbClient()
    await client.connect()

    try {
      const result = await client.query(
        `SELECT id, phone, cm8_player_id, points, current_streak, last_checkin_date, created_at, status, referral_code, referral_count
         FROM cm8_users WHERE id = $1`,
        [payload.userId],
      )

      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Pengguna tidak dijumpai.' }, { status: 404 })
      }

      const user = result.rows[0]

      // Check if streak is still valid (not missed a day)
      let currentStreak = user.current_streak
      const points = user.points
      if (user.last_checkin_date) {
        const lastCheckin = new Date(user.last_checkin_date)
        const today = new Date()
        const todayStr = today.toISOString().split('T')[0]
        const lastStr = lastCheckin.toISOString().split('T')[0]
        
        // Calculate difference in days
        const diffMs = new Date(todayStr).getTime() - new Date(lastStr).getTime()
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
        
        if (diffDays > 1) {
          // Missed a day - reset streak only, points stay
          currentStreak = 0
          await client.query(
            'UPDATE cm8_users SET current_streak = 0 WHERE id = $1',
            [user.id],
          )
        }
      }

      // Get recent check-in history
      const checkins = await client.query(
        `SELECT checkin_date, streak_day, points_earned 
         FROM cm8_checkins WHERE user_id = $1 
         ORDER BY checkin_date DESC LIMIT 30`,
        [user.id],
      )

      // Get spin voucher count
      const vouchers = await client.query(
        'SELECT COUNT(*) as count FROM cm8_spin_vouchers WHERE user_id = $1 AND used = false',
        [user.id],
      )

      return NextResponse.json({
        user: {
          id: user.id,
          phone: user.phone,
          cm8PlayerId: user.cm8_player_id,
          points,
          currentStreak,
          lastCheckinDate: user.last_checkin_date,
          createdAt: user.created_at,
          status: user.status,
          referralCode: user.referral_code,
          referralCount: user.referral_count || 0,
        },
        checkins: checkins.rows.map(c => ({
          date: c.checkin_date,
          streakDay: c.streak_day,
          pointsEarned: c.points_earned,
        })),
        unusedVouchers: parseInt(vouchers.rows[0].count),
      })
    } finally {
      await client.end()
    }
  } catch (error: unknown) {
    console.error('[me] Error:', error)
    return NextResponse.json(
      { error: 'Ralat pelayan. Sila cuba lagi.' },
      { status: 500 },
    )
  }
}
