'use client'
import { useEffect, useRef, useState, useCallback } from 'react'

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [started, setStarted] = useState(false)
  const hasSetupListeners = useRef(false)

  // Lazy-load: only create Audio object on first user interaction
  const startMusic = useCallback(() => {
    if (started) return

    // Create audio object only when user interacts (no preload)
    const audio = new Audio('/bgm.mp3')
    audio.loop = true
    audio.volume = 0.3
    audio.preload = 'none'
    audioRef.current = audio

    audio.play().then(() => {
      setPlaying(true)
      setStarted(true)
    }).catch(() => {})

    // Remove listeners after first interaction
    document.removeEventListener('click', startMusic)
    document.removeEventListener('touchstart', startMusic)
    document.removeEventListener('scroll', startMusic)
  }, [started])

  useEffect(() => {
    if (hasSetupListeners.current) return
    hasSetupListeners.current = true

    document.addEventListener('click', startMusic)
    document.addEventListener('touchstart', startMusic)
    document.addEventListener('scroll', startMusic)

    return () => {
      document.removeEventListener('click', startMusic)
      document.removeEventListener('touchstart', startMusic)
      document.removeEventListener('scroll', startMusic)
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggle = () => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      audioRef.current.play().then(() => {
        setPlaying(true)
        setStarted(true)
      }).catch(() => {})
    }
  }

  if (!started) return null

  return (
    <button
      onClick={toggle}
      aria-label={playing ? 'Mute music' : 'Play music'}
      style={{
        position: 'fixed',
        top: '70px',
        right: '12px',
        zIndex: 9998,
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        border: '1px solid rgba(255,255,255,0.15)',
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(8px)',
        color: '#fff',
        fontSize: '16px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
      }}
    >
      {playing ? '🔊' : '🔇'}
    </button>
  )
}
