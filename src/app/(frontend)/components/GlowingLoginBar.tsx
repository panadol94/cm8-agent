'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function GlowingLoginBar() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [ready, setReady] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && data.user && data.user.phone) {
          setLoggedIn(true)
          setDisplayName(data.user.phone)
        } else if (data && (data.phone || data.username)) {
          setLoggedIn(true)
          setDisplayName(data.phone || data.username)
        } else {
          setLoggedIn(false)
        }
        setReady(true)
      })
      .catch(() => {
        setLoggedIn(false)
        setReady(true)
      })
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (e) {
      // ignore
    }
    document.cookie = 'cm8_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    setLoggedIn(false)
    setDisplayName('')
    router.refresh()
  }

  if (!ready) return null

  return (
    <>
      <style>{`
        .login-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 10px 16px;
          background: linear-gradient(135deg, #fefefe 0%, #f9f5ee 100%);
          border-bottom: 1px solid rgba(0,0,0,0.06);
          border-top: 1px solid rgba(0,0,0,0.03);
        }
        .login-bar-text {
          color: #1a1a2e;
          font-size: 14px;
          font-weight: 500;
          line-height: 1.3;
          flex: 1;
        }
        .login-bar-welcome {
          color: #1a1a2e;
          font-size: 14px;
          font-weight: 600;
          line-height: 1.3;
          flex: 1;
          min-width: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .login-bar-welcome span {
          color: #d4af37;
          font-weight: 700;
        }
        .login-bar-buttons {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
        }
        .login-bar-btn {
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          text-align: center;
          transition: all 0.2s;
          cursor: pointer;
          white-space: nowrap;
        }
        .login-bar-btn-login {
          background: #fff;
          color: #1a1a2e;
          border: 1.5px solid #ddd;
        }
        .login-bar-btn-login:hover {
          border-color: #999;
          background: #f5f5f5;
        }
        .login-bar-btn-register {
          background: linear-gradient(135deg, #ff6b6b, #ee5a9a, #ff8a80);
          color: #fff;
          border: none;
        }
        .login-bar-btn-register:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }
        .login-bar-btn-event {
          background: linear-gradient(135deg, #d4af37, #f5d77b);
          color: #1a0a00;
          border: none;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .login-bar-btn-event:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }
        .login-bar-btn-logout {
          background: #fff;
          color: #888;
          border: 1.5px solid #ddd;
          font-size: 12px;
          padding: 8px 12px;
        }
        .login-bar-btn-logout:hover {
          border-color: #e74c3c;
          color: #e74c3c;
          background: #fff5f5;
        }
      `}</style>
      <div className="login-bar">
        {loggedIn ? (
          <>
            <div className="login-bar-welcome">
              Welcome back, <span>{displayName}</span>
            </div>
            <div className="login-bar-buttons">
              <Link href="/checkin" className="login-bar-btn login-bar-btn-event">
                🎁 Event
              </Link>
              <button onClick={handleLogout} className="login-bar-btn login-bar-btn-logout">
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <span className="login-bar-text">Hi, you are not logged in yet</span>
            <div className="login-bar-buttons">
              <Link href="/checkin" className="login-bar-btn login-bar-btn-login">Login</Link>
              <Link href="/checkin" className="login-bar-btn login-bar-btn-register">Register</Link>
            </div>
          </>
        )}
      </div>
    </>
  )
}
