import { NextResponse } from 'next/server'
import { getOtpStore } from '../utils'

const GROUP_LINK = 'https://t.me/+7qOP1Y8RQcthYjll'
const GROUP_ID = '-1003733462677'

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

    const fromId = message.from?.id
    if (!fromId) return NextResponse.json({ ok: true })

    // Ignore messages from groups, we only deal with users in private chat
    if (message.chat?.type !== 'private') return NextResponse.json({ ok: true })

    // ── Check if user is in the compulsory group ──
    const isMember = await checkGroupMembership(botToken, fromId)
    if (!isMember) {
      await sendTelegramMessage(
        botToken,
        chatId,
        `🚨 *Akses Ditolak*\n\n` +
          `Anda *wajib* menyertai group Telegram rasmi kami terlebih dahulu untuk mendapatkan kod OTP.\n\n` +
          `👉 Sila tekan link ini untuk Join: ${GROUP_LINK}\n\n` +
          `Selepas berjaya join, sila hantar apa-apa mesej atau tekan butang *Share Contact* semula di sini.`,
      )
      return NextResponse.json({ ok: true })
    }

    // ── User shared contact ──
    if (message.contact) {
      const phoneRaw = message.contact.phone_number || ''
      let phone = phoneRaw.replace(/\D/g, '')
      if (!phone.startsWith('+')) phone = `+${phone}`

      const store = getOtpStore()
      let otpEntry = null
      let otpKey = ''

      // Look up OTP by phone (flexible matching)
      for (const [key, entry] of store) {
        const keyDigits = key.replace(/\D/g, '')
        const phoneDigits = phone.replace(/\D/g, '')
        if (keyDigits === phoneDigits && !entry.verified) {
          otpEntry = entry
          otpKey = key
          break
        }
      }

      if (otpEntry && !otpEntry.verified && Date.now() < otpEntry.expiresAt) {
        // DON'T send OTP yet — ask for screenshot first
        otpEntry.awaitingScreenshot = true
        otpEntry.telegramChatId = chatId
        store.set(otpKey, otpEntry)

        await sendTelegramMessage(
          botToken,
          chatId,
          `✅ *Nombor telefon diterima!*\n\n` +
            `📸 Sekarang, sila *hantar screenshot* paparan utama app CM8 anda yang menunjukkan:\n\n` +
            `1️⃣ Logo *CM8* pada skrin\n` +
            `2️⃣ *Username* anda\n\n` +
            `⚠️ _Pastikan username jelas kelihatan dalam screenshot._`,
        )
      } else if (otpEntry?.verified) {
        const usernameInfo = otpEntry.cm8Username ? `\n🔒 Username: *${otpEntry.cm8Username}*` : ''
        await sendTelegramMessage(
          botToken,
          chatId,
          `✅ Nombor ini sudah didaftarkan.${usernameInfo}\n\n` +
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

    // ── User sent a PHOTO (screenshot verification) ──
    if (message.photo && message.photo.length > 0) {
      const store = getOtpStore()

      // Find entry awaiting screenshot for this chatId
      let otpEntry = null
      let otpKey = ''
      for (const [key, entry] of store) {
        if (entry.awaitingScreenshot && entry.telegramChatId === chatId) {
          otpEntry = entry
          otpKey = key
          break
        }
      }

      if (!otpEntry) {
        await sendTelegramMessage(
          botToken,
          chatId,
          `⚠️ Sila share contact anda terlebih dahulu sebelum hantar screenshot.\n\n` +
            `📱 Tekan butang *"Share Contact"* di bawah 👇`,
          true,
        )
        return NextResponse.json({ ok: true })
      }

      // Get the highest resolution photo
      const fileId = message.photo[message.photo.length - 1].file_id

      try {
        // Download photo from Telegram
        const imageBase64 = await downloadTelegramPhoto(botToken, fileId)

        // Send to Gemini Vision for analysis
        const result = await extractCM8Username(imageBase64)

        if (result.error === 'NOT_CM8') {
          await sendTelegramMessage(
            botToken,
            chatId,
            `❌ *Screenshot tidak sah*\n\n` +
              `Logo CM8 tidak dikesan dalam gambar. Sila hantar screenshot dari *app CM8* yang menunjukkan:\n\n` +
              `1️⃣ Logo *CM8*\n` +
              `2️⃣ *Username* anda\n\n` +
              `📸 _Cuba lagi — hantar screenshot sekarang._`,
          )
          return NextResponse.json({ ok: true })
        }

        if (result.error === 'NO_USERNAME') {
          await sendTelegramMessage(
            botToken,
            chatId,
            `⚠️ *Username tidak dikesan*\n\n` +
              `Kami nampak logo CM8 tetapi username tidak jelas. Sila pastikan:\n\n` +
              `✅ Screenshot menunjukkan *halaman utama* app\n` +
              `✅ Username *jelas kelihatan*\n\n` +
              `📸 _Hantar semula screenshot anda._`,
          )
          return NextResponse.json({ ok: true })
        }

        if (result.username) {
          // Success! Save username and send OTP
          otpEntry.cm8Username = result.username
          otpEntry.awaitingScreenshot = false
          store.set(otpKey, otpEntry)

          await sendTelegramMessage(
            botToken,
            chatId,
            `🎉 *Pengesahan berjaya!*\n\n` +
              `🔒 Username CM8: *${result.username}*\n\n` +
              `🔐 Kod OTP anda: \`${otpEntry.otp}\`\n\n` +
              `⏱️ Kod ini akan tamat dalam 5 minit.\n\n` +
              `📋 *Langkah seterusnya:*\n` +
              `1️⃣ Masukkan kod OTP di website\n` +
              `2️⃣ Join group kami: ${GROUP_LINK}\n\n` +
              `🛡️ _CM8 VVIP — AI Scanner Percuma_`,
          )
        }
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : String(err)
        console.error('[BOT-WEBHOOK] AI Vision error:', errMsg)

        let userMessage = `⚠️ Ralat semasa memproses gambar.`

        if (errMsg.includes('GROQ_API_KEY')) {
          userMessage = `⚠️ Sistem AI tidak dikonfigurasi. Sila hubungi admin.`
          console.error('[BOT-WEBHOOK] GROQ_API_KEY is missing from env!')
        } else if (errMsg.includes('Could not get file path')) {
          userMessage = `⚠️ Tidak dapat memuat turun gambar dari Telegram. Sila cuba hantar semula screenshot anda.`
        } else if (errMsg.includes('Groq API error')) {
          userMessage = `⚠️ Perkhidmatan AI sedang sibuk. Sila cuba lagi dalam beberapa saat.`
          console.error('[BOT-WEBHOOK] Groq API returned error:', errMsg)
        } else {
          userMessage = `⚠️ Ralat semasa memproses gambar. Sila cuba hantar semula screenshot anda.`
        }

        await sendTelegramMessage(botToken, chatId, userMessage)
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
      true,
    )

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[BOT-WEBHOOK] Error:', err)
    return NextResponse.json({ ok: true })
  }
}

/* ── Download photo from Telegram ───────────────────────────── */
async function downloadTelegramPhoto(botToken: string, fileId: string): Promise<string> {
  // Get file path
  const fileRes = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`)
  const fileData = await fileRes.json()
  const filePath = fileData.result?.file_path

  if (!filePath) throw new Error('Could not get file path')

  // Download file
  const downloadUrl = `https://api.telegram.org/file/bot${botToken}/${filePath}`
  const imgRes = await fetch(downloadUrl)
  const buffer = Buffer.from(await imgRes.arrayBuffer())

  return buffer.toString('base64')
}

/* ── Extract CM8 username using Groq Vision AI ─────────────── */
async function extractCM8Username(
  imageBase64: string,
): Promise<{ username?: string; error?: string }> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) throw new Error('GROQ_API_KEY not configured')

  const prompt = `Analyze this screenshot from a mobile casino/gaming app. Your task:

1. FIRST check if you can see the "CM8" logo or branding anywhere in the screenshot. Look for text like "CM8", "CM8 x", the CM8 logo, or any CM8-related branding.

2. If CM8 branding is NOT found, respond with exactly: NOT_CM8

3. If CM8 branding IS found, look for the player username. The username is typically displayed near the top of the screen, often next to a VIP badge or level indicator. It is usually a short text string (like "cyberslot", "player123", etc.)

4. If you find the username, respond with ONLY the username text — nothing else. No quotes, no explanation.

5. If you see CM8 branding but cannot identify the username clearly, respond with exactly: NO_USERNAME

IMPORTANT: Respond with ONLY one of these:
- The username (just the text)
- NOT_CM8
- NO_USERNAME`

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
              },
            },
          ],
        },
      ],
      max_tokens: 50,
      temperature: 0,
    }),
  })

  if (!response.ok) {
    const errText = await response.text()
    console.error('[GROQ] API error:', errText)
    throw new Error(`Groq API error: ${response.status}`)
  }

  const data = await response.json()
  const text = data.choices?.[0]?.message?.content?.trim() || ''

  console.log(`[GROQ] Vision result: "${text}"`)

  if (text === 'NOT_CM8') {
    return { error: 'NOT_CM8' }
  }

  if (text === 'NO_USERNAME') {
    return { error: 'NO_USERNAME' }
  }

  // Clean up the username — remove quotes, whitespace, etc.
  const username = text.replace(/['"]/g, '').trim()

  if (!username || username.length < 2 || username.length > 30) {
    return { error: 'NO_USERNAME' }
  }

  return { username }
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

/* ── Check if user is a member of the official group ────────── */
async function checkGroupMembership(botToken: string, userId: number): Promise<boolean> {
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${botToken}/getChatMember?chat_id=${GROUP_ID}&user_id=${userId}`,
    )
    const data = await res.json()
    if (data.ok && data.result) {
      const status = data.result.status
      if (['creator', 'administrator', 'member', 'restricted'].includes(status)) {
        return true
      }
    }
    return false
  } catch (err) {
    console.error('[BOT-WEBHOOK] Error checking group membership', err)
    return false
  }
}
