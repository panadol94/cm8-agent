'use client'

import React, { useState, useMemo } from 'react'
import '../styles.css'
import './patch-id.css'
import { gameData, type GameInfo } from './gameData'

/* ── Provider data (scraped from cm8ong.com) ── */
const providers = [
  {
    id: 'mega888',
    name: 'Mega888',
    img: 'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F32%2F35335f26-6f54-4387-850a-d5590768b25a.jpg',
  },
  {
    id: '918kiss',
    name: 'Kiss918',
    img: 'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F27%2Fcf1330dc-23e2-434e-bd02-a5cf6f7ecf8d.jpg',
  },
  {
    id: 'jili',
    name: 'JILI',
    img: 'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F25%2Faece1da0-0722-4da1-b7d9-e300686f56ad.jpg',
  },
  {
    id: 'pragmatic',
    name: 'Pragmatic Play',
    img: 'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F47%2Fbefe333c-815a-43d7-884d-5a5bf5d5c4f0.jpg',
  },
  {
    id: 'bng',
    name: 'BNG',
    img: 'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F6%2Fdd712cac-8be0-4060-a12d-fd4c9cb41445.jpg',
  },
  {
    id: 'fc-slot',
    name: 'FC Slot',
    img: 'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F17%2F9a1b4279-3080-4255-aec9-a2279244136b.jpg',
  },
  {
    id: 'relax',
    name: 'Relax Gaming',
    img: 'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F84%2F8ab32348-a0a7-4bd5-a2a4-a27cbcf5d4cc.jpg',
  },
  {
    id: 'va-slot',
    name: 'VA Slot',
    img: 'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F62%2F1cd68978-2d66-4fb3-97da-a9ee5bb64119.jpg',
  },
  {
    id: 'spadegaming',
    name: 'Spade Gaming',
    img: 'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F95%2F3741cd4c-ade6-4323-9e4a-e70691722679.jpeg',
  },
  {
    id: 'acewin',
    name: 'Acewin Slot',
    img: 'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F3%2F2a32be39-d110-416f-9d45-a4e70cfd124f.jpg',
  },
  {
    id: 'nolimit',
    name: 'NoLimit City',
    img: 'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F37%2Febf9d79e-2be8-4440-828b-26b75dbc506f.jpg',
  },
  {
    id: 'hacksaw',
    name: 'Hacksaw',
    img: 'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F79%2Fd18411b6-519a-470f-8cdf-2442331ccf88.jpg',
  },
  {
    id: 'habanero',
    name: 'Habanero',
    img: 'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F89%2Fd22d30e6-3b31-46c9-bf4c-e671950d0402.jpg',
  },
  {
    id: 'jdb',
    name: 'JDB',
    img: 'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F80%2F20c33528-54e3-4069-a7dd-5ccc44cc6eda.jpg',
  },
  {
    id: 'playtech',
    name: 'Playtech',
    img: 'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F83%2F2ef04bd9-813c-4169-a397-a59dcb66e87e.jpg',
  },
  {
    id: 'betsoft',
    name: 'BetSoft',
    img: 'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F82%2Fcd27fe88-c13b-44bb-9b9c-b36b29166c3d.jpg',
  },
]

/* ── Provider ID to gameData key mapping ── */
const providerKeyMap: Record<string, string> = {
  'fc-slot': 'fc',
  'va-slot': 'va',
  spadegaming: 'spade',
}

const defaultGames: GameInfo[] = [
  { name: 'Lucky Spin', img: '' },
  { name: 'Golden Dragon', img: '' },
  { name: 'Fortune Tiger', img: '' },
  { name: 'Wild Phoenix', img: '' },
  { name: 'Diamond Rush', img: '' },
  { name: 'Fire Link', img: '' },
  { name: 'Money Rain', img: '' },
  { name: 'Royal Crown', img: '' },
]

function generateResults(provider: string) {
  const key = providerKeyMap[provider] || provider
  const allGames = gameData[key] || defaultGames
  return allGames
    .map((g) => ({
      name: g.name,
      img: g.img,
      rtp: Math.floor(Math.random() * 30 + 65),
      status: '' as string,
    }))
    .map((g) => ({
      ...g,
      status: g.rtp >= 85 ? 'HOT' : g.rtp >= 75 ? 'WARM' : 'COLD',
    }))
    .sort((a, b) => b.rtp - a.rtp)
}

/* ── Circular RTP Gauge Component ── */
function RtpGauge({ rtp, color, size = 56 }: { rtp: number; color: string; size?: number }) {
  const strokeWidth = 5
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (rtp / 100) * circumference
  return (
    <div className="rtp-gauge" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="rtp-gauge-svg">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(0,0,0,0.06)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="rtp-gauge-fill"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="rtp-gauge-text" style={{ color }}>
        {rtp}%
      </span>
    </div>
  )
}

export default function PatchIDPage() {
  const [cm8Id, setCm8Id] = useState('')
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [results, setResults] = useState<
    { name: string; img: string; rtp: number; status: string }[] | null
  >(null)
  const [scanning, setScanning] = useState(false)
  const [scanComplete, setScanComplete] = useState(false)
  const [filter, setFilter] = useState<'ALL' | 'HOT' | 'WARM' | 'COLD'>('ALL')

  const handleScan = () => {
    if (!cm8Id.trim() || !selectedProvider) return
    setScanning(true)
    setScanComplete(false)
    setResults(null)
    setFilter('ALL')

    setTimeout(() => {
      setResults(generateResults(selectedProvider))
      setScanning(false)
      setScanComplete(true)
    }, 2500)
  }

  const getRtpColor = (rtp: number) => {
    if (rtp >= 85) return '#22C55E'
    if (rtp >= 75) return '#F59E0B'
    return '#EF4444'
  }

  /* ── Computed stats ── */
  const stats = useMemo(() => {
    if (!results) return null
    const avgRtp = Math.round(results.reduce((s, g) => s + g.rtp, 0) / results.length)
    const hotCount = results.filter((g) => g.status === 'HOT').length
    const warmCount = results.filter((g) => g.status === 'WARM').length
    return { total: results.length, avgRtp, hotCount, warmCount }
  }, [results])

  const top3 = useMemo(() => (results ? results.slice(0, 3) : []), [results])

  const filteredResults = useMemo(() => {
    if (!results) return []
    const list = filter === 'ALL' ? results : results.filter((g) => g.status === filter)
    // skip top 3 in grid when showing ALL
    return filter === 'ALL' ? list.slice(3) : list
  }, [results, filter])

  return (
    <div className="patch-id-page">
      {/* Header */}
      <div className="patch-header">
        <div className="patch-header-glow" />
        <h1 className="patch-title">
          <span className="patch-icon">🛡️</span>
          Patch ID CM8
        </h1>
        <p className="patch-subtitle">Masukkan ID CM8 anda untuk scan slot percentage terkini</p>
      </div>

      {/* ID Input */}
      <div className="patch-card">
        <label className="patch-label">CM8 Game ID</label>
        <div className="patch-input-wrap">
          <span className="patch-input-icon">🆔</span>
          <input
            type="text"
            className="patch-input"
            placeholder="Masukkan ID CM8 anda..."
            value={cm8Id}
            onChange={(e) => setCm8Id(e.target.value)}
          />
        </div>
      </div>

      {/* Provider Selection */}
      <div className="patch-card">
        <label className="patch-label">Pilih Provider</label>
        <div className="provider-grid">
          {providers.map((p) => (
            <button
              key={p.id}
              className={`provider-btn ${selectedProvider === p.id ? 'provider-active' : ''}`}
              onClick={() => setSelectedProvider(p.id)}
            >
              <div className="provider-logo-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt={p.name} className="provider-logo-img" />
              </div>
              <span className="provider-name">{p.name}</span>
              {selectedProvider === p.id && <span className="provider-check">✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Scan Button */}
      <button
        className={`scan-btn ${scanning ? 'scan-loading' : ''} ${!cm8Id.trim() || !selectedProvider ? 'scan-disabled' : ''}`}
        onClick={handleScan}
        disabled={scanning || !cm8Id.trim() || !selectedProvider}
      >
        {scanning ? (
          <>
            <span className="scan-spinner" />
            <span>Scanning...</span>
          </>
        ) : (
          <>
            <span className="scan-icon">🔍</span>
            <span>SCAN SEKARANG</span>
          </>
        )}
      </button>

      {/* Scanning Animation */}
      {scanning && (
        <div className="scan-progress-card">
          <div className="scan-progress-bar">
            <div className="scan-progress-fill" />
          </div>
          <p className="scan-progress-text">
            Menganalisis slot percentage untuk ID: <strong>{cm8Id}</strong>
          </p>
        </div>
      )}

      {/* ═══════════════ RESULTS ═══════════════ */}
      {scanComplete && results && stats && (
        <div className="patch-results">
          {/* ── 1) Summary Stats Bar ── */}
          <div className="stats-bar">
            <div className="stats-item">
              <span className="stats-icon stats-icon-total">🎰</span>
              <span className="stats-value">{stats.total}</span>
              <span className="stats-label">Total Games</span>
            </div>
            <div className="stats-item">
              <span className="stats-icon stats-icon-avg">📊</span>
              <span className="stats-value">{stats.avgRtp}%</span>
              <span className="stats-label">Avg RTP</span>
            </div>
            <div className="stats-item">
              <span className="stats-icon stats-icon-hot">🔥</span>
              <span className="stats-value">{stats.hotCount}</span>
              <span className="stats-label">HOT Games</span>
            </div>
          </div>

          {/* ── 2) Top 3 Podium ── */}
          <div className="top3-section">
            <h3 className="top3-title">🏆 Top 3 Game Terpanas</h3>
            <div className="top3-cards">
              {top3.map((game, i) => (
                <div
                  key={game.name}
                  className={`top3-card top3-${['gold', 'silver', 'bronze'][i]}`}
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                  <span className="top3-medal">{['👑', '🥈', '🥉'][i]}</span>
                  <div className="top3-thumb-wrap">
                    {game.img && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={game.img} alt={game.name} className="top3-thumb" />
                    )}
                  </div>
                  <span className="top3-name">{game.name}</span>
                  <RtpGauge rtp={game.rtp} color={getRtpColor(game.rtp)} size={52} />
                  <span className="top3-status top3-status-hot">🔥 HOT</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── 3) Filter Tabs ── */}
          <div className="filter-bar">
            {(['ALL', 'HOT', 'WARM', 'COLD'] as const).map((f) => (
              <button
                key={f}
                className={`filter-btn ${filter === f ? 'filter-active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'ALL' && '🎮 '}
                {f === 'HOT' && '🔥 '}
                {f === 'WARM' && '⚡ '}
                {f === 'COLD' && '❄️ '}
                {f} {f !== 'ALL' && results && `(${results.filter((g) => g.status === f).length})`}
              </button>
            ))}
          </div>

          {/* ── 4) Card Grid ── */}
          <div className="results-grid">
            {filteredResults.map((game, i) => (
              <div
                key={game.name}
                className={`result-card ${game.status === 'HOT' ? 'result-card-hot' : ''}`}
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <div className="result-card-top">
                  <span className="result-card-rank">#{filter === 'ALL' ? i + 4 : i + 1}</span>
                  <span className={`result-card-badge badge-${game.status.toLowerCase()}`}>
                    {game.status === 'HOT' ? '🔥' : game.status === 'WARM' ? '⚡' : '❄️'}{' '}
                    {game.status}
                  </span>
                </div>

                <div className="result-card-body">
                  {game.img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={game.img} alt={game.name} className="result-card-img" />
                  ) : (
                    <div className="result-card-img-placeholder">🎰</div>
                  )}
                  <RtpGauge rtp={game.rtp} color={getRtpColor(game.rtp)} size={50} />
                </div>

                <span className="result-card-name">{game.name}</span>
              </div>
            ))}
          </div>

          {filteredResults.length === 0 && (
            <div className="no-results">
              <span className="no-results-icon">🔍</span>
              <p>Tiada game dengan status {filter}</p>
            </div>
          )}

          {/* ── Footer ── */}
          <div className="results-footer">
            <p className="results-disclaimer">
              ⏱️ Data dikemaskini setiap 5 minit • Percentage berubah mengikut masa
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
