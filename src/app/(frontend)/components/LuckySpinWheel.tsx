'use client'

import { useState, useRef } from 'react'

interface WheelSegment {
  label: string
  color: string
  textColor: string
  type: string
}

interface LuckySpinWheelProps {
  segments: WheelSegment[]
  onSpin: () => Promise<{ reward: string; rewardType: string }>
  spinning: boolean
  setSpinning: (v: boolean) => void
  hasError: boolean
}

export default function LuckySpinWheel({ segments, onSpin, spinning, setSpinning, hasError }: LuckySpinWheelProps) {
  const [rotation, setRotation] = useState(0)
  const [winner, setWinner] = useState<string | null>(null)
  const wheelRef = useRef<HTMLDivElement>(null)

  const handleSpin = async () => {
    if (spinning || hasError) return
    setSpinning(true)
    setWinner(null)

    try {
      const result = await onSpin()
      const segmentIndex = segments.findIndex(s => s.label === result.reward)
      const segmentAngle = 360 / segments.length
      const targetAngle = 360 * 5 + (360 - segmentIndex * segmentAngle - segmentAngle / 2)
      setRotation(targetAngle)
      setTimeout(() => {
        setWinner(result.reward)
        setSpinning(false)
      }, 5500)
    } catch {
      setSpinning(false)
    }
  }

  const segmentAngle = 360 / segments.length

  return (
    <div className="flex flex-col items-center gap-6 md:gap-8">
      <div className="relative">
        {/* Halo effects */}
        <div className="absolute -inset-6 rounded-full bg-[radial-gradient(circle,rgba(255,215,0,0.22),transparent_60%)] blur-2xl opacity-80" />
        <div className="absolute -inset-3 rounded-full border border-yellow-400/20 animate-pulse" />

        {/* Pointer */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
          <div className="w-0 h-0 border-l-[14px] border-r-[14px] border-t-[24px] border-l-transparent border-r-transparent border-t-yellow-300 drop-shadow-[0_0_10px_rgba(255,215,0,0.65)]" />
        </div>

        {/* Outer metallic ring */}
        <div className="relative p-3 md:p-4 rounded-full bg-gradient-to-br from-yellow-200 via-yellow-500 to-yellow-700 shadow-[0_0_40px_rgba(255,215,0,0.25),0_20px_60px_rgba(0,0,0,0.45)]">
          <div className="rounded-full p-2 md:p-3 bg-[radial-gradient(circle_at_top,#2e355f_0%,#151b38_45%,#090d1c_100%)] border border-yellow-200/20">
            <div
              ref={wheelRef}
              className="relative w-72 h-72 md:w-[26rem] md:h-[26rem] rounded-full overflow-hidden border-[6px] border-yellow-300/80"
              style={{
                background: 'conic-gradient(from 0deg, #111827, #1f2937, #0f172a)',
                transition: spinning ? 'transform 5.5s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
                transform: `rotate(${rotation}deg)`,
              }}
            >
              {segments.map((seg, i) => (
                <div
                  key={i}
                  className="absolute w-1/2 h-1/2 origin-bottom-left flex items-center justify-center"
                  style={{
                    background: seg.color,
                    transform: `rotate(${i * segmentAngle}deg)`,
                    clipPath: 'polygon(0 0, 100% 0, 100% 100%)',
                    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.15)',
                  }}
                >
                  <span
                    className="absolute font-black text-[10px] md:text-xs drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)] tracking-wide"
                    style={{
                      color: seg.textColor,
                      transform: `rotate(${segmentAngle / 2}deg) translateX(28px)`,
                      left: '38%',
                      top: '20%',
                      writingMode: 'vertical-rl',
                      textOrientation: 'mixed',
                    }}
                  >
                    {seg.label}
                  </span>
                </div>
              ))}

              {/* center gloss */}
              <div className="absolute inset-[34%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.22),rgba(255,255,255,0.04)_45%,transparent_70%)] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Center button */}
        <button
          onClick={handleSpin}
          disabled={spinning || hasError}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-24 h-24 md:w-28 md:h-28 rounded-full
            bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600
            border-[5px] border-yellow-100
            font-black text-black text-sm md:text-base tracking-wide
            disabled:opacity-50 disabled:cursor-not-allowed
            hover:scale-105 active:scale-95
            transition-all duration-200
            ${spinning || hasError ? '' : 'animate-pulse'}`}
          style={{ boxShadow: spinning || hasError ? '0 0 0 rgba(0,0,0,0)' : '0 0 30px rgba(255,215,0,0.45), 0 12px 25px rgba(0,0,0,0.35)' }}
        >
          <div className="leading-tight">
            {spinning ? 'SPINNING' : 'SPIN'}
          </div>
        </button>
      </div>

      {winner && (
        <div className="text-center animate-bounce">
          <p className="text-yellow-300 font-bold text-lg md:text-xl">🎉 Anda Memenangi!</p>
          <p className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-100 to-yellow-400 mt-2">
            {winner}
          </p>
        </div>
      )}
    </div>
  )
}
