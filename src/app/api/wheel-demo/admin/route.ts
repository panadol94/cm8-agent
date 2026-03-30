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

export async function DELETE(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key')
  if (!isAuthorized(req, key)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const agentId = req.nextUrl.searchParams.get('agentId')
  const whatsapp = req.nextUrl.searchParams.get('whatsapp')

  if (!agentId || !whatsapp) {
    return NextResponse.json({ error: 'Missing agentId or whatsapp' }, { status: 400 })
  }

  const config = await getDemoAdminConfig()
  const phone = whatsapp.startsWith('60') ? whatsapp : `60${whatsapp.replace(/^0/, '')}`

  const filtered = config.whitelist.filter(
    (entry) =>
      !(entry.agentId.trim().toLowerCase() === agentId.trim().toLowerCase() &&
        entry.whatsapp.replace(/^60/, '') === phone.replace(/^60/, ''))
  )

  if (filtered.length === config.whitelist.length) {
    return NextResponse.json({ error: 'Participant not found' }, { status: 404 })
  }

  const updated = await saveDemoAdminConfig({ ...config, whitelist: filtered })
  return NextResponse.json({ ok: true, whitelist: updated.whitelist })
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
