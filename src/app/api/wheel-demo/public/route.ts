import { NextResponse } from 'next/server'
import { getDemoAdminConfig } from '../config'

export async function GET() {
  const config = await getDemoAdminConfig()

  return NextResponse.json({
    prizes: config.prizes,
    spinLimitPerEntry: config.spinLimitPerEntry,
    whitelistCount: config.whitelist.length,
  })
}
