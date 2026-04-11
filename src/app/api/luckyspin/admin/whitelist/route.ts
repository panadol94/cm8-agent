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
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''

    const where: Record<string, unknown> = {}
    if (search) {
      where.agentId = { like: search }
    }

    const result = await payload.find({
      collection: 'lucky-spin-whitelist',
      where: Object.keys(where).length > 0 ? where : undefined,
      sort: '-createdAt',
      limit: 500,
    })

    return NextResponse.json({ entries: result.docs })
  } catch (error) {
    console.error('Whitelist GET error:', error)
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

    // Check if agentId already exists
    const existing = await payload.find({
      collection: 'lucky-spin-whitelist',
      where: { agentId: { equals: body.agentId } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      // Update existing
      const updated = await payload.update({
        collection: 'lucky-spin-whitelist',
        id: existing.docs[0].id,
        data: {
          isActive: body.isActive ?? true,
          hasSpun: body.hasSpun ?? false,
        },
      })
      return NextResponse.json({ success: true, entry: updated })
    }

    // Create new
    const created = await payload.create({
      collection: 'lucky-spin-whitelist',
      data: {
        agentId: body.agentId,
        isActive: body.isActive ?? true,
        hasSpun: false,
        createdAt: new Date().toISOString(),
      },
    })

    return NextResponse.json({ success: true, entry: created })
  } catch (error) {
    console.error('Whitelist POST error:', error)
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
      collection: 'lucky-spin-whitelist',
      id,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Whitelist DELETE error:', error)
    return NextResponse.json({ error: 'Ralat server.' }, { status: 500 })
  }
}
