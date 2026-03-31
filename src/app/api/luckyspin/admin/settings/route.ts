import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { jwtVerify } from 'jose'
import crypto from 'crypto'

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
    const settingsRes = await payload.find({ collection: 'lucky-spin-settings', limit: 1 })
    return NextResponse.json(settingsRes.docs[0] || null)
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
    const data = await request.json()
    const payload = await getPayload({ config: configPromise })

    // Get existing settings to get ID
    const existing = await payload.find({ collection: 'lucky-spin-settings', limit: 1 })

    if (data.adminPassword) {
      data.adminPassword = crypto.createHash('sha256').update(data.adminPassword).digest('hex')
    }

    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'lucky-spin-settings',
        id: existing.docs[0].id,
        data,
      })
    } else {
      await payload.create({
        collection: 'lucky-spin-settings',
        data: { ...data, id: undefined },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
