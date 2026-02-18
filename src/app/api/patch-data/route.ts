import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export const dynamic = 'force-dynamic'

// GET /api/patch-data — serves patch providers + games from CMS
export async function GET() {
  try {
    const payload = await getPayload({ config })

    // Fetch providers
    const providersResult = await payload.find({
      collection: 'patch-providers',
      where: { active: { equals: true } },
      sort: 'order',
      limit: 100,
    })

    // Fetch games
    const gamesResult = await payload.find({
      collection: 'games',
      limit: 5000,
    })

    // Format providers
    const providers = providersResult.docs.map((p) => ({
      id: p.providerId,
      name: p.name,
      img: p.logoUrl || '',
    }))

    // Group games by provider
    const gameData: Record<string, Array<{ name: string; img: string }>> = {}
    for (const game of gamesResult.docs) {
      const provider = game.provider
      if (!gameData[provider]) gameData[provider] = []
      gameData[provider].push({
        name: game.name,
        img: game.imageUrl || '',
      })
    }

    return NextResponse.json({ providers, gameData })
  } catch (error) {
    // If CMS not available, return empty — client will use fallback
    console.error('[PATCH-DATA] Error:', error)
    return NextResponse.json({ providers: null, gameData: null })
  }
}
