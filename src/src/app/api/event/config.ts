/*
 * Event System Configuration
 * 
 * Pick A Box event — code-gated, limited winners, server-side tracking
 */

export interface EventConfig {
  id: string
  code: string
  title: string
  prize: string
  prizeAmount: number
  startTime: string  // ISO 8601 with timezone
  endTime: string
  maxWinners: number
  winRate: number     // 0-100
  boxes: number
  claimMinutes: number
  active: boolean
}

export interface PlayRecord {
  fingerprint: string
  timestamp: number
  result: 'win' | 'lose'
  boxPicked: number
  ip?: string
  playerId?: string
  whatsappNumber?: string
}

export interface EventData {
  winners: number
  plays: PlayRecord[]
}

// ─── Current Event ───
export const CURRENT_EVENT: EventConfig = {
  id: 'event-20260308',
  code: 'GARRYINSAF',
  title: '🎁 Pick A Box — Menang RM10!',
  prize: 'RM10',
  prizeAmount: 10,
  startTime: '2026-03-08T12:00:00+08:00',
  endTime: '2026-03-08T23:59:59+08:00',
  maxWinners: 50,
  winRate: 50,
  boxes: 3,
  claimMinutes: 10,
  active: false,
}

// ─── Media path for persistent storage ───
export const EVENTS_FILE = '/app/media/events.json'

// ─── Telegram notification config ───
export const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''
export const MAINTENANCE_GROUP_ID = '-1003879318608'
