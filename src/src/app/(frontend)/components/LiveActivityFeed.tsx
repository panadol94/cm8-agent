'use client'

import { useEffect, useMemo, useState } from 'react'

type ActivityEvent = {
  id: string
  user: string
  text: string
  tsMs: number
  source: 'real' | 'sim'
}

function timeAgo(tsMs: number): string {
  const diff = Math.max(0, Date.now() - tsMs)
  const min = Math.floor(diff / 60_000)
  if (min < 1) return 'baru sahaja'
  if (min < 60) return `${min} min lalu`
  const hr = Math.floor(min / 60)
  return `${hr} jam lalu`
}

export default function LiveActivityFeed() {
  const [events, setEvents] = useState<ActivityEvent[]>([])

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const res = await fetch('/api/live-activity', { cache: 'no-store' })
        const data = await res.json()
        if (mounted && Array.isArray(data?.events)) {
          setEvents(data.events)
        }
      } catch {
        // ignore
      }
    }

    load()
    const t = setInterval(load, 30_000)
    return () => {
      mounted = false
      clearInterval(t)
    }
  }, [])

  const visible = useMemo(() => events.slice(0, 8), [events])

  return (
    <section className="live-feed" aria-label="Aktiviti komuniti">
      <div className="live-feed-header">
        <h3>💬 Aktiviti Komuniti</h3>
        <span className="live-feed-badge">LIVE</span>
      </div>
      <p className="live-feed-sub">Aktiviti pengguna terkini di ekosistem CM8</p>

      <div className="live-feed-list">
        {visible.map((e, idx) => (
          <div key={`${e.id}-${idx}`} className={`live-feed-item ${idx % 2 ? 'alt' : ''}`}>
            <div className="live-feed-bubble">
              <div className="live-feed-top">
                <strong>{e.user}</strong>
                <span>{timeAgo(e.tsMs)}</span>
              </div>
              <div className="live-feed-text">{e.text}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
