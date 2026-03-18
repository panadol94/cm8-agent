'use client'

export default function ScratchAdminDashboard() {
  const stats = {
    totalParticipants: 127,
    winners: 32,
    winRate: 60,
    slotsLeft: 18,
  }

  const participants = [
    { id: 1, playerId: 'CM8821', whatsapp: '+6011-XXX-821', status: 'verified', prize: 'RM20' },
    { id: 2, playerId: 'CM8743', whatsapp: '+6012-XXX-743', status: 'verified', prize: 'RM20' },
    { id: 3, playerId: 'CM9901', whatsapp: '+6013-XXX-901', status: 'pending', prize: 'RM20' },
    { id: 4, playerId: 'CM9551', whatsapp: '+6014-XXX-551', status: 'pending', prize: 'RM20' },
  ]

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>⚙️ CM8 Scratch Event - Admin Panel</h1>
        <div className="event-toggle">
          <span>Event Status</span>
          <div className="toggle-switch active"></div>
        </div>
      </div>

      <div className="admin-grid">
        <div className="admin-card">
          <h2>📝 Event Setup</h2>
          <div className="field"><label>Event Title</label><input type="text" defaultValue="CM8 Scratch Event" /></div>
          <div className="field"><label>Start Time</label><input type="text" defaultValue="2026-03-18 13:00:00" /></div>
          <div className="field"><label>End Time</label><input type="text" defaultValue="2026-03-18 17:00:00" /></div>
          <div className="field"><label>Prize (RM)</label><input type="text" defaultValue="20" /></div>
          <div className="field"><label>Winner Limit</label><input type="text" defaultValue="50" /></div>
          <div className="field"><label>Winrate (%)</label><input type="text" defaultValue="60" /></div>
          <div className="field"><label>Promo Code</label><input type="text" defaultValue="CM8BEST" /></div>
        </div>

        <div className="admin-card">
          <h2>📊 Live Statistics</h2>
          <div className="stats-grid">
            <div className="stat-box"><div className="stat-value">{stats.totalParticipants}</div><div className="stat-label">Total Participants</div></div>
            <div className="stat-box green"><div className="stat-value">{stats.winners}</div><div className="stat-label">Winners (of 50)</div></div>
            <div className="stat-box"><div className="stat-value">{stats.winRate}%</div><div className="stat-label">Winrate</div></div>
            <div className="stat-box red"><div className="stat-value">{stats.slotsLeft}</div><div className="stat-label">Slots Left</div></div>
          </div>
          <div className="progress-section">
            <div className="progress-label"><span>Winner Progress</span><span>{stats.winners}/50</span></div>
            <div className="progress-bar"><div className="progress-fill" style={{width: '64%'}}></div></div>
          </div>
        </div>

        <div className="admin-card">
          <h2>✅ Verification Queue</h2>
          <div className="queue-list">
            {participants.map(p => (
              <div key={p.id} className="queue-item">
                <div className="queue-info">👤 {p.playerId} - {p.prize}</div>
                <span className={`queue-status ${p.status}`}>{p.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card">
          <h2>💬 WhatsApp Claim Management</h2>
          <div className="queue-list">
            {participants.filter(p => p.status === 'verified').map(p => (
              <div key={p.id} className="queue-item">
                <div className="queue-info">💬 {p.whatsapp} - Sent</div>
                <span className="queue-status verified">Delivered</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding: 20px; background: #1a1a1a; border-radius: 12px; }
        .admin-header h1 { color: #d4af37; font-size: 24px; }
        .event-toggle { display: flex; align-items: center; gap: 10px; }
        .event-toggle span { color: #888; }
        .toggle-switch { width: 50px; height: 26px; background: #333; border-radius: 13px; position: relative; cursor: pointer; }
        .toggle-switch.active { background: #00aa00; }
        .toggle-switch::after { content: ''; position: absolute; top: 3px; left: 3px; width: 20px; height: 20px; background: #fff; border-radius: 50%; transition: transform 0.3s; }
        .toggle-switch.active::after { transform: translateX(24px); }
        .admin-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        .admin-card { background: #111; border-radius: 12px; padding: 20px; border: 1px solid #222; }
        .admin-card h2 { color: #666; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }
        .field { margin-bottom: 12px; }
        .field label { display: block; font-size: 11px; color: #555; margin-bottom: 5px; text-transform: uppercase; }
        .field input { width: 100%; padding: 10px; background: #0a0a0a; border: 1px solid #222; border-radius: 6px; color: #fff; font-size: 13px; }
        .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 20px; }
        .stat-box { background: #0a0a0a; border-radius: 8px; padding: 15px; text-align: center; border: 1px solid #222; }
        .stat-value { font-size: 24px; font-weight: 700; color: #d4af37; }
        .stat-value.green { color: #00aa00; }
        .stat-value.red { color: #ff4444; }
        .stat-label { font-size: 10px; color: #555; text-transform: uppercase; margin-top: 4px; }
        .progress-section { margin-top: 15px; }
        .progress-label { display: flex; justify-content: space-between; font-size: 12px; color: #555; margin-bottom: 8px; }
        .progress-bar { height: 8px; background: #1a1a1a; border-radius: 4px; overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #d4af37, #f4e4a6); border-radius: 4px; }
        .queue-list { background: #0a0a0a; border-radius: 8px; padding: 10px; }
        .queue-item { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #1a1a1a; }
        .queue-item:last-child { border-bottom: none; }
        .queue-info { font-size: 12px; color: #888; }
        .queue-status { font-size: 10px; padding: 4px 10px; border-radius: 10px; font-weight: 600; }
        .queue-status.pending { background: #333; color: #888; }
        .queue-status.verified { background: #00aa00; color: #fff; }
      `}</style>
    </div>
  )
}
