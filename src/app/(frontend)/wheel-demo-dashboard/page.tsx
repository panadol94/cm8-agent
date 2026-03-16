'use client'

import { useState, useEffect } from 'react'

type Prize = {
  label: string
  weight: number
  colorA: string
  colorB: string
}

type WhitelistEntry = {
  agentId: string
  whatsapp: string
  note?: string
  spinLimit?: number
}

type AdminConfig = {
  prizes: Prize[]
  whitelist: WhitelistEntry[]
  spinLimitPerEntry: number
}

type SpinRecord = {
  agentId: string
  whatsapp: string
  prize: string
  spunAt: string
  claimId: string
}

type Stats = {
  totalSpins: number
  whitelistCount: number
  configuredPrizes: number
}

const DEFAULT_PRIZES: Prize[] = [
  { label: 'RM100', weight: 84, colorA: '#ffcf33', colorB: '#ff9800' },
  { label: 'RM288', weight: 10, colorA: '#ff5f6d', colorB: '#ffc371' },
  { label: 'RM388', weight: 5, colorA: '#8e2de2', colorB: '#ff6fd8' },
  { label: 'RM588', weight: 1, colorA: '#00c6ff', colorB: '#0072ff' },
]

export default function WheelDemoDashboard() {
  const [keyInput, setKeyInput] = useState('')
  const [authed, setAuthed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  const [config, setConfig] = useState<AdminConfig | null>(null)
  const [spins, setSpins] = useState<SpinRecord[]>([])
  const [stats, setStats] = useState<Stats | null>(null)

  // Form states
  const [prizes, setPrizes] = useState<Prize[]>(DEFAULT_PRIZES)
  const [whitelist, setWhitelist] = useState<WhitelistEntry[]>([])
  const [spinLimit, setSpinLimit] = useState(1)

  // New entry form
  const [newAgentId, setNewAgentId] = useState('')
  const [newWhatsapp, setNewWhatsapp] = useState('')
  const [newNote, setNewNote] = useState('')

  // Tabs
  const [tab, setTab] = useState<'prizes' | 'whitelist' | 'spins'>('prizes')

  const fetchData = async (key: string) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/wheel-demo/admin?key=${encodeURIComponent(key)}`)
      if (!res.ok) {
        setError('❌ Unauthorized — kunci salah')
        setLoading(false)
        return
      }
      const data = await res.json()
      setConfig(data.config)
      setPrizes(data.config.prizes)
      setWhitelist(data.config.whitelist)
      setSpinLimit(data.config.spinLimitPerEntry)
      setSpins(data.recentSpins || [])
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

  const handleSave = async () => {
    setSaving(true)
    setSaveMsg('')
    try {
      const res = await fetch('/api/wheel-demo/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: keyInput, config: { prizes, whitelist, spinLimitPerEntry: spinLimit } }),
      })
      if (res.ok) {
        const data = await res.json()
        setConfig(data.config)
        setSaveMsg('✅ Settings saved!')
      } else {
        setSaveMsg('❌ Save failed')
      }
    } catch {
      setSaveMsg('❌ Save failed')
    }
    setSaving(false)
    setTimeout(() => setSaveMsg(''), 3000)
  }

  const addWhitelistEntry = () => {
    if (!newAgentId.trim() || !newWhatsapp.trim()) return
    setWhitelist([...whitelist, { agentId: newAgentId.trim(), whatsapp: newWhatsapp.trim(), note: newNote.trim() }])
    setNewAgentId('')
    setNewWhatsapp('')
    setNewNote('')
  }

  const removeWhitelist = (index: number) => {
    setWhitelist(whitelist.filter((_, i) => i !== index))
  }

  const updatePrize = (index: number, field: keyof Prize, value: any) => {
    const updated = [...prizes]
    updated[index] = { ...updated[index], [field]: value }
    setPrizes(updated)
  }

  const addPrize = () => {
    setPrizes([...prizes, { label: 'NEW', weight: 1, colorA: '#888888', colorB: '#666666' }])
  }

  const removePrize = (index: number) => {
    setPrizes(prizes.filter((_, i) => i !== index))
  }

  const totalWeight = prizes.reduce((sum, p) => sum + (p.weight || 0), 0)

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
          <h1 style={{ color: '#ffd700', margin: '0 0 8px', fontSize: '24px' }}>🎡 Wheel Demo Admin</h1>
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

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      fontFamily: 'system-ui', color: '#fff', padding: '20px'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ color: '#ffd700', fontSize: '28px', margin: '0 0 4px' }}>🎡 Wheel Demo Admin</h1>
          <p style={{ color: '#aaa', margin: 0 }}>Kelola hadiah, whitelist & settings</p>
        </div>

        {/* Stats */}
        {stats && (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px'
          }}>
            <div style={{ background: '#0f3460', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#4a9eff' }}>{stats.totalSpins}</div>
              <div style={{ fontSize: '12px', color: '#aaa' }}>Total Spins</div>
            </div>
            <div style={{ background: '#0f3460', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#25D366' }}>{stats.whitelistCount}</div>
              <div style={{ fontSize: '12px', color: '#aaa' }}>Whitelist</div>
            </div>
            <div style={{ background: '#0f3460', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ffd700' }}>{stats.configuredPrizes}</div>
              <div style={{ fontSize: '12px', color: '#aaa' }}>Hadiah</div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {(['prizes', 'whitelist', 'spins'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '10px 20px', borderRadius: '8px', border: 'none',
              background: tab === t ? '#ffd700' : '#0f3460', color: tab === t ? '#1a1a2e' : '#fff',
              fontWeight: 'bold', cursor: 'pointer', textTransform: 'capitalize'
            }}>
              {t === 'prizes' ? '🎁 Hadiah' : t === 'whitelist' ? '👥 Whitelist' : '🎰 Spin Records'}
            </button>
          ))}
        </div>

        {/* Prizes Tab */}
        {tab === 'prizes' && (
          <div style={{ background: '#0f3460', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, color: '#ffd700' }}>Senarai Hadiah & Peratus</h3>
              <div style={{ fontSize: '14px', color: totalWeight === 100 ? '#25D366' : '#ff6b4a' }}>
                Total: {totalWeight}% {totalWeight !== 100 && '(sepatutnya 100%)'}
              </div>
            </div>

            <div style={{ display: 'grid', gap: '12px' }}>
              {prizes.map((p, i) => (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: '1fr 100px 80px 80px 40px', gap: '8px',
                  alignItems: 'center', padding: '12px', background: '#1a1a2e', borderRadius: '8px'
                }}>
                  <input value={p.label} onChange={e => updatePrize(i, 'label', e.target.value)}
                    placeholder="Label" style={inputStyle} />
                  <input type="number" value={p.weight} onChange={e => updatePrize(i, 'weight', Number(e.target.value))}
                    placeholder="%" style={inputStyle} />
                  <input value={p.colorA} onChange={e => updatePrize(i, 'colorA', e.target.value)}
                    type="color" style={{ ...inputStyle, padding: '4px', height: '40px' }} />
                  <input value={p.colorB} onChange={e => updatePrize(i, 'colorB', e.target.value)}
                    type="color" style={{ ...inputStyle, padding: '4px', height: '40px' }} />
                  <button onClick={() => removePrize(i)} style={delBtn}>✕</button>
                </div>
              ))}
            </div>

            <button onClick={addPrize} style={{
              marginTop: '12px', padding: '10px 20px', borderRadius: '8px', border: '2px dashed #ffd700',
              background: 'transparent', color: '#ffd700', cursor: 'pointer', fontWeight: 'bold'
            }}>
              + Tambah Hadiah
            </button>
          </div>
        )}

        {/* Whitelist Tab */}
        {tab === 'whitelist' && (
          <div style={{ background: '#0f3460', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ margin: '0 0 16px', color: '#ffd700' }}>Senarai Agent & WhatsApp</h3>

            {/* Add new */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '8px',
              marginBottom: '20px', padding: '16px', background: '#1a1a2e', borderRadius: '8px'
            }}>
              <input value={newAgentId} onChange={e => setNewAgentId(e.target.value)}
                placeholder="Agent ID" style={inputStyle} />
              <input value={newWhatsapp} onChange={e => setNewWhatsapp(e.target.value)}
                placeholder="WhatsApp" style={inputStyle} />
              <input value={newNote} onChange={e => setNewNote(e.target.value)}
                placeholder="Note (optional)" style={inputStyle} />
              <button onClick={addWhitelistEntry} style={addBtn}>+</button>
            </div>

            {/* List */}
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #ffd700' }}>
                    <th style={th}>Agent ID</th>
                    <th style={th}>WhatsApp</th>
                    <th style={th}>Note</th>
                    <th style={th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {whitelist.map((w, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #333' }}>
                      <td style={td}><strong>{w.agentId}</strong></td>
                      <td style={td}>{w.whatsapp}</td>
                      <td style={{ ...td, color: '#aaa', fontSize: '13px' }}>{w.note || '-'}</td>
                      <td style={td}>
                        <button onClick={() => removeWhitelist(i)} style={delBtn}>✕</button>
                      </td>
                    </tr>
                  ))}
                  {whitelist.length === 0 && (
                    <tr><td colSpan={4} style={{ ...td, textAlign: 'center', color: '#666', padding: '40px' }}>
                      Tiada entry. Tambah kat atas.
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Spins Tab */}
        {tab === 'spins' && (
          <div style={{ background: '#0f3460', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ margin: '0 0 16px', color: '#ffd700' }}>Recent Spin Records</h3>
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #ffd700' }}>
                    <th style={th}>#</th>
                    <th style={th}>Agent ID</th>
                    <th style={th}>WhatsApp</th>
                    <th style={th}>Hadiah</th>
                    <th style={th}>Masa</th>
                    <th style={th}>Claim ID</th>
                  </tr>
                </thead>
                <tbody>
                  {spins.map((s, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #333' }}>
                      <td style={td}>{i + 1}</td>
                      <td style={td}><strong>{s.agentId}</strong></td>
                      <td style={td}>{s.whatsapp}</td>
                      <td style={td}>
                        <span style={{
                          background: s.prize.includes('RM') ? '#ffd70022' : '#88822',
                          color: s.prize.includes('RM') ? '#ffd700' : '#888',
                          padding: '4px 10px', borderRadius: '20px', fontWeight: 'bold'
                        }}>
                          {s.prize}
                        </span>
                      </td>
                      <td style={{ ...td, fontSize: '12px', color: '#aaa' }}>{s.spunAt}</td>
                      <td style={{ ...td, fontSize: '11px', fontFamily: 'monospace' }}>{s.claimId}</td>
                    </tr>
                  ))}
                  {spins.length === 0 && (
                    <tr><td colSpan={6} style={{ ...td, textAlign: 'center', color: '#666', padding: '40px' }}>
                      Tiada spin记录.
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Spin Limit Setting */}
        <div style={{ marginTop: '20px', background: '#0f3460', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ margin: '0 0 12px', color: '#ffd700' }}>⚙️ Spin Limit Global</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <label style={{ color: '#aaa', fontSize: '14px' }}>Setiap agent/WhatsApp layak:</label>
            <input type="number" min="1" max="10" value={spinLimit} onChange={e => setSpinLimit(Number(e.target.value))}
              style={{ ...inputStyle, width: '80px', textAlign: 'center' }} />
            <span style={{ color: '#aaa', fontSize: '14px' }}>kali putar</span>
          </div>
        </div>

        {/* Save Button */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button onClick={handleSave} disabled={saving} style={{
            padding: '14px 40px', borderRadius: '999px', border: 'none',
            background: saving ? '#666' : 'linear-gradient(135deg, #25D366, #1da85a)', color: '#fff',
            fontSize: '16px', fontWeight: 'bold', cursor: saving ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 20px rgba(37,211,102,0.3)'
          }}>
            {saving ? 'Saving...' : '💾 Save Settings'}
          </button>
          {saveMsg && <p style={{ margin: '12px 0 0', color: saveMsg.includes('✅') ? '#25D366' : '#ff6b4a' }}>
            {saveMsg}
          </p>}
        </div>

        <p style={{ textAlign: 'center', color: '#444', marginTop: '32px', fontSize: '12px' }}>
          CM8 Wheel Demo Admin • Key: cm8admin2026
        </p>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  padding: '10px 12px', borderRadius: '6px', border: '1px solid #333',
  background: '#1a1a2e', color: '#fff', fontSize: '14px', outline: 'none'
}

const th: React.CSSProperties = {
  padding: '12px 8px', textAlign: 'left', color: '#ffd700', fontSize: '13px',
  fontWeight: 'bold', borderBottom: '2px solid #ffd70033'
}

const td: React.CSSProperties = {
  padding: '10px 8px', whiteSpace: 'nowrap'
}

const delBtn: React.CSSProperties = {
  padding: '6px 10px', borderRadius: '4px', border: 'none', background: '#ff4444',
  color: '#fff', cursor: 'pointer', fontSize: '12px'
}

const addBtn: React.CSSProperties = {
  padding: '10px 16px', borderRadius: '6px', border: 'none', background: '#25D366',
  color: '#fff', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold'
}
