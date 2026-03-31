'use client'

import React, { useState, useEffect, useCallback } from 'react'

// ─── Types ───
interface UserData {
  id: number
  phone: string
  cm8PlayerId: string
  points: number
  currentStreak: number
  lastCheckinDate: string | null
  referralCode?: string
  referralCount?: number
}

interface CheckinRecord {
  date: string
  streakDay: number
  pointsEarned: number
}

interface MeResponse {
  user: UserData
  checkins: CheckinRecord[]
  unusedVouchers: number
}

// ─── Milestone Config ───
const MILESTONES = [
  { day: 1, points: 1, label: 'Hari 1' },
  { day: 3, points: 5, label: 'Hari 3' },
  { day: 7, points: 15, label: 'Hari 7' },
  { day: 15, points: 40, label: 'Hari 15' },
  { day: 30, points: 120, label: 'Hari 30' },
]

export default function CheckinPage() {
  const [view, setView] = useState<'loading' | 'auth' | 'events' | 'dashboard'>('loading')
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [user, setUser] = useState<UserData | null>(null)
  const [checkins, setCheckins] = useState<CheckinRecord[]>([])
  const [unusedVouchers, setUnusedVouchers] = useState(0)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [checkedInToday, setCheckedInToday] = useState(false)

  // Form states
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [cm8PlayerId, setCm8PlayerId] = useState('')
  const [refCode, setRefCode] = useState('')
  const [shareMessage, setShareMessage] = useState('')

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const data: MeResponse = await res.json()
        setUser(data.user)
        setCheckins(data.checkins)
        setUnusedVouchers(data.unusedVouchers)
        
        // Check if already checked in today
        const today = new Date().toISOString().split('T')[0]
        const todayCheckin = data.checkins.find(c => {
          const d = new Date(c.date).toISOString().split('T')[0]
          return d === today
        })
        setCheckedInToday(!!todayCheckin)
        setView('events')
      } else {
        setView('auth')
      }
    } catch {
      setView('auth')
    }
  }, [])

  useEffect(() => {
    fetchUser()
    // Extract referral code from URL
    const params = new URLSearchParams(window.location.search)
    const ref = params.get('ref')
    if (ref) {
      setRefCode(ref.toUpperCase())
      setAuthMode('register')
    }
  }, [fetchUser])

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password, cm8PlayerId, referralCode: refCode || undefined }),
      })
      const data = await res.json()
      if (res.ok) {
        showMessage('success', data.message)
        setAuthMode('login')
      } else {
        showMessage('error', data.error)
      }
    } catch {
      showMessage('error', 'Ralat rangkaian. Sila cuba lagi.')
    }
    setLoading(false)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      })
      const data = await res.json()
      if (res.ok) {
        showMessage('success', data.message)
        await fetchUser()
      } else {
        showMessage('error', data.error)
      }
    } catch {
      showMessage('error', 'Ralat rangkaian. Sila cuba lagi.')
    }
    setLoading(false)
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    setView('auth')
    setPhone('')
    setPassword('')
    setCm8PlayerId('')
  }

  const handleCheckin = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/checkin', { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        showMessage('success', data.message)
        setCheckedInToday(true)
        await fetchUser()
      } else {
        showMessage('error', data.error)
        if (data.alreadyCheckedIn) setCheckedInToday(true)
      }
    } catch {
      showMessage('error', 'Ralat rangkaian. Sila cuba lagi.')
    }
    setLoading(false)
  }

  const [showFbModal, setShowFbModal] = useState(false)

  const handleClaimSpin = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/checkin/claim-spin', { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        showMessage('success', data.message)
        setShowFbModal(false)
        await fetchUser()
      } else {
        showMessage('error', data.error)
      }
    } catch {
      showMessage('error', 'Ralat rangkaian. Sila cuba lagi.')
    }
    setLoading(false)
  }

  const handleShare = async () => {
    if (!user?.referralCode) return
    const link = `https://www.cm8vvip.com/checkin?ref=${user.referralCode}`
    const text = `🏆 Jom check-in harian di CM8 VVIP!\nDaftar & kumpul mata untuk spin Lucky Wheel percuma!\n\n👉 ${link}`
    
    if (navigator.share) {
      try {
        await navigator.share({ title: 'CM8 VVIP Check-in Harian', text, url: link })
      } catch {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(text)
      setShareMessage('Link disalin! Kongsikan kepada kawan anda.')
      setTimeout(() => setShareMessage(''), 3000)
    }
  }

  // ─── Loading ───
  if (view === 'loading') {
    return (
      <div style={styles.pageWrap}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>Memuatkan...</p>
        </div>
      </div>
    )
  }

  // ─── Auth View ───
  if (view === 'auth') {
    return (
      <div style={styles.pageWrap}>
        <div style={styles.container}>
          <div style={styles.headerSection}>
            <div style={styles.logo}>🏆</div>
            <h1 style={styles.title}>Daftar cm8vvip.com</h1>
            <p style={styles.subtitle}>Untuk sertai event: Daily Check-in, Lucky Wheel & Lucky Pick</p>
          </div>

          {message && (
            <div style={{
              ...styles.messageBox,
              ...(message.type === 'error' ? styles.errorBox : styles.successBox),
            }}>
              {message.text}
            </div>
          )}

          <div style={styles.card}>
            <div style={styles.tabRow}>
              <button
                style={authMode === 'login' ? styles.tabActive : styles.tab}
                onClick={() => setAuthMode('login')}
              >
                Log Masuk
              </button>
              <button
                style={authMode === 'register' ? styles.tabActive : styles.tab}
                onClick={() => setAuthMode('register')}
              >
                Daftar Baru
              </button>
            </div>

            {authMode === 'login' ? (
              <form onSubmit={handleLogin} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>📱 Nombor Telefon</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="0123456789"
                    style={styles.input}
                    required
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>🔒 Kata Laluan</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••"
                    style={styles.input}
                    required
                  />
                </div>
                <button type="submit" style={styles.btnPrimary} disabled={loading}>
                  {loading ? 'Memproses...' : 'Log Masuk'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>📱 Nombor Telefon (WhatsApp)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="0123456789"
                    style={styles.input}
                    required
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>🔒 Kata Laluan</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Min 6 aksara"
                    style={styles.input}
                    required
                    minLength={6}
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>🎮 CM8 Player ID</label>
                  <input
                    type="text"
                    value={cm8PlayerId}
                    onChange={e => setCm8PlayerId(e.target.value)}
                    placeholder="Masukkan Player ID anda"
                    style={styles.input}
                    required
                  />
                  <a
                    href="https://cm8ong.com/r/luckyhorse879"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block', marginTop: '8px',
                      color: '#ffd700', fontSize: '12px', fontWeight: 600,
                      textDecoration: 'underline',
                    }}
                  >
                    ❓ Belum ada ID CM8? Daftar di sini →
                  </a>
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>🔗 Kod Rujukan (jika ada)</label>
                  <input
                    type="text"
                    value={refCode}
                    onChange={e => setRefCode(e.target.value.toUpperCase())}
                    placeholder="Masukkan kod rujukan kawan"
                    style={styles.input}
                    maxLength={8}
                  />
                </div>
                <button type="submit" style={styles.btnPrimary} disabled={loading}>
                  {loading ? 'Memproses...' : 'Daftar Akaun'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    )
  }


  // --- Events Hub View ---
  if (view === 'events') {
    const eventsData = [
      { href: 'dashboard', icon: '\uD83C\uDFC6', title: 'Check-in Harian',
        desc: 'Kumpul mata & tebus spin percuma',
        bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        border: 'rgba(255,215,0,0.25)', color: '#FFD700', arrow: 'rgba(255,215,0,0.6)' },
      { href: '/lucky-pick', icon: '\uD83C\uDCCF', title: 'Lucky Pick',
        desc: 'Pilih kad & menang sehingga RM388!',
        bg: 'linear-gradient(135deg, #0a2e1a 0%, #1a3a2e 100%)',
        border: 'rgba(76,175,80,0.25)', color: '#4CAF50', arrow: 'rgba(76,175,80,0.6)' },
    ]
    return (
      <div style={styles.pageWrap}>
        <div style={styles.container}>
          <div style={styles.headerSection}>
            <div style={styles.logo}>{'\uD83C\uDFC6'}</div>
            <h1 style={styles.title}>Event & Ganjaran</h1>
            <p style={styles.subtitle}>Selamat datang, {user?.cm8PlayerId}!</p>
            <button onClick={handleLogout} style={styles.logoutBtn}>Log Keluar</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '14px', padding: '0 4px', marginTop: '8px' }}>
            {eventsData.map((ev, i) => (
              <a
                key={i}
                href={ev.href === 'dashboard' ? '#' : ev.href}
                onClick={ev.href === 'dashboard' ? (e: React.MouseEvent) => { e.preventDefault(); setView('dashboard'); } : undefined}
                style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '18px 20px', borderRadius: '16px',
                  background: ev.bg, border: `1px solid ${ev.border}`,
                  textDecoration: 'none', color: '#fff',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                }}
              >
                <span style={{ fontSize: '36px', lineHeight: 1 }}>{ev.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: ev.color, marginBottom: '4px' }}>{ev.title}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>{ev.desc}</div>
                </div>
                <span style={{ fontSize: '20px', color: ev.arrow }}>{'\u203A'}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ─── Dashboard View ───
  const currentStreak = user?.currentStreak || 0
  const totalPoints = user?.points || 0
  const canClaimSpin = totalPoints >= 10

  return (
    <div style={styles.pageWrap}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.headerSection}>
          <div style={styles.logo}>🏆</div>
          <h1 style={styles.title}>Daftar Masuk Harian</h1>
          <p style={styles.subtitle}>Selamat datang, {user?.cm8PlayerId}!</p>
          <button onClick={handleLogout} style={styles.logoutBtn}>Log Keluar</button>
        </div>

        {message && (
          <div style={{
            ...styles.messageBox,
            ...(message.type === 'error' ? styles.errorBox : styles.successBox),
          }}>
            {message.text}
          </div>
        )}

        {/* Stats Row */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={styles.statEmoji}>🔥</div>
            <div style={styles.statValue}>{currentStreak}</div>
            <div style={styles.statLabel}>Hari Berturut</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statEmoji}>⭐</div>
            <div style={styles.statValue}>{totalPoints}</div>
            <div style={styles.statLabel}>Mata</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statEmoji}>🎡</div>
            <div style={styles.statValue}>{unusedVouchers}</div>
            <div style={styles.statLabel}>Voucher Spin</div>
          </div>
        </div>

        {/* Check-in Button */}
        <div style={styles.card}>
          <button
            onClick={handleCheckin}
            disabled={loading || checkedInToday}
            style={checkedInToday ? styles.btnCheckedIn : styles.btnCheckin}
          >
            {checkedInToday ? '✅ Sudah Daftar Masuk Hari Ini' :
             loading ? '⏳ Memproses...' : '👆 Daftar Masuk Sekarang!'}
          </button>
          {checkedInToday && (
            <p style={styles.checkinNote}>Kembali esok untuk teruskan streak anda! 💪</p>
          )}
        </div>

        {/* 30-Day Calendar */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>📅 Kalendar 30 Hari</h2>
          <div style={styles.calendarGrid}>
            {Array.from({ length: 30 }, (_, i) => {
              const day = i + 1
              const isCompleted = day <= currentStreak
              const isMilestone = MILESTONES.some(m => m.day === day)
              const milestonePoints = MILESTONES.find(m => m.day === day)?.points
              const isToday = day === currentStreak + 1 && !checkedInToday
              const isTodayDone = day === currentStreak && checkedInToday
              
              return (
                <div
                  key={day}
                  style={{
                    ...styles.calendarDay,
                    ...(isCompleted ? styles.calendarDayCompleted : {}),
                    ...(isMilestone ? styles.calendarDayMilestone : {}),
                    ...(isToday ? styles.calendarDayToday : {}),
                    ...(isTodayDone ? styles.calendarDayTodayDone : {}),
                  }}
                >
                  <span style={styles.dayNumber}>{day}</span>
                  {isMilestone && (
                    <span style={styles.milestonePoints}>+{milestonePoints}</span>
                  )}
                  {isCompleted && <span style={styles.checkMark}>✓</span>}
                </div>
              )
            })}
          </div>
        </div>

        {/* Milestone Progress */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>🎯 Pencapaian Milestone</h2>
          <div style={styles.milestoneList}>
            {MILESTONES.map(m => {
              const reached = currentStreak >= m.day
              return (
                <div key={m.day} style={{
                  ...styles.milestoneItem,
                  ...(reached ? styles.milestoneReached : {}),
                }}>
                  <div style={styles.milestoneIcon}>
                    {reached ? '🏅' : '🔒'}
                  </div>
                  <div style={styles.milestoneInfo}>
                    <div style={styles.milestoneName}>{m.label}</div>
                    <div style={styles.milestoneDetail}>+{m.points} mata</div>
                  </div>
                  <div style={{
                    ...styles.milestoneStatus,
                    color: reached ? '#4ade80' : '#9ca3af',
                  }}>
                    {reached ? 'Dicapai ✓' : `${m.day - currentStreak} hari lagi`}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Claim Spin Section */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>🎡 Tebus Spin Lucky Wheel</h2>
          <p style={styles.claimDescription}>
            Setiap 10 mata boleh ditukar dengan 1 voucher spin Lucky Wheel!
          </p>
          <div style={styles.claimRow}>
            <div style={styles.claimInfo}>
              <span style={styles.claimPoints}>{totalPoints} / 10 mata</span>
              <div style={styles.progressBar}>
                <div style={{
                  ...styles.progressFill,
                  width: `${Math.min((totalPoints / 10) * 100, 100)}%`,
                }} />
              </div>
            </div>
            <button
              onClick={() => setShowFbModal(true)}
              disabled={!canClaimSpin || loading}
              style={canClaimSpin ? styles.btnClaim : styles.btnClaimDisabled}
            >
              {loading ? '⏳' : '🎁'} Tebus Spin
            </button>
          </div>
        </div>

        {/* Facebook Follow Modal */}
        {showFbModal && (
          <div style={styles.modalOverlay} onClick={() => setShowFbModal(false)}>
            <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
              <h3 style={styles.modalTitle}>📱 Follow Facebook CM8 VVIP</h3>
              <p style={styles.modalDesc}>
                Sila follow page Facebook CM8 VVIP terlebih dahulu sebelum menebus voucher spin.
              </p>
              <a
                href="https://www.facebook.com/share/1AHvew4obm/"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.btnFacebook}
              >
                👍 Follow Facebook CM8 VVIP
              </a>
              <button
                onClick={handleClaimSpin}
                disabled={loading}
                style={styles.btnConfirmClaim}
              >
                {loading ? '⏳ Memproses...' : '✅ Saya Sudah Follow — Tebus Spin'}
              </button>
              <button
                onClick={() => setShowFbModal(false)}
                style={styles.btnCancelModal}
              >
                Batal
              </button>
            </div>
          </div>
        )}

        {/* Referral Share */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>📤 Kongsi & Dapat Mata</h2>
          <p style={styles.claimDescription}>
            Kongsi link rujukan anda! Setiap kawan yang daftar, anda dapat <strong style={{color:'#ffd700'}}>+1 mata</strong>.
          </p>
          <div style={styles.referralCodeBox}>
            <span style={styles.referralLabel}>Kod Rujukan Anda:</span>
            <span style={styles.referralCode}>{user?.referralCode || '...'}</span>
          </div>
          <div style={styles.referralStats}>
            <span style={{color:'#9ca3af', fontSize: 13}}>👥 Jumlah rujukan: <strong style={{color:'#ffd700'}}>{user?.referralCount || 0}</strong> orang</span>
          </div>
          <button onClick={handleShare} style={styles.btnShare}>
            📤 Kongsi Link Rujukan
          </button>
          {shareMessage && (
            <p style={{...styles.checkinNote, color: '#4ade80', marginTop: 10}}>{shareMessage}</p>
          )}
        </div>

        {/* Recent History */}
        {checkins.length > 0 && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>📋 Sejarah Terkini</h2>
            <div style={styles.historyList}>
              {checkins.slice(0, 10).map((c, i) => (
                <div key={i} style={styles.historyItem}>
                  <span style={styles.historyDate}>
                    {new Date(c.date).toLocaleDateString('ms-MY', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </span>
                  <span style={styles.historyStreak}>Hari {c.streakDay}</span>
                  <span style={{
                    ...styles.historyPoints,
                    color: c.pointsEarned > 0 ? '#ffd700' : '#6b7280',
                  }}>
                    {c.pointsEarned > 0 ? `+${c.pointsEarned}` : '0'} mata
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>ℹ️ Cara Bermain</h2>
          <div style={styles.infoList}>
            <p>1. 📱 Daftar akaun dengan nombor telefon & CM8 Player ID</p>
            <p>2. 👆 Daftar masuk setiap hari untuk kumpul streak</p>
            <p>3. ⭐ Capai milestone (Hari 1, 3, 7, 15, 30) untuk dapat mata</p>
            <p>4. 🎡 Tukar 10 mata = 1 spin Lucky Wheel percuma</p>
            <p>5. 📤 Kongsi link rujukan — setiap kawan daftar, anda dapat +1 mata!</p>
            <p>6. ⚠️ Jangan terlepas 1 hari pun — streak reset ke 0! (Mata kekal)</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Inline Styles (dark red/gold premium theme) ───
const styles: Record<string, React.CSSProperties> = {
  pageWrap: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #1a0505 0%, #2d0a0a 50%, #1a0505 100%)',
    padding: '20px 12px 100px',
  },
  container: {
    maxWidth: 480,
    margin: '0 auto',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
  },
  spinner: {
    width: 40,
    height: 40,
    border: '3px solid rgba(255,215,0,0.3)',
    borderTopColor: '#ffd700',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  loadingText: {
    color: '#ffd700',
    marginTop: 16,
    fontSize: 16,
  },

  // Header
  headerSection: {
    textAlign: 'center' as const,
    marginBottom: 24,
    position: 'relative' as const,
  },
  logo: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 800,
    color: '#ffd700',
    margin: '0 0 4px',
    textShadow: '0 2px 8px rgba(255,215,0,0.3)',
  },
  subtitle: {
    color: '#d4a574',
    fontSize: 14,
    margin: 0,
  },
  logoutBtn: {
    position: 'absolute' as const,
    top: 0,
    right: 0,
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,215,0,0.3)',
    color: '#d4a574',
    padding: '6px 12px',
    borderRadius: 8,
    fontSize: 12,
    cursor: 'pointer',
  },

  // Messages
  messageBox: {
    padding: '12px 16px',
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 14,
    textAlign: 'center' as const,
    fontWeight: 500,
  },
  successBox: {
    background: 'rgba(74,222,128,0.15)',
    border: '1px solid rgba(74,222,128,0.4)',
    color: '#4ade80',
  },
  errorBox: {
    background: 'rgba(239,68,68,0.15)',
    border: '1px solid rgba(239,68,68,0.4)',
    color: '#ef4444',
  },

  // Cards
  card: {
    background: 'linear-gradient(145deg, rgba(45,10,10,0.9) 0%, rgba(26,5,5,0.95) 100%)',
    border: '1px solid rgba(255,215,0,0.15)',
    borderRadius: 16,
    padding: '20px 16px',
    marginBottom: 16,
    backdropFilter: 'blur(10px)',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: '#ffd700',
    margin: '0 0 16px',
  },

  // Tabs
  tabRow: {
    display: 'flex',
    gap: 0,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    border: '1px solid rgba(255,215,0,0.2)',
  },
  tab: {
    flex: 1,
    padding: '12px',
    background: 'transparent',
    border: 'none',
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  tabActive: {
    flex: 1,
    padding: '12px',
    background: 'linear-gradient(135deg, #e63520 0%, #c91d0e 100%)',
    border: 'none',
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },

  // Form
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 16,
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 6,
  },
  label: {
    color: '#d4a574',
    fontSize: 13,
    fontWeight: 600,
  },
  input: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,215,0,0.2)',
    borderRadius: 10,
    padding: '12px 14px',
    color: '#fff',
    fontSize: 15,
    outline: 'none',
    transition: 'border-color 0.2s',
  },

  // Buttons
  btnPrimary: {
    background: 'linear-gradient(135deg, #ffd700 0%, #ff8c00 100%)',
    border: 'none',
    borderRadius: 12,
    padding: '14px',
    color: '#1a0505',
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: 4,
    boxShadow: '0 4px 15px rgba(255,215,0,0.3)',
  },
  btnCheckin: {
    width: '100%',
    background: 'linear-gradient(135deg, #e63520 0%, #ff6b2c 100%)',
    border: 'none',
    borderRadius: 14,
    padding: '18px',
    color: '#fff',
    fontSize: 18,
    fontWeight: 800,
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(230,53,32,0.4)',
    transition: 'transform 0.2s',
  },
  btnCheckedIn: {
    width: '100%',
    background: 'rgba(74,222,128,0.15)',
    border: '1px solid rgba(74,222,128,0.4)',
    borderRadius: 14,
    padding: '18px',
    color: '#4ade80',
    fontSize: 16,
    fontWeight: 700,
    cursor: 'default',
  },
  checkinNote: {
    textAlign: 'center' as const,
    color: '#9ca3af',
    fontSize: 13,
    marginTop: 12,
    marginBottom: 0,
  },

  // Stats
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    background: 'linear-gradient(145deg, rgba(45,10,10,0.9) 0%, rgba(26,5,5,0.95) 100%)',
    border: '1px solid rgba(255,215,0,0.15)',
    borderRadius: 14,
    padding: '14px 8px',
    textAlign: 'center' as const,
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 800,
    color: '#ffd700',
  },
  statLabel: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 2,
  },

  // Calendar
  calendarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: 6,
  },
  calendarDay: {
    position: 'relative' as const,
    aspectRatio: '1',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    fontSize: 12,
    color: '#6b7280',
  },
  calendarDayCompleted: {
    background: 'linear-gradient(135deg, rgba(230,53,32,0.3) 0%, rgba(201,29,14,0.2) 100%)',
    border: '1px solid rgba(230,53,32,0.5)',
    color: '#fff',
  },
  calendarDayMilestone: {
    border: '1px solid rgba(255,215,0,0.5)',
    boxShadow: '0 0 8px rgba(255,215,0,0.15)',
  },
  calendarDayToday: {
    border: '2px solid rgba(255,215,0,0.6)',
    background: 'rgba(255,215,0,0.08)',
    animation: 'pulse 2s infinite',
  },
  calendarDayTodayDone: {
    background: 'linear-gradient(135deg, rgba(74,222,128,0.2) 0%, rgba(34,197,94,0.15) 100%)',
    border: '1px solid rgba(74,222,128,0.5)',
    color: '#4ade80',
  },
  dayNumber: {
    fontWeight: 700,
    fontSize: 13,
  },
  milestonePoints: {
    fontSize: 8,
    color: '#ffd700',
    fontWeight: 700,
  },
  checkMark: {
    position: 'absolute' as const,
    top: 2,
    right: 3,
    fontSize: 8,
    color: '#4ade80',
  },

  // Milestones
  milestoneList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 10,
  },
  milestoneItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 12px',
    borderRadius: 10,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  milestoneReached: {
    background: 'rgba(255,215,0,0.08)',
    border: '1px solid rgba(255,215,0,0.2)',
  },
  milestoneIcon: {
    fontSize: 24,
  },
  milestoneInfo: {
    flex: 1,
  },
  milestoneName: {
    color: '#fff',
    fontWeight: 600,
    fontSize: 14,
  },
  milestoneDetail: {
    color: '#ffd700',
    fontSize: 12,
  },
  milestoneStatus: {
    fontSize: 12,
    fontWeight: 600,
  },

  // Claim Spin
  claimDescription: {
    color: '#9ca3af',
    fontSize: 13,
    marginBottom: 16,
    marginTop: 0,
  },
  claimRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  claimInfo: {
    flex: 1,
  },
  claimPoints: {
    color: '#ffd700',
    fontSize: 14,
    fontWeight: 600,
  },
  progressBar: {
    height: 6,
    background: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    marginTop: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #ffd700 0%, #ff8c00 100%)',
    borderRadius: 3,
    transition: 'width 0.5s ease',
  },
  btnClaim: {
    background: 'linear-gradient(135deg, #ffd700 0%, #ff8c00 100%)',
    border: 'none',
    borderRadius: 10,
    padding: '10px 16px',
    color: '#1a0505',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
    boxShadow: '0 2px 10px rgba(255,215,0,0.3)',
  },
  btnClaimDisabled: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: '10px 16px',
    color: '#6b7280',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'not-allowed',
    whiteSpace: 'nowrap' as const,
  },

  // History
  historyList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 8,
  },
  historyItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 12px',
    borderRadius: 8,
    background: 'rgba(255,255,255,0.03)',
  },
  historyDate: {
    color: '#9ca3af',
    fontSize: 13,
  },
  historyStreak: {
    color: '#d4a574',
    fontSize: 13,
    fontWeight: 600,
  },
  historyPoints: {
    fontSize: 13,
    fontWeight: 700,
  },

  // Info
  infoList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 8,
    color: '#9ca3af',
    fontSize: 13,
    lineHeight: 1.6,
  },

  // Referral
  referralCodeBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'rgba(255,215,0,0.08)',
    border: '1px solid rgba(255,215,0,0.25)',
    borderRadius: 12,
    padding: '12px 16px',
    marginBottom: 10,
  },
  referralLabel: {
    color: '#9ca3af',
    fontSize: 13,
  },
  referralCode: {
    color: '#ffd700',
    fontSize: 18,
    fontWeight: 800,
    letterSpacing: '2px',
    fontFamily: 'monospace',
  },
  referralStats: {
    marginBottom: 12,
  },
  btnShare: {
    width: '100%',
    background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)',
    border: 'none',
    borderRadius: 12,
    padding: '14px',
    color: '#fff',
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(37,211,102,0.3)',
  },

  // Modal
  modalOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '20px',
  },
  modalContent: {
    background: 'linear-gradient(145deg, #2d0a0a 0%, #1a0505 100%)',
    border: '1px solid rgba(255,215,0,0.3)',
    borderRadius: 20,
    padding: '28px 24px',
    maxWidth: 400,
    width: '100%',
    textAlign: 'center' as const,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 800,
    color: '#ffd700',
    margin: '0 0 12px',
  },
  modalDesc: {
    color: '#d4a574',
    fontSize: 14,
    lineHeight: 1.5,
    margin: '0 0 20px',
  },
  btnFacebook: {
    display: 'block',
    width: '100%',
    background: 'linear-gradient(135deg, #1877f2 0%, #0d5bc4 100%)',
    border: 'none',
    borderRadius: 12,
    padding: '14px',
    color: '#fff',
    fontSize: 15,
    fontWeight: 700,
    textDecoration: 'none' as const,
    textAlign: 'center' as const,
    marginBottom: 12,
    boxShadow: '0 4px 15px rgba(24,119,242,0.3)',
  },
  btnConfirmClaim: {
    width: '100%',
    background: 'linear-gradient(135deg, #ffd700 0%, #ff8c00 100%)',
    border: 'none',
    borderRadius: 12,
    padding: '14px',
    color: '#1a0505',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    marginBottom: 10,
    boxShadow: '0 4px 15px rgba(255,215,0,0.3)',
  },
  btnCancelModal: {
    width: '100%',
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: '12px',
    color: '#9ca3af',
    fontSize: 14,
    cursor: 'pointer',
  },
}
