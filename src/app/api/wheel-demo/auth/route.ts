import { NextRequest, NextResponse } from 'next/server'
import {
  buildWhitelistKey,
  findWhitelistEntry,
  getDemoAdminConfig,
  getDemoSpins,
  getSpinLimitForEntry,
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
    const entry = findWhitelistEntry(config.whitelist, agentId, whatsapp)

    if (!entry) {
      return NextResponse.json(
        {
          ok: false,
          allowed: false,
          error: 'ID Agent atau nombor WhatsApp tiada dalam senarai event.',
        },
        { status: 403 },
      )
    }

    const spins = await getDemoSpins()
    const key = buildWhitelistKey(agentId, whatsapp)
    const history = spins[key] || []
    const spinLimit = getSpinLimitForEntry(entry, config)
    const latestSpin = history[history.length - 1] || null
    const remainingSpins = Math.max(0, spinLimit - history.length)

    if (remainingSpins <= 0) {
      return NextResponse.json({
        ok: true,
        allowed: true,
        alreadySpun: true,
        agentId: entry.agentId,
        whatsapp: entry.whatsapp,
        spinLimit,
        usedSpins: history.length,
        remainingSpins,
        spin: latestSpin,
      })
    }

    return NextResponse.json({
      ok: true,
      allowed: true,
      alreadySpun: false,
      agentId: entry.agentId,
      whatsapp: entry.whatsapp,
      spinLimit,
      usedSpins: history.length,
      remainingSpins,
      latestSpin,
    })
  } catch (error) {
    console.error('[wheel-demo auth] Error:', error)
    return NextResponse.json(
      { ok: false, error: 'Ralat pelayan semasa semak whitelist.' },
      { status: 500 },
    )
  }
}
