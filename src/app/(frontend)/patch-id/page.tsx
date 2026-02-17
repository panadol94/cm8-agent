'use client'

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import '../styles.css'
import './patch-id.css'
import { gameData, type GameInfo } from './gameData'
import RegisterGate from './RegisterGate'

/* ── Provider data ── */
const providers = [
  {
    id: 'mega888',
    name: 'Mega888',
    img: 'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F32%2F35335f26-6f54-4387-850a-d5590768b25a.jpg',
  },
  {
    id: '918kiss',
    name: 'Kiss918',
    img: 'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F27%2Fcf1330dc-23e2-434e-bd02-a5cf6f7ecf8d.jpg',
  },
  {
    id: 'jili',
    name: 'JILI',
    img: 'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F25%2Faece1da0-0722-4da1-b7d9-e300686f56ad.jpg',
  },
  {
    id: 'pragmatic',
    name: 'Pragmatic Play',
    img: 'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F47%2Fbefe333c-815a-43d7-884d-5a5bf5d5c4f0.jpg',
  },
  {
    id: 'bng',
    name: 'BNG',
    img: 'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F6%2Fdd712cac-8be0-4060-a12d-fd4c9cb41445.jpg',
  },
  {
    id: 'fc-slot',
    name: 'FC Slot',
    img: 'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F17%2F9a1b4279-3080-4255-aec9-a2279244136b.jpg',
  },
  {
    id: 'relax',
    name: 'Relax Gaming',
    img: 'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F84%2F8ab32348-a0a7-4bd5-a2a4-a27cbcf5d4cc.jpg',
  },
  {
    id: 'va-slot',
    name: 'VA Slot',
    img: 'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F62%2F1cd68978-2d66-4fb3-97da-a9ee5bb64119.jpg',
  },
  {
    id: 'spadegaming',
    name: 'Spade Gaming',
    img: 'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F95%2F3741cd4c-ade6-4323-9e4a-e70691722679.jpeg',
  },
  {
    id: 'acewin',
    name: 'Acewin Slot',
    img: 'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F3%2F2a32be39-d110-416f-9d45-a4e70cfd124f.jpg',
  },
  {
    id: 'nolimit',
    name: 'NoLimit City',
    img: 'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F37%2Febf9d79e-2be8-4440-828b-26b75dbc506f.jpg',
  },
  {
    id: 'hacksaw',
    name: 'Hacksaw',
    img: 'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F79%2Fd18411b6-519a-470f-8cdf-2442331ccf88.jpg',
  },
  {
    id: 'habanero',
    name: 'Habanero',
    img: 'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F89%2Fd22d30e6-3b31-46c9-bf4c-e671950d0402.jpg',
  },
  {
    id: 'jdb',
    name: 'JDB',
    img: 'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F80%2F20c33528-54e3-4069-a7dd-5ccc44cc6eda.jpg',
  },
  {
    id: 'playtech',
    name: 'Playtech',
    img: 'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F83%2F2ef04bd9-813c-4169-a397-a59dcb66e87e.jpg',
  },
  {
    id: 'betsoft',
    name: 'BetSoft',
    img: 'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F82%2Fcd27fe88-c13b-44bb-9b9c-b36b29166c3d.jpg',
  },
  // ── New providers (Feb 2026) ──
  {
    id: 'ap-slot',
    name: 'AP Gaming',
    img: 'https://images.cashmarket888.xyz/uploads%2Fslot_game%2Fimage_path%2F433%2F9b003918-d7d6-4633-9f0a-f1b1b852e519.png',
  },
  {
    id: 'gamzix',
    name: 'Gamzix',
    img: 'https://images.cashmarket888.xyz/uploads%2Fslot_game%2Fimage_path%2F294%2F02bf0736-db7b-4000-8f0e-d7d94beb50fa.png',
  },
  {
    id: 'gfg',
    name: 'GFG',
    img: 'https://images.cashmarket888.xyz/uploads%2Fslot_game%2Fimage_path%2F216%2Fa7d1e88d-ac1a-448d-be2d-68630eead005.png',
  },
  {
    id: 'pegasus',
    name: 'Pegasus',
    img: 'https://images.cashmarket888.xyz/uploads%2Fslot_game%2Fimage_path%2F644%2F306dc15a-3a40-46d4-a057-7183fa2a18ca.png',
  },
  {
    id: 'playson',
    name: 'Playson',
    img: 'https://images.cashmarket888.xyz/uploads%2Fslot_game%2Fimage_path%2F378%2F8bd1d24a-d539-4bd4-b2ef-81dd1d799e1f.png',
  },
  {
    id: 'rectangle',
    name: 'Rectangle',
    img: 'https://images.cashmarket888.xyz/uploads%2Fslot_game%2Fimage_path%2F485%2F4e480277-cb2c-42d3-8a1e-539a7b99426f.png',
  },
  {
    id: 'simpleplay',
    name: 'SimplePlay',
    img: 'https://images.cashmarket888.xyz/uploads%2Fslot_game%2Fimage_path%2F2011%2F736f2b41-9973-436e-a3e4-210d3b160478.png',
  },
  {
    id: 'uu-slot',
    name: 'UU Slot',
    img: 'https://images.cashmarket888.xyz/uploads%2Fslot_game%2Fimage_path%2F323%2F7dcff2ec-9af7-455c-8a6e-6853d07824cf.png',
  },
  {
    id: 'vplus',
    name: 'V Plus',
    img: 'https://images.cashmarket888.xyz/uploads%2Fslot_game%2Fimage_path%2F1507%2F4fdcd0c0-ccc5-494b-b537-abab9fc8a7e2.png',
  },
  {
    id: 'vpower',
    name: 'V Power',
    img: 'https://images.cashmarket888.xyz/uploads%2Fslot_game%2Fimage_path%2F1629%2F4ed85273-34d2-4a59-9834-b2e07a2451fc.jpg',
  },
  {
    id: 'wowgaming',
    name: 'WOW Gaming',
    img: 'https://images.cashmarket888.xyz/uploads%2Fslot_game%2Fimage_path%2F273%2F80d54715-b6c5-4abc-9cd7-093fbf72aacc.png',
  },
  {
    id: 'tgg',
    name: 'TGG',
    img: 'https://images.cashmarket888.xyz/uploads%2Fslot_game%2Fimage_path%2F644%2F306dc15a-3a40-46d4-a057-7183fa2a18ca.png',
  },
  {
    id: 'jilig',
    name: 'JILI Global',
    img: 'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F25%2Faece1da0-0722-4da1-b7d9-e300686f56ad.jpg',
  },
  {
    id: 'fastspin',
    name: 'Fastspin',
    img: 'https://images.cashmarket888.xyz/uploads%2Fslot_game%2Fimage_path%2F3650%2Fd38fb236-eb64-4b3a-bb42-441e86c54819.png',
  },
  {
    id: 'inandout',
    name: 'In & Out',
    img: 'https://images.cashmarket888.xyz/uploads%2Fslot_game%2Fimage_path%2F3723%2F0f3af674-9e56-4b23-8f50-a960c4b682a8.png',
  },
  {
    id: 'croco',
    name: 'Croco',
    img: 'https://images.cashmarket888.xyz/uploads%2Fslot_game%2Fimage_path%2F4261%2F1858f7ae-2b7b-450d-8d2c-44e1333e2c15.png',
  },
]

const providerKeyMap: Record<string, string> = {
  'fc-slot': 'fc',
  'va-slot': 'va',
  spadegaming: 'spade',
  'ap-slot': 'ap',
  'uu-slot': 'uu',
}

const defaultGames: GameInfo[] = [
  { name: 'Lucky Spin', img: '' },
  { name: 'Golden Dragon', img: '' },
  { name: 'Fortune Tiger', img: '' },
  { name: 'Wild Phoenix', img: '' },
  { name: 'Diamond Rush', img: '' },
  { name: 'Fire Link', img: '' },
  { name: 'Money Rain', img: '' },
  { name: 'Royal Crown', img: '' },
]

function generateResults(provider: string) {
  const key = providerKeyMap[provider] || provider
  const allGames = gameData[key] || defaultGames
  return allGames
    .map((g) => ({
      name: g.name,
      img: g.img,
      rtp: Math.floor(Math.random() * 30 + 65),
      status: '' as string,
    }))
    .map((g) => ({
      ...g,
      status: g.rtp >= 85 ? 'HOT' : g.rtp >= 75 ? 'WARM' : 'COLD',
    }))
    .sort((a, b) => b.rtp - a.rtp)
}

/* ── Random helpers for realistic scan ── */
const randIP = () =>
  `${Math.floor(Math.random() * 200 + 10)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
const randHex = (len = 8) =>
  Array.from({ length: len }, () => Math.floor(Math.random() * 16).toString(16))
    .join('')
    .toUpperCase()
const randPort = () => Math.floor(Math.random() * 9000 + 1000)

/* ── Device Intelligence Hook ── */
interface DeviceIntel {
  device: string
  battery: string
  batteryPct: number
  isp: string
  location: string
  network: string
  screen: string
  timezone: string
  language: string
  ip: string
}

function useDeviceIntel(): DeviceIntel | null {
  const [intel, setIntel] = useState<DeviceIntel | null>(null)

  useEffect(() => {
    const detect = async () => {
      const data: DeviceIntel = {
        device: 'Unknown Device',
        battery: '—',
        batteryPct: 0,
        isp: '—',
        location: '—',
        network: '—',
        screen: `${window.screen.width}×${window.screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        ip: '•••.•••.•••.•••',
      }

      // Parse device from userAgent
      const ua = navigator.userAgent
      if (/iPhone/.test(ua)) {
        const m = ua.match(/iPhone\s?OS\s([\d_]+)/)
        data.device = `iPhone (iOS ${m ? m[1].replace(/_/g, '.') : ''})`
      } else if (/iPad/.test(ua)) {
        data.device = 'iPad'
      } else if (/Android/.test(ua)) {
        const m = ua.match(/Android\s([\d.]+);\s*([^;)]+)/)
        data.device = m ? `${m[2].trim()} (Android ${m[1]})` : 'Android Device'
      } else if (/Windows/.test(ua)) {
        data.device = 'Windows PC'
      } else if (/Mac/.test(ua)) {
        data.device = 'MacOS'
      }

      // Battery API
      try {
        const nav = navigator as Navigator & {
          getBattery?: () => Promise<{ level: number; charging: boolean }>
        }
        if (nav.getBattery) {
          const bat = await nav.getBattery()
          const pct = Math.round(bat.level * 100)
          data.batteryPct = pct
          data.battery = `${pct}% ${bat.charging ? '⚡ Charging' : ''}`
        }
      } catch {
        /* not supported */
      }

      // Network
      try {
        const conn = (
          navigator as Navigator & { connection?: { effectiveType?: string; type?: string } }
        ).connection
        if (conn) {
          data.network = (conn.effectiveType || conn.type || 'unknown').toUpperCase()
          if (data.network === '4G') data.network = '4G LTE'
        }
      } catch {
        /* not supported */
      }

      // IP geolocation (ISP + location)
      try {
        const res = await fetch('https://ip-api.com/json/?fields=query,isp,city,regionName,country')
        if (res.ok) {
          const geo = await res.json()
          data.isp = geo.isp || '—'
          data.location = `${geo.city || ''}, ${geo.country || ''}`.replace(/^,\s*/, '')
          // Mask IP: show first part, hide rest
          const parts = (geo.query || '').split('.')
          data.ip = parts.length === 4 ? `${parts[0]}.${parts[1]}.xxx.${parts[3]}` : geo.query
        }
      } catch {
        /* offline / blocked */
      }

      setIntel(data)
    }

    detect()
  }, [])

  return intel
}

/* ── Device Intel Panel Component ── */
function DeviceIntelPanel({ intel }: { intel: DeviceIntel }) {
  const batteryBlocks = Math.round(intel.batteryPct / 10)
  const batteryBar = '█'.repeat(batteryBlocks) + '░'.repeat(10 - batteryBlocks)

  return (
    <div className="device-intel-card">
      <div className="device-intel-header">
        <span className="device-intel-icon">📡</span>
        <span className="device-intel-title">DEVICE INTELLIGENCE</span>
        <span className="device-intel-live">● LIVE</span>
      </div>
      <div className="device-intel-grid">
        <div className="intel-row">
          <span className="intel-icon">📱</span>
          <span className="intel-label">Device</span>
          <span className="intel-value">{intel.device}</span>
        </div>
        <div className="intel-row">
          <span className="intel-icon">🔋</span>
          <span className="intel-label">Battery</span>
          <span className="intel-value">
            {batteryBar} {intel.battery}
          </span>
        </div>
        <div className="intel-row">
          <span className="intel-icon">🌐</span>
          <span className="intel-label">ISP</span>
          <span className="intel-value">{intel.isp}</span>
        </div>
        <div className="intel-row">
          <span className="intel-icon">📍</span>
          <span className="intel-label">Location</span>
          <span className="intel-value">{intel.location}</span>
        </div>
        <div className="intel-row">
          <span className="intel-icon">📶</span>
          <span className="intel-label">Network</span>
          <span className="intel-value">{intel.network}</span>
        </div>
        <div className="intel-row">
          <span className="intel-icon">🖥️</span>
          <span className="intel-label">Screen</span>
          <span className="intel-value">
            {intel.screen} • {intel.language}
          </span>
        </div>
        <div className="intel-row">
          <span className="intel-icon">🕐</span>
          <span className="intel-label">Timezone</span>
          <span className="intel-value">{intel.timezone}</span>
        </div>
        <div className="intel-row">
          <span className="intel-icon">🔒</span>
          <span className="intel-label">IP</span>
          <span className="intel-value intel-ip">{intel.ip}</span>
        </div>
      </div>
    </div>
  )
}

/* ── Red Matrix Rain Canvas ── */
function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const chars = '01アイウエオカキクケコ@#$%&ABCDEF0123456789'
    const fontSize = 12
    let columns: number
    let drops: number[]

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      columns = Math.floor(canvas.width / fontSize)
      drops = Array(columns).fill(1)
    }

    resize()
    window.addEventListener('resize', resize)

    const interval = setInterval(() => {
      ctx.fillStyle = 'rgba(255, 251, 245, 0.08)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < columns; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)]
        const brightness = Math.random()
        if (brightness > 0.7) {
          ctx.fillStyle = 'rgba(230, 53, 32, 0.5)'
        } else if (brightness > 0.4) {
          ctx.fillStyle = 'rgba(255, 107, 44, 0.35)'
        } else {
          ctx.fillStyle = 'rgba(255, 140, 66, 0.2)'
        }
        ctx.font = `${fontSize}px monospace`
        ctx.fillText(char, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }, 60)

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="matrix-rain" />
}

/* ── Enhanced Terminal Scan Log ── */
function ScanTerminal({
  cm8Id,
  provider,
  onPhase,
}: {
  cm8Id: string
  provider: string
  onPhase?: (phase: string) => void
}) {
  const [lines, setLines] = useState<
    { text: string; type: 'normal' | 'success' | 'warning' | 'info' }[]
  >([])
  const logRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  const termLines = useMemo(() => {
    const ip = randIP()
    const sessionId = randHex(12)
    const port = randPort()
    const gameCount = Math.floor(Math.random() * 10 + 15)

    return [
      { text: `[SYS] Initializing CM8 Scanner v4.2.1...`, type: 'info' as const, delay: 300 },
      { text: `[NET] Resolving DNS → cm8-sg1.internal.io`, type: 'normal' as const, delay: 500 },
      { text: `[NET] Connection established: ${ip}:${port}`, type: 'normal' as const, delay: 400 },
      { text: `[AUTH] Authenticating session: ${sessionId}`, type: 'normal' as const, delay: 600 },
      { text: `[AUTH] Session verified ✓`, type: 'success' as const, delay: 300 },
      {
        text: `[SCAN] Target: ${provider.toUpperCase()} • ID: ${cm8Id}`,
        type: 'info' as const,
        delay: 400,
      },
      {
        text: `[SCAN] Accessing RTP memory block 0x${randHex(4)}...`,
        type: 'normal' as const,
        delay: 500,
      },
      { text: `[WARN] Firewall detected — bypassing...`, type: 'warning' as const, delay: 700 },
      { text: `[SCAN] Firewall bypassed ✓`, type: 'success' as const, delay: 400 },
      {
        text: `[DATA] Reading slot tables: ${gameCount} entries found`,
        type: 'normal' as const,
        delay: 500,
      },
      {
        text: `[DATA] Decrypting percentage values [AES-256]...`,
        type: 'normal' as const,
        delay: 600,
      },
      { text: `[DATA] Mapping RTP distributions...`, type: 'normal' as const, delay: 400 },
      {
        text: `[DATA] Cross-referencing hot patterns [0x${randHex(4)}]`,
        type: 'normal' as const,
        delay: 500,
      },
      { text: `[CALC] Running probability analysis...`, type: 'normal' as const, delay: 400 },
      { text: `[SYS] Compiling results ██████████ 100%`, type: 'info' as const, delay: 300 },
      {
        text: `[DONE] Scan complete — ${gameCount} games analyzed ✓`,
        type: 'success' as const,
        delay: 200,
      },
    ]
  }, [cm8Id, provider])

  useEffect(() => {
    setLines([])
    setProgress(0)
    const timers: NodeJS.Timeout[] = []
    let cumDelay = 0

    termLines.forEach((line, i) => {
      cumDelay += line.delay
      timers.push(
        setTimeout(() => {
          setLines((prev) => [...prev, { text: line.text, type: line.type }])
          setProgress(Math.round(((i + 1) / termLines.length) * 100))
          logRef.current?.scrollTo(0, logRef.current.scrollHeight)

          // Report phase to parent
          if (i === 0) onPhase?.('init')
          if (i === 4) onPhase?.('auth')
          if (i === 8) onPhase?.('bypass')
          if (i === 12) onPhase?.('analyze')
          if (i === termLines.length - 1) onPhase?.('done')
        }, cumDelay),
      )
    })

    return () => timers.forEach(clearTimeout)
  }, [termLines, onPhase])

  return (
    <div className="hacker-terminal">
      <div className="terminal-header">
        <span className="terminal-dot terminal-dot-red" />
        <span className="terminal-dot terminal-dot-yellow" />
        <span className="terminal-dot terminal-dot-green" />
        <span className="terminal-title">cm8_scanner.exe — {progress}%</span>
      </div>
      <div className="terminal-progress-bar">
        <div className="terminal-progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="terminal-body" ref={logRef}>
        {lines.map((line, i) => (
          <div
            key={i}
            className={`terminal-line terminal-line-${line.type} ${i === lines.length - 1 ? 'terminal-line-latest' : ''}`}
          >
            {line.text}
          </div>
        ))}
        <span className="terminal-cursor">▊</span>
      </div>
    </div>
  )
}

/* ── Warning Modal ── */
function ScanWarningModal({
  onConfirm,
  onCancel,
  provider,
}: {
  onConfirm: () => void
  onCancel: () => void
  provider: string
}) {
  return (
    <div className="scan-modal-overlay" onClick={onCancel}>
      <div className="scan-modal" onClick={(e) => e.stopPropagation()}>
        <div className="scan-modal-icon">⚠️</div>
        <h3 className="scan-modal-title">AMARAN KESELAMATAN</h3>
        <p className="scan-modal-text">
          Scanning akan akses database <strong>{provider.toUpperCase()}</strong> untuk analisis RTP
          secara real-time. Proses ini tidak boleh dibatalkan.
        </p>
        <div className="scan-modal-info">
          <span>🔒 Encrypted Connection</span>
          <span>⚡ ~8 saat</span>
        </div>
        <div className="scan-modal-actions">
          <button className="scan-modal-cancel" onClick={onCancel}>
            BATAL
          </button>
          <button className="scan-modal-confirm" onClick={onConfirm}>
            ▶ TERUSKAN
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Circular RTP Gauge ── */
function RtpGauge({ rtp, color, size = 56 }: { rtp: number; color: string; size?: number }) {
  const strokeWidth = 5
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (rtp / 100) * circumference
  return (
    <div className="rtp-gauge" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="rtp-gauge-svg">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(0,0,0,0.06)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="rtp-gauge-fill"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="rtp-gauge-text" style={{ color }}>
        {rtp}%
      </span>
    </div>
  )
}

/* ── Hex Crawl ── */
function HexCrawl() {
  const [hex, setHex] = useState('0x0000')
  useEffect(() => {
    const interval = setInterval(() => {
      setHex(
        '0x' +
          Math.floor(Math.random() * 65535)
            .toString(16)
            .toUpperCase()
            .padStart(4, '0'),
      )
    }, 80)
    return () => clearInterval(interval)
  }, [])
  return <span className="hex-crawl">[{hex}]</span>
}

export default function PatchIDPage() {
  const [verified, setVerified] = useState(false)
  const [cm8Id, setCm8Id] = useState('')
  const [lockedUsername, setLockedUsername] = useState<string | null>(null)
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [results, setResults] = useState<
    { name: string; img: string; rtp: number; status: string }[] | null
  >(null)
  const [scanning, setScanning] = useState(false)
  const [scanComplete, setScanComplete] = useState(false)
  const [filter, setFilter] = useState<'ALL' | 'HOT' | 'WARM' | 'COLD'>('ALL')
  const [showWarning, setShowWarning] = useState(false)
  const [scanPhase, setScanPhase] = useState('')
  const [showFlash, setShowFlash] = useState(false)
  const [copied, setCopied] = useState(false)
  const deviceIntel = useDeviceIntel()

  // Check localStorage for verified status
  useEffect(() => {
    try {
      const saved = localStorage.getItem('patchIdVerified')
      if (saved) {
        const data = JSON.parse(saved)
        if (data?.phone && data?.verifiedAt) {
          setVerified(true)
          if (data.cm8Username) {
            setLockedUsername(data.cm8Username)
            setCm8Id(data.cm8Username)
          }
        }
      }
    } catch {
      /* ignore */
    }
  }, [])

  /* ── Share Results ── */
  const buildShareText = useCallback(() => {
    if (!results || !selectedProvider) return ''
    const providerName = providers.find((p) => p.id === selectedProvider)?.name || selectedProvider
    const now = new Date().toLocaleString('ms-MY', { timeZone: 'Asia/Kuala_Lumpur' })
    const top5 = results.slice(0, 5)

    let text = `🛡️ *PATCH ID SCAN RESULT*\n`
    text += `🎮 Provider: ${providerName}\n`
    text += `📅 ${now}\n`
    text += `────────────────────\n\n`
    text += `🏆 *TOP 5 GAME TERPANAS:*\n\n`

    top5.forEach((g, i) => {
      const icon = g.status === 'HOT' ? '🔥' : g.status === 'WARM' ? '⚡' : '❄️'
      text += `${i + 1}. ${g.name}\n`
      text += `   RTP: ${g.rtp}% ${icon} ${g.status}\n\n`
    })

    text += `────────────────────\n`
    text += `📊 Total: ${results.length} games | Avg RTP: ${Math.round(results.reduce((s, g) => s + g.rtp, 0) / results.length)}%\n\n`
    text += `🚀 Nak scan slot anda? Guna AI Scanner PERCUMA di:\n`
    text += `🌐 cm8vvip.com/patch-id\n\n`
    text += `🔒 Scanner paling tepat — data real-time!\n`
    text += `📲 Join: https://t.me/+aK5iX_FE_b9kMzQ1\n`
    text += `#CM8VVIP #PatchID #SlotScanner`

    return text
  }, [results, selectedProvider])

  const shareResults = useCallback(
    async (method?: 'whatsapp' | 'telegram' | 'copy') => {
      const text = buildShareText()
      if (!text) return

      if (method === 'whatsapp') {
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
        return
      }
      if (method === 'telegram') {
        window.open(
          `https://t.me/share/url?url=${encodeURIComponent('https://cm8vvip.com/patch-id')}&text=${encodeURIComponent(text)}`,
          '_blank',
        )
        return
      }

      // Try native share first
      if (navigator.share && method !== 'copy') {
        try {
          await navigator.share({ title: 'CM8 VVIP Scan Result', text })
          return
        } catch {
          /* user cancelled or not supported */
        }
      }

      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch {
        /* clipboard failed */
      }
    },
    [buildShareText],
  )

  /* ── Lock/unlock bottom nav ── */
  useEffect(() => {
    if (scanning) {
      document.body.classList.add('nav-locked')
    } else {
      document.body.classList.remove('nav-locked')
    }
    return () => document.body.classList.remove('nav-locked')
  }, [scanning])

  const startScan = useCallback(() => {
    if (!cm8Id.trim() || !selectedProvider) return
    setShowWarning(true)
  }, [cm8Id, selectedProvider])

  const confirmScan = useCallback(() => {
    if (!selectedProvider) return
    setShowWarning(false)
    setScanning(true)
    setScanComplete(false)
    setResults(null)
    setFilter('ALL')
    setScanPhase('init')

    setTimeout(() => {
      setShowFlash(true)
      setTimeout(() => {
        setResults(generateResults(selectedProvider))
        setScanning(false)
        setScanComplete(true)
        setShowFlash(false)
        // Screen shake
        document.body.classList.add('scan-shake')
        setTimeout(() => document.body.classList.remove('scan-shake'), 500)
      }, 400)
    }, 7000)
  }, [selectedProvider])

  const getRtpColor = (rtp: number) => {
    if (rtp >= 85) return '#22C55E'
    if (rtp >= 75) return '#F59E0B'
    return '#EF4444'
  }

  const stats = useMemo(() => {
    if (!results) return null
    const avgRtp = Math.round(results.reduce((s, g) => s + g.rtp, 0) / results.length)
    const hotCount = results.filter((g) => g.status === 'HOT').length
    const warmCount = results.filter((g) => g.status === 'WARM').length
    return { total: results.length, avgRtp, hotCount, warmCount }
  }, [results])

  const top3 = useMemo(() => (results ? results.slice(0, 3) : []), [results])

  const filteredResults = useMemo(() => {
    if (!results) return []
    const list = filter === 'ALL' ? results : results.filter((g) => g.status === filter)
    return filter === 'ALL' ? list.slice(3) : list
  }, [results, filter])

  // Show registration gate if not verified (AFTER all hooks)
  if (!verified) {
    return (
      <div className="patch-id-page">
        <MatrixRain />
        <div className="patch-header">
          <div className="patch-header-glow" />
          <h1 className="patch-title glitch-text" data-text="PATCH_ID.sys">
            <span className="patch-icon">⚡</span>
            PATCH_ID.sys
          </h1>
          <p className="patch-subtitle hacker-sub">
            <span className="terminal-prefix">&gt;_</span> Daftar untuk akses AI Scanner
          </p>
        </div>
        <RegisterGate
          onVerified={(username) => {
            setVerified(true)
            if (username) {
              setLockedUsername(username)
              setCm8Id(username)
            }
          }}
        />
      </div>
    )
  }

  return (
    <div className={`patch-id-page ${scanning ? 'page-scanning' : ''}`}>
      {/* Matrix Rain Background */}
      <MatrixRain />

      {/* Screen Flash on Complete */}
      {showFlash && <div className="scan-flash" />}

      {/* Warning Modal */}
      {showWarning && selectedProvider && (
        <ScanWarningModal
          provider={selectedProvider}
          onConfirm={confirmScan}
          onCancel={() => setShowWarning(false)}
        />
      )}

      {/* Header */}
      <div className="patch-header">
        <div className="patch-header-glow" />
        <h1 className="patch-title glitch-text" data-text="PATCH_ID.sys">
          <span className="patch-icon">⚡</span>
          PATCH_ID.sys
        </h1>
        <p className="patch-subtitle hacker-sub">
          <span className="terminal-prefix">&gt;_</span> Masukkan ID untuk scan slot percentage
        </p>
        {scanning && (
          <div className="scan-status-badge">
            <span className="status-dot" />
            SCANNING — {scanPhase.toUpperCase()}
          </div>
        )}
      </div>

      {/* ID Input */}
      <div className="patch-card hacker-card">
        <label className="patch-label hacker-label">
          <span className="label-dot" /> CM8 GAME ID
          {lockedUsername && (
            <span style={{ marginLeft: 8, color: '#e63520', fontSize: '0.75rem' }}>🔒 LOCKED</span>
          )}
        </label>
        <div className="patch-input-wrap hacker-input-wrap">
          <span className="terminal-prompt">root@cm8:~$</span>
          <input
            type="text"
            className="patch-input hacker-input"
            placeholder="masukkan_id"
            value={cm8Id}
            onChange={(e) => !lockedUsername && setCm8Id(e.target.value)}
            disabled={scanning}
            readOnly={!!lockedUsername}
            style={lockedUsername ? { opacity: 0.8, cursor: 'not-allowed' } : {}}
          />
          {lockedUsername ? (
            <span style={{ color: '#e63520', fontSize: '0.85rem', marginLeft: 4 }}>🔒</span>
          ) : (
            <span className="input-cursor">▊</span>
          )}
        </div>
      </div>

      {/* Provider Selection */}
      <div className={`patch-card hacker-card ${scanning ? 'card-locked' : ''}`}>
        <label className="patch-label hacker-label">
          <span className="label-dot" /> PILIH TARGET
        </label>
        <div className="provider-grid">
          {providers.map((p) => (
            <button
              key={p.id}
              className={`provider-btn ${selectedProvider === p.id ? 'provider-active' : ''}`}
              onClick={() => !scanning && setSelectedProvider(p.id)}
              disabled={scanning}
            >
              <div className="provider-logo-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt={p.name} className="provider-logo-img" />
              </div>
              <span className="provider-name">{p.name}</span>
              {selectedProvider === p.id && <span className="provider-check">✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Scan Button */}
      <button
        className={`scan-btn hacker-scan-btn ${scanning ? 'scan-loading' : ''} ${!cm8Id.trim() || !selectedProvider ? 'scan-disabled' : ''}`}
        onClick={startScan}
        disabled={scanning || !cm8Id.trim() || !selectedProvider}
      >
        {scanning ? (
          <>
            <span className="scan-spinner" />
            <span>SCANNING</span>
            <HexCrawl />
          </>
        ) : (
          <>
            <span className="scan-icon">▶</span>
            <span>EXECUTE SCAN</span>
          </>
        )}
      </button>

      {/* Device Intel Panel — appears during scan */}
      {scanning && deviceIntel && <DeviceIntelPanel intel={deviceIntel} />}

      {/* Scanning — Terminal Log */}
      {scanning && selectedProvider && (
        <ScanTerminal cm8Id={cm8Id} provider={selectedProvider} onPhase={setScanPhase} />
      )}

      {/* ═══════════════ RESULTS ═══════════════ */}
      {scanComplete && results && stats && (
        <div className="patch-results scan-results-reveal">
          <div className="stats-bar">
            <div className="stats-item">
              <span className="stats-icon stats-icon-total">🎰</span>
              <span className="stats-value">{stats.total}</span>
              <span className="stats-label">Total Games</span>
            </div>
            <div className="stats-item">
              <span className="stats-icon stats-icon-avg">📊</span>
              <span className="stats-value">{stats.avgRtp}%</span>
              <span className="stats-label">Avg RTP</span>
            </div>
            <div className="stats-item">
              <span className="stats-icon stats-icon-hot">🔥</span>
              <span className="stats-value">{stats.hotCount}</span>
              <span className="stats-label">HOT Games</span>
            </div>
          </div>

          <div className="top3-section">
            <h3 className="top3-title">🏆 Top 3 Game Terpanas</h3>
            <div className="top3-cards">
              {top3.map((game, i) => (
                <div
                  key={game.name}
                  className={`top3-card top3-${['gold', 'silver', 'bronze'][i]}`}
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                  <span className="top3-medal">{['👑', '🥈', '🥉'][i]}</span>
                  <div className="top3-thumb-wrap">
                    {game.img && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={game.img} alt={game.name} className="top3-thumb" />
                    )}
                  </div>
                  <span className="top3-name">{game.name}</span>
                  <RtpGauge rtp={game.rtp} color={getRtpColor(game.rtp)} size={52} />
                  <span className="top3-status top3-status-hot">🔥 HOT</span>
                </div>
              ))}
            </div>
          </div>

          <div className="filter-bar">
            {(['ALL', 'HOT', 'WARM', 'COLD'] as const).map((f) => (
              <button
                key={f}
                className={`filter-btn ${filter === f ? 'filter-active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'ALL' && '🎮 '}
                {f === 'HOT' && '🔥 '}
                {f === 'WARM' && '⚡ '}
                {f === 'COLD' && '❄️ '}
                {f} {f !== 'ALL' && results && `(${results.filter((g) => g.status === f).length})`}
              </button>
            ))}
          </div>

          <div className="results-grid">
            {filteredResults.map((game, i) => (
              <div
                key={game.name}
                className={`result-card ${game.status === 'HOT' ? 'result-card-hot' : ''}`}
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <div className="result-card-top">
                  <span className="result-card-rank">#{filter === 'ALL' ? i + 4 : i + 1}</span>
                  <span className={`result-card-badge badge-${game.status.toLowerCase()}`}>
                    {game.status === 'HOT' ? '🔥' : game.status === 'WARM' ? '⚡' : '❄️'}{' '}
                    {game.status}
                  </span>
                </div>
                <div className="result-card-body">
                  {game.img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={game.img} alt={game.name} className="result-card-img" />
                  ) : (
                    <div className="result-card-img-placeholder">🎰</div>
                  )}
                  <RtpGauge rtp={game.rtp} color={getRtpColor(game.rtp)} size={50} />
                </div>
                <span className="result-card-name">{game.name}</span>
              </div>
            ))}
          </div>

          {filteredResults.length === 0 && (
            <div className="no-results">
              <span className="no-results-icon">🔍</span>
              <p>Tiada game dengan status {filter}</p>
            </div>
          )}

          {/* ── Share Section ── */}
          <div className="share-section">
            <h4 className="share-title">📤 Share Result</h4>
            <p className="share-desc">Kongsi result scan dengan kawan-kawan!</p>
            <div className="share-buttons">
              <button className="share-btn share-btn-wa" onClick={() => shareResults('whatsapp')}>
                <span>💬</span> WhatsApp
              </button>
              <button className="share-btn share-btn-tg" onClick={() => shareResults('telegram')}>
                <span>✈️</span> Telegram
              </button>
              <button className="share-btn share-btn-copy" onClick={() => shareResults('copy')}>
                <span>{copied ? '✅' : '📋'}</span> {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="share-promo">
              <span className="share-promo-badge">🔒 CM8 VVIP</span>
              <span>
                AI Scanner Percuma di <strong>cm8vvip.com</strong>
              </span>
            </div>
          </div>

          <div className="results-footer">
            <p className="results-disclaimer">
              ⏱️ Data dikemaskini setiap 5 minit • Percentage berubah mengikut masa
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
