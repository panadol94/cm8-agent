import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { queryWhitelist, querySettings } from '@/lib/luckyspin-db'

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

    // Use direct DB queries
    const entry = await queryWhitelist(session.agentId)

    if (!entry) {
      return NextResponse.json({ hasSpun: false, error: 'ID tidak dalam whitelist.' }, { status: 403 })
    }

    const settings = await querySettings()

    if (!settings || !settings.event_status) {
      return NextResponse.json({ hasSpun: entry.has_spun, eventActive: false })
    }

    const now = new Date()
    const start = new Date(settings.event_start)
    const end = new Date(settings.event_end)
    const eventActive = now >= start && now <= end

    return NextResponse.json({
      hasSpun: entry.has_spun,
      eventActive,
      agentId: session.agentId,
    })
  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json({ error: 'Ralat server.' }, { status: 500 })
  }
}
