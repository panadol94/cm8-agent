import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const MEDIA_DIR = '/app/media'
const SPINS_FILE = path.join(MEDIA_DIR, 'spins.json')

type SpinRecord = {
  prize: string
  device: string
  timestamp: string
  claimId?: string
}

function esc(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ claimId: string }> }) {
  const { claimId } = await params

  let spins: Record<string, SpinRecord> = {}
  try {
    const data = await fs.readFile(SPINS_FILE, 'utf-8')
    spins = JSON.parse(data)
  } catch {
    return new NextResponse('Not found', { status: 404 })
  }

  const entry = Object.entries(spins).find(([, v]) => v.claimId === claimId)
  if (!entry) {
    return new NextResponse('Not found', { status: 404 })
  }

  const [username, rec] = entry
  const prizeColor = rec.prize === 'RM30' ? '#ffd700' : rec.prize === 'RM10' ? '#25D366' : '#ff6b4a'

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2d0a0a"/>
      <stop offset="100%" stop-color="#1a0505"/>
    </linearGradient>
  </defs>
  <rect width="1080" height="1350" fill="url(#bg)"/>
  <text x="540" y="120" text-anchor="middle" fill="#ffd700" font-family="Arial, sans-serif" font-size="56" font-weight="700">CM8 Lucky Wheel Claim</text>
  <rect x="120" y="200" width="840" height="900" rx="28" fill="#2a1111" stroke="#ffd700" stroke-width="3"/>

  <text x="170" y="320" fill="#ffffff" font-family="Arial, sans-serif" font-size="40" font-weight="600">Username</text>
  <text x="170" y="380" fill="#ffd700" font-family="Arial, sans-serif" font-size="52" font-weight="700">${esc(username)}</text>

  <text x="170" y="500" fill="#ffffff" font-family="Arial, sans-serif" font-size="40" font-weight="600">Hadiah</text>
  <text x="170" y="560" fill="${prizeColor}" font-family="Arial, sans-serif" font-size="64" font-weight="800">${esc(rec.prize)}</text>

  <text x="170" y="680" fill="#ffffff" font-family="Arial, sans-serif" font-size="40" font-weight="600">Masa Spin</text>
  <text x="170" y="740" fill="#e6e6e6" font-family="Arial, sans-serif" font-size="36">${esc(rec.timestamp)}</text>

  <text x="170" y="860" fill="#ffffff" font-family="Arial, sans-serif" font-size="40" font-weight="600">Claim ID</text>
  <text x="170" y="920" fill="#ffd700" font-family="Courier New, monospace" font-size="34" font-weight="700">${esc(claimId)}</text>

  <text x="540" y="1180" text-anchor="middle" fill="#b7b7b7" font-family="Arial, sans-serif" font-size="28">Gunakan Claim ID ini untuk semakan hadiah</text>
</svg>`

  return new NextResponse(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  })
}
