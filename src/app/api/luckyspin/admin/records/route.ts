import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { jwtVerify } from 'jose'
import type { Where } from 'payload'

function getJwtSecret(): Uint8Array {
  const secret = process.env.PAYLOAD_SECRET || 'fallback-secret-change-me'
  return new TextEncoder().encode(secret)
}

async function verifyAdminSession(request: NextRequest) {
  const token = request.cookies.get('ls_admin_session')?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, getJwtSecret())
    return payload as { admin?: boolean }
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await verifyAdminSession(request)
    if (!session?.admin) {
      return NextResponse.json({ error: 'Akses ditolak.' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') // 'csv' or 'json'
    const search = searchParams.get('search') || ''
    const prize = searchParams.get('prize') || ''
    const fromDate = searchParams.get('from') || ''
    const toDate = searchParams.get('to') || ''

    const payload = await getPayload({ config: configPromise })

    const where: Where = {}

    if (search) {
      where.agentId = { like: search }
    }

    if (prize) {
      where.rewardWon = { like: prize }
    }

    if (fromDate || toDate) {
      where.spunAt = {}
      if (fromDate) (where.spunAt as Record<string, string>).gte = fromDate
      if (toDate) (where.spunAt as Record<string, string>).lte = toDate
    }

    const result = await payload.find({
      collection: 'lucky-spin-records',
      where: Object.keys(where).length > 0 ? where : undefined,
      sort: '-spunAt',
      limit: 10000,
    })

    const records = result.docs

    // Export as CSV
    if (format === 'csv') {
      const headers = ['Agent ID', 'Hadiah', 'Jenis Hadiah', 'Tarikh & Masa', 'IP Address', 'User Agent', 'Valid']
      const rows = records.map((r) => [
        r.agentId,
        r.rewardWon,
        r.rewardType,
        r.spunAt,
        r.ipAddress,
        r.userAgent?.replace(/[\n\r]/g, ' ') || '',
        r.isValid ? 'Ya' : 'Tidak',
      ])

      const csvContent = [headers.join(','), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(','))].join('\n')

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="lucky-spin-records.csv"',
        },
      })
    }

    return NextResponse.json({ records })
  } catch (error) {
    console.error('Records GET error:', error)
    return NextResponse.json({ error: 'Ralat server.' }, { status: 500 })
  }
}
