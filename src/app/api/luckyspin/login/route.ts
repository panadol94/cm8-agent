import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { SignJWT } from 'jose'
import { cookies } from 'next/headers'

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

    const payload = await getPayload({ config: configPromise })

    // Check whitelist
    const entry = await payload.find({
      collection: 'lucky-spin-whitelist',
      where: { agentId: { equals: agentId } },
      limit: 1,
    })

    if (entry.docs.length === 0) {
      return NextResponse.json(
        { error: 'ID Agent tiada dalam whitelist. Sila hubungi admin.' },
        { status: 403 },
      )
    }

    const whitelistEntry = entry.docs[0]

    if (!whitelistEntry.isActive) {
      return NextResponse.json(
        { error: 'ID Agent tidak aktif. Sila hubungi admin.' },
        { status: 403 },
      )
    }

    if (whitelistEntry.hasSpun) {
      return NextResponse.json(
        { error: 'ID ini telah digunakan untuk spin.' },
        { status: 403 },
      )
    }

    // Generate session token (JWT)
    const token = await new SignJWT({ agentId, whitelistId: whitelistEntry.id })
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
