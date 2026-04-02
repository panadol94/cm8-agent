'use client'

import { useState, useEffect, useCallback } from 'react'
import LuckySpinWheel from '../components/LuckySpinWheel'
import LuckySpinWinPopup from '../components/LuckySpinWinPopup'

const SEGMENTS = [
  { label: 'RM100', color: '#FFD700', textColor: '#000', type: 'cash' },
  { label: 'RM188', color: '#FF6B6B', textColor: '#FFF', type: 'cash' },
  { label: 'RM288', color: '#E879F9', textColor: '#FFF', type: 'cash' },
  { label: 'RM388', color: '#F7931A', textColor: '#000', type: 'cash' },
  { label: 'RM588', color: '#7C3AED', textColor: '#FFF', type: 'cash' },
  { label: 'Gold 5g', color: '#00D4AA', textColor: '#000', type: 'gold' },
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

  const checkStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/luckyspin')
      const data = await res.json()
      setEventActive(data.active)
    } catch {
      setEventActive(false)
    }
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
        headers: { 'Content-Type': 'application/json' },
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
      setError(data.error || 'Spin gagal.')
      return data
    }

    return data
  }

  const handleLogout = async () => {
    await fetch('/api/luckyspin/logout', { method: 'POST', credentials: 'include' })
    setIsLoggedIn(false)
    setAgentId('')
    setHasSpun(false)
    setError(null)
    setWinner(null)
  }

  const canSpin = isLoggedIn && eventActive && !hasSpun && !spinning && !error

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#1c214f_0%,#0b1026_35%,#060812_100%)] text-white overflow-x-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(120deg,transparent_0%,rgba(255,215,0,0.08)_20%,transparent_40%,rgba(255,255,255,0.04)_60%,transparent_80%)]" />

      {/* Header */}
      <div className="relative border-b border-yellow-500/20 bg-black/20 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-400/20 text-yellow-300 text-xs font-bold tracking-[0.2em] uppercase mb-4">
            <span>VVIP Event</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 drop-shadow-[0_0_18px_rgba(255,215,0,0.25)]">
            🎰 Lucky Spin VVIP
          </h1>
          <p className="text-white/60 text-sm md:text-base mt-3">Event eksklusif untuk agent CM8 VVIP. Login, spin dan tuntut hadiah anda.</p>
        </div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 py-8 md:py-10">
        {winner && (
          <LuckySpinWinPopup
            reward={winner.reward}
            rewardType={winner.rewardType}
            onClose={() => {
              setWinner(null)
              setHasSpun(true)
              setError('Terima kasih! Hadiah anda akan dihubungi oleh admin.')
            }}
          />
        )}

        {!isLoggedIn ? (
          <div className="max-w-md mx-auto mt-6 md:mt-10">
            <div className="relative bg-white/5 backdrop-blur-2xl rounded-[28px] p-7 md:p-8 border border-yellow-500/20 shadow-[0_20px_80px_rgba(0,0,0,0.45)] overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent" />
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400/20 via-yellow-300/10 to-transparent border border-yellow-400/20 flex items-center justify-center text-4xl shadow-[0_0_40px_rgba(255,215,0,0.18)]">
                  🎡
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-yellow-300">Login dengan Agent ID</h2>
                <p className="text-white/55 text-sm mt-2">Masukkan Agent ID yang telah dimasukkan dalam whitelist untuk terus bermain.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-[0.18em] text-white/45 mb-2">Agent ID</label>
                  <input
                    type="text"
                    value={agentId}
                    onChange={e => setAgentId(e.target.value.toUpperCase())}
                    placeholder="Contoh: V8GARRY"
                    className="w-full px-4 py-4 rounded-2xl bg-white/10 border border-yellow-500/25 text-white placeholder-white/30 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 font-mono text-center text-lg uppercase shadow-inner"
                    autoComplete="off"
                  />
                </div>

                {loginError && (
                  <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-200 text-sm text-center">
                    {loginError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !agentId.trim()}
                  className="w-full py-4 rounded-2xl font-black text-black text-lg bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 shadow-[0_10px_30px_rgba(255,215,0,0.28)] disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] transition-all"
                >
                  {loading ? 'Memproses...' : 'MASUK SEKARANG'}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-[360px,1fr] gap-6 md:gap-8 items-start mt-4">
            {/* Left info panel */}
            <div className="space-y-4">
              <div className="bg-white/5 backdrop-blur-2xl rounded-[24px] border border-yellow-500/20 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <p className="text-white/45 text-xs uppercase tracking-[0.18em] mb-2">Agent</p>
                    <p className="text-yellow-300 font-mono text-xl font-bold break-all">{agentId}</p>
                  </div>
                  <button onClick={handleLogout} className="text-white/45 hover:text-white text-xs underline underline-offset-2">Logout</button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className={`px-3 py-1.5 rounded-full text-[11px] font-black tracking-wide ${eventActive ? 'bg-green-500/15 text-green-300 border border-green-400/20' : 'bg-red-500/15 text-red-300 border border-red-400/20'}`}>
                    {eventActive ? 'EVENT AKTIF' : 'EVENT TUTUP'}
                  </span>
                  {hasSpun && (
                    <span className="px-3 py-1.5 rounded-full text-[11px] font-black tracking-wide bg-yellow-500/15 text-yellow-300 border border-yellow-400/20">
                      SUDAH SPIN
                    </span>
                  )}
                </div>
              </div>

              {error && (
                <div className="rounded-[24px] border border-red-500/35 bg-red-500/10 backdrop-blur-xl p-4 text-red-200 text-sm shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
                  <div className="font-bold mb-1">⚠️ Makluman</div>
                  <div>{error}</div>
                </div>
              )}

              <div className="bg-white/5 backdrop-blur-2xl rounded-[24px] border border-yellow-500/20 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                <h3 className="text-yellow-300 font-bold text-sm uppercase tracking-[0.18em] mb-3">Info Event</h3>
                <div className="space-y-3 text-sm text-white/70">
                  <div className="flex items-start gap-3">
                    <span className="text-yellow-300">•</span>
                    <p>Hanya Agent ID yang ada dalam whitelist dibenarkan login dan spin.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-yellow-300">•</span>
                    <p>Setiap Agent ID hanya ada <strong className="text-white">satu peluang</strong>.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-yellow-300">•</span>
                    <p>Hadiah diagih ikut <strong className="text-white">fixed pool</strong>.</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10 text-xs text-white/45">
                  Event time: 1 April 2026, 5:00 PM - 11:00 PM (MYT)
                </div>
              </div>
            </div>

            {/* Right wheel section */}
            <div className="bg-white/5 backdrop-blur-2xl rounded-[28px] border border-yellow-500/20 p-5 md:p-8 shadow-[0_24px_80px_rgba(0,0,0,0.4)]">
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500">
                  Putar & Menang
                </h2>
                <p className="text-white/50 text-sm mt-2">Tekan butang spin untuk cuba nasib anda dalam event eksklusif ini.</p>
              </div>

              <div className="flex justify-center py-2 md:py-4">
                <LuckySpinWheel
                  segments={SEGMENTS}
                  onSpin={handleSpin}
                  spinning={spinning}
                  setSpinning={setSpinning}
                  hasError={!!error || !canSpin}
                />
              </div>

              <div className="mt-6 text-center">
                {!eventActive && <p className="text-red-300 text-sm">⛔ Event Lucky Spin belum bermula atau telah tamat.</p>}
                {eventActive && !hasSpun && !error && <p className="text-white/55 text-sm">Tekan butang <span className="text-yellow-300 font-bold">SPIN</span> untuk cuba nasib anda.</p>}
                {hasSpun && <p className="text-yellow-300 text-sm font-medium">Terima kasih kerana menyertai Lucky Spin event ini.</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
