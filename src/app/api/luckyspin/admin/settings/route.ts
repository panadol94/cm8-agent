import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { jwtVerify } from 'jose'
import { hashPassword, verifyPassword } from '@/lib/auth'

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

    const payload = await getPayload({ config: configPromise })
    const { docs: settingsArr } = await payload.find({
      collection: 'lucky-spin-settings',
      limit: 1,
    })
    const settings = settingsArr[0]

    // Don't send password hash
    const safeSettings = { ...settings }
    if (safeSettings.adminPassword) {
      safeSettings.adminPassword = '********'
    }

    return NextResponse.json({ settings: safeSettings })
  } catch (error) {
    console.error('Settings GET error:', error)
    return NextResponse.json({ error: 'Ralat server.' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await verifyAdminSession(request)
    if (!session?.admin) {
      return NextResponse.json({ error: 'Akses ditolak.' }, { status: 401 })
    }

    const payload = await getPayload({ config: configPromise })
    const body = await request.json()

    // Validate total probability if event is being enabled
    if (body.eventStatus) {
      const rewards = await payload.find({
        collection: 'lucky-spin-rewards',
        where: { isActive: { equals: true } },
      })
      const totalProb = rewards.docs.reduce((sum, r) => sum + (r.probability || 0), 0)
      if (Math.abs(totalProb - 100) > 0.01) {
        return NextResponse.json(
          { error: `Jumlah probability aktif ialah ${totalProb}%, mesti 100%.` },
          { status: 400 },
        )
      }
    }

    // Hash password if provided (not '********' placeholder)
    const updateData = { ...body }
    if (body.adminPassword && body.adminPassword !== '********') {
      updateData.adminPassword = await hashPassword(body.adminPassword)
    } else {
      delete updateData.adminPassword // Don't update if placeholder
    }

    // Find existing settings doc first
    const { docs: existing } = await payload.find({
      collection: 'lucky-spin-settings',
      limit: 1,
    })
    const settingsId = existing[0]?.id
    if (!settingsId) {
      return NextResponse.json({ error: 'Dokumen tetapan tidak dijumpai.' }, { status: 404 })
    }
    const updated = await payload.update({
      collection: 'lucky-spin-settings',
      id: settingsId,
      data: updateData,
    })

    // Don't send password hash back
    const safeSettings = { ...updated }
    if (safeSettings.adminPassword) {
      safeSettings.adminPassword = '********'
    }

    return NextResponse.json({ success: true, settings: safeSettings })
  } catch (error) {
    console.error('Settings PUT error:', error)
    return NextResponse.json({ error: 'Ralat server.' }, { status: 500 })
  }
}
