import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { SignJWT } from 'jose'
import { cookies } from 'next/headers'
import { queryWhitelist } from '@/lib/luckyspin-db'

const COOKIE_NAME = 'ls_session'

function getJwtSecret(): Uint8Array {
  const secret = process.env.PAYLOAD_SECRET || 'fallback-secret-change-me'
  return new TextEncoder().encode(secret)
}

export async function POST(req: NextRequest) {
  try {
    const { agentId } = await req.json()

    if (!agentId || typeof agentId !== 'string') {
      return NextResponse.json({ error: 'Agent ID diperlukan.' }, { status: 400 })
    }

    // Use direct DB to bypass Payload ORM duplicate-table bug
    const entry = await queryWhitelist(agentId.trim())

    if (!entry) {
      return NextResponse.json(
        { error: 'ID Agent tiada dalam whitelist. Sila hubungi admin.' },
        { status: 403 },
      )
    }

    if (!entry.is_active) {
      return NextResponse.json(
        { error: 'ID Agent tidak aktif. Sila hubungi admin.' },
        { status: 403 },
      )
    }

    if (entry.has_spun) {
      return NextResponse.json(
        { error: 'ID ini telah digunakan untuk spin.' },
        { status: 403 },
      )
    }

    // Generate session token (JWT)
    const token = await new SignJWT({ agentId, whitelistId: entry.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('2h')
      .sign(getJwtSecret())

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 2, // 2 hours
      path: '/',
    })

    return NextResponse.json({ success: true, agentId })
  } catch (error) {
    console.error('Lucky spin login error:', error)
    return NextResponse.json({ error: 'Ralat server.' }, { status: 500 })
  }
}
