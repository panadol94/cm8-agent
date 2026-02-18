// push-schema.mjs — runs Drizzle schema push against the production database
// This uses the raw Drizzle adapter to push tables without needing the full Payload CLI
import pg from 'pg'
const { Client } = pg

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.log('[push-schema] No DATABASE_URL found, skipping schema push')
  process.exit(0)
}

const client = new Client({ connectionString: DATABASE_URL })

async function pushSchema() {
  try {
    await client.connect()
    console.log('[push-schema] Connected to database')

    // Create tables if they don't exist
    // Users table (required by Payload)
    await client.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" serial PRIMARY KEY,
        "email" varchar NOT NULL UNIQUE,
        "hash" varchar,
        "salt" varchar,
        "reset_password_token" varchar,
        "reset_password_expiration" timestamptz,
        "login_attempts" integer DEFAULT 0,
        "lock_until" timestamptz,
        "created_at" timestamptz DEFAULT now() NOT NULL,
        "updated_at" timestamptz DEFAULT now() NOT NULL
      )
    `)

    // Users sessions
    await client.query(`
      CREATE TABLE IF NOT EXISTS "users_sessions" (
        "id" serial PRIMARY KEY,
        "_order" integer NOT NULL,
        "_parent_id" integer NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "created_at" timestamptz DEFAULT now(),
        "expires_at" timestamptz
      )
    `)

    // Media table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "media" (
        "id" serial PRIMARY KEY,
        "alt" varchar,
        "url" varchar,
        "thumbnail_u_r_l" varchar,
        "filename" varchar,
        "mime_type" varchar,
        "filesize" integer,
        "width" integer,
        "height" integer,
        "focal_x" integer,
        "focal_y" integer,
        "created_at" timestamptz DEFAULT now() NOT NULL,
        "updated_at" timestamptz DEFAULT now() NOT NULL
      )
    `)

    // Agents table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "agents" (
        "id" serial PRIMARY KEY,
        "name" varchar,
        "phone" varchar,
        "username" varchar,
        "status" varchar DEFAULT 'pending',
        "created_at" timestamptz DEFAULT now() NOT NULL,
        "updated_at" timestamptz DEFAULT now() NOT NULL
      )
    `)

    // Testimonials table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "testimonials" (
        "id" serial PRIMARY KEY,
        "name" varchar,
        "amount" varchar,
        "image" varchar,
        "type" varchar DEFAULT 'income',
        "featured" boolean DEFAULT false,
        "order" integer DEFAULT 0,
        "created_at" timestamptz DEFAULT now() NOT NULL,
        "updated_at" timestamptz DEFAULT now() NOT NULL
      )
    `)

    // FAQs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "faqs" (
        "id" serial PRIMARY KEY,
        "question" varchar NOT NULL,
        "answer" varchar NOT NULL,
        "order" integer DEFAULT 0,
        "created_at" timestamptz DEFAULT now() NOT NULL,
        "updated_at" timestamptz DEFAULT now() NOT NULL
      )
    `)

    // Blog posts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "blog_posts" (
        "id" serial PRIMARY KEY,
        "title" varchar,
        "slug" varchar UNIQUE,
        "content" jsonb,
        "excerpt" varchar,
        "status" varchar DEFAULT 'draft',
        "featured_image_id" integer REFERENCES "media"("id"),
        "created_at" timestamptz DEFAULT now() NOT NULL,
        "updated_at" timestamptz DEFAULT now() NOT NULL
      )
    `)

    // Providers table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "providers" (
        "id" serial PRIMARY KEY,
        "name" varchar NOT NULL,
        "image" varchar,
        "show_on_homepage" boolean DEFAULT true,
        "order" integer DEFAULT 0,
        "created_at" timestamptz DEFAULT now() NOT NULL,
        "updated_at" timestamptz DEFAULT now() NOT NULL
      )
    `)

    // Banners table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "banners" (
        "id" serial PRIMARY KEY,
        "title" varchar,
        "subtitle" varchar,
        "cta_text" varchar,
        "cta_link" varchar,
        "image_id" integer REFERENCES "media"("id"),
        "active" boolean DEFAULT true,
        "order" integer DEFAULT 0,
        "created_at" timestamptz DEFAULT now() NOT NULL,
        "updated_at" timestamptz DEFAULT now() NOT NULL
      )
    `)

    // Promos table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "promos" (
        "id" serial PRIMARY KEY,
        "title" varchar,
        "description" varchar,
        "icon" varchar,
        "order" integer DEFAULT 0,
        "created_at" timestamptz DEFAULT now() NOT NULL,
        "updated_at" timestamptz DEFAULT now() NOT NULL
      )
    `)

    // PatchProviders table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "patch_providers" (
        "id" serial PRIMARY KEY,
        "name" varchar NOT NULL,
        "provider_id" varchar NOT NULL,
        "image" varchar,
        "active" boolean DEFAULT true,
        "order" integer DEFAULT 0,
        "created_at" timestamptz DEFAULT now() NOT NULL,
        "updated_at" timestamptz DEFAULT now() NOT NULL
      )
    `)

    // Games table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "games" (
        "id" serial PRIMARY KEY,
        "name" varchar NOT NULL,
        "provider_id" varchar NOT NULL,
        "rtp" varchar,
        "category" varchar,
        "order" integer DEFAULT 0,
        "created_at" timestamptz DEFAULT now() NOT NULL,
        "updated_at" timestamptz DEFAULT now() NOT NULL
      )
    `)

    // Site settings global
    await client.query(`
      CREATE TABLE IF NOT EXISTS "site_settings" (
        "id" serial PRIMARY KEY,
        "site_title" varchar,
        "site_tagline" varchar,
        "whatsapp_link" varchar,
        "telegram_link" varchar,
        "ticker_text" varchar,
        "meta_description" varchar,
        "meta_keywords" varchar,
        "created_at" timestamptz DEFAULT now() NOT NULL,
        "updated_at" timestamptz DEFAULT now() NOT NULL
      )
    `)

    console.log('[push-schema] All tables created successfully')
  } catch (err) {
    console.error('[push-schema] Error:', err.message)
  } finally {
    await client.end()
  }
}

pushSchema()
