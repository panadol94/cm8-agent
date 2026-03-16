import { NextRequest, NextResponse } from 'next/server'
import {
  MAINTENANCE_GROUP_ID,
  TELEGRAM_BOT_TOKEN,
  buildWhitelistKey,
  findWhitelistEntry,
  generateClaimId,
  getClientIp,
  getDemoAdminConfig,
  getDemoSpins,
  getDemoWhitelist,
  getMytTimestamp,
  getSpinLimitForEntry,
  normalizeAgentId,
  normalizePhone,
  pickDemoPrize,
  saveDemoSpins,
} from '../config'

export async function POST(req: NextRequest) {
  try {
    const { agentId, whatsapp } = await req.json()

    if (!agentId || !whatsapp) {
      return NextResponse.json(
        { ok: false, error: 'Sila isi ID Agent dan nombor WhatsApp.' },
        { status: 400 },
      )
    }

    const config = await getDemoAdminConfig()
    const whitelist = await getDemoWhitelist()
    const entry = findWhitelistEntry(whitelist, agentId, whatsapp)

    if (!entry) {
      return NextResponse.json(
        { ok: false, allowed: false, error: 'Login event tidak sah.' },
        { status: 403 },
      )
    }

    const key = buildWhitelistKey(agentId, whatsapp)
    const spins = await getDemoSpins()
    const history = spins[key] || []
    const spinLimit = getSpinLimitForEntry(entry, config)
    const remainingSpins = Math.max(0, spinLimit - history.length)

    if (remainingSpins <= 0) {
      return NextResponse.json(
        { ok: false, alreadySpun: true, error: `Limit putar (${spinLimit}) telah dicapai.` },
        { status: 409 },
      )
    }

    // Use prizes from config
    const prize = pickDemoPrize(config.prizes as any)
    const spunAtMs = Date.now()
    const spunAt = getMytTimestamp(new Date(spunAtMs))
    const claimId = generateClaimId(agentId)
    const ip = getClientIp(req.headers)
    const userAgent = req.headers.get('user-agent') || 'Unknown'

    // Append to history array (supports multiple spins)
    const newSpin = {
      agentId: normalizeAgentId(agentId),
      whatsapp: normalizePhone(whatsapp),
      prize,
      spunAt,
      spunAtMs,
      claimId,
      ip,
      userAgent,
    }
    spins[key] = [...history, newSpin]

    await saveDemoSpins(spins)

    if (TELEGRAM_BOT_TOKEN) {
      const message = [
        '🎡 *Wheel Demo Spin*',
        '',
        `👤 Agent ID: *${entry.agentId}*`,
        `📱 WhatsApp: \`${entry.whatsapp}\``,
        `🏆 Hadiah: *${prize}*`,
        `🧾 Claim ID: \`${claimId}\``,
        `🌐 IP: \`${ip}\``,
        `⏰ Masa: ${spunAt}`,
      ].join('\n')

      fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: MAINTENANCE_GROUP_ID,
          text: message,
          parse_mode: 'Markdown',
        }),
      }).catch((error) => {
        console.error('[wheel-demo spin] Telegram notify failed:', error)
      })
    }

    return NextResponse.json({
      ok: true,
      prize,
      claimId,
      spunAt,
      agentId: entry.agentId,
      whatsapp: entry.whatsapp,
    })
  } catch (error) {
    console.error('[wheel-demo spin] Error:', error)
    return NextResponse.json(
      { ok: false, error: 'Ralat pelayan semasa spin.' },
      { status: 500 },
    )
  }
}
