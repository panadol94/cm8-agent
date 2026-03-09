'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

type BannerItem = {
  src: string
  mobileSrc?: string
  alt: string
  link?: string
  mimeType?: string
}

const fallbackBanners: BannerItem[] = [
  { src: '/banners/banner-cm8-scanner.jpg', alt: 'CM8 VVIP AI Scanner - Data RTP Slot Real-Time' },
  { src: '/banners/banner-cm8-1.png', alt: 'CM8 VVIP - Platform Agent Slot #1 Malaysia' },
  { src: '/banners/banner-cm8-2.png', alt: 'CM8 VVIP - Komisyen Sehingga 90% Tanpa Modal' },
  { src: '/banners/banner-cm8-3.png', alt: 'CM8 VVIP - Daftar Agent Slot Percuma Sekarang' },
]

export default function BannerCarousel({ banners: cmsBanners }: { banners?: BannerItem[] }) {
  const banners = cmsBanners && cmsBanners.length > 0 ? cmsBanners : fallbackBanners
  const [current, setCurrent] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % banners.length)
  }, [banners.length])

  useEffect(() => {
    const timer = setInterval(next, 4000)
    return () => clearInterval(timer)
  }, [next])

  // Detect mobile for serving mobile-optimized image
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 768px)')
    setIsMobile(mql.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  const isVideo = (b: BannerItem, src: string) => {
    if (b.mimeType?.includes('video')) return true
    const s = src.toLowerCase()
    return s.endsWith('.mp4') || s.endsWith('.webm') || s.endsWith('.ogg')
  }

  return (
    <div className="hero-banner-carousel">
      <div className="hero-banner-track" style={{ transform: `translateX(-${current * 100}%)` }}>
        {banners.map((b, i) => {
          // Use mobile image if available and on mobile device
          const imgSrc = isMobile && b.mobileSrc ? b.mobileSrc : b.src
          const isVid = isVideo(b, imgSrc)

          const slide = (
            <div key={i} className="hero-banner-slide">
              {isVid ? (
                <video
                  src={imgSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="hero-banner-img object-cover w-full h-full"
                />
              ) : (
                <Image
                  src={imgSrc}
                  alt={b.alt}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 768px) 100vw, 900px"
                  className="hero-banner-img"
                />
              )}
            </div>
          )
          return b.link ? (
            <a key={i} href={b.link} target="_blank" rel="noopener noreferrer">
              {slide}
            </a>
          ) : (
            slide
          )
        })}
      </div>

      {/* Dots */}
      <div className="hero-dots">
        {banners.map((_, i) => (
          <button
            key={i}
            className={`hero-dot${i === current ? ' active' : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
