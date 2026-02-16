'use client'

import React, { useState, useRef, useEffect } from 'react'

interface RegisterGateProps {
  onVerified: () => void
}

const COUNTRIES = [
  {
    code: '+60',
    flag: 'https://flagcdn.com/w40/my.png',
    name: 'Malaysia',
    placeholder: '12-345 6789',
  },
  {
    code: '+62',
    flag: 'https://flagcdn.com/w40/id.png',
    name: 'Indonesia',
    placeholder: '812-3456-7890',
  },
]

export default function RegisterGate({ onVerified }: RegisterGateProps) {
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [country, setCountry] = useState(COUNTRIES[0])
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [botUsername, setBotUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(0)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCountdown(countdown - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  const handleRegister = async () => {
    setError('')
    const cleanPhone = phone.replace(/\D/g, '').replace(/^0+/, '')
    if (cleanPhone.length < 8) {
      setError('Nombor telefon tidak sah')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/patch-id/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone, countryCode: country.code }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Request failed')

      setBotUsername(data.botUsername || 'cm8vvip_bot')
      setStep('otp')
      setCountdown(300) // 5 min
      setTimeout(() => otpRefs.current[0]?.focus(), 100)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mendaftar')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    // Auto-advance
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all 6 filled
    if (value && index === 5 && newOtp.every((d) => d)) {
      verifyOtp(newOtp.join(''))
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      e.preventDefault()
      const newOtp = pasted.split('')
      setOtp(newOtp)
      verifyOtp(pasted)
    }
  }

  const verifyOtp = async (otpCode: string) => {
    setError('')
    setLoading(true)
    try {
      const cleanPhone = phone.replace(/\D/g, '').replace(/^0+/, '')
      const res = await fetch('/api/patch-id/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone, countryCode: country.code, otp: otpCode }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Verification failed')

      // Save verified state
      localStorage.setItem(
        'patchIdVerified',
        JSON.stringify({
          phone: `${country.code}${cleanPhone}`,
          verifiedAt: Date.now(),
        }),
      )

      onVerified()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OTP tidak sah')
      setOtp(['', '', '', '', '', ''])
      otpRefs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  const formatCountdown = (s: number) => {
    const min = Math.floor(s / 60)
    const sec = s % 60
    return `${min}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <div className="register-gate">
      <div className="register-card">
        {/* Header */}
        <div className="register-header">
          <div className="register-shield">🛡️</div>
          <h2 className="register-title">PATCH ID VERIFICATION</h2>
          <p className="register-desc">
            {step === 'phone'
              ? 'Daftar nombor telefon anda untuk akses AI Scanner'
              : 'Masukkan kod OTP yang diterima dari Telegram Bot'}
          </p>
        </div>

        {/* Step indicator */}
        <div className="register-steps">
          <div className={`step-dot ${step === 'phone' ? 'step-active' : 'step-done'}`}>
            {step === 'otp' ? '✓' : '1'}
          </div>
          <div className="step-line" />
          <div className={`step-dot ${step === 'otp' ? 'step-active' : ''}`}>2</div>
        </div>

        {error && (
          <div className="register-error">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* === STEP 1: Phone === */}
        {step === 'phone' && (
          <div className="register-form">
            <label className="register-label">Nombor Telefon</label>
            <div className="phone-input-row">
              <div className="country-selector">
                {COUNTRIES.map((c) => (
                  <button
                    key={c.code}
                    className={`country-btn ${country.code === c.code ? 'country-active' : ''}`}
                    onClick={() => setCountry(c)}
                    type="button"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.flag} alt={c.name} className="country-flag" />
                    <span>{c.code}</span>
                  </button>
                ))}
              </div>
              <div className="phone-field">
                <span className="phone-prefix">{country.code}</span>
                <input
                  type="tel"
                  className="phone-input"
                  placeholder={country.placeholder}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
                  autoFocus
                />
              </div>
            </div>

            <button
              className="register-submit"
              onClick={handleRegister}
              disabled={loading || !phone.replace(/\D/g, '').length}
            >
              {loading ? (
                <>
                  <span className="reg-spinner" />
                  Mendaftar...
                </>
              ) : (
                <>
                  <span>✈️</span>
                  Dapatkan OTP melalui Telegram Bot
                </>
              )}
            </button>

            <p className="register-hint">
              🔒 OTP akan dihantar melalui Telegram Bot — buka bot, tekan &quot;Share Contact&quot;
            </p>
          </div>
        )}

        {/* === STEP 2: OTP === */}
        {step === 'otp' && (
          <div className="register-form">
            {/* Bot instruction */}
            <div className="otp-instruction">
              <div className="otp-instruction-icon">✈️</div>
              <div>
                <p className="otp-instruction-title">Buka Telegram Bot</p>
                <p className="otp-instruction-desc">
                  Tekan butang &quot;Share Contact&quot; untuk terima OTP
                </p>
              </div>
            </div>

            <a
              href={`https://t.me/${botUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="open-bot-btn"
            >
              <span>🤖</span>
              Buka @{botUsername}
              <span className="btn-arrow">→</span>
            </a>

            {/* OTP inputs */}
            <label className="register-label otp-label">Kod OTP (6 digit)</label>
            <div className="otp-input-row" onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    otpRefs.current[i] = el
                  }}
                  type="text"
                  inputMode="numeric"
                  className="otp-digit"
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  maxLength={1}
                />
              ))}
            </div>

            {countdown > 0 && (
              <p className="otp-countdown">⏱️ Tamat dalam {formatCountdown(countdown)}</p>
            )}

            <button
              className="register-submit"
              onClick={() => verifyOtp(otp.join(''))}
              disabled={loading || otp.some((d) => !d)}
            >
              {loading ? (
                <>
                  <span className="reg-spinner" />
                  Mengesahkan...
                </>
              ) : (
                <>
                  <span>🔓</span>
                  Sahkan OTP
                </>
              )}
            </button>

            <button
              className="register-back"
              onClick={() => {
                setStep('phone')
                setOtp(['', '', '', '', '', ''])
                setError('')
              }}
            >
              ← Tukar Nombor
            </button>

            {/* Join group reminder */}
            <div className="join-group-cta">
              <span>📢</span>
              <span>Join group Telegram kami:</span>
              <a href="https://t.me/cm8vvip" target="_blank" rel="noopener noreferrer">
                t.me/cm8vvip
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
