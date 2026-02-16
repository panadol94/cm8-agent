import { NextRequest, NextResponse } from 'next/server'

/* ================================================================
   In-memory chat store — Premium Edition
   Supports text, image, and voice messages.
   ================================================================ */

interface ChatMessage {
  id: string
  name: string
  avatar: string
  text: string
  type: 'text' | 'image' | 'voice'
  media?: string // base64 data URL for image/voice
  duration?: number // voice duration in seconds
  timestamp: number
  isAdmin?: boolean
}

interface OnlineUser {
  id: string
  name: string
  avatar: string
  lastSeen: number
}

declare global {
  var __chatMessages: ChatMessage[] | undefined
  var __chatOnlineUsers: Map<string, OnlineUser> | undefined
}

const MAX_MESSAGES = 200
const ONLINE_TIMEOUT = 30_000

function getMessages(): ChatMessage[] {
  if (!global.__chatMessages) global.__chatMessages = []
  return global.__chatMessages
}

function getOnlineUsers(): Map<string, OnlineUser> {
  if (!global.__chatOnlineUsers) global.__chatOnlineUsers = new Map()
  return global.__chatOnlineUsers
}

function pruneOffline() {
  const now = Date.now()
  const users = getOnlineUsers()
  for (const [id, u] of users) {
    if (now - u.lastSeen > ONLINE_TIMEOUT) users.delete(id)
  }
}

/* ── GET /api/chat?after=<timestamp> ────────────────────────── */
export async function GET(req: NextRequest) {
  const after = Number(req.nextUrl.searchParams.get('after') || '0')
  const msgs = getMessages()

  pruneOffline()
  const users = getOnlineUsers()

  const newMessages = after ? msgs.filter((m) => m.timestamp > after) : msgs.slice(-50)

  return NextResponse.json({
    messages: newMessages,
    onlineCount: users.size,
    onlineUsers: Array.from(users.values()).map((u) => ({
      id: u.id,
      name: u.name,
      avatar: u.avatar,
    })),
  })
}

/* ── POST /api/chat ─────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, name, avatar, text, type, media, duration } = body

    if (!name || !userId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const msgType = type || 'text'

    // Validate based on type
    if (msgType === 'text' && !text) {
      return NextResponse.json({ error: 'Missing text' }, { status: 400 })
    }
    if ((msgType === 'image' || msgType === 'voice') && !media) {
      return NextResponse.json({ error: 'Missing media' }, { status: 400 })
    }

    const msgs = getMessages()

    const msg: ChatMessage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: String(name).slice(0, 30),
      avatar: String(avatar || ''),
      text: msgType === 'text' ? String(text).slice(0, 500) : '',
      type: msgType,
      media: media ? String(media) : undefined,
      duration: duration ? Number(duration) : undefined,
      timestamp: Date.now(),
      isAdmin: false,
    }

    msgs.push(msg)
    if (msgs.length > MAX_MESSAGES) msgs.splice(0, msgs.length - MAX_MESSAGES)

    const users = getOnlineUsers()
    users.set(userId, {
      id: userId,
      name: msg.name,
      avatar: msg.avatar,
      lastSeen: Date.now(),
    })

    return NextResponse.json({ success: true, message: msg })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
