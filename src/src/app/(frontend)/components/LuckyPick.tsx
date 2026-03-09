'use client'

import React, { useState, useEffect, useRef } from 'react'

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

/* ═══════════════════════════════════════════
   CM8VVIP Lucky Pick — 9-Card Game
   ═══════════════════════════════════════════ */
export default function LuckyPick() {
  const [phase, setPhase] = useState<'ready' | 'picking' | 'revealing' | 'result'>('ready')
  const [selectedCard, setSelectedCard] = useState<number | null>(null)
  const [result, setResult] = useState<{
    prize: string; prizeValue: number; prizeColor: string; prizeEmoji: string
    fomoCards: { index: number; label: string }[]; isWinner: boolean
  } | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [revealedCards, setRevealedCards] = useState<boolean[]>(new Array(9).fill(false))
  const [alreadyPlayed, setAlreadyPlayed] = useState(false)
  const [needCheckin, setNeedCheckin] = useState(false)
  const confettiRef = useRef<HTMLCanvasElement>(null)

  // Check login and daily status
  useEffect(() => {
    fetch('/api/lucky-pick/status')
      .then(r => r.json())
      .catch(() => {})
  }, [])

  const handlePick = async (cardIndex: number) => {
    if (phase !== 'ready' || loading) return
    setSelectedCard(cardIndex)
    setPhase('picking')
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/lucky-pick/play', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardPicked: cardIndex }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Ralat bermain')
        if (data.alreadyPlayed) setAlreadyPlayed(true)
        if (data.needCheckin) setNeedCheckin(true)
        setPhase('result')
        return
      }

      setResult(data)
      setPhase('revealing')

      // Reveal non-picked cards one by one (FOMO)
      const fomoOrder = data.fomoCards
        .map((f: { index: number }) => f.index)
        .sort(() => Math.random() - 0.5)

      fomoOrder.forEach((idx: number, i: number) => {
        setTimeout(() => {
          setRevealedCards(prev => { const n = [...prev]; n[idx] = true; return n })
        }, 300 + i * 250)
      })

      // Reveal picked card last
      setTimeout(() => {
        setRevealedCards(prev => { const n = [...prev]; n[cardIndex] = true; return n })
        setPhase('result')
        if (data.isWinner && confettiRef.current) createConfetti(confettiRef.current)
      }, 300 + fomoOrder.length * 250 + 500)

    } catch {
      setError('Gagal bermain. Cuba lagi.')
      setPhase('ready')
      setSelectedCard(null)
    } finally {
      setLoading(false)
    }
  }

  const getCardDisplay = (index: number) => {
    if (!revealedCards[index]) return null
    if (index === selectedCard && result) {
      return { label: result.prize, color: result.prizeColor, emoji: result.prizeEmoji }
    }
    const fomo = result?.fomoCards.find(f => f.index === index)
    if (fomo) {
      const fomoColors: Record<string, string> = {
        'RM388': '#FFD700', 'RM100': '#E91E63', 'RM50': '#FF9800', 'RM10': '#2196F3'
      }
      return { label: fomo.label, color: fomoColors[fomo.label] || '#666', emoji: '' }
    }
    return null
  }

  return (
    <>
      <style>{`
        .lp-wrapper {
          min-height: 100vh; display: flex; flex-direction: column;
          align-items: center; justify-content: center; padding: 20px;
          position: relative; overflow: hidden;
          background: #000;
        }
        .lp-wrapper::before {
          content: ''; position: absolute; inset: 0;
          background:
            radial-gradient(ellipse at 20% 50%, rgba(230,53,32,0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 50%, rgba(255,215,0,0.06) 0%, transparent 50%);
          pointer-events: none;
        }
        .lp-logo { margin-bottom: 12px; }
        .lp-logo img { height: 64px; border-radius: 12px; }
        .lp-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 2rem; font-weight: 900; margin-bottom: 4px;
          background: linear-gradient(135deg, #FFD700, #ffa500, #ff8c42);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          text-align: center;
        }
        .lp-subtitle {
          color: rgba(255,255,255,0.5); font-size: 0.85rem; margin-bottom: 24px; text-align: center;
        }
        .lp-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 12px; max-width: 360px; width: 100%; margin-bottom: 24px;
        }
        .lp-card {
          aspect-ratio: 1; border-radius: 16px; cursor: pointer;
          border: 2px solid rgba(255,215,0,0.2);
          background: linear-gradient(145deg, rgba(255,255,255,0.06), rgba(230,53,32,0.04));
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          transition: all 0.4s cubic-bezier(0.175,0.885,0.32,1.275);
          position: relative; overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.4);
        }
        .lp-card:hover:not([data-disabled="true"]) {
          transform: translateY(-4px) scale(1.05);
          border-color: rgba(255,215,0,0.5);
          box-shadow: 0 8px 30px rgba(255,215,0,0.15);
        }
        .lp-card[data-disabled="true"] { cursor: default; }
        .lp-card-face {
          font-size: 32px; transition: transform 0.6s;
        }
        .lp-card-num {
          position: absolute; top: 6px; left: 8px;
          font-size: 11px; color: rgba(255,255,255,0.25); font-weight: 700;
        }
        .lp-card[data-selected="true"] {
          border-color: #4CAF50 !important; border-width: 3px;
          box-shadow: 0 0 30px rgba(76,175,80,0.3);
        }
        .lp-card[data-selected="true"] .lp-selected-badge {
          display: block;
        }
        .lp-selected-badge {
          display: none; position: absolute; bottom: 4px;
          font-size: 8px; font-weight: 800; color: #4CAF50;
          letter-spacing: 0.5px; text-transform: uppercase;
        }
        .lp-card[data-revealed="true"] {
          animation: lpFlip 0.5s ease-out;
        }
        .lp-card[data-revealed="true"][data-winner="true"] {
          border-color: #4CAF50; background: rgba(76,175,80,0.15);
        }
        @keyframes lpFlip {
          0% { transform: rotateY(0deg); }
          50% { transform: rotateY(90deg); }
          100% { transform: rotateY(0deg); }
        }
        .lp-prize-label {
          font-size: 18px; font-weight: 900; text-align: center; line-height: 1.2;
        }
        .lp-error {
          background: rgba(230,53,32,0.15); border: 1px solid rgba(230,53,32,0.3);
          border-radius: 12px; padding: 12px 16px; margin: 16px 0;
          color: #ff6b6b; font-size: 0.88rem; text-align: center; max-width: 360px;
        }
        .lp-result-box {
          max-width: 360px; width: 100%; border-radius: 20px; padding: 24px;
          text-align: center; margin-top: 8px;
        }
        .lp-result-win {
          background: linear-gradient(135deg, rgba(76,175,80,0.15), rgba(255,215,0,0.1));
          border: 2px solid rgba(76,175,80,0.3);
        }
        .lp-result-lose {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .lp-result-prize {
          font-size: 2.5rem; font-weight: 900; margin: 8px 0;
        }
        .lp-wa-btn {
          display: inline-block; padding: 14px 28px; border-radius: 14px;
          background: #25D366; color: #fff; font-weight: 700; font-size: 1rem;
          text-decoration: none; margin-top: 12px;
          box-shadow: 0 4px 20px rgba(37,211,102,0.3);
          transition: transform 0.2s;
        }
        .lp-wa-btn:hover { transform: translateY(-2px); }
        .lp-confetti {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          pointer-events: none; z-index: 9999;
        }
        .lp-info {
          color: rgba(255,255,255,0.3); font-size: 0.75rem; text-align: center;
          margin-top: 16px; max-width: 360px;
        }
      `}</style>

      <canvas ref={confettiRef} className="lp-confetti" />

      <div className="lp-wrapper">
        <div className="lp-logo">
          <img src="/cm8-logo.png" alt="CM8VVIP" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
        </div>

        <div className="lp-title">CM8VVIP Lucky Pick</div>
        <div className="lp-subtitle">
          {phase === 'ready' && !alreadyPlayed && 'Pilih 1 kad — peluang menang sehingga RM388!'}
          {phase === 'picking' && 'Membuka kad...'}
          {phase === 'revealing' && 'Membuka kad-kad lain...'}
          {alreadyPlayed && 'Anda sudah bermain hari ini!'}
          {needCheckin && 'Sila check-in harian dahulu!'}
        </div>

        {error && <div className="lp-error">{error}</div>}

        {needCheckin && (
          <a
            href="/checkin"
            style={{
              display: 'inline-block', padding: '14px 28px', borderRadius: '14px',
              background: 'linear-gradient(135deg, #FFD700, #ff8c42)', color: '#1a0505',
              fontWeight: 700, fontSize: '1rem', textDecoration: 'none', marginBottom: '16px',
              boxShadow: '0 4px 20px rgba(255,215,0,0.3)',
            }}
          >
            {'\u2705'} Check-in Sekarang
          </a>
        )}

        <div className="lp-grid">
          {Array.from({ length: 9 }).map((_, i) => {
            const display = getCardDisplay(i)
            const isRevealed = revealedCards[i]
            const isSelected = selectedCard === i
            const isDisabled = phase !== 'ready' || alreadyPlayed || needCheckin

            return (
              <div
                key={i}
                className="lp-card"
                data-disabled={isDisabled ? 'true' : undefined}
                data-selected={isSelected ? 'true' : undefined}
                data-revealed={isRevealed ? 'true' : undefined}
                data-winner={isSelected && result?.isWinner ? 'true' : undefined}
                onClick={() => !isDisabled && handlePick(i)}
              >
                <span className="lp-card-num">{i + 1}</span>
                {!isRevealed ? (
                  <span className="lp-card-face">{isSelected ? '⏳' : '🃏'}</span>
                ) : (
                  <div className="lp-prize-label" style={{ color: display?.color || '#fff' }}>
                    {display?.emoji && <div style={{ fontSize: '28px', marginBottom: '2px' }}>{display.emoji}</div>}
                    {display?.label}
                  </div>
                )}
                <span className="lp-selected-badge">PILIHAN ANDA</span>
              </div>
            )
          })}
        </div>

        {phase === 'result' && result && !error && (
          <div className={`lp-result-box ${result.isWinner ? 'lp-result-win' : 'lp-result-lose'}`}>
            {result.isWinner ? (
              <>
                <div style={{ fontSize: '1.2rem', color: '#FFD700' }}>{'🎉'} Tahniah! Anda menang!</div>
                <div className="lp-result-prize" style={{ color: result.prizeColor }}>
                  {result.prizeEmoji} {result.prize}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '8px' }}>
                  Screenshot keputusan ini dan claim hadiah anda!
                </div>
                <a
                  className="lp-wa-btn"
                  href="https://wa.me/60172722902?text=Saya%20menang%20Lucky%20Pick%20CM8VVIP!"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {'📲'} Claim via WhatsApp
                </a>
              </>
            ) : (
              <>
                <div style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.6)' }}>{result.prizeEmoji} {result.prize}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '8px' }}>
                  Jangan risau, cuba lagi esok! Setiap hari ada peluang baru {'💪'}
                </div>
              </>
            )}
          </div>
        )}

        <div className="lp-info">
          1 percubaan percuma setiap hari {'•'} Hadiah dari RM3 hingga RM388<br/>
          Screenshot &amp; WhatsApp <strong style={{color:'#25D366'}}>017-272 2902</strong> untuk claim
        </div>
      </div>
    </>
  )
}
