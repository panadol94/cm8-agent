import { NextResponse } from 'next/server'

/*
 * Lucky Wheel Dynamic Odds — "Happy Hour" system
 *
 * Each day, 2 random hours (between 10AM–10PM MYT) are selected as "hot hours"
 * where win rates are boosted. Outside these hours, No Luck is dominant.
 *
 * Hot hours are deterministic per date (seeded by date string) so they stay
 * consistent throughout the day but change the next day.
 */

// ─── Odds Profiles ───
const HOT_ODDS = {
  noLuck: 27,   // 27%
  rm10: 70,     // 70%
  rm30: 1,      // 1%
  rm50: 1,      // 1%
  rm100: 1,     // 1%
}

const NORMAL_ODDS = {
  noLuck: 65,   // 65%
  rm10: 35,     // 35%
  rm30: 0,      // 0%
  rm50: 0,      // 0%
  rm100: 0,     // 0%
}

// ─── Deterministic random from date seed ───
function seedFromDate(dateStr: string): number {
  let hash = 0
  for (let i = 0; i < dateStr.length; i++) {
    const chr = dateStr.charCodeAt(i)
    hash = ((hash << 5) - hash) + chr
    hash |= 0
  }
  return Math.abs(hash)
}

function getHotHours(dateStr: string): number[] {
  const seed = seedFromDate(dateStr)
  // Pick from valid hours: 10,11,12,13,14,15,16,17,18,19,20,21 (10AM-9PM MYT)
  const validHours = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]

  const idx1 = seed % validHours.length
  // Ensure second hour is different from first
  const idx2 = (seed * 7 + 3) % validHours.length
  const hour1 = validHours[idx1]
  let hour2 = validHours[idx2]
  if (hour2 === hour1) {
    hour2 = validHours[(idx2 + 1) % validHours.length]
  }

  return [hour1, hour2].sort((a, b) => a - b)
}

function getMYTDate(): { dateStr: string; hour: number } {
  const now = new Date()
  // Convert to MYT (UTC+8)
  const myt = new Date(now.getTime() + 8 * 60 * 60 * 1000)
  const dateStr = myt.toISOString().slice(0, 10) // YYYY-MM-DD
  const hour = myt.getUTCHours()
  return { dateStr, hour }
}

export async function GET() {
  const { dateStr, hour } = getMYTDate()
  const hotHours = getHotHours(dateStr)
  const isHotHour = hotHours.includes(hour)
  const odds = isHotHour ? HOT_ODDS : NORMAL_ODDS

  return NextResponse.json({
    odds,
    isHotHour,
    currentHourMYT: hour,
    hotHours: hotHours.map(h => `${h}:00-${h + 1}:00`),
    date: dateStr,
  })
}
