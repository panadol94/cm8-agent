'use client'

import { useEffect } from 'react'

export default function ScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    )

    // Observe all sections
    document
      .querySelectorAll('.section, .cta-section, .benefit-card, .feature-card, .info-card')
      .forEach((el) => {
        el.classList.add('scroll-reveal')
        observer.observe(el)
      })

    return () => observer.disconnect()
  }, [])

  return null
}
