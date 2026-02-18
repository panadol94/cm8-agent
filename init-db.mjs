// init-db.mjs — Initialize database schema before starting the app
// Uses the pg module (included via @payloadcms/db-postgres)
import pg from 'pg'
const { Client } = pg

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.log('[init-db] No DATABASE_URL, skipping schema init')
  process.exit(0)
}

const client = new Client({ connectionString: DATABASE_URL })

async function initDB() {
  try {
    await client.connect()
    console.log('[init-db] Connected to database')

    // Check if schema already exists
    const { rows } = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'users'
      )
    `)

    if (rows[0].exists) {
      console.log('[init-db] Schema already exists, skipping')
      await client.end()
      process.exit(0)
    }

    console.log('[init-db] Creating schema...')

    // Enum types
    await client.query(`CREATE TYPE enum_agents_experience AS ENUM ('baru', 'berpengalaman')`)
    await client.query(
      `CREATE TYPE enum_agents_status AS ENUM ('pending', 'contacted', 'approved', 'rejected')`,
    )
    await client.query(
      `CREATE TYPE enum_blog_posts_category AS ENUM ('tips', 'guide', 'news', 'promo')`,
    )
    await client.query(`CREATE TYPE enum_blog_posts_status AS ENUM ('draft', 'published')`)
    await client.query(
      `CREATE TYPE enum_faqs_category AS ENUM ('general', 'agent', 'commission', 'technical')`,
    )
    await client.query(`CREATE TYPE enum_promos_icon AS ENUM ('bonus', 'star', 'vip')`)
    await client.query(
      `CREATE TYPE enum_site_settings_social_links_platform AS ENUM ('facebook', 'instagram', 'twitter', 'youtube', 'tiktok')`,
    )
    await client.query(`CREATE TYPE enum_testimonials_type AS ENUM ('income', 'testimonial')`)

    // Tables
    await client.query(`
      CREATE TABLE users (
        id serial PRIMARY KEY,
        updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
        created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
        email varchar NOT NULL,
        reset_password_token varchar,
        reset_password_expiration timestamp(3) with time zone,
        salt varchar,
        hash varchar,
        login_attempts numeric DEFAULT 0,
        lock_until timestamp(3) with time zone
      )
    `)

    await client.query(`
      CREATE TABLE users_sessions (
        _order integer NOT NULL,
        _parent_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        id varchar PRIMARY KEY,
        created_at timestamp(3) with time zone,
        expires_at timestamp(3) with time zone NOT NULL
      )
    `)

    await client.query(`
      CREATE TABLE media (
        id serial PRIMARY KEY,
        alt varchar NOT NULL,
        updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
        created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
        url varchar,
        thumbnail_u_r_l varchar,
        filename varchar,
        mime_type varchar,
        filesize numeric,
        width numeric,
        height numeric,
        focal_x numeric,
        focal_y numeric
      )
    `)

    await client.query(`
      CREATE TABLE agents (
        id serial PRIMARY KEY,
        name varchar NOT NULL,
        phone varchar NOT NULL,
        whatsapp varchar,
        experience enum_agents_experience DEFAULT 'baru',
        message varchar,
        status enum_agents_status DEFAULT 'pending',
        updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
        created_at timestamp(3) with time zone DEFAULT now() NOT NULL
      )
    `)

    await client.query(`
      CREATE TABLE testimonials (
        id serial PRIMARY KEY,
        name varchar NOT NULL,
        role varchar DEFAULT 'Agent Aktif',
        content varchar,
        avatar_id integer REFERENCES media(id) ON DELETE SET NULL,
        avatar_url varchar,
        rating numeric DEFAULT 5,
        income varchar,
        period varchar DEFAULT '/minggu',
        growth varchar,
        bar numeric,
        type enum_testimonials_type DEFAULT 'income',
        featured boolean DEFAULT true,
        "order" numeric DEFAULT 0,
        updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
        created_at timestamp(3) with time zone DEFAULT now() NOT NULL
      )
    `)

    await client.query(`
      CREATE TABLE faqs (
        id serial PRIMARY KEY,
        question varchar NOT NULL,
        answer varchar NOT NULL,
        "order" numeric DEFAULT 0,
        category enum_faqs_category DEFAULT 'general',
        updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
        created_at timestamp(3) with time zone DEFAULT now() NOT NULL
      )
    `)

    await client.query(`
      CREATE TABLE blog_posts (
        id serial PRIMARY KEY,
        title varchar NOT NULL,
        slug varchar NOT NULL,
        excerpt varchar,
        content jsonb NOT NULL,
        featured_image_id integer REFERENCES media(id) ON DELETE SET NULL,
        category enum_blog_posts_category DEFAULT 'tips',
        status enum_blog_posts_status DEFAULT 'draft',
        published_date timestamp(3) with time zone,
        seo_meta_title varchar,
        seo_meta_description varchar,
        updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
        created_at timestamp(3) with time zone DEFAULT now() NOT NULL
      )
    `)

    await client.query(`
      CREATE TABLE providers (
        id serial PRIMARY KEY,
        name varchar NOT NULL,
        logo_id integer REFERENCES media(id) ON DELETE SET NULL,
        logo_url varchar,
        "order" numeric DEFAULT 0,
        show_on_homepage boolean DEFAULT true,
        updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
        created_at timestamp(3) with time zone DEFAULT now() NOT NULL
      )
    `)

    await client.query(`
      CREATE TABLE banners (
        id serial PRIMARY KEY,
        title varchar NOT NULL,
        image_id integer NOT NULL REFERENCES media(id) ON DELETE SET NULL,
        link varchar,
        "order" numeric DEFAULT 0,
        active boolean DEFAULT true,
        updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
        created_at timestamp(3) with time zone DEFAULT now() NOT NULL
      )
    `)

    await client.query(`
      CREATE TABLE promos (
        id serial PRIMARY KEY,
        title varchar NOT NULL,
        cta_text varchar DEFAULT 'Claim Now',
        cta_link varchar,
        icon enum_promos_icon DEFAULT 'bonus',
        highlight boolean DEFAULT false,
        "order" numeric DEFAULT 0,
        updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
        created_at timestamp(3) with time zone DEFAULT now() NOT NULL
      )
    `)

    await client.query(`
      CREATE TABLE promos_items (
        _order integer NOT NULL,
        _parent_id integer NOT NULL REFERENCES promos(id) ON DELETE CASCADE,
        id varchar PRIMARY KEY,
        text varchar NOT NULL
      )
    `)

    await client.query(`
      CREATE TABLE patch_providers (
        id serial PRIMARY KEY,
        provider_id varchar NOT NULL,
        name varchar NOT NULL,
        logo_id integer REFERENCES media(id) ON DELETE SET NULL,
        logo_url varchar,
        "order" numeric DEFAULT 0,
        active boolean DEFAULT true,
        updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
        created_at timestamp(3) with time zone DEFAULT now() NOT NULL
      )
    `)

    await client.query(`
      CREATE TABLE games (
        id serial PRIMARY KEY,
        name varchar NOT NULL,
        provider varchar NOT NULL,
        image_id integer REFERENCES media(id) ON DELETE SET NULL,
        image_url varchar,
        updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
        created_at timestamp(3) with time zone DEFAULT now() NOT NULL
      )
    `)

    await client.query(`
      CREATE TABLE site_settings (
        id serial PRIMARY KEY,
        site_name varchar DEFAULT 'CM8 VVIP',
        tagline varchar DEFAULT 'Platform Agent #1 Malaysia',
        logo_id integer REFERENCES media(id) ON DELETE SET NULL,
        favicon_id integer REFERENCES media(id) ON DELETE SET NULL,
        hero_title varchar DEFAULT 'Jadi Agent CM8 Sekarang',
        hero_subtitle varchar DEFAULT 'Jana pendapatan lumayan dengan menjadi agent platform CM8. Komisyen tinggi, sokongan penuh, dan peluang tanpa had.',
        hero_c_t_a varchar DEFAULT 'Daftar Sekarang',
        hero_image_id integer REFERENCES media(id) ON DELETE SET NULL,
        whatsapp_number varchar,
        telegram_link varchar,
        footer_text varchar DEFAULT '© 2026 CM8 VVIP. Semua hak cipta terpelihara.',
        meta_title varchar DEFAULT 'CM8 VVIP — Buat Duit Online & Agent Slot Tanpa Modal #1 Malaysia',
        meta_description varchar DEFAULT 'Jana income pasif sebagai Agent Slot CM8 VVIP. Daftar percuma, tiada modal.',
        keywords varchar,
        og_image_id integer REFERENCES media(id) ON DELETE SET NULL,
        ticker_enabled boolean DEFAULT true,
        updated_at timestamp(3) with time zone,
        created_at timestamp(3) with time zone
      )
    `)

    await client.query(`
      CREATE TABLE site_settings_social_links (
        _order integer NOT NULL,
        _parent_id integer NOT NULL REFERENCES site_settings(id) ON DELETE CASCADE,
        id varchar PRIMARY KEY,
        platform enum_site_settings_social_links_platform,
        url varchar
      )
    `)

    await client.query(`
      CREATE TABLE site_settings_ticker_messages (
        _order integer NOT NULL,
        _parent_id integer NOT NULL REFERENCES site_settings(id) ON DELETE CASCADE,
        id varchar PRIMARY KEY,
        text varchar NOT NULL
      )
    `)

    // Payload internal tables
    await client.query(`
      CREATE TABLE payload_kv (
        id serial PRIMARY KEY,
        key varchar NOT NULL,
        data jsonb NOT NULL
      )
    `)

    await client.query(`
      CREATE TABLE payload_locked_documents (
        id serial PRIMARY KEY,
        global_slug varchar,
        updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
        created_at timestamp(3) with time zone DEFAULT now() NOT NULL
      )
    `)

    await client.query(`
      CREATE TABLE payload_locked_documents_rels (
        id serial PRIMARY KEY,
        "order" integer,
        parent_id integer NOT NULL REFERENCES payload_locked_documents(id) ON DELETE CASCADE,
        path varchar NOT NULL,
        users_id integer REFERENCES users(id) ON DELETE CASCADE,
        media_id integer REFERENCES media(id) ON DELETE CASCADE,
        agents_id integer REFERENCES agents(id) ON DELETE CASCADE,
        testimonials_id integer REFERENCES testimonials(id) ON DELETE CASCADE,
        faqs_id integer REFERENCES faqs(id) ON DELETE CASCADE,
        blog_posts_id integer REFERENCES blog_posts(id) ON DELETE CASCADE,
        providers_id integer REFERENCES providers(id) ON DELETE CASCADE,
        banners_id integer REFERENCES banners(id) ON DELETE CASCADE,
        promos_id integer REFERENCES promos(id) ON DELETE CASCADE,
        patch_providers_id integer REFERENCES patch_providers(id) ON DELETE CASCADE,
        games_id integer REFERENCES games(id) ON DELETE CASCADE
      )
    `)

    await client.query(`
      CREATE TABLE payload_migrations (
        id serial PRIMARY KEY,
        name varchar,
        batch numeric,
        updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
        created_at timestamp(3) with time zone DEFAULT now() NOT NULL
      )
    `)

    await client.query(`
      CREATE TABLE payload_preferences (
        id serial PRIMARY KEY,
        key varchar,
        value jsonb,
        updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
        created_at timestamp(3) with time zone DEFAULT now() NOT NULL
      )
    `)

    await client.query(`
      CREATE TABLE payload_preferences_rels (
        id serial PRIMARY KEY,
        "order" integer,
        parent_id integer NOT NULL REFERENCES payload_preferences(id) ON DELETE CASCADE,
        path varchar NOT NULL,
        users_id integer REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    // Indexes
    await client.query(`CREATE UNIQUE INDEX users_email_idx ON users (email)`)
    await client.query(`CREATE INDEX users_created_at_idx ON users (created_at)`)
    await client.query(`CREATE INDEX users_updated_at_idx ON users (updated_at)`)
    await client.query(`CREATE INDEX users_sessions_order_idx ON users_sessions (_order)`)
    await client.query(`CREATE INDEX users_sessions_parent_id_idx ON users_sessions (_parent_id)`)
    await client.query(`CREATE UNIQUE INDEX media_filename_idx ON media (filename)`)
    await client.query(`CREATE INDEX media_created_at_idx ON media (created_at)`)
    await client.query(`CREATE INDEX media_updated_at_idx ON media (updated_at)`)
    await client.query(`CREATE INDEX agents_created_at_idx ON agents (created_at)`)
    await client.query(`CREATE INDEX agents_updated_at_idx ON agents (updated_at)`)
    await client.query(`CREATE INDEX testimonials_avatar_idx ON testimonials (avatar_id)`)
    await client.query(`CREATE INDEX testimonials_created_at_idx ON testimonials (created_at)`)
    await client.query(`CREATE INDEX testimonials_updated_at_idx ON testimonials (updated_at)`)
    await client.query(`CREATE INDEX faqs_created_at_idx ON faqs (created_at)`)
    await client.query(`CREATE INDEX faqs_updated_at_idx ON faqs (updated_at)`)
    await client.query(`CREATE UNIQUE INDEX blog_posts_slug_idx ON blog_posts (slug)`)
    await client.query(
      `CREATE INDEX blog_posts_featured_image_idx ON blog_posts (featured_image_id)`,
    )
    await client.query(`CREATE INDEX blog_posts_created_at_idx ON blog_posts (created_at)`)
    await client.query(`CREATE INDEX blog_posts_updated_at_idx ON blog_posts (updated_at)`)
    await client.query(`CREATE INDEX providers_logo_idx ON providers (logo_id)`)
    await client.query(`CREATE INDEX providers_created_at_idx ON providers (created_at)`)
    await client.query(`CREATE INDEX providers_updated_at_idx ON providers (updated_at)`)
    await client.query(`CREATE INDEX banners_image_idx ON banners (image_id)`)
    await client.query(`CREATE INDEX banners_created_at_idx ON banners (created_at)`)
    await client.query(`CREATE INDEX banners_updated_at_idx ON banners (updated_at)`)
    await client.query(`CREATE INDEX promos_created_at_idx ON promos (created_at)`)
    await client.query(`CREATE INDEX promos_updated_at_idx ON promos (updated_at)`)
    await client.query(`CREATE INDEX promos_items_order_idx ON promos_items (_order)`)
    await client.query(`CREATE INDEX promos_items_parent_id_idx ON promos_items (_parent_id)`)
    await client.query(
      `CREATE UNIQUE INDEX patch_providers_provider_id_idx ON patch_providers (provider_id)`,
    )
    await client.query(`CREATE INDEX patch_providers_logo_idx ON patch_providers (logo_id)`)
    await client.query(
      `CREATE INDEX patch_providers_created_at_idx ON patch_providers (created_at)`,
    )
    await client.query(
      `CREATE INDEX patch_providers_updated_at_idx ON patch_providers (updated_at)`,
    )
    await client.query(`CREATE INDEX games_image_idx ON games (image_id)`)
    await client.query(`CREATE INDEX games_created_at_idx ON games (created_at)`)
    await client.query(`CREATE INDEX games_updated_at_idx ON games (updated_at)`)
    await client.query(`CREATE UNIQUE INDEX payload_kv_key_idx ON payload_kv (key)`)
    await client.query(
      `CREATE INDEX payload_locked_documents_global_slug_idx ON payload_locked_documents (global_slug)`,
    )
    await client.query(
      `CREATE INDEX payload_locked_documents_created_at_idx ON payload_locked_documents (created_at)`,
    )
    await client.query(
      `CREATE INDEX payload_locked_documents_updated_at_idx ON payload_locked_documents (updated_at)`,
    )
    await client.query(
      `CREATE INDEX payload_locked_documents_rels_order_idx ON payload_locked_documents_rels ("order")`,
    )
    await client.query(
      `CREATE INDEX payload_locked_documents_rels_parent_idx ON payload_locked_documents_rels (parent_id)`,
    )
    await client.query(
      `CREATE INDEX payload_locked_documents_rels_path_idx ON payload_locked_documents_rels (path)`,
    )
    await client.query(
      `CREATE INDEX payload_locked_documents_rels_users_id_idx ON payload_locked_documents_rels (users_id)`,
    )
    await client.query(
      `CREATE INDEX payload_locked_documents_rels_media_id_idx ON payload_locked_documents_rels (media_id)`,
    )
    await client.query(
      `CREATE INDEX payload_locked_documents_rels_agents_id_idx ON payload_locked_documents_rels (agents_id)`,
    )
    await client.query(
      `CREATE INDEX payload_locked_documents_rels_testimonials_id_idx ON payload_locked_documents_rels (testimonials_id)`,
    )
    await client.query(
      `CREATE INDEX payload_locked_documents_rels_faqs_id_idx ON payload_locked_documents_rels (faqs_id)`,
    )
    await client.query(
      `CREATE INDEX payload_locked_documents_rels_blog_posts_id_idx ON payload_locked_documents_rels (blog_posts_id)`,
    )
    await client.query(
      `CREATE INDEX payload_locked_documents_rels_providers_id_idx ON payload_locked_documents_rels (providers_id)`,
    )
    await client.query(
      `CREATE INDEX payload_locked_documents_rels_banners_id_idx ON payload_locked_documents_rels (banners_id)`,
    )
    await client.query(
      `CREATE INDEX payload_locked_documents_rels_promos_id_idx ON payload_locked_documents_rels (promos_id)`,
    )
    await client.query(
      `CREATE INDEX payload_locked_documents_rels_patch_providers_id_idx ON payload_locked_documents_rels (patch_providers_id)`,
    )
    await client.query(
      `CREATE INDEX payload_locked_documents_rels_games_id_idx ON payload_locked_documents_rels (games_id)`,
    )
    await client.query(
      `CREATE INDEX payload_migrations_created_at_idx ON payload_migrations (created_at)`,
    )
    await client.query(
      `CREATE INDEX payload_migrations_updated_at_idx ON payload_migrations (updated_at)`,
    )
    await client.query(`CREATE INDEX payload_preferences_key_idx ON payload_preferences (key)`)
    await client.query(
      `CREATE INDEX payload_preferences_created_at_idx ON payload_preferences (created_at)`,
    )
    await client.query(
      `CREATE INDEX payload_preferences_updated_at_idx ON payload_preferences (updated_at)`,
    )
    await client.query(
      `CREATE INDEX payload_preferences_rels_order_idx ON payload_preferences_rels ("order")`,
    )
    await client.query(
      `CREATE INDEX payload_preferences_rels_parent_idx ON payload_preferences_rels (parent_id)`,
    )
    await client.query(
      `CREATE INDEX payload_preferences_rels_path_idx ON payload_preferences_rels (path)`,
    )
    await client.query(
      `CREATE INDEX payload_preferences_rels_users_id_idx ON payload_preferences_rels (users_id)`,
    )
    await client.query(`CREATE INDEX site_settings_logo_idx ON site_settings (logo_id)`)
    await client.query(`CREATE INDEX site_settings_favicon_idx ON site_settings (favicon_id)`)
    await client.query(`CREATE INDEX site_settings_hero_image_idx ON site_settings (hero_image_id)`)
    await client.query(`CREATE INDEX site_settings_og_image_idx ON site_settings (og_image_id)`)
    await client.query(
      `CREATE INDEX site_settings_social_links_order_idx ON site_settings_social_links (_order)`,
    )
    await client.query(
      `CREATE INDEX site_settings_social_links_parent_id_idx ON site_settings_social_links (_parent_id)`,
    )
    await client.query(
      `CREATE INDEX site_settings_ticker_messages_order_idx ON site_settings_ticker_messages (_order)`,
    )
    await client.query(
      `CREATE INDEX site_settings_ticker_messages_parent_id_idx ON site_settings_ticker_messages (_parent_id)`,
    )

    console.log('[init-db] Schema created successfully!')
  } catch (err) {
    console.error('[init-db] Error:', err.message)
    // Don't exit with error — let the app start and handle it
  } finally {
    await client.end()
  }
}

initDB()
