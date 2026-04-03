'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useCallback } from 'react'
import LuckySpinWheel from '../components/LuckySpinWheel'
import LuckySpinWinPopup from '../components/LuckySpinWinPopup'

// Segment colors keyed by reward type
const REWARD_TYPE_COLORS: Record<string, { color: string; textColor: string }> = {
  cash: { color: '#FFD700', textColor: '#000' },
  gold: { color: '#00D4AA', textColor: '#000' },
  bonus: { color: '#E879F9', textColor: '#FFF' },
}

// Fallback segments (used before login or when API fails)
const FALLBACK_SEGMENTS = [
  { label: 'RM100', color: '#DC3545', textColor: '#FFF', type: 'cash' },
  { label: 'RM188', color: '#FDD835', textColor: '#000', type: 'cash' },
  { label: 'RM288', color: '#8E24AA', textColor: '#FFD700', type: 'cash' },
  { label: 'RM388', color: '#1E88E5', textColor: '#FFF', type: 'cash' },
  { label: 'RM588', color: '#37474F', textColor: '#FFD700', type: 'cash' },
  { label: '5 Gram Emas', color: '#FFD700', textColor: '#000', type: 'gold' },
]

export default function LuckySpinPage() {
  const [agentId, setAgentId] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(false)
  const [spinning, setSpinning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [eventActive, setEventActive] = useState(false)
  const [hasSpun, setHasSpun] = useState(false)
  const [winner, setWinner] = useState<{ reward: string; rewardType: string } | null>(null)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [segments, setSegments] = useState(FALLBACK_SEGMENTS)
  const [eventStart, setEventStart] = useState<string | null>(null)
  const [eventEnd, setEventEnd] = useState<string | null>(null)

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Tiada data'
    try {
      const d = new Date(dateStr)
      return d.toLocaleString('ms-MY', {
        timeZone: 'Asia/Kuching',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }) + ' (MYT)'
    } catch {
      return dateStr
    }
  }

  const checkStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/luckyspin')
      const data = await res.json()
      setEventActive(data.active)
      if (data.eventStart) setEventStart(data.eventStart)
      if (data.eventEnd) setEventEnd(data.eventEnd)
    } catch {
      setEventActive(false)
    }
  }, [])

  const fetchRewards = useCallback(async () => {
    try {
      const res = await fetch('/api/luckyspin/admin/rewards', { credentials: 'include' })
      if (!res.ok) return
      const rewards: Array<{ rewardName: string; rewardType: string; isActive: boolean; position: number }> = await res.json()
      const active = rewards.filter((r: any) => r.isActive).sort((a: any, b: any) => a.position - b.position)
      if (active.length > 0) {
        const built = active.map((r: any) => {
          const style = REWARD_TYPE_COLORS[r.rewardType] || REWARD_TYPE_COLORS.cash
          return { label: r.rewardName, color: style.color, textColor: style.textColor, type: r.rewardType }
        })
        setSegments(built)
      }
    } catch {}
  }, [])

  const checkLoginStatus = async () => {
    try {
      const res = await fetch('/api/luckyspin/status', { credentials: 'include' })
      const data = await res.json()
      if (data.error && data.error.includes('Sesi')) {
        setIsLoggedIn(false)
      } else if (data.agentId) {
        setIsLoggedIn(true)
        setHasSpun(data.hasSpun)
        if (!data.eventActive) setError('Event belum bermula atau telah tamat.')
        else if (data.hasSpun) setError('ID ini telah digunakan untuk spin.')
      }
    } catch {}
  }

  useEffect(() => {
    checkStatus()
    checkLoginStatus()
    const interval = setInterval(checkStatus, 30000)
    return () => clearInterval(interval)
  }, [checkStatus])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agentId.trim()) return
    setLoading(true)
    setLoginError(null)

    try {
      const res = await fetch('/api/luckyspin/login', {
        method: 'POST',
        headers: { 'Content-Type: application/json' },
        body: JSON.stringify({ agentId: agentId.trim() }),
        credentials: 'include',
      })
      const data = await res.json()

      if (!res.ok) {
        setLoginError(data.error || 'Login gagal.')
        setLoading(false)
        return
      }

      setIsLoggedIn(true)
      await fetchRewards()

      const statusRes = await fetch('/api/luckyspin/status', { credentials: 'include' })
      const statusData = await statusRes.json()

      if (statusData.hasSpun) {
        setHasSpun(true)
        setError('ID ini telah digunakan untuk spin.')
      } else if (!statusData.eventActive) {
        setError('Event belum bermula atau telah tamat.')
      }
    } catch {
      setLoginError('Ralat server. Sila cuba lagi.')
    }
    setLoading(false)
  }

  const handleSpin = async () => {
    if (!eventActive || hasSpun) return
    setError(null)

    const res = await fetch('/api/luckyspin/spin', {
      method: 'POST',
      credentials: 'include',
    })
    const data = await res.json()

    if (!res.ok) {
      if (res.status === 409) {
        setHasSpun(true)
        setError('ID ini telah digunakan untuk spin.')
      } else {
        setError(data.error || 'Spin gagal.')
      }
      return
    }

    // Show win popup
    setWinner({ reward: data.reward, rewardType: data.rewardType })
    setHasSpun(true)
    return data
  }

  const handleLogout = async () => {
    await fetch('/api/luckyspin/logout', { method: 'POST', credentials: 'include' })
    setIsLoggedIn(false)
    setAgentId('')
    setHasSpun(false)
    setError(null)
    setWinner(null)
    setSegments(FALLBACK_SEGMENTS)
  }

  const canSpin = isLoggedIn && eventActive && !hasSpun && !spinning && !error

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050510] via-[#0d0d2b] to-[#050510] text-white">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-yellow-900 via-yellow-600 to-yellow-900 py-5 px-6 text-center shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-300/20 to-transparent -skew-x-12 ls-shimmer" />
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
        <div className="inline-flex items-center gap-1.5 bg-black/20 backdrop-blur px-3 py-1 rounded-full mb-2">
          <span className="text-yellow-300 text-xs font-bold tracking-widest uppercase">✨ VVIP Event</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-black tracking-widest relative z-10">🎰 Lucky Spin VVIP 🎰</h1>
        <p className="text-yellow-100 text-xs mt-1.5 tracking-wide">Event eksklusif untuk agent CM8 VVIP</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Win Popup */}
        {winner && (
          <LuckySpinWinPopup
            reward={winner.reward}
            rewardType={winner.rewardType}
            onClose={() => setWinner(null)}
          />
        )}

        {!isLoggedIn ? (
          /* Login Form */
          <div className="relative mt-6">
            <div className="absolute -inset-0.5 rounded-[22px] bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 opacity-60 animate-pulse" />
            <div className="relative bg-[#0d0d2b]/90 backdrop-blur-2xl rounded-[20px] p-8 border border-yellow-500/20 shadow-2xl">
              <div className="absolute top-3 left-3 w-2 h-2 bg-yellow-400 rounded-full shadow-[0_0_8px_rgba(255,215,0,0.8)]" />
              <div className="absolute top-3 right-3 w-2 h-2 bg-yellow-400 rounded-full shadow-[0_0_8px_rgba(255,215,0,0.8)]" />

              <div className="text-center mb-7">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-500/20 to-yellow-700/20 rounded-full mb-3 border border-yellow-500/30">
                  <span className="text-4xl">🎡</span>
                </div>
                <h2 className="text-xl font-bold text-yellow-400 tracking-wide">Login dengan Agent ID</h2>
                <p className="text-white/40 text-xs mt-1.5">Masukkan Agent ID yang telah dimasukkan dalam whitelist untuk terus bermain.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={agentId}
                    onChange={e => setAgentId(e.target.value.toUpperCase())}
                    placeholder="Contoh: V8GARRY"
                    className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-yellow-500/30 text-white placeholder-white/30 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 font-mono text-center text-lg uppercase tracking-widest transition-all"
                    autoComplete="off"
                  />
                </div>

                {loginError && (
                  <div className="bg-red-500/15 border border-red-500/40 rounded-xl p-3 text-red-300 text-sm text-center backdrop-blur">
                    {loginError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !agentId.trim()}
                  className="w-full py-3.5 bg-gradient-to-r from-yellow-500 via-yellow-500 to-yellow-600 rounded-xl font-black text-black text-base tracking-wide uppercase disabled:opacity-40 hover:from-yellow-400 hover:to-yellow-500 active:scale-[0.98] transition-all shadow-lg shadow-yellow-500/20"
                >
                  {loading ? 'Memproses...' : '🚀 Login Sekarang'}
                </button>
              </form>

              <p className="text-center text-white/25 text-[10px] mt-5 tracking-wide">🔒 Keselamatan data anda terjamin</p>
            </div>
          </div>
        ) : (
          /* Wheel View */
          <div className="flex flex-col items-center gap-5 mt-6">
            {/* Agent info bar */}
            <div className="w-full bg-[#0d0d2b]/80 backdrop-blur-xl rounded-2xl px-5 py-3 border border-yellow-500/20 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                  <span className="text-yellow-400 font-mono text-sm font-bold tracking-wider">Agent: <span className="text-yellow-200">{agentId}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${eventActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                    {eventActive ? '● EVENT AKTIF' : '○ EVENT TUTUP'}
                  </span>
                  {hasSpun && (
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                      ★ TELAH SPIN
                    </span>
                  )}
                </div>
                <button onClick={handleLogout} className="text-white/30 hover:text-white/70 text-xs font-medium transition-colors">Logout</button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="w-full bg-red-500/15 border border-red-500/40 rounded-xl p-4 text-red-300 text-center text-sm backdrop-blur">
                {error}
              </div>
            )}

            {/* Rules + Wheel + CTA */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left: Rules */}
              <div className="bg-[#0d0d2b]/80 backdrop-blur-xl rounded-2xl border border-yellow-500/20 p-5 shadow-xl">
                <h3 className="text-yellow-400 font-bold text-sm mb-3 uppercase tracking-wider">📋 Syarat Event</h3>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-3">
                    <span className="text-yellow-300">•</span>
                    <p className="text-white/70 text-xs">Hanya Agent ID dalam <strong className="text-white">whitelist</strong> dibenarkan spin.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-yellow-300">•</span>
                    <p className="text-white/70 text-xs">Setiap Agent ID hanya ada <strong className="text-white">satu peluang</strong>.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-yellow-300">•</span>
                    <p className="text-white/70 text-xs">Hadiah diagih ikut <strong className="text-white">fixed pool</strong>.</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10 text-xs text-white/45">
                  {eventStart && eventEnd ? (
                    <>
                      <p className="mb-1">⏰ Event: {formatDate(eventStart)}</p>
                      <p>hingga {formatDate(eventEnd)}</p>
                    </>
                  ) : (
                    <p>⏰ Loading event time...</p>
                  )}
                </div>
              </div>

              {/* Right: Wheel */}
              <div className="flex flex-col items-center">
                <div className="bg-[#0d0d2b]/80 backdrop-blur-xl rounded-2xl border border-yellow-500/20 p-5 shadow-xl w-full">
                  <div className="text-center mb-4">
                    <h2 className="text-xl font-black text-yellow-400">Putar & Menang</h2>
                    <p className="text-white/50 text-xs mt-1">Tekan SPIN untuk cuba nasib!</p>
                  </div>
                  <div className="flex justify-center">
                    <LuckySpinWheel
                      segments={segments}
                      onSpin={handleSpin}
                      spinning={spinning}
                      setSpinning={setSpinning}
                      hasError={!!error || !canSpin}
                      onWin={(reward, rewardType) => setWinner({ reward, rewardType })}
                    />
                  </div>
                </div>

                {/* CTA */}
                {!eventActive && (
                  <div className="text-center mt-3">
                    <span className="text-2xl">⛔</span>
                    <p className="text-white/40 text-xs">Event belum bermula atau telah tamat.</p>
                  </div>
                )}
                {eventActive && !hasSpun && !error && (
                  <div className="text-center mt-3">
                    <p className="text-yellow-400/80 text-xs font-bold tracking-wider uppercase animate-pulse">⬇ Tekan SPIN! ⬇</p>
                  </div>
                )}
                {hasSpun && (
                  <div className="text-center mt-3">
                    <span className="text-2xl">✅</span>
                    <p className="text-white/40 text-xs">Terima kasih! Hadiah akan di hubungi oleh admin.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
