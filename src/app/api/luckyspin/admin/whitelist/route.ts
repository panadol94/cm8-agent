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
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search') || ''

    const payload = await getPayload({ config: configPromise })

    const where: Record<string, Record<string, unknown>> = {}
    if (search) {
      where.agentId = { contains: search }
    }

    const result = await payload.find({
      collection: 'lucky-spin-whitelist',
      where,
      page,
      limit,
      sort: '-createdAt',
    })

    return NextResponse.json({
      docs: result.docs,
      totalPages: result.totalPages,
      totalDocs: result.totalDocs,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!await verifyAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { agentIds } = await req.json()

    if (!Array.isArray(agentIds) || agentIds.length === 0) {
      return NextResponse.json({ error: 'Senarai ID Agent diperlukan.' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })
    const results = { success: 0, failed: 0, existing: [] as string[] }

    for (const agentId of agentIds) {
      if (!agentId || typeof agentId !== 'string') continue

      // Check if exists
      const existing = await payload.find({
        collection: 'lucky-spin-whitelist',
        where: { agentId: { equals: agentId.trim() } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        results.existing.push(agentId)
        results.failed++
        continue
      }

      await payload.create({
        collection: 'lucky-spin-whitelist',
        data: {
          agentId: agentId.trim(),
          isActive: true,
          hasSpun: false,
          createdAt: new Date().toISOString(),
        },
      })
      results.success++
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  if (!await verifyAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { id, isActive } = await req.json()
    const payload = await getPayload({ config: configPromise })

    await payload.update({
      collection: 'lucky-spin-whitelist',
      id,
      data: { isActive },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!await verifyAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { id } = await req.json()
    const payload = await getPayload({ config: configPromise })

    await payload.delete({ collection: 'lucky-spin-whitelist', id })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
