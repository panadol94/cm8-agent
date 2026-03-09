/*
 * Lucky Pick Configuration
 * 9-card scratch game — login-gated, 1 free daily ticket per user
 * Prize probability on /10,000 scale
 */

export interface Prize {
  label: string
  value: number
  weight: number
  color: string
  emoji: string
}

export interface LuckyPickRecord {
  userId: number
  phone: string
  prize: string
  prizeValue: number
  cardPicked: number
  fomoCards: { index: number; label: string }[]
  timestamp: number
  ip?: string
  claimed: boolean
}

export interface LuckyPickData {
  plays: LuckyPickRecord[]
}

export const PRIZES: Prize[] = [
  { label: 'Terima Kasih',  value: 0,   weight: 8400, color: '#666',    emoji: '😊' },
  { label: 'RM3',           value: 3,   weight: 1000, color: '#4CAF50', emoji: '💚' },
  { label: 'RM10',          value: 10,  weight: 540,  color: '#2196F3', emoji: '💙' },
  { label: 'RM50',          value: 50,  weight: 49,   color: '#FF9800', emoji: '🧡' },
  { label: 'RM100',         value: 100, weight: 10,   color: '#E91E63', emoji: '💖' },
  { label: 'RM388',         value: 388, weight: 1,    color: '#FFD700', emoji: '👑' },
]

export const FOMO_PRIZES = ['RM388', 'RM100', 'RM100', 'RM50', 'RM50', 'RM50', 'RM10', 'RM10']

export const CLAIM_WHATSAPP = '60172722902'

export const LUCKY_PICK_FILE = '/app/media/lucky-pick.json'

export const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''
export const MAINTENANCE_GROUP_ID = '-1003879318608'

export function pickPrize(): Prize {
  const roll = Math.floor(Math.random() * 10000)
  let cumulative = 0
  for (const prize of PRIZES) {
    cumulative += prize.weight
    if (roll < cumulative) return prize
  }
  return PRIZES[0]
}
