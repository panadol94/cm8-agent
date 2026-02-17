// Scrape ALL game data from cm8api.com and save to gameData.ts
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const PROVIDERS = {
  bng: 6,
  jili: 25,
  fc: 17,
  pragmatic: 47,
  relax: 84,
  va: 62,
  spade: 95,
  acewin: 3,
  nolimit: 37,
  hacksaw: 79,
  habanero: 89,
  jdb: 80,
  playtech: 83,
  betsoft: 82,
  mega888: 32,
  '918kiss': 27,
  // ── New providers (Feb 2026) ──
  ap: 5,
  gamzix: 18,
  gfg: 20,
  pegasus: 39,
  playson: 44,
  rectangle: 48,
  simpleplay: 54,
  uu: 61,
  vplus: 64,
  vpower: 65,
  wowgaming: 72,
  tgg: 78,
  jilig: 85,
  fastspin: 91,
  inandout: 94,
  croco: 97,
}

async function fetchGames(subPlatformId) {
  const url = `https://cm8api.com/api/v1/data/game_lists?sub_platform_id=${subPlatformId}`
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json, text/plain, */*',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      Origin: 'https://cm8ong.com',
      Referer: 'https://cm8ong.com/',
    },
  })

  if (!res.ok) {
    console.error(`  HTTP ${res.status} for ID ${subPlatformId}`)
    const text = await res.text()
    console.error(`  Response: ${text.slice(0, 200)}`)
    return []
  }

  const json = await res.json()
  const slot = json.data?.slot || []
  const slot2 = json.data?.slot2 || []
  const all = [...slot, ...slot2]
  return all
    .map((g) => ({
      name: g.name || 'Unknown',
      img: g.image_path || '',
    }))
    .filter((g) => g.name && g.name !== 'Unknown')
}

async function main() {
  const result = {}

  for (const [key, id] of Object.entries(PROVIDERS)) {
    console.log(`Fetching ${key} (ID: ${id})...`)
    try {
      const games = await fetchGames(id)
      result[key] = games
      console.log(`  Got ${games.length} games`)
    } catch (e) {
      console.error(`  Error: ${e.message}`)
      result[key] = []
    }
  }

  // mega888 and 918kiss now fetched via API above

  // Save raw JSON for reference
  const jsonPath = path.join(__dirname, 'allGames.json')
  fs.writeFileSync(jsonPath, JSON.stringify(result, null, 2), 'utf8')
  console.log(`\nSaved JSON to ${jsonPath}`)

  // Generate TypeScript file
  let ts = `// Auto-generated game data from cm8ong.com API\n`
  ts += `// Generated on: ${new Date().toISOString()}\n`
  ts += `// Total providers: ${Object.keys(result).length}\n\n`
  ts += `export type GameInfo = { name: string; img: string }\n\n`
  ts += `export const gameData: Record<string, GameInfo[]> = {\n`

  for (const [key, games] of Object.entries(result)) {
    ts += `  '${key}': [\n`
    for (const g of games) {
      const name = g.name.replace(/'/g, "\\'")
      ts += `    { name: '${name}', img: '${g.img}' },\n`
    }
    ts += `  ],\n`
  }

  ts += `}\n`

  const outPath = path.join(__dirname, 'src', 'app', '(frontend)', 'patch-id', 'gameData.ts')
  fs.writeFileSync(outPath, ts, 'utf8')
  console.log(`Wrote TypeScript to ${outPath}`)

  // Summary
  let total = 0
  for (const [key, games] of Object.entries(result)) {
    total += games.length
    console.log(`${key}: ${games.length} games`)
  }
  console.log(`Total: ${total} games`)
}

main().catch(console.error)
