'use client'

import { useState, useEffect } from 'react'
import LuckySpinWheel from '../components/LuckySpinWheel'
import LuckySpinWinPopup from '../components/LuckySpinWinPopup'

interface Reward {
  id: string
  rewardName: string
  rewardType: string
  position: number
}

export default function LuckySpinPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [agentId, setAgentId] = useState('')
  const [inputAgentId, setInputAgentId] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [rewards, setRewards] = useState<Reward[]>([])
  const [showWinPopup, setShowWinPopup] = useState(false)
  const [winReward, setWinReward] = useState('')
  const [eventStatus, setEventStatus] = useState<{ active: boolean; message?: string }>({ active: false })
  const [hasSpun, setHasSpun] = useState(false)

  // Check event status on mount
  useEffect(() => {
    checkEventStatus()
    checkSession()
  }, [])

  const checkEventStatus = async () => {
    try {
      const res = await fetch('/api/luckyspin')
      const data = await res.json()
      setEventStatus(data)
    } catch {
      setEventStatus({ active: false, message: 'Ralat mendapatkan status event.' })
    }
  }

  const checkSession = async () => {
    try {
      const res = await fetch('/api/luckyspin/status')
      if (res.ok) {
        const data = await res.json()
        if (data.agentId) {
          setIsLoggedIn(true)
          setAgentId(data.agentId)
          setHasSpun(data.hasSpun)
          if (!data.hasSpun && data.eventActive) {
            loadRewards()
          }
        }
      }
    } catch {
      // No session, show login
    }
  }

  const loadRewards = async () => {
    try {
      const res = await fetch('/api/luckyspin/admin/rewards', {
        headers: { 'Accept': 'application/json' },
      })
      if (res.ok) {
        const data = await res.json()
        setRewards(data.rewards || [])
      }
    } catch {
      // Fallback rewards
      setRewards([
        { id: '1', rewardName: 'RM100', rewardType: 'cash', position: 1 },
        { id: '2', rewardName: 'RM288', rewardType: 'cash', position: 2 },
        { id: '3', rewardName: 'RM388', rewardType: 'cash', position: 3 },
        { id: '4', rewardName: 'RM588', rewardType: 'cash', position: 4 },
        { id: '5', rewardName: 'Gold 5 gram', rewardType: 'gold', position: 5 },
      ])
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/luckyspin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: inputAgentId }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Ralat login.')
        return
      }

      setIsLoggedIn(true)
      setAgentId(inputAgentId)
      setHasSpun(false)
      loadRewards()
    } catch {
      setError('Ralat menghubungi server.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/luckyspin/logout', { method: 'POST' })
    setIsLoggedIn(false)
    setAgentId('')
    setInputAgentId('')
    setHasSpun(false)
    setShowWinPopup(false)
  }

  const handleSpin = async (): Promise<{ reward: string; position: number }> => {
    const res = await fetch('/api/luckyspin/spin', { method: 'POST' })
    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || 'Ralat spin.')
    }
    const data = await res.json()
    return { reward: data.reward, position: data.position }
  }

  const handleWin = (reward: string) => {
    setWinReward(reward)
    setShowWinPopup(true)
    setHasSpun(true)
  }

  const canSpin = eventStatus.active && !hasSpun && rewards.length > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0d0d14] to-[#0a0a0f] text-white">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 mb-4">
            🎰 Lucky Spin 🎰
          </h1>
          <p className="text-white/60 text-lg">
            Spin & Menang Hadiah Menarik!
          </p>
        </div>

        {!eventStatus.active && (
          <div className="max-w-md mx-auto mb-8 p-6 bg-red-500/20 border border-red-500/30 rounded-2xl text-center">
            <p className="text-red-300 text-lg">
              ⏰ Event belum bermula atau telah tamat.
            </p>
          </div>
        )}

        {!isLoggedIn ? (
          /* Login Form */
          <div className="max-w-md mx-auto">
            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-center mb-6 text-amber-400">
                Login Agent
              </h2>

              <form onSubmit={handleLogin}>
                <div className="mb-6">
                  <label className="block text-white/80 mb-2 font-medium">
                    Agent ID
                  </label>
                  <input
                    type="text"
                    value={inputAgentId}
                    onChange={(e) => setInputAgentId(e.target.value.toUpperCase())}
                    placeholder="Masukkan Agent ID"
                    className="w-full px-4 py-4 bg-black/30 border border-white/20 rounded-xl
                               text-white placeholder-white/40 focus:outline-none focus:border-amber-500/50
                               transition-all duration-300"
                    disabled={loading}
                  />
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-center">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !inputAgentId}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600
                             text-white font-bold text-lg rounded-xl
                             hover:from-amber-400 hover:to-amber-500
                             disabled:opacity-50 disabled:cursor-not-allowed
                             transition-all duration-300 shadow-lg
                             hover:shadow-[0_0_30px_rgba(255,215,0,0.5)]"
                >
                  {loading ? 'Memuat...' : 'Login'}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Spin Interface */
          <>
            <div className="max-w-2xl mx-auto">
              {/* User info */}
              <div className="flex items-center justify-between mb-8 bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <div>
                  <p className="text-white/60 text-sm">Agent ID</p>
                  <p className="text-amber-400 font-bold text-xl">{agentId}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/80 transition-colors"
                >
                  Logout
                </button>
              </div>

              {hasSpun ? (
                <div className="text-center py-16 bg-gradient-to-br from-amber-500/10 to-purple-500/10 rounded-3xl border border-amber-500/20">
                  <div className="text-6xl mb-4">🎁</div>
                  <h3 className="text-2xl font-bold text-amber-400 mb-2">Terima kasih!</h3>
                  <p className="text-white/60">Anda telah menggunakan spin anda.</p>
                </div>
              ) : (
                <>
                  {/* Wheel */}
                  <LuckySpinWheel
                    rewards={rewards}
                    onSpin={handleSpin}
                    disabled={!canSpin}
                    onWin={handleWin}
                  />

                  {!canSpin && (
                    <p className="text-center text-white/50 mt-4">
                      {rewards.length === 0 && 'Tiada hadiah tersedia.'}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Win Popup */}
            <LuckySpinWinPopup
              isOpen={showWinPopup}
              reward={winReward}
              onClose={() => setShowWinPopup(false)}
            />
          </>
        )}
      </div>
    </div>
  )
}
