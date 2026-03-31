import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { jwtVerify } from 'jose'

function getJwtSecret(): Uint8Array {
  const secret = process.env.PAYLOAD_SECRET || 'fallback-secret-change-me'
  return new TextEncoder().encode(secret)
}

async function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get('ls_admin_session')?.value
  if (!token) return false
  try {
    const { payload } = await jwtVerify(token, getJwtSecret())
    return !!(payload as { admin?: boolean }).admin
  } catch {
    return false
  }
}

export async function GET(request: NextRequest) {
  if (!await verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const agentId = searchParams.get('agentId') || ''
    const rewardWon = searchParams.get('rewardWon') || ''
    const dateFrom = searchParams.get('dateFrom') || ''
    const dateTo = searchParams.get('dateTo') || ''
    const exportCsv = searchParams.get('export') === 'csv'

    const payload = await getPayload({ config: configPromise })

    const where: Record<string, Record<string, unknown>> = {}
    if (agentId) where.agentId = { contains: agentId }
    if (rewardWon) where.rewardWon = { contains: rewardWon }
    if (dateFrom || dateTo) {
      where.spunAt = {}
      if (dateFrom) where.spunAt.greater_than = dateFrom
      if (dateTo) where.spunAt.less_than = dateTo
    }

    const result = await payload.find({
      collection: 'lucky-spin-records',
      where,
      page,
      limit,
      sort: '-spunAt',
    })

    if (exportCsv) {
      const csv = [
        'Agent ID,Hadiah,Jenis,Tarikh & Masa,IP Address,Valid',
        ...result.docs.map((d) =>
          `${d.agentId},${d.rewardWon},${d.rewardType || ''},${d.spunAt || ''},${d.ipAddress || ''},${d.isValid}`
        ),
      ].join('\n')

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename=luckyspin-records.csv',
        },
      })
    }

    return NextResponse.json({
      docs: result.docs,
      totalPages: result.totalPages,
      totalDocs: result.totalDocs,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
