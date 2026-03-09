import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * POST /api/scan-limit/check
 * Check if a user can execute a scan today.
 * Body: { phone: string }
 * Returns: { allowed, reason?, remaining?, used?, limit? }
 */
export async function POST(req: Request) {
  try {
    const { phone } = await req.json()

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

    // Check if user is banned (check ALL records for this phone, not just today)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bannedCheck: any = await payload.find({
      collection: 'scan-usage' as any,
      where: {
        phone: { equals: phone },
        isBanned: { equals: true },
      },
      limit: 1,
    })

    if (bannedCheck.docs.length > 0) {
      return NextResponse.json({
        allowed: false,
        reason: 'banned',
        message: 'Akaun anda telah disekat daripada menggunakan scanner.',
      })
    }

    // Find or check today's usage
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const usageResult: any = await payload.find({
      collection: 'scan-usage' as any,
      where: {
        and: [{ phone: { equals: phone } }, { date: { equals: today } }],
      },
      limit: 1,
    })

    const usage = usageResult.docs[0]
    const scanCount = usage?.scanCount ?? 0
    const bonusScans = usage?.bonusScans ?? 0
    const effectiveLimit = dailyLimit + bonusScans

    if (scanCount >= effectiveLimit) {
      return NextResponse.json({
        allowed: false,
        reason: 'limit',
        used: scanCount,
        limit: effectiveLimit,
        message: `Anda telah mencapai had scan harian (${effectiveLimit} kali). Hubungi admin untuk tambahan.`,
      })
    }

    return NextResponse.json({
      allowed: true,
      remaining: effectiveLimit - scanCount,
      used: scanCount,
      limit: effectiveLimit,
    })
  } catch (error) {
    console.error('Scan limit check error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
