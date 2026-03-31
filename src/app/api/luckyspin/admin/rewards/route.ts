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
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'lucky-spin-rewards',
      sort: 'position',
      limit: 100,
    })
    return NextResponse.json(result.docs)
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

    // Validate probability total
    const all = await payload.find({ collection: 'lucky-spin-rewards', limit: 100 })
    const currentTotal = all.docs.reduce((s, r) => s + (r.probability || 0), 0)
    const newTotal = currentTotal + (data.probability || 0)

    if (newTotal > 100) {
      return NextResponse.json({ error: `Probability total akan jadi ${newTotal}%. Tidak boleh lebih dari 100%.` }, { status: 400 })
    }

    const result = await payload.create({
      collection: 'lucky-spin-rewards',
      data: { ...data, isActive: true },
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
    const { id, probability, ...rest } = await request.json()
    const payload = await getPayload({ config: configPromise })

    // Validate probability total = 100%
    const all = await payload.find({ collection: 'lucky-spin-rewards', limit: 100 })
    const othersTotal = all.docs
      .filter((r) => r.id !== id)
      .reduce((s, r) => s + (r.probability || 0), 0)

    if (othersTotal + probability > 100) {
      return NextResponse.json({ error: `Probability total akan jadi ${othersTotal + probability}%. Tidak boleh lebih dari 100%.` }, { status: 400 })
    }

    await payload.update({
      collection: 'lucky-spin-rewards',
      id,
      data: { probability, ...rest },
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
