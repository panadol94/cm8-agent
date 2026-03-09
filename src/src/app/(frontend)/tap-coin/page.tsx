'use client'

import React, { useMemo, useRef, useState } from 'react'

type Phase = 'idle' | 'running' | 'finished'

const GAME_SECONDS = 10
const MIN_TAP_INTERVAL_MS = 70 // ~14 taps/sec hard gate
const MAX_TAPS_PER_SECOND = 12 // soft cap (anti auto-click)

function formatMs(ms: number) {
  return Math.max(0, Math.ceil(ms / 1000))
}

function rewardByScore(score: number) {
  if (score >= 180) return { prize: 'RM10', label: '🎉 Power Tap!' }
  if (score >= 150) return { prize: 'RM5', label: '🔥 Hebat!' }
  if (score >= 120) return { prize: 'RM3', label: '✅ Lulus Target!' }
  return { prize: null, label: '💪 Cuba lagi esok!' }
}

export default function TapCoinPage() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [playerId, setPlayerId] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [error, setError] = useState('')
  const [score, setScore] = useState(0)
  const [timeLeftMs, setTimeLeftMs] = useState(GAME_SECONDS * 1000)
  const [suspicious, setSuspicious] = useState(false)
  const [suspiciousReason, setSuspiciousReason] = useState('')

  const startedAtRef = useRef<number | null>(null)
  const endAtRef = useRef<number | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const tapTimesRef = useRef<number[]>([])
  const lastTapRef = useRef(0)

  const normalizedWa = whatsapp.replace(/\D/g, '')
  const waValid = normalizedWa.length >= 10 && normalizedWa.length <= 15

  const reward = useMemo(() => {
    if (suspicious) {
      return { prize: null, label: '🚫 Suspected Auto Clicker (No Auto Reward)' }
    }
    return rewardByScore(score)
  }, [score, suspicious])

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const flagSuspicious = (reason: string) => {
    setSuspicious(true)
    setSuspiciousReason((prev) => prev || reason)
  }

  const finishGame = () => {
    stopTimer()

    const taps = tapTimesRef.current
    const bins = new Map<number, number>()
    for (const t of taps) {
      const sec = Math.floor((t - (startedAtRef.current || t)) / 1000)
      bins.set(sec, (bins.get(sec) || 0) + 1)
    }
    const maxPerSecond = Math.max(0, ...Array.from(bins.values()))
    if (maxPerSecond > MAX_TAPS_PER_SECOND) {
      flagSuspicious(`Tap rate terlalu tinggi (${maxPerSecond}/s)`)
    }

    const intervals: number[] = []
    for (let i = 1; i < taps.length; i++) intervals.push(taps[i] - taps[i - 1])
    if (intervals.length > 8) {
      const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length
      const variance = intervals.reduce((a, b) => a + (b - avg) ** 2, 0) / intervals.length
      const std = Math.sqrt(variance)
      if (avg < 85 && std < 20) {
        flagSuspicious('Corak klik terlalu konsisten (auto-click pattern)')
      }
    }

    setPhase('finished')
    setTimeLeftMs(0)
  }

  const startGame = () => {
    if (!playerId.trim()) {
      setError('Sila isi Player ID dulu')
      return
    }
    if (!waValid) {
      setError('Sila isi nombor WhatsApp yang sah')
      return
    }

    setError('')
    setScore(0)
    setSuspicious(false)
    setSuspiciousReason('')
    tapTimesRef.current = []
    lastTapRef.current = 0

    const now = Date.now()
    startedAtRef.current = now
    endAtRef.current = now + GAME_SECONDS * 1000
    setTimeLeftMs(GAME_SECONDS * 1000)
    setPhase('running')

    timerRef.current = setInterval(() => {
      const remaining = (endAtRef.current || 0) - Date.now()
      setTimeLeftMs(Math.max(0, remaining))
      if (remaining <= 0) finishGame()
    }, 100)
  }

  const onTap = () => {
    if (phase !== 'running') return

    const now = Date.now()

    // Hard gate against ultra-fast auto-click bursts
    if (now - lastTapRef.current < MIN_TAP_INTERVAL_MS) {
      flagSuspicious('Klik terlalu laju (burst detected)')
      return
    }

    // Sliding 1-second window limit
    tapTimesRef.current = tapTimesRef.current.filter((t) => now - t < 1000)
    if (tapTimesRef.current.length >= MAX_TAPS_PER_SECOND) {
      flagSuspicious(`Melebihi had ${MAX_TAPS_PER_SECOND} tap/s`)
      return
    }

    lastTapRef.current = now
    tapTimesRef.current.push(now)
    setScore((s) => s + 1)
  }

  const reset = () => {
    stopTimer()
    setPhase('idle')
    setScore(0)
    setTimeLeftMs(GAME_SECONDS * 1000)
    setSuspicious(false)
    setSuspiciousReason('')
    setError('')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a0505 0%, #2a0800 40%, #0a0a0a 100%)',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 460,
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(230,53,32,0.24)',
        borderRadius: 22,
        backdropFilter: 'blur(16px)',
        padding: 24,
        boxShadow: '0 20px 50px rgba(0,0,0,0.45)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 34 }}>🪙</div>
          <h1 style={{ margin: '8px 0 4px', color: '#ffd700' }}>Tap Coin 10 Saat</h1>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.72)', fontSize: 13 }}>
            Demo mini game untuk CM8
          </p>
        </div>

        <div style={{
          background: 'rgba(255,215,0,0.1)',
          border: '1px solid rgba(255,215,0,0.32)',
          borderRadius: 12,
          padding: '10px 12px',
          fontSize: 12,
          color: '#ffe6a5',
          marginBottom: 14,
          lineHeight: 1.45,
        }}>
          1 nombor WhatsApp = 1 percubaan sehari. Sistem anti-auto-click aktif (had laju tap + corak konsisten).
          Jika dikesan mencurigakan, reward auto dibatalkan dan perlu review manual.
        </div>

        <div style={{ display: 'grid', gap: 10 }}>
          <input
            placeholder="Player ID (contoh: luckyhorse879)"
            value={playerId}
            onChange={(e) => setPlayerId(e.target.value)}
            disabled={phase === 'running'}
            style={{
              padding: '12px 14px',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.16)',
              background: 'rgba(255,255,255,0.05)',
              color: '#fff',
            }}
          />
          <input
            placeholder="Nombor WhatsApp (contoh: 0178182320)"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            disabled={phase === 'running'}
            style={{
              padding: '12px 14px',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.16)',
              background: 'rgba(255,255,255,0.05)',
              color: '#fff',
            }}
          />
        </div>

        {error && (
          <div style={{
            marginTop: 10,
            background: 'rgba(230,53,32,0.15)',
            border: '1px solid rgba(230,53,32,0.35)',
            borderRadius: 10,
            padding: '8px 10px',
            fontSize: 13,
            color: '#ff9c9c',
          }}>
            {error}
          </div>
        )}

        <div style={{
          marginTop: 14,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: 12,
            textAlign: 'center',
            padding: '10px 8px',
          }}>
            <div style={{ color: '#aaa', fontSize: 12 }}>Masa</div>
            <div style={{ color: '#ffd700', fontWeight: 800, fontSize: 24 }}>{formatMs(timeLeftMs)}s</div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: 12,
            textAlign: 'center',
            padding: '10px 8px',
          }}>
            <div style={{ color: '#aaa', fontSize: 12 }}>Score</div>
            <div style={{ color: '#25D366', fontWeight: 800, fontSize: 24 }}>{score}</div>
          </div>
        </div>

        <button
          onClick={onTap}
          disabled={phase !== 'running'}
          style={{
            marginTop: 14,
            width: '100%',
            height: 140,
            borderRadius: 20,
            border: '2px solid rgba(255,215,0,0.35)',
            background: phase === 'running'
              ? 'radial-gradient(circle at 30% 30%, #ffe07a, #ffa500 60%, #ff8c42 100%)'
              : 'rgba(255,255,255,0.08)',
            color: phase === 'running' ? '#3b1d00' : '#777',
            fontSize: 42,
            cursor: phase === 'running' ? 'pointer' : 'not-allowed',
            fontWeight: 900,
          }}
        >
          {phase === 'running' ? 'TAP!' : '🪙'}
        </button>

        <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
          {phase !== 'running' ? (
            <button
              onClick={startGame}
              style={{
                flex: 1,
                border: 'none',
                borderRadius: 12,
                padding: '12px 14px',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #e63520, #ff6b4a)',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              🚀 Start 10 Saat
            </button>
          ) : (
            <button
              disabled
              style={{
                flex: 1,
                border: 'none',
                borderRadius: 12,
                padding: '12px 14px',
                fontWeight: 700,
                background: 'rgba(255,255,255,0.12)',
                color: '#bbb',
              }}
            >
              ⏱️ Sedang Bermain...
            </button>
          )}

          <button
            onClick={reset}
            style={{
              width: 110,
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'transparent',
              color: '#ddd',
              cursor: 'pointer',
            }}
          >
            Reset
          </button>
        </div>

        {phase === 'finished' && (
          <div style={{
            marginTop: 14,
            background: suspicious ? 'rgba(230,53,32,0.12)' : 'rgba(37,211,102,0.1)',
            border: suspicious ? '1px solid rgba(230,53,32,0.35)' : '1px solid rgba(37,211,102,0.3)',
            borderRadius: 12,
            padding: '12px 14px',
          }}>
            <div style={{ fontWeight: 800, color: suspicious ? '#ff9c9c' : '#25D366' }}>{reward.label}</div>
            <div style={{ fontSize: 13, marginTop: 4, color: suspicious ? '#ffd1d1' : '#d5ffd5' }}>
              {reward.prize
                ? `Score ${score} • Layak ${reward.prize}`
                : suspicious
                  ? `Score ${score} • Auto reward dibatalkan`
                  : `Score ${score} • Belum capai target reward`}
            </div>
            <div style={{ fontSize: 12, marginTop: 6, color: '#bbb' }}>
              Player: {playerId || '-'} • WhatsApp: {normalizedWa || '-'}
            </div>
            {suspicious && (
              <div style={{ fontSize: 12, marginTop: 8, color: '#ffb3b3' }}>
                ⚠️ {suspiciousReason || 'Corak klik mencurigakan dikesan'}. Sila review manual semasa claim.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
