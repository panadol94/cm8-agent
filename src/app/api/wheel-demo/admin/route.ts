import { NextRequest, NextResponse } from 'next/server'
import {
  flattenDemoSpins,
  getDemoAdminConfig,
  getDemoSpins,
  saveDemoAdminConfig,
} from '../config'

const ADMIN_KEY = process.env.DASHBOARD_ADMIN_KEY || 'cm8admin2026'

function isAuthorized(req: NextRequest, bodyKey?: string | null) {
  const key = req.nextUrl.searchParams.get('key') || bodyKey
  return key === ADMIN_KEY
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [config, spins] = await Promise.all([getDemoAdminConfig(), getDemoSpins()])
  const recentSpins = flattenDemoSpins(spins)
  const totalSpins = recentSpins.length

  const prizeStats = config.prizes.map((prize) => ({
    label: prize.label,
    weight: prize.weight,
    wins: recentSpins.filter((spin) => spin.prize === prize.label).length,
  }))

  return NextResponse.json({
    config,
    stats: {
      totalSpins,
      whitelistCount: config.whitelist.length,
      configuredPrizes: config.prizes.length,
      prizeStats,
    },
    recentSpins: recentSpins.slice(0, 100),
  })
}

export async function POST(req: NextRequest) {
  let body: any = null

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (!isAuthorized(req, body?.key)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const configInput = body?.config || body
  const config = await saveDemoAdminConfig(configInput)

  return NextResponse.json({ ok: true, config })
}
