'use client'

import { useEffect } from 'react'

interface Props {
  reward: string
  rewardType: string
  onClose: () => void
}

const TYPE_ICONS: Record<string, string> = {
  cash: '💵',
  gold: '🥇',
  bonus: '🎁',
}

export default function LuckySpinWinPopup({ reward, rewardType, onClose }: Props) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Popup */}
      <div
        className="relative bg-gradient-to-b from-yellow-900 via-yellow-950 to-black rounded-3xl p-8 md:p-12 max-w-md w-full text-center border-2 border-yellow-500 shadow-[0_0_60px_rgba(255,215,0,0.4)]"
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 text-yellow-400/70 hover:text-yellow-400 text-2xl">&times;</button>

        {/* Celebration icon */}
        <div className="text-6xl mb-4 animate-bounce">
          {TYPE_ICONS[rewardType] || '🎉'}
        </div>

        <h2 className="text-yellow-400 text-sm uppercase tracking-widest mb-2">Tahniah!</h2>
        <h1 className="text-4xl md:text-5xl font-black text-yellow-300 mb-4">{reward}</h1>
        <p className="text-yellow-100/70 text-sm mb-8">Anda telah memilih hadiah ini. Sila claim dengan admin.</p>

        <button
          onClick={onClose}
          className="w-full py-3 px-6 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl
            font-bold text-black text-lg
            hover:from-yellow-400 hover:to-yellow-500
            transition-all duration-200 shadow-lg"
        >
          Okay, Terima Kasih!
        </button>
      </div>
    </div>
  )
}
