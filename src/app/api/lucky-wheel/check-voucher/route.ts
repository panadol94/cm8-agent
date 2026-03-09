import { NextRequest, NextResponse } from 'next/server'
import { getUserFromCookie, getDbClient } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const payload = await getUserFromCookie()
    if (!payload) {
      return NextResponse.json({ hasVoucher: false, error: 'Tidak log masuk.' })
    }

    const client = getDbClient()
    await client.connect()

    try {
      // Check for unused voucher
      const result = await client.query(
        `SELECT id FROM cm8_spin_vouchers 
         WHERE user_id = $1 AND used = false 
         ORDER BY created_at ASC LIMIT 1`,
        [payload.userId],
      )

      if (result.rows.length === 0) {
        return NextResponse.json({ hasVoucher: false })
      }

      return NextResponse.json({
        hasVoucher: true,
        voucherId: result.rows[0].id,
      })
    } finally {
      await client.end()
    }
  } catch (error: unknown) {
    console.error('[check-voucher] Error:', error)
    return NextResponse.json({ hasVoucher: false, error: 'Ralat pelayan.' })
  }
}

// POST - Use/consume a voucher (called by Lucky Wheel after spin)
export async function POST(req: NextRequest) {
  try {
    const payload = await getUserFromCookie()
    if (!payload) {
      return NextResponse.json({ error: 'Tidak log masuk.' }, { status: 401 })
    }

    const { voucherId } = await req.json()

    const client = getDbClient()
    await client.connect()

    try {
      const result = await client.query(
        `UPDATE cm8_spin_vouchers 
         SET used = true, used_at = NOW() 
         WHERE id = $1 AND user_id = $2 AND used = false
         RETURNING id`,
        [voucherId, payload.userId],
      )

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: 'Voucher tidak sah atau sudah digunakan.' },
          { status: 400 },
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Voucher berjaya digunakan!',
      })
    } finally {
      await client.end()
    }
  } catch (error: unknown) {
    console.error('[check-voucher POST] Error:', error)
    return NextResponse.json(
      { error: 'Ralat pelayan. Sila cuba lagi.' },
      { status: 500 },
    )
  }
}
