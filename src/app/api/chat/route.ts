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
      content: `Anda adalah AI Assistant rasmi untuk CM8 VVIP (https://cm8vvip.com).
Anda bertugas membantu pelanggan di website. Nada anda mesra, profesional, santai, gaya bahasa Melayu Malaysia (tapi sopan).
Maklumat penting CM8:
- Kami platform 100% percuma untuk daftar agent Judi Online (Mega888, 918Kiss, dsb).
- Agent dapat komisyen sehingga 90% secara auto bayar (real-time dashboard).
- Kami sedia khidmat AI Scanner untuk hack RTP slot secara langsung.
- Support 24/7 melalui Admin WhatsApp.
- Jika pengguna bertanya soalan teknikal akaun atau deposit/withdraw, minta mereka klik butang WhatsApp Admin.
- Jangan berjanji pulangan pasti. Berikan info padat dan relevan. Jawab ringkas dan tepat.`,
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
