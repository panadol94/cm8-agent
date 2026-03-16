'use client'

import { useMemo, useState, useEffect } from 'react'

type PublicConfig = {
  prizes: { label: string; weight: number; colorA: string; colorB: string }[]
  spinLimitPerEntry: number
  whitelistCount: number
}

type AuthResponse = {
  ok?: boolean
  allowed?: boolean
  alreadySpun?: boolean
  error?: string
  agentId?: string
  whatsapp?: string
  spinLimit?: number
  usedSpins?: number
  remainingSpins?: number
  spin?: {
    prize: string
    claimId: string
    spunAt: string
  }
}

type SpinResponse = {
  ok?: boolean
  alreadySpun?: boolean
  error?: string
  prize?: string
  claimId?: string
  spunAt?: string
  agentId?: string
  whatsapp?: string
}

const PRIZE_META: Record<string, { badge: string; glow: string; note: string }> = {
  RM100: { badge: '🔥 Hot Prize', glow: '#ffb200', note: 'Majoriti spin memang akan land dekat hadiah ini untuk demo flow.' },
  RM288: { badge: '✨ Rare', glow: '#ff6b81', note: 'Hadiah rare tier kedua.' },
  RM388: { badge: '💎 Ultra Rare', glow: '#c471ed', note: 'Jarang keluar — memang low probability.' },
  RM588: { badge: '👑 Jackpot Demo', glow: '#4facfe', note: 'Very rare demo jackpot.' },
  '5G GOLD': { badge: '🪙 Display Only', glow: '#ffd54f', note: 'Segment ni untuk display sahaja — odds sekarang 0%.' },
}

const SEGMENTS = ['RM100', 'RM288', 'RM100', 'RM388', 'RM100', 'RM588', 'RM100', '5G GOLD']
const SEGMENT_DEG = 360 / SEGMENTS.length

function prizeToSegmentIndex(prize: string) {
  const matches = SEGMENTS.map((label, index) => ({ label, index })).filter((entry) => entry.label === prize)
  if (matches.length === 0) return 0
  return matches[Math.floor(Math.random() * matches.length)].index
}

function normalizeDisplayPhone(value: string) {
  const digits = String(value || '').replace(/\D/g, '')
  if (!digits) return '-'
  if (digits.startsWith('60')) return `+${digits}`
  return digits
}

export default function WheelDemoClient() {
  const [agentId, setAgentId] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [verified, setVerified] = useState<{ agentId: string; whatsapp: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [spinning, setSpinning] = useState(false)
  const [angle, setAngle] = useState(0)
  const [error, setError] = useState('')
  const [result, setResult] = useState<{ prize: string; claimId: string; spunAt: string } | null>(null)
  const [spinInfo, setSpinInfo] = useState<{ spinLimit: number; usedSpins: number; remainingSpins: number } | null>(null)
  const [config, setConfig] = useState<PublicConfig | null>(null)

  // Fetch public config on mount
  useEffect(() => {
    fetch('/api/wheel-demo/public')
      .then(r => r.json())
      .then(data => setConfig(data))
      .catch(() => {})
  }, [])

  // Use config for prizes if available
  const prizes = config?.prizes || [
    { label: 'RM100', weight: 84, colorA: '#ffcf33', colorB: '#ff9800' },
    { label: 'RM288', weight: 10, colorA: '#ff5f6d', colorB: '#ffc371' },
    { label: 'RM388', weight: 5, colorA: '#8e2de2', colorB: '#ff6fd8' },
    { label: 'RM588', weight: 1, colorA: '#00c6ff', colorB: '#0072ff' },
  ]

  const spinLimit = config?.spinLimitPerEntry || 1

  const currentMeta = useMemo(() => {
    if (!result?.prize) return null
    return PRIZE_META[result.prize] || PRIZE_META.RM100
  }, [result])

  const handleLogin = async () => {
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/wheel-demo/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, whatsapp }),
      })
      const data: AuthResponse = await res.json()

      if (!res.ok || !data.allowed) {
        setVerified(null)
        setResult(null)
        setError(data.error || 'Login event gagal.')
        return
      }

      const verifiedState = {
        agentId: data.agentId || agentId.trim(),
        whatsapp: data.whatsapp || whatsapp.trim(),
      }

      setVerified(verifiedState)
      setAgentId(verifiedState.agentId)
      setWhatsapp(verifiedState.whatsapp)

      // Set spin info from response
      if (data.spinLimit) {
        setSpinInfo({
          spinLimit: data.spinLimit,
          usedSpins: data.usedSpins || 0,
          remainingSpins: data.remainingSpins || 0,
        })
      }

      if (data.alreadySpun && data.spin) {
        setResult({
          prize: data.spin.prize,
          claimId: data.spin.claimId,
          spunAt: data.spin.spunAt,
        })
      } else {
        setResult(null)
      }
    } catch {
      setError('Tak dapat connect ke server demo.')
    } finally {
      setLoading(false)
    }
  }

  const handleSpin = async () => {
    if (!verified || spinning || result) return

    setSpinning(true)
    setError('')

    try {
      const res = await fetch('/api/wheel-demo/spin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(verified),
      })
      const data: SpinResponse = await res.json()

      if (!res.ok || !data.ok || !data.prize || !data.claimId || !data.spunAt) {
        setError(data.error || 'Spin gagal. Cuba refresh page.')
        setSpinning(false)
        return
      }

      const segmentIndex = prizeToSegmentIndex(data.prize)
      const segmentCenter = segmentIndex * SEGMENT_DEG + SEGMENT_DEG / 2
      const extraTurns = 6 * 360
      const finalOffset = 360 - segmentCenter
      const finalAngle = angle + extraTurns + finalOffset + 720

      setAngle(finalAngle)

      window.setTimeout(() => {
        setResult({
          prize: data.prize!,
          claimId: data.claimId!,
          spunAt: data.spunAt!,
        })
        setSpinning(false)
      }, 5200)
    } catch {
      setError('Ralat masa spin. Cuba lagi kejap.')
      setSpinning(false)
    }
  }

  const canSpin = Boolean(verified && !result && !spinning)

  return (
    <div className="wheel-demo-page">
      <div className="wheel-demo-shell">
        <div className="hero-card">
          <div className="eyebrow">🎡 Demo Event Login + Wheel</div>
          <h1>CM8 Lucky Wheel Demo</h1>
          <p>
            Demo ni ikut flow yang Garry minta: <strong>ID Agent + nombor WhatsApp</strong> mesti
            match dalam whitelist dulu, baru boleh dapat <strong>1 spin</strong>.
          </p>
        </div>

        <div className="content-grid">
          <section className="panel login-panel">
            <h2>Login Event</h2>
            <p className="muted">Masukkan ID Agent dan nombor WhatsApp yang dah dimasukkan dalam senarai.</p>

            <label>
              <span>ID Agent</span>
              <input
                value={agentId}
                onChange={(e) => setAgentId(e.target.value)}
                placeholder="Contoh: Garry"
                autoCapitalize="off"
              />
            </label>

            <label>
              <span>Nombor WhatsApp</span>
              <input
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="Contoh: 0178182320"
                inputMode="numeric"
              />
            </label>

            <button className="primary-btn" onClick={handleLogin} disabled={loading || spinning}>
              {loading ? 'Checking whitelist...' : 'Login Demo'}
            </button>

            {verified && !result && (
              <div className="success-box">
                <div>✅ Login lulus</div>
                <div>ID Agent: <strong>{verified.agentId}</strong></div>
                <div>WhatsApp: <strong>{normalizeDisplayPhone(verified.whatsapp)}</strong></div>
                {spinInfo && (
                  <div style={{ marginTop: '8px', padding: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px' }}>
                    <div>Spin: <strong>{spinInfo.usedSpins}/{spinInfo.spinLimit}</strong> digunakan</div>
                    <div>Baki: <strong style={{ color: spinInfo.remainingSpins > 0 ? '#25D366' : '#ff6b4a' }}>
                      {spinInfo.remainingSpins}
                    </strong>putaran</div>
                  </div>
                )}
              </div>
            )}

            {result && (
              <div className="success-box spun-box">
                <div>✅ Login lulus & spin sudah digunakan</div>
                <div>Hadiah: <strong>{result.prize}</strong></div>
                <div>Claim ID: <strong>{result.claimId}</strong></div>
                {spinInfo && (
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#aaa' }}>
                    Spin used: {spinInfo.usedSpins}/{spinInfo.spinLimit}
                  </div>
                )}
              </div>
            )}

            {error && <div className="error-box">{error}</div>}

            <div className="odds-card">
              <div className="odds-title">Peratusan Demo</div>
              <ul>
                <li><strong>RM100</strong> — 84%</li>
                <li><strong>RM288</strong> — 10%</li>
                <li><strong>RM388</strong> — 5%</li>
                <li><strong>RM588</strong> — 1%</li>
                <li><strong>5G Gold</strong> — 0%</li>
              </ul>
            </div>
          </section>

          <section className="panel wheel-panel">
            <div className="wheel-stage">
              <div className="pointer" />
              <div className="wheel" style={{ transform: `rotate(${angle}deg)` }}>
                {SEGMENTS.map((label, index) => {
                  const rotate = index * SEGMENT_DEG
                  return (
                    <div
                      key={`${label}-${index}`}
                      className={`segment seg-${index}`}
                      style={{ transform: `rotate(${rotate}deg)` }}
                    >
                      <span>{label}</span>
                    </div>
                  )
                })}
                <div className="wheel-center">SPIN</div>
              </div>
            </div>

            <button className="spin-btn" onClick={handleSpin} disabled={!canSpin}>
              {spinning ? 'Wheel sedang pusing...' : result ? 'Spin Dah Digunakan' : 'Putar Sekarang'}
            </button>

            <p className="helper-text">
              {verified
                ? result
                  ? 'Spin demo untuk login ini sudah direkodkan.'
                  : 'Login dah lulus. Tekan butang untuk cuba spin.'
                : 'Login dulu untuk unlock butang spin.'}
            </p>
          </section>
        </div>

        {result && (
          <section className="result-card" style={{ boxShadow: `0 0 40px ${currentMeta?.glow || '#ffb200'}55` }}>
            <div className="result-badge">{currentMeta?.badge || '🎁 Result'}</div>
            <h3>{result.prize}</h3>
            <p>{currentMeta?.note || 'Spin berjaya direkodkan.'}</p>
            <div className="result-meta">
              <div>
                <span>Claim ID</span>
                <strong>{result.claimId}</strong>
              </div>
              <div>
                <span>Masa Spin</span>
                <strong>{result.spunAt}</strong>
              </div>
              <div>
                <span>Login</span>
                <strong>{verified?.agentId} / {normalizeDisplayPhone(verified?.whatsapp || '')}</strong>
              </div>
            </div>
          </section>
        )}
      </div>

      <style jsx>{`
        .wheel-demo-page {
          min-height: 100vh;
          padding: 24px 16px 96px;
          background:
            radial-gradient(circle at top, rgba(255, 204, 51, 0.16), transparent 30%),
            linear-gradient(180deg, #16040a 0%, #250611 42%, #120209 100%);
          color: #fff;
        }
        .wheel-demo-shell {
          max-width: 1140px;
          margin: 0 auto;
        }
        .hero-card,
        .panel,
        .result-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 215, 0, 0.18);
          border-radius: 24px;
          backdrop-filter: blur(16px);
        }
        .hero-card {
          padding: 24px;
          margin-bottom: 18px;
        }
        .eyebrow {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 999px;
          background: linear-gradient(135deg, #ffd54f, #ff9800);
          color: #311400;
          font-weight: 800;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        h1 {
          margin: 0 0 8px;
          font-size: clamp(30px, 5vw, 48px);
          line-height: 1.02;
        }
        .hero-card p,
        .muted,
        .helper-text {
          color: rgba(255, 255, 255, 0.72);
          line-height: 1.6;
        }
        .content-grid {
          display: grid;
          grid-template-columns: 360px 1fr;
          gap: 18px;
          align-items: stretch;
        }
        .panel {
          padding: 22px;
        }
        .login-panel h2,
        .wheel-panel h2,
        .result-card h3 {
          margin: 0 0 6px;
        }
        label {
          display: block;
          margin-top: 14px;
        }
        label span {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.88);
          font-weight: 600;
        }
        input {
          width: 100%;
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(12, 8, 14, 0.85);
          color: #fff;
          padding: 14px 16px;
          font-size: 16px;
          outline: none;
        }
        input:focus {
          border-color: rgba(255, 215, 0, 0.7);
          box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.12);
        }
        .primary-btn,
        .spin-btn {
          width: 100%;
          margin-top: 16px;
          border: 0;
          border-radius: 999px;
          padding: 15px 18px;
          font-size: 16px;
          font-weight: 800;
          cursor: pointer;
          transition: 0.25s ease;
        }
        .primary-btn {
          background: linear-gradient(135deg, #ffd54f, #ff9800);
          color: #311400;
        }
        .spin-btn {
          max-width: 320px;
          background: linear-gradient(135deg, #ff5f6d, #ffc371);
          color: #2a0900;
          box-shadow: 0 16px 34px rgba(255, 120, 80, 0.2);
        }
        .primary-btn:disabled,
        .spin-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          box-shadow: none;
        }
        .success-box,
        .error-box,
        .odds-card {
          margin-top: 16px;
          border-radius: 16px;
          padding: 14px 16px;
        }
        .success-box {
          background: rgba(31, 162, 99, 0.18);
          border: 1px solid rgba(90, 255, 180, 0.28);
          line-height: 1.7;
        }
        .spun-box {
          background: rgba(255, 191, 0, 0.14);
          border-color: rgba(255, 215, 0, 0.24);
        }
        .error-box {
          background: rgba(255, 84, 84, 0.14);
          border: 1px solid rgba(255, 84, 84, 0.34);
          color: #ffb8b8;
        }
        .odds-card {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 215, 0, 0.12);
        }
        .odds-title {
          font-weight: 800;
          margin-bottom: 10px;
          color: #ffd54f;
        }
        .odds-card ul {
          margin: 0;
          padding-left: 18px;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.84);
        }
        .wheel-panel {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 680px;
        }
        .wheel-stage {
          position: relative;
          width: min(72vw, 520px);
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
        }
        .pointer {
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 18px solid transparent;
          border-right: 18px solid transparent;
          border-top: 34px solid #ffd54f;
          z-index: 5;
          filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.4));
        }
        .wheel {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 12px solid rgba(255, 215, 0, 0.85);
          box-shadow:
            0 0 0 10px rgba(255, 255, 255, 0.06),
            inset 0 0 40px rgba(0, 0, 0, 0.2),
            0 20px 60px rgba(0, 0, 0, 0.45);
          overflow: hidden;
          transition: transform 5.2s cubic-bezier(0.16, 1, 0.3, 1);
          background: #111;
        }
        .segment {
          position: absolute;
          width: 50%;
          height: 50%;
          left: 50%;
          top: 0;
          transform-origin: left bottom;
          clip-path: polygon(0 100%, 100% 0, 100% 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding-left: 58px;
        }
        .segment span {
          transform: rotate(68deg);
          font-size: clamp(11px, 1.45vw, 18px);
          font-weight: 900;
          letter-spacing: 0.03em;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.45);
          text-align: center;
          width: 120px;
        }
        .seg-0, .seg-2, .seg-4, .seg-6 {
          background: linear-gradient(135deg, #ffd54f, #ff9800);
          color: #2e1200;
        }
        .seg-1 {
          background: linear-gradient(135deg, #ff5f6d, #ffc371);
        }
        .seg-3 {
          background: linear-gradient(135deg, #8e2de2, #ff6fd8);
        }
        .seg-5 {
          background: linear-gradient(135deg, #00c6ff, #0072ff);
        }
        .seg-7 {
          background: linear-gradient(135deg, #f7971e, #ffd200);
          color: #2e1200;
        }
        .wheel-center {
          position: absolute;
          inset: 50%;
          width: 110px;
          height: 110px;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #fff3b0, #ff9800 70%, #d46a00 100%);
          color: #371500;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 900;
          border: 8px solid rgba(255, 255, 255, 0.8);
          z-index: 3;
          box-shadow: 0 0 24px rgba(255, 196, 0, 0.35);
        }
        .helper-text {
          text-align: center;
          margin-top: 10px;
        }
        .result-card {
          margin-top: 18px;
          padding: 22px;
        }
        .result-badge {
          display: inline-flex;
          padding: 7px 12px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.1);
          margin-bottom: 10px;
          font-weight: 700;
        }
        .result-meta {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 16px;
        }
        .result-meta div {
          padding: 14px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .result-meta span {
          display: block;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.58);
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .result-meta strong {
          display: block;
          word-break: break-word;
        }
        @media (max-width: 920px) {
          .content-grid {
            grid-template-columns: 1fr;
          }
          .wheel-panel {
            min-height: unset;
          }
          .wheel-stage {
            width: min(88vw, 480px);
          }
          .result-meta {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
