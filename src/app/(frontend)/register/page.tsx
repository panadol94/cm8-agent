'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    whatsapp: '',
    experience: 'baru',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Nama diperlukan'
    if (!formData.phone.trim()) newErrors.phone = 'Nombor telefon diperlukan'
    else if (!/^[0-9+\-\s]{8,15}$/.test(formData.phone))
      newErrors.phone = 'Nombor telefon tidak sah'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setStatus('loading')
    try {
      const res = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <>
        <div className="page-hero">
          <h1 className="page-hero-title">Pendaftaran Berjaya! 🎉</h1>
          <p className="page-hero-subtitle">Terima kasih kerana mendaftar sebagai agent CM8.</p>
        </div>
        <section className="section">
          <div className="section-inner">
            <div className="form-container">
              <div className="form-success">
                <div className="form-success-icon">✅</div>
                <h2>Terima Kasih!</h2>
                <p>
                  Pendaftaran anda telah diterima. Pasukan kami akan menghubungi anda dalam masa 24
                  jam melalui WhatsApp atau telefon.
                </p>
                <br />
                <Link href="/" className="btn btn-primary">
                  Kembali ke Utama
                </Link>
              </div>
            </div>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <div className="page-hero">
        <h1 className="page-hero-title">Daftar Sebagai Agent</h1>
        <p className="page-hero-subtitle">
          Isi borang di bawah dan pasukan kami akan menghubungi anda dalam masa 24 jam.
        </p>
      </div>

      <section className="section">
        <div className="section-inner">
          <div className="form-container">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="name">
                  Nama Penuh *
                </label>
                <input
                  id="name"
                  type="text"
                  className="form-input"
                  placeholder="Masukkan nama penuh anda"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                {errors.name && <div className="form-error">{errors.name}</div>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="phone">
                  Nombor Telefon *
                </label>
                <input
                  id="phone"
                  type="tel"
                  className="form-input"
                  placeholder="012-3456789"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                {errors.phone && <div className="form-error">{errors.phone}</div>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="whatsapp">
                  Nombor WhatsApp
                </label>
                <input
                  id="whatsapp"
                  type="tel"
                  className="form-input"
                  placeholder="012-3456789 (jika berbeza)"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="experience">
                  Pengalaman
                </label>
                <select
                  id="experience"
                  className="form-select"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                >
                  <option value="baru">Baru (Tiada Pengalaman)</option>
                  <option value="berpengalaman">Berpengalaman</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="message">
                  Mesej Tambahan
                </label>
                <textarea
                  id="message"
                  className="form-textarea"
                  placeholder="Ada soalan atau maklumat tambahan?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              {status === 'error' && (
                <div className="form-error" style={{ marginBottom: 16, textAlign: 'center' }}>
                  Ralat semasa menghantar. Sila cuba lagi atau hubungi kami melalui WhatsApp.
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Menghantar...' : 'Hantar Pendaftaran'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
