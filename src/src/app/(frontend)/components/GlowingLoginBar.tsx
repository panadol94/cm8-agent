'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function GlowingLoginBar() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [ready, setReady] = useState(false)

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

  if (!ready) return null

  return (
    <>
      <style>{`
        .login-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
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
          padding: 8px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          text-align: center;
          transition: all 0.2s;
          cursor: pointer;
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
      `}</style>
      <div className="login-bar">
        {loggedIn ? (
          <div className="login-bar-welcome">
            Welcome back, <span>{displayName}</span>
          </div>
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
