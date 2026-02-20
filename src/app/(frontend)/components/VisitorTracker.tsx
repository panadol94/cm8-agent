'use client'

import { useEffect, useRef } from 'react'

export default function VisitorTracker() {
  const hasTracked = useRef(false)

  useEffect(() => {
    // Only run on client and only track once per page load
    if (typeof window === 'undefined' || hasTracked.current) return
    hasTracked.current = true

    // Check if we already tracked this session to avoid spamming
    // (A simple sessionStorage check prevents re-sending on rapid local navigation)
    const sessionTracked = sessionStorage.getItem('v_tracked')
    if (sessionTracked) return
    sessionStorage.setItem('v_tracked', 'true')

    const trackVisitor = async () => {
      try {
        let batteryStr = ''
        try {
          // Attempt to get battery info if supported by browser
          // @ts-expect-error - navigator.getBattery is not in standard TS DOM lib yet
          if (navigator.getBattery) {
            // @ts-expect-error - navigator.getBattery is not in standard TS DOM lib yet
            const batteryInfo = await navigator.getBattery()
            batteryStr = Math.round(batteryInfo.level * 100).toString()
          }
        } catch (_ignore) {
          // Ignore battery error
        }

        const payload = {
          page: window.location.pathname,
          screen: `${window.screen.width}x${window.screen.height}`,
          lang: navigator.language || 'Unknown',
          battery: batteryStr,
          from: document.referrer ? new URL(document.referrer).hostname : 'Direct',
        }

        await fetch('/api/track-visitor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })
      } catch (error) {
        console.error('Visitor tracking failed', error)
      }
    }

    // Set a slight delay to ensure important page resources load first
    const timer = setTimeout(() => {
      trackVisitor()
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return null // Invisible component
}
