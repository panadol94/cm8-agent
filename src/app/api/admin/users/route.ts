import { NextRequest, NextResponse } from 'next/server'
import { getDbClient } from '@/lib/auth'

const ADMIN_KEY = 'cm8admin2026'

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key')
  if (key !== ADMIN_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const client = getDbClient()
  await client.connect()

  try {
    // Get all users with their stats
    const users = await client.query(`
      SELECT 
        u.id, u.phone, u.cm8_player_id, u.points, u.current_streak,
        u.last_checkin_date, u.created_at, u.status,
        u.referral_code, u.referral_count, u.referred_by,
        (SELECT COUNT(*) FROM cm8_checkins WHERE user_id = u.id) as total_checkins,
        (SELECT COUNT(*) FROM cm8_spin_vouchers WHERE user_id = u.id AND used = false) as unused_vouchers,
        (SELECT COUNT(*) FROM cm8_spin_vouchers WHERE user_id = u.id AND used = true) as used_vouchers
      FROM cm8_users u
      ORDER BY u.created_at DESC
    `)

    // Get total stats
    const totalStats = await client.query(`
      SELECT 
        COUNT(*) as total_users,
        SUM(points) as total_points,
        SUM(referral_count) as total_referrals,
        (SELECT COUNT(*) FROM cm8_checkins) as total_checkins,
        (SELECT COUNT(*) FROM cm8_spin_vouchers WHERE used = false) as pending_vouchers,
        (SELECT COUNT(*) FROM cm8_spin_vouchers WHERE used = true) as used_vouchers
      FROM cm8_users
    `)

    return NextResponse.json({
      stats: totalStats.rows[0],
      users: users.rows.map(u => ({
        id: u.id,
        phone: u.phone,
        cm8PlayerId: u.cm8_player_id,
        points: u.points,
        currentStreak: u.current_streak,
        lastCheckinDate: u.last_checkin_date,
        createdAt: u.created_at,
        status: u.status,
        referralCode: u.referral_code,
        referralCount: u.referral_count || 0,
        referredBy: u.referred_by,
        totalCheckins: parseInt(u.total_checkins),
        unusedVouchers: parseInt(u.unused_vouchers),
        usedVouchers: parseInt(u.used_vouchers),
      })),
    })
  } finally {
    await client.end()
  }
}

// PATCH - edit user points / streak / status
export async function PATCH(req: NextRequest) {
  try {
    const { key, userId, action, value } = await req.json()
    if (key !== ADMIN_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (!userId || !action) {
      return NextResponse.json({ error: 'Missing userId or action' }, { status: 400 })
    }

    const client = getDbClient()
    await client.connect()

    try {
      if (action === 'setPoints') {
        const pts = parseInt(value)
        if (isNaN(pts) || pts < 0) return NextResponse.json({ error: 'Invalid points' }, { status: 400 })
        await client.query('UPDATE cm8_users SET points = $1 WHERE id = $2', [pts, userId])
        return NextResponse.json({ ok: true, message: `Points set to ${pts}` })
      }

      if (action === 'addPoints') {
        const pts = parseInt(value)
        if (isNaN(pts)) return NextResponse.json({ error: 'Invalid points' }, { status: 400 })
        await client.query('UPDATE cm8_users SET points = GREATEST(0, points + $1) WHERE id = $2', [pts, userId])
        return NextResponse.json({ ok: true, message: `Points adjusted by ${pts}` })
      }

      if (action === 'resetStreak') {
        await client.query('UPDATE cm8_users SET current_streak = 0 WHERE id = $1', [userId])
        return NextResponse.json({ ok: true, message: 'Streak reset' })
      }

      if (action === 'ban') {
        await client.query("UPDATE cm8_users SET status = 'banned' WHERE id = $1", [userId])
        return NextResponse.json({ ok: true, message: 'User banned' })
      }

      if (action === 'unban') {
        await client.query("UPDATE cm8_users SET status = 'active' WHERE id = $1", [userId])
        return NextResponse.json({ ok: true, message: 'User unbanned' })
      }

      if (action === 'delete') {
        await client.query('DELETE FROM cm8_spin_vouchers WHERE user_id = $1', [userId])
        await client.query('DELETE FROM cm8_checkins WHERE user_id = $1', [userId])
        await client.query('DELETE FROM cm8_users WHERE id = $1', [userId])
        return NextResponse.json({ ok: true, message: 'User deleted' })
      }

      return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    } finally {
      await client.end()
    }
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
