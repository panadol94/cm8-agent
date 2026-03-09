'use client'

import React, { useState, useEffect, useMemo } from 'react'

const ADMIN_KEY = 'cm8admin2026'

type Play = {
  index: number; userId: number; phone: string; prize: string; prizeValue: number
  cardPicked: number; ip: string; timestamp: string; timestampMs: number
  claimed: boolean; isToday: boolean
}
type PrizeBreakdown = { label: string; emoji: string; count: number; todayCount: number }
type Stats = {
  totalPlays: number; totalWinners: number; todayPlays: number; todayWinners: number
  uniqueUsers: number; uniqueIPs: number; prizeBreakdown: PrizeBreakdown[]
}

const th: React.CSSProperties = {
  padding: '10px 12px', textAlign: 'left', color: '#ffd700',
  fontSize: '12px', fontWeight: 700, letterSpacing: '0.5px',
}
const td: React.CSSProperties = {
  padding: '10px 12px', color: '#ddd', fontSize: '13px',
}

export default function LuckyPickDashboard() {
  const [plays, setPlays] = useState<Play[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [authed, setAuthed] = useState(false)
  const [keyInput, setKeyInput] = useState('')
  const [filterPrize, setFilterPrize] = useState('all')
  const [filterToday, setFilterToday] = useState(false)
  const [search, setSearch] = useState('')

  const fetchData = async (key: string) => {
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/lucky-pick/dashboard?key=' + encodeURIComponent(key))
      if (!res.ok) { setError('Kunci salah'); setLoading(false); return }
      const data = await res.json()
      setPlays(data.plays); setStats(data.stats); setAuthed(true)
    } catch { setError('Gagal fetch data') }
    setLoading(false)
  }

  useEffect(() => {
    if (!authed) return
    const iv = setInterval(() => fetchData(ADMIN_KEY), 30000)
    return () => clearInterval(iv)
  }, [authed])

  const handleLogin = (e: React.FormEvent) => { e.preventDefault(); fetchData(keyInput) }

  const filtered = useMemo(() => {
    let list = plays
    if (filterPrize !== 'all') list = list.filter(p => p.prize === filterPrize)
    if (filterToday) list = list.filter(p => p.isToday)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p =>
        p.phone.includes(q) || p.ip.includes(q) || String(p.userId).includes(q)
      )
    }
    return list
  }, [plays, filterPrize, filterToday, search])

  const exportCSV = () => {
    const header = 'No,User ID,Phone,Prize,Value (RM),Card,IP,Timestamp,Claimed\n'
    const rows = filtered.map(p =>
      [p.index, p.userId, '"' + p.phone + '"', '"' + p.prize + '"', p.prizeValue, p.cardPicked, '"' + p.ip + '"', '"' + p.timestamp + '"', p.claimed].join(',')
    ).join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url
    a.download = 'lucky-pick-' + new Date().toISOString().slice(0, 10) + '.csv'
    a.click(); URL.revokeObjectURL(url)
  }

  if (!authed) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#000', fontFamily: 'system-ui',
      }}>
        <form onSubmit={handleLogin} style={{
          background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(24px)',
          padding: '40px', borderRadius: '20px', border: '1px solid rgba(230,53,32,0.2)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)', textAlign: 'center', minWidth: 320,
        }}>
          <h1 style={{ color: '#ffd700', margin: '0 0 8px', fontSize: '24px' }}>{'\u{1F0CF}'} Lucky Pick Dashboard</h1>
          <p style={{ color: '#aaa', margin: '0 0 24px', fontSize: '14px' }}>Admin Access Only</p>
          <input
            type="password" placeholder="Masukkan kunci admin"
            value={keyInput} onChange={e => setKeyInput(e.target.value)}
            style={{
              width: '100%', padding: '12px 16px', borderRadius: '12px',
              border: '2px solid rgba(230,53,32,0.25)', background: 'rgba(255,255,255,0.05)',
              color: '#fff', fontSize: '16px', marginBottom: '16px', outline: 'none', boxSizing: 'border-box',
            }}
          />
          <button type="submit" style={{
            width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
            background: 'linear-gradient(135deg, #e63520, #ff6b4a)', color: '#fff',
            fontSize: '16px', fontWeight: 'bold', cursor: 'pointer',
          }}>
            {loading ? 'Loading...' : 'Masuk'}
          </button>
          {error && <p style={{ color: '#ff4444', marginTop: '12px', fontSize: '14px' }}>{error}</p>}
        </form>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#000',
      fontFamily: 'system-ui', color: '#fff', padding: '20px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1 style={{ color: '#ffd700', fontSize: '28px', margin: '0 0 4px' }}>{'\u{1F0CF}'} Lucky Pick Dashboard</h1>
          <p style={{ color: '#aaa', margin: 0 }}>CM8 VVIP Admin Panel {'\u2022'} Auto-refresh 30s</p>
        </div>

        {stats && (
          <>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '12px', marginBottom: '20px',
            }}>
              {[
                { label: 'Total Plays', value: stats.totalPlays, color: '#4a9eff', icon: '\u{1F3AE}' },
                { label: 'Total Winners', value: stats.totalWinners, color: '#25D366', icon: '\u{1F3C6}' },
                { label: 'Hari Ini', value: stats.todayPlays, color: '#ff8c42', icon: '\u{1F4C5}' },
                { label: 'Winners Hari Ini', value: stats.todayWinners, color: '#FFD700', icon: '\u{2B50}' },
                { label: 'Unique Users', value: stats.uniqueUsers, color: '#9b59b6', icon: '\u{1F465}' },
                { label: 'Unique IPs', value: stats.uniqueIPs, color: '#e74c3c', icon: '\u{1F310}' },
              ].map(c => (
                <div key={c.label} style={{
                  background: 'rgba(255,255,255,0.05)', borderRadius: '14px', padding: '16px',
                  textAlign: 'center', border: '1px solid ' + c.color + '25',
                }}>
                  <div style={{ fontSize: '22px' }}>{c.icon}</div>
                  <div style={{ fontSize: '26px', fontWeight: 'bold', color: c.color }}>{c.value}</div>
                  <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>{c.label}</div>
                </div>
              ))}
            </div>

            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '10px', marginBottom: '20px',
            }}>
              {stats.prizeBreakdown.map(pb => (
                <div key={pb.label} style={{
                  background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '12px',
                  textAlign: 'center', border: '1px solid rgba(255,255,255,0.08)',
                }}>
                  <div style={{ fontSize: '18px' }}>{pb.emoji}</div>
                  <div style={{ color: '#ffd700', fontWeight: 'bold', fontSize: '14px' }}>{pb.label}</div>
                  <div style={{ color: '#aaa', fontSize: '12px', marginTop: '4px' }}>
                    {pb.count} total {'\u2022'} {pb.todayCount} hari ini
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div style={{
          display: 'flex', gap: '10px', marginBottom: '14px', flexWrap: 'wrap', alignItems: 'center',
        }}>
          <input
            type="text" placeholder="Cari phone / IP / user ID..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{
              padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '14px', minWidth: 180,
            }}
          />
          <select value={filterPrize} onChange={e => setFilterPrize(e.target.value)}
            style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '14px' }}
          >
            <option value="all">Semua Prize</option>
            <option value="Terima Kasih">Terima Kasih</option>
            <option value="RM3">RM3</option>
            <option value="RM10">RM10</option>
            <option value="RM50">RM50</option>
            <option value="RM100">RM100</option>
            <option value="RM388">RM388</option>
          </select>
          <label style={{ color: '#aaa', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input type="checkbox" checked={filterToday} onChange={e => setFilterToday(e.target.checked)} />
            Hari ini sahaja
          </label>
          <button onClick={exportCSV} style={{
            padding: '10px 18px', borderRadius: '10px', border: 'none',
            background: '#25D366', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px',
          }}>
            Export CSV
          </button>
          <button onClick={() => fetchData(ADMIN_KEY)} style={{
            padding: '10px 18px', borderRadius: '10px', border: 'none',
            background: 'linear-gradient(135deg, #e63520, #ff6b4a)', color: '#fff',
            fontWeight: 'bold', cursor: 'pointer', fontSize: '13px',
          }}>
            Refresh
          </button>
          <span style={{ color: '#666', fontSize: '12px', marginLeft: 'auto' }}>
            {filtered.length} / {plays.length} records
          </span>
        </div>

        <div style={{ overflowX: 'auto', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: 'rgba(230,53,32,0.1)' }}>
                <th style={th}>#</th>
                <th style={th}>Phone</th>
                <th style={th}>Prize</th>
                <th style={th}>Value</th>
                <th style={th}>Card</th>
                <th style={th}>IP</th>
                <th style={th}>Masa</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.timestampMs + '-' + i} style={{
                  background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                }}>
                  <td style={td}>{p.index}</td>
                  <td style={{ ...td, fontWeight: 'bold', color: '#FFD700' }}>{p.phone}</td>
                  <td style={td}>
                    <span style={{
                      padding: '4px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '12px',
                      background: p.prizeValue > 0 ? 'rgba(37,211,102,0.15)' : 'rgba(136,136,136,0.15)',
                      color: p.prizeValue > 0 ? '#25D366' : '#888',
                      border: '1px solid ' + (p.prizeValue > 0 ? 'rgba(37,211,102,0.3)' : 'rgba(136,136,136,0.2)'),
                    }}>
                      {p.prize}
                    </span>
                  </td>
                  <td style={{ ...td, color: p.prizeValue > 0 ? '#25D366' : '#666' }}>
                    {p.prizeValue > 0 ? 'RM' + p.prizeValue : '-'}
                  </td>
                  <td style={td}>{p.cardPicked}</td>
                  <td style={{ ...td, fontFamily: 'monospace', fontSize: '11px', color: '#888' }}>{p.ip}</td>
                  <td style={{ ...td, fontSize: '12px', color: '#aaa' }}>{p.timestamp}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ ...td, textAlign: 'center', color: '#666', padding: '40px' }}>
                  Tiada rekod
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
