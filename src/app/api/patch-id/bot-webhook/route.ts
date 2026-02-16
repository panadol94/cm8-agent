import { NextResponse } from 'next/server'
import { getOtpStore } from '../register/route'

const GROUP_LINK = 'https://t.me/cm8vvip'

/* ── Telegram Bot Webhook for Patch ID OTP ──────────────────── */
export async function POST(req: Request) {
  try {
    const update = await req.json()
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    if (!botToken) return NextResponse.json({ ok: true })

    const message = update.message
    if (!message) return NextResponse.json({ ok: true })

    const chatId = message.chat?.id
    if (!chatId) return NextResponse.json({ ok: true })

    // ── User shared contact ──
    if (message.contact) {
      const phoneRaw = message.contact.phone_number || ''
      // Normalize: ensure starts with +
      let phone = phoneRaw.replace(/\D/g, '')
      if (!phone.startsWith('+')) phone = `+${phone}`

      // Look up OTP by phone
      const store = getOtpStore()
      let otpEntry = store.get(phone)

      // Try with/without leading + for flexible matching
      if (!otpEntry) {
        for (const [key, entry] of store) {
          const keyDigits = key.replace(/\D/g, '')
          const phoneDigits = phone.replace(/\D/g, '')
          if (keyDigits === phoneDigits && !entry.verified) {
            otpEntry = entry
            break
          }
        }
      }

      if (otpEntry && !otpEntry.verified && Date.now() < otpEntry.expiresAt) {
        // Send OTP
        await sendTelegramMessage(
          botToken,
          chatId,
          `🔐 *PATCH ID — OTP VERIFICATION*\n\n` +
            `Kod OTP anda: \`${otpEntry.otp}\`\n\n` +
            `⏱️ Kod ini akan tamat dalam 5 minit.\n\n` +
            `📋 *Langkah seterusnya:*\n` +
            `1️⃣ Masukkan kod OTP di website\n` +
            `2️⃣ Join group kami: ${GROUP_LINK}\n\n` +
            `🛡️ _CM8 VVIP — AI Scanner Percuma_`,
        )
      } else if (otpEntry?.verified) {
        await sendTelegramMessage(
          botToken,
          chatId,
          `✅ Nombor ini sudah didaftarkan.\n\n` +
            `Sila guna scanner di:\n🌐 cm8vvip.com/patch-id\n\n` +
            `📲 Join group: ${GROUP_LINK}`,
        )
      } else {
        await sendTelegramMessage(
          botToken,
          chatId,
          `❌ Tiada OTP ditemui untuk nombor ini.\n\n` +
            `Sila daftar terlebih dahulu di:\n🌐 cm8vvip.com/patch-id\n\n` +
            `Kemudian share contact anda di sini untuk terima OTP.`,
        )
      }

      return NextResponse.json({ ok: true })
    }

    // ── Any other message / command → ask to share contact ──
    await sendTelegramMessage(
      botToken,
      chatId,
      `🛡️ *CM8 VVIP — Patch ID Scanner*\n\n` +
        `Untuk mendapatkan kod OTP, sila share contact anda.\n\n` +
        `📱 Tekan butang *"Share Contact"* di bawah 👇`,
      true, // show share contact button
    )

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[BOT-WEBHOOK] Error:', err)
    return NextResponse.json({ ok: true })
  }
}

/* ── Helper: Send Telegram message ──────────────────────────── */
async function sendTelegramMessage(
  botToken: string,
  chatId: number,
  text: string,
  showContactButton = false,
) {
  const body: Record<string, unknown> = {
    chat_id: chatId,
    text,
    parse_mode: 'Markdown',
  }

  if (showContactButton) {
    body.reply_markup = {
      keyboard: [[{ text: '📱 Share Contact', request_contact: true }]],
      resize_keyboard: true,
      one_time_keyboard: true,
    }
  }

  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}
