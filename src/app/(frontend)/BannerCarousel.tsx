'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

type BannerItem = {
  src: string
  alt: string
  link?: string
}

const fallbackBanners: BannerItem[] = [
  { src: '/banners/banner-cm8-1.png', alt: 'CM8 Promo Banner 1' },
  { src: '/banners/banner-cm8-2.png', alt: 'CM8 Promo Banner 2' },
  { src: '/banners/banner-cm8-3.png', alt: 'CM8 Promo Banner 3' },
]

export default function BannerCarousel({ banners: cmsBanners }: { banners?: BannerItem[] }) {
  const banners = cmsBanners && cmsBanners.length > 0 ? cmsBanners : fallbackBanners
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % banners.length)
  }, [banners.length])

  useEffect(() => {
    const timer = setInterval(next, 4000)
    return () => clearInterval(timer)
  }, [next])

  return (
    <div className="hero-banner-carousel">
      <div className="hero-banner-track" style={{ transform: `translateX(-${current * 100}%)` }}>
        {banners.map((b, i) => {
          const slide = (
            <div key={i} className="hero-banner-slide">
              <Image
                src={b.src}
                alt={b.alt}
                width={800}
                height={450}
                priority={i === 0}
                className="hero-banner-img"
              />
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
