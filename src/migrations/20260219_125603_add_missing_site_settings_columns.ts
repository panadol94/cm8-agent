import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "cta_button1_text" varchar DEFAULT '🚀 Jadi Agent Sekarang';
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "cta_button1_link" varchar DEFAULT 'https://masuk10.com/WhatsappVVIP';
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "cta_button2_text" varchar DEFAULT 'Daftar Akaun CM8';
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "cta_button2_link" varchar DEFAULT 'https://masuk10.com/WhatsappVVIP';
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "whatsapp_number" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "telegram_link" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "scanner_min_rtp" numeric DEFAULT 30;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "scanner_max_rtp" numeric DEFAULT 97;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "scanner_hot_threshold" numeric DEFAULT 85;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "scanner_warm_threshold" numeric DEFAULT 65;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "scanner_hot_percent" numeric DEFAULT 10;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "scanner_warm_percent" numeric DEFAULT 30;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "scanner_cold_percent" numeric DEFAULT 60;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "scanner_seed_interval" varchar DEFAULT '60';
  `)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "cta_button1_text";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "cta_button1_link";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "cta_button2_text";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "cta_button2_link";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "whatsapp_number";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "telegram_link";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "scanner_min_rtp";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "scanner_max_rtp";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "scanner_hot_threshold";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "scanner_warm_threshold";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "scanner_hot_percent";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "scanner_warm_percent";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "scanner_cold_percent";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "scanner_seed_interval";
  `)
}
