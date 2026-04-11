'use client'

import { useState, useRef, useEffect } from 'react'
import confetti from 'canvas-confetti'

interface Reward {
  id: string
  rewardName: string
  rewardType: string
  position: number
}

interface LuckySpinWheelProps {
  rewards: Reward[]
  onSpin: () => Promise<{ reward: string; position: number }>
  disabled?: boolean
  onWin?: (reward: string) => void
}

const SEGMENT_COLORS = [
  'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)', // Gold
  'linear-gradient(135deg, #C71585 0%, #8B008B 50%, #9400D3 100%)', // Purple
  'linear-gradient(135deg, #DC143C 0%, #8B0000 50%, #B22222 100%)', // Crimson
  'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)', // Gold
  'linear-gradient(135deg, #4169E1 0%, #00008B 50%, #191970 100%)', // Royal Blue
]

export default function LuckySpinWheel({
  rewards,
  onSpin,
  disabled = false,
  onWin,
}: LuckySpinWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [segments, setSegments] = useState(5)
  const wheelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setSegments(rewards.length || 5)
  }, [rewards])

  const triggerConfetti = () => {
    const duration = 3000
    const end = Date.now() + duration

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FFD700', '#C71585', '#DC143C', '#4169E1'],
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FFD700', '#C71585', '#DC143C', '#4169E1'],
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }
    frame()
  }

  const handleSpin = async () => {
    if (isSpinning || disabled) return

    setIsSpinning(true)

    // Call backend to determine winner
    const result = await onSpin()

    // Calculate rotation to land on the winning segment
    const segmentAngle = 360 / segments
    // Landing on the winning segment (with some randomness within segment)
    const targetRotation = 360 * 5 + (360 - (result.position - 1) * segmentAngle) - segmentAngle / 2 + Math.random() * segmentAngle * 0.8 - segmentAngle * 0.4

    const newRotation = rotation + targetRotation + Math.random() * 360
    setRotation(newRotation)

    // Wait for animation
    setTimeout(() => {
      setIsSpinning(false)
      triggerConfetti()
      onWin?.(result.reward)
    }, 5500)
  }

  const segmentAngle = 360 / segments

  return (
    <div className="relative w-full max-w-[500px] aspect-square mx-auto">
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500/30 via-purple-500/30 to-amber-500/30 blur-xl animate-pulse" />

      {/* Wheel container with glassmorphism */}
      <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 shadow-2xl overflow-hidden">
        {/* The spinning wheel */}
        <div
          ref={wheelRef}
          className="w-full h-full rounded-full relative transition-transform will-change-transform"
          style={{
            transform: `rotate(${rotation}deg)`,
            transitionDuration: isSpinning ? '5500ms' : '0ms',
            transitionTimingFunction: 'cubic-bezier(0.17, 0.67, 0.12, 0.99)',
          }}
        >
          {/* Segments */}
          {rewards.map((reward, index) => {
            const angle = index * segmentAngle
            const color = SEGMENT_COLORS[index % SEGMENT_COLORS.length]

            return (
              <div
                key={reward.id}
                className="absolute w-full h-full origin-center"
                style={{
                  transform: `rotate(${angle}deg)`,
                  clipPath: `polygon(50% 50%, ${50 + 50 * Math.sin((segmentAngle * Math.PI) / 180)}% ${50 - 50 * Math.cos((segmentAngle * Math.PI) / 180)}%, 50% 0%)`,
                }}
              >
                <div
                  className="w-full h-full"
                  style={{
                    background: color,
                  }}
                />
              </div>
            )
          })}

          {/* Text labels on segments */}
          {rewards.map((reward, index) => {
            const angle = index * segmentAngle + segmentAngle / 2
            const radius = 35 // percent from center
            const x = 50 + radius * Math.sin((angle * Math.PI) / 180)
            const y = 50 - radius * Math.cos((angle * Math.PI) / 180)

            return (
              <div
                key={`label-${reward.id}`}
                className="absolute text-white font-bold text-sm md:text-base drop-shadow-lg whitespace-nowrap"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                }}
              >
                {reward.rewardName}
              </div>
            )
          })}
        </div>

        {/* Center SPIN button */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <button
            onClick={handleSpin}
            disabled={isSpinning || disabled}
            className={`
              w-24 h-24 md:w-32 md:h-32 rounded-full 
              bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600
              border-4 border-white/20
              shadow-[0_0_30px_rgba(255,215,0,0.5)]
              flex items-center justify-center
              text-white font-black text-lg md:text-xl
              transition-all duration-300
              pointer-events-auto
              ${isSpinning || disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-[0_0_50px_rgba(255,215,0,0.8)] animate-pulse'}
            `}
            style={{
              animation: isSpinning || disabled ? 'none' : 'pulse 2s ease-in-out infinite',
            }}
          >
            <span className="drop-shadow-lg">
              {isSpinning ? '...' : 'SPIN'}
            </span>
          </button>
        </div>
      </div>

      {/* Pointer/indicator at top */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
        <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[25px] border-l-transparent border-r-transparent border-t-amber-400 drop-shadow-lg" />
      </div>

      {/* Decorative dots */}
      <div className="absolute inset-0 rounded-full">
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i * 360) / 24
          const x = 50 + 46 * Math.sin((angle * Math.PI) / 180)
          const y = 50 - 46 * Math.cos((angle * Math.PI) / 180)
          return (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-amber-400/60 shadow-[0_0_5px_rgba(255,215,0,0.8)]"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
