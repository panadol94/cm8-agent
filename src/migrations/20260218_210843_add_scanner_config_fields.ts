import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Create the enum type for scanner seed interval (if not exists)
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_site_settings_scanner_seed_interval" AS ENUM('15', '30', '60', '180');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  // Add scanner config columns to site_settings
  await db.execute(sql`
    ALTER TABLE "site_settings"
      ADD COLUMN IF NOT EXISTS "scanner_min_rtp" numeric DEFAULT 30,
      ADD COLUMN IF NOT EXISTS "scanner_max_rtp" numeric DEFAULT 97,
      ADD COLUMN IF NOT EXISTS "scanner_hot_threshold" numeric DEFAULT 85,
      ADD COLUMN IF NOT EXISTS "scanner_warm_threshold" numeric DEFAULT 65,
      ADD COLUMN IF NOT EXISTS "scanner_hot_percent" numeric DEFAULT 10,
      ADD COLUMN IF NOT EXISTS "scanner_warm_percent" numeric DEFAULT 30,
      ADD COLUMN IF NOT EXISTS "scanner_cold_percent" numeric DEFAULT 60,
      ADD COLUMN IF NOT EXISTS "scanner_seed_interval" "enum_site_settings_scanner_seed_interval" DEFAULT '60';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings"
      DROP COLUMN IF EXISTS "scanner_min_rtp",
      DROP COLUMN IF EXISTS "scanner_max_rtp",
      DROP COLUMN IF EXISTS "scanner_hot_threshold",
      DROP COLUMN IF EXISTS "scanner_warm_threshold",
      DROP COLUMN IF EXISTS "scanner_hot_percent",
      DROP COLUMN IF EXISTS "scanner_warm_percent",
      DROP COLUMN IF EXISTS "scanner_cold_percent",
      DROP COLUMN IF EXISTS "scanner_seed_interval";
    DROP TYPE IF EXISTS "public"."enum_site_settings_scanner_seed_interval";
  `)
}
