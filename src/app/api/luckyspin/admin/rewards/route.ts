import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { jwtVerify } from 'jose'

function getJwtSecret(): Uint8Array {
  const secret = process.env.PAYLOAD_SECRET || 'fallback-secret-change-me'
  return new TextEncoder().encode(secret)
}

async function verifyAdminSession(request: NextRequest) {
  const token = request.cookies.get('ls_admin_session')?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, getJwtSecret())
    return payload as { admin?: boolean }
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await verifyAdminSession(request)
    if (!session?.admin) {
      return NextResponse.json({ error: 'Akses ditolak.' }, { status: 401 })
    }

    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'lucky-spin-rewards',
      sort: 'position',
    })

    return NextResponse.json({ rewards: result.docs })
  } catch (error) {
    console.error('Rewards GET error:', error)
    return NextResponse.json({ error: 'Ralat server.' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await verifyAdminSession(request)
    if (!session?.admin) {
      return NextResponse.json({ error: 'Akses ditolak.' }, { status: 401 })
    }

    const payload = await getPayload({ config: configPromise })
    const body = await request.json()

    // Validate probability
    if (body.probability < 0 || body.probability > 100) {
      return NextResponse.json({ error: 'Probability mesti antara 0-100.' }, { status: 400 })
    }

    const created = await payload.create({
      collection: 'lucky-spin-rewards',
      data: body,
    })

    return NextResponse.json({ success: true, reward: created })
  } catch (error) {
    console.error('Rewards POST error:', error)
    return NextResponse.json({ error: 'Ralat server.' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await verifyAdminSession(request)
    if (!session?.admin) {
      return NextResponse.json({ error: 'Akses ditolak.' }, { status: 401 })
    }

    const payload = await getPayload({ config: configPromise })
    const body = await request.json()
    const { id, ...data } = body

    if (!id) {
      return NextResponse.json({ error: 'ID diperlukan.' }, { status: 400 })
    }

    // Validate probability
    if (data.probability !== undefined && (data.probability < 0 || data.probability > 100)) {
      return NextResponse.json({ error: 'Probability mesti antara 0-100.' }, { status: 400 })
    }

    const updated = await payload.update({
      collection: 'lucky-spin-rewards',
      id,
      data,
    })

    return NextResponse.json({ success: true, reward: updated })
  } catch (error) {
    console.error('Rewards PUT error:', error)
    return NextResponse.json({ error: 'Ralat server.' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await verifyAdminSession(request)
    if (!session?.admin) {
      return NextResponse.json({ error: 'Akses ditolak.' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID diperlukan.' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })
    await payload.delete({
      collection: 'lucky-spin-rewards',
      id,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Rewards DELETE error:', error)
    return NextResponse.json({ error: 'Ralat server.' }, { status: 500 })
  }
}
