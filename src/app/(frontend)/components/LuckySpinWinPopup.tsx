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
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />

      <div
        className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-yellow-400/30 bg-[linear-gradient(180deg,#2b1f06_0%,#160f04_35%,#090909_100%)] p-8 md:p-10 text-center shadow-[0_0_80px_rgba(255,215,0,0.25),0_25px_80px_rgba(0,0,0,0.55)]"
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-300/80 to-transparent" />
        <button onClick={onClose} className="absolute top-4 right-4 text-yellow-300/70 hover:text-yellow-200 text-2xl">&times;</button>

        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-yellow-300/20 bg-yellow-400/10 text-5xl shadow-[0_0_30px_rgba(255,215,0,0.18)] animate-bounce">
          {TYPE_ICONS[rewardType] || '🎉'}
        </div>

        <p className="text-[11px] uppercase tracking-[0.35em] text-yellow-200/70 mb-2">Tahniah</p>
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-100 via-yellow-300 to-yellow-500 mb-4 break-words">
          {reward}
        </h1>
        <p className="text-yellow-50/70 text-sm md:text-base mb-8 leading-relaxed">
          Hadiah anda telah direkodkan. Sila tunggu pihak admin untuk urusan tuntutan hadiah.
        </p>

        <button
          onClick={onClose}
          className="w-full rounded-2xl bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 py-3.5 px-6 font-black text-black text-lg shadow-[0_10px_30px_rgba(255,215,0,0.25)] hover:scale-[1.01] active:scale-[0.99] transition-all"
        >
          OKAY, TERIMA KASIH
        </button>
      </div>
    </div>
  )
}
