'use client'

import React, { useState, useEffect, useMemo } from 'react'

const ADMIN_KEY = 'cm8admin2026'

type Play = {
  index: number
  fingerprint: string
  fingerprintFull: string
  result: 'win' | 'lose'
  boxPicked: number
  ip: string
  playerId: string
  whatsappNumber: string
  timestamp: string
  timestampMs: number
}
type BoxStat = { box: number; total: number; wins: number; losses: number }
type Stats = {
  totalPlays: number
  totalWinners: number
  totalLosers: number
  winnersRemaining: number
  actualWinRate: string
  uniqueIPs: number
  boxStats: BoxStat[]
}
type EventInfo = {
  id: string; title: string; code: string; prize: string
  startTime: string; endTime: string; maxWinners: number
  configuredWinRate: number; active: boolean
}

export default function EventDashboard() {
  const [plays, setPlays] = useState<Play[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [eventInfo, setEventInfo] = useState<EventInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [authed, setAuthed] = useState(false)
  const [keyInput, setKeyInput] = useState('')
  const [filterResult, setFilterResult] = useState('all')
  const [filterBox, setFilterBox] = useState('all')
  const [searchIP, setSearchIP] = useState('')

  const fetchData = async (key: string) => {
    setLoading(true); setError('')
    try {
      const res = await fetch(`/api/event/dashboard?key=${encodeURIComponent(key)}`)
      if (!res.ok) { setError('❌ Unauthorized — kunci salah'); setLoading(false); return }
      const data = await res.json()
      setPlays(data.plays); setStats(data.stats); setEventInfo(data.event); setAuthed(true)
    } catch { setError('❌ Gagal fetch data') }
    setLoading(false)
  }

  // Auto-refresh every 30s
  useEffect(() => {
    if (!authed) return
    const iv = setInterval(() => fetchData(ADMIN_KEY), 30000)
    return () => clearInterval(iv)
  }, [authed])

  const handleLogin = (e: React.FormEvent) => { e.preventDefault(); fetchData(keyInput) }

  const filtered = useMemo(() => {
    let list = plays
    if (filterResult !== 'all') list = list.filter(p => p.result === filterResult)
    if (filterBox !== 'all') list = list.filter(p => p.boxPicked === parseInt(filterBox))
    if (searchIP.trim()) {
      const q = searchIP.trim().toLowerCase()
      list = list.filter(
        p =>
          p.ip.toLowerCase().includes(q) ||
          p.fingerprint.toLowerCase().includes(q) ||
          p.playerId.toLowerCase().includes(q) ||
          p.whatsappNumber.toLowerCase().includes(q)
      )
    }
    return list
  }, [plays, filterResult, filterBox, searchIP])

  const exportCSV = () => {
    const header = 'No,Player ID,WhatsApp,Result,Box,IP,Fingerprint,Timestamp\n'
    const rows = filtered.map(p =>
      `${p.index},"${p.playerId}","${p.whatsappNumber}","${p.result}",${p.boxPicked},"${p.ip}","${p.fingerprintFull}","${p.timestamp}"`
    ).join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url
    a.download = `pick-a-box-${new Date().toISOString().slice(0, 10)}.csv`
    a.click(); URL.revokeObjectURL(url)
  }

  // Login screen
  if (!authed) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a0505 0%, #3d0a0a 50%, #0a0a0a 100%)', fontFamily: 'system-ui'
      }}>
        <form onSubmit={handleLogin} style={{
          background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(24px)',
          padding: '40px', borderRadius: '20px', border: '1px solid rgba(230,53,32,0.2)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)', textAlign: 'center', minWidth: 320
        }}>
          <h1 style={{ color: '#ffd700', margin: '0 0 8px', fontSize: '24px' }}>🎁 Pick A Box Dashboard</h1>
          <p style={{ color: '#aaa', margin: '0 0 24px', fontSize: '14px' }}>Admin Access Only</p>
          <input
            type="password" placeholder="Masukkan kunci admin"
            value={keyInput} onChange={e => setKeyInput(e.target.value)}
            style={{
              width: '100%', padding: '12px 16px', borderRadius: '12px',
              border: '2px solid rgba(230,53,32,0.25)', background: 'rgba(255,255,255,0.05)',
              color: '#fff', fontSize: '16px', marginBottom: '16px', outline: 'none', boxSizing: 'border-box'
            }}
          />
          <button type="submit" style={{
            width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
            background: 'linear-gradient(135deg, #e63520, #ff6b4a)', color: '#fff',
            fontSize: '16px', fontWeight: 'bold', cursor: 'pointer'
          }}>
            {loading ? '⏳ Loading...' : '🚀 Masuk →'}
          </button>
          {error && <p style={{ color: '#ff4444', marginTop: '12px', fontSize: '14px' }}>{error}</p>}
        </form>
      </div>
    )
  }

  const formatTime = (iso: string) => {
    try { return new Date(iso).toLocaleString('ms-MY', { timeZone: 'Asia/Kuala_Lumpur' }) }
    catch { return iso }
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(135deg, #1a0505 0%, #3d0a0a 35%, #0a0a0a 100%)',
      fontFamily: 'system-ui', color: '#fff', padding: '20px'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1 style={{ color: '#ffd700', fontSize: '28px', margin: '0 0 4px' }}>🎁 Pick A Box Dashboard</h1>
          <p style={{ color: '#aaa', margin: 0 }}>CM8 VVIP Admin Panel • Auto-refresh setiap 30s</p>
        </div>

        {/* Event Info Banner */}
        {eventInfo && (
          <div style={{
            background: 'rgba(230,53,32,0.1)', border: '1px solid rgba(230,53,32,0.25)',
            borderRadius: '16px', padding: '18px 24px', marginBottom: '20px',
            display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ color: '#ffd700', fontWeight: 'bold', fontSize: '16px' }}>{eventInfo.title}</div>
              <div style={{ color: '#aaa', fontSize: '13px', marginTop: '4px' }}>
                Kod: <strong style={{ color: '#fff' }}>{eventInfo.code}</strong> • 
                Hadiah: <strong style={{ color: '#25D366' }}>{eventInfo.prize}</strong> •
                Win Rate: <strong style={{ color: '#ff8c42' }}>{eventInfo.configuredWinRate}%</strong>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#aaa', fontSize: '12px' }}>
                {formatTime(eventInfo.startTime)} — {formatTime(eventInfo.endTime)}
              </div>
              <div style={{
                display: 'inline-block', marginTop: '4px', padding: '4px 12px', borderRadius: '20px',
                fontSize: '12px', fontWeight: 'bold',
                background: eventInfo.active ? 'rgba(37,211,102,0.15)' : 'rgba(255,68,68,0.15)',
                color: eventInfo.active ? '#25D366' : '#ff4444',
                border: `1px solid ${eventInfo.active ? 'rgba(37,211,102,0.3)' : 'rgba(255,68,68,0.3)'}`
              }}>
                {eventInfo.active ? '🟢 Active' : '🔴 Inactive'}
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '12px', marginBottom: '20px'
          }}>
            {[
              { label: 'Total Plays', value: stats.totalPlays, color: '#4a9eff', icon: '🎮' },
              { label: 'Winners', value: stats.totalWinners, color: '#25D366', icon: '🏆' },
              { label: 'Losers', value: stats.totalLosers, color: '#888', icon: '😢' },
              { label: 'Baki Hadiah', value: stats.winnersRemaining, color: '#ffd700', icon: '🎁' },
              { label: 'Win Rate', value: stats.actualWinRate + '%', color: '#ff6b4a', icon: '📊' },
              { label: 'Unique IPs', value: stats.uniqueIPs, color: '#9b59b6', icon: '🌐' },
            ].map(c => (
              <div key={c.label} style={{
                background: 'rgba(255,255,255,0.05)', borderRadius: '14px', padding: '16px',
                textAlign: 'center', border: `1px solid ${c.color}25`, backdropFilter: 'blur(8px)'
              }}>
                <div style={{ fontSize: '22px' }}>{c.icon}</div>
                <div style={{ fontSize: '26px', fontWeight: 'bold', color: c.color }}>{c.value}</div>
                <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>{c.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Box Breakdown */}
        {stats && (
          <div style={{
            display: 'grid', gridTemplateColumns: `repeat(${stats.boxStats.length}, 1fr)`,
            gap: '12px', marginBottom: '20px'
          }}>
            {stats.boxStats.map(b => (
              <div key={b.box} style={{
                background: 'rgba(255,255,255,0.04)', borderRadius: '14px', padding: '14px',
                textAlign: 'center', border: '1px solid rgba(255,255,255,0.08)'
              }}>
                <div style={{ fontSize: '28px' }}>🎁</div>
                <div style={{ color: '#ffd700', fontWeight: 'bold', fontSize: '15px' }}>Box {b.box}</div>
                <div style={{ color: '#aaa', fontSize: '12px', marginTop: '6px' }}>
                  {b.total} picks • <span style={{ color: '#25D366' }}>{b.wins}W</span> / <span style={{ color: '#ff4444' }}>{b.losses}L</span>
                </div>
                <div style={{
                  marginTop: '6px', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%', borderRadius: '2px',
                    width: b.total > 0 ? `${(b.wins / b.total) * 100}%` : '0%',
                    background: 'linear-gradient(90deg, #25D366, #ffd700)'
                  }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div style={{
          display: 'flex', gap: '10px', marginBottom: '14px', flexWrap: 'wrap', alignItems: 'center'
        }}>
          <input
            type="text" placeholder="🔍 Cari IP / Fingerprint / Player ID / WhatsApp..."
            value={searchIP} onChange={e => setSearchIP(e.target.value)}
            style={{
              padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '14px', minWidth: 180
            }}
          />
          <select value={filterResult} onChange={e => setFilterResult(e.target.value)}
            style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '14px' }}
          >
            <option value="all">Semua Result</option>
            <option value="win">🏆 Win</option>
            <option value="lose">😢 Lose</option>
          </select>
          <select value={filterBox} onChange={e => setFilterBox(e.target.value)}
            style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '14px' }}
          >
            <option value="all">Semua Box</option>
            <option value="1">Box 1</option>
            <option value="2">Box 2</option>
            <option value="3">Box 3</option>
          </select>
          <button onClick={exportCSV} style={{
            padding: '10px 18px', borderRadius: '10px', border: 'none',
            background: '#25D366', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px'
          }}>
            📥 Export CSV
          </button>
          <button onClick={() => fetchData(ADMIN_KEY)} style={{
            padding: '10px 18px', borderRadius: '10px', border: 'none',
            background: 'linear-gradient(135deg, #e63520, #ff6b4a)', color: '#fff',
            fontWeight: 'bold', cursor: 'pointer', fontSize: '13px'
          }}>
            🔄 Refresh
          </button>
          <span style={{ color: '#666', fontSize: '12px', marginLeft: 'auto' }}>
            {filtered.length} / {plays.length} records
          </span>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: 'rgba(230,53,32,0.1)' }}>
                <th style={th}>#</th>
                <th style={th}>Player ID</th>
                <th style={th}>WhatsApp</th>
                <th style={th}>Result</th>
                <th style={th}>Box</th>
                <th style={th}>IP</th>
                <th style={th}>Fingerprint</th>
                <th style={th}>Masa</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={`${p.fingerprintFull}-${p.timestampMs}`} style={{
                  background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                  borderBottom: '1px solid rgba(255,255,255,0.04)'
                }}>
                  <td style={td}>{p.index}</td>
                  <td style={{ ...td, fontWeight: 'bold', color: '#FFD700' }}>{p.playerId}</td>
                  <td style={{ ...td, fontFamily: 'monospace', fontSize: '12px', color: '#25D366' }}>{p.whatsappNumber}</td>
                  <td style={td}>
                    <span style={{
                      padding: '4px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '12px',
                      background: p.result === 'win' ? 'rgba(37,211,102,0.15)' : 'rgba(136,136,136,0.15)',
                      color: p.result === 'win' ? '#25D366' : '#888',
                      border: `1px solid ${p.result === 'win' ? 'rgba(37,211,102,0.3)' : 'rgba(136,136,136,0.2)'}`
                    }}>
                      {p.result === 'win' ? '🏆 WIN' : '😢 LOSE'}
                    </span>
                  </td>
                  <td style={{ ...td, textAlign: 'center' }}>
                    <span style={{
                      display: 'inline-block', width: 28, height: 28, lineHeight: '28px',
                      borderRadius: '8px', background: 'rgba(255,215,0,0.1)',
                      border: '1px solid rgba(255,215,0,0.2)', fontSize: '13px', fontWeight: 'bold', color: '#ffd700'
                    }}>
                      {p.boxPicked}
                    </span>
                  </td>
                  <td style={{ ...td, fontFamily: 'monospace', fontSize: '12px', color: '#aaa' }}>{p.ip}</td>
                  <td style={{ ...td, fontFamily: 'monospace', fontSize: '12px', color: '#4a9eff' }}>{p.fingerprint}</td>
                  <td style={{ ...td, fontSize: '12px', color: '#aaa' }}>{p.timestamp}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ ...td, textAlign: 'center', color: '#555', padding: '40px' }}>
                  Tiada record ditemui
                </td></tr>
              )}
            </tbody>
          </table>
        </div>

        <p style={{ textAlign: 'center', color: '#333', marginTop: '24px', fontSize: '12px' }}>
          CM8 VVIP Pick A Box Dashboard • Admin Only
        </p>
      </div>
    </div>
  )
}

const th: React.CSSProperties = {
  padding: '12px 16px', textAlign: 'left', color: '#ffd700', fontSize: '12px',
  fontWeight: 'bold', borderBottom: '2px solid rgba(255,215,0,0.15)', whiteSpace: 'nowrap',
  textTransform: 'uppercase', letterSpacing: '0.5px'
}
const td: React.CSSProperties = {
  padding: '10px 16px', whiteSpace: 'nowrap'
}
