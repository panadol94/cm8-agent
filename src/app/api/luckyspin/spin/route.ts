import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { jwtVerify } from 'jose'

function getJwtSecret(): Uint8Array {
  const secret = process.env.PAYLOAD_SECRET || 'fallback-secret-change-me'
  return new TextEncoder().encode(secret)
}

async function verifySession(request: NextRequest) {
  const token = request.cookies.get('ls_session')?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, getJwtSecret())
    return payload as { agentId?: string }
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await verifySession(request)
    if (!session?.agentId) {
      return NextResponse.json({ error: 'Sesi tidak sah. Sila login semula.' }, { status: 401 })
    }

    const agentId = String(session.agentId).trim()
    const payload = await getPayload({ config: configPromise })

    // Check whitelist (case-insensitive)
    const allWhitelist = await payload.find({
      collection: 'lucky-spin-whitelist',
      limit: 1000,
    })

    const entry = allWhitelist.docs.find(
      (doc: any) => String(doc.agentId || '').toLowerCase() === agentId.toLowerCase(),
    )

    if (!entry) {
      return NextResponse.json({ error: 'ID Agent tiada dalam whitelist. Sila hubungi admin.' }, { status: 403 })
    }

    if (!entry.isActive) {
      return NextResponse.json({ error: 'ID Agent tidak aktif. Sila hubungi admin.' }, { status: 403 })
    }

    if (entry.hasSpun) {
      return NextResponse.json({ error: 'ID ini telah digunakan untuk spin.' }, { status: 403 })
    }

    // Check event status
    const settingsRes = await payload.find({ collection: 'lucky-spin-settings', limit: 1 })
    const settings = settingsRes.docs[0]

    if (!settings || !settings.eventStatus) {
      return NextResponse.json({ error: 'Event belum bermula atau telah tamat.' }, { status: 403 })
    }

    const now = new Date()
    const start = new Date(settings.eventStart as string)
    const end = new Date(settings.eventEnd as string)

    if (now < start || now > end) {
      return NextResponse.json({ error: 'Event belum bermula atau telah tamat.' }, { status: 403 })
    }

    // Get active rewards with stock remaining
    const rewardsRes = await payload.find({
      collection: 'lucky-spin-rewards',
      where: { isActive: { equals: true } },
      sort: 'position',
      limit: 100,
    })

    const rewards: any[] = rewardsRes.docs.filter((r: any) => {
      const stock = Number((r as any).stock || 0)
      const claimed = Number((r as any).claimedCount || 0)
      return stock > claimed
    })

    if (rewards.length === 0) {
      return NextResponse.json({ error: 'Semua hadiah telah habis.' }, { status: 403 })
    }

    // Fixed pool selection based on remaining stock
    const totalRemaining = rewards.reduce((sum: number, r: any) => sum + Math.max(0, Number(r.stock || 0) - Number(r.claimedCount || 0)), 0)
    let random = Math.floor(Math.random() * totalRemaining)

    let selectedReward: any = rewards[0]
    for (const reward of rewards as any[]) {
      const remaining = Math.max(0, Number((reward as any).stock || 0) - Number((reward as any).claimedCount || 0))
      random -= remaining
      if (random < 0) {
        selectedReward = reward as any
        break
      }
    }

    // Mark whitelist as spun
    await payload.update({
      collection: 'lucky-spin-whitelist',
      id: entry.id,
      data: { hasSpun: true },
    })

    // Increment claimed count
    await payload.update({
      collection: 'lucky-spin-rewards',
      id: selectedReward.id,
      data: { claimedCount: Number(selectedReward.claimedCount || 0) + 1 },
    })

    // Save record
    await payload.create({
      collection: 'lucky-spin-records',
      data: {
        agentId,
        rewardWon: selectedReward.rewardName as string,
        rewardType: selectedReward.rewardType as string,
        spunAt: now.toISOString(),
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        isValid: true,
      },
    })

    const response = NextResponse.json({
      success: true,
      reward: selectedReward.rewardName,
      rewardType: selectedReward.rewardType,
    })
    response.cookies.delete('ls_session')

    return response
  } catch (error) {
    console.error('Spin error:', error)
    return NextResponse.json({ error: 'Ralat server.' }, { status: 500 })
  }
}
