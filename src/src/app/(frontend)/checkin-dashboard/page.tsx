'use client'

import React, { useState, useEffect, useMemo } from 'react'

const ADMIN_KEY = 'cm8admin2026'

type User = {
  id: number
  phone: string
  cm8PlayerId: string
  points: number
  currentStreak: number
  lastCheckinDate: string | null
  createdAt: string
  status: string
  referralCode: string
  referralCount: number
  referredBy: string | null
  totalCheckins: number
  unusedVouchers: number
  usedVouchers: number
}

type Stats = {
  total_users: string
  total_points: string
  total_referrals: string
  total_checkins: string
  pending_vouchers: string
  used_vouchers: string
}

export default function CheckinDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [authed, setAuthed] = useState(false)
  const [key, setKey] = useState('')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'createdAt' | 'points' | 'referralCount' | 'currentStreak'>('createdAt')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [editModal, setEditModal] = useState<User | null>(null)
  const [editPoints, setEditPoints] = useState('')
  const [toast, setToast] = useState('')

  const fetchData = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/users?key=${ADMIN_KEY}`)
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setUsers(data.users || [])
      setStats(data.stats || null)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    }
    setLoading(false)
  }

  useEffect(() => {
    if (authed) fetchData()
  }, [authed])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const adminAction = async (userId: number, action: string, value?: string | number) => {
    if (action === 'ban' && !confirm('Confirm ban user ni?')) return
    if (action === 'delete' && !confirm('⚠️ PADAM user ni? Semua data (check-in, voucher) akan hilang!')) return
    setActionLoading(userId)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: ADMIN_KEY, userId, action, value }),
      })
      const data = await res.json()
      if (data.ok) {
        showToast(`✅ ${data.message}`)
        fetchData()
      } else {
        showToast(`❌ ${data.error}`)
      }
    } catch {
      showToast('❌ Request failed')
    }
    setActionLoading(null)
  }

  const exportCSV = () => {
    const headers = ['ID', 'CM8 Player ID', 'Phone', 'Points', 'Streak', 'Checkins', 'Referrals', 'Referral Code', 'Referred By', 'Unused Vouchers', 'Used Vouchers', 'Last Checkin', 'Status', 'Created']
    const rows = filtered.map(u => [
      u.id, u.cm8PlayerId, u.phone, u.points, u.currentStreak, u.totalCheckins,
      u.referralCount, u.referralCode, u.referredBy || '', u.unusedVouchers,
      u.usedVouchers, u.lastCheckinDate || '', u.status, u.createdAt
    ])
    const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cm8-users-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filtered = useMemo(() => {
    let list = [...users]
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(u =>
        u.cm8PlayerId?.toLowerCase().includes(q) ||
        u.phone?.includes(q) ||
        u.referralCode?.toLowerCase().includes(q)
      )
    }
    list.sort((a, b) => {
      let va: number | string = a[sortBy] ?? ''
      let vb: number | string = b[sortBy] ?? ''
      if (sortBy === 'createdAt') {
        va = new Date(va).getTime()
        vb = new Date(vb).getTime()
      }
      if (typeof va === 'number' && typeof vb === 'number') {
        return sortDir === 'asc' ? va - vb : vb - va
      }
      return 0
    })
    return list
  }, [users, search, sortBy, sortDir])

  if (!authed) {
    return (
      <div style={{
        minHeight: '100vh', background: '#0a0a0a', display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: '20px',
      }}>
        <form onSubmit={(e) => { e.preventDefault(); if (key === ADMIN_KEY) setAuthed(true); else setError('Wrong key') }}
          style={{
            background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '32px',
            border: '1px solid rgba(255,215,0,0.2)', maxWidth: '360px', width: '100%',
          }}>
          <h2 style={{ color: '#ffd700', margin: '0 0 20px', textAlign: 'center', fontSize: '18px' }}>
            🔐 Admin Dashboard
          </h2>
          <input
            type="password"
            value={key}
            onChange={(e) => { setKey(e.target.value); setError('') }}
            placeholder="Enter admin key"
            style={{
              width: '100%', padding: '12px', borderRadius: '8px',
              background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,215,0,0.3)',
              color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
              marginBottom: '12px',
            }}
          />
          {error && <p style={{ color: '#ff4433', fontSize: '12px', margin: '0 0 8px' }}>{error}</p>}
          <button type="submit" style={{
            width: '100%', padding: '12px', border: 'none', borderRadius: '8px',
            background: 'linear-gradient(135deg, #ffd700, #ffaa33)',
            color: '#1a0505', fontWeight: 700, fontSize: '14px', cursor: 'pointer',
          }}>
            Masuk
          </button>
        </form>
      </div>
    )
  }

  const formatDate = (d: string | null) => {
    if (!d) return '-'
    return new Date(d).toLocaleDateString('ms-MY', { timeZone: 'Asia/Kuala_Lumpur', day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  const formatDateTime = (d: string | null) => {
    if (!d) return '-'
    return new Date(d).toLocaleString('ms-MY', { timeZone: 'Asia/Kuala_Lumpur' })
  }

  const handleSort = (col: typeof sortBy) => {
    if (sortBy === col) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(col)
      setSortDir('desc')
    }
  }

  const sortIcon = (col: typeof sortBy) => sortBy === col ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <h1 style={{ color: '#ffd700', fontSize: '22px', margin: 0 }}>
            📋 Check-in Admin Dashboard
          </h1>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={exportCSV} style={{
              padding: '8px 16px', border: 'none', borderRadius: '8px',
              background: '#4ade80', color: '#000', fontWeight: 700, cursor: 'pointer', fontSize: '13px',
            }}>
              📥 Export CSV
            </button>
            <button onClick={fetchData} disabled={loading} style={{
              padding: '8px 20px', border: 'none', borderRadius: '8px',
              background: loading ? 'rgba(255,255,255,0.1)' : '#ffd700',
              color: loading ? '#666' : '#1a0505', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
            }}>
              {loading ? '⏳' : '🔄 Refresh'}
            </button>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div style={{
            position: 'fixed', top: '20px', right: '20px', zIndex: 9999,
            padding: '12px 24px', borderRadius: '8px',
            background: toast.startsWith('✅') ? 'rgba(74,222,128,0.9)' : 'rgba(255,68,51,0.9)',
            color: '#fff', fontWeight: 700, fontSize: '14px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}>
            {toast}
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '12px', marginBottom: '24px',
          }}>
            {[
              { label: '👥 Jumlah Pemain', value: stats.total_users, color: '#ffd700' },
              { label: '📅 Jumlah Check-in', value: stats.total_checkins, color: '#4ade80' },
              { label: '⭐ Jumlah Mata', value: stats.total_points || '0', color: '#f59e0b' },
              { label: '🔗 Jumlah Rujukan', value: stats.total_referrals || '0', color: '#60a5fa' },
              { label: '🎫 Voucher Belum Guna', value: stats.pending_vouchers, color: '#a78bfa' },
              { label: '✅ Voucher Dah Guna', value: stats.used_vouchers, color: '#34d399' },
            ].map((s, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px',
                border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center',
              }}>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>{s.label}</div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Search */}
        <div style={{ marginBottom: '16px' }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Cari ID, telefon, atau kod rujukan..."
            style={{
              width: '100%', maxWidth: '400px', padding: '10px 14px', borderRadius: '8px',
              background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,215,0,0.2)',
              color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
            }}
          />
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginLeft: '12px' }}>
            {filtered.length} pemain
          </span>
        </div>

        {error && <p style={{ color: '#ff4433' }}>{error}</p>}

        {/* Table */}
        <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: 'rgba(255,215,0,0.1)' }}>
                <th style={thStyle}>#</th>
                <th style={thStyle}>CM8 Player ID</th>
                <th style={thStyle}>Telefon</th>
                <th style={{ ...thStyle, cursor: 'pointer' }} onClick={() => handleSort('points')}>
                  Mata{sortIcon('points')}
                </th>
                <th style={{ ...thStyle, cursor: 'pointer' }} onClick={() => handleSort('currentStreak')}>
                  Streak{sortIcon('currentStreak')}
                </th>
                <th style={thStyle}>Check-in</th>
                <th style={{ ...thStyle, cursor: 'pointer' }} onClick={() => handleSort('referralCount')}>
                  Rujukan{sortIcon('referralCount')}
                </th>
                <th style={thStyle}>Kod Rujukan</th>
                <th style={thStyle}>Dirujuk Oleh</th>
                <th style={thStyle}>Voucher</th>
                <th style={thStyle}>Last Check-in</th>
                <th style={{ ...thStyle, cursor: 'pointer' }} onClick={() => handleSort('createdAt')}>
                  Daftar{sortIcon('createdAt')}
                </th>
                <th style={thStyle}>Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={u.id} style={{
                  background: i % 2 === 0 ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.4)',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}>
                  <td style={tdStyle}>{u.id}</td>
                  <td style={{ ...tdStyle, color: '#ffd700', fontWeight: 700 }}>
                    {u.cm8PlayerId}
                    {u.status === 'banned' && <span style={{ color: '#ef4444', marginLeft: '6px', fontSize: '10px' }}>🚫BANNED</span>}
                  </td>
                  <td style={tdStyle}>{u.phone}</td>
                  <td style={{ ...tdStyle, textAlign: 'center', fontWeight: 700, color: u.points >= 10 ? '#4ade80' : '#fff' }}>
                    {u.points}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    {u.currentStreak > 0 ? `🔥 ${u.currentStreak}` : '0'}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>{u.totalCheckins}</td>
                  <td style={{ ...tdStyle, textAlign: 'center', color: u.referralCount > 0 ? '#60a5fa' : 'rgba(255,255,255,0.3)' }}>
                    {u.referralCount}
                  </td>
                  <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                    {u.referralCode}
                  </td>
                  <td style={{ ...tdStyle, fontSize: '11px', color: u.referredBy ? '#a78bfa' : 'rgba(255,255,255,0.2)' }}>
                    {u.referredBy || '-'}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    {u.unusedVouchers > 0 && <span style={{ color: '#fbbf24' }}>🎫{u.unusedVouchers}</span>}
                    {u.usedVouchers > 0 && <span style={{ color: '#34d399', marginLeft: '4px' }}>✅{u.usedVouchers}</span>}
                    {u.unusedVouchers === 0 && u.usedVouchers === 0 && <span style={{ color: 'rgba(255,255,255,0.2)' }}>-</span>}
                  </td>
                  <td style={{ ...tdStyle, fontSize: '11px' }}>{formatDate(u.lastCheckinDate)}</td>
                  <td style={{ ...tdStyle, fontSize: '11px' }}>{formatDateTime(u.createdAt)}</td>
                  <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => { setEditModal(u); setEditPoints(String(u.points)) }}
                        disabled={actionLoading === u.id}
                        style={actionBtnStyle('#ffd700', '#000')}
                        title="Edit Points"
                      >✏️</button>
                      {u.status !== 'banned' ? (
                        <button
                          onClick={() => adminAction(u.id, 'ban')}
                          disabled={actionLoading === u.id}
                          style={actionBtnStyle('#ef4444', '#fff')}
                          title="Ban"
                        >🚫</button>
                      ) : (
                        <button
                          onClick={() => adminAction(u.id, 'unban')}
                          disabled={actionLoading === u.id}
                          style={actionBtnStyle('#4ade80', '#000')}
                          title="Unban"
                        >✅</button>
                      )}
                      <button
                        onClick={() => adminAction(u.id, 'resetStreak')}
                        disabled={actionLoading === u.id}
                        style={actionBtnStyle('#f59e0b', '#000')}
                        title="Reset Streak"
                      >🔄</button>
                      <button
                        onClick={() => adminAction(u.id, 'delete')}
                        disabled={actionLoading === u.id}
                        style={actionBtnStyle('#dc2626', '#fff')}
                        title="Padam"
                      >🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && !loading && (
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '40px' }}>
            Tiada pemain dijumpai
          </p>
        )}

        {/* Edit Points Modal */}
        {editModal && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9998,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
          }} onClick={() => setEditModal(null)}>
            <div style={{
              background: '#1a1a1a', borderRadius: '16px', padding: '24px',
              border: '1px solid rgba(255,215,0,0.3)', maxWidth: '360px', width: '100%',
            }} onClick={e => e.stopPropagation()}>
              <h3 style={{ color: '#ffd700', margin: '0 0 16px', fontSize: '16px' }}>
                ✏️ Edit Points — {editModal.cm8PlayerId}
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', margin: '0 0 12px' }}>
                Points semasa: <strong style={{ color: '#fff' }}>{editModal.points}</strong>
              </p>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <input
                  type="number"
                  value={editPoints}
                  onChange={e => setEditPoints(e.target.value)}
                  style={{
                    flex: 1, padding: '10px', borderRadius: '8px',
                    background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,215,0,0.3)',
                    color: '#fff', fontSize: '16px', outline: 'none',
                  }}
                  min="0"
                />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={async () => {
                  await adminAction(editModal.id, 'setPoints', editPoints)
                  setEditModal(null)
                }} style={{
                  flex: 1, padding: '10px', border: 'none', borderRadius: '8px',
                  background: '#ffd700', color: '#000', fontWeight: 700, cursor: 'pointer',
                }}>
                  ✅ Set Points
                </button>
                <button onClick={() => setEditModal(null)} style={{
                  padding: '10px 16px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px',
                  background: 'transparent', color: '#fff', cursor: 'pointer',
                }}>
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const actionBtnStyle = (bg: string, color: string): React.CSSProperties => ({
  padding: '4px 8px', border: 'none', borderRadius: '6px',
  background: bg, color, fontSize: '12px', cursor: 'pointer',
  lineHeight: 1,
})

const thStyle: React.CSSProperties = {
  padding: '10px 12px', textAlign: 'left', color: '#ffd700',
  fontSize: '12px', fontWeight: 700, whiteSpace: 'nowrap',
  borderBottom: '2px solid rgba(255,215,0,0.2)',
}

const tdStyle: React.CSSProperties = {
  padding: '10px 12px', whiteSpace: 'nowrap',
  color: 'rgba(255,255,255,0.8)',
}
