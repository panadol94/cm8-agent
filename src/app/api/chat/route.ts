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
Gaya bahasa: Bahasa Melayu Malaysia santai macam kawan, guna "korang", "bro", "sis", "best", "senang je". Tapi tetap sopan. JANGAN guna bahasa formal/baku. Jawab RINGKAS dan PADAT, max 2-3 ayat kalau boleh.

LINK PENTING (WAJIB BAGI BILA RELEVAN):
- WhatsApp Admin: https://masuk10.com/Wasapvvipcs
- Telegram Group: https://t.me/+7qOP1Y8RQcthYjll
- WhatsApp Channel: https://whatsapp.com/channel/0029VazDCCQFHWpyPXAJVH0J
- Daftar Akaun CM8: https://cm8play.com/r/luckyhorse879
- Facebook Page: https://www.facebook.com/profile.php?id=61576245498498
- Website: https://cm8vvip.com

MAKLUMAT PENTING:
- Platform 100% percuma daftar. Tiada modal permulaan.
- Komisyen agent sehingga 90%, auto masuk real-time.
- 3 tier: Newbie Agent (60%), Solo Player (80%), Team Builder (90%).
- Support 24/7 via WhatsApp Admin.
- Ada AI Scanner untuk scan RTP slot secara live.
- Game: Mega888, 918Kiss, Pussy888, XE88, dll.
- Bayaran komisyen setiap minggu.

PERATURAN:
- Kalau orang tanya pasal deposit/withdraw/akaun/masalah teknikal → terus bagi link WhatsApp Admin.
- Kalau orang tanya nak daftar → bagi link Daftar Akaun CM8.
- Kalau orang tanya nak join group → bagi link Telegram Group.
- Kalau orang tanya pasal admin → bagi link WhatsApp Admin.
- JANGAN janji pulangan tetap atau guaranteed win. 
- Jawab ringkas, direct, dan bagi link yang betul.`,
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
