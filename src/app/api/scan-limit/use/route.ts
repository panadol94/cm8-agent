import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * POST /api/scan-limit/use
 * Record a scan execution for a user.
 * Body: { phone: string, cm8Username?: string }
 * Returns: { success, used, limit }
 */
export async function POST(req: Request) {
  try {
    const { phone, cm8Username } = await req.json()

    if (!phone) {
      return NextResponse.json({ error: 'Phone is required' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    // Get today's date string in Malaysia timezone
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kuala_Lumpur' })

    // Get the daily scan limit from site settings
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const siteSettings: any = await payload.findGlobal({ slug: 'site-settings' })
    const dailyLimit = siteSettings.scannerDailyLimit ?? 10

    // Find today's usage record
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const usageResult: any = await payload.find({
      collection: 'scan-usage' as any,
      where: {
        and: [{ phone: { equals: phone } }, { date: { equals: today } }],
      },
      limit: 1,
    })

    const existing = usageResult.docs[0]

    if (existing) {
      // Update existing record — increment scanCount
      const newCount = (existing.scanCount ?? 0) + 1
      await payload.update({
        collection: 'scan-usage' as any,
        id: existing.id,
        data: {
          scanCount: newCount,
          ...(cm8Username ? { cm8Username } : {}),
        },
      })

      const bonusScans = existing.bonusScans ?? 0
      const effectiveLimit = dailyLimit + bonusScans

      return NextResponse.json({
        success: true,
        used: newCount,
        limit: effectiveLimit,
        remaining: Math.max(0, effectiveLimit - newCount),
      })
    } else {
      // Create new record for today
      await payload.create({
        collection: 'scan-usage' as any,
        data: {
          phone,
          cm8Username: cm8Username || '',
          date: today,
          scanCount: 1,
          bonusScans: 0,
          isBanned: false,
        },
      })

      return NextResponse.json({
        success: true,
        used: 1,
        limit: dailyLimit,
        remaining: dailyLimit - 1,
      })
    }
  } catch (error) {
    console.error('Scan limit use error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
