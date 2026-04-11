import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const COOKIE_NAME = 'ls_session'

export async function POST() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete(COOKIE_NAME)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Ralat logout.' }, { status: 500 })
  }
}
