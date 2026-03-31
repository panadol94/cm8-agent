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

    const { agentId } = session

    const payload = await getPayload({ config: configPromise })

    // Check whitelist
    const whitelist = await payload.find({
      collection: 'lucky-spin-whitelist',
      where: { agentId: { equals: agentId } },
      limit: 1,
    })

    if (whitelist.docs.length === 0) {
      return NextResponse.json({ error: 'ID Agent tiada dalam whitelist. Sila hubungi admin.' }, { status: 403 })
    }

    const entry = whitelist.docs[0]

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

    // Get active rewards
    const rewards = await payload.find({
      collection: 'lucky-spin-rewards',
      where: { isActive: { equals: true } },
      limit: 100,
    })

    if (rewards.docs.length === 0) {
      return NextResponse.json({ error: 'Tiada hadiah tersedia.' }, { status: 500 })
    }

    // Weighted random selection
    const totalProb = rewards.docs.reduce((sum, r) => sum + (r.probability || 0), 0)
    let random = Math.random() * totalProb

    let selectedReward = rewards.docs[0]
    for (const reward of rewards.docs) {
      random -= reward.probability || 0
      if (random <= 0) {
        selectedReward = reward
        break
      }
    }

    // Mark as spun
    await payload.update({
      collection: 'lucky-spin-whitelist',
      id: entry.id,
      data: { hasSpun: true },
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

    // Clear session cookie
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
