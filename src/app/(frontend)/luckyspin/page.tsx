'use client'

import { useState, useEffect, useCallback } from 'react'
import LuckySpinWheel from '../components/LuckySpinWheel'
import LuckySpinWinPopup from '../components/LuckySpinWinPopup'

const SEGMENTS = [
  { label: 'RM100', color: '#FFD700', textColor: '#000', type: 'cash' },
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

      // Check event status after login
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
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#111133] to-[#0a0a1a] text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 py-4 px-6 text-center shadow-lg">
        <h1 className="text-2xl font-black tracking-wider">🎰 LUCKY SPIN WHEEL 🎰</h1>
        <p className="text-yellow-100 text-sm mt-1">Event Eksklusif untuk Agent CM8 VVIP</p>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8">
        {winner && (
          <LuckySpinWinPopup
            reward={winner.reward}
            rewardType={winner.rewardType}
            onClose={() => {
              setWinner(null)
              setHasSpun(true)
              setError('Terima kasih! Hadiah anda akan di kontak oleh admin.')
            }}
          />
        )}

        {!isLoggedIn ? (
          /* LOGIN FORM */
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-yellow-500/20 shadow-2xl mt-8">
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">🎡</div>
              <h2 className="text-xl font-bold text-yellow-400">Login dengan Agent ID</h2>
              <p className="text-white/60 text-sm mt-1">Masukkan Agent ID anda untuk participate</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="text"
                value={agentId}
                onChange={e => setAgentId(e.target.value.toUpperCase())}
                placeholder="Masukkan Agent ID"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-yellow-500/30 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400 font-mono text-center text-lg uppercase"
                autoComplete="off"
              />

              {loginError && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 text-red-300 text-sm text-center">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !agentId.trim()}
                className="w-full py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl font-bold text-black text-lg disabled:opacity-50 hover:from-yellow-400 hover:to-yellow-500 transition-all"
              >
                {loading ? 'Memproses...' : 'Login'}
              </button>
            </form>
          </div>
        ) : (
          /* WHEEL VIEW */
          <div className="flex flex-col items-center gap-6 mt-8">
            {/* Agent info */}
            <div className="flex items-center justify-between w-full bg-white/5 backdrop-blur rounded-xl px-4 py-2 border border-yellow-500/20">
              <span className="text-yellow-400 font-mono text-sm">Agent: <strong>{agentId}</strong></span>
              <div className="flex gap-2">
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${eventActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {eventActive ? 'EVENT AKTIF' : 'EVENT TUTUP'}
                </span>
                {hasSpun && (
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-yellow-500/20 text-yellow-400">
                    SUDAH SPIN
                  </span>
                )}
              </div>
              <button onClick={handleLogout} className="text-white/50 hover:text-white text-xs underline">Logout</button>
            </div>

            {/* Error message */}
            {error && (
              <div className="w-full bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-red-300 text-center text-sm">
                {error}
              </div>
            )}

            {/* Wheel */}
            <div className="flex justify-center py-4">
              <LuckySpinWheel
                segments={SEGMENTS}
                onSpin={handleSpin}
                spinning={spinning}
                setSpinning={setSpinning}
                hasError={!!error || !canSpin}
              />
            </div>

            {/* Instructions */}
            <div className="text-center text-white/50 text-xs">
              {!eventActive && <p>⛔ Event Lucky Spin belum bermula.</p>}
              {eventActive && !hasSpun && !error && <p>Tekan SPIN untukCuba nasib anda!</p>}
              {hasSpun && <p>Anda telah参加 dalam Lucky Spin event ini.</p>}
            </div>

            {/* Event time info */}
            <div className="text-center text-white/40 text-xs mt-4">
              <p>Event: 1 April 2026, 5:00 PM - 11:00 PM (MYT)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
