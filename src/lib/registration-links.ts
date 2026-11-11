/** Shared player-registration destination; keep support and agent contacts separate. */
export const CM8_REGISTER_URL = 'https://masuk10.com/Cm8'

const legacyReferralHosts = new Set([
  'cm8play.com',
  'cm8ong.com',
  'cm8asia.com',
  'cm8huat.com',
  'cm8huat1.com',
])

/** Normalize old CMS referral URLs without rewriting community or support links. */
export function resolveCm8RegistrationLink(link?: string | null): string {
  if (!link?.trim()) return CM8_REGISTER_URL

  try {
    const url = new URL(link)
    const hostname = url.hostname.replace(/^www\./, '')
    if (
      (url.protocol === 'https:' || url.protocol === 'http:') &&
      legacyReferralHosts.has(hostname) &&
      /^\/r\/[^/]+\/?$/.test(url.pathname)
    ) {
      return CM8_REGISTER_URL
    }
  } catch {
    // Relative navigation and other non-registration values must remain unchanged.
  }

  return link
}