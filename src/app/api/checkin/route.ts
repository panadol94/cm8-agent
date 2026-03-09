import { NextRequest, NextResponse } from 'next/server'
import { getUserFromCookie, getDbClient } from '@/lib/auth'

// Milestone points mapping
const MILESTONE_POINTS: Record<number, number> = {
  1: 1,
  3: 5,
  7: 15,
  15: 40,
  30: 120,
}

function getPointsForDay(day: number): number {
  return MILESTONE_POINTS[day] || 0
}

// POST - Daily check-in
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
        `SELECT id, points, current_streak, last_checkin_date 
         FROM cm8_users WHERE id = $1 FOR UPDATE`,
        [payload.userId],
      )

      if (userResult.rows.length === 0) {
        return NextResponse.json({ error: 'Pengguna tidak dijumpai.' }, { status: 404 })
      }

      const user = userResult.rows[0]
      const today = new Date()
      const todayStr = today.toISOString().split('T')[0]

      // Check if already checked in today
      if (user.last_checkin_date) {
        const lastStr = new Date(user.last_checkin_date).toISOString().split('T')[0]
        if (lastStr === todayStr) {
          return NextResponse.json(
            { error: 'Anda sudah daftar masuk hari ini!', alreadyCheckedIn: true },
            { status: 400 },
          )
        }
      }

      // Calculate new streak
      let newStreak = 1
      const currentPoints = user.points

      if (user.last_checkin_date) {
        const lastCheckin = new Date(user.last_checkin_date)
        const lastStr = lastCheckin.toISOString().split('T')[0]
        const diffMs = new Date(todayStr).getTime() - new Date(lastStr).getTime()
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

        if (diffDays === 1) {
          // Consecutive day
          newStreak = user.current_streak + 1
          if (newStreak > 30) newStreak = 30 // Cap at 30
        } else {
          // Missed a day - reset streak only, points stay
          newStreak = 1
        }
      }

      const pointsEarned = getPointsForDay(newStreak)
      const newPoints = currentPoints + pointsEarned

      // Update user
      await client.query(
        `UPDATE cm8_users 
         SET current_streak = $1, points = $2, last_checkin_date = $3 
         WHERE id = $4`,
        [newStreak, newPoints, todayStr, user.id],
      )

      // Insert check-in record
      await client.query(
        `INSERT INTO cm8_checkins (user_id, checkin_date, streak_day, points_earned) 
         VALUES ($1, $2, $3, $4)`,
        [user.id, todayStr, newStreak, pointsEarned],
      )

      return NextResponse.json({
        success: true,
        message: pointsEarned > 0
          ? `Tahniah! Hari ${newStreak} - Anda memperoleh ${pointsEarned} mata!`
          : `Daftar masuk hari ${newStreak} berjaya!`,
        streakDay: newStreak,
        pointsEarned,
        totalPoints: newPoints,
      })
    } finally {
      await client.end()
    }
  } catch (error: unknown) {
    console.error('[checkin POST] Error:', error)
    return NextResponse.json(
      { error: 'Ralat pelayan. Sila cuba lagi.' },
      { status: 500 },
    )
  }
}

// GET - Check-in history
export async function GET(req: NextRequest) {
  try {
    const payload = await getUserFromCookie()
    if (!payload) {
      return NextResponse.json({ error: 'Sila log masuk terlebih dahulu.' }, { status: 401 })
    }

    const client = getDbClient()
    await client.connect()

    try {
      const checkins = await client.query(
        `SELECT checkin_date, streak_day, points_earned, created_at
         FROM cm8_checkins WHERE user_id = $1 
         ORDER BY checkin_date DESC LIMIT 30`,
        [payload.userId],
      )

      return NextResponse.json({
        checkins: checkins.rows.map(c => ({
          date: c.checkin_date,
          streakDay: c.streak_day,
          pointsEarned: c.points_earned,
          createdAt: c.created_at,
        })),
      })
    } finally {
      await client.end()
    }
  } catch (error: unknown) {
    console.error('[checkin GET] Error:', error)
    return NextResponse.json(
      { error: 'Ralat pelayan. Sila cuba lagi.' },
      { status: 500 },
    )
  }
}
