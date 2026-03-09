'use client'

import React, { useState, useEffect, useMemo } from 'react'

const ADMIN_KEY = 'cm8admin2026'

type Spin = {
  username: string
  prize: string
  device: string
  timestamp: string
  spunAtMs: number
  claimId: string
}
type Stats = {
  total: number
  noLuck: number
  rm10: number
  rm30: number
  rm50: number
  rm100: number
  winners: number
}

export default function LuckyWheelDashboard() {
  const [spins, setSpins] = useState<Spin[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [authed, setAuthed] = useState(false)
  const [keyInput, setKeyInput] = useState('')
  const [filterPrize, setFilterPrize] = useState('all')
  const [searchUser, setSearchUser] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const fetchData = async (key: string) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/lucky-wheel/dashboard?key=${encodeURIComponent(key)}`)
      if (!res.ok) {
        setError('❌ Unauthorized — kunci salah')
        setLoading(false)
        return
      }
      const data = await res.json()
      setSpins(data.spins)
      setStats(data.stats)
      setAuthed(true)
    } catch {
      setError('❌ Gagal fetch data')
    }
    setLoading(false)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    fetchData(keyInput)
  }

  const filtered = useMemo(() => {
    let list = spins
    if (filterPrize !== 'all') {
      list = list.filter(s => s.prize === filterPrize)
    }
    if (searchUser.trim()) {
      const q = searchUser.trim().toLowerCase()
      list = list.filter(s => s.username.toLowerCase().includes(q))
    }
    if (dateFrom) {
      const from = new Date(dateFrom).getTime()
      list = list.filter(s => s.spunAtMs >= from)
    }
    if (dateTo) {
      const to = new Date(dateTo).getTime() + 86400000 // end of day
      list = list.filter(s => s.spunAtMs <= to)
    }
    return list
  }, [spins, filterPrize, searchUser, dateFrom, dateTo])

  const exportCSV = () => {
    const header = 'Username,Prize,Device,Timestamp,Claim ID\n'
    const rows = filtered.map(s =>
      `"${s.username}","${s.prize}","${s.device}","${s.timestamp}","${s.claimId}"`
    ).join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `lucky-wheel-spins-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Login screen
  if (!authed) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', fontFamily: 'system-ui'
      }}>
        <form onSubmit={handleLogin} style={{
          background: '#0f3460', padding: '40px', borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)', textAlign: 'center', minWidth: 320
        }}>
          <h1 style={{ color: '#ffd700', margin: '0 0 8px', fontSize: '24px' }}>🎰 Lucky Wheel Dashboard</h1>
          <p style={{ color: '#aaa', margin: '0 0 24px', fontSize: '14px' }}>Admin Access Only</p>
          <input
            type="password"
            placeholder="Masukkan kunci admin"
            value={keyInput}
            onChange={e => setKeyInput(e.target.value)}
            style={{
              width: '100%', padding: '12px 16px', borderRadius: '8px', border: '2px solid #333',
              background: '#1a1a2e', color: '#fff', fontSize: '16px', marginBottom: '16px',
              outline: 'none', boxSizing: 'border-box'
            }}
          />
          <button type="submit" style={{
            width: '100%', padding: '12px', borderRadius: '8px', border: 'none',
            background: 'linear-gradient(135deg, #e63520, #ff6b4a)', color: '#fff',
            fontSize: '16px', fontWeight: 'bold', cursor: 'pointer'
          }}>
            {loading ? 'Loading...' : 'Masuk →'}
          </button>
          {error && <p style={{ color: '#ff4444', marginTop: '12px', fontSize: '14px' }}>{error}</p>}
        </form>
      </div>
    )
  }

  const prizeColor: Record<string, string> = {
    'No Luck': '#888', 'RM10': '#25D366', 'RM30': '#ffd700', 'RM50': '#ff6b4a', 'RM100': '#e63520'
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      fontFamily: 'system-ui', color: '#fff', padding: '20px'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ color: '#ffd700', fontSize: '28px', margin: '0 0 4px' }}>🎰 Lucky Wheel Dashboard</h1>
          <p style={{ color: '#aaa', margin: 0 }}>CM8 VVIP Admin Panel</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '12px', marginBottom: '24px'
          }}>
            {[
              { label: 'Total Spins', value: stats.total, color: '#4a9eff', icon: '🎰' },
              { label: 'Winners', value: stats.winners, color: '#25D366', icon: '🏆' },
              { label: 'No Luck', value: stats.noLuck, color: '#888', icon: '😢' },
              { label: 'RM10', value: stats.rm10, color: '#25D366', icon: '💰' },
              { label: 'RM30', value: stats.rm30, color: '#ffd700', icon: '💎' },
              { label: 'RM50', value: stats.rm50, color: '#ff6b4a', icon: '🌟' },
              { label: 'RM100', value: stats.rm100, color: '#e63520', icon: '👑' },
            ].map(c => (
              <div key={c.label} style={{
                background: '#0f3460', borderRadius: '12px', padding: '16px', textAlign: 'center',
                border: `1px solid ${c.color}33`
              }}>
                <div style={{ fontSize: '24px' }}>{c.icon}</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: c.color }}>{c.value}</div>
                <div style={{ fontSize: '12px', color: '#aaa' }}>{c.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div style={{
          display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center'
        }}>
          <input
            type="text" placeholder="🔍 Cari username..."
            value={searchUser} onChange={e => setSearchUser(e.target.value)}
            style={{
              padding: '10px 14px', borderRadius: '8px', border: '1px solid #333',
              background: '#1a1a2e', color: '#fff', fontSize: '14px', minWidth: 180
            }}
          />
          <select
            value={filterPrize} onChange={e => setFilterPrize(e.target.value)}
            style={{
              padding: '10px 14px', borderRadius: '8px', border: '1px solid #333',
              background: '#1a1a2e', color: '#fff', fontSize: '14px'
            }}
          >
            <option value="all">Semua Hadiah</option>
            <option value="No Luck">No Luck</option>
            <option value="RM10">RM10</option>
            <option value="RM30">RM30</option>
            <option value="RM50">RM50</option>
            <option value="RM100">RM100</option>
          </select>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #333', background: '#1a1a2e', color: '#fff' }}
          />
          <span style={{ color: '#666' }}>→</span>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #333', background: '#1a1a2e', color: '#fff' }}
          />
          <button onClick={exportCSV} style={{
            padding: '10px 20px', borderRadius: '8px', border: 'none',
            background: '#25D366', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px'
          }}>
            📥 Export CSV
          </button>
          <span style={{ color: '#aaa', fontSize: '13px', marginLeft: 'auto' }}>
            Showing {filtered.length} of {spins.length}
          </span>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #333' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: '#0f3460' }}>
                <th style={th}>#</th>
                <th style={th}>Username</th>
                <th style={th}>Hadiah</th>
                <th style={th}>Device</th>
                <th style={th}>Masa</th>
                <th style={th}>Claim ID</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.username} style={{
                  background: i % 2 === 0 ? '#1a1a2e' : '#16213e',
                  borderBottom: '1px solid #ffffff10'
                }}>
                  <td style={td}>{i + 1}</td>
                  <td style={{ ...td, fontWeight: 'bold' }}>{s.username}</td>
                  <td style={td}>
                    <span style={{
                      background: (prizeColor[s.prize] || '#666') + '22',
                      color: prizeColor[s.prize] || '#fff',
                      padding: '4px 10px', borderRadius: '20px', fontWeight: 'bold', fontSize: '13px'
                    }}>
                      {s.prize}
                    </span>
                  </td>
                  <td style={td}>{s.device}</td>
                  <td style={{ ...td, fontSize: '13px', color: '#aaa' }}>{s.timestamp}</td>
                  <td style={{ ...td, fontSize: '12px', fontFamily: 'monospace', color: '#4a9eff' }}>{s.claimId}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ ...td, textAlign: 'center', color: '#666', padding: '40px' }}>
                  Tiada record ditemui
                </td></tr>
              )}
            </tbody>
          </table>
        </div>

        <p style={{ textAlign: 'center', color: '#444', marginTop: '24px', fontSize: '12px' }}>
          CM8 VVIP Lucky Wheel Dashboard • Admin Only
        </p>
      </div>
    </div>
  )
}

const th: React.CSSProperties = {
  padding: '12px 16px', textAlign: 'left', color: '#ffd700', fontSize: '13px',
  fontWeight: 'bold', borderBottom: '2px solid #ffd70033', whiteSpace: 'nowrap'
}
const td: React.CSSProperties = {
  padding: '10px 16px', whiteSpace: 'nowrap'
}
