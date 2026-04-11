import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { SignJWT } from 'jose'
import { cookies } from 'next/headers'
import { verifyPassword } from '@/lib/auth'

const COOKIE_NAME = 'ls_admin_session'

function getJwtSecret(): Uint8Array {
  const secret = process.env.PAYLOAD_SECRET || 'fallback-secret-change-me'
  return new TextEncoder().encode(secret)
}

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()

    if (!username || !password) {
      return NextResponse.json({ error: 'Username dan password diperlukan.' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })
    const { docs: settingsArr } = await payload.find({
      collection: 'lucky-spin-settings',
      limit: 1,
    })
    const settings = settingsArr[0]

    if (!settings) {
      return NextResponse.json({ error: 'Tetapan admin tidak dikonfigurasi.' }, { status: 500 })
    }

    // Check credentials
    const storedUsername = settings.adminUsername
    const storedPassword = settings.adminPassword

    if (!storedUsername || !storedPassword) {
      return NextResponse.json({ error: 'Kredensial admin tidak dijumpai.' }, { status: 500 })
    }

    if (username !== storedUsername) {
      return NextResponse.json({ error: 'Username atau password salah.' }, { status: 401 })
    }

    const passwordValid = await verifyPassword(password, storedPassword)
    if (!passwordValid) {
      return NextResponse.json({ error: 'Username atau password salah.' }, { status: 401 })
    }

    // Generate session token
    const token = await new SignJWT({ admin: true, username })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('8h')
      .sign(getJwtSecret())

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8, // 8 hours
      path: '/',
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json({ error: 'Ralat server.' }, { status: 500 })
  }
}
