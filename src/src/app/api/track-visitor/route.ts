import { UAParser } from 'ua-parser-js'
import { LRUCache } from 'lru-cache'

// Global cache to persist across hot reloads in dev and concurrent requests in prod
const globalForCache = global as unknown as {
  visitorCache: LRUCache<string, boolean>
  dailystats: { date: string; total: number; unique: number }
}

const cache =
  globalForCache.visitorCache ||
  new LRUCache<string, boolean>({
    max: 5000, // max 5000 unique IPs
    ttl: 1000 * 60 * 60 * 24, // 24 hours TTL
  })

const stats = globalForCache.dailystats || {
  date: new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kuala_Lumpur' }),
  total: 0,
  unique: 0,
}

if (process.env.NODE_ENV !== 'production') {
  globalForCache.visitorCache = cache
  globalForCache.dailystats = stats
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { page, screen, lang, battery, from } = body

    // 1. Get IP Address
    // Next.js (Vercel) forwarded IP header, or fallback to request socket
    const forwardedFor = req.headers.get('x-forwarded-for')
    let ip = ''
    if (forwardedFor) {
      ip = forwardedFor.split(',')[0].trim()
    } else {
      // Fallback for local development
      ip = '127.0.0.1'
    }

    // Daily reset check
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kuala_Lumpur' })
    if (stats.date !== today) {
      stats.date = today
      stats.total = 0
      stats.unique = 0
      cache.clear()
    }

    stats.total += 1

    // Check if returning (for label only — ALL visitors get reported)
    const isReturning = cache.has(ip)

    if (!isReturning) {
      // Register as new unique visitor
      cache.set(ip, true)
      stats.unique += 1
    }

    // 2. Parse User-Agent
    const userAgent = req.headers.get('user-agent') || ''
    const parser = new UAParser(userAgent)
    const browser = parser.getBrowser()
    const os = parser.getOS()
    const deviceStr = `${os.name || 'Unknown OS'} • ${browser.name || 'Unknown Browser'}`

    // 3. Get Geolocation and ISP (using ip-api.com - free tier, no key required)
    // Note: ip-api.com HTTP endpoint is used. For HTTPS on their free tier, it has limits,
    // but works well for low-medium traffic tracking.
    let location = 'Unknown Location'
    let isp = 'Unknown ISP'

    if (ip !== '127.0.0.1' && ip !== '::1') {
      try {
        const geoRes = await fetch(
          `http://ip-api.com/json/${ip}?fields=status,country,regionName,city,isp`,
          {
            cache: 'no-store',
          },
        )
        const geoData = await geoRes.json()
        if (geoData.status === 'success') {
          location = `${geoData.city}, ${geoData.regionName}, ${geoData.country}`
          isp = geoData.isp
        }
      } catch (e) {
        console.error('Failed to fetch geo data', e)
      }
    } else {
      location = 'Localhost (Development)'
      isp = 'Local Network'
    }

    // 4. Format the Telegram Message (HTML Mode)
    const now = new Date()
    const timeString = now.toLocaleString('en-MY', {
      timeZone: 'Asia/Kuala_Lumpur',
      dateStyle: 'medium',
      timeStyle: 'short',
    })

    // Determine visitor type label
    const typeLabel = isReturning ? '🔔 🔁 <b>Returning Visitor</b>' : '🔔 🆕 <b>New Visitor</b>'

    const message = `
${typeLabel}

📄 <b>Page:</b> ${page || 'Unknown'}
🕛 <b>Time:</b> ${timeString}
📱 <b>Device:</b> ${deviceStr}
🌍 <b>Location:</b> ${location}
🔗 <b>From:</b> ${from || 'Direct'}
📡 <b>ISP:</b> ${isp}
📐 <b>Screen:</b> ${screen || 'Unknown'}
🌐 <b>Lang:</b> ${lang || 'Unknown'}
🔌 <b>Battery:</b> ${battery ? `${battery}%` : 'Unknown'}
👥 <b>Today:</b> ${stats.total} visits (${stats.unique} unique)
`.trim()

    // 5. Send to Telegram
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const chatId = '-1003819467597' // Hardcoded Admin Group ID for visitor tracking

    if (botToken && chatId) {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      })
    } else {
      console.warn('Telegram Bot Token or Chat ID is missing')
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error tracking visitor:', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
