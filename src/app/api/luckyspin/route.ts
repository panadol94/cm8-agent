import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })

    const settingsRes = await payload.find({ collection: 'lucky-spin-settings', limit: 1 })
    const settings = settingsRes.docs[0]

    if (!settings || !settings.eventStatus) {
      return NextResponse.json({ active: false, message: 'Event tidak aktif.' })
    }

    const now = new Date()
    const start = new Date(settings.eventStart as string)
    const end = new Date(settings.eventEnd as string)
    const timezone = (settings.timezone as string) || 'Asia/Kuching'

    // Simple timezone offset for Malaysia/Kuching = UTC+8
    const active = now >= start && now <= end

    return NextResponse.json({
      active,
      eventStart: settings.eventStart,
      eventEnd: settings.eventEnd,
      timezone,
    })
  } catch {
    return NextResponse.json({ active: false, message: 'Ralat mendapatkan status event.' })
  }
}
