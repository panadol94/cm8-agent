/* ================================================================
   Patch ID OTP — Shared utilities
   In-memory store + helpers used by register, verify, bot-webhook
   ================================================================ */

export interface OTPEntry {
  phone: string // normalized: +60123456789
  otp: string // 6-digit code
  expiresAt: number // Date.now() + 5min
  verified: boolean
  cm8Username?: string // extracted from screenshot via AI Vision
  awaitingScreenshot?: boolean // true after contact shared, waiting for screenshot
  telegramChatId?: number // to send OTP after screenshot verified
}

declare global {
  var __patchOtpStore: Map<string, OTPEntry> | undefined
}

export function getOtpStore(): Map<string, OTPEntry> {
  if (!global.__patchOtpStore) global.__patchOtpStore = new Map()
  return global.__patchOtpStore
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function normalizePhone(countryCode: string, phone: string): string {
  const cleaned = phone.replace(/\D/g, '').replace(/^0+/, '')
  return `${countryCode}${cleaned}`
}
