'use client'

import React from 'react'
import Link from 'next/link'

export default function FloatingPickABox() {
  return (
    <>
      <Link
        href="/event"
        aria-label="Pick A Box Event"
        style={{
          position: 'fixed',
          bottom: '205px',
          right: '16px',
          width: '58px',
          height: '58px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #e63520 0%, #ff6b4a 50%, #ff8c42 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(230,53,32,0.4), 0 0 40px rgba(255,107,74,0.2)',
          zIndex: 998,
          textDecoration: 'none',
          animation: 'fpab-pulse 2.5s ease-in-out infinite',
          border: '3px solid rgba(255,215,0,0.4)',
        }}
      >
        <span style={{ fontSize: '28px', lineHeight: 1 }}>🎁</span>
      </Link>

      {/* Tooltip */}
      <div
        style={{
          position: 'fixed',
          bottom: '213px',
          right: '80px',
          background: 'linear-gradient(135deg, #ffd700 0%, #ffaa33 100%)',
          color: '#1a0505',
          fontSize: '11px',
          fontWeight: 800,
          padding: '5px 10px',
          borderRadius: '8px',
          zIndex: 998,
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 10px rgba(255,215,0,0.3)',
          animation: 'fpab-tooltip-fade 3s ease-in-out infinite',
          pointerEvents: 'none',
          letterSpacing: '0.3px',
        }}
      >
        🎁 Pick A Box!
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
            borderLeft: '6px solid #ffaa33',
          }}
        />
      </div>

      <style>{`
        @keyframes fpab-pulse {
          0%, 100% { transform: translateY(0) scale(1); box-shadow: 0 4px 20px rgba(230,53,32,0.4); }
          50% { transform: translateY(-5px) scale(1.08); box-shadow: 0 8px 30px rgba(230,53,32,0.6), 0 0 50px rgba(255,215,0,0.15); }
        }
        @keyframes fpab-tooltip-fade {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </>
  )
}
