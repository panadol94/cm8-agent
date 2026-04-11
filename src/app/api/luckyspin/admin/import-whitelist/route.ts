import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { jwtVerify } from 'jose'

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

export async function POST(request: NextRequest) {
  try {
    const session = await verifyAdminSession(request)
    if (!session?.admin) {
      return NextResponse.json({ error: 'Akses ditolak.' }, { status: 401 })
    }

    const payload = await getPayload({ config: configPromise })
    const { agentIds }: { agentIds: string[] } = await request.json()

    if (!Array.isArray(agentIds) || agentIds.length === 0) {
      return NextResponse.json({ error: 'Senarai Agent ID diperlukan.' }, { status: 400 })
    }

    const results = {
      added: 0,
      updated: 0,
      failed: 0,
      errors: [] as string[],
    }

    for (const agentId of agentIds) {
      if (!agentId || typeof agentId !== 'string') continue

      const trimmedId = agentId.trim()
      if (!trimmedId) continue

      try {
        // Check if exists
        const existing = await payload.find({
          collection: 'lucky-spin-whitelist',
          where: { agentId: { equals: trimmedId } },
          limit: 1,
        })

        if (existing.docs.length > 0) {
          // Update to ensure active
          await payload.update({
            collection: 'lucky-spin-whitelist',
            id: existing.docs[0].id,
            data: { isActive: true },
          })
          results.updated++
        } else {
          // Create new
          await payload.create({
            collection: 'lucky-spin-whitelist',
            data: {
              agentId: trimmedId,
              isActive: true,
              hasSpun: false,
              createdAt: new Date().toISOString(),
            },
          })
          results.added++
        }
      } catch (err) {
        results.failed++
        results.errors.push(`Gagal untuk ${trimmedId}: ${err}`)
      }
    }

    return NextResponse.json({ success: true, results })
  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json({ error: 'Ralat server.' }, { status: 500 })
  }
}
