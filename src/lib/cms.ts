import { getPayload } from 'payload'
import config from '@/payload.config'

// Helper to safely get Payload instance
async function getPayloadInstance() {
  try {
    return await getPayload({ config })
  } catch {
    console.warn('[CMS] Could not initialize Payload — using fallback data')
    return null
  }
}

/* ── Site Settings ─────────────────────────────────── */
export async function getSiteSettings() {
  const payload = await getPayloadInstance()
  if (!payload) return null
  try {
    return await payload.findGlobal({ slug: 'site-settings' })
  } catch {
    return null
  }
}

/* ── Testimonials / Income Showcase ─────────────────── */
export async function getIncomeShowcase() {
  const payload = await getPayloadInstance()
  if (!payload) return null
  try {
    const result = await payload.find({
      collection: 'testimonials',
      where: { type: { equals: 'income' }, featured: { equals: true } },
      sort: 'order',
      limit: 50,
    })
    return result.docs.length > 0 ? result.docs : null
  } catch {
    return null
  }
}

/* ── Homepage Providers ─────────────────────────────── */
export async function getHomepageProviders() {
  const payload = await getPayloadInstance()
  if (!payload) return null
  try {
    const result = await payload.find({
      collection: 'providers',
      where: { showOnHomepage: { equals: true } },
      sort: 'order',
      limit: 50,
    })
    return result.docs.length > 0 ? result.docs : null
  } catch {
    return null
  }
}

/* ── FAQs ───────────────────────────────────────────── */
export async function getFAQs() {
  const payload = await getPayloadInstance()
  if (!payload) return null
  try {
    const result = await payload.find({
      collection: 'faqs',
      sort: 'order',
      limit: 50,
    })
    return result.docs.length > 0 ? result.docs : null
  } catch {
    return null
  }
}

/* ── Promos ─────────────────────────────────────────── */
export async function getPromos() {
  const payload = await getPayloadInstance()
  if (!payload) return null
  try {
    const result = await payload.find({
      collection: 'promos',
      sort: 'order',
      limit: 20,
    })
    return result.docs.length > 0 ? result.docs : null
  } catch {
    return null
  }
}

/* ── Banners ────────────────────────────────────────── */
export async function getBanners() {
  const payload = await getPayloadInstance()
  if (!payload) return null
  try {
    const result = await payload.find({
      collection: 'banners',
      where: { active: { equals: true } },
      sort: 'order',
      limit: 20,
    })
    return result.docs.length > 0 ? result.docs : null
  } catch {
    return null
  }
}

/* ── Patch ID Providers ─────────────────────────────── */
export async function getPatchProviders() {
  const payload = await getPayloadInstance()
  if (!payload) return null
  try {
    const result = await payload.find({
      collection: 'patch-providers',
      where: { active: { equals: true } },
      sort: 'order',
      limit: 100,
    })
    return result.docs.length > 0 ? result.docs : null
  } catch {
    return null
  }
}

/* ── Patch ID Games ─────────────────────────────────── */
export async function getPatchGames() {
  const payload = await getPayloadInstance()
  if (!payload) return null
  try {
    const result = await payload.find({
      collection: 'games',
      limit: 5000,
    })
    if (result.docs.length === 0) return null

    // Group games by provider
    const grouped: Record<string, Array<{ name: string; img: string }>> = {}
    for (const game of result.docs) {
      const provider = (game as { provider: string }).provider
      if (!grouped[provider]) grouped[provider] = []
      grouped[provider].push({
        name: (game as { name: string }).name,
        img: (game as { imageUrl?: string }).imageUrl || '',
      })
    }
    return grouped
  } catch {
    return null
  }
}
