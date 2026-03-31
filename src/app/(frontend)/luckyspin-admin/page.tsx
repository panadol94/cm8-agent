'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LuckySpinAdminPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check if already logged in
    fetch('/api/luckyspin/admin/settings', { credentials: 'include' })
      .then(r => r.ok ? router.push('/luckyspin-admin/dashboard') : null)
      .catch(() => {})
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/luckyspin/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Login gagal.')
      } else {
        router.push('/luckyspin-admin/dashboard')
      }
    } catch {
      setError('Ralat server.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] to-[#111133] flex items-center justify-center p-4">
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-yellow-500/20 shadow-2xl max-w-sm w-full">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🔐</div>
          <h1 className="text-xl font-black text-yellow-400">Admin Lucky Spin</h1>
          <p className="text-white/50 text-sm mt-1">Login untuk mengakses panel</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-yellow-500/30 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400"
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-yellow-500/30 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400"
          />

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 text-red-300 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl font-bold text-black disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
