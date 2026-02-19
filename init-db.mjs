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

// Helper: run SQL only if table does NOT exist
async function createTableIfNotExists(tableName, sql) {
  const { rows } = await client.query(
    `
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = $1
    )
  `,
    [tableName],
  )
  if (rows[0].exists) {
    return false
  }
  await client.query(sql)
  return true
}

// Helper: create enum if not exists
async function createEnumIfNotExists(enumName, values) {
  const { rows } = await client.query(
    `
    SELECT EXISTS (
      SELECT FROM pg_type WHERE typname = $1
    )
  `,
    [enumName],
  )
  if (!rows[0].exists) {
    await client.query(
      `CREATE TYPE ${enumName} AS ENUM (${values.map((v) => `'${v}'`).join(', ')})`,
    )
    return true
  }
  return false
}

// Helper: create index only if not exists
async function createIndexIfNotExists(indexSql) {
  try {
    await client.query(
      indexSql
        .replace('CREATE INDEX ', 'CREATE INDEX IF NOT EXISTS ')
        .replace('CREATE UNIQUE INDEX ', 'CREATE UNIQUE INDEX IF NOT EXISTS '),
    )
  } catch {
    // Index might already exist, skip
  }
}

// Helper: add column if not exists
async function addColumnIfNotExists(table, column, definition) {
  const { rows } = await client.query(
    `
    SELECT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = $1 AND column_name = $2
    )
  `,
    [table, column],
  )
  if (!rows[0].exists) {
    await client.query(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`)
    console.log(`[init-db]   Added column ${table}.${column}`)
    return true
  }
  return false
}

async function initDB() {
  try {
    await client.connect()
    console.log('[init-db] Connected to database')

    let createdAnything = false

    // ─── Enum types ───
    console.log('[init-db] Checking enum types...')
    await createEnumIfNotExists('enum_agents_experience', ['baru', 'berpengalaman'])
    await createEnumIfNotExists('enum_agents_status', [
      'pending',
      'contacted',
      'approved',
      'rejected',
    ])
    await createEnumIfNotExists('enum_blog_posts_category', ['tips', 'guide', 'news', 'promo'])
    await createEnumIfNotExists('enum_blog_posts_status', ['draft', 'published'])
    await createEnumIfNotExists('enum_faqs_category', [
      'general',
      'agent',
      'commission',
      'technical',
    ])
    await createEnumIfNotExists('enum_promos_icon', ['bonus', 'star', 'vip'])
    await createEnumIfNotExists('enum_site_settings_social_links_platform', [
      'facebook',
      'instagram',
      'twitter',
      'youtube',
      'tiktok',
    ])
    await createEnumIfNotExists('enum_testimonials_type', ['income', 'testimonial'])
    // New enums
    await createEnumIfNotExists('enum_users_role', ['super-admin', 'editor', 'viewer'])
    await createEnumIfNotExists('enum_media_category', [
      'banner',
      'avatar',
      'blog',
      'provider',
      'game',
      'other',
    ])
    await createEnumIfNotExists('enum_commission_tiers_icon', [
      'star',
      'crown',
      'diamond',
      'rocket',
    ])
    await createEnumIfNotExists('enum_notifications_log_channel', ['telegram', 'whatsapp', 'email'])
    await createEnumIfNotExists('enum_notifications_log_status', ['sent', 'failed', 'pending'])

    // ─── Core tables ───
    console.log('[init-db] Checking core tables...')

    if (
      await createTableIfNotExists(
        'users',
        `
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
        lock_until timestamp(3) with time zone,
        name varchar,
        role enum_users_role DEFAULT 'editor',
        avatar_id integer
      )
    `,
      )
    ) {
      createdAnything = true
      console.log('[init-db]   Created users')
    }

    if (
      await createTableIfNotExists(
        'users_sessions',
        `
      CREATE TABLE users_sessions (
        _order integer NOT NULL,
        _parent_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        id varchar PRIMARY KEY,
        created_at timestamp(3) with time zone,
        expires_at timestamp(3) with time zone NOT NULL
      )
    `,
      )
    ) {
      createdAnything = true
      console.log('[init-db]   Created users_sessions')
    }

    if (
      await createTableIfNotExists(
        'media',
        `
      CREATE TABLE media (
        id serial PRIMARY KEY,
        alt varchar NOT NULL,
        category enum_media_category DEFAULT 'other',
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
        focal_y numeric,
        sizes_thumbnail_url varchar,
        sizes_thumbnail_width numeric,
        sizes_thumbnail_height numeric,
        sizes_thumbnail_mime_type varchar,
        sizes_thumbnail_filesize numeric,
        sizes_thumbnail_filename varchar,
        sizes_card_url varchar,
        sizes_card_width numeric,
        sizes_card_height numeric,
        sizes_card_mime_type varchar,
        sizes_card_filesize numeric,
        sizes_card_filename varchar,
        sizes_banner_url varchar,
        sizes_banner_width numeric,
        sizes_banner_height numeric,
        sizes_banner_mime_type varchar,
        sizes_banner_filesize numeric,
        sizes_banner_filename varchar
      )
    `,
      )
    ) {
      createdAnything = true
      console.log('[init-db]   Created media')
    }

    if (
      await createTableIfNotExists(
        'agents',
        `
      CREATE TABLE agents (
        id serial PRIMARY KEY,
        name varchar NOT NULL,
        phone varchar NOT NULL,
        whatsapp varchar,
        experience enum_agents_experience DEFAULT 'baru',
        message varchar,
        status enum_agents_status DEFAULT 'pending',
        whatsapp_link varchar,
        updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
        created_at timestamp(3) with time zone DEFAULT now() NOT NULL
      )
    `,
      )
    ) {
      createdAnything = true
      console.log('[init-db]   Created agents')
    }

    if (
      await createTableIfNotExists(
        'agents_notes',
        `
      CREATE TABLE agents_notes (
        _order integer NOT NULL,
        _parent_id integer NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
        id varchar PRIMARY KEY,
        note varchar NOT NULL,
        added_by varchar,
        added_at timestamp(3) with time zone
      )
    `,
      )
    ) {
      createdAnything = true
      console.log('[init-db]   Created agents_notes')
    }

    if (
      await createTableIfNotExists(
        'testimonials',
        `
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
    `,
      )
    ) {
      createdAnything = true
      console.log('[init-db]   Created testimonials')
    }

    if (
      await createTableIfNotExists(
        'faqs',
        `
      CREATE TABLE faqs (
        id serial PRIMARY KEY,
        question varchar NOT NULL,
        answer varchar NOT NULL,
        "order" numeric DEFAULT 0,
        category enum_faqs_category DEFAULT 'general',
        updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
        created_at timestamp(3) with time zone DEFAULT now() NOT NULL
      )
    `,
      )
    ) {
      createdAnything = true
      console.log('[init-db]   Created faqs')
    }

    if (
      await createTableIfNotExists(
        'blog_posts',
        `
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
        created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
        _status varchar DEFAULT 'draft'
      )
    `,
      )
    ) {
      createdAnything = true
      console.log('[init-db]   Created blog_posts')
    }

    if (
      await createTableIfNotExists(
        'providers',
        `
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
    `,
      )
    ) {
      createdAnything = true
      console.log('[init-db]   Created providers')
    }

    if (
      await createTableIfNotExists(
        'banners',
        `
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
    `,
      )
    ) {
      createdAnything = true
      console.log('[init-db]   Created banners')
    }

    if (
      await createTableIfNotExists(
        'promos',
        `
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
    `,
      )
    ) {
      createdAnything = true
      console.log('[init-db]   Created promos')
    }

    if (
      await createTableIfNotExists(
        'promos_items',
        `
      CREATE TABLE promos_items (
        _order integer NOT NULL,
        _parent_id integer NOT NULL REFERENCES promos(id) ON DELETE CASCADE,
        id varchar PRIMARY KEY,
        text varchar NOT NULL
      )
    `,
      )
    ) {
      createdAnything = true
      console.log('[init-db]   Created promos_items')
    }

    if (
      await createTableIfNotExists(
        'patch_providers',
        `
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
    `,
      )
    ) {
      createdAnything = true
      console.log('[init-db]   Created patch_providers')
    }

    if (
      await createTableIfNotExists(
        'games',
        `
      CREATE TABLE games (
        id serial PRIMARY KEY,
        name varchar NOT NULL,
        provider varchar NOT NULL,
        image_id integer REFERENCES media(id) ON DELETE SET NULL,
        image_url varchar,
        updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
        created_at timestamp(3) with time zone DEFAULT now() NOT NULL
      )
    `,
      )
    ) {
      createdAnything = true
      console.log('[init-db]   Created games')
    }

    if (
      await createTableIfNotExists(
        'site_settings',
        `
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
    `,
      )
    ) {
      createdAnything = true
      console.log('[init-db]   Created site_settings')
    }

    if (
      await createTableIfNotExists(
        'site_settings_social_links',
        `
      CREATE TABLE site_settings_social_links (
        _order integer NOT NULL,
        _parent_id integer NOT NULL REFERENCES site_settings(id) ON DELETE CASCADE,
        id varchar PRIMARY KEY,
        platform enum_site_settings_social_links_platform,
        url varchar
      )
    `,
      )
    ) {
      createdAnything = true
      console.log('[init-db]   Created site_settings_social_links')
    }

    if (
      await createTableIfNotExists(
        'site_settings_ticker_messages',
        `
      CREATE TABLE site_settings_ticker_messages (
        _order integer NOT NULL,
        _parent_id integer NOT NULL REFERENCES site_settings(id) ON DELETE CASCADE,
        id varchar PRIMARY KEY,
        text varchar NOT NULL
      )
    `,
      )
    ) {
      createdAnything = true
      console.log('[init-db]   Created site_settings_ticker_messages')
    }

    // ─── NEW: Commission Tiers ───
    if (
      await createTableIfNotExists(
        'commission_tiers',
        `
      CREATE TABLE commission_tiers (
        id serial PRIMARY KEY,
        name varchar NOT NULL,
        percentage numeric NOT NULL,
        min_downline numeric DEFAULT 0,
        color varchar DEFAULT '#d4a853',
        icon enum_commission_tiers_icon DEFAULT 'star',
        "order" numeric DEFAULT 0,
        active boolean DEFAULT true,
        updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
        created_at timestamp(3) with time zone DEFAULT now() NOT NULL
      )
    `,
      )
    ) {
      createdAnything = true
      console.log('[init-db]   Created commission_tiers')
    }

    if (
      await createTableIfNotExists(
        'commission_tiers_benefits',
        `
      CREATE TABLE commission_tiers_benefits (
        _order integer NOT NULL,
        _parent_id integer NOT NULL REFERENCES commission_tiers(id) ON DELETE CASCADE,
        id varchar PRIMARY KEY,
        text varchar NOT NULL
      )
    `,
      )
    ) {
      createdAnything = true
      console.log('[init-db]   Created commission_tiers_benefits')
    }

    // ─── NEW: Notifications Log ───
    if (
      await createTableIfNotExists(
        'notifications_log',
        `
      CREATE TABLE notifications_log (
        id serial PRIMARY KEY,
        title varchar NOT NULL,
        message varchar NOT NULL,
        channel enum_notifications_log_channel NOT NULL,
        status enum_notifications_log_status DEFAULT 'pending',
        recipient varchar,
        related_agent_id integer REFERENCES agents(id) ON DELETE SET NULL,
        error_message varchar,
        updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
        created_at timestamp(3) with time zone DEFAULT now() NOT NULL
      )
    `,
      )
    ) {
      createdAnything = true
      console.log('[init-db]   Created notifications_log')
    }

    // ─── NEW: Popup Announcement ───
    if (
      await createTableIfNotExists(
        'popup_announcement',
        `
      CREATE TABLE popup_announcement (
        id serial PRIMARY KEY,
        enabled boolean DEFAULT false,
        title varchar,
        content jsonb,
        image_id integer REFERENCES media(id) ON DELETE SET NULL,
        cta_text varchar DEFAULT 'Okay',
        cta_link varchar,
        show_once boolean DEFAULT true,
        background_color varchar DEFAULT '#1a1a2e',
        updated_at timestamp(3) with time zone,
        created_at timestamp(3) with time zone
      )
    `,
      )
    ) {
      createdAnything = true
      console.log('[init-db]   Created popup_announcement')
    }

    // ─── NEW: Blog Posts Versions (for drafts) ───
    if (
      await createTableIfNotExists(
        '_blog_posts_v',
        `
      CREATE TABLE _blog_posts_v (
        id serial PRIMARY KEY,
        parent_id integer REFERENCES blog_posts(id) ON DELETE SET NULL,
        version_title varchar,
        version_slug varchar,
        version_excerpt varchar,
        version_content jsonb,
        version_featured_image_id integer REFERENCES media(id) ON DELETE SET NULL,
        version_category enum_blog_posts_category DEFAULT 'tips',
        version_status enum_blog_posts_status DEFAULT 'draft',
        version_published_date timestamp(3) with time zone,
        version_seo_meta_title varchar,
        version_seo_meta_description varchar,
        version_updated_at timestamp(3) with time zone,
        version_created_at timestamp(3) with time zone,
        version__status varchar DEFAULT 'draft',
        created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
        updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
        latest boolean,
        autosave boolean
      )
    `,
      )
    ) {
      createdAnything = true
      console.log('[init-db]   Created _blog_posts_v')
    }

    // ─── Payload internal tables ───
    console.log('[init-db] Checking Payload internal tables...')

    if (
      await createTableIfNotExists(
        'payload_kv',
        `
      CREATE TABLE payload_kv (
        id serial PRIMARY KEY,
        key varchar NOT NULL,
        data jsonb NOT NULL
      )
    `,
      )
    ) {
      createdAnything = true
      console.log('[init-db]   Created payload_kv')
    }

    if (
      await createTableIfNotExists(
        'payload_locked_documents',
        `
      CREATE TABLE payload_locked_documents (
        id serial PRIMARY KEY,
        global_slug varchar,
        updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
        created_at timestamp(3) with time zone DEFAULT now() NOT NULL
      )
    `,
      )
    ) {
      createdAnything = true
      console.log('[init-db]   Created payload_locked_documents')
    }

    if (
      await createTableIfNotExists(
        'payload_locked_documents_rels',
        `
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
        games_id integer REFERENCES games(id) ON DELETE CASCADE,
        commission_tiers_id integer REFERENCES commission_tiers(id) ON DELETE CASCADE,
        notifications_log_id integer REFERENCES notifications_log(id) ON DELETE CASCADE
      )
    `,
      )
    ) {
      createdAnything = true
      console.log('[init-db]   Created payload_locked_documents_rels')
    }

    if (
      await createTableIfNotExists(
        'payload_migrations',
        `
      CREATE TABLE payload_migrations (
        id serial PRIMARY KEY,
        name varchar,
        batch numeric,
        updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
        created_at timestamp(3) with time zone DEFAULT now() NOT NULL
      )
    `,
      )
    ) {
      createdAnything = true
      console.log('[init-db]   Created payload_migrations')
    }

    if (
      await createTableIfNotExists(
        'payload_preferences',
        `
      CREATE TABLE payload_preferences (
        id serial PRIMARY KEY,
        key varchar,
        value jsonb,
        updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
        created_at timestamp(3) with time zone DEFAULT now() NOT NULL
      )
    `,
      )
    ) {
      createdAnything = true
      console.log('[init-db]   Created payload_preferences')
    }

    if (
      await createTableIfNotExists(
        'payload_preferences_rels',
        `
      CREATE TABLE payload_preferences_rels (
        id serial PRIMARY KEY,
        "order" integer,
        parent_id integer NOT NULL REFERENCES payload_preferences(id) ON DELETE CASCADE,
        path varchar NOT NULL,
        users_id integer REFERENCES users(id) ON DELETE CASCADE
      )
    `,
      )
    ) {
      createdAnything = true
      console.log('[init-db]   Created payload_preferences_rels')
    }

    // ─── ALTER existing tables for new columns ───
    console.log('[init-db] Checking for new columns on existing tables...')

    // Users: add name, role, avatar_id
    await addColumnIfNotExists('users', 'name', 'varchar')
    await addColumnIfNotExists('users', 'role', "enum_users_role DEFAULT 'editor'")
    await addColumnIfNotExists(
      'users',
      'avatar_id',
      'integer REFERENCES media(id) ON DELETE SET NULL',
    )

    // Media: add category and image size columns
    await addColumnIfNotExists('media', 'category', "enum_media_category DEFAULT 'other'")
    await addColumnIfNotExists('media', 'sizes_thumbnail_url', 'varchar')
    await addColumnIfNotExists('media', 'sizes_thumbnail_width', 'numeric')
    await addColumnIfNotExists('media', 'sizes_thumbnail_height', 'numeric')
    await addColumnIfNotExists('media', 'sizes_thumbnail_mime_type', 'varchar')
    await addColumnIfNotExists('media', 'sizes_thumbnail_filesize', 'numeric')
    await addColumnIfNotExists('media', 'sizes_thumbnail_filename', 'varchar')
    await addColumnIfNotExists('media', 'sizes_card_url', 'varchar')
    await addColumnIfNotExists('media', 'sizes_card_width', 'numeric')
    await addColumnIfNotExists('media', 'sizes_card_height', 'numeric')
    await addColumnIfNotExists('media', 'sizes_card_mime_type', 'varchar')
    await addColumnIfNotExists('media', 'sizes_card_filesize', 'numeric')
    await addColumnIfNotExists('media', 'sizes_card_filename', 'varchar')
    await addColumnIfNotExists('media', 'sizes_banner_url', 'varchar')
    await addColumnIfNotExists('media', 'sizes_banner_width', 'numeric')
    await addColumnIfNotExists('media', 'sizes_banner_height', 'numeric')
    await addColumnIfNotExists('media', 'sizes_banner_mime_type', 'varchar')
    await addColumnIfNotExists('media', 'sizes_banner_filesize', 'numeric')
    await addColumnIfNotExists('media', 'sizes_banner_filename', 'varchar')

    // Agents: add whatsapp_link
    await addColumnIfNotExists('agents', 'whatsapp_link', 'varchar')

    // Blog Posts: add _status for versions
    await addColumnIfNotExists('blog_posts', '_status', "varchar DEFAULT 'draft'")

    // Site Settings: CTA button columns
    await addColumnIfNotExists(
      'site_settings',
      'cta_button1_text',
      "varchar DEFAULT '🚀 Jadi Agent Sekarang'",
    )
    await addColumnIfNotExists(
      'site_settings',
      'cta_button1_link',
      "varchar DEFAULT 'https://masuk10.com/WhatsappVVIP'",
    )
    await addColumnIfNotExists(
      'site_settings',
      'cta_button2_text',
      "varchar DEFAULT 'Daftar Akaun CM8'",
    )
    await addColumnIfNotExists(
      'site_settings',
      'cta_button2_link',
      "varchar DEFAULT 'https://masuk10.com/WhatsappVVIP'",
    )

    // Scanner Config: add enum + columns to site_settings
    await createEnumIfNotExists('enum_site_settings_scanner_seed_interval', [
      '15',
      '30',
      '60',
      '180',
    ])
    await addColumnIfNotExists('site_settings', 'scanner_min_rtp', 'numeric DEFAULT 30')
    await addColumnIfNotExists('site_settings', 'scanner_max_rtp', 'numeric DEFAULT 97')
    await addColumnIfNotExists('site_settings', 'scanner_hot_threshold', 'numeric DEFAULT 85')
    await addColumnIfNotExists('site_settings', 'scanner_warm_threshold', 'numeric DEFAULT 65')
    await addColumnIfNotExists('site_settings', 'scanner_hot_percent', 'numeric DEFAULT 10')
    await addColumnIfNotExists('site_settings', 'scanner_warm_percent', 'numeric DEFAULT 30')
    await addColumnIfNotExists('site_settings', 'scanner_cold_percent', 'numeric DEFAULT 60')
    await addColumnIfNotExists(
      'site_settings',
      'scanner_seed_interval',
      "enum_site_settings_scanner_seed_interval DEFAULT '60'",
    )

    // Payload locked docs rels: add new collection refs
    await addColumnIfNotExists(
      'payload_locked_documents_rels',
      'commission_tiers_id',
      'integer REFERENCES commission_tiers(id) ON DELETE CASCADE',
    )
    await addColumnIfNotExists(
      'payload_locked_documents_rels',
      'notifications_log_id',
      'integer REFERENCES notifications_log(id) ON DELETE CASCADE',
    )

    // ─── Indexes ───
    console.log('[init-db] Ensuring indexes...')
    await createIndexIfNotExists('CREATE UNIQUE INDEX users_email_idx ON users (email)')
    await createIndexIfNotExists('CREATE INDEX users_created_at_idx ON users (created_at)')
    await createIndexIfNotExists('CREATE INDEX users_updated_at_idx ON users (updated_at)')
    await createIndexIfNotExists('CREATE INDEX users_sessions_order_idx ON users_sessions (_order)')
    await createIndexIfNotExists(
      'CREATE INDEX users_sessions_parent_id_idx ON users_sessions (_parent_id)',
    )
    await createIndexIfNotExists('CREATE UNIQUE INDEX media_filename_idx ON media (filename)')
    await createIndexIfNotExists('CREATE INDEX media_created_at_idx ON media (created_at)')
    await createIndexIfNotExists('CREATE INDEX media_updated_at_idx ON media (updated_at)')
    await createIndexIfNotExists('CREATE INDEX agents_created_at_idx ON agents (created_at)')
    await createIndexIfNotExists('CREATE INDEX agents_updated_at_idx ON agents (updated_at)')
    await createIndexIfNotExists('CREATE INDEX testimonials_avatar_idx ON testimonials (avatar_id)')
    await createIndexIfNotExists(
      'CREATE INDEX testimonials_created_at_idx ON testimonials (created_at)',
    )
    await createIndexIfNotExists(
      'CREATE INDEX testimonials_updated_at_idx ON testimonials (updated_at)',
    )
    await createIndexIfNotExists('CREATE INDEX faqs_created_at_idx ON faqs (created_at)')
    await createIndexIfNotExists('CREATE INDEX faqs_updated_at_idx ON faqs (updated_at)')
    await createIndexIfNotExists('CREATE UNIQUE INDEX blog_posts_slug_idx ON blog_posts (slug)')
    await createIndexIfNotExists(
      'CREATE INDEX blog_posts_featured_image_idx ON blog_posts (featured_image_id)',
    )
    await createIndexIfNotExists(
      'CREATE INDEX blog_posts_created_at_idx ON blog_posts (created_at)',
    )
    await createIndexIfNotExists(
      'CREATE INDEX blog_posts_updated_at_idx ON blog_posts (updated_at)',
    )
    await createIndexIfNotExists('CREATE INDEX providers_logo_idx ON providers (logo_id)')
    await createIndexIfNotExists('CREATE INDEX providers_created_at_idx ON providers (created_at)')
    await createIndexIfNotExists('CREATE INDEX providers_updated_at_idx ON providers (updated_at)')
    await createIndexIfNotExists('CREATE INDEX banners_image_idx ON banners (image_id)')
    await createIndexIfNotExists('CREATE INDEX banners_created_at_idx ON banners (created_at)')
    await createIndexIfNotExists('CREATE INDEX banners_updated_at_idx ON banners (updated_at)')
    await createIndexIfNotExists('CREATE INDEX promos_created_at_idx ON promos (created_at)')
    await createIndexIfNotExists('CREATE INDEX promos_updated_at_idx ON promos (updated_at)')
    await createIndexIfNotExists('CREATE INDEX promos_items_order_idx ON promos_items (_order)')
    await createIndexIfNotExists(
      'CREATE INDEX promos_items_parent_id_idx ON promos_items (_parent_id)',
    )
    await createIndexIfNotExists(
      'CREATE UNIQUE INDEX patch_providers_provider_id_idx ON patch_providers (provider_id)',
    )
    await createIndexIfNotExists(
      'CREATE INDEX patch_providers_logo_idx ON patch_providers (logo_id)',
    )
    await createIndexIfNotExists(
      'CREATE INDEX patch_providers_created_at_idx ON patch_providers (created_at)',
    )
    await createIndexIfNotExists(
      'CREATE INDEX patch_providers_updated_at_idx ON patch_providers (updated_at)',
    )
    await createIndexIfNotExists('CREATE INDEX games_image_idx ON games (image_id)')
    await createIndexIfNotExists('CREATE INDEX games_created_at_idx ON games (created_at)')
    await createIndexIfNotExists('CREATE INDEX games_updated_at_idx ON games (updated_at)')
    await createIndexIfNotExists('CREATE UNIQUE INDEX payload_kv_key_idx ON payload_kv (key)')
    await createIndexIfNotExists(
      'CREATE INDEX payload_locked_documents_global_slug_idx ON payload_locked_documents (global_slug)',
    )
    await createIndexIfNotExists(
      'CREATE INDEX payload_locked_documents_created_at_idx ON payload_locked_documents (created_at)',
    )
    await createIndexIfNotExists(
      'CREATE INDEX payload_locked_documents_updated_at_idx ON payload_locked_documents (updated_at)',
    )
    await createIndexIfNotExists(
      'CREATE INDEX payload_locked_documents_rels_order_idx ON payload_locked_documents_rels ("order")',
    )
    await createIndexIfNotExists(
      'CREATE INDEX payload_locked_documents_rels_parent_idx ON payload_locked_documents_rels (parent_id)',
    )
    await createIndexIfNotExists(
      'CREATE INDEX payload_locked_documents_rels_path_idx ON payload_locked_documents_rels (path)',
    )
    await createIndexIfNotExists(
      'CREATE INDEX payload_locked_documents_rels_users_id_idx ON payload_locked_documents_rels (users_id)',
    )
    await createIndexIfNotExists(
      'CREATE INDEX payload_locked_documents_rels_media_id_idx ON payload_locked_documents_rels (media_id)',
    )
    await createIndexIfNotExists(
      'CREATE INDEX payload_locked_documents_rels_agents_id_idx ON payload_locked_documents_rels (agents_id)',
    )
    await createIndexIfNotExists(
      'CREATE INDEX payload_locked_documents_rels_testimonials_id_idx ON payload_locked_documents_rels (testimonials_id)',
    )
    await createIndexIfNotExists(
      'CREATE INDEX payload_locked_documents_rels_faqs_id_idx ON payload_locked_documents_rels (faqs_id)',
    )
    await createIndexIfNotExists(
      'CREATE INDEX payload_locked_documents_rels_blog_posts_id_idx ON payload_locked_documents_rels (blog_posts_id)',
    )
    await createIndexIfNotExists(
      'CREATE INDEX payload_locked_documents_rels_providers_id_idx ON payload_locked_documents_rels (providers_id)',
    )
    await createIndexIfNotExists(
      'CREATE INDEX payload_locked_documents_rels_banners_id_idx ON payload_locked_documents_rels (banners_id)',
    )
    await createIndexIfNotExists(
      'CREATE INDEX payload_locked_documents_rels_promos_id_idx ON payload_locked_documents_rels (promos_id)',
    )
    await createIndexIfNotExists(
      'CREATE INDEX payload_locked_documents_rels_patch_providers_id_idx ON payload_locked_documents_rels (patch_providers_id)',
    )
    await createIndexIfNotExists(
      'CREATE INDEX payload_locked_documents_rels_games_id_idx ON payload_locked_documents_rels (games_id)',
    )
    await createIndexIfNotExists(
      'CREATE INDEX payload_migrations_created_at_idx ON payload_migrations (created_at)',
    )
    await createIndexIfNotExists(
      'CREATE INDEX payload_migrations_updated_at_idx ON payload_migrations (updated_at)',
    )
    await createIndexIfNotExists(
      'CREATE INDEX payload_preferences_key_idx ON payload_preferences (key)',
    )
    await createIndexIfNotExists(
      'CREATE INDEX payload_preferences_created_at_idx ON payload_preferences (created_at)',
    )
    await createIndexIfNotExists(
      'CREATE INDEX payload_preferences_updated_at_idx ON payload_preferences (updated_at)',
    )
    await createIndexIfNotExists(
      'CREATE INDEX payload_preferences_rels_order_idx ON payload_preferences_rels ("order")',
    )
    await createIndexIfNotExists(
      'CREATE INDEX payload_preferences_rels_parent_idx ON payload_preferences_rels (parent_id)',
    )
    await createIndexIfNotExists(
      'CREATE INDEX payload_preferences_rels_path_idx ON payload_preferences_rels (path)',
    )
    await createIndexIfNotExists(
      'CREATE INDEX payload_preferences_rels_users_id_idx ON payload_preferences_rels (users_id)',
    )
    await createIndexIfNotExists('CREATE INDEX site_settings_logo_idx ON site_settings (logo_id)')
    await createIndexIfNotExists(
      'CREATE INDEX site_settings_favicon_idx ON site_settings (favicon_id)',
    )
    await createIndexIfNotExists(
      'CREATE INDEX site_settings_hero_image_idx ON site_settings (hero_image_id)',
    )
    await createIndexIfNotExists(
      'CREATE INDEX site_settings_og_image_idx ON site_settings (og_image_id)',
    )
    await createIndexIfNotExists(
      'CREATE INDEX site_settings_social_links_order_idx ON site_settings_social_links (_order)',
    )
    await createIndexIfNotExists(
      'CREATE INDEX site_settings_social_links_parent_id_idx ON site_settings_social_links (_parent_id)',
    )
    await createIndexIfNotExists(
      'CREATE INDEX site_settings_ticker_messages_order_idx ON site_settings_ticker_messages (_order)',
    )
    await createIndexIfNotExists(
      'CREATE INDEX site_settings_ticker_messages_parent_id_idx ON site_settings_ticker_messages (_parent_id)',
    )

    // New indexes
    await createIndexIfNotExists('CREATE INDEX users_avatar_idx ON users (avatar_id)')
    await createIndexIfNotExists(
      'CREATE INDEX commission_tiers_created_at_idx ON commission_tiers (created_at)',
    )
    await createIndexIfNotExists(
      'CREATE INDEX commission_tiers_updated_at_idx ON commission_tiers (updated_at)',
    )
    await createIndexIfNotExists(
      'CREATE INDEX commission_tiers_benefits_order_idx ON commission_tiers_benefits (_order)',
    )
    await createIndexIfNotExists(
      'CREATE INDEX commission_tiers_benefits_parent_id_idx ON commission_tiers_benefits (_parent_id)',
    )
    await createIndexIfNotExists(
      'CREATE INDEX notifications_log_created_at_idx ON notifications_log (created_at)',
    )
    await createIndexIfNotExists(
      'CREATE INDEX notifications_log_updated_at_idx ON notifications_log (updated_at)',
    )
    await createIndexIfNotExists(
      'CREATE INDEX notifications_log_related_agent_idx ON notifications_log (related_agent_id)',
    )
    await createIndexIfNotExists('CREATE INDEX agents_notes_order_idx ON agents_notes (_order)')
    await createIndexIfNotExists(
      'CREATE INDEX agents_notes_parent_id_idx ON agents_notes (_parent_id)',
    )
    await createIndexIfNotExists(
      'CREATE INDEX popup_announcement_image_idx ON popup_announcement (image_id)',
    )
    await createIndexIfNotExists(
      'CREATE INDEX _blog_posts_v_parent_idx ON _blog_posts_v (parent_id)',
    )
    await createIndexIfNotExists(
      'CREATE INDEX _blog_posts_v_created_at_idx ON _blog_posts_v (created_at)',
    )
    await createIndexIfNotExists(
      'CREATE INDEX _blog_posts_v_updated_at_idx ON _blog_posts_v (updated_at)',
    )
    await createIndexIfNotExists(
      'CREATE INDEX payload_locked_documents_rels_commission_tiers_id_idx ON payload_locked_documents_rels (commission_tiers_id)',
    )
    await createIndexIfNotExists(
      'CREATE INDEX payload_locked_documents_rels_notifications_log_id_idx ON payload_locked_documents_rels (notifications_log_id)',
    )

    // ─── Deduplicate FAQs and Providers ───
    console.log('[init-db] Checking for duplicate records...')
    try {
      const dedupFaqs = await client.query(`
        DELETE FROM faqs WHERE id NOT IN (
          SELECT MIN(id) FROM faqs GROUP BY question
        )
      `)
      if (dedupFaqs.rowCount > 0) {
        console.log('[init-db] Removed ' + dedupFaqs.rowCount + ' duplicate FAQ(s)')
      }
    } catch (_e) {
      /* faqs table might not exist yet */
    }

    try {
      const dedupProviders = await client.query(`
        DELETE FROM providers WHERE id NOT IN (
          SELECT MIN(id) FROM providers GROUP BY name
        )
      `)
      if (dedupProviders.rowCount > 0) {
        console.log('[init-db] Removed ' + dedupProviders.rowCount + ' duplicate provider(s)')
      }
    } catch (_e) {
      /* providers table might not exist yet */
    }

    if (createdAnything) {
      console.log('[init-db] ✅ Schema initialization complete!')
    } else {
      console.log('[init-db] ✅ All tables already exist, schema is up to date.')
    }
  } catch (err) {
    console.error('[init-db] Error:', err.message)
    // Don't exit with error — let the app start and handle it
  } finally {
    await client.end()
  }
}

initDB()
