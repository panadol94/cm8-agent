/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'

/* ────────────────────────────────────────────────────────────────
   Avatar presets
   ──────────────────────────────────────────────────────────────── */
const AVATAR_PRESETS = [
  '😎',
  '🦊',
  '🐯',
  '🦁',
  '🐸',
  '🐼',
  '🦄',
  '🐲',
  '🦅',
  '🐺',
  '🐱',
  '👽',
  '🤖',
  '👑',
  '💎',
  '🔥',
  '⚡',
  '🌟',
]

/* ────────────────────────────────────────────────────────────────
   Types
   ──────────────────────────────────────────────────────────────── */
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

interface UserProfile {
  userId: string
  name: string
  avatar: string
  avatarType: 'preset' | 'upload'
}

/* ────────────────────────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────────────────────────── */
function genId() {
  return 'u-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}
function loadProfile(): UserProfile | null {
  try {
    const r = localStorage.getItem('cm8_chat_profile')
    return r ? JSON.parse(r) : null
  } catch {
    return null
  }
}
function saveProfile(p: UserProfile) {
  localStorage.setItem('cm8_chat_profile', JSON.stringify(p))
}
function fmtTime(ts: number) {
  return new Date(ts).toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' })
}
function fmtDuration(s: number) {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

/* compress image client‑side */
function compressImage(file: File, maxW = 800, quality = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const canvas = document.createElement('canvas')
      let w = img.width,
        h = img.height
      if (w > maxW) {
        h = (maxW / w) * h
        w = maxW
      }
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, w, h)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', quality))
    }
    img.onerror = reject
    img.src = url
  })
}

/* ================================================================
   COMPONENT
   ================================================================ */
export default function ChatPage() {
  /* ── State ── */
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [showSetup, setShowSetup] = useState(true)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [onlineCount, setOnlineCount] = useState(0)
  const [inputText, setInputText] = useState('')
  const [sending, setSending] = useState(false)
  const [showAttach, setShowAttach] = useState(false)
  const lastTs = useRef(0)
  const endRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const atBottom = useRef(true)

  /* voice recording */
  const [isRecording, setIsRecording] = useState(false)
  const [recordTime, setRecordTime] = useState(0)
  const mediaRec = useRef<MediaRecorder | null>(null)
  const audioChunks = useRef<Blob[]>([])
  const recTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  /* setup form */
  const [sName, setSName] = useState('')
  const [sAvatar, setSAvatar] = useState(AVATAR_PRESETS[0])
  const [sAvatarType, setSAvatarType] = useState<'preset' | 'upload'>('preset')
  const [uploadPrev, setUploadPrev] = useState<string | null>(null)

  /* ── Init ── */
  useEffect(() => {
    const saved = loadProfile()
    if (saved) {
      setProfile(saved)
      setShowSetup(false)
    }
  }, [])

  /* ── Scroll ── */
  const scrollBottom = useCallback(() => {
    if (atBottom.current) endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])
  const onScroll = () => {
    const el = bodyRef.current
    if (!el) return
    atBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 100
  }

  /* ── Polling ── */
  useEffect(() => {
    if (!profile) return
    const poll = async () => {
      try {
        const r = await fetch(`/api/chat?after=${lastTs.current}`)
        const d = await r.json()
        if (d.messages?.length) {
          setMessages((prev) => {
            const ids = new Set(prev.map((m) => m.id))
            const nw = d.messages.filter((m: ChatMessage) => !ids.has(m.id))
            if (!nw.length) return prev
            const merged = [...prev, ...nw].slice(-200)
            lastTs.current = Math.max(...merged.map((m: ChatMessage) => m.timestamp))
            return merged
          })
          setTimeout(scrollBottom, 60)
        }
        setOnlineCount(d.onlineCount || 0)
      } catch {
        /* silent */
      }
    }
    poll()
    const iv = setInterval(poll, 2000)
    return () => clearInterval(iv)
  }, [profile, scrollBottom])

  /* ── Heartbeat ── */
  useEffect(() => {
    if (!profile) return
    const beat = () => {
      fetch('/api/chat/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: profile.userId,
          name: profile.name,
          avatar: profile.avatar,
        }),
      }).catch(() => {})
    }
    beat()
    const iv = setInterval(beat, 10_000)
    return () => clearInterval(iv)
  }, [profile])

  /* ── Send functions ── */
  const sendMsg = async (payload: Record<string, unknown>) => {
    if (!profile || sending) return
    setSending(true)
    try {
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: profile.userId,
          name: profile.name,
          avatar: profile.avatar,
          ...payload,
        }),
      })
      const d = await r.json()
      if (d.success && d.message) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === d.message.id)) return prev
          return [...prev, d.message].slice(-200)
        })
        lastTs.current = d.message.timestamp
        atBottom.current = true
        setTimeout(scrollBottom, 60)
      }
    } catch {
      /* silent */
    }
    setSending(false)
  }

  const handleSendText = async () => {
    if (!inputText.trim()) return
    const t = inputText.trim()
    setInputText('')
    await sendMsg({ text: t, type: 'text' })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendText()
    }
  }

  /* ── Image Upload ── */
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setShowAttach(false)
    if (!file.type.startsWith('image/')) {
      alert('Sila pilih fail gambar sahaja.')
      return
    }
    if (file.size > 5_000_000) {
      alert('Gambar terlalu besar (max 5MB).')
      return
    }
    try {
      const compressed = await compressImage(file)
      await sendMsg({ type: 'image', media: compressed, text: '' })
    } catch {
      alert('Gagal memproses gambar.')
    }
    e.target.value = ''
  }

  /* ── Voice Recording ── */
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const rec = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      audioChunks.current = []
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.current.push(e.data)
      }
      rec.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop())
        const blob = new Blob(audioChunks.current, { type: 'audio/webm' })
        const reader = new FileReader()
        reader.onload = async () => {
          const base64 = reader.result as string
          await sendMsg({ type: 'voice', media: base64, duration: recordTime, text: '' })
        }
        reader.readAsDataURL(blob)
      }
      rec.start()
      mediaRec.current = rec
      setIsRecording(true)
      setRecordTime(0)
      recTimer.current = setInterval(() => setRecordTime((p) => p + 1), 1000)
      setShowAttach(false)
    } catch {
      alert('Tidak dapat akses mikrofon. Sila beri kebenaran.')
    }
  }

  const stopRecording = () => {
    if (mediaRec.current && mediaRec.current.state !== 'inactive') {
      mediaRec.current.stop()
    }
    setIsRecording(false)
    if (recTimer.current) {
      clearInterval(recTimer.current)
      recTimer.current = null
    }
  }

  const cancelRecording = () => {
    if (mediaRec.current && mediaRec.current.state !== 'inactive') {
      mediaRec.current.ondataavailable = null
      mediaRec.current.onstop = null
      mediaRec.current.stop()
      mediaRec.current.stream.getTracks().forEach((t) => t.stop())
    }
    setIsRecording(false)
    setRecordTime(0)
    audioChunks.current = []
    if (recTimer.current) {
      clearInterval(recTimer.current)
      recTimer.current = null
    }
  }

  /* ── Profile setup ── */
  const handleSetup = () => {
    if (!sName.trim()) return
    const p: UserProfile = {
      userId: loadProfile()?.userId || genId(),
      name: sName.trim(),
      avatar: sAvatarType === 'upload' && uploadPrev ? uploadPrev : sAvatar,
      avatarType: sAvatarType,
    }
    saveProfile(p)
    setProfile(p)
    setShowSetup(false)
  }
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (f.size > 500_000) {
      alert('Max 500KB.')
      return
    }
    const r = new FileReader()
    r.onload = (ev) => {
      setUploadPrev(ev.target?.result as string)
      setSAvatarType('upload')
    }
    r.readAsDataURL(f)
  }
  const handleChangeProfile = () => {
    if (profile) {
      setSName(profile.name)
      setSAvatar(profile.avatarType === 'preset' ? profile.avatar : AVATAR_PRESETS[0])
      if (profile.avatarType === 'upload') {
        setUploadPrev(profile.avatar)
        setSAvatarType('upload')
      }
    }
    setShowSetup(true)
  }

  /* ══════════════════════════════════════════════════════════════
     RENDER: PROFILE SETUP
     ══════════════════════════════════════════════════════════════ */
  if (showSetup) {
    return (
      <div className="prem-setup-page">
        <div className="prem-setup-bg-orbs">
          <div className="prem-orb prem-orb-1" />
          <div className="prem-orb prem-orb-2" />
          <div className="prem-orb prem-orb-3" />
        </div>
        <div className="prem-setup-card">
          <div className="prem-setup-glow" />
          <div className="prem-setup-header">
            <div className="prem-setup-logo">💬</div>
            <h2>CM8 Chat</h2>
            <p>Setup profil anda untuk mula sembang</p>
          </div>

          <div className="prem-field">
            <label>Nama Anda</label>
            <input
              type="text"
              placeholder="Contoh: Ali"
              value={sName}
              onChange={(e) => setSName(e.target.value)}
              maxLength={30}
              className="prem-input"
              autoFocus
            />
          </div>

          <div className="prem-field">
            <label>Gambar Profil</label>
            <div className="prem-avatar-preview-wrap">
              <div className="prem-avatar-preview-ring">
                {sAvatarType === 'upload' && uploadPrev ? (
                  <img src={uploadPrev} alt="" className="prem-avatar-prev-img" />
                ) : (
                  <span className="prem-avatar-prev-emoji">{sAvatar}</span>
                )}
              </div>
            </div>
          </div>

          <div className="prem-avatar-grid">
            {AVATAR_PRESETS.map((av) => (
              <button
                key={av}
                className={`prem-av-opt ${sAvatarType === 'preset' && sAvatar === av ? 'active' : ''}`}
                onClick={() => {
                  setSAvatar(av)
                  setSAvatarType('preset')
                  setUploadPrev(null)
                }}
              >
                {av}
              </button>
            ))}
          </div>

          <div className="prem-upload-row">
            <label className="prem-upload-btn">
              📷 Upload Gambar
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                style={{ display: 'none' }}
              />
            </label>
            {uploadPrev && <span className="prem-upload-ok">✅</span>}
          </div>

          <button className="prem-join-btn" onClick={handleSetup} disabled={!sName.trim()}>
            <span className="prem-join-shine" />
            🚀 Masuk Chat Room
          </button>
        </div>
      </div>
    )
  }

  /* ══════════════════════════════════════════════════════════════
     RENDER: CHAT ROOM
     ══════════════════════════════════════════════════════════════ */
  return (
    <div className="prem-chat">
      {/* ── Header ── */}
      <div className="prem-chat-header">
        <div className="prem-chat-header-left">
          <div className="prem-chat-icon">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient
                  id="chatBg"
                  x1="0"
                  y1="0"
                  x2="40"
                  y2="40"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#1a1a2e" />
                  <stop offset="100%" stopColor="#16213e" />
                </linearGradient>
                <linearGradient
                  id="chatAccent"
                  x1="8"
                  y1="8"
                  x2="32"
                  y2="32"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#ffaa33" />
                  <stop offset="100%" stopColor="#ff6b4a" />
                </linearGradient>
              </defs>
              <circle cx="20" cy="20" r="19" fill="url(#chatBg)" />
              <circle
                cx="20"
                cy="20"
                r="19"
                stroke="url(#chatAccent)"
                strokeWidth="1"
                opacity="0.5"
              />
              <path
                d="M12 16C12 13.8 13.8 12 16 12H24C26.2 12 28 13.8 28 16V22C28 24.2 26.2 26 24 26H18L14 29V26H16C13.8 26 12 24.2 12 22V16Z"
                stroke="url(#chatAccent)"
                strokeWidth="2"
                fill="none"
                strokeLinejoin="round"
              />
              <circle cx="17" cy="19" r="1.2" fill="url(#chatAccent)" />
              <circle cx="20" cy="19" r="1.2" fill="url(#chatAccent)" />
              <circle cx="23" cy="19" r="1.2" fill="url(#chatAccent)" />
            </svg>
          </div>
          <div className="prem-chat-title-wrap">
            <h2>CM8 Chat</h2>
            <span className="prem-chat-subtitle">
              <span className="prem-chat-sub-dot" />
              Komuniti Agent
            </span>
          </div>
          <div className="prem-online-pill">
            <span className="prem-online-dot" />
            <span>{onlineCount} online</span>
          </div>
        </div>
        <button className="prem-profile-btn" onClick={handleChangeProfile} title="Tukar profil">
          {profile?.avatarType === 'upload' && profile.avatar.startsWith('data:') ? (
            <img src={profile.avatar} alt="" className="prem-profile-img" />
          ) : (
            <span>{profile?.avatar}</span>
          )}
        </button>
      </div>

      {/* ── Messages ── */}
      <div className="prem-chat-body" ref={bodyRef} onScroll={onScroll}>
        {messages.length === 0 && (
          <div className="prem-empty">
            <div className="prem-empty-icon">💬</div>
            <p>Belum ada mesej.</p>
            <span>Jadi yang pertama hantar mesej!</span>
          </div>
        )}

        {messages.map((msg) => {
          const isMe = msg.name === profile?.name
          return (
            <div
              key={msg.id}
              className={`prem-msg ${isMe ? 'prem-msg-me' : ''} ${msg.isAdmin ? 'prem-msg-admin' : ''}`}
            >
              <div className="prem-msg-av">
                {msg.avatar.startsWith('data:') ? (
                  <img src={msg.avatar} alt="" className="prem-msg-av-img" />
                ) : (
                  <span className="prem-msg-av-emoji">{msg.avatar || '👤'}</span>
                )}
              </div>
              <div className="prem-msg-bubble">
                <div className="prem-msg-top">
                  <span className="prem-msg-name">
                    {msg.isAdmin && <span className="prem-admin-crown">👑</span>}
                    {msg.name}
                  </span>
                  <span className="prem-msg-time">{fmtTime(msg.timestamp)}</span>
                </div>

                {/* TEXT */}
                {msg.type === 'text' && <div className="prem-msg-text">{msg.text}</div>}

                {/* IMAGE */}
                {msg.type === 'image' && msg.media && (
                  <div className="prem-msg-img-wrap">
                    <img
                      src={msg.media}
                      alt="shared"
                      className="prem-msg-img"
                      onClick={() => window.open(msg.media, '_blank')}
                    />
                  </div>
                )}

                {/* VOICE */}
                {msg.type === 'voice' && msg.media && (
                  <VoicePlayer src={msg.media} duration={msg.duration || 0} isMe={isMe} />
                )}
              </div>
            </div>
          )
        })}
        <div ref={endRef} />
      </div>

      {/* ── Recording bar ── */}
      {isRecording && (
        <div className="prem-rec-bar">
          <div className="prem-rec-pulse" />
          <span className="prem-rec-time">🎙️ {fmtDuration(recordTime)}</span>
          <div className="prem-rec-wave">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="prem-wave-bar" style={{ animationDelay: `${i * 0.08}s` }} />
            ))}
          </div>
          <button className="prem-rec-cancel" onClick={cancelRecording}>
            ✕
          </button>
          <button className="prem-rec-send" onClick={stopRecording}>
            ➤
          </button>
        </div>
      )}

      {/* ── Input bar ── */}
      {!isRecording && (
        <div className="prem-input-bar">
          {/* Attach menu */}
          <div className="prem-attach-wrap">
            <button className="prem-attach-btn" onClick={() => setShowAttach(!showAttach)}>
              {showAttach ? '✕' : '+'}
            </button>
            {showAttach && (
              <div className="prem-attach-menu">
                <label className="prem-attach-opt">
                  <span className="prem-attach-icon">🖼️</span>
                  <span>Gambar</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </label>
                <button
                  className="prem-attach-opt"
                  onClick={() => {
                    startRecording()
                    setShowAttach(false)
                  }}
                >
                  <span className="prem-attach-icon">🎙️</span>
                  <span>Suara</span>
                </button>
              </div>
            )}
          </div>

          <input
            type="text"
            className="prem-text-input"
            placeholder="Taip mesej..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={500}
          />

          {inputText.trim() ? (
            <button className="prem-send-btn" onClick={handleSendText} disabled={sending}>
              <span className="prem-send-icon">{sending ? '⏳' : '➤'}</span>
            </button>
          ) : (
            <button className="prem-mic-btn" onClick={startRecording}>
              🎙️
            </button>
          )}
        </div>
      )}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   Voice Player Sub-component
   ════════════════════════════════════════════════════════════════ */
function VoicePlayer({ src, duration, isMe }: { src: string; duration: number; isMe: boolean }) {
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const rafRef = useRef<number>(0)

  const toggle = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(src)
      audioRef.current.onended = () => {
        setPlaying(false)
        setProgress(0)
      }
    }
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
      cancelAnimationFrame(rafRef.current)
    } else {
      audioRef.current.play()
      setPlaying(true)
      const update = () => {
        if (audioRef.current) {
          setProgress((audioRef.current.currentTime / (audioRef.current.duration || 1)) * 100)
        }
        rafRef.current = requestAnimationFrame(update)
      }
      update()
    }
  }

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current)
      audioRef.current?.pause()
    }
  }, [])

  return (
    <div className={`prem-voice ${isMe ? 'prem-voice-me' : ''}`}>
      <button className="prem-voice-play" onClick={toggle}>
        {playing ? '⏸' : '▶'}
      </button>
      <div className="prem-voice-track">
        <div className="prem-voice-bars">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="prem-vbar" style={{ height: `${20 + Math.random() * 80}%` }} />
          ))}
        </div>
        <div className="prem-voice-progress" style={{ width: `${progress}%` }} />
      </div>
      <span className="prem-voice-dur">{fmtDuration(duration)}</span>
    </div>
  )
}
