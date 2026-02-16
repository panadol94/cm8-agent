'use client'

import { useEffect, useRef, useState } from 'react'

/* ── Animated counter that counts up when visible ── */
function useCountUp(end: number, duration = 2000, prefix = '', suffix = '') {
  const [display, setDisplay] = useState(`${prefix}0${suffix}`)
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const start = performance.now()

          const animate = (now: number) => {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            // Ease-out curve for natural feel
            const eased = 1 - Math.pow(1 - progress, 3)
            const current = Math.round(eased * end)

            if (end >= 1000000) {
              // Format as M (millions) — e.g. 2.3M
              setDisplay(`${prefix}${(current / 1000000).toFixed(1)}M${suffix}`)
            } else if (end >= 1000) {
              // Format with commas
              setDisplay(`${prefix}${current.toLocaleString()}${suffix}`)
            } else {
              setDisplay(`${prefix}${current}${suffix}`)
            }

            if (progress < 1) requestAnimationFrame(animate)
          }

          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.3 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [end, duration, prefix, suffix])

  return { ref, display }
}

/* ── Live join counter that randomly increments ── */
function useLiveCounter(base: number) {
  const [count, setCount] = useState(base)

  useEffect(() => {
    // Random increment every 8–15 seconds
    const tick = () => {
      const delay = 8000 + Math.random() * 7000
      setTimeout(() => {
        setCount((c) => c + 1)
        tick()
      }, delay)
    }
    tick()
  }, [])

  return count
}

export default function AnimatedStats() {
  const agents = useCountUp(527, 2000, '', '+')
  const commission = useCountUp(2300000, 2500, 'RM', '+')
  const liveCount = useLiveCounter(12)

  return (
    <div className="agent-cta-stats">
      <div className="cta-stat">
        <span className="cta-stat-number" ref={agents.ref}>
          {agents.display}
        </span>
        <span className="cta-stat-label">Agent Aktif</span>
      </div>
      <div className="cta-stat-divider"></div>
      <div className="cta-stat">
        <span className="cta-stat-number" ref={commission.ref}>
          {commission.display}
        </span>
        <span className="cta-stat-label">Komisen Dibayar</span>
      </div>
      <div className="cta-stat-divider"></div>
      <div className="cta-stat">
        <span className="cta-stat-pulse">
          <span className="pulse-dot"></span> LIVE
        </span>
        <span className="cta-stat-label">{liveCount} baru join hari ini</span>
      </div>
    </div>
  )
}
