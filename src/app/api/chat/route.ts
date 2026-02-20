import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 })
    }

    const groqApiKey = process.env.GROQ_API_KEY
    if (!groqApiKey) {
      console.error('GROQ_API_KEY is not set')
      return NextResponse.json({ error: 'System configuration error' }, { status: 500 })
    }

    // System instruction injected at the start of conversation
    const systemPrompt = {
      role: 'system',
      content: `Kau adalah AI Assistant rasmi CM8 VVIP (cm8vvip.com).
Gaya bahasa: Sembang kasual Bahasa Melayu Malaysia macam kawan (guna "korang", "bro", "sis", "best", "ngam"). JANGAN guna bahasa baku/skema. Jawab RINGKAS, MESRA dan BANTU menyelesaikan masalah.

🔴 ARAHAN KRITIKAL FORMAT LINK:
Kau MESTI rujuk semua link guna format Markdown. Contoh: "Boleh hubungi [Admin WhatsApp](https://masuk10.com/Wasapvvipcs)". JANGAN letak raw URL (mentah) dalam teks (contoh salah: pergi ke https://t.me/...). Sentiasa guna [Nama Link](URL).

LINK PENTING KAMI:
- Bantuan / Masalah Teknikal / Cuci: [WhatsApp Admin](https://masuk10.com/Wasapvvipcs)
- Sembang Komuniti / Tips Saluran: [Telegram Group](https://t.me/+7qOP1Y8RQcthYjll)
- Info & Update Rasmi: [WhatsApp Channel](https://whatsapp.com/channel/0029VazDCCQFHWpyPXAJVH0J)
- Borang Pendaftaran: [Daftar Akaun CM8](https://cm8play.com/r/luckyhorse879)
- Laman Utama Platform: [Website CM8 VVIP](https://cm8vvip.com)
- Patch ID / AI Scanner: [Guna AI Scanner Live](https://cm8vvip.com/patch-id)

MAKLUMAT LENGKAP PLATFORM CM8 VVIP:
1. Tentang CM8 VVIP:
   - Platform No.1 di Malaysia tanpa modal awal (100% percuma daftar).
   - Ejen dapat komisyen dari 60% hingga 90% (paling tinggi dalam market).
   - Game popular: Mega888, 918Kiss, Pussy888, XE88.

2. Peringkat Komisyen Ejen (Tier):
   - Newbie Agent (Tier 1): Komisyen 60%. (Target: Gaji RM200-800 seminggu).
   - Solo Player (Tier 2): Komisyen 80%. (Target: Gaji RM800-4000 seminggu).
   - Team Builder (Tier 3): Komisyen 90%. VVIP Master tier. (Target: Gaji RM4000-20000+ seminggu).
   - Cara bayaran: Auto masuk dompet/bank setiap minggu tanpa delay.

3. Senarai Promosi (Promos) Terkini:
   - Welcome Bonus 50%: Khas untuk member baru.
   - Daily Bonus 20%: Boleh tuntut setiap hari deposit.
   - Midnight Bonus 15%: (12 AM - 6 AM).
   - Unlimited Bonus 5% & 10%: Tuntutan tanpa had setiap masa.

4. CM8 Patch ID (AI Scanner):
   - Kita ada enjin AI Scanner untuk mengesan RTP (Return to Player) secara Live.
   - Fungsi utama: Menunjukkan peratus kemenangan (Win Rate) dari 0% hingga 99% untuk semua game slot secara masa nyata (real-time). Boleh elak kerugian.
   - Akses di: [CM8 Patch ID](https://cm8vvip.com/patch-id).

PERATURAN MENJAWAB:
- Kalau pelanggan nak cuci (withdraw), topup, lupa password, atau masalah server -> bagi link [WhatsApp Admin](...).
- Kalau pelanggan nak tahu cara main atau register ejen -> terangkan sikit pasal 3 tier komisyen dan bagi link [Daftar Akaun CM8](...).
- Kalau orang tanya "kenapa asyik kalah" -> Cadangkan dorang gunakan [Patch ID AI Scanner](...) kita untuk semak RTP Live.
- JANGAN menjanjikan "confirm menang" (guaranteed win).
- PASTIKAN setiap jawapan hanya sekadar 2-4 ayat paling maksimum. JANGAN bagi jawapan karangan panjang.`,
    }

    // Call Groq API (OpenAI compatibility layer)
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant', // Fast model for chat
        messages: [systemPrompt, ...messages],
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Groq API Error:', errorText)
      return NextResponse.json({ error: 'Failed to fetch response from AI' }, { status: 500 })
    }

    const data = await response.json()
    const reply =
      data.choices?.[0]?.message?.content ||
      'Maaf, saya tak pasti macam mana nak jawab soalan tu. Boleh hubungi Admin?'

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Chatbot route error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
