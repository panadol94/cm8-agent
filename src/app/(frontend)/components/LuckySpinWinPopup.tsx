'use client'

import { useEffect } from 'react'

interface LuckySpinWinPopupProps {
  isOpen: boolean
  reward: string
  onClose: () => void
}

export default function LuckySpinWinPopup({ isOpen, reward, onClose }: LuckySpinWinPopupProps) {
  useEffect(() => {
    if (isOpen) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose()
      }
      window.addEventListener('keydown', handleEscape)
      return () => window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Win card */}
      <div 
        className="relative w-full max-w-md bg-gradient-to-br from-amber-500/20 via-purple-500/20 to-amber-500/20
                   backdrop-blur-xl rounded-3xl border border-amber-400/30 p-8 text-center
                   animate-[fadeIn_0.5s_ease-out,scaleIn_0.5s_ease-out]
                   shadow-[0_0_60px_rgba(255,215,0,0.3)]"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-amber-500/10 rounded-3xl blur-xl" />

        {/* Content */}
        <div className="relative z-10">
          {/* Trophy icon */}
          <div className="mb-6 text-6xl animate-bounce">
            🏆
          </div>

          {/* Winner text */}
          <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 mb-4">
            TAHNIAH!
          </h2>

          <p className="text-white/80 text-lg mb-6">
            Anda telah memenangi
          </p>

          {/* Prize display */}
          <div 
            className="text-4xl md:text-5xl font-black text-amber-400 mb-8
                       animate-[glow_1s_ease-in-out_infinite_alternate]"
            style={{
              textShadow: '0 0 20px rgba(255,215,0,0.5), 0 0 40px rgba(255,215,0,0.3)',
            }}
          >
            {reward}
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 
                       text-white font-bold rounded-full
                       hover:from-amber-400 hover:to-amber-500
                       transition-all duration-300 shadow-lg
                       hover:shadow-[0_0_30px_rgba(255,215,0,0.5)]"
          >
            Teruskan
          </button>
        </div>

        {/* Decorative sparkles */}
        <div className="absolute top-4 left-4 text-amber-400/60 text-2xl animate-pulse">✨</div>
        <div className="absolute top-4 right-4 text-amber-400/60 text-2xl animate-pulse delay-150">✨</div>
        <div className="absolute bottom-4 left-4 text-amber-400/60 text-2xl animate-pulse delay-300">✨</div>
        <div className="absolute bottom-4 right-4 text-amber-400/60 text-2xl animate-pulse delay-500">✨</div>
      </div>
    </div>
  )
}
