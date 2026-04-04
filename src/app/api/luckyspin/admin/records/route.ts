import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { queryRecords } from '@/lib/luckyspin-db'

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

    const result = await queryRecords({
      agentId: agentId || undefined,
      rewardWon: rewardWon || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      page,
      limit,
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
