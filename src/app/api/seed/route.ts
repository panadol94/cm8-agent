import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { gameData } from '@/app/(frontend)/patch-id/gameData'

export const dynamic = 'force-dynamic'

// GET /api/seed — one-time seeder to migrate all hardcoded data into Payload
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const secret = searchParams.get('secret')
  if (secret !== (process.env.PAYLOAD_SECRET || 'dev-seed')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await getPayload({ config })
  const results: Record<string, number> = {}

  try {
    // ────────────────────────────────────────────
    // 1. INCOME SHOWCASE → Testimonials
    // ────────────────────────────────────────────
    const incomeShowcase = [
      {
        name: 'Ah***d R.',
        role: 'Master Agent',
        income: 'RM4,200',
        period: '/minggu',
        growth: '+32%',
        avatarUrl: '/avatars/agent-1.png',
        bar: 72,
      },
      {
        name: 'Sa***h M.',
        role: 'Agent Aktif',
        income: 'RM1,800',
        period: '/minggu',
        growth: '+18%',
        avatarUrl: '/avatars/agent-2.png',
        bar: 31,
      },
      {
        name: 'Ri***l K.',
        role: 'Agent Baru',
        income: 'RM650',
        period: '/minggu',
        growth: '+45%',
        avatarUrl: '/avatars/agent-3.png',
        bar: 11,
      },
      {
        name: 'Fa***z A.',
        role: 'Senior Agent',
        income: 'RM3,100',
        period: '/minggu',
        growth: '+27%',
        avatarUrl: '/avatars/agent-4.jpg',
        bar: 53,
      },
      {
        name: 'Nu***a L.',
        role: 'Agent Aktif',
        income: 'RM2,400',
        period: '/minggu',
        growth: '+35%',
        avatarUrl: '/avatars/agent-5.jpg',
        bar: 41,
      },
      {
        name: 'Ha***m S.',
        role: 'Master Agent',
        income: 'RM5,800',
        period: '/minggu',
        growth: '+22%',
        avatarUrl: '/avatars/agent-6.jpg',
        bar: 100,
      },
      {
        name: 'Am***a Y.',
        role: 'Agent Baru',
        income: 'RM900',
        period: '/minggu',
        growth: '+52%',
        avatarUrl: '/avatars/agent-7.jpg',
        bar: 16,
      },
      {
        name: 'Za***i T.',
        role: 'Agent Aktif',
        income: 'RM2,100',
        period: '/minggu',
        growth: '+29%',
        avatarUrl: '/avatars/agent-1.png',
        bar: 36,
      },
      {
        name: 'Sy***a N.',
        role: 'Senior Agent',
        income: 'RM3,600',
        period: '/minggu',
        growth: '+24%',
        avatarUrl: '/avatars/agent-8.jpg',
        bar: 62,
      },
      {
        name: 'Mo***d H.',
        role: 'Agent Baru',
        income: 'RM480',
        period: '/minggu',
        growth: '+68%',
        avatarUrl: '/avatars/agent-9.jpg',
        bar: 8,
      },
      {
        name: 'Li***a W.',
        role: 'Master Agent',
        income: 'RM4,900',
        period: '/minggu',
        growth: '+19%',
        avatarUrl: '/avatars/agent-2.png',
        bar: 84,
      },
      {
        name: 'Da***n J.',
        role: 'Agent Aktif',
        income: 'RM1,500',
        period: '/minggu',
        growth: '+41%',
        avatarUrl: '/avatars/agent-10.jpg',
        bar: 26,
      },
      {
        name: 'Is***l B.',
        role: 'Senior Agent',
        income: 'RM3,800',
        period: '/minggu',
        growth: '+31%',
        avatarUrl: '/avatars/agent-11.jpg',
        bar: 66,
      },
      {
        name: 'Ai***n Z.',
        role: 'Agent Baru',
        income: 'RM750',
        period: '/minggu',
        growth: '+57%',
        avatarUrl: '/avatars/agent-3.png',
        bar: 13,
      },
      {
        name: 'Kh***r M.',
        role: 'Agent Aktif',
        income: 'RM2,800',
        period: '/minggu',
        growth: '+33%',
        avatarUrl: '/avatars/agent-12.jpg',
        bar: 48,
      },
      {
        name: 'Ra***a P.',
        role: 'Master Agent',
        income: 'RM5,200',
        period: '/minggu',
        growth: '+26%',
        avatarUrl: '/avatars/agent-13.jpg',
        bar: 90,
      },
      {
        name: 'Fi***i C.',
        role: 'Agent Baru',
        income: 'RM550',
        period: '/minggu',
        growth: '+61%',
        avatarUrl: '/avatars/agent-14.jpg',
        bar: 10,
      },
      {
        name: 'Na***m R.',
        role: 'Agent Aktif',
        income: 'RM1,950',
        period: '/minggu',
        growth: '+38%',
        avatarUrl: '/avatars/agent-1.png',
        bar: 34,
      },
      {
        name: 'Wa***n D.',
        role: 'Senior Agent',
        income: 'RM4,500',
        period: '/minggu',
        growth: '+21%',
        avatarUrl: '/avatars/agent-15.jpg',
        bar: 78,
      },
      {
        name: 'Ti***h G.',
        role: 'Agent Aktif',
        income: 'RM2,600',
        period: '/minggu',
        growth: '+36%',
        avatarUrl: '/avatars/agent-16.jpg',
        bar: 45,
      },
    ]

    let testimonialCount = 0
    for (let i = 0; i < incomeShowcase.length; i++) {
      const a = incomeShowcase[i]
      await payload.create({
        collection: 'testimonials',
        data: {
          name: a.name,
          role: a.role,
          income: a.income,
          period: a.period,
          growth: a.growth,
          avatarUrl: a.avatarUrl,
          bar: a.bar,
          type: 'income',
          featured: true,
          order: i,
        },
      })
      testimonialCount++
    }
    results.testimonials = testimonialCount

    // ────────────────────────────────────────────
    // 2. HOMEPAGE PROVIDERS
    // ────────────────────────────────────────────
    const homepageProviders = [
      {
        name: 'MEGA888',
        logoUrl:
          'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F32%2F35335f26-6f54-4387-850a-d5590768b25a.jpg',
      },
      {
        name: '918KISS',
        logoUrl:
          'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F27%2Fcf1330dc-23e2-434e-bd02-a5cf6f7ecf8d.jpg',
      },
      {
        name: 'JILI',
        logoUrl:
          'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F25%2Faece1da0-0722-4da1-b7d9-e300686f56ad.jpg',
      },
      {
        name: 'Pragmatic Play',
        logoUrl:
          'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F47%2Fbefe333c-815a-43d7-884d-5a5bf5d5c4f0.jpg',
      },
      {
        name: 'Hacksaw',
        logoUrl:
          'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F79%2Fd18411b6-519a-470f-8cdf-2442331ccf88.jpg',
      },
      {
        name: 'Playtech',
        logoUrl:
          'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F83%2F2ef04bd9-813c-4169-a397-a59dcb66e87e.jpg',
      },
      {
        name: 'Habanero',
        logoUrl:
          'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F89%2Fd22d30e6-3b31-46c9-bf4c-e671950d0402.jpg',
      },
      {
        name: 'Spade Gaming',
        logoUrl:
          'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F95%2F3741cd4c-ade6-4323-9e4a-e70691722679.jpeg',
      },
    ]

    let providerCount = 0
    for (let i = 0; i < homepageProviders.length; i++) {
      const p = homepageProviders[i]
      await payload.create({
        collection: 'providers',
        data: {
          name: p.name,
          logoUrl: p.logoUrl,
          order: i,
          showOnHomepage: true,
        },
      })
      providerCount++
    }
    results.providers = providerCount

    // ────────────────────────────────────────────
    // 3. FAQs
    // ────────────────────────────────────────────
    const faqs = [
      {
        q: 'Bagaimana cara menjadi agent CM8?',
        a: 'Sangat mudah! Hanya isi borang pendaftaran dan pasukan kami akan menghubungi anda dalam masa 24 jam.',
      },
      {
        q: 'Berapa modal permulaan yang diperlukan?',
        a: 'Tiada modal permulaan diperlukan. Anda hanya perlu mendaftar dan kami sediakan semua alat pemasaran percuma.',
      },
      {
        q: 'Bagaimana komisyen dibayar?',
        a: 'Komisyen dibayar secara mingguan terus ke akaun bank anda. Tiada had minimum.',
      },
      {
        q: 'Adakah saya perlukan pengalaman?',
        a: 'Tidak! Kami menyediakan latihan penuh untuk agent baru.',
      },
      {
        q: 'Bolehkah saya jadi agent sambilan?',
        a: 'Ya, ramai agent kami menjalankan ini sebagai pendapatan sampingan.',
      },
    ]

    let faqCount = 0
    for (let i = 0; i < faqs.length; i++) {
      await payload.create({
        collection: 'faqs',
        data: {
          question: faqs[i].q,
          answer: faqs[i].a,
          order: i,
          category: 'general',
        },
      })
      faqCount++
    }
    results.faqs = faqCount

    // ────────────────────────────────────────────
    // 4. BANNERS
    // ────────────────────────────────────────────
    // NOTE: Banner images are local files. You'll need to upload them via admin.
    // Skip banner creation since they need image uploads via admin
    results.banners_note = 0 // Upload banners manually via admin

    // ────────────────────────────────────────────
    // 5. PROMOS
    // ────────────────────────────────────────────
    const promos = [
      {
        title: 'Weekly Deposit Bonus',
        items: [
          'Bonus 1% daripada deposit mingguan',
          'Tempoh: Isnin – Sabtu',
          'Diberi setiap Ahad 6:00PM',
          'Hubungi admin untuk claim',
        ],
        ctaText: 'Claim Now',
        ctaLink: 'https://masuk10.com/WhatsappVVIP',
        icon: 'bonus',
        highlight: false,
      },
      {
        title: 'VIP Exclusive Rewards',
        items: [
          'Cashback mingguan sehingga 5%',
          'Birthday bonus RM50',
          'Priority customer service',
          'Exclusive VIP promotions',
        ],
        ctaText: 'Join VIP',
        ctaLink: 'https://masuk10.com/WhatsappVVIP',
        icon: 'star',
        highlight: true,
      },
      {
        title: 'Agent Commission',
        items: [
          'Komisyen sehingga 45%',
          'Bayaran mingguan',
          'Unlimited downline',
          'Training & support percuma',
        ],
        ctaText: 'Daftar Agent',
        ctaLink: '#register',
        icon: 'vip',
        highlight: false,
      },
    ]

    let promoCount = 0
    for (let i = 0; i < promos.length; i++) {
      const p = promos[i]
      await payload.create({
        collection: 'promos',
        data: {
          title: p.title,
          items: p.items.map((text) => ({ text })),
          ctaText: p.ctaText,
          ctaLink: p.ctaLink,
          icon: p.icon as 'bonus' | 'star' | 'vip',
          highlight: p.highlight,
          order: i,
        },
      })
      promoCount++
    }
    results.promos = promoCount

    // ────────────────────────────────────────────
    // 6. PATCH ID PROVIDERS
    // ────────────────────────────────────────────
    const patchProviders = [
      {
        providerId: 'jili',
        name: 'JILI',
        logoUrl:
          'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F25%2Faece1da0-0722-4da1-b7d9-e300686f56ad.jpg',
      },
      {
        providerId: 'pragmatic',
        name: 'Pragmatic Play',
        logoUrl:
          'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F47%2Fbefe333c-815a-43d7-884d-5a5bf5d5c4f0.jpg',
      },
      {
        providerId: 'bng',
        name: 'BNG',
        logoUrl:
          'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F6%2Fdd712cac-8be0-4060-a12d-fd4c9cb41445.jpg',
      },
      {
        providerId: 'fc-slot',
        name: 'FC Slot',
        logoUrl:
          'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F17%2F9a1b4279-3080-4255-aec9-a2279244136b.jpg',
      },
      {
        providerId: 'relax',
        name: 'Relax Gaming',
        logoUrl:
          'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F84%2F8ab32348-a0a7-4bd5-a2a4-a27cbcf5d4cc.jpg',
      },
      {
        providerId: 'va-slot',
        name: 'VA Slot',
        logoUrl:
          'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F62%2F1cd68978-2d66-4fb3-97da-a9ee5bb64119.jpg',
      },
      {
        providerId: 'spadegaming',
        name: 'Spade Gaming',
        logoUrl:
          'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F95%2F3741cd4c-ade6-4323-9e4a-e70691722679.jpeg',
      },
      {
        providerId: 'acewin',
        name: 'Acewin Slot',
        logoUrl:
          'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F3%2F2a32be39-d110-416f-9d45-a4e70cfd124f.jpg',
      },
      {
        providerId: 'nolimit',
        name: 'NoLimit City',
        logoUrl:
          'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F37%2Febf9d79e-2be8-4440-828b-26b75dbc506f.jpg',
      },
      {
        providerId: 'hacksaw',
        name: 'Hacksaw',
        logoUrl:
          'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F79%2Fd18411b6-519a-470f-8cdf-2442331ccf88.jpg',
      },
      {
        providerId: 'habanero',
        name: 'Habanero',
        logoUrl:
          'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F89%2Fd22d30e6-3b31-46c9-bf4c-e671950d0402.jpg',
      },
      {
        providerId: 'jdb',
        name: 'JDB',
        logoUrl:
          'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F80%2F20c33528-54e3-4069-a7dd-5ccc44cc6eda.jpg',
      },
      {
        providerId: 'playtech',
        name: 'Playtech',
        logoUrl:
          'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F83%2F2ef04bd9-813c-4169-a397-a59dcb66e87e.jpg',
      },
      {
        providerId: 'betsoft',
        name: 'BetSoft',
        logoUrl:
          'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F82%2Fcd27fe88-c13b-44bb-9b9c-b36b29166c3d.jpg',
      },
      {
        providerId: 'ap-slot',
        name: 'AP Gaming',
        logoUrl:
          'https://images.cashmarket888.xyz/uploads%2Fslot_game%2Fimage_path%2F433%2F9b003918-d7d6-4633-9f0a-f1b1b852e519.png',
      },
      {
        providerId: 'gamzix',
        name: 'Gamzix',
        logoUrl:
          'https://images.cashmarket888.xyz/uploads%2Fslot_game%2Fimage_path%2F294%2F02bf0736-db7b-4000-8f0e-d7d94beb50fa.png',
      },
      {
        providerId: 'gfg',
        name: 'GFG',
        logoUrl:
          'https://images.cashmarket888.xyz/uploads%2Fslot_game%2Fimage_path%2F216%2Fa7d1e88d-ac1a-448d-be2d-68630eead005.png',
      },
      {
        providerId: 'pegasus',
        name: 'Pegasus',
        logoUrl:
          'https://images.cashmarket888.xyz/uploads%2Fslot_game%2Fimage_path%2F644%2F306dc15a-3a40-46d4-a057-7183fa2a18ca.png',
      },
      {
        providerId: 'playson',
        name: 'Playson',
        logoUrl:
          'https://images.cashmarket888.xyz/uploads%2Fslot_game%2Fimage_path%2F378%2F8bd1d24a-d539-4bd4-b2ef-81dd1d799e1f.png',
      },
      {
        providerId: 'rectangle',
        name: 'Rectangle',
        logoUrl:
          'https://images.cashmarket888.xyz/uploads%2Fslot_game%2Fimage_path%2F485%2F4e480277-cb2c-42d3-8a1e-539a7b99426f.png',
      },
      {
        providerId: 'simpleplay',
        name: 'SimplePlay',
        logoUrl:
          'https://images.cashmarket888.xyz/uploads%2Fslot_game%2Fimage_path%2F2011%2F736f2b41-9973-436e-a3e4-210d3b160478.png',
      },
      {
        providerId: 'uu-slot',
        name: 'UU Slot',
        logoUrl:
          'https://images.cashmarket888.xyz/uploads%2Fslot_game%2Fimage_path%2F323%2F7dcff2ec-9af7-455c-8a6e-6853d07824cf.png',
      },
      {
        providerId: 'vplus',
        name: 'V Plus',
        logoUrl:
          'https://images.cashmarket888.xyz/uploads%2Fslot_game%2Fimage_path%2F1507%2F4fdcd0c0-ccc5-494b-b537-abab9fc8a7e2.png',
      },
      {
        providerId: 'vpower',
        name: 'V Power',
        logoUrl:
          'https://images.cashmarket888.xyz/uploads%2Fslot_game%2Fimage_path%2F1629%2F4ed85273-34d2-4a59-9834-b2e07a2451fc.jpg',
      },
      {
        providerId: 'wowgaming',
        name: 'WOW Gaming',
        logoUrl:
          'https://images.cashmarket888.xyz/uploads%2Fslot_game%2Fimage_path%2F273%2F80d54715-b6c5-4abc-9cd7-093fbf72aacc.png',
      },
      {
        providerId: 'tgg',
        name: 'TGG',
        logoUrl:
          'https://images.cashmarket888.xyz/uploads%2Fslot_game%2Fimage_path%2F644%2F306dc15a-3a40-46d4-a057-7183fa2a18ca.png',
      },
      {
        providerId: 'jilig',
        name: 'JILI Global',
        logoUrl:
          'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F25%2Faece1da0-0722-4da1-b7d9-e300686f56ad.jpg',
      },
      {
        providerId: 'fastspin',
        name: 'Fastspin',
        logoUrl:
          'https://images.cashmarket888.xyz/uploads%2Fslot_game%2Fimage_path%2F3650%2Fd38fb236-eb64-4b3a-bb42-441e86c54819.png',
      },
      {
        providerId: 'inandout',
        name: 'In & Out',
        logoUrl:
          'https://images.cashmarket888.xyz/uploads%2Fslot_game%2Fimage_path%2F3723%2F0f3af674-9e56-4b23-8f50-a960c4b682a8.png',
      },
      {
        providerId: 'croco',
        name: 'Croco',
        logoUrl:
          'https://images.cashmarket888.xyz/uploads%2Fslot_game%2Fimage_path%2F4261%2F1858f7ae-2b7b-450d-8d2c-44e1333e2c15.png',
      },
    ]

    let patchProviderCount = 0
    for (let i = 0; i < patchProviders.length; i++) {
      const p = patchProviders[i]
      await payload.create({
        collection: 'patch-providers',
        data: {
          providerId: p.providerId,
          name: p.name,
          logoUrl: p.logoUrl,
          order: i,
          active: true,
        },
      })
      patchProviderCount++
    }
    results.patchProviders = patchProviderCount

    // ────────────────────────────────────────────
    // 7. PATCH ID GAMES (from gameData.ts)
    // ────────────────────────────────────────────
    // gameData keys map to provider IDs
    const providerKeyMap: Record<string, string> = {
      fc: 'fc-slot',
      va: 'va-slot',
      spade: 'spadegaming',
      ap: 'ap-slot',
      uu: 'uu-slot',
    }

    let gameCount = 0
    for (const [providerKey, games] of Object.entries(gameData)) {
      // Map back to the provider ID used in patch-providers
      const providerId = providerKeyMap[providerKey] || providerKey

      for (const game of games) {
        await payload.create({
          collection: 'games',
          data: {
            name: game.name,
            provider: providerId,
            imageUrl: game.img || '',
          },
        })
        gameCount++
      }
    }
    results.games = gameCount

    // ────────────────────────────────────────────
    // 8. COMMISSION TIERS
    // ────────────────────────────────────────────
    const tiers = [
      {
        name: 'Newbie Agent',
        percentage: 60,
        minDownline: 0,
        benefits: [
          'Komisyen asas 60%',
          'Admin ajar cara promote CM8',
          'Akses dashboard',
          'Naik peratus selepas capai target',
        ],
        color: '#ff6b4a',
        icon: 'star',
      },
      {
        name: 'Solo Player Agent',
        percentage: 80,
        minDownline: 5,
        benefits: [
          'Komisyen 80%',
          'Dashboard premium',
          'Sokongan prioriti 24/7',
          'Naik peratus selepas capai target sales',
        ],
        color: '#ffaa33',
        icon: 'crown',
      },
      {
        name: 'Team Builder Agent',
        percentage: 90,
        minDownline: 20,
        benefits: [
          'Komisyen tertinggi 90%',
          'Bina team & network sendiri',
          'Pengalaman shareholder platform',
          'Semua bahan pemasaran',
          'Bonus & insentif khas',
          'Pendapatan downline',
        ],
        color: '#d4a853',
        icon: 'diamond',
      },
    ]

    let tierCount = 0
    for (let i = 0; i < tiers.length; i++) {
      const t = tiers[i]
      await payload.create({
        collection: 'commission-tiers',
        data: {
          name: t.name,
          percentage: t.percentage,
          minDownline: t.minDownline,
          benefits: t.benefits.map((text) => ({ text })),
          color: t.color,
          icon: t.icon as 'star' | 'crown' | 'diamond' | 'rocket',
          order: i,
          active: true,
        },
      })
      tierCount++
    }
    results.commissionTiers = tierCount

    // ────────────────────────────────────────────
    // 9. SITE SETTINGS (global)
    // ────────────────────────────────────────────
    try {
      await payload.updateGlobal({
        slug: 'site-settings',
        data: {
          siteName: 'CM8 VVIP',
          tagline: 'Platform Agent #1 Malaysia',
          heroTitle: 'Jadi Agent CM8 Sekarang',
          heroSubtitle:
            'Jana pendapatan lumayan dengan menjadi agent platform CM8. Komisyen tinggi, sokongan penuh, dan peluang tanpa had.',
          heroCTA: 'Daftar Sekarang',
          whatsappNumber: '601110646537',
          telegramLink: 'https://t.me/cm8vvip',
          footerText: '© 2026 CM8 VVIP. Semua hak cipta terpelihara.',
          metaTitle: 'CM8 VVIP — Buat Duit Online & Agent Slot Tanpa Modal #1 Malaysia',
          metaDescription:
            'Jana income pasif sebagai Agent Slot CM8 VVIP. Daftar percuma, tiada modal.',
          keywords: 'agent cm8, buat duit online, agent slot, tanpa modal, income pasif, hack slot',
          tickerEnabled: true,
          tickerMessages: [
            { text: '🔥 Komisyen sehingga 90% — Daftar sekarang!' },
            { text: '💰 Ah***d baru terima RM4,200 komisyen minggu ini' },
            { text: '🚀 1,200+ agent aktif sudah menjana pendapatan' },
            { text: '⭐ CM8 — Platform Agent #1 Malaysia' },
          ],
          socialLinks: [
            { platform: 'facebook', url: 'https://facebook.com/cm8vvip' },
            { platform: 'instagram', url: 'https://instagram.com/cm8vvip' },
            { platform: 'tiktok', url: 'https://tiktok.com/@cm8vvip' },
          ],
        },
      })
      results.siteSettings = 1
    } catch {
      results.siteSettings_error = 0 // failed
    }

    // ---------- Banners ----------
    try {
      const existingBanners = await payload.find({ collection: 'banners', limit: 1 })
      if (existingBanners.docs.length === 0) {
        const bannerData = [
          {
            title: 'CM8 Promo Banner 1',
            imageUrl: '/banners/banner-cm8-1.png',
            order: 1,
            active: true,
          },
          {
            title: 'CM8 Promo Banner 2',
            imageUrl: '/banners/banner-cm8-2.png',
            order: 2,
            active: true,
          },
          {
            title: 'CM8 Promo Banner 3',
            imageUrl: '/banners/banner-cm8-3.png',
            order: 3,
            active: true,
          },
        ]
        let count = 0
        for (const b of bannerData) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await payload.create({ collection: 'banners', data: b as any })
          count++
        }
        results.banners = count
      } else {
        results.banners_skipped = existingBanners.docs.length
      }
    } catch {
      results.banners_error = 0
    }

    return NextResponse.json({
      success: true,
      message: 'Seed completed!',
      results,
    })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('[SEED] Error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
