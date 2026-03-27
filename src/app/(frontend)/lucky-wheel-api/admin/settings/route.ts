import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/lucky-wheel-store'
import { getSession } from '@/lib/lucky-wheel-auth'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const settings = db.getSettings()
  return NextResponse.json(settings)
}

export async function PUT(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const settings = db.updateSettings(body)
    return NextResponse.json({ ok: true, settings })
  } catch {
    return NextResponse.json({ error: 'Ralat server' }, { status: 500 })
  }
}
