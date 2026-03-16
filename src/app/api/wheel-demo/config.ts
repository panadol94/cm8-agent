import { promises as fs } from 'fs'
import path from 'path'

export type DemoWhitelistEntry = {
  agentId: string
  whatsapp: string
  note?: string
  spinLimit?: number
}

export type DemoPrize = {
  label: string
  weight: number
  colorA: string
  colorB: string
  textColor?: string
}

export type DemoSpinRecord = {
  agentId: string
  whatsapp: string
  prize: string
  spunAt: string
  spunAtMs: number
  claimId: string
  ip: string
  userAgent?: string
}

export type DemoAdminConfig = {
  prizes: DemoPrize[]
  whitelist: DemoWhitelistEntry[]
  spinLimitPerEntry: number
}

export const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''
export const MAINTENANCE_GROUP_ID = '-1003879318608'
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.cm8vvip.com'

const PRIZE_PALETTE = [
  { colorA: '#ffcf33', colorB: '#ff9800', textColor: '#2b1300' },
  { colorA: '#ff5f6d', colorB: '#ffc371', textColor: '#ffffff' },
  { colorA: '#8e2de2', colorB: '#ff6fd8', textColor: '#ffffff' },
  { colorA: '#00c6ff', colorB: '#0072ff', textColor: '#ffffff' },
  { colorA: '#f7971e', colorB: '#ffd200', textColor: '#2b1300' },
  { colorA: '#43cea2', colorB: '#185a9d', textColor: '#ffffff' },
]

export const DEFAULT_DEMO_PRIZES: DemoPrize[] = [
  { label: 'RM100', weight: 84, colorA: '#ffcf33', colorB: '#ff9800', textColor: '#2b1300' },
  { label: 'RM288', weight: 10, colorA: '#ff5f6d', colorB: '#ffc371' },
  { label: 'RM388', weight: 5, colorA: '#8e2de2', colorB: '#ff6fd8' },
  { label: 'RM588', weight: 1, colorA: '#00c6ff', colorB: '#0072ff' },
  { label: '5G GOLD', weight: 0, colorA: '#f7971e', colorB: '#ffd200', textColor: '#2b1300' },
]

const DEFAULT_WHITELIST: DemoWhitelistEntry[] = [
  { agentId: 'Garry', whatsapp: '0178182320', note: 'Demo login for Garry', spinLimit: 1 },
]

const DEFAULT_ADMIN_CONFIG: DemoAdminConfig = {
  prizes: DEFAULT_DEMO_PRIZES,
  whitelist: DEFAULT_WHITELIST,
  spinLimitPerEntry: 1,
}

const MEDIA_DIR = path.join(process.cwd(), 'media')
export const DEMO_WHEEL_SPINS_FILE = path.join(MEDIA_DIR, 'wheel-demo-spins.json')
export const DEMO_WHEEL_CONFIG_FILE = path.join(MEDIA_DIR, 'wheel-demo-admin.json')

export function normalizeAgentId(value: string): string {
  return String(value || '').trim().toLowerCase()
}

export function normalizePhone(value: string): string {
  const digits = String(value || '').replace(/\D/g, '')
  if (!digits) return ''
  if (digits.startsWith('60')) return digits
  if (digits.startsWith('0')) return `60${digits.slice(1)}`
  return digits
}

function normalizeSpinLimit(value: unknown, fallback = 1): number {
  const num = Number(value)
  if (!Number.isFinite(num)) return fallback
  return Math.max(1, Math.floor(num))
}

function normalizePrize(entry: Partial<DemoPrize>, index: number): DemoPrize | null {
  const label = String(entry.label || '').trim()
  if (!label) return null

  const palette = PRIZE_PALETTE[index % PRIZE_PALETTE.length]
  return {
    label,
    weight: Math.max(0, Number(entry.weight) || 0),
    colorA: String(entry.colorA || palette.colorA).trim() || palette.colorA,
    colorB: String(entry.colorB || palette.colorB).trim() || palette.colorB,
    textColor: String(entry.textColor || palette.textColor || '').trim() || undefined,
  }
}

function normalizePrizes(entries: unknown): DemoPrize[] {
  if (!Array.isArray(entries)) return [...DEFAULT_DEMO_PRIZES]

  const normalized = entries
    .map((entry, index) => normalizePrize((entry || {}) as Partial<DemoPrize>, index))
    .filter(Boolean) as DemoPrize[]

  return normalized.length > 0 ? normalized : [...DEFAULT_DEMO_PRIZES]
}

function dedupeWhitelist(entries: DemoWhitelistEntry[], fallbackSpinLimit: number): DemoWhitelistEntry[] {
  const seen = new Set<string>()
  const output: DemoWhitelistEntry[] = []

  for (const entry of entries) {
    const agentId = String(entry.agentId || '').trim()
    const whatsapp = normalizePhone(entry.whatsapp)
    if (!agentId || !whatsapp) continue

    const key = `${normalizeAgentId(agentId)}::${whatsapp}`
    if (seen.has(key)) continue
    seen.add(key)

    output.push({
      agentId,
      whatsapp,
      note: String(entry.note || '').trim() || undefined,
      spinLimit: normalizeSpinLimit(entry.spinLimit, fallbackSpinLimit),
    })
  }

  return output
}

function normalizeAdminConfig(raw: Partial<DemoAdminConfig> | null | undefined): DemoAdminConfig {
  const spinLimitPerEntry = normalizeSpinLimit(raw?.spinLimitPerEntry, DEFAULT_ADMIN_CONFIG.spinLimitPerEntry)
  const whitelistSource = Array.isArray(raw?.whitelist) && raw?.whitelist.length > 0
    ? raw.whitelist
    : DEFAULT_WHITELIST

  return {
    prizes: normalizePrizes(raw?.prizes),
    whitelist: dedupeWhitelist(whitelistSource, spinLimitPerEntry),
    spinLimitPerEntry,
  }
}

export async function getDemoAdminConfig(): Promise<DemoAdminConfig> {
  try {
    const raw = await fs.readFile(DEMO_WHEEL_CONFIG_FILE, 'utf-8')
    return normalizeAdminConfig(JSON.parse(raw))
  } catch {
    return normalizeAdminConfig(DEFAULT_ADMIN_CONFIG)
  }
}

export async function saveDemoAdminConfig(config: Partial<DemoAdminConfig>) {
  const normalized = normalizeAdminConfig(config)
  await fs.mkdir(MEDIA_DIR, { recursive: true })
  await fs.writeFile(DEMO_WHEEL_CONFIG_FILE, JSON.stringify(normalized, null, 2), 'utf-8')
  return normalized
}

export async function getDemoWhitelist(): Promise<DemoWhitelistEntry[]> {
  const config = await getDemoAdminConfig()
  return config.whitelist
}

type DemoSpinStore = Record<string, DemoSpinRecord[]>

function normalizeSpinRecord(value: DemoSpinRecord | null | undefined): DemoSpinRecord | null {
  if (!value || typeof value !== 'object') return null

  const agentId = String(value.agentId || '').trim()
  const whatsapp = normalizePhone(value.whatsapp)
  const prize = String(value.prize || '').trim()
  const claimId = String(value.claimId || '').trim()

  if (!agentId || !whatsapp || !prize || !claimId) return null

  return {
    agentId,
    whatsapp,
    prize,
    spunAt: String(value.spunAt || '').trim() || getMytTimestamp(),
    spunAtMs: Number(value.spunAtMs) || Date.now(),
    claimId,
    ip: String(value.ip || 'unknown'),
    userAgent: String(value.userAgent || '').trim() || undefined,
  }
}

function normalizeSpinStore(raw: unknown): DemoSpinStore {
  if (!raw || typeof raw !== 'object') return {}

  const output: DemoSpinStore = {}

  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (Array.isArray(value)) {
      const history = value
        .map((entry) => normalizeSpinRecord(entry as DemoSpinRecord))
        .filter(Boolean) as DemoSpinRecord[]

      if (history.length > 0) {
        output[key] = history.sort((a, b) => a.spunAtMs - b.spunAtMs)
      }
      continue
    }

    const single = normalizeSpinRecord(value as DemoSpinRecord)
    if (single) {
      output[key] = [single]
    }
  }

  return output
}

export async function getDemoSpins(): Promise<DemoSpinStore> {
  try {
    const raw = await fs.readFile(DEMO_WHEEL_SPINS_FILE, 'utf-8')
    return normalizeSpinStore(JSON.parse(raw))
  } catch {
    return {}
  }
}

export async function saveDemoSpins(spins: DemoSpinStore) {
  await fs.mkdir(MEDIA_DIR, { recursive: true })
  await fs.writeFile(DEMO_WHEEL_SPINS_FILE, JSON.stringify(spins, null, 2), 'utf-8')
}

export function buildWhitelistKey(agentId: string, whatsapp: string) {
  return `${normalizeAgentId(agentId)}::${normalizePhone(whatsapp)}`
}

export function findWhitelistEntry(entries: DemoWhitelistEntry[], agentId: string, whatsapp: string) {
  const key = buildWhitelistKey(agentId, whatsapp)
  return entries.find((entry) => buildWhitelistKey(entry.agentId, entry.whatsapp) === key) || null
}

export function generateClaimId(agentId: string) {
  const clean = normalizeAgentId(agentId).replace(/[^a-z0-9]/g, '').slice(0, 8) || 'cm8demo'
  const ts = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `DEMO-${clean}-${ts}-${rand}`
}

export function getClientIp(headers: Headers): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    headers.get('cf-connecting-ip') ||
    'unknown'
  )
}

export function pickDemoPrize(prizes: DemoPrize[]): string {
  const total = prizes.reduce((sum, prize) => sum + Math.max(0, prize.weight), 0)
  if (total <= 0) return prizes[0]?.label || 'RM100'

  const roll = Math.random() * total
  let cursor = 0

  for (const prize of prizes) {
    cursor += Math.max(0, prize.weight)
    if (roll < cursor) return prize.label
  }

  return prizes[0]?.label || 'RM100'
}

export function getMytTimestamp(date = new Date()) {
  return date.toLocaleString('ms-MY', { timeZone: 'Asia/Kuala_Lumpur' })
}

export function getSpinLimitForEntry(entry: DemoWhitelistEntry | null, config: DemoAdminConfig): number {
  if (!entry) return config.spinLimitPerEntry
  return normalizeSpinLimit(entry.spinLimit, config.spinLimitPerEntry)
}

export function flattenDemoSpins(spins: DemoSpinStore) {
  return Object.values(spins)
    .flat()
    .sort((a, b) => b.spunAtMs - a.spunAtMs)
}
