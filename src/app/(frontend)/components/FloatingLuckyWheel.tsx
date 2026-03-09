'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function FloatingLuckyWheel() {
  const pathname = usePathname()
  
  // Hide on these pages to avoid overlap
  if (pathname === '/checkin' || pathname === '/lucky-wheel') return null

  return (
    <>
      <Link
        href="/lucky-wheel"
        aria-label="Lucky Wheel"
        style={{
          position: 'fixed',
          bottom: '140px',
          right: '16px',
          width: '58px',
          height: '58px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #ffd700 0%, #ffaa33 50%, #e6a800 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(255,215,0,0.4), 0 0 40px rgba(255,170,51,0.2)',
          zIndex: 998,
          textDecoration: 'none',
          animation: 'flw-bounce 2s ease-in-out infinite',
          border: '3px solid rgba(255,255,255,0.3)',
        }}
      >
        <span style={{ fontSize: '28px', lineHeight: 1 }}>🎡</span>
      </Link>

      {/* Tooltip */}
      <div
        style={{
          position: 'fixed',
          bottom: '148px',
          right: '80px',
          background: 'linear-gradient(135deg, #e63520 0%, #ff6b4a 100%)',
          color: '#fff',
          fontSize: '11px',
          fontWeight: 700,
          padding: '5px 10px',
          borderRadius: '8px',
          zIndex: 998,
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 10px rgba(230,53,32,0.3)',
          animation: 'flw-tooltip-fade 3s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      >
        🎰 Free Credit
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
            borderLeft: '6px solid #ff6b4a',
          }}
        />
      </div>

      <style>{`
        @keyframes flw-bounce {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-6px) scale(1.05); }
        }
        @keyframes flw-tooltip-fade {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </>
  )
}
