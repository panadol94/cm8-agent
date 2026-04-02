import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { jwtVerify } from 'jose'

function getJwtSecret(): Uint8Array {
  const secret = process.env.PAYLOAD_SECRET || 'fallback-secret-change-me'
  return new TextEncoder().encode(secret)
}

async function verifySession(request: NextRequest) {
  const token = request.cookies.get('ls_session')?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, getJwtSecret())
    return payload as { agentId?: string }
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await verifySession(request)

    if (!session || !session.agentId) {
      return NextResponse.json({ error: 'Sesi tidak sah. Sila login semula.' }, { status: 401 })
    }

    const payload = await getPayload({ config: configPromise })

    // Check whitelist (case-insensitive)
    const allWhitelist = await payload.find({
      collection: 'lucky-spin-whitelist',
      limit: 1000,
    })

    const entry = allWhitelist.docs.find(
      (doc: any) => String(doc.agentId || '').toLowerCase() === String(session.agentId || '').toLowerCase(),
    )

    if (!entry) {
      return NextResponse.json({ hasSpun: false, error: 'ID tidak dalam whitelist.' }, { status: 403 })
    }

    // Check event status
    const settingsRes = await payload.find({ collection: 'lucky-spin-settings', limit: 1 })
    const settings = settingsRes.docs[0]

    if (!settings || !settings.eventStatus) {
      return NextResponse.json({ hasSpun: entry.hasSpun, eventActive: false })
    }

    const now = new Date()
    const start = new Date(settings.eventStart)
    const end = new Date(settings.eventEnd)
    const eventActive = now >= start && now <= end

    return NextResponse.json({
      hasSpun: entry.hasSpun,
      eventActive,
      agentId: session.agentId,
    })
  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json({ error: 'Ralat server.' }, { status: 500 })
  }
}
