'use client'

import { useState, useEffect } from 'react'

type Prize = { label: string; weight: number; colorA: string; colorB: string }
type WhitelistEntry = { agentId: string; whatsapp: string; note?: string; spinLimit?: number }
type AdminConfig = { prizes: Prize[]; whitelist: WhitelistEntry[]; spinLimitPerEntry: number }
type SpinRecord = { agentId: string; whatsapp: string; prize: string; spunAt: string; claimId: string }
type Stats = { totalSpins: number; whitelistCount: number; configuredPrizes: number }

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
  const [prizes, setPrizes] = useState<Prize[]>(DEFAULT_PRIZES)
  const [whitelist, setWhitelist] = useState<WhitelistEntry[]>([])
  const [spinLimit, setSpinLimit] = useState(1)
  const [newAgentId, setNewAgentId] = useState('')
  const [newWhatsapp, setNewWhatsapp] = useState('')
  const [newNote, setNewNote] = useState('')
  const [tab, setTab] = useState<'prizes' | 'whitelist' | 'spins'>('prizes')

  const fetchData = async (key: string) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/wheel-demo/admin?key=${encodeURIComponent(key)}`)
      if (!res.ok) { setError('❌ Unauthorized — kunci salah'); setLoading(false); return }
      const data = await res.json()
      setConfig(data.config)
      setPrizes(data.config.prizes)
      setWhitelist(data.config.whitelist)
      setSpinLimit(data.config.spinLimitPerEntry)
      setSpins(data.recentSpins || [])
      setStats(data.stats)
      setAuthed(true)
    } catch { setError('❌ Gagal fetch data') }
    setLoading(false)
  }

  const handleLogin = (e: React.FormEvent) => { e.preventDefault(); fetchData(keyInput) }

  const handleSave = async () => {
    setSaving(true)
    setSaveMsg('')
    try {
      const res = await fetch('/api/wheel-demo/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: keyInput, config: { prizes, whitelist, spinLimitPerEntry: spinLimit } }),
      })
      if (res.ok) { const d = await res.json(); setConfig(d.config); setSaveMsg('✅ Settings saved!') }
      else setSaveMsg('❌ Save failed')
    } catch { setSaveMsg('❌ Save failed') }
    setSaving(false)
    setTimeout(() => setSaveMsg(''), 3000)
  }

  const addWhitelistEntry = () => {
    if (!newAgentId.trim() || !newWhatsapp.trim()) return
    setWhitelist([...whitelist, { agentId: newAgentId.trim(), whatsapp: newWhatsapp.trim(), note: newNote.trim() }])
    setNewAgentId(''); setNewWhatsapp(''); setNewNote('')
  }

  const removeWhitelist = (i: number) => setWhitelist(whitelist.filter((_, idx) => idx !== i))
  const updatePrize = (i: number, f: keyof Prize, v: any) => { const u = [...prizes]; u[i] = { ...u[i], [f]: v }; setPrizes(u) }
  const addPrize = () => setPrizes([...prizes, { label: 'NEW', weight: 1, colorA: '#888888', colorB: '#666666' }])
  const removePrize = (i: number) => setPrizes(prizes.filter((_, idx) => idx !== i))
  const totalWeight = prizes.reduce((s, p) => s + (p.weight || 0), 0)

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0d0206 0%, #1a0505 50%, #0d0206 100%)', fontFamily: 'system-ui' }}>
        <form onSubmit={handleLogin} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: '24px', padding: '40px', textAlign: 'center', minWidth: 340, backdropFilter: 'blur(16px)' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎡</div>
          <h1 style={{ color: '#ffd700', margin: '0 0 6px', fontSize: '26px', fontWeight: 900 }}>Wheel Admin</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', margin: '0 0 24px', fontSize: '13px' }}>Admin Access Only — Share this link with admins only</p>
          <input type="password" placeholder="Masukkan kunci admin" value={keyInput} onChange={e => setKeyInput(e.target.value)} style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.4)', color: '#fff', fontSize: '16px', marginBottom: '14px', outline: 'none', boxSizing: 'border-box' }} />
          <button type="submit" style={{ width: '100%', padding: '14px', borderRadius: '999px', border: 'none', background: 'linear-gradient(135deg, #ffd700, #ff9800)', color: '#1a0505', fontSize: '16px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 20px rgba(255,215,0,0.2)' }}>
            {loading ? '⏳ Loading...' : 'Masuk →'}
          </button>
          {error && <p style={{ color: '#ff6b6b', marginTop: '12px', fontSize: '14px' }}>{error}</p>}
        </form>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0d0206 0%, #120208 50%, #0d0206 100%)', fontFamily: 'system-ui', color: '#fff', padding: '24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '36px', marginBottom: '6px' }}>🎡</div>
          <h1 style={{ color: '#ffd700', fontSize: '28px', margin: '0 0 4px', fontWeight: 900 }}>Wheel Admin Panel</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', margin: 0, fontSize: '13px' }}>Kelola hadiah, whitelist agent & settings</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '24px' }}>
            {[
              { label: 'Total Spins', value: stats.totalSpins, color: '#4facfe', icon: '🎰' },
              { label: 'Whitelist Agents', value: stats.whitelistCount, color: '#25D366', icon: '👥' },
              { label: 'Hadiah Dikonfig', value: stats.configuredPrizes, color: '#ffd700', icon: '🎁' },
            ].map((s) => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,215,0,0.12)', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', marginBottom: '6px' }}>{s.icon}</div>
                <div style={{ fontSize: '32px', fontWeight: 900, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {(['prizes', 'whitelist', 'spins'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: '11px 22px', borderRadius: '12px', border: 'none', background: tab === t ? 'linear-gradient(135deg, #ffd700, #ff9800)' : 'rgba(255,255,255,0.06)', color: tab === t ? '#1a0505' : 'rgba(255,255,255,0.6)', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s' }}>
              {t === 'prizes' ? '🎁 Hadiah' : t === 'whitelist' ? '👥 Whitelist' : '🎰 Records'}
            </button>
          ))}
        </div>

        {/* PRIZES TAB */}
        {tab === 'prizes' && (
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,215,0,0.12)', borderRadius: '20px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#ffd700', fontSize: '16px', fontWeight: 800 }}>Senarai Hadiah & Probability</h3>
              <div style={{ fontSize: '13px', padding: '5px 12px', borderRadius: '999px', background: totalWeight === 100 ? 'rgba(37,211,102,0.15)' : 'rgba(255,84,84,0.15)', color: totalWeight === 100 ? '#4ade80' : '#ff6b6b', fontWeight: 700 }}>
                Total: {totalWeight}% {totalWeight !== 100 && '(should be 100%)'}
              </div>
            </div>
            <div style={{ display: 'grid', gap: '10px' }}>
              {prizes.map((p, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 80px 80px 40px', gap: '8px', alignItems: 'center', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <input value={p.label} onChange={e => updatePrize(i, 'label', e.target.value)} style={inp} />
                  <input type="number" value={p.weight} onChange={e => updatePrize(i, 'weight', Number(e.target.value))} style={inp} />
                  <input value={p.colorA} onChange={e => updatePrize(i, 'colorA', e.target.value)} type="color" style={{ ...inp, padding: '4px', height: '42px', cursor: 'pointer' }} />
                  <input value={p.colorB} onChange={e => updatePrize(i, 'colorB', e.target.value)} type="color" style={{ ...inp, padding: '4px', height: '42px', cursor: 'pointer' }} />
                  <button onClick={() => removePrize(i)} style={del}>✕</button>
                </div>
              ))}
            </div>
            <button onClick={addPrize} style={{ marginTop: '14px', padding: '10px 20px', borderRadius: '999px', border: '2px dashed rgba(255,215,0,0.4)', background: 'transparent', color: '#ffd700', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}>
              + Tambah Hadiah
            </button>
          </div>
        )}

        {/* WHITELIST TAB */}
        {tab === 'whitelist' && (
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,215,0,0.12)', borderRadius: '20px', padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px', color: '#ffd700', fontSize: '16px', fontWeight: 800 }}>Senarai Agent & WhatsApp</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '8px', marginBottom: '20px', padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px' }}>
              <input value={newAgentId} onChange={e => setNewAgentId(e.target.value)} placeholder="Agent ID" style={inp} />
              <input value={newWhatsapp} onChange={e => setNewWhatsapp(e.target.value)} placeholder="WhatsApp" style={inp} />
              <input value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Note (optional)" style={inp} />
              <button onClick={addWhitelistEntry} style={add}>+</button>
            </div>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ borderBottom: '2px solid rgba(255,215,0,0.2)' }}>
                  <th style={th}>Agent ID</th><th style={th}>WhatsApp</th><th style={th}>Note</th><th style={th}>Action</th>
                </tr></thead>
                <tbody>
                  {whitelist.map((w, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={td}><strong>{w.agentId}</strong></td>
                      <td style={td}>{w.whatsapp}</td>
                      <td style={{ ...td, color: 'rgba(255,255,255,0.45)', fontSize: '12px' }}>{w.note || '-'}</td>
                      <td style={td}><button onClick={() => removeWhitelist(i)} style={del}>✕</button></td>
                    </tr>
                  ))}
                  {whitelist.length === 0 && <tr><td colSpan={4} style={{ ...td, textAlign: 'center', color: 'rgba(255,255,255,0.2)', padding: '40px' }}>Tiada entry — tambah kat atas.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SPINS TAB */}
        {tab === 'spins' && (
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,215,0,0.12)', borderRadius: '20px', padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px', color: '#ffd700', fontSize: '16px', fontWeight: 800 }}>Recent Spin Records</h3>
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ borderBottom: '2px solid rgba(255,215,0,0.2)' }}>
                  <th style={th}>#</th><th style={th}>Agent ID</th><th style={th}>WhatsApp</th><th style={th}>Hadiah</th><th style={th}>Masa</th><th style={th}>Claim ID</th>
                </tr></thead>
                <tbody>
                  {spins.map((s, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={td}>{i + 1}</td>
                      <td style={td}><strong>{s.agentId}</strong></td>
                      <td style={td}>{s.whatsapp}</td>
                      <td style={td}><span style={{ background: s.prize.includes('RM') ? 'rgba(255,215,0,0.15)' : 'rgba(255,255,255,0.05)', color: s.prize.includes('RM') ? '#ffd700' : 'rgba(255,255,255,0.4)', padding: '4px 10px', borderRadius: '999px', fontWeight: 700, fontSize: '12px' }}>{s.prize}</span></td>
                      <td style={{ ...td, fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>{s.spunAt}</td>
                      <td style={{ ...td, fontSize: '11px', fontFamily: 'monospace', color: '#4facfe' }}>{s.claimId}</td>
                    </tr>
                  ))}
                  {spins.length === 0 && <tr><td colSpan={6} style={{ ...td, textAlign: 'center', color: 'rgba(255,255,255,0.2)', padding: '40px' }}>Tiada spin记录 lagi.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Spin Limit */}
        <div style={{ marginTop: '20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,215,0,0.12)', borderRadius: '16px', padding: '20px' }}>
          <h3 style={{ margin: '0 0 10px', color: '#ffd700', fontSize: '15px', fontWeight: 800 }}>⚙️ Spin Limit Global</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>Setiap agent layak:</label>
            <input type="number" min="1" max="10" value={spinLimit} onChange={e => setSpinLimit(Number(e.target.value))} style={{ ...inp, width: '80px', textAlign: 'center' }} />
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>kali putar</span>
          </div>
        </div>

        {/* Save Button */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button onClick={handleSave} disabled={saving} style={{ padding: '15px 48px', borderRadius: '999px', border: 'none', background: saving ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #25D366, #1da85a)', color: '#fff', fontSize: '16px', fontWeight: 800, cursor: saving ? 'not-allowed' : 'pointer', boxShadow: '0 4px 20px rgba(37,211,102,0.2)', transition: 'all 0.2s' }}>
            {saving ? '⏳ Saving...' : '💾 Save Settings'}
          </button>
          {saveMsg && <p style={{ margin: '12px 0 0', fontSize: '14px', color: saveMsg.includes('✅') ? '#4ade80' : '#ff6b6b' }}>{saveMsg}</p>}
        </div>

        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.15)', marginTop: '32px', fontSize: '11px' }}>CM8 Wheel Admin Panel • Default key: cm8admin2026</p>
      </div>
    </div>
  )
}

const inp: React.CSSProperties = { padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.4)', color: '#fff', fontSize: '14px', outline: 'none' }
const th: React.CSSProperties = { padding: '10px 8px', textAlign: 'left', color: '#ffd700', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid rgba(255,215,0,0.15)' }
const td: React.CSSProperties = { padding: '10px 8px', whiteSpace: 'nowrap', fontSize: '13px' }
const del: React.CSSProperties = { padding: '6px 10px', borderRadius: '6px', border: 'none', background: '#ff4444', color: '#fff', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }
const add: React.CSSProperties = { padding: '10px 16px', borderRadius: '8px', border: 'none', background: '#25D366', color: '#fff', cursor: 'pointer', fontSize: '16px', fontWeight: 900 }
