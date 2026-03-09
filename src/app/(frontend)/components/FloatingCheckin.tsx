'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function FloatingCheckin() {
  const pathname = usePathname()
  
  // Hide on check-in page (already there)
  if (pathname === '/checkin') return null

  return (
    <>
      <Link
        href="/checkin"
        aria-label="Daily Check-in"
        style={{
          position: 'fixed',
          bottom: '210px',
          right: '16px',
          width: '58px',
          height: '58px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #e63520 0%, #ff4136 50%, #c91d0e 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(230,53,32,0.4), 0 0 40px rgba(255,65,54,0.2)',
          zIndex: 998,
          textDecoration: 'none',
          animation: 'fcheckin-pulse 2.5s ease-in-out infinite',
          border: '3px solid rgba(255,215,0,0.4)',
        }}
      >
        <span style={{ fontSize: '26px', lineHeight: 1 }}>🏆</span>
      </Link>

      {/* Tooltip */}
      <div
        style={{
          position: 'fixed',
          bottom: '218px',
          right: '80px',
          background: 'linear-gradient(135deg, #ffd700 0%, #ff8c00 100%)',
          color: '#1a0505',
          fontSize: '11px',
          fontWeight: 700,
          padding: '5px 10px',
          borderRadius: '8px',
          zIndex: 998,
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 10px rgba(255,215,0,0.3)',
          animation: 'fcheckin-tooltip 3s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      >
        ✅ Check-in Harian
        <div
          style={{
            position: 'absolute',
            right: '-6px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: 0,
            height: 0,
            borderTop: '6px solid transparent',
            borderBottom: '6px solid transparent',
            borderLeft: '6px solid #ff8c00',
          }}
        />
      </div>

      <style>{`
        @keyframes fcheckin-pulse {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-5px) scale(1.06); }
        }
        @keyframes fcheckin-tooltip {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </>
  )
}
