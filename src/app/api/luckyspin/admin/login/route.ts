import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { SignJWT } from 'jose'
import { cookies } from 'next/headers'
import crypto from 'crypto'

const COOKIE_NAME = 'ls_admin_session'

function getJwtSecret(): Uint8Array {
  const secret = process.env.PAYLOAD_SECRET || 'fallback-secret-change-me'
  return new TextEncoder().encode(secret)
}

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()

    if (!username || !password) {
      return NextResponse.json({ error: 'Username dan password diperlukan.' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    const settingsRes = await payload.find({
      collection: 'lucky-spin-settings',
      limit: 1,
    })

    const settings = settingsRes.docs[0]
    if (!settings) {
      return NextResponse.json({ error: 'Konfigurasi tidak wujud.' }, { status: 500 })
    }

    const storedUsername = settings.adminUsername as string
    const storedPassword = settings.adminPassword as string

    const hashedInput = hashPassword(password)

    if (username !== storedUsername || hashedInput !== storedPassword) {
      return NextResponse.json({ error: 'Username atau password salah.' }, { status: 401 })
    }

    const token = await new SignJWT({ admin: true, username })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('4h')
      .sign(getJwtSecret())

    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 4,
      path: '/',
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json({ error: 'Ralat server.' }, { status: 500 })
  }
}
