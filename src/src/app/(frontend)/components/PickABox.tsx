'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'

/* ─── Types ─── */
interface EventInfo {
  title: string
  prize: string
  boxes: number
  claimMinutes: number
  endTime: string
}

interface PlayResult {
  result: 'win' | 'lose'
  prize?: string
  claimMinutes?: number
  claimDeadline?: string
  totalWinners: number
  maxWinners: number
}

/* ─── Browser Fingerprint ─── */
async function getFingerprint(): Promise<string> {
  const components: string[] = []
  components.push(`${screen.width}x${screen.height}x${screen.colorDepth}`)
  components.push(`${screen.availWidth}x${screen.availHeight}`)
  components.push(Intl.DateTimeFormat().resolvedOptions().timeZone)
  components.push(navigator.language)
  components.push((navigator.languages || []).join(','))
  components.push(navigator.platform || '')
  components.push(String(navigator.hardwareConcurrency || 0))
  components.push(String((navigator as unknown as Record<string, unknown>).deviceMemory || 0))
  components.push(String(navigator.maxTouchPoints || 0))
  try {
    const canvas = document.createElement('canvas')
    canvas.width = 200; canvas.height = 50
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.textBaseline = 'top'; ctx.font = '14px Arial'
      ctx.fillStyle = '#f60'; ctx.fillRect(0, 0, 200, 50)
      ctx.fillStyle = '#069'; ctx.fillText('CM8VVIP-FP-2026', 2, 15)
      ctx.fillStyle = 'rgba(102,204,0,0.7)'; ctx.fillText('event-fingerprint', 4, 30)
      components.push(canvas.toDataURL())
    }
  } catch { components.push('no-canvas') }
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl')
    if (gl) {
      const dbg = gl.getExtension('WEBGL_debug_renderer_info')
      if (dbg) {
        components.push(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || '')
        components.push(gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) || '')
      }
    }
  } catch { components.push('no-webgl') }
  const raw = components.join('||')
  const data = new TextEncoder().encode(raw)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('')
}

/* ─── Confetti ─── */
interface Particle {
  x: number; y: number; vx: number; vy: number
  size: number; color: string; rotation: number; rotSpeed: number
  life: number; maxLife: number; shape: number
}

function createConfetti(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  const particles: Particle[] = []
  const colors = ['#FFD700', '#e63520', '#ff6b4a', '#ff8c42', '#ffa500', '#fff1b8', '#FF4081']
  for (let i = 0; i < 150; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      vx: (Math.random() - 0.5) * 6,
      vy: Math.random() * 3 + 2,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10,
      life: 0, maxLife: 150 + Math.random() * 100,
      shape: Math.floor(Math.random() * 3),
    })
  }
  let frame: number
  function animate() {
    ctx!.clearRect(0, 0, canvas.width, canvas.height)
    let alive = 0
    for (const p of particles) {
      p.life++
      if (p.life > p.maxLife) continue
      alive++
      p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.rotation += p.rotSpeed
      const alpha = 1 - p.life / p.maxLife
      ctx!.save()
      ctx!.translate(p.x, p.y)
      ctx!.rotate((p.rotation * Math.PI) / 180)
      ctx!.globalAlpha = alpha
      ctx!.fillStyle = p.color
      if (p.shape === 0) ctx!.fillRect(-p.size / 2, -p.size / 2, p.size, p.size)
      else if (p.shape === 1) { ctx!.beginPath(); ctx!.arc(0, 0, p.size / 2, 0, Math.PI * 2); ctx!.fill() }
      else { ctx!.beginPath(); ctx!.moveTo(0, -p.size / 2); ctx!.lineTo(p.size / 2, p.size / 2); ctx!.lineTo(-p.size / 2, p.size / 2); ctx!.fill() }
      ctx!.restore()
    }
    if (alive > 0) frame = requestAnimationFrame(animate)
  }
  frame = requestAnimationFrame(animate)
  return () => cancelAnimationFrame(frame)
}

/* ─── Countdown Timer ─── */
function CountdownTimer({ deadline }: { deadline: string }) {
  const [timeLeft, setTimeLeft] = useState('')
  const [expired, setExpired] = useState(false)
  useEffect(() => {
    const tick = () => {
      const diff = new Date(deadline).getTime() - Date.now()
      if (diff <= 0) { setTimeLeft('00:00'); setExpired(true); return }
      const mins = Math.floor(diff / 60000)
      const secs = Math.floor((diff % 60000) / 1000)
      setTimeLeft(`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`)
    }
    tick()
    const iv = setInterval(tick, 1000)
    return () => clearInterval(iv)
  }, [deadline])
  return (
    <div className="pab-countdown" data-expired={expired ? 'true' : undefined}>
      {expired ? '⏰ Masa tamat!' : `⏱️ ${timeLeft}`}
    </div>
  )
}

/* ═══════════════════════════════════════════
   Main Component — CM8 Premium Theme
   ═══════════════════════════════════════════ */
export default function PickABox() {
  const [phase, setPhase] = useState<'code' | 'join' | 'game' | 'revealing' | 'result'>('code')
  const [joinClicked, setJoinClicked] = useState(false)
  const [code, setCode] = useState('')
  const [playerId, setPlayerId] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [eventInfo, setEventInfo] = useState<EventInfo | null>(null)
  const [fingerprint, setFingerprint] = useState('')
  const [selectedBox, setSelectedBox] = useState<number | null>(null)
  const [playResult, setPlayResult] = useState<PlayResult | null>(null)
  const [revealedBoxes, setRevealedBoxes] = useState<boolean[]>([false, false, false])
  const confettiRef = useRef<HTMLCanvasElement>(null)
  const [eventStatus, setEventStatus] = useState<{ winnersRemaining: number; totalPlays: number } | null>(null)
  const [hoverBox, setHoverBox] = useState<number | null>(null)
  const [whatsappNumber, setWhatsappNumber] = useState('')

  const normalizedWhatsapp = whatsappNumber.replace(/\D/g, '')
  const isWhatsappValid = normalizedWhatsapp.length >= 10 && normalizedWhatsapp.length <= 15

  useEffect(() => {
    getFingerprint().then(setFingerprint)
    const played = localStorage.getItem('cm8_event_played')
    if (played) {
      setError('Anda sudah bermain! Satu percubaan sahaja.')
      setPhase('result')
    }
    fetch('/api/event/status')
      .then(r => r.json())
      .then(data => {
        if (data.active) setEventStatus({ winnersRemaining: data.winnersRemaining, totalPlays: data.totalPlays })
      })
      .catch(() => {})
  }, [])

  const handleSubmitCode = useCallback(async () => {
    if (!code.trim()) { setError('Sila masukkan kod event'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/event/validate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim(), fingerprint }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Kod tidak sah')
        if (data.alreadyPlayed) localStorage.setItem('cm8_event_played', '1')
        return
      }
      setEventInfo(data); setPhase('join')
    } catch { setError('Gagal mengesahkan kod. Cuba lagi.') }
    finally { setLoading(false) }
  }, [code, fingerprint])

  const handlePickBox = useCallback(async (boxIndex: number) => {
    if (selectedBox !== null || phase !== 'game') return
    setSelectedBox(boxIndex); setPhase('revealing'); setLoading(true)
    try {
      const res = await fetch('/api/event/play', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.trim(),
          fingerprint,
          boxPicked: boxIndex,
          playerId: playerId.trim(),
          whatsappNumber: normalizedWhatsapp,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Error bermain')
        if (data.alreadyPlayed) localStorage.setItem('cm8_event_played', '1')
        setPhase('result'); return
      }
      localStorage.setItem('cm8_event_played', '1')
      setPlayResult(data)
      const otherBoxes = [0, 1, 2].filter(i => i !== boxIndex)
      setTimeout(() => {
        setRevealedBoxes(prev => { const n = [...prev]; n[otherBoxes[0]] = true; return n })
      }, 800)
      setTimeout(() => {
        setRevealedBoxes(prev => { const n = [...prev]; n[otherBoxes[1]] = true; return n })
      }, 1600)
      setTimeout(() => {
        setRevealedBoxes(prev => { const n = [...prev]; n[boxIndex] = true; return n })
        setPhase('result')
        if (data.result === 'win' && confettiRef.current) createConfetti(confettiRef.current)
      }, 2400)
    } catch { setError('Gagal bermain. Cuba lagi.'); setPhase('game'); setSelectedBox(null) }
    finally { setLoading(false) }
  }, [code, fingerprint, selectedBox, phase, playerId, normalizedWhatsapp])

  return (
    <>
      <style>{`
        /* ── Pick A Box — CM8 Premium Theme ── */
        .pab-wrapper {
          min-height: 100vh;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 20px; position: relative; overflow: hidden;
          background: linear-gradient(135deg, #1a0505 0%, #3d0a0a 35%, #1a0a00 70%, #0a0a0a 100%);
        }
        /* Subtle pattern */
        .pab-wrapper::before {
          content: ''; position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 40px 40px; opacity: 0.4; pointer-events: none;
        }
        /* Ambient glow orbs */
        .pab-orb { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; }
        .pab-orb-1 { width: 350px; height: 350px; background: rgba(230,53,32,0.12); top: -80px; left: -60px; animation: pabOrbFloat 8s ease-in-out infinite; }
        .pab-orb-2 { width: 300px; height: 300px; background: rgba(255,140,66,0.08); bottom: -60px; right: -40px; animation: pabOrbFloat 8s ease-in-out infinite 3s; }
        .pab-orb-3 { width: 200px; height: 200px; background: rgba(255,215,0,0.06); top: 40%; left: 50%; transform: translate(-50%,-50%); animation: pabOrbFloat 8s ease-in-out infinite 5s; }
        @keyframes pabOrbFloat {
          0%,100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(20px,-30px) scale(1.1); }
          66% { transform: translate(-15px,20px) scale(0.9); }
        }

        /* Main card */
        .pab-card {
          position: relative; z-index: 10; max-width: 480px; width: 100%;
          background: rgba(255,255,255,0.06); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(230,53,32,0.2); border-radius: 24px;
          padding: 40px 28px; text-align: center;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 60px rgba(230,53,32,0.05);
        }
        .pab-card::before {
          content: ''; position: absolute; top: -1px; left: 15%; right: 15%; height: 2px;
          background: linear-gradient(90deg, transparent, rgba(230,53,32,0.5), rgba(255,140,66,0.5), transparent);
          border-radius: 2px;
        }
        /* Shimmer sweep */
        .pab-card::after {
          content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent);
          animation: pabShimmer 4s ease-in-out infinite; pointer-events: none; border-radius: 24px;
        }
        @keyframes pabShimmer { 0% { left: -100%; } 50% { left: 100%; } 100% { left: 100%; } }

        /* Logo */
        .pab-logo {
          width: 64px; height: 64px; margin: 0 auto 20px; border-radius: 50%;
          background: linear-gradient(135deg, #e63520, #ff6b4a);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 8px 32px rgba(230,53,32,0.3);
          animation: pabLogoPulse 3s ease-in-out infinite;
        }
        .pab-logo img { width: 48px; height: 48px; border-radius: 8px; }
        @keyframes pabLogoPulse {
          0%,100% { box-shadow: 0 8px 32px rgba(230,53,32,0.3); }
          50% { box-shadow: 0 8px 48px rgba(230,53,32,0.5); }
        }

        /* Headings */
        .pab-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 2rem; font-weight: 900; margin-bottom: 8px;
          background: linear-gradient(135deg, #FFD700, #ffa500, #ff8c42);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          text-shadow: none; letter-spacing: -0.02em;
        }
        .pab-subtitle { color: rgba(255,255,255,0.65); font-size: 0.92rem; margin-bottom: 24px; font-weight: 400; }

        .pab-notice {
          background: linear-gradient(135deg, rgba(255,215,0,0.14), rgba(255,140,66,0.08));
          border: 1px solid rgba(255,215,0,0.35);
          border-radius: 14px;
          color: #ffe7a3;
          font-size: 0.86rem;
          font-weight: 600;
          line-height: 1.45;
          padding: 10px 14px;
          margin: -8px 0 14px;
        }
        .pab-notice strong { color: #FFD700; }
        .pab-sponsor {
          color: rgba(255,255,255,0.6);
          font-size: 0.78rem;
          margin: -2px 0 16px;
          text-align: center;
        }
        .pab-sponsor strong { color: #ffd27a; font-weight: 700; }

        /* Status badge */
        .pab-status {
          background: linear-gradient(135deg, rgba(230,53,32,0.12), rgba(255,140,66,0.08));
          border: 1px solid rgba(230,53,32,0.2); border-radius: 16px;
          padding: 14px 18px; margin-bottom: 24px;
        }
        .pab-status-main { color: #FFD700; font-size: 0.88rem; font-weight: 600; }
        .pab-status-main strong { font-size: 1.2rem; font-weight: 900; }
        .pab-status-sub { color: rgba(255,255,255,0.4); font-size: 0.75rem; margin-top: 4px; }

        /* Input */
        .pab-input {
          width: 100%; padding: 16px 20px; font-size: 1.2rem; font-weight: 700;
          text-align: center; letter-spacing: 4px; box-sizing: border-box;
          background: rgba(255,255,255,0.06); border: 2px solid rgba(230,53,32,0.25);
          border-radius: 16px; color: #fff; outline: none;
          font-family: 'Inter', sans-serif; transition: all 0.3s;
        }
        .pab-input:focus { border-color: rgba(230,53,32,0.6); box-shadow: 0 0 20px rgba(230,53,32,0.15); }
        .pab-input::placeholder { color: rgba(255,255,255,0.2); letter-spacing: 2px; font-weight: 400; font-size: 0.95rem; }

        /* Error */
        .pab-error {
          background: rgba(230,53,32,0.1); border: 1px solid rgba(230,53,32,0.25);
          border-radius: 12px; padding: 12px 16px; margin: 16px 0;
          color: #ff6b6b; font-size: 0.88rem;
        }

        /* Submit button */
        .pab-btn {
          width: 100%; padding: 16px; font-size: 1.05rem; font-weight: 700;
          border: none; border-radius: 16px; cursor: pointer;
          font-family: 'Inter', sans-serif; transition: all 0.3s;
          position: relative; overflow: hidden;
        }
        .pab-btn-active {
          background: linear-gradient(135deg, #e63520, #ff6b4a);
          color: #fff; box-shadow: 0 4px 24px rgba(230,53,32,0.35);
        }
        .pab-btn-active:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(230,53,32,0.45); }
        .pab-btn-active::after {
          content: ''; position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          animation: pabBtnShine 3s ease-in-out infinite;
        }
        @keyframes pabBtnShine { 0% { left: -100%; } 50%,100% { left: 150%; } }
        .pab-btn-disabled {
          background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.2); cursor: not-allowed;
        }

        /* ── Game Phase ── */
        .pab-game-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.4rem; font-weight: 800; margin-bottom: 6px;
          background: linear-gradient(135deg, #e63520, #ff6b4a, #ff8c42);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .pab-prize {
          color: #FFD700; font-size: 1.1rem; font-weight: 700; margin-bottom: 28px;
        }
        .pab-prize span { font-size: 1.5rem; font-weight: 900; }

        /* Boxes */
        .pab-boxes { display: flex; justify-content: center; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }

        .pab-box {
          width: 130px; height: 150px; border-radius: 20px; cursor: pointer;
          border: 2px solid rgba(230,53,32,0.2);
          background: linear-gradient(145deg, rgba(255,255,255,0.07), rgba(230,53,32,0.06));
          backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          transition: all 0.4s cubic-bezier(0.175,0.885,0.32,1.275);
          position: relative; overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06);
        }
        .pab-box::before {
          content: ''; position: absolute; inset: 0; border-radius: 20px;
          background: linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%);
          opacity: 0; transition: opacity 0.3s;
        }
        .pab-box:hover::before { opacity: 1; }
        .pab-box:hover:not([data-disabled="true"]) {
          transform: translateY(-8px) scale(1.05);
          border-color: rgba(230,53,32,0.5);
          box-shadow: 0 12px 40px rgba(230,53,32,0.2), 0 0 30px rgba(230,53,32,0.1), inset 0 1px 0 rgba(255,255,255,0.1);
        }
        .pab-box[data-selected="true"] {
          border-color: #FFD700; border-width: 3px;
          box-shadow: 0 0 40px rgba(255,215,0,0.3), 0 0 80px rgba(255,215,0,0.1);
          animation: pabBoxPulse 1.2s ease-in-out infinite;
        }
        @keyframes pabBoxPulse {
          0%,100% { box-shadow: 0 0 30px rgba(255,215,0,0.2), 0 0 60px rgba(255,215,0,0.05); }
          50% { box-shadow: 0 0 50px rgba(255,215,0,0.4), 0 0 100px rgba(255,215,0,0.15); }
        }
        .pab-box[data-revealed="true"][data-win="true"] {
          background: linear-gradient(135deg, #FFD700, #ffa500, #ff8c42);
          border-color: #FFD700;
          animation: pabWinReveal 0.6s ease-out;
        }
        @keyframes pabWinReveal {
          0% { transform: scale(0.8) rotateY(180deg); opacity: 0.5; }
          50% { transform: scale(1.1) rotateY(90deg); }
          100% { transform: scale(1) rotateY(0deg); opacity: 1; }
        }
        .pab-box[data-revealed="true"][data-win="false"] {
          background: rgba(255,255,255,0.02); border-color: rgba(255,255,255,0.05);
          opacity: 0.5; animation: pabLoseReveal 0.5s ease-out;
        }
        @keyframes pabLoseReveal {
          0% { transform: scale(0.9) rotateY(90deg); }
          100% { transform: scale(1) rotateY(0deg); }
        }
        .pab-box-emoji { font-size: 2.8rem; transition: transform 0.3s; }
        .pab-box:hover:not([data-disabled="true"]) .pab-box-emoji { transform: scale(1.15) rotate(-5deg); }
        .pab-box-label { color: rgba(255,255,255,0.5); font-size: 0.78rem; margin-top: 8px; font-weight: 600; letter-spacing: 0.5px; }
        .pab-box-win-label { color: #1a0a00; font-size: 1.3rem; font-weight: 900; margin-top: 6px; text-shadow: 0 1px 4px rgba(0,0,0,0.2); }
        .pab-box-empty-label { color: rgba(255,255,255,0.3); font-size: 0.85rem; font-weight: 500; margin-top: 6px; }

        /* Revealing text */
        .pab-revealing { color: rgba(255,255,255,0.5); font-size: 0.9rem; animation: pabBlink 1s infinite; }
        @keyframes pabBlink { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }

        /* ── Result Phase ── */
        .pab-result-icon { font-size: 4rem; margin-bottom: 16px; animation: pabBounceIn 0.6s cubic-bezier(0.175,0.885,0.32,1.275); }
        @keyframes pabBounceIn { 0% { transform: scale(0); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }

        .pab-win-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 2.2rem; font-weight: 900; margin-bottom: 8px;
          background: linear-gradient(135deg, #FFD700, #ffa500);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          animation: pabTextGlow 2s ease-in-out infinite alternate;
        }
        @keyframes pabTextGlow {
          0% { filter: drop-shadow(0 0 8px rgba(255,215,0,0.3)); }
          100% { filter: drop-shadow(0 0 20px rgba(255,215,0,0.6)); }
        }
        .pab-win-amount { color: #fff; font-size: 1.4rem; font-weight: 700; margin-bottom: 4px; }
        .pab-win-amount span { color: #FFD700; font-size: 1.6rem; font-weight: 900; }
        .pab-win-count { color: rgba(255,255,255,0.5); font-size: 0.82rem; margin-bottom: 16px; }

        /* Claim section */
        .pab-claim-box {
          background: linear-gradient(135deg, rgba(230,53,32,0.1), rgba(255,140,66,0.06));
          border: 1px solid rgba(230,53,32,0.2); border-radius: 16px;
          padding: 18px 20px; margin-bottom: 20px;
        }
        .pab-claim-label { color: rgba(255,255,255,0.6); font-size: 0.85rem; margin-bottom: 4px; }
        .pab-countdown { font-size: 2rem; font-weight: 700; color: #FFD700; font-family: monospace; margin-top: 6px; }
        .pab-countdown[data-expired] { font-size: 1.2rem; color: #ff4444; }

        /* Instructions */
        .pab-instructions {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px; padding: 20px; text-align: left;
        }
        .pab-instructions-title {
          color: #FFD700; font-weight: 700; font-size: 1rem; margin-bottom: 12px;
          font-family: 'Playfair Display', Georgia, serif;
        }
        .pab-instructions ol {
          color: rgba(255,255,255,0.75); font-size: 0.88rem; line-height: 1.9;
          padding-left: 20px; margin: 0;
        }
        .pab-wa-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: #25D366; color: #fff; padding: 12px 24px;
          border-radius: 999px; font-weight: 700; text-decoration: none;
          font-size: 0.95rem; transition: all 0.3s;
          box-shadow: 0 4px 16px rgba(37,211,102,0.3);
        }
        .pab-wa-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(37,211,102,0.4); }

        /* CTA button */
        .pab-cta {
          display: block; margin-top: 20px; padding: 16px; font-size: 1.05rem; font-weight: 700;
          background: linear-gradient(135deg, #e63520, #ff6b4a); color: #fff;
          border: none; border-radius: 16px; text-decoration: none; text-align: center;
          box-shadow: 0 4px 24px rgba(230,53,32,0.3); transition: all 0.3s;
          position: relative; overflow: hidden;
        }
        .pab-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(230,53,32,0.4); }
        .pab-cta::after {
          content: ''; position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          animation: pabBtnShine 3s ease-in-out infinite;
        }

        /* Lose state */
        .pab-lose-title {
          font-family: 'Playfair Display', Georgia, serif;
          color: rgba(255,255,255,0.75); font-size: 1.5rem; font-weight: 700; margin-bottom: 12px;
        }
        .pab-lose-text { color: rgba(255,255,255,0.45); font-size: 0.92rem; margin-bottom: 24px; }

        /* Already played */
        .pab-locked-title {
          font-family: 'Playfair Display', Georgia, serif;
          color: rgba(230,53,32,0.8); font-size: 1.4rem; font-weight: 700; margin-bottom: 12px;
        }
        .pab-locked-text { color: rgba(255,255,255,0.5); font-size: 0.92rem; }

        /* Footer */
        .pab-footer {
          color: rgba(255,255,255,0.25); font-size: 0.72rem; margin-top: 28px;
          text-align: center; z-index: 10; position: relative;
        }

        /* Confetti canvas */
        .pab-confetti {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          pointer-events: none; z-index: 100;
        }

        /* ── Spinning ring decoration ── */
        .pab-ring-deco {
          position: absolute; top: -3px; left: -3px; right: -3px; bottom: -3px;
          border-radius: 24px; pointer-events: none;
          border: 1px solid transparent;
          background: conic-gradient(from 0deg, rgba(230,53,32,0.3), rgba(255,140,66,0.2), transparent 35%, transparent 65%, rgba(230,53,32,0.3));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          padding: 1px; animation: pabRingSpin 6s linear infinite;
        }
        @keyframes pabRingSpin { to { transform: rotate(360deg); } }

        /* Mobile */
        @media (max-width: 480px) {
          .pab-card { padding: 28px 18px; }
          .pab-title { font-size: 1.6rem; }
          .pab-box { width: 100px; height: 120px; }
          .pab-box-emoji { font-size: 2.2rem; }
          .pab-boxes { gap: 10px; }
        }
      `}</style>

      <div className="pab-wrapper">
        {/* Ambient orbs */}
        <div className="pab-orb pab-orb-1" />
        <div className="pab-orb pab-orb-2" />
        <div className="pab-orb pab-orb-3" />

        {/* Confetti */}
        <canvas ref={confettiRef} className="pab-confetti" />

        {/* Main card */}
        <div className="pab-card">
          <div className="pab-ring-deco" />

          {/* Logo */}
          <div className="pab-logo">
            <img src="/cm8-logo.png" alt="CM8" />
          </div>

          {/* ─── CODE ENTRY ─── */}
          {phase === 'code' && (
            <>
              <h1 className="pab-title">🎁 Pick A Box</h1>
              <p className="pab-subtitle">Masukkan kod event untuk cuba nasib anda!</p>
              <div className="pab-notice">
                📢 Untuk dapatkan <strong>kod event</strong>, sila <strong>PM admin</strong>.
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                <a
                  href="https://wa.me/60178182320?text=Hi%20admin%2C%20saya%20nak%20kod%20event%20Pick%20A%20Box"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pab-wa-btn"
                >
                  💬 PM Admin WhatsApp
                </a>
              </div>
              <p className="pab-sponsor">✨ Event ini disponsor oleh <strong>Garry Spinner (SSC)</strong></p>

              {eventStatus && (
                <div className="pab-status">
                  <div className="pab-status-main">
                    🏆 Hadiah tersisa: <strong>{eventStatus.winnersRemaining}</strong>
                  </div>
                  <div className="pab-status-sub">{eventStatus.totalPlays} pemain telah mencuba</div>
                </div>
              )}

              <div style={{ marginBottom: 20 }}>
                <input
                  className="pab-input"
                  type="text"
                  value={code}
                  onChange={e => { setCode(e.target.value.toUpperCase()); setError('') }}
                  onKeyDown={e => e.key === 'Enter' && handleSubmitCode()}
                  placeholder="Masukkan Kod Event"
                  disabled={loading}
                />
              </div>

              {error && <div className="pab-error">❌ {error}</div>}

              <button
                className={`pab-btn ${code.trim() ? 'pab-btn-active' : 'pab-btn-disabled'}`}
                onClick={handleSubmitCode}
                disabled={loading || !code.trim()}
              >
                {loading ? '⏳ Mengesahkan...' : '🚀 Masuk Event'}
              </button>
            </>
          )}

          {/* ─── JOIN WHATSAPP CHANNEL PHASE ─── */}
          {phase === 'join' && eventInfo && (
            <>
              <h2 className="pab-game-title">{eventInfo.title}</h2>
              <p className="pab-subtitle">Satu langkah lagi sebelum bermain!</p>

              {/* Player ID input */}
              <div style={{ marginTop: 20, marginBottom: 12 }}>
                <p className="pab-claim-label" style={{ marginBottom: 8 }}>🆔 Masukkan ID Player CM8 anda:</p>
                <input
                  className="pab-input"
                  type="text"
                  value={playerId}
                  onChange={e => setPlayerId(e.target.value)}
                  placeholder="Contoh: luckyhorse879"
                  style={{ letterSpacing: '1px', fontSize: '1rem' }}
                />
              </div>

              {/* WhatsApp number (mandatory for claim verification) */}
              <div style={{ marginTop: 4, marginBottom: 16 }}>
                <p className="pab-claim-label" style={{ marginBottom: 8 }}>📱 Nombor WhatsApp untuk claim:</p>
                <input
                  className="pab-input"
                  type="tel"
                  value={whatsappNumber}
                  onChange={e => setWhatsappNumber(e.target.value)}
                  placeholder="Contoh: 0178182320"
                  style={{ letterSpacing: '1px', fontSize: '1rem' }}
                />
                <p style={{ color: 'rgba(255,215,0,0.85)', fontSize: '0.76rem', marginTop: 8, lineHeight: 1.45 }}>
                  ⚠️ Jika nombor WhatsApp semasa claim tidak sama, kemenangan akan dibatalkan.
                </p>
              </div>

              <div className="pab-claim-box">
                <p className="pab-claim-label">📢 Wajib join channel WhatsApp kami untuk bermain:</p>
                <a
                  href="https://whatsapp.com/channel/0029Vb7cSULCxoAtcGaunK37"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pab-wa-btn"
                  style={{ display: 'flex', justifyContent: 'center', marginTop: 14, marginBottom: 6 }}
                  onClick={() => setJoinClicked(true)}
                >
                  💬 Join WhatsApp Channel
                </a>
                {!joinClicked && (
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', marginTop: 10, textAlign: 'center' }}>
                    ⬆️ Tekan butang di atas untuk join
                  </p>
                )}
              </div>

              {joinClicked && playerId.trim() && isWhatsappValid && (
                <button
                  className="pab-btn pab-btn-active"
                  style={{ marginTop: 20 }}
                  onClick={() => setPhase('game')}
                >
                  ✅ Dah Join — Teruskan!
                </button>
              )}
              {joinClicked && !playerId.trim() && (
                <p style={{ color: '#ff6b6b', fontSize: '0.85rem', marginTop: 16, textAlign: 'center' }}>
                  ⚠️ Sila masukkan ID Player CM8 anda di atas
                </p>
              )}
              {joinClicked && playerId.trim() && !isWhatsappValid && (
                <p style={{ color: '#ff6b6b', fontSize: '0.85rem', marginTop: 16, textAlign: 'center' }}>
                  ⚠️ Sila masukkan nombor WhatsApp yang sah (10-15 digit)
                </p>
              )}
            </>
          )}

          {/* ─── GAME PHASE ─── */}
          {(phase === 'game' || phase === 'revealing') && eventInfo && (
            <>
              <h2 className="pab-game-title">{eventInfo.title}</h2>
              <p className="pab-subtitle">Pilih satu kotak dan cuba nasib anda!</p>
              <p className="pab-prize">🏆 Hadiah: <span>{eventInfo.prize}</span></p>

              <div className="pab-boxes">
                {[0, 1, 2].map(i => {
                  const isSelected = selectedBox === i
                  const isRevealed = revealedBoxes[i]
                  const isWinBox = isSelected && playResult?.result === 'win'
                  return (
                    <button
                      key={i}
                      className="pab-box"
                      onClick={() => handlePickBox(i)}
                      onMouseEnter={() => setHoverBox(i)}
                      onMouseLeave={() => setHoverBox(null)}
                      disabled={phase === 'revealing' || selectedBox !== null}
                      data-selected={isSelected ? 'true' : undefined}
                      data-revealed={isRevealed ? 'true' : undefined}
                      data-win={isRevealed ? (isWinBox ? 'true' : 'false') : undefined}
                      data-disabled={phase === 'revealing' || selectedBox !== null ? 'true' : undefined}
                    >
                      {!isRevealed ? (
                        <>
                          <span className="pab-box-emoji">{hoverBox === i && phase === 'game' && selectedBox === null ? '🎁' : '🎁'}</span>
                          <span className="pab-box-label">Box {i + 1}</span>
                        </>
                      ) : (
                        <>
                          <span className="pab-box-emoji">{isWinBox ? '💰' : '💨'}</span>
                          {isWinBox ? (
                            <span className="pab-box-win-label">{playResult?.prize}</span>
                          ) : (
                            <span className="pab-box-empty-label">Kosong</span>
                          )}
                        </>
                      )}
                    </button>
                  )
                })}
              </div>

              {phase === 'revealing' && (
                <p className="pab-revealing">✨ Membuka kotak...</p>
              )}
            </>
          )}

          {/* ─── RESULT ─── */}
          {phase === 'result' && (
            <>
              {playResult?.result === 'win' ? (
                <>
                  <div className="pab-result-icon">🎉</div>
                  <h2 className="pab-win-title">TAHNIAH!</h2>
                  <p className="pab-win-amount">
                    Anda memenangi <span>{playResult.prize}</span>!
                  </p>
                  <p className="pab-win-count">
                    Player: <strong style={{ color: '#FFD700' }}>{playerId}</strong> • WhatsApp: <strong style={{ color: '#FFD700' }}>{normalizedWhatsapp || '-'}</strong> • Pemenang #{playResult.totalWinners} / {playResult.maxWinners}
                  </p>

                  {playResult.claimDeadline && (
                    <div className="pab-claim-box">
                      <p className="pab-claim-label">⏰ Claim dalam masa:</p>
                      <CountdownTimer deadline={playResult.claimDeadline} />
                    </div>
                  )}

                  <div className="pab-instructions">
                    <p className="pab-instructions-title">📋 Cara Claim:</p>
                    <ol>
                      <li>📱 Screenshot halaman ini SEKARANG</li>
                      <li>📤 Hantar screenshot ke admin WhatsApp:</li>
                      <li style={{ listStyle: 'none', marginLeft: -20, marginTop: 8, marginBottom: 8 }}>
                        <a
                          className="pab-wa-btn"
                          href="https://wa.me/60178182320?text=Saya%20menang%20event%20Pick%20A%20Box%20CM8!"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          💬 WhatsApp: 017-8182320
                        </a>
                      </li>
                      <li>💬 Sertakan ID pemain CM8 anda</li>
                      <li>📱 Nombor WhatsApp claim mesti sama seperti yang didaftarkan: <strong>{normalizedWhatsapp || '-'}</strong></li>
                      <li>✅ Claim mesti dalam masa <strong>{playResult.claimMinutes} minit</strong></li>
                    </ol>
                  </div>

                  <a className="pab-cta" href="https://cm8play.com/r/luckyhorse879" target="_blank" rel="noopener noreferrer">
                    🎰 Main Sekarang di CM8
                  </a>
                </>
              ) : (
                <>
                  {error && !playResult ? (
                    <>
                      <div className="pab-result-icon">🔒</div>
                      <h2 className="pab-locked-title">Sudah Bermain</h2>
                      <p className="pab-locked-text">{error}</p>
                    </>
                  ) : (
                    <>
                      <div className="pab-result-icon">😢</div>
                      <h2 className="pab-lose-title">Tidak Bertuah</h2>
                      <p className="pab-lose-text">Maaf, kotak anda kosong kali ini. Jangan putus asa!</p>
                      <a className="pab-cta" href="https://cm8play.com/r/luckyhorse879" target="_blank" rel="noopener noreferrer">
                        🎰 Cuba Nasib di CM8
                      </a>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>

        <p className="pab-footer">© 2026 CM8 VVIP • Terma &amp; syarat terpakai</p>
      </div>
    </>
  )
}
