'use client'

import { useState, useEffect, useRef } from 'react'

type Prize = {
  id: string
  name: string
  probability: number
  colorPrimary: string
  colorSecondary: string
}

type SpinResult = {
  prize: string
  claimId: string
  spunAt: string
  message: string
}

async function getFingerprint(): Promise<string> {
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (ctx) {
      canvas.width = 200
      canvas.height = 50
      ctx.textBaseline = 'top'
      ctx.font = "14px Arial"
      ctx.fillStyle = '#f60'
      ctx.fillRect(125, 1, 62, 20)
      ctx.fillStyle = '#069'
      ctx.fillText('Lucky Wheel', 2, 15)
    }
    const fp = [navigator.userAgent, navigator.language, screen.width + 'x' + screen.height + 'x' + screen.colorDepth, new Date().getTimezoneOffset(), canvas.toDataURL()].join('|')
    let hash = 0
    for (let i = 0; i < fp.length; i++) { const char = fp.charCodeAt(i); hash = ((hash << 5) - hash) + char; hash = hash & hash }
    return Math.abs(hash).toString(36)
  } catch { return 'ssr-fallback' }
}

interface Particle {
  x: number; y: number; vx: number; vy: number; size: number; color: string
  rotation: number; rotSpeed: number; life: number; maxLife: number; shape: number
}

function spawnConfetti(cx: number, cy: number, count = 120): Particle[] {
  const colors = ['#ffd700', '#ff6b6b', '#4facfe', '#00c6ff', '#fff', '#ffb347', '#c471ed', '#ff9']
  const particles: Particle[] = []
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = 3 + Math.random() * 9
    particles.push({
      x: cx, y: cy, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 5,
      size: 5 + Math.random() * 9, color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360, rotSpeed: (Math.random() - 0.5) * 15,
      life: 0, maxLife: 60 + Math.random() * 70, shape: Math.floor(Math.random() * 3),
    })
  }
  return particles
}

function ConfettiCanvas({ particles }: { particles: Particle[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const particlesRef = useRef(particles)
  particlesRef.current = particles

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const animate = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      let alive = false
      for (const p of particlesRef.current) {
        p.life++
        if (p.life > p.maxLife) continue
        alive = true
        p.x += p.vx; p.y += p.vy; p.vy += 0.22; p.vx *= 0.98; p.rotation += p.rotSpeed
        const alpha = 1 - p.life / p.maxLife
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate((p.rotation * Math.PI) / 180); ctx.globalAlpha = alpha; ctx.fillStyle = p.color
        if (p.shape === 0) ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
        else if (p.shape === 1) { ctx.beginPath(); ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2); ctx.fill() }
        else { ctx.beginPath(); ctx.moveTo(0, -p.size / 2); ctx.lineTo(p.size / 3, 0); ctx.lineTo(0, p.size / 2); ctx.lineTo(-p.size / 3, 0); ctx.closePath(); ctx.fill() }
        ctx.restore()
      }
      if (alive) animRef.current = requestAnimationFrame(animate)
    }
    animRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 9999 }} />
}

const NUM_SEGS = 8
const SEG_DEG = 360 / NUM_SEGS
const DEFAULT_PRIZES: Prize[] = [
  { id: '1', name: 'RM100', probability: 93, colorPrimary: '#FFD700', colorSecondary: '#FFA500' },
  { id: '2', name: 'RM288', probability: 5, colorPrimary: '#FF6B6B', colorSecondary: '#FF8E53' },
  { id: '3', name: 'RM388', probability: 1, colorPrimary: '#8E2DE2', colorSecondary: '#FF6FD8' },
  { id: '4', name: 'RM588', probability: 1, colorPrimary: '#00C6FF', colorSecondary: '#0072FF' },
  { id: '5', name: '5G GOLD', probability: 0, colorPrimary: '#F7971E', colorSecondary: '#FFD200' },
]

function WheelDisplay({ angle, prizes }: { angle: number; prizes: Prize[] }) {
  const displayPrizes = prizes.length > 0 ? prizes : DEFAULT_PRIZES
  const segColors = [
    displayPrizes[0] || DEFAULT_PRIZES[0], displayPrizes[0] || DEFAULT_PRIZES[0],
    displayPrizes[1] || DEFAULT_PRIZES[1], displayPrizes[2] || DEFAULT_PRIZES[2],
    displayPrizes[0] || DEFAULT_PRIZES[0], displayPrizes[3] || DEFAULT_PRIZES[3],
    displayPrizes[0] || DEFAULT_PRIZES[0], displayPrizes[4] || DEFAULT_PRIZES[4],
  ]

  return (
    <div style={{ position: 'relative', width: 360, height: 360 }}>
      <div style={{ position: 'absolute', inset: '-14px', borderRadius: '50%', border: '3px solid rgba(255,215,0,0.12)', animation: 'spin 28s linear infinite', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '-8px', left: '50%', transform: 'translateX(-50%)', zIndex: 10, width: 0, height: 0, borderLeft: '20px solid transparent', borderRight: '20px solid transparent', borderTop: '40px solid #ffd700', filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.5))' }} />
      <div style={{
        width: '100%', height: '100%', borderRadius: '50%',
        border: '16px solid rgba(255,215,0,0.9)',
        boxShadow: '0 0 0 8px rgba(255,255,255,0.04), 0 0 50px rgba(255,215,0,0.2), inset 0 0 50px rgba(0,0,0,0.2), 0 20px 60px rgba(0,0,0,0.5)',
        overflow: 'hidden', position: 'relative',
        transform: 'rotate(' + angle + 'deg)',
        transition: 'transform 5s cubic-bezier(0.16, 1, 0.3, 1)',
        background: '#111',
      }}>
        {segColors.map((p, i) => {
          const rot = i * SEG_DEG
          const textColor = i % 2 === 0 ? '#1a0500' : '#fff'
          const label = p.name.length > 6 ? p.name.slice(0, 5) + '..' : p.name
          return (
            <div key={i} style={{
              position: 'absolute', width: '50%', height: '50%', left: '50%', top: 0,
              transformOrigin: 'left bottom',
              transform: 'rotate(' + rot + 'deg)',
              clipPath: 'polygon(0 100%, 100% 0, 100% 100%)',
              background: 'linear-gradient(135deg, ' + p.colorPrimary + ', ' + p.colorSecondary + ')',
            }}>
              <span style={{
                position: 'absolute', left: '58%', top: '44%',
                transform: 'rotate(68deg)',
                fontSize: '11px', fontWeight: 900, color: textColor,
                textShadow: '0 2px 6px rgba(0,0,0,0.4)', whiteSpace: 'nowrap',
              }}>{label}</span>
            </div>
          )
        })}
        <div style={{
          position: 'absolute', inset: '50%', width: '75px', height: '75px',
          transform: 'translate(-50%, -50%)', borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, #fff3b0, #ff9800 60%, #d46a00)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '7px solid rgba(255,255,255,0.85)',
          boxShadow: '0 0 24px rgba(255,196,0,0.3)', zIndex: 3,
        }}>
          <span style={{ fontSize: '14px', fontWeight: 900, color: '#371500' }}>SPIN</span>
        </div>
      </div>
    </div>
  )
}

export default function LuckyWheelPage() {
  const [prizes, setPrizes] = useState<Prize[]>(DEFAULT_PRIZES)
  const [eventTitle, setEventTitle] = useState('Lucky Wheel Event')
  const [isLoading, setIsLoading] = useState(true)
  const [whatsapp, setWhatsapp] = useState('')
  const [agentId, setAgentId] = useState('')
  const [isChecking, setIsChecking] = useState(false)
  const [hasSpun, setHasSpun] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<SpinResult | null>(null)
  const [wheelAngle, setWheelAngle] = useState(0)
  const [fingerprint, setFingerprint] = useState('')
  const [confettiParticles, setConfettiParticles] = useState<Particle[]>([])
  const [showConfetti, setShowConfetti] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)

  useEffect(() => {
    getFingerprint().then(fp => {
      setFingerprint(fp)
      fetch('/api/wheel-event/prizes')
        .then(r => r.json())
        .then(data => {
          if (data.prizes && data.prizes.length > 0) {
            setPrizes(data.prizes)
          }
          if (data.eventTitle) {
            setEventTitle(data.eventTitle)
          }
        })
        .catch(() => {})
        .finally(() => setIsLoading(false))
    })
  }, [])

  const handleSpin = async () => {
    if (!whatsapp.trim() || !agentId.trim()) { setError('Sila isi semua ruangan'); return }
    setIsChecking(true); setError('')
    try {
      const res = await fetch('/api/wheel-event/spin', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ whatsappNumber: whatsapp.trim(), agentId: agentId.trim(), deviceFingerprint: fingerprint }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Ralat berlaku'); setIsChecking(false); return }
      setLoginSuccess(true)
      setHasSpun(true)
      setResult({ prize: data.prize, claimId: data.claimId, spunAt: data.spunAt, message: data.message })
      const segIdx = prizes.findIndex(p => p.name === data.prize)
      const targetIdx = segIdx >= 0 ? segIdx : 0
      const segCenter = targetIdx * SEG_DEG + SEG_DEG / 2
      const extraTurns = 6 * 360
      const offset = 360 - segCenter
      setWheelAngle(prev => prev + extraTurns + offset + 720)
      if (data.prize !== '5G GOLD') {
        setTimeout(() => {
          setConfettiParticles(spawnConfetti(window.innerWidth / 2, window.innerHeight / 3, 150))
          setShowConfetti(true)
        }, 5000)
      }
    } catch { setError('Ralat sambungan. Sila cuba lagi.') }
    finally { setIsChecking(false) }
  }

  const claimWhatsApp = () => {
    if (!result) return
    const msg = 'Hi admin, saya menang ' + result.prize + '. Nama/No WhatsApp saya: ' + whatsapp + ', ID Agent: ' + agentId + '. Saya sertakan screenshot sebagai bukti.'
    window.open('https://wa.me/601133388859?text=' + encodeURIComponent(msg), '_blank')
  }

  const totalProb = prizes.reduce((s, p) => s + p.probability, 0)

  return (
    <main style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at top, #1a0a00 0%, #0d0206 50%, #000 100%)', fontFamily: "'Inter','Segoe UI',sans-serif", color: '#fff', overflowX: 'hidden' }}>
      <style>{"\
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');\
        * { box-sizing: border-box; margin: 0; padding: 0; }\
        @keyframes s { to { transform: rotate(360deg); } }\
        @keyframes p { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(0.85); } }\
        @keyframes su { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }\
        @keyframes sc { from { opacity: 0; transform: scale(0.7); } to { opacity: 1; transform: scale(1); } }\
        .a { display: flex; alignItems: center; justifyContent: center; padding: 40px 20px 20px; animation: su 0.7s ease; text-align: center; }\
        .b { display: inline-flex; alignItems: center; gap: 8px; padding: 8px 18px; border-radius: 999px; background: rgba(255,215,0,0.1); border: 1px solid rgba(255,215,0,0.3); color: #ffd700; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; marginBottom: 16px; }\
        .c { width: 8px; height: 8px; border-radius: 50%; background: #ffd700; animation: p 1.5s ease-in-out infinite; }\
        .d { font-size: clamp(32px,8vw,52px); font-weight: 900; line-height: 1.1; background: linear-gradient(135deg,#ffd700 0%,#ff9800 50%,#ffd700 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; marginBottom: 12px; }\
        .e { color: rgba(255,255,255,0.55); font-size: 14px; line-height: 1.6; max-width: 480px; margin: 0 auto; }\
        .f { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,215,0,0.12); border-radius: 28px; padding: 28px; backdrop-filter: blur(20px); margin-bottom: 16px; animation: su 0.8s ease; }\
        .g { color: #ffd700; font-size: 18px; font-weight: 800; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }\
        .h { display: block; margin-bottom: 8px; font-size: 11px; color: rgba(255,255,255,0.6); font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; }\
        .i { width: 100%; padding: 16px 18px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.12); background: rgba(0,0,0,0.5); color: #fff; font-size: 16px; outline: none; transition: border-color 0.2s, box-shadow 0.2s; box-sizing: border-box; }\
        .i:focus { border-color: rgba(255,215,0,0.5); box-shadow: 0 0 0 3px rgba(255,215,0,0.1); }\
        .j { width: 100%; padding: 18px; border-radius: 999px; border: none; background: linear-gradient(135deg,#ff4757,#ff6b6b); color: #fff; font-size: 18px; font-weight: 900; cursor: pointer; transition: all 0.25s ease; box-shadow: 0 8px 30px rgba(255,71,87,0.3); display: flex; align-items: center; justify-content: center; gap: 8px; }\
        .j:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(255,71,87,0.4); }\
        .j:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }\
        .k { margin-top: 14px; border-radius: 12px; padding: 14px; background: rgba(255,71,87,0.1); border: 1px solid rgba(255,71,87,0.2); color: #ff9999; font-size: 14px; }\
        .l { margin-top: 16px; border-radius: 16px; padding: 16px; background: rgba(37,211,102,0.1); border: 1px solid rgba(37,211,102,0.2); }\
        .m { color: #4ade80; font-weight: 700; margin-bottom: 6px; }\
        .n { color: rgba(255,255,255,0.5); font-size: 13px; }\
        .o { display: flex; justify-content: center; padding: 20px 0; animation: su 0.9s ease; }\
        .p { background: rgba(255,255,255,0.06); border: 2px solid rgba(255,215,0,0.25); border-radius: 28px; padding: 32px 24px; text-align: center; animation: sc 0.5s ease; margin-top: 20px; }\
        .q { font-size: 72px; margin-bottom: 8px; }\
        .r { display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: 999px; background: rgba(255,215,0,0.15); color: #ffd700; font-size: 12px; font-weight: 700; margin-bottom: 12px; }\
        .s { font-size: 38px; font-weight: 900; color: #ffd700; margin-bottom: 8px; }\
        .t { color: rgba(255,255,255,0.6); font-size: 14px; margin-bottom: 20px; line-height: 1.6; }\
        .u { background: rgba(0,0,0,0.4); border-radius: 14px; padding: 14px; margin-bottom: 20px; }\
        .v { font-size: 10px; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 6px; }\
        .w { font-size: 20px; font-weight: 900; color: #4facfe; font-family: 'Courier New', monospace; letter-spacing: 0.05em; }\
        .x { color: #ff9999; font-size: 13px; margin-bottom: 16px; line-height: 1.5; }\
        .y { display: inline-flex; align-items: center; gap: 10px; padding: 16px 32px; border-radius: 999px; background: #25D366; color: #fff; font-size: 16px; font-weight: 800; border: none; cursor: pointer; box-shadow: 0 6px 24px rgba(37,211,102,0.35); transition: all 0.25s ease; text-decoration: none; }\
        .y:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(37,211,102,0.45); }\
        \
        \
        \
        \
        \
        \
        \
        \
        \
        .ai { text-align: center; margin-top: 24px; font-size: 11px; color: rgba(255,255,255,0.15); line-height: 1.6; }\
        .sp { border: 3px solid rgba(255,255,255,0.2); border-top-color: #fff; border-radius: 50%; width: 20px; height: 20px; animation: s 0.7s linear infinite; display: inline-block; }\
        @media (max-width: 600px) { .f { padding: 20px; border-radius: 20px; } .a { padding: 28px 16px 16px; } }\
      "}</style>

      {showConfetti && <ConfettiCanvas particles={confettiParticles} />}

      <div style={{ position: 'fixed', top: '-200px', right: '-200px', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,215,0,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-150px', left: '-150px', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(230,53,32,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 540, margin: '0 auto', padding: '0 16px 100px', position: 'relative', zIndex: 1 }}>
        <div className="a">
          <div>
            <div className="b"><span className="c" /> LIVE EVENT</div>
            <h1 className="d">{eventTitle}</h1>
            <p className="e">Isi ruangan di bawah, tekan PUTAR, dan menangi kredit eksklusif!</p>
          </div>
        </div>

        <div className="f">
          <div className="g">Daftar untuk Spin</div>
          <div style={{ marginBottom: 14 }}>
            <label className="h">No WhatsApp</label>
            <input className="i" type="tel" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="Contoh: 01133388859" disabled={isChecking || hasSpun} />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label className="h">ID Agent</label>
            <input className="i" type="text" value={agentId} onChange={e => setAgentId(e.target.value)} placeholder="Contoh: Garry01" autoCapitalize="off" disabled={isChecking || hasSpun} />
          </div>
          {error && <div className="k">{error}</div>}
          {loginSuccess && !result && (
            <div className="l">
              <div className="m">Berjaya login!</div>
              <div className="n">Sistem sedang menyediakan keputusan...</div>
            </div>
          )}
          <button className="j" onClick={handleSpin} disabled={isChecking || isLoading || hasSpun || !whatsapp.trim() || !agentId.trim()}>
            {isChecking ? <><span className="sp" /> Sila tunggu...</> : hasSpun ? 'Sudah Spin' : 'PUTAR SEKARANG!'}
          </button>
          <p style={{ textAlign: 'center', marginTop: 12, fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>* 1 agent = 1 peluang spin sahaja</p>
        </div>

        <div className="o">
          <WheelDisplay angle={wheelAngle} prizes={prizes} />
        </div>

        {result && (
          <div className="p">
            <div className="q">{result.prize === '5G GOLD' ? 'Tiada' : 'Tahniah!'}</div>
            <div className="r">{result.prize === '5G GOLD' ? 'Tiada' : 'ANDA MENANG!'}</div>
            <div className="s">{result.prize}</div>
            <p className="t">{result.message}</p>
            <div className="u">
              <div className="v">Claim ID</div>
              <div className="w">{result.claimId}</div>
            </div>
            {result.prize !== '5G GOLD' && (
              <>
                <p className="x">Sila screenshot gambar kemenangan dan hantar ke WhatsApp admin.</p>
                <button className="y" onClick={claimWhatsApp}>WhatsApp Claim</button>
              </>
            )}
          </div>
        )}

        <p className="ai">* Setiap agent layak 1 spin sahaja. Keputusan muktamad.</p>
      </div>
    </main>
  )
}
