import { NextRequest, NextResponse } from 'next/server'

/* ================================================================
   Heartbeat endpoint — keeps user "online" status fresh.
   Called every 10s from the chat client.
   ================================================================ */

interface OnlineUser {
  id: string
  name: string
  avatar: string
  lastSeen: number
}

// We import the same map via a shared module trick — but since Next.js
// API routes in the same process share the module cache, we reference
// the store from the parent route file indirectly.
// For simplicity, we maintain a separate reference here that is
// synchronized via the chat route's onlineUsers map.
// In practice both route files run in the same Node process so we
// can use a global store.

declare global {
  var __chatOnlineUsers: Map<string, OnlineUser> | undefined
}

function getOnlineUsers(): Map<string, OnlineUser> {
  if (!global.__chatOnlineUsers) {
    global.__chatOnlineUsers = new Map()
  }
  return global.__chatOnlineUsers
}

const ONLINE_TIMEOUT = 30_000

function pruneOffline(users: Map<string, OnlineUser>) {
  const now = Date.now()
  for (const [id, u] of users) {
    if (now - u.lastSeen > ONLINE_TIMEOUT) users.delete(id)
  }
}

/* ── POST /api/chat/heartbeat { userId, name, avatar } ──────── */
export async function POST(req: NextRequest) {
  try {
    const { userId, name, avatar } = await req.json()
    if (!userId || !name) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const users = getOnlineUsers()
    users.set(userId, {
      id: userId,
      name: String(name).slice(0, 30),
      avatar: String(avatar || ''),
      lastSeen: Date.now(),
    })

    pruneOffline(users)

    return NextResponse.json({
      onlineCount: users.size,
      onlineUsers: Array.from(users.values()).map((u) => ({
        id: u.id,
        name: u.name,
        avatar: u.avatar,
      })),
    })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
