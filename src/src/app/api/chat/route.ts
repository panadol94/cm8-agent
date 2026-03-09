import { NextRequest, NextResponse } from 'next/server'

/* ================================================================
   Group Chat API — In-memory message store
   GET  /api/chat?after=<timestamp>  → fetch new messages
   POST /api/chat { userId, name, avatar, text, type, media, duration }
   ================================================================ */

interface ChatMessage {
  id: string
  name: string
  avatar: string
  text: string
  type: 'text' | 'image' | 'voice'
  media?: string
  duration?: number
  timestamp: number
  isAdmin?: boolean
}

interface OnlineUser {
  id: string
  name: string
  avatar: string
  lastSeen: number
}

/* ── Global in-memory stores (shared across hot-reloads in dev) ── */
declare global {
  var __chatMessages: ChatMessage[] | undefined
  var __chatOnlineUsers: Map<string, OnlineUser> | undefined
}

function getMessages(): ChatMessage[] {
  if (!global.__chatMessages) {
    global.__chatMessages = []
  }
  return global.__chatMessages
}

function getOnlineUsers(): Map<string, OnlineUser> {
  if (!global.__chatOnlineUsers) {
    global.__chatOnlineUsers = new Map()
  }
  return global.__chatOnlineUsers
}

const ONLINE_TIMEOUT = 30_000
const MAX_MESSAGES = 500

function pruneOffline(users: Map<string, OnlineUser>) {
  const now = Date.now()
  for (const [id, u] of users) {
    if (now - u.lastSeen > ONLINE_TIMEOUT) users.delete(id)
  }
}

/* ── GET /api/chat?after=<timestamp> ─────────────────────────── */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const after = parseInt(searchParams.get('after') || '0', 10)

    const messages = getMessages()
    const users = getOnlineUsers()
    pruneOffline(users)

    // Return messages newer than the given timestamp
    const newMessages = messages.filter((m) => m.timestamp > after)

    return NextResponse.json({
      messages: newMessages,
      onlineCount: users.size,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

/* ── POST /api/chat ──────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, name, avatar, text, type, media, duration } = body

    if (!userId || !name) {
      return NextResponse.json({ error: 'Missing userId or name' }, { status: 400 })
    }

    if (!type || !['text', 'image', 'voice'].includes(type)) {
      return NextResponse.json({ error: 'Invalid message type' }, { status: 400 })
    }

    // Validate text for text messages
    if (type === 'text' && (!text || !text.trim())) {
      return NextResponse.json({ error: 'Empty text message' }, { status: 400 })
    }

    // Validate media for image/voice messages
    if ((type === 'image' || type === 'voice') && !media) {
      return NextResponse.json({ error: 'Missing media data' }, { status: 400 })
    }

    const messages = getMessages()
    const users = getOnlineUsers()

    // Create the message
    const message: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: String(name).slice(0, 30),
      avatar: String(avatar || ''),
      text: type === 'text' ? String(text).slice(0, 500) : '',
      type,
      timestamp: Date.now(),
    }

    if (media) message.media = media
    if (duration !== undefined) message.duration = Number(duration)

    // Add message to store
    messages.push(message)

    // Keep only last MAX_MESSAGES
    if (messages.length > MAX_MESSAGES) {
      global.__chatMessages = messages.slice(-MAX_MESSAGES)
    }

    // Update online status for sender
    users.set(userId, {
      id: userId,
      name: message.name,
      avatar: message.avatar,
      lastSeen: Date.now(),
    })
    pruneOffline(users)

    return NextResponse.json({
      success: true,
      message,
      onlineCount: users.size,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
