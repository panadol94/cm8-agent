'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'

/* ─── prize config ─── */
const SEGMENTS = [
  { label: 'No Luck',   color: '#e63520', accent: '#ff6b4a' },
  { label: 'RM10',      color: '#ffaa33', accent: '#ffd700' },
  { label: 'No Luck',   color: '#ff6b4a', accent: '#ff8c42' },
  { label: 'RM30',      color: '#e63520', accent: '#ff6b4a' },
  { label: 'No Luck',   color: '#ffaa33', accent: '#ffd700' },
  { label: 'RM50',      color: '#ff6b4a', accent: '#ff8c42' },
  { label: 'No Luck',   color: '#e63520', accent: '#ff6b4a' },
  { label: 'RM100',     color: '#ffaa33', accent: '#ffd700' },
]

// Dynamic odds — fetched from /api/lucky-wheel/odds (Happy Hour system)
type OddsProfile = { noLuck: number; rm10: number; rm30: number; rm50: number; rm100: number }
const DEFAULT_ODDS: OddsProfile = { noLuck: 75, rm10: 25, rm30: 0, rm50: 0, rm100: 0 }

function pickPrize(odds: OddsProfile = DEFAULT_ODDS): { label: string; segmentIndex: number } {
  const r = Math.random() * 100
  let prize: string
  const c1 = odds.noLuck
  const c2 = c1 + odds.rm10
  const c3 = c2 + odds.rm30
  const c4 = c3 + odds.rm50
  if (r < c1) prize = 'No Luck'
  else if (r < c2) prize = 'RM10'
  else if (r < c3) prize = 'RM30'
  else if (r < c4) prize = 'RM50'
  else prize = 'RM100'

  const indices = SEGMENTS.map((s, i) => (s.label === prize ? i : -1)).filter((i) => i >= 0)
  const segmentIndex = indices[Math.floor(Math.random() * indices.length)]
  return { label: prize, segmentIndex }
}

const STORAGE_KEY = 'cm8_lucky_wheel_spun'
const RESULT_KEY = 'cm8_lucky_wheel_result'
const CLAIM_KEY = 'cm8_lucky_wheel_claim_id'
const CTA_LINK = 'https://cm8huat.com/r/luckyhorse879'
const NUM = SEGMENTS.length
const ARC = (2 * Math.PI) / NUM

/* ─── confetti helpers ─── */
interface Particle {
  x: number; y: number; vx: number; vy: number
  size: number; color: string; rotation: number; rotSpeed: number
  life: number; maxLife: number; shape: number
}
function spawnParticles(cx: number, cy: number): Particle[] {
  const colors = ['#e63520', '#ff6b4a', '#ffaa33', '#ffd700', '#ffffff', '#ff4444', '#ff8c42']
  const particles: Particle[] = []
  for (let i = 0; i < 120; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = 2 + Math.random() * 8
    particles.push({
      x: cx, y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      size: 4 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 15,
      life: 0,
      maxLife: 60 + Math.random() * 60,
      shape: Math.floor(Math.random() * 3),
    })
  }
  return particles
}

/* ─── detect device ─── */
function getDevice(): string {
  if (typeof navigator === 'undefined') return 'Unknown'
  const ua = navigator.userAgent
  if (/android/i.test(ua)) return '📱 Android'
  if (/iphone|ipad|ipod/i.test(ua)) return '📱 iOS'
  if (/windows/i.test(ua)) return '💻 Windows'
  if (/macintosh/i.test(ua)) return '💻 Mac'
  return '🖥️ Desktop'
}

/* ─── component ─── */
export default function LuckyWheel() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const confettiRef = useRef<HTMLCanvasElement>(null)
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [hasSpun, setHasSpun] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [claimId, setClaimId] = useState<string | null>(null)
  const [claimExpired, setClaimExpired] = useState(false)
  const [username, setUsername] = useState('')
  const [isRegistered, setIsRegistered] = useState(false)
  const [usernameError, setUsernameError] = useState('')
  const [checking, setChecking] = useState(false)
  const angleRef = useRef(0)
  const animRef = useRef<number>(0)
  const confettiAnimRef = useRef<number>(0)
  const particlesRef = useRef<Particle[]>([])
  const usernameRef = useRef('')
  const [currentOdds, setCurrentOdds] = useState<OddsProfile>(DEFAULT_ODDS)
  const [isHotHour, setIsHotHour] = useState(false)
  const [voucherId, setVoucherId] = useState<number | null>(null)
  const [usingVoucher, setUsingVoucher] = useState(false)
  const [checkinLoading, setCheckinLoading] = useState(true)
  const [checkinLoggedIn, setCheckinLoggedIn] = useState(false)

  // Fetch dynamic odds on mount
  useEffect(() => {
    fetch('/api/lucky-wheel/odds')
      .then(r => r.json())
      .then(data => {
        if (data.odds) setCurrentOdds(data.odds)
        if (data.isHotHour) setIsHotHour(data.isHotHour)
      })
      .catch(() => {})
  }, [])

  // Check localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem(STORAGE_KEY)) {
        setHasSpun(true)
      }
      const saved = localStorage.getItem('cm8_lucky_wheel_user')
      if (saved) {
        setUsername(saved)
        usernameRef.current = saved
        setIsRegistered(true)
      }
      const savedResult = localStorage.getItem(RESULT_KEY)
      if (savedResult) setResult(savedResult)
      const savedClaim = localStorage.getItem(CLAIM_KEY)
      if (savedClaim) setClaimId(savedClaim)
    }
  }, [])

  // Check for check-in vouchers + auto-set CM8 Player ID
  useEffect(() => {
    fetch('/api/lucky-wheel/check-voucher')
      .then(r => r.json())
      .then(data => {
        if (data.hasVoucher && data.voucherId) {
          setVoucherId(data.voucherId)
        }
      })
      .catch(() => {})
    
    // MANDATORY: Fetch check-in user's CM8 Player ID
    setCheckinLoading(true)
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        if (data.user?.cm8PlayerId) {
          setCheckinLoggedIn(true)
          setUsername(data.user.cm8PlayerId)
          usernameRef.current = data.user.cm8PlayerId
          setIsRegistered(true)
          localStorage.setItem('cm8_lucky_wheel_user', data.user.cm8PlayerId)
        } else {
          setCheckinLoggedIn(false)
        }
      })
      .catch(() => {
        setCheckinLoggedIn(false)
      })
      .finally(() => setCheckinLoading(false))
  }, [])

  // Handle username submit — check backend for approval + duplicate
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = username.trim()
    if (!trimmed) return

    setChecking(true)
    setUsernameError('')

    try {
      const res = await fetch(`/api/lucky-wheel?username=${encodeURIComponent(trimmed)}`)
      const data = await res.json()

      if (data.alreadySpun) {
        usernameRef.current = trimmed
        setIsRegistered(true)
        setHasSpun(true)
        setResult(data.prize || null)
        setClaimId(data.claimId || null)
        setClaimExpired(Boolean(data.claimExpired))
        if (data.prize) localStorage.setItem(RESULT_KEY, data.prize)
        if (data.claimId) localStorage.setItem(CLAIM_KEY, data.claimId)
        localStorage.setItem(STORAGE_KEY, '1')
        localStorage.setItem('cm8_lucky_wheel_user', trimmed)
        setChecking(false)
        return
      }

      // Approved and hasn't spun yet
      usernameRef.current = trimmed
      setIsRegistered(true)
      localStorage.setItem('cm8_lucky_wheel_user', trimmed)
    } catch {
      // If backend fails, allow spin anyway
      usernameRef.current = trimmed
      setIsRegistered(true)
      localStorage.setItem('cm8_lucky_wheel_user', trimmed)
    }
    setChecking(false)
  }

  // Draw wheel
  const drawWheel = useCallback((rotation: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const size = Math.min(canvas.parentElement?.clientWidth || 340, 380)
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const cx = size / 2
    const cy = size / 2
    const outerR = size / 2 - 8
    const innerR = outerR - 12

    ctx.clearRect(0, 0, size, size)

    // Outer decorative ring
    ctx.beginPath()
    ctx.arc(cx, cy, outerR, 0, Math.PI * 2)
    const ringGrad = ctx.createRadialGradient(cx, cy, innerR, cx, cy, outerR)
    ringGrad.addColorStop(0, '#b8860b')
    ringGrad.addColorStop(0.5, '#ffd700')
    ringGrad.addColorStop(1, '#b8860b')
    ctx.fillStyle = ringGrad
    ctx.fill()

    // Bulb dots
    for (let i = 0; i < 24; i++) {
      const bulbAngle = (i / 24) * Math.PI * 2 - Math.PI / 2
      const bulbR = (outerR + innerR) / 2
      const bx = cx + Math.cos(bulbAngle) * bulbR
      const by = cy + Math.sin(bulbAngle) * bulbR
      ctx.beginPath()
      ctx.arc(bx, by, 3.5, 0, Math.PI * 2)
      ctx.fillStyle = i % 2 === 0 ? '#fff' : '#ffe066'
      ctx.fill()
      ctx.beginPath()
      ctx.arc(bx, by, 5, 0, Math.PI * 2)
      const glowG = ctx.createRadialGradient(bx, by, 0, bx, by, 5)
      glowG.addColorStop(0, i % 2 === 0 ? 'rgba(255,255,255,0.6)' : 'rgba(255,224,102,0.6)')
      glowG.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = glowG
      ctx.fill()
    }

    // Segments
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(rotation)

    for (let i = 0; i < NUM; i++) {
      const startAngle = i * ARC - Math.PI / 2
      const endAngle = startAngle + ARC
      const seg = SEGMENTS[i]

      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.arc(0, 0, innerR - 2, startAngle, endAngle)
      ctx.closePath()

      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, innerR)
      grad.addColorStop(0, seg.accent)
      grad.addColorStop(0.4, seg.color)
      grad.addColorStop(1, seg.color)
      ctx.fillStyle = grad
      ctx.fill()

      ctx.strokeStyle = 'rgba(255,215,0,0.5)'
      ctx.lineWidth = 1.5
      ctx.stroke()

      ctx.save()
      const midAngle = startAngle + ARC / 2
      ctx.rotate(midAngle)
      ctx.translate(innerR * 0.58, 0)
      ctx.rotate(Math.PI / 2)
      ctx.fillStyle = '#fff'
      ctx.font = `bold ${seg.label === 'No Luck' ? 13 : 16}px Inter, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.shadowColor = 'rgba(0,0,0,0.5)'
      ctx.shadowBlur = 4
      ctx.fillText(seg.label, 0, 0)
      ctx.shadowBlur = 0
      ctx.restore()
    }

    ctx.restore()

    // Center hub
    const hubGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 28)
    hubGrad.addColorStop(0, '#ffd700')
    hubGrad.addColorStop(0.7, '#e6a800')
    hubGrad.addColorStop(1, '#b8860b')
    ctx.beginPath()
    ctx.arc(cx, cy, 28, 0, Math.PI * 2)
    ctx.fillStyle = hubGrad
    ctx.fill()
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.fillStyle = '#8b0000'
    ctx.font = 'bold 12px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('SPIN', cx, cy)

    // Pointer
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(cx, cy - innerR + 14)
    ctx.lineTo(cx - 14, cy - outerR - 6)
    ctx.lineTo(cx + 14, cy - outerR - 6)
    ctx.closePath()
    const ptrGrad = ctx.createLinearGradient(cx, cy - outerR - 6, cx, cy - innerR + 14)
    ptrGrad.addColorStop(0, '#ffd700')
    ptrGrad.addColorStop(1, '#e6a800')
    ctx.fillStyle = ptrGrad
    ctx.fill()
    ctx.strokeStyle = '#b8860b'
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.restore()
  }, [])

  // Initial draw
  useEffect(() => {
    drawWheel(0)
    const handleResize = () => drawWheel(angleRef.current)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [drawWheel])

  // Confetti animation
  const animateConfetti = useCallback(() => {
    const canvas = confettiRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles = particlesRef.current
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    let alive = false

    for (const p of particles) {
      p.life++
      if (p.life > p.maxLife) continue
      alive = true
      p.x += p.vx
      p.y += p.vy
      p.vy += 0.12
      p.vx *= 0.99
      p.rotation += p.rotSpeed
      const alpha = 1 - p.life / p.maxLife

      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate((p.rotation * Math.PI) / 180)
      ctx.globalAlpha = alpha

      ctx.fillStyle = p.color
      if (p.shape === 0) {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
      } else if (p.shape === 1) {
        ctx.beginPath()
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
        ctx.fill()
      } else {
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

    if (alive) {
      confettiAnimRef.current = requestAnimationFrame(animateConfetti)
    }
  }, [])

  // Send result to backend
  const notifyBackend = useCallback(async (prize: string): Promise<string | null> => {
    try {
      const res = await fetch('/api/lucky-wheel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: usernameRef.current,
          prize,
          device: getDevice(),
        }),
      })

      const data = await res.json().catch(() => null)
      return data?.claimId || null
    } catch {
      // silent fail
      return null
    }
  }, [])

  // Spin
  const handleSpin = useCallback(() => {
    const canSpinWithVoucher = hasSpun && voucherId && !usingVoucher
    if (spinning || (!canSpinWithVoucher && hasSpun) || !isRegistered) return
    
    if (canSpinWithVoucher) {
      setUsingVoucher(true)
      setHasSpun(false)
      setResult(null)
      setShowResult(false)
      setClaimId(null)
    }
    
    setSpinning(true)

    const { label, segmentIndex } = pickPrize(currentOdds)
    const segCenter = segmentIndex * ARC + ARC / 2
    const extraSpins = 5 + Math.floor(Math.random() * 3)
    const targetAngle = extraSpins * Math.PI * 2 + (2 * Math.PI - segCenter)

    const startAngle = angleRef.current % (Math.PI * 2)
    const totalDelta = targetAngle - startAngle
    const duration = 4000 + Math.random() * 1000
    const startTime = performance.now()

    const animate = (now: number) => {
      const elapsed = now - startTime
      const t = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      const currentAngle = startAngle + totalDelta * eased

      angleRef.current = currentAngle
      drawWheel(currentAngle)

      if (t < 1) {
        animRef.current = requestAnimationFrame(animate)
      } else {
        angleRef.current = currentAngle
        setSpinning(false)
        setResult(label)
        setShowResult(true)
        setHasSpun(true)
        localStorage.setItem(STORAGE_KEY, '1')
        localStorage.setItem(RESULT_KEY, label)

        // If using voucher, consume it
        if (usingVoucher && voucherId) {
          fetch('/api/lucky-wheel/check-voucher', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ voucherId }),
          }).then(() => {
            setVoucherId(null)
            setUsingVoucher(false)
          }).catch(() => {})
        }

        // Notify backend (Telegram) + claim ID
        setClaimId(null)
        notifyBackend(label).then((id) => {
          if (id) {
            setClaimId(id)
            localStorage.setItem(CLAIM_KEY, id)
          }
        })

        // Confetti
        particlesRef.current = spawnParticles(window.innerWidth / 2, window.innerHeight / 2)
        confettiAnimRef.current = requestAnimationFrame(animateConfetti)
      }
    }

    animRef.current = requestAnimationFrame(animate)
  }, [spinning, hasSpun, isRegistered, voucherId, usingVoucher, drawWheel, animateConfetti, notifyBackend])

  // If user already spun, fetch latest prize/claimId from backend for persistent display
  useEffect(() => {
    if (!hasSpun || !usernameRef.current) return

    const run = async () => {
      try {
        const res = await fetch(`/api/lucky-wheel?username=${encodeURIComponent(usernameRef.current)}`)
        const data = await res.json()
        if (data?.alreadySpun) {
          if (data.prize) setResult(data.prize)
          if (data.claimId) setClaimId(data.claimId)
          setClaimExpired(Boolean(data.claimExpired))
        }
      } catch {
        // ignore
      }
    }

    run()
  }, [hasSpun])

  // Cleanup
  useEffect(() => {
    return () => {
      cancelAnimationFrame(animRef.current)
      cancelAnimationFrame(confettiAnimRef.current)
    }
  }, [])

  return (
    <>
      {/* Confetti overlay */}
      <canvas
        ref={confettiRef}
        style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          pointerEvents: 'none', zIndex: 10000,
        }}
      />

      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #1a0505 0%, #2d0a0a 40%, #1a0505 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '24px 16px 100px', position: 'relative', overflow: 'hidden',
      }}>
        {/* Background decorations */}
        <div style={{
          position: 'absolute', top: '-100px', left: '-100px', width: '300px', height: '300px',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(230,53,32,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-100px', right: '-100px', width: '400px', height: '400px',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,170,51,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '12px', zIndex: 1 }}>
          <div style={{
            display: 'inline-block', padding: '4px 16px', borderRadius: '999px',
            background: 'linear-gradient(135deg, #ffd700 0%, #ffaa33 100%)',
            color: '#1a0505', fontSize: '12px', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px',
          }}>
            🎰 CM8 VVIP Lucky Spin
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(24px, 6vw, 36px)', fontWeight: 800,
            background: 'linear-gradient(135deg, #ffd700 0%, #ffaa33 50%, #ffd700 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            margin: '8px 0 4px', lineHeight: 1.2,
          }}>
            Putar &amp; Menang!
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', margin: 0 }}>
            Satu peluang untuk menangi hadiah eksklusif
          </p>
        </div>

        {/* Username Registration Form */}
        {!isRegistered && !hasSpun && (
          <div style={{
            width: '100%', maxWidth: '380px', zIndex: 1, marginBottom: '16px',
            background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '20px',
            border: '1px solid rgba(255,215,0,0.2)',
          }}>
            {/* Important Notice */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(230,53,32,0.25), rgba(255,107,74,0.15))',
              border: '2px solid rgba(230,53,32,0.6)',
              borderRadius: '12px', padding: '16px', marginBottom: '16px',
              textAlign: 'center',
            }}>
              <div style={{
                fontSize: '15px', fontWeight: 800, color: '#ff4433',
                marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px',
              }}>
                ⚠️ PERHATIAN PENTING
              </div>
              <p style={{
                color: 'rgba(255,255,255,0.85)', fontSize: '13px',
                margin: '0 0 8px', lineHeight: 1.6,
              }}>
                Anda mesti <strong style={{ color: '#ffd700' }}>daftar akaun Daily Check-in</strong> terlebih dahulu sebelum boleh spin.
              </p>
              <p style={{
                color: '#ff6b4a', fontSize: '12px', fontWeight: 700,
                margin: '0 0 12px', lineHeight: 1.5,
              }}>
                ❌ ID yang didaftarkan MESTI sama dengan ID CM8 anda.<br />
                Jika tidak sama, hadiah TIDAK akan diproses.
              </p>
            </div>

            {checkinLoading ? (
              <div style={{ textAlign: 'center', color: '#ffd700', fontSize: '14px', padding: '10px' }}>
                ⏳ Memeriksa akaun...
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <p style={{
                  color: 'rgba(255,255,255,0.7)', fontSize: '14px',
                  margin: '0 0 16px', lineHeight: 1.6,
                }}>
                  Sila daftar akaun di halaman <strong style={{ color: '#ffd700' }}>Check-in Harian</strong> untuk mendapatkan akses spin.
                </p>
                <a
                  href="/checkin"
                  style={{
                    display: 'inline-block', padding: '14px 32px', borderRadius: '999px',
                    background: 'linear-gradient(135deg, #ffd700 0%, #ffaa33 100%)',
                    color: '#1a0505', fontSize: '16px', fontWeight: 700,
                    textDecoration: 'none', boxShadow: '0 4px 20px rgba(255,215,0,0.4)',
                    textTransform: 'uppercase', letterSpacing: '1px',
                  }}
                >
                  📝 Daftar / Log Masuk
                </a>
                <p style={{
                  color: 'rgba(255,255,255,0.3)', fontSize: '10px',
                  margin: '12px 0 0',
                }}>
                  Pastikan CM8 Player ID anda betul semasa pendaftaran
                </p>
              </div>
            )}
          </div>
        )}

        {/* Welcome message after login */}
        {isRegistered && !hasSpun && !spinning && (
          <div style={{
            textAlign: 'center', marginBottom: '8px', zIndex: 1,
            padding: '12px 16px', borderRadius: '12px',
            background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.2)',
            maxWidth: '380px', width: '100%',
          }}>
            <span style={{ color: '#ffd700', fontSize: '14px', fontWeight: 700 }}>
              👤 {username}
            </span>
            <p style={{ color: '#ff6b4a', fontSize: '11px', margin: '6px 0 0', fontWeight: 600 }}>
              ⚠️ ID ini mesti sama dengan ID CM8 anda. Jika berbeza, hadiah tidak dapat diclaim.
            </p>
          </div>
        )}

        {/* Wheel */}
        <div style={{
          position: 'relative', width: '100%', maxWidth: '380px',
          display: 'flex', justifyContent: 'center', zIndex: 1,
        }}>
          <canvas ref={canvasRef} style={{ display: 'block' }} />
        </div>

        {/* Spin Button — only show after registration */}
        {isRegistered && !hasSpun && (
          <button
            onClick={handleSpin}
            disabled={spinning}
            style={{
              marginTop: '20px', padding: '16px 48px', border: 'none', borderRadius: '999px',
              background: spinning
                ? 'rgba(255,255,255,0.1)'
                : 'linear-gradient(135deg, #ffd700 0%, #ffaa33 50%, #e6a800 100%)',
              color: spinning ? 'rgba(255,255,255,0.4)' : '#1a0505',
              fontSize: '18px', fontWeight: 800, cursor: spinning ? 'not-allowed' : 'pointer',
              textTransform: 'uppercase', letterSpacing: '2px',
              boxShadow: spinning ? 'none' : '0 4px 30px rgba(255,215,0,0.4)',
              transition: 'all 0.3s ease', zIndex: 1,
              animation: spinning ? 'none' : 'lw-pulse-btn 2s ease-in-out infinite',
            }}
          >
            {spinning ? '⏳ Sedang Berputar...' : '🎰 PUTAR SEKARANG!'}
          </button>
        )}

        {/* Already spun message */}
        {hasSpun && !showResult && (
          <div style={{
            marginTop: '24px', textAlign: 'center', padding: '20px', zIndex: 1,
            background: 'rgba(255,255,255,0.05)', borderRadius: '16px',
            border: '1px solid rgba(255,215,0,0.2)',
          }}>
            <p style={{ color: '#ffd700', fontSize: '16px', fontWeight: 600, margin: '0 0 8px' }}>
              ✨ Anda sudah memutar roda!
            </p>
            {result && (
              <p style={{ color: '#fff', fontSize: '14px', fontWeight: 700, margin: '0 0 6px' }}>
                Hadiah anda: <span style={{ color: '#ffd700' }}>{result}</span>
              </p>
            )}
            {claimId && (
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', margin: '0 0 8px' }}>
                Claim ID: <span style={{ color: '#ffd700', fontWeight: 700 }}>{claimId}</span>
              </p>
            )}
            {result && result !== 'No Luck' && (
              <p style={{ color: claimExpired ? '#ff6b6b' : '#ffb84d', fontSize: '12px', margin: '0 0 12px', fontWeight: 700 }}>
                {claimExpired
                  ? '⚠️ Tempoh claim 10 minit telah tamat.'
                  : '⏳ Tempoh sah claim: 10 minit selepas spin.'}
              </p>
            )}
            <a
              href={CTA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block', padding: '12px 32px', borderRadius: '999px',
                background: 'linear-gradient(135deg, #e63520 0%, #ff6b4a 100%)',
                color: '#fff', fontSize: '16px', fontWeight: 700,
                textDecoration: 'none', boxShadow: '0 4px 20px rgba(230,53,32,0.4)',
              }}
            >
              🚀 Daftar Sekarang
            </a>
            {voucherId && !usingVoucher && (
              <button
                onClick={handleSpin}
                style={{
                  display: 'block', width: '100%', marginTop: '12px',
                  padding: '14px 32px', borderRadius: '999px',
                  background: 'linear-gradient(135deg, #ffd700 0%, #ff8c00 100%)',
                  color: '#1a0505', fontSize: '16px', fontWeight: 700,
                  border: 'none', cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(255,215,0,0.4)',
                }}
              >
                🎟️ Guna Voucher Spin (Check-in)
              </button>
            )}
          </div>
        )}

        {/* Prize legend */}
        <div style={{
          marginTop: '24px', width: '100%', maxWidth: '380px', zIndex: 1,
          background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '16px',
          border: '1px solid rgba(255,215,0,0.1)',
        }}>
          <div style={{
            fontSize: '13px', fontWeight: 700, color: '#ffd700',
            marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px',
          }}>
            🏆 Senarai Hadiah
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            {[
              { label: 'RM10 Kredit', icon: '💰' },
              { label: 'RM30 Kredit', icon: '💎' },
              { label: 'RM50 Kredit', icon: '🌟' },
              { label: 'RM100 Kredit', icon: '👑' },
            ].map((p) => (
              <div key={p.label} style={{
                display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 8px',
                borderRadius: '8px', background: 'rgba(255,255,255,0.03)',
              }}>
                <span style={{ fontSize: '16px' }}>{p.icon}</span>
                <div>
                  <div style={{ color: '#fff', fontSize: '12px', fontWeight: 600 }}>{p.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Terms & Conditions */}
        <div style={{
          marginTop: '16px', width: '100%', maxWidth: '380px', zIndex: 1,
          background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '16px',
          border: '1px solid rgba(255,215,0,0.08)',
        }}>
          <div style={{
            fontSize: '12px', fontWeight: 700, color: '#ffd700',
            marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px',
          }}>
            📋 Terma &amp; Syarat
          </div>
          <ul style={{
            color: 'rgba(255,255,255,0.5)', fontSize: '11px', lineHeight: 1.7,
            margin: 0, paddingLeft: '16px', listStyle: 'disc',
          }}>
            <li>Welcome Lucky Wheel reward tertakluk kepada kelayakan ahli baru sahaja</li>
            <li>Setiap akaun hanya layak 1 kali putaran</li>
            <li>Bonus yang dimenangi adalah dalam bentuk kredit promosi</li>
            <li>Rollover requirement: x5 daripada jumlah bonus<br/>
              <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '10px' }}>
                (Contoh: Menang RM50 → Perlu turnover RM250 sebelum withdraw)
              </span>
            </li>
            <li>Tidak boleh digabungkan dengan promosi lain</li>
            <li>Pihak pengurusan berhak mengubah terma tanpa notis awal</li>
          </ul>
          <div style={{ marginTop: '12px', textAlign: 'center' }}>
            <a
              href={CTA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#ffd700', fontSize: '12px', fontWeight: 600,
                textDecoration: 'underline',
              }}
            >
              Daftar di sini untuk tebus hadiah anda →
            </a>
          </div>
        </div>
      </div>

      {/* Result Modal */}
      {showResult && result && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: 9999, padding: '20px',
            animation: 'lw-fade-in 0.3s ease',
          }}
          onClick={() => setShowResult(false)}
        >
          <div
            style={{
              background: 'linear-gradient(180deg, #2d0a0a 0%, #1a0505 100%)',
              borderRadius: '24px', padding: '32px 24px', maxWidth: '360px', width: '100%',
              textAlign: 'center', border: '2px solid rgba(255,215,0,0.3)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(255,215,0,0.1)',
              animation: 'lw-scale-in 0.4s ease',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: '56px', marginBottom: '8px' }}>🎉</div>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '24px', fontWeight: 800, color: '#ffd700',
              marginBottom: '4px',
            }}>
              Tahniah {username}!
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '16px' }}>
              Anda telah memenangi
            </p>
            <div style={{
              display: 'inline-block', padding: '12px 28px', borderRadius: '999px',
              background: 'linear-gradient(135deg, #ffd700 0%, #ffaa33 100%)',
              color: '#1a0505', fontSize: '28px', fontWeight: 900,
              marginBottom: '20px', boxShadow: '0 4px 20px rgba(255,215,0,0.3)',
            }}>
              {result === 'No Luck' ? '😅 No Luck' : `💰 ${result}`}
            </div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginBottom: '20px', lineHeight: 1.5 }}>
              {result === 'No Luck'
                ? 'Malangnya tiada hadiah kali ini. Cuba lagi lain kali!'
                : `Hubungi admin untuk tebus kredit ${result} anda!`}
            </p>
            {result !== 'No Luck' && (
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginBottom: '8px', lineHeight: 1.5, fontStyle: 'italic' }}>
                📸 Screenshot gambar ini sebagai bukti dan hantar kepada admin
              </p>
            )}
            {result !== 'No Luck' && (
              <p style={{ color: '#ffb84d', fontSize: '12px', marginBottom: '10px', lineHeight: 1.4, fontWeight: 700 }}>
                ⏳ Claim reward sah dalam 10 minit selepas spin.
              </p>
            )}
            {result !== 'No Luck' && claimId && (
              <>
                <p style={{ color: '#ffd700', fontSize: '12px', marginBottom: '10px', lineHeight: 1.5, fontWeight: 700 }}>
                  🧾 Claim ID: {claimId}
                </p>
                <a
                  href={`/api/lucky-wheel/claim-image/${claimId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'block', marginBottom: '12px' }}
                >
                  <img
                    src={`/api/lucky-wheel/claim-image/${claimId}`}
                    alt="Slip hasil putaran"
                    style={{ width: '100%', maxWidth: '280px', borderRadius: '12px', border: '1px solid rgba(255,215,0,0.35)' }}
                  />
                </a>
              </>
            )}
            {result !== 'No Luck' && (
              <a
                href={`https://wa.me/60172722902?text=${encodeURIComponent(`Hi Admin CM8, saya ${username} menang ${result} di Lucky Wheel.${claimId ? ` Claim ID: ${claimId}.` : ''} Saya lampirkan screenshot sebagai bukti untuk claim.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '12px 28px', borderRadius: '999px',
                  background: '#25D366', color: '#fff', fontSize: '15px',
                  fontWeight: 700, textDecoration: 'none', marginBottom: '12px',
                  boxShadow: '0 4px 15px rgba(37,211,102,0.4)',
                }}
              >
                📱 Share Claim ke WhatsApp Admin
              </a>
            )}
            <a
              href={CTA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block', padding: '14px 40px', borderRadius: '999px',
                background: 'linear-gradient(135deg, #e63520 0%, #ff6b4a 100%)',
                color: '#fff', fontSize: '18px', fontWeight: 700, textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(230,53,32,0.5)',
                animation: 'lw-pulse-btn 2s ease-in-out infinite',
              }}
            >
              🚀 Daftar Sekarang
            </a>
            <div style={{ marginTop: '12px' }}>
              <button
                onClick={() => setShowResult(false)}
                style={{
                  background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)',
                  fontSize: '13px', cursor: 'pointer', padding: '8px',
                }}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keyframe styles */}
      <style>{`
        @keyframes lw-pulse-btn {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes lw-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes lw-scale-in {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
      `}
      </style>
    </>
  )
}
