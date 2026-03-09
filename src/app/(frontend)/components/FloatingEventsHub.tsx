'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function FloatingEventsHub() {
  const [open, setOpen] = useState(false)

  const menuItems = [
    { href: '/checkin', icon: '\uD83C\uDFC6', label: 'Check-in Harian', color: '#FFD700' },
    { href: '/lucky-pick', icon: '\uD83C\uDCCF', label: 'Lucky Pick', color: '#4CAF50' },
    { href: '/lucky-wheel', icon: '\uD83C\uDFA1', label: 'Lucky Wheel', color: '#FF9800' },
  ]

  return (
    <>
      <style>{`
        .feh-backdrop {
          position: fixed; inset: 0; background: rgba(0,0,0,0.4);
          z-index: 997; opacity: 0; pointer-events: none;
          transition: opacity 0.3s;
        }
        .feh-backdrop.open { opacity: 1; pointer-events: auto; }

        .feh-menu {
          position: fixed; bottom: 140px; right: 16px;
          z-index: 999; display: flex; flex-direction: column; gap: 8px;
          opacity: 0; transform: translateY(20px) scale(0.9);
          pointer-events: none;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .feh-menu.open {
          opacity: 1; transform: translateY(0) scale(1); pointer-events: auto;
        }

        .feh-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 16px; border-radius: 14px;
          background: rgba(20,20,20,0.95); border: 1px solid rgba(255,255,255,0.1);
          color: #fff; text-decoration: none; font-size: 14px; font-weight: 600;
          box-shadow: 0 4px 20px rgba(0,0,0,0.4);
          transition: all 0.2s; white-space: nowrap;
          backdrop-filter: blur(10px);
        }
        .feh-item:hover {
          transform: translateX(-4px);
          border-color: rgba(255,215,0,0.3);
          box-shadow: 0 4px 25px rgba(255,215,0,0.15);
        }
        .feh-item-icon {
          font-size: 22px; line-height: 1; width: 28px; text-align: center;
        }
        .feh-item-dot {
          width: 6px; height: 6px; border-radius: 50%; margin-left: auto; flex-shrink: 0;
        }

        .feh-toggle {
          position: fixed; bottom: 70px; right: 16px;
          width: 58px; height: 58px; border-radius: 50%; border: none;
          background: linear-gradient(135deg, #e63520 0%, #ff4136 50%, #c91d0e 100%);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 20px rgba(230,53,32,0.4), 0 0 40px rgba(255,65,54,0.2);
          z-index: 999; cursor: pointer;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          border: 3px solid rgba(255,215,0,0.4);
        }
        .feh-toggle:hover { transform: scale(1.08); }
        .feh-toggle.open {
          background: linear-gradient(135deg, #333 0%, #555 100%);
          border-color: rgba(255,255,255,0.2);
          transform: rotate(45deg);
        }
        .feh-toggle-icon {
          font-size: 26px; line-height: 1;
          transition: transform 0.3s;
        }
        .feh-toggle.open .feh-toggle-icon { transform: rotate(-45deg); }

        .feh-badge {
          position: absolute; top: -2px; right: -2px;
          width: 14px; height: 14px; border-radius: 50%;
          background: #FFD700; border: 2px solid #1a0505;
          animation: feh-pulse 2s ease-in-out infinite;
        }
        @keyframes feh-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.7; }
        }

        .feh-tooltip {
          position: fixed; bottom: 78px; right: 80px;
          background: linear-gradient(135deg, #e63520 0%, #ff6b4a 100%);
          color: #fff; font-size: 11px; font-weight: 700;
          padding: 5px 10px; border-radius: 8px; z-index: 998;
          white-space: nowrap; pointer-events: none;
          box-shadow: 0 2px 10px rgba(230,53,32,0.3);
          animation: feh-tooltip-fade 3s ease-in-out infinite;
        }
        .feh-tooltip::after {
          content: ''; position: absolute; right: -6px; top: 50%;
          transform: translateY(-50%);
          width: 0; height: 0;
          border-top: 6px solid transparent;
          border-bottom: 6px solid transparent;
          border-left: 6px solid #ff6b4a;
        }
        @keyframes feh-tooltip-fade {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>

      <div
        className={`feh-backdrop ${open ? 'open' : ''}`}
        onClick={() => setOpen(false)}
      />

      <div className={`feh-menu ${open ? 'open' : ''}`}>
        {menuItems.map((item, i) => (
          <Link
            key={i}
            href={item.href}
            className="feh-item"
            onClick={() => setOpen(false)}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <span className="feh-item-icon">{item.icon}</span>
            <span>{item.label}</span>
            <span className="feh-item-dot" style={{ background: item.color }} />
          </Link>
        ))}
      </div>

      {!open && (
        <div className="feh-tooltip">
          {'\uD83C\uDF81'} Event &amp; Ganjaran
        </div>
      )}

      <button
        className={`feh-toggle ${open ? 'open' : ''}`}
        onClick={() => setOpen(p => !p)}
        aria-label="Event & Ganjaran"
      >
        <span className="feh-toggle-icon">{'\uD83C\uDFC6'}</span>
        {!open && <span className="feh-badge" />}
      </button>
    </>
  )
}
