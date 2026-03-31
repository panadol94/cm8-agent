'use client'

import { useState, useEffect, useRef } from 'react'

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
    <div className="flex flex-col items-center gap-8">
      {/* Wheel Container */}
      <div className="relative">
        {/* Outer glow */}
        <div className="absolute inset-0 rounded-full opacity-40 blur-xl bg-gradient-to-r from-yellow-400 via-pink-500 to-yellow-400 animate-spin" style={{ animationDuration: '8s' }} />

        {/* Wheel */}
        <div
          ref={wheelRef}
          className="relative w-72 h-72 md:w-96 md:h-96 rounded-full border-8 border-yellow-500 shadow-2xl overflow-hidden"
          style={{
            background: 'conic-gradient(from 0deg, #1a1a2e, #16213e, #1a1a2e)',
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
              }}
            >
              <span
                className="absolute font-bold text-xs md:text-sm drop-shadow-lg"
                style={{
                  color: seg.textColor,
                  transform: `rotate(${segmentAngle / 2}deg) translateX(20px)`,
                  left: '40%',
                  top: '25%',
                  writingMode: 'vertical-rl',
                  textOrientation: 'mixed',
                }}
              >
                {seg.label}
              </span>
            </div>
          ))}
        </div>

        {/* Center Button */}
        <button
          onClick={handleSpin}
          disabled={spinning || hasError}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full
            bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600
            border-4 border-yellow-300
            font-bold text-black text-sm
            disabled:opacity-50 disabled:cursor-not-allowed
            hover:scale-110 active:scale-95
            transition-all duration-200
            ${spinning || hasError ? '' : 'animate-pulse'}`}
          style={{ boxShadow: spinning || hasError ? 'none' : '0 0 30px rgba(255,215,0,0.6)' }}
        >
          {spinning ? 'SPINNING...' : 'SPIN'}
        </button>

        {/* Pointer */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
          <div className="w-0 h-0 border-l-8 border-r-8 border-t-12 border-l-transparent border-r-transparent border-t-yellow-400 drop-shadow-lg" />
        </div>

        {/* Rim glow */}
        <div className="absolute inset-0 rounded-full border-4 border-yellow-400/30 pointer-events-none" />
      </div>

      {/* Winner display */}
      {winner && (
        <div className="text-center animate-bounce">
          <p className="text-yellow-400 font-bold text-xl">🎉 Anda Memenangi!</p>
          <p className="text-3xl font-black text-yellow-300 mt-2">{winner}</p>
        </div>
      )}
    </div>
  )
}
