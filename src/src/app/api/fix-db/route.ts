import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { sql } from 'drizzle-orm'

/**
 * GET /api/fix-db
 * One-time fix: adds missing scan_usage columns to Payload internal tables.
 * Safe to run multiple times (uses IF NOT EXISTS).
 */
export async function GET() {
  try {
    const payload = await getPayload({ config })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = (payload.db as any).drizzle

    // Add scan_usage_id column to payload_locked_documents_rels
    await db.execute(
      sql`ALTER TABLE payload_locked_documents_rels ADD COLUMN IF NOT EXISTS scan_usage_id integer`,
    )

    // Add scan_usage_id column to payload_preferences_rels
    await db.execute(
      sql`ALTER TABLE payload_preferences_rels ADD COLUMN IF NOT EXISTS scan_usage_id integer`,
    )

    // Create scan_usage table if it doesn't exist
    await db.execute(sql`CREATE TABLE IF NOT EXISTS scan_usage (
      id serial PRIMARY KEY,
      phone varchar NOT NULL,
      cm8_username varchar DEFAULT '',
      date varchar NOT NULL,
      scan_count integer DEFAULT 0,
      bonus_scans integer DEFAULT 0,
      is_banned boolean DEFAULT false,
      updated_at timestamptz DEFAULT now() NOT NULL,
      created_at timestamptz DEFAULT now() NOT NULL
    )`)

    // Add scanner_daily_limit to site_settings if missing
    await db.execute(
      sql`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS scanner_daily_limit numeric DEFAULT 10`,
    )

    return NextResponse.json({
      success: true,
      message: 'Database fixed! All missing columns and tables created.',
    })
  } catch (error) {
    console.error('DB fix error:', error)
    return NextResponse.json(
      { error: 'Failed to fix database', details: String(error) },
      { status: 500 },
    )
  }
}
