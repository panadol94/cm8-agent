'use client'

import { useMemo, useState, useEffect, useRef, useCallback } from 'react'

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
  spin?: { prize: string; claimId: string; spunAt: string }
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

const SEGMENTS = ['RM100', 'RM288', 'RM100', 'RM388', 'RM100', 'RM588', 'RM100', '5G GOLD']
const SEGMENT_DEG = 360 / SEGMENTS.length

const PRIZE_META: Record<string, { badge: string; glow: string; note: string; emoji: string }> = {
  RM100: { badge: '🔥 Hot Prize', glow: '#ffb200', note: 'Hadiah paling common - RM100 kredit akaun!', emoji: '💰' },
  RM288: { badge: '✨ Rare', glow: '#ff6b81', note: 'Rare tier kedua - RM288 kredit!', emoji: '💎' },
  RM388: { badge: '💎 Ultra Rare', glow: '#c471ed', note: 'Ultra rare - RM388 kredit jackpot!', emoji: '🌟' },
  RM588: { badge: '👑 Jackpot', glow: '#4facfe', note: 'Jackpot maxi! RM588 kredit - rare gila!', emoji: '👑' },
  '5G GOLD': { badge: '🪙 Demo Only', glow: '#ffd54f', note: 'Display segment sahaja - odds 0%', emoji: '🪙' },
}

function prizeToSegmentIndex(prize: string) {
  const matches = SEGMENTS.map((label, index) => ({ label, index })).filter((e) => e.label === prize)
  if (matches.length === 0) return 0
  return matches[Math.floor(Math.random() * matches.length)].index
}

function normalizeDisplayPhone(value: string) {
  const digits = String(value || '').replace(/\D/g, '')
  if (!digits) return '-'
  if (digits.startsWith('60')) return `+${digits}`
  return digits
}

interface Particle {
  x: number; y: number; vx: number; vy: number
  size: number; color: string; rotation: number; rotSpeed: number
  life: number; maxLife: number; shape: number
}

function spawnParticles(cx: number, cy: number, count = 90): Particle[] {
  const colors = ['#ffd700', '#ff6b4a', '#ffcf33', '#ff9800', '#ffffff', '#ff4444', '#4facfe', '#c471ed']
  const particles: Particle[] = []
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = 2 + Math.random() * 7
    particles.push({
      x: cx, y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3,
      size: 4 + Math.random() * 7,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 12,
      life: 0,
      maxLife: 50 + Math.random() * 50,
      shape: Math.floor(Math.random() * 3),
    })
  }
  return particles
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
  const [showConfetti, setShowConfetti] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])
  const confettiRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const angleRef = useRef(0)

  useEffect(() => {
    fetch('/api/wheel-demo/public')
      .then((r) => r.json())
      .then((data) => setConfig(data))
      .catch(() => {})
  }, [])

  const animateConfetti = useCallback(() => {
    const canvas = confettiRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    let alive = false
    for (const p of particles) {
      p.life++
      if (p.life > p.maxLife) continue
      alive = true
      p.x += p.vx
      p.y += p.vy
      p.vy += 0.15
      p.vx *= 0.98
      p.rotation += p.rotSpeed
      const alpha = 1 - p.life / p.maxLife
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate((p.rotation * Math.PI) / 180)
      ctx.globalAlpha = alpha
      ctx.fillStyle = p.color
      if (p.shape === 0) ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
      else if (p.shape === 1) { ctx.beginPath(); ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2); ctx.fill() }
      else {
        ctx.beginPath()
        ctx.moveTo(0, -p.size / 2)
        ctx.lineTo(p.size / 3, 0)
        ctx.lineTo(0, p.size / 2)
        ctx.lineTo(-p.size / 3, 0)
        ctx.closePath()
        ctx.fill()
      }
      ctx.restore()
    }
    if (alive) animRef.current = requestAnimationFrame(animateConfetti)
    else setShowConfetti(false)
  }, [particles])

  useEffect(() => {
    if (showConfetti) animRef.current = requestAnimationFrame(animateConfetti)
    return () => cancelAnimationFrame(animRef.current)
  }, [showConfetti, animateConfetti])

  const prizes = config?.prizes || [
    { label: 'RM100', weight: 84, colorA: '#ffcf33', colorB: '#ff9800' },
    { label: 'RM288', weight: 10, colorA: '#ff5f6d', colorB: '#ffc371' },
    { label: 'RM388', weight: 5, colorA: '#8e2de2', colorB: '#ff6fd8' },
    { label: 'RM588', weight: 1, colorA: '#00c6ff', colorB: '#0072ff' },
  ]

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
      const vs = { agentId: data.agentId || agentId.trim(), whatsapp: data.whatsapp || whatsapp.trim() }
      setVerified(vs)
      setAgentId(vs.agentId)
      setWhatsapp(vs.whatsapp)
      if (data.spinLimit) setSpinInfo({ spinLimit: data.spinLimit, usedSpins: data.usedSpins || 0, remainingSpins: data.remainingSpins || 0 })
      if (data.alreadySpun && data.spin) setResult({ prize: data.spin.prize, claimId: data.spin.claimId, spunAt: data.spin.spunAt })
      else setResult(null)
    } catch { setError('Tak dapat connect ke server demo.') }
    finally { setLoading(false) }
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
      const segIdx = prizeToSegmentIndex(data.prize)
      const segCenter = segIdx * SEGMENT_DEG + SEGMENT_DEG / 2
      const extraTurns = 6 * 360
      const finalOffset = 360 - segCenter
      const startAngle = angleRef.current
      const finalAngle = startAngle + extraTurns + finalOffset + 720
      const duration = 5000
      const startTime = performance.now()
      const animateSpin = (now: number) => {
        const t = Math.min((now - startTime) / duration, 1)
        const eased = 1 - Math.pow(1 - t, 4)
        const cur = startAngle + (finalAngle - startAngle) * eased
        angleRef.current = cur
        setAngle(cur)
        if (t < 1) requestAnimationFrame(animateSpin)
        else {
          setResult({ prize: data.prize!, claimId: data.claimId!, spunAt: data.spunAt! })
          setSpinning(false)
          if (data.prize !== '5G GOLD') {
            setParticles(spawnParticles(window.innerWidth / 2, window.innerHeight / 2))
            setShowConfetti(true)
          }
        }
      }
      requestAnimationFrame(animateSpin)
    } catch { setError('Ralat masa spin. Cuba lagi.'); setSpinning(false) }
  }

  const canSpin = Boolean(verified && !result && !spinning)

  return (
    <div className="wl-page">
      {showConfetti && <canvas ref={confettiRef} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 9999 }} />}
      <div className="wl-shell">
        <div className="wl-hero">
          <div className="wl-badge"><span className="wl-dot" />🎡 Lucky Wheel Event</div>
          <h1>CM8 Lucky Wheel</h1>
          <p>Masukkan <strong>ID Agent + WhatsApp</strong> yang dah ada dalam whitelist. Lepas tu spin dan menangi kredit eksklusif!</p>
        </div>
        <div className="wl-grid">
          <section className="wl-panel wl-login">
            <div className="wl-panel-title">🔐 Login Event</div>
            <p className="wl-muted">ID Agent & WhatsApp wajib match dalam senarai admin.</p>
            <label><span>ID Agent</span>
              <input value={agentId} onChange={(e) => setAgentId(e.target.value)} placeholder="Contoh: Garry" autoCapitalize="off" disabled={spinning} />
            </label>
            <label><span>WhatsApp</span>
              <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="Contoh: 0178182320" inputMode="numeric" disabled={spinning} />
            </label>
            <button className="wl-btn-primary" onClick={handleLogin} disabled={loading || spinning}>
              {loading ? '⏳ Checking...' : '✅ Login'}
            </button>
            {verified && !result && (
              <div className="wl-success">
                <div className="wl-success-title">✅ Login Berjaya</div>
                <div className="wl-success-row"><span>ID:</span><strong>{verified.agentId}</strong></div>
                <div className="wl-success-row"><span>WA:</span><strong>{normalizeDisplayPhone(verified.whatsapp)}</strong></div>
                {spinInfo && (
                  <div className="wl-spin-info">
                    <div className="wl-spin-label">Spin Anda</div>
                    <div className="wl-spin-numbers"><span className="wl-used">{spinInfo.usedSpins}</span><span className="wl-sep">/</span><span className="wl-total">{spinInfo.spinLimit}</span></div>
                    <div className="wl-progress"><div className="wl-progress-fill" style={{ width: `${(spinInfo.usedSpins / spinInfo.spinLimit) * 100}%` }} /></div>
                  </div>
                )}
              </div>
            )}
            {result && (
              <div className="wl-success wl-spun">
                <div className="wl-success-title">✅ Spin Sudah Guna</div>
                <div className="wl-success-row"><span>Hadiah:</span><strong className="wl-prize">{result.prize}</strong></div>
                <div className="wl-success-row"><span>Claim ID:</span><strong className="wl-claim">{result.claimId}</strong></div>
              </div>
            )}
            {error && <div className="wl-error">⚠️ {error}</div>}
          </section>
          <section className="wl-panel wl-wheel-section">
            <div className="wl-wheel-wrap">
              <div className="wl-glow-ring ring1" /><div className="wl-glow-ring ring2" />
              <div className="wl-pointer" />
              <div className={`wl-wheel ${spinning ? 'wl-spinning' : ''}`} style={{ transform: `rotate(${angle}deg)` }}>
                {SEGMENTS.map((label, i) => {
                  const rot = i * SEGMENT_DEG
                  const colors = [['#ffd700','#ff9800'],['#ff5f6d','#ffc371'],['#ffd700','#ff9800'],['#8e2de2','#ff6fd8'],['#ffd700','#ff9800'],['#00c6ff','#0072ff'],['#ffd700','#ff9800'],['#f7971e','#ffd200']]
                  const [c1, c2] = colors[i]
                  return (
                    <div key={`${label}-${i}`} className={`wl-seg seg-${i}`} style={{ transform: `rotate(${rot}deg)`, background: `linear-gradient(135deg, ${c1}, ${c2})` }}>
                      <span>{label}</span>
                    </div>
                  )
                })}
                <div className="wl-wheel-center"><span>SPIN</span></div>
              </div>
            </div>
            <button className={`wl-btn-spin ${spinning ? 'wl-disabled' : ''} ${result ? 'wl-done' : ''}`} onClick={handleSpin} disabled={!canSpin}>
              {spinning ? '⏳ Sedang pusing...' : result ? 'Spin Dah Guna' : '🎰 PUTAR SEKARANG!'}
            </button>
            <p className="wl-helper">{verified ? (result ? 'Spin sudah direkodkan.' : 'Login ok - tekan untuk spin!') : 'Login dulu untuk unlock butang.'}</p>
            <div className="wl-odds">
              <div className="wl-odds-title">🏆 Odds Probability</div>
              {prizes.map((p) => (
                <div key={p.label} className="wl-odds-row">
                  <span className="wl-odds-name">{p.label}</span>
                  <div className="wl-odds-bg"><div className="wl-odds-fill" style={{ width: `${p.weight}%` }} /></div>
                  <span className="wl-odds-pct">{p.weight}%</span>
                </div>
              ))}
            </div>
          </section>
        </div>
        {result && currentMeta && (
          <section className="wl-result" style={{ boxShadow: `0 0 60px ${currentMeta.glow}44` }}>
            <div className="wl-result-emoji">{currentMeta.emoji}</div>
            <div className="wl-result-badge">{currentMeta.badge}</div>
            <h3>{result.prize}</h3>
            <p>{currentMeta.note}</p>
            <div className="wl-result-meta">
              <div><span>Claim ID</span><strong className="wl-claim">{result.claimId}</strong></div>
              <div><span>Masa</span><strong>{result.spunAt}</strong></div>
              <div><span>Agent</span><strong>{verified?.agentId}</strong></div>
            </div>
          </section>
        )}
      </div>
      <style jsx>{`
        .wl-page { min-height: 100vh; padding: 24px 16px 100px; background: radial-gradient(ellipse at top, rgba(255,215,0,0.1) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(230,53,32,0.07) 0%, transparent 50%), linear-gradient(180deg, #0d0206 0%, #1a0505 40%, #0d0206 100%); color: #fff; }
        .wl-shell { max-width: 1140px; margin: 0 auto; }
        .wl-hero { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,215,0,0.15); border-radius: 24px; padding: 28px 32px; margin-bottom: 20px; position: relative; overflow: hidden; }
        .wl-hero::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #ffd700, #ff6b4a, #ffd700); }
        .wl-badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 999px; background: rgba(255,215,0,0.12); border: 1px solid rgba(255,215,0,0.25); color: #ffd700; font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 14px; }
        .wl-dot { width: 7px; height: 7px; border-radius: 50%; background: #ffd700; animation: wlpulse 1.5s ease-in-out infinite; }
        @keyframes wlpulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.7)} }
        h1 { margin: 0 0 10px; font-size: clamp(32px,5vw,52px); font-weight: 900; background: linear-gradient(135deg, #ffd700 0%, #ff9800 50%, #ffd700 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; line-height: 1.1; }
        .wl-hero p { color: rgba(255,255,255,0.6); line-height: 1.65; font-size: 15px; }
        .wl-hero p strong { color: #ffd700; }
        .wl-grid { display: grid; grid-template-columns: 380px 1fr; gap: 20px; align-items: stretch; }
        .wl-panel { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,215,0,0.12); border-radius: 24px; padding: 24px; backdrop-filter: blur(16px); }
        .wl-panel-title { font-size: 20px; font-weight: 800; color: #ffd700; margin-bottom: 8px; }
        .wl-muted { color: rgba(255,255,255,0.55); font-size: 13px; margin: 0 0 16px; line-height: 1.5; }
        label { display: block; margin-top: 14px; }
        label span { display: block; margin-bottom: 7px; font-size: 12px; color: rgba(255,255,255,0.7); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
        input { width: 100%; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.4); color: #fff; padding: 13px 15px; font-size: 15px; outline: none; transition: border-color 0.2s, box-shadow 0.2s; box-sizing: border-box; }
        input:focus { border-color: rgba(255,215,0,0.5); box-shadow: 0 0 0 3px rgba(255,215,0,0.08); }
        input:disabled { opacity: 0.5; cursor: not-allowed; }
        .wl-btn-primary, .wl-btn-spin { width: 100%; margin-top: 16px; border: 0; border-radius: 999px; padding: 15px 20px; font-size: 16px; font-weight: 800; cursor: pointer; transition: all 0.25s ease; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .wl-btn-primary { background: linear-gradient(135deg, #ffd700, #ff9800); color: #1a0505; box-shadow: 0 4px 20px rgba(255,215,0,0.2); }
        .wl-btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 28px rgba(255,215,0,0.3); }
        .wl-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .wl-btn-spin { max-width: 340px; background: linear-gradient(135deg, #ff5f6d, #ffc371); color: #2a0500; box-shadow: 0 8px 30px rgba(255,95,109,0.2); font-size: 17px; }
        .wl-btn-spin:hover:not(:disabled) { transform: translateY(-3px) scale(1.02); box-shadow: 0 12px 40px rgba(255,95,109,0.3); }
        .wl-btn-spin.wl-disabled, .wl-btn-spin:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }
        .wl-btn-spin.wl-done { background: linear-gradient(135deg, #444, #333); color: #888; box-shadow: none; }
        .wl-success { margin-top: 14px; border-radius: 14px; padding: 14px; background: rgba(37,211,102,0.1); border: 1px solid rgba(37,211,102,0.2); }
        .wl-success-title { font-weight: 700; color: #4ade80; margin-bottom: 10px; font-size: 13px; }
        .wl-success-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 13px; color: rgba(255,255,255,0.65); border-bottom: 1px solid rgba(255,255,255,0.04); }
        .wl-success-row:last-child { border-bottom: none; }
        .wl-success-row strong { color: #fff; }
        .wl-spun { background: rgba(255,215,0,0.08); border-color: rgba(255,215,0,0.18); }
        .wl-spun .wl-success-title { color: #ffd700; }
        .wl-prize { color: #ffd700 !important; font-size: 15px !important; }
        .wl-claim { font-family: monospace; font-size: 11px !important; color: #4facfe !important; background: rgba(79,172,254,0.1); padding: 2px 7px; border-radius: 4px; }
        .wl-error { margin-top: 12px; border-radius: 12px; padding: 12px; background: rgba(255,84,84,0.1); border: 1px solid rgba(255,84,84,0.2); color: #ffb8b8; font-size: 13px; }
        .wl-spin-info { margin-top: 10px; padding: 10px; background: rgba(0,0,0,0.2); border-radius: 10px; }
        .wl-spin-label { font-size: 10px; color: rgba(255,255,255,0.45); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 5px; }
        .wl-spin-numbers { font-size: 20px; font-weight: 900; margin-bottom: 7px; }
        .wl-used { color: #ffd700; } .wl-sep { color: rgba(255,255,255,0.25); margin: 0 4px; } .wl-total { color: rgba(255,255,255,0.4); }
        .wl-progress { height: 3px; background: rgba(255,255,255,0.08); border-radius: 2px; overflow: hidden; }
        .wl-progress-fill { height: 100%; background: linear-gradient(90deg, #ffd700, #ff9800); border-radius: 2px; transition: width 0.5s; }
        .wl-wheel-section { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 720px; }
        .wl-wheel-wrap { position: relative; width: min(68vw, 480px); aspect-ratio: 1; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
        .wl-glow-ring { position: absolute; border-radius: 50%; border: 2px solid rgba(255,215,0,0.08); animation: wlring 25s linear infinite; }
        .ring1 { width: 106%; height: 106%; animation-duration: 30s; }
        .ring2 { width: 112%; height: 112%; animation-direction: reverse; animation-duration: 22s; }
        @keyframes wlring { to { transform: rotate(360deg); } }
        .wl-pointer { position: absolute; top: -8px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 20px solid transparent; border-right: 20px solid transparent; border-top: 38px solid #ffd700; z-index: 10; filter: drop-shadow(0 6px 16px rgba(0,0,0,0.5)); }
        .wl-wheel { position: relative; width: 100%; height: 100%; border-radius: 50%; border: 14px solid rgba(255,215,0,0.9); box-shadow: 0 0 0 8px rgba(255,255,255,0.04), 0 0 40px rgba(255,215,0,0.15), inset 0 0 50px rgba(0,0,0,0.2), 0 24px 70px rgba(0,0,0,0.5); overflow: hidden; transition: transform 5s cubic-bezier(0.16,1,0.3,1); background: #111; }
        .wl-wheel.wl-spinning { box-shadow: 0 0 0 8px rgba(255,255,255,0.04), 0 0 60px rgba(255,215,0,0.35), inset 0 0 50px rgba(0,0,0,0.2), 0 24px 70px rgba(0,0,0,0.5); }
        .wl-seg { position: absolute; width: 50%; height: 50%; left: 50%; top: 0; transform-origin: left bottom; clip-path: polygon(0 100%, 100% 0, 100% 100%); display: flex; align-items: center; justify-content: center; padding-left: 55px; }
        .wl-seg span { transform: rotate(68deg); font-size: clamp(10px,1.3vw,16px); font-weight: 900; text-shadow: 0 2px 8px rgba(0,0,0,0.5); text-align: center; width: 110px; }
        .seg-0 span, .seg-2 span, .seg-4 span, .seg-6 span { color: #2e1200; }
        .seg-1 span, .seg-3 span, .seg-5 span, .seg-7 span { color: #fff; }
        .wl-wheel-center { position: absolute; inset: 50%; width: 100px; height: 100px; transform: translate(-50%,-50%); border-radius: 50%; background: radial-gradient(circle at 30% 30%, #fff3b0, #ff9800 70%, #d46a00 100%); display: flex; align-items: center; justify-content: center; z-index: 3; box-shadow: 0 0 24px rgba(255,196,0,0.3); border: 7px solid rgba(255,255,255,0.75); }
        .wl-wheel-center span { font-size: 20px; font-weight: 900; color: #371500; letter-spacing: 0.05em; }
        .wl-helper { text-align: center; margin-top: 10px; font-size: 13px; color: rgba(255,255,255,0.45); }
        .wl-odds { margin-top: 20px; width: 100%; max-width: 340px; background: rgba(255,255,255,0.03); border-radius: 14px; padding: 16px; border: 1px solid rgba(255,215,0,0.08); }
        .wl-odds-title { font-size: 12px; font-weight: 700; color: #ffd700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; }
        .wl-odds-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
        .wl-odds-row:last-child { margin-bottom: 0; }
        .wl-odds-name { font-size: 13px; font-weight: 700; min-width: 70px; color: rgba(255,255,255,0.8); }
        .wl-odds-bg { flex: 1; height: 6px; background: rgba(255,255,255,0.08); border-radius: 3px; overflow: hidden; }
        .wl-odds-fill { height: 100%; background: linear-gradient(90deg, #ffd700, #ff9800); border-radius: 3px; }
        .wl-odds-pct { font-size: 12px; font-weight: 700; color: #ffd700; min-width: 35px; text-align: right; }
        .wl-result { margin-top: 20px; padding: 28px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,215,0,0.2); border-radius: 24px; text-align: center; }
        .wl-result-emoji { font-size: 64px; margin-bottom: 8px; }
        .wl-result-badge { display: inline-block; padding: 5px 14px; border-radius: 999px; background: rgba(255,255,255,0.08); font-size: 12px; font-weight: 700; color: #ffd700; margin-bottom: 12px; }
        .wl-result h3 { font-size: 32px; font-weight: 900; color: #ffd700; margin: 0 0 8px; }
        .wl-result p { color: rgba(255,255,255,0.6); font-size: 14px; margin: 0 0 16px; line-height: 1.6; }
        .wl-result-meta { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
        .wl-result-meta div { padding: 12px; border-radius: 12px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); }
        .wl-result-meta span { display: block; font-size: 10px; color: rgba(255,255,255,0.45); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 5px; }
        .wl-result-meta strong { font-size: 13px; word-break: break-all; }
        @media (max-width: 920px) {
          .wl-grid { grid-template-columns: 1fr; }
          .wl-wheel-section { min-height: unset; }
          .wl-wheel-wrap { width: min(85vw, 420px); }
          .wl-result-meta { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}
