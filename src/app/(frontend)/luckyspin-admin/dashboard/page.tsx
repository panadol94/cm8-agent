'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

type Tab = 'whitelist' | 'rewards' | 'records' | 'settings'

interface WhitelistEntry {
  id: string
  agentId: string
  isActive: boolean
  hasSpun: boolean
  createdAt: string
}

interface RewardEntry {
  id: string
  rewardName: string
  rewardType: string
  probability: number
  isActive: boolean
  position: number
}

interface SpinRecord {
  id: string
  agentId: string
  rewardWon: string
  rewardType: string
  spunAt: string
  ipAddress: string
  isValid: boolean
}

export default function LuckySpinAdminDashboard() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('whitelist')
  const [loading, setLoading] = useState(false)

  // Whitelist state
  const [whitelist, setWhitelist] = useState<WhitelistEntry[]>([])
  const [wlPage, setWlPage] = useState(1)
  const [wlTotal, setWlTotal] = useState(0)
  const [wlSearch, setWlSearch] = useState('')
  const [newAgentIds, setNewAgentIds] = useState('')

  // Rewards state
  const [rewards, setRewards] = useState<RewardEntry[]>([])
  const [probError, setProbError] = useState<string | null>(null)

  // Records state
  const [records, setRecords] = useState<SpinRecord[]>([])
  const [recPage, setRecPage] = useState(1)
  const [recTotal, setRecTotal] = useState(0)
  const [recFilter, setRecFilter] = useState({ agentId: '', rewardWon: '', dateFrom: '', dateTo: '' })

  // Settings state
  const [settings, setSettings] = useState<Record<string, unknown>>({})

  const [newReward, setNewReward] = useState({ rewardName: '', rewardType: 'cash', probability: 0, position: 1 })

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/luckyspin/admin/settings', { credentials: 'include' })
      if (!res.ok) router.push('/luckyspin-admin')
    } catch {
      router.push('/luckyspin-admin')
    }
  }, [router])

  useEffect(() => { checkAuth() }, [checkAuth])

  // Fetch whitelist
  const fetchWhitelist = async (page = 1, search = '') => {
    setLoading(true)
    try {
      const res = await fetch(`/api/luckyspin/admin/whitelist?page=${page}&search=${search}`, { credentials: 'include' })
      const data = await res.json()
      setWhitelist(data.docs || [])
      setWlTotal(data.totalDocs || 0)
      setWlPage(page)
    } finally {
      setLoading(false)
    }
  }

  // Fetch rewards
  const fetchRewards = async () => {
    const res = await fetch('/api/luckyspin/admin/rewards', { credentials: 'include' })
    const data = await res.json()
    setRewards(data || [])
  }

  // Fetch records
  const fetchRecords = async (page = 1, filters = recFilter) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(page),
        ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)),
      })
      const res = await fetch(`/api/luckyspin/admin/records?${params}`, { credentials: 'include' })
      const data = await res.json()
      setRecords(data.docs || [])
      setRecTotal(data.totalDocs || 0)
      setRecPage(page)
    } finally {
      setLoading(false)
    }
  }

  // Fetch settings
  const fetchSettings = async () => {
    const res = await fetch('/api/luckyspin/admin/settings', { credentials: 'include' })
    const data = await res.json()
    setSettings(data)
  }

  useEffect(() => {
    if (tab === 'whitelist') fetchWhitelist(wlPage, wlSearch)
    if (tab === 'rewards') fetchRewards()
    if (tab === 'records') fetchRecords(recPage, recFilter)
    if (tab === 'settings') fetchSettings()
  }, [tab])

  // Whitelist actions
  const handleAddWhitelist = async () => {
    const ids = newAgentIds.split('\n').map(id => id.trim()).filter(Boolean)
    if (!ids.length) return

    const res = await fetch('/api/luckyspin/admin/whitelist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentIds: ids }),
      credentials: 'include',
    })
    const data = await res.json()
    alert(`Added: ${data.success}, Failed: ${data.failed}, Existing: ${data.existing?.join(', ')}`)
    setNewAgentIds('')
    fetchWhitelist()
  }

  const handleDeleteWhitelist = async (id: string) => {
    if (!confirm('Padam agent ini dari whitelist?')) return
    await fetch('/api/luckyspin/admin/whitelist', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
      credentials: 'include',
    })
    fetchWhitelist(wlPage, wlSearch)
  }

  const handleToggleWhitelist = async (id: string, isActive: boolean) => {
    await fetch('/api/luckyspin/admin/whitelist', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, isActive: !isActive }),
      credentials: 'include',
    })
    fetchWhitelist(wlPage, wlSearch)
  }

  // Reward actions
  const handleAddReward = async () => {
    if (newReward.probability <= 0) { setProbError('Probability mestilah lebih dari 0.'); return }
    const res = await fetch('/api/luckyspin/admin/rewards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReward),
      credentials: 'include',
    })
    const data = await res.json()
    if (!res.ok) { setProbError(data.error); return }
    setProbError(null)
    setNewReward({ rewardName: '', rewardType: 'cash', probability: 0, position: 1 })
    fetchRewards()
  }

  const handleUpdateProb = async (id: string, probability: number) => {
    const res = await fetch('/api/luckyspin/admin/rewards', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, probability }),
      credentials: 'include',
    })
    const data = await res.json()
    if (!res.ok) { setProbError(data.error) } else { setProbError(null); fetchRewards() }
  }

  const handleDeleteReward = async (id: string) => {
    if (!confirm('Padam hadiah ini?')) return
    await fetch('/api/luckyspin/admin/rewards', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
      credentials: 'include',
    })
    fetchRewards()
  }

  // Settings actions
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const data = {
      eventStatus: (form.elements.namedItem('eventStatus') as HTMLInputElement).checked,
      eventStart: (form.elements.namedItem('eventStart') as HTMLInputElement).value,
      eventEnd: (form.elements.namedItem('eventEnd') as HTMLInputElement).value,
      timezone: (form.elements.namedItem('timezone') as HTMLInputElement).value,
    }

    const res = await fetch('/api/luckyspin/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    })
    if (res.ok) alert('Tetapan disimpan!')
  }

  const handleLogout = async () => {
    await fetch('/api/luckyspin/admin/login', { method: 'DELETE', credentials: 'include' }).catch(() => {})
    router.push('/luckyspin-admin')
  }

  const totalProb = rewards.reduce((s, r) => s + (r.probability || 0), 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] to-[#111133] text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 py-4 px-6 flex items-center justify-between shadow-lg">
        <h1 className="text-xl font-black">🎰 Lucky Spin Admin Panel</h1>
        <button onClick={handleLogout} className="text-black/70 hover:text-black text-sm font-bold underline">Logout</button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-yellow-500/20 overflow-x-auto">
        {(['whitelist', 'rewards', 'records', 'settings'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-3 text-sm font-bold capitalize whitespace-nowrap border-b-2 transition-colors ${
              tab === t ? 'text-yellow-400 border-yellow-400' : 'text-white/50 border-transparent hover:text-white'
            }`}
          >
            {t === 'whitelist' && '📋 Whitelist'}
            {t === 'rewards' && '🎁 Hadiah'}
            {t === 'records' && '📊 Rekod'}
            {t === 'settings' && '⚙️ Tetapan'}
          </button>
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {tab === 'whitelist' && (
          <div className="space-y-4">
            {/* Add bulk */}
            <div className="bg-white/5 rounded-xl p-4 border border-yellow-500/20">
              <h3 className="font-bold text-yellow-400 mb-2">Tambah Agent ID (satu baris setiap satu)</h3>
              <textarea
                value={newAgentIds}
                onChange={e => setNewAgentIds(e.target.value)}
                placeholder="AGENT001&#10;AGENT002&#10;AGENT003"
                className="w-full h-24 bg-white/10 border border-yellow-500/30 rounded-xl p-3 text-white font-mono text-sm"
              />
              <button onClick={handleAddWhitelist} className="mt-2 px-6 py-2 bg-yellow-500 text-black font-bold rounded-lg">Tambah</button>
            </div>

            {/* Search */}
            <div className="flex gap-2">
              <input
                value={wlSearch}
                onChange={e => setWlSearch(e.target.value)}
                placeholder="Cari Agent ID..."
                className="flex-1 px-4 py-2 bg-white/10 border border-yellow-500/30 rounded-xl"
              />
              <button onClick={() => fetchWhitelist(1, wlSearch)} className="px-6 py-2 bg-yellow-500 text-black font-bold rounded-xl">Cari</button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-yellow-400 border-b border-yellow-500/20">
                    <th className="py-2 px-3 text-left">Agent ID</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3">Spin</th>
                    <th className="py-2 px-3">Tarikh</th>
                    <th className="py-2 px-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {whitelist.map(entry => (
                    <tr key={entry.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-2 px-3 font-mono text-yellow-300">{entry.agentId}</td>
                      <td className="py-2 px-3 text-center">
                        <button
                          onClick={() => handleToggleWhitelist(entry.id, entry.isActive)}
                          className={`px-2 py-0.5 rounded text-xs font-bold ${entry.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
                        >
                          {entry.isActive ? 'AKTIF' : 'NONAKTIF'}
                        </button>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${entry.hasSpun ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/10 text-white/50'}`}>
                          {entry.hasSpun ? 'UDAH SPIN' : 'BELUM'}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-white/50">{entry.createdAt ? new Date(entry.createdAt).toLocaleDateString('ms-MY') : '-'}</td>
                      <td className="py-2 px-3">
                        <button onClick={() => handleDeleteWhitelist(entry.id)} className="text-red-400 hover:text-red-300 text-xs underline">Padam</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-white/50 text-sm">Jumlah: {wlTotal} Agent ID</p>
          </div>
        )}

        {tab === 'rewards' && (
          <div className="space-y-4">
            {/* Add new reward */}
            <div className="bg-white/5 rounded-xl p-4 border border-yellow-500/20">
              <h3 className="font-bold text-yellow-400 mb-2">Tambah Hadiah Baru</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                <input value={newReward.rewardName} onChange={e => setNewReward({ ...newReward, rewardName: e.target.value })} placeholder="Nama hadiah" className="px-3 py-2 bg-white/10 border border-yellow-500/30 rounded-lg" />
                <select value={newReward.rewardType} onChange={e => setNewReward({ ...newReward, rewardType: e.target.value })} className="px-3 py-2 bg-white/10 border border-yellow-500/30 rounded-lg">
                  <option value="cash">💵 Tunai</option>
                  <option value="gold">🥇 Emas</option>
                  <option value="bonus">🎁 Bonus</option>
                </select>
                <input type="number" value={newReward.probability} onChange={e => setNewReward({ ...newReward, probability: Number(e.target.value) })} placeholder="%" className="px-3 py-2 bg-white/10 border border-yellow-500/30 rounded-lg" />
                <input type="number" value={newReward.position} onChange={e => setNewReward({ ...newReward, position: Number(e.target.value) })} placeholder="Position" className="px-3 py-2 bg-white/10 border border-yellow-500/30 rounded-lg" />
                <button onClick={handleAddReward} className="px-4 py-2 bg-yellow-500 text-black font-bold rounded-lg">Tambah</button>
              </div>
              {probError && <p className="text-red-400 text-sm mt-2">{probError}</p>}
            </div>

            {/* Total probability */}
            <div className={`text-center py-2 rounded-xl font-bold ${totalProb === 100 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              Jumlah Probability: {totalProb}% {totalProb === 100 ? '✅ = 100%' : '❌ Mestilah = 100%'}
            </div>

            {/* Rewards list */}
            <div className="space-y-2">
              {rewards.map(r => (
                <div key={r.id} className="flex items-center justify-between bg-white/5 rounded-xl p-3 border border-yellow-500/20">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{r.rewardType === 'cash' ? '💵' : r.rewardType === 'gold' ? '🥇' : '🎁'}</span>
                    <span className="font-bold">{r.rewardName}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${r.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {r.isActive ? 'AKTIF' : 'HIDDEN'}
                    </span>
                    <span className="text-white/50 text-xs">Pos: {r.position}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      defaultValue={r.probability}
                      onBlur={e => handleUpdateProb(r.id, Number(e.target.value))}
                      className="w-16 px-2 py-1 bg-white/10 border border-yellow-500/30 rounded text-center"
                      min={0} max={100}
                    />
                    <span className="text-yellow-400 text-sm">%</span>
                    <button onClick={() => handleDeleteReward(r.id)} className="text-red-400 hover:text-red-300 text-xs underline ml-2">Padam</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'records' && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <input value={recFilter.agentId} onChange={e => setRecFilter({ ...recFilter, agentId: e.target.value })} placeholder="Cari Agent ID" className="px-3 py-2 bg-white/10 border border-yellow-500/30 rounded-lg" />
              <input value={recFilter.rewardWon} onChange={e => setRecFilter({ ...recFilter, rewardWon: e.target.value })} placeholder="Cari Hadiah" className="px-3 py-2 bg-white/10 border border-yellow-500/30 rounded-lg" />
              <input type="date" value={recFilter.dateFrom} onChange={e => setRecFilter({ ...recFilter, dateFrom: e.target.value })} className="px-3 py-2 bg-white/10 border border-yellow-500/30 rounded-lg" />
              <input type="date" value={recFilter.dateTo} onChange={e => setRecFilter({ ...recFilter, dateTo: e.target.value })} className="px-3 py-2 bg-white/10 border border-yellow-500/30 rounded-lg" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => fetchRecords(1, recFilter)} className="px-6 py-2 bg-yellow-500 text-black font-bold rounded-xl">Filter</button>
              <button onClick={() => window.open(`/api/luckyspin/admin/records?export=csv&${new URLSearchParams(recFilter as Record<string,string>)}`, '_blank')} className="px-6 py-2 bg-green-600 text-white font-bold rounded-xl">Export CSV</button>
            </div>

            {/* Records table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-yellow-400 border-b border-yellow-500/20">
                    <th className="py-2 px-3 text-left">Agent ID</th>
                    <th className="py-2 px-3">Hadiah</th>
                    <th className="py-2 px-3">Tarikh & Masa</th>
                    <th className="py-2 px-3">IP</th>
                    <th className="py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map(rec => (
                    <tr key={rec.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-2 px-3 font-mono text-yellow-300">{rec.agentId}</td>
                      <td className="py-2 px-3 font-bold text-yellow-200">{rec.rewardWon}</td>
                      <td className="py-2 px-3 text-white/50 text-xs">{rec.spunAt ? new Date(rec.spunAt).toLocaleString('ms-MY') : '-'}</td>
                      <td className="py-2 px-3 text-white/50 text-xs">{rec.ipAddress}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${rec.isValid ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {rec.isValid ? 'VALID' : 'INVALID'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-white/50 text-sm">Jumlah rekod: {recTotal}</p>
          </div>
        )}

        {tab === 'settings' && (
          <div className="max-w-xl">
            <form onSubmit={handleSaveSettings} className="bg-white/5 rounded-xl p-6 border border-yellow-500/20 space-y-4">
              <h3 className="font-bold text-yellow-400 text-lg">Tetapan Event</h3>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="eventStatus" defaultChecked={settings.eventStatus as boolean} className="w-5 h-5" />
                <span className="font-bold">Aktifkan Event</span>
              </label>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/50 text-sm mb-1">Masa Mula</label>
                  <input type="datetime-local" name="eventStart" defaultValue={settings.eventStart ? String(settings.eventStart).replace('Z', '').slice(0, 16) : ''} className="w-full px-3 py-2 bg-white/10 border border-yellow-500/30 rounded-lg" />
                </div>
                <div>
                  <label className="block text-white/50 text-sm mb-1">Masa Tamat</label>
                  <input type="datetime-local" name="eventEnd" defaultValue={settings.eventEnd ? String(settings.eventEnd).replace('Z', '').slice(0, 16) : ''} className="w-full px-3 py-2 bg-white/10 border border-yellow-500/30 rounded-lg" />
                </div>
              </div>

              <div>
                <label className="block text-white/50 text-sm mb-1">Timezone</label>
                <input type="text" name="timezone" defaultValue={(settings.timezone as string) || 'Asia/Kuching'} className="w-full px-3 py-2 bg-white/10 border border-yellow-500/30 rounded-lg" />
              </div>

              <button type="submit" className="w-full py-3 bg-yellow-500 text-black font-bold rounded-xl">Simpan Tetapan</button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
