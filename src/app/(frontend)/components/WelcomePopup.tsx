'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function WelcomePopup() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Only show once per session
    const seen = sessionStorage.getItem('cm8_popup_seen')
    if (!seen) {
      // Small delay so page loads first
      const timer = setTimeout(() => setShow(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setShow(false)
    sessionStorage.setItem('cm8_popup_seen', '1')
  }

  if (!show) return null

  return (
    <div
      onClick={handleClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(4px)',
        animation: 'popupFadeIn 0.3s ease-out',
        padding: '16px',
      }}
    >
      <style>{`
        @keyframes popupFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popupScaleIn {
          from { opacity: 0; transform: scale(0.85); }
          to { opacity: 1; transform: scale(1); }
        }
        .welcome-popup-card {
          position: relative;
          max-width: 420px;
          width: 100%;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 0 40px rgba(255, 215, 0, 0.3), 0 20px 60px rgba(0,0,0,0.5);
          animation: popupScaleIn 0.35s ease-out;
          cursor: default;
        }
        .welcome-popup-card img {
          display: block;
          width: 100%;
          height: auto;
        }
        .welcome-popup-close {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(0,0,0,0.6);
          border: 2px solid rgba(255,255,255,0.3);
          color: #fff;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          z-index: 2;
          line-height: 1;
        }
        .welcome-popup-close:hover {
          background: rgba(200,0,0,0.8);
          border-color: #fff;
          transform: scale(1.1);
        }
        .welcome-popup-cta {
          display: block;
          text-align: center;
          padding: 14px 20px;
          background: linear-gradient(135deg, #d4af37, #f5d77b, #d4af37);
          color: #1a0a00;
          font-weight: 800;
          font-size: 16px;
          text-decoration: none;
          letter-spacing: 1px;
          text-transform: uppercase;
          transition: all 0.2s;
        }
        .welcome-popup-cta:hover {
          background: linear-gradient(135deg, #f5d77b, #fff8dc, #f5d77b);
        }
      `}</style>

      <div className="welcome-popup-card" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button className="welcome-popup-close" onClick={handleClose} aria-label="Tutup">
          ✕
        </button>

        {/* Banner Image */}
        <Image
          src="/banners/popup-welcome.jpg"
          alt="CM8 VVIP - Check-in Harian, Lucky Pick & Lucky Wheel - Percuma untuk pemain berdaftar rasmi"
          width={853}
          height={1280}
          priority
          style={{ width: '100%', height: 'auto' }}
        />

        {/* CTA Button */}
        <Link href="https://masuk10.com/Wasapvvipcs" className="welcome-popup-cta" onClick={handleClose}>
          Daftar & Claim Sekarang!
        </Link>
      </div>
    </div>
  )
}
