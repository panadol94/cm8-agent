import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "media" ADD COLUMN "sizes_mobile_banner_url" varchar;
    ALTER TABLE "media" ADD COLUMN "sizes_mobile_banner_width" numeric;
    ALTER TABLE "media" ADD COLUMN "sizes_mobile_banner_height" numeric;
    ALTER TABLE "media" ADD COLUMN "sizes_mobile_banner_mime_type" varchar;
    ALTER TABLE "media" ADD COLUMN "sizes_mobile_banner_filesize" numeric;
    ALTER TABLE "media" ADD COLUMN "sizes_mobile_banner_filename" varchar;
    CREATE INDEX IF NOT EXISTS "media_sizes_mobile_banner_sizes_mobile_banner_filename_idx" ON "media" USING btree ("sizes_mobile_banner_filename");
  `)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "media_sizes_mobile_banner_sizes_mobile_banner_filename_idx";
    ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_mobile_banner_url";
    ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_mobile_banner_width";
    ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_mobile_banner_height";
    ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_mobile_banner_mime_type";
    ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_mobile_banner_filesize";
    ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_mobile_banner_filename";
  `)
}
