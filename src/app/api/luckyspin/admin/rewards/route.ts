import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { jwtVerify } from 'jose'

function getJwtSecret(): Uint8Array {
  const secret = process.env.PAYLOAD_SECRET || 'fallback-secret-change-me'
  return new TextEncoder().encode(secret)
}

async function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get('ls_admin_session')?.value
  if (!token) return false
  try {
    const { payload } = await jwtVerify(token, getJwtSecret())
    return !!(payload as { admin?: boolean }).admin
  } catch {
    return false
  }
}

export async function GET(request: NextRequest) {
  if (!await verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    // Use direct pg to bypass Payload ORM duplicate-table bug
    const { Client } = require('pg')
    const client = new Client({
      host: process.env.PGHOST || '10.0.1.20',
      port: parseInt(process.env.PGPORT || '5432'),
      user: process.env.PGUSER || 'cm8user',
      password: process.env.PGPASSWORD || 'cm8pass',
      database: process.env.PGDATABASE || 'cm8vvip',
    })
    await client.connect()
    const result = await client.query(
      'SELECT id, reward_name, reward_type, stock, claimed_count, probability, is_active, position FROM lucky_spin_rewards ORDER BY position ASC LIMIT 100'
    )
    await client.end()
    const docs = result.rows.map((r: any) => ({
      id: r.id,
      rewardName: r.reward_name,
      rewardType: r.reward_type,
      stock: r.stock,
      claimedCount: r.claimed_count,
      probability: r.probability,
      isActive: r.is_active,
      position: r.position,
    }))
    return NextResponse.json(docs)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!await verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const data = await request.json()
    const payload = await getPayload({ config: configPromise })

    const result = await (payload as any).create({
      collection: 'lucky-spin-rewards',
      data: { ...data, isActive: true, claimedCount: 0 } as any,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  if (!await verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { id, ...rest } = await request.json()
    const payload = await getPayload({ config: configPromise })

    await (payload as any).update({
      collection: 'lucky-spin-rewards',
      id,
      data: rest as any,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  if (!await verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { id } = await request.json()
    const payload = await getPayload({ config: configPromise })
    await payload.delete({ collection: 'lucky-spin-rewards', id })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
