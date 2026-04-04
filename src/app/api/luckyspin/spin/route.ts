import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import {
  queryRewards,
  queryWhitelist,
  markWhitelistSpun,
  insertRecord,
  querySettings,
} from '@/lib/luckyspin-db'

function getJwtSecret(): Uint8Array {
  const secret = process.env.PAYLOAD_SECRET || 'fallback-secret-change-me'
  return new TextEncoder().encode(secret)
}

async function verifySession(request: NextRequest) {
  const token = request.cookies.get('ls_session')?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, getJwtSecret())
    return payload as { agentId?: string; whitelistId?: string }
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

    // Check whitelist
    const entry = await queryWhitelist(agentId)
    if (!entry) {
      return NextResponse.json({ error: 'ID Agent tiada dalam whitelist. Sila hubungi admin.' }, { status: 403 })
    }

    if (!entry.is_active) {
      return NextResponse.json({ error: 'ID Agent tidak aktif. Sila hubungi admin.' }, { status: 403 })
    }

    if (entry.has_spun) {
      return NextResponse.json({ error: 'ID ini telah digunakan untuk spin.' }, { status: 403 })
    }

    // Check event status
    const settings = await querySettings()
    if (!settings || !settings.event_status) {
      return NextResponse.json({ error: 'Event belum bermula atau telah tamat.' }, { status: 403 })
    }

    const now = new Date()
    const start = new Date(settings.event_start)
    const end = new Date(settings.event_end)
    if (now < start || now > end) {
      return NextResponse.json({ error: 'Event belum bermula atau telah tamat.' }, { status: 403 })
    }

    // Get rewards
    const rewards = await queryRewards()
    if (rewards.length === 0) {
      return NextResponse.json({ error: 'Tiada hadiah tersedia.' }, { status: 403 })
    }

    // Probability-based selection
    const totalProb = rewards.reduce((sum, r) => {
      const p = Number(r.probability || 1)
      return sum + p
    }, 0)
    let random = Math.floor(Math.random() * totalProb)
    let selectedReward = rewards[0]
    for (const reward of rewards) {
      const prob = Number(reward.probability || 1)
      random -= prob
      if (random < 0) {
        selectedReward = reward
        break
      }
    }

    const nowISO = now.toISOString()

    // Mark spun + save record — all direct DB, no Payload ORM
    await markWhitelistSpun(entry.id)
    await insertRecord({
      agentId,
      rewardWon: selectedReward.reward_name,
      rewardType: selectedReward.reward_type,
      spunAt: nowISO,
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    })

    const response = NextResponse.json({
      success: true,
      reward: selectedReward.reward_name,
      rewardType: selectedReward.reward_type,
    })
    response.cookies.delete('ls_session')

    return response
  } catch (error: any) {
    console.error('Spin error:', error?.message || error, error?.stack)
    return NextResponse.json({ error: 'Ralat server.' }, { status: 500 })
  }
}
