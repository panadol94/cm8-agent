import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { jwtVerify } from 'jose'
import { revalidateTag } from 'next/cache'
import type { LuckySpinReward } from '@/payload-types'

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

// Weighted random selection based on probability
function weightedRandom(rewards: LuckySpinReward[]) {
  const total = rewards.reduce((sum, r) => sum + (r.probability || 0), 0)
  if (total <= 0) return null

  let random = Math.random() * total
  for (const reward of rewards) {
    random -= (reward.probability || 0)
    if (random <= 0) {
      return reward
    }
  }
  return rewards[rewards.length - 1]
}

export async function POST(request: NextRequest) {
  try {
    const session = await verifySession(request)
    if (!session?.agentId) {
      return NextResponse.json({ error: 'Sesi tidak sah.' }, { status: 401 })
    }

    const payload = await getPayload({ config: configPromise })

    // Check event status
    const { docs: settingsArr } = await payload.find({
      collection: 'lucky-spin-settings',
      limit: 1,
    })
    const settings = settingsArr[0]
    if (!settings?.eventStatus) {
      return NextResponse.json({ error: 'Event tidak aktif.' }, { status: 403 })
    }

    const now = new Date()
    const start = new Date(settings.eventStart)
    const end = new Date(settings.eventEnd)
    if (now < start || now > end) {
      return NextResponse.json({ error: 'Event belum bermula atau telah tamat.' }, { status: 403 })
    }

    // Check whitelist entry
    const whitelistEntry = await payload.find({
      collection: 'lucky-spin-whitelist',
      where: { agentId: { equals: session.agentId } },
      limit: 1,
    })

    if (whitelistEntry.docs.length === 0) {
      return NextResponse.json({ error: 'ID Agent tiada dalam whitelist.' }, { status: 403 })
    }

    const entry = whitelistEntry.docs[0]

    if (!entry.isActive) {
      return NextResponse.json({ error: 'ID tidak aktif.' }, { status: 403 })
    }

    if (entry.hasSpun) {
      return NextResponse.json({ error: 'ID ini telah digunakan untuk spin.' }, { status: 403 })
    }

    // Get active rewards
    const rewardsResult = await payload.find({
      collection: 'lucky-spin-rewards',
      where: { isActive: { equals: true } },
      sort: 'position',
    })

    const rewards = rewardsResult.docs

    if (rewards.length === 0) {
      return NextResponse.json({ error: 'Tiada hadiah tersedia.' }, { status: 500 })
    }

    // Validate total probability = 100
    const totalProb = rewards.reduce((sum, r) => sum + (r.probability || 0), 0)
    if (Math.abs(totalProb - 100) > 0.01) {
      return NextResponse.json({ error: 'Konfigurasi hadiah tidak sah (jumlah probability ≠ 100%).' }, { status: 500 })
    }

    // Determine winning reward (server-side)
    const winner = weightedRandom(rewards)
    if (!winner) {
      return NextResponse.json({ error: 'Ralat memilih hadiah.' }, { status: 500 })
    }

    // Get client info
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Save spin record
    await payload.create({
      collection: 'lucky-spin-records',
      data: {
        agentId: session.agentId,
        rewardWon: winner.rewardName,
        rewardType: winner.rewardType,
        spunAt: new Date().toISOString(),
        ipAddress: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress,
        userAgent,
        isValid: true,
      },
    })

    // Mark whitelist as spun
    await payload.update({
      collection: 'lucky-spin-whitelist',
      id: entry.id,
      data: { hasSpun: true },
    })

    // Send Telegram notification
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID

    if (botToken && chatId) {
      const message = [
        '🎰 <b>Lucky Spin Winner!</b>',
        '',
        `👤 <b>Agent ID:</b> ${session.agentId}`,
        `🎁 <b>Hadiah:</b> ${winner.rewardName}`,
        `📅 <b>Tarikh:</b> ${new Date().toLocaleString('ms-MY', { timeZone: settings.timezone || 'Asia/Kuching' })}`,
      ].join('\n')

      try {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' }),
        })
      } catch (err) {
        console.error('Telegram notification failed:', err)
      }
    }

    // Revalidate cache
    revalidateTag('luckyspin')

    // Return result with position for wheel animation
    return NextResponse.json({
      success: true,
      reward: winner.rewardName,
      rewardType: winner.rewardType,
      position: winner.position,
    })
  } catch (error) {
    console.error('Spin error:', error)
    return NextResponse.json({ error: 'Ralat server.' }, { status: 500 })
  }
}
