import { NextResponse } from 'next/server'
import { db } from '@/lib/lucky-wheel-store'
import { getSession } from '@/lib/lucky-wheel-auth'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const stats = db.getStats()
  return NextResponse.json(stats)
}
