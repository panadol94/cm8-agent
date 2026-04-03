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
  onSpin: () => Promise<{ reward: string; rewardType: string } | undefined>
  spinning: boolean
  setSpinning: (v: boolean) => void
  hasError: boolean
  onWin?: (reward: string, rewardType: string) => void
}

// Premium color palette with gradients per segment
const SEGMENT_STYLES: Record<string, { colors: string[]; glow: string }> = {
  cash: {
    colors: ['#FFD700', '#FFA500', '#FF8C00'],
    glow: 'rgba(255,215,0,0.4)',
  },
  gold: {
    colors: ['#00E5AA', '#00B894', '#00D9A5'],
    glow: 'rgba(0,229,170,0.4)',
  },
  bonus: {
    colors: ['#E040FB', '#AA00FF', '#D500F9'],
    glow: 'rgba(224,64,251,0.4)',
  },
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`
    : '255,215,0'
}

export default function LuckySpinWheel({
  segments,
  onSpin,
  spinning,
  setSpinning,
  hasError,
  onWin,
}: LuckySpinWheelProps) {
  const [rotation, setRotation] = useState(0)
  const [winner, setWinner] = useState<string | null>(null)

  const handleSpin = async () => {
    if (spinning || hasError) return
    setSpinning(true)
    setWinner(null)

    try {
      const result = await onSpin()
      if (!result) {
        setSpinning(false)
        return
      }

      const segmentIndex = segments.findIndex(s => s.label === result.reward)
      const safeIndex = segmentIndex >= 0 ? segmentIndex : 0
      const segmentAngle = 360 / segments.length
      const targetAngle = 360 * 5 + (360 - safeIndex * segmentAngle - segmentAngle / 2)
      setRotation(targetAngle)

      setTimeout(() => {
        setWinner(result.reward)
        setSpinning(false)
        onWin?.(result.reward, result.rewardType)
      }, 5500)
    } catch {
      setSpinning(false)
    }
  }

  const size = 340
  const cx = size / 2
  const cy = size / 2
  const outerRadius = size / 2 - 4
  const innerRadius = 52
  const midRadius = innerRadius + 4
  const segmentAngle = 360 / Math.max(segments.length, 1)

  function describeArc(
    cx: number,
    cy: number,
    outerR: number,
    innerR: number,
    startAngle: number,
    endAngle: number
  ) {
    const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180
    const startOuter = { x: cx + outerR * Math.cos(toRad(startAngle)), y: cy + outerR * Math.sin(toRad(startAngle)) }
    const endOuter = { x: cx + outerR * Math.cos(toRad(endAngle)), y: cy + outerR * Math.sin(toRad(endAngle)) }
    const startInner = { x: cx + innerR * Math.cos(toRad(endAngle)), y: cy + innerR * Math.sin(toRad(endAngle)) }
    const endInner = { x: cx + innerR * Math.cos(toRad(startAngle)), y: cy + innerR * Math.sin(toRad(startAngle)) }
    const largeArc = endAngle - startAngle > 180 ? 1 : 0
    return `M ${startOuter.x} ${startOuter.y} A ${outerR} ${outerR} 0 ${largeArc} 1 ${endOuter.x} ${endOuter.y} L ${startInner.x} ${startInner.y} A ${innerR} ${innerR} 0 ${largeArc} 0 ${endInner.x} ${endInner.y} Z`
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Outer glow ring */}
      <div className="relative">
        {/* Animated outer glow */}
        <div
          className="absolute inset-[-20px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255,215,0,0.15) 0%, transparent 70%)',
            animation: 'ls-glow-pulse 2.5s ease-in-out infinite',
          }}
        />

        {/* Main wheel container */}
        <div
          className="relative rounded-full"
          style={{
            width: size,
            height: size,
            transition: spinning ? 'transform 5.5s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
            transform: `rotate(${rotation}deg)`,
          }}
        >
          {/* Outer decorative ring - gold */}
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute inset-0">
            <defs>
              {/* Gold gradient for outer ring */}
              <linearGradient id="goldRing" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#BF953F" />
                <stop offset="25%" stopColor="#FCF6BA" />
                <stop offset="50%" stopColor="#B38728" />
                <stop offset="75%" stopColor="#FBF5BB" />
                <stop offset="100%" stopColor="#AA771C" />
              </linearGradient>
              {/* Segment gradients */}
              {segments.map((seg, i) => {
                const style = SEGMENT_STYLES[seg.type] || SEGMENT_STYLES.cash
                const gradientId = `segGrad${i}`
                return (
                  <linearGradient key={i} id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={style.colors[0]} />
                    <stop offset="100%" stopColor={style.colors[1]} />
                  </linearGradient>
                )
              })}
              {/* Glow filter */}
              <filter id="segGlow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Outer decorative ring with notches */}
            <circle
              cx={cx}
              cy={cy}
              r={outerRadius + 6}
              fill="none"
              stroke="url(#goldRing)"
              strokeWidth="6"
              opacity="0.6"
            />
            {/* Notch marks around outer ring */}
            {Array.from({ length: 36 }).map((_, i) => {
              const angle = (i * 10 * Math.PI) / 180 - Math.PI / 2
              const r1 = outerRadius + 8
              const r2 = outerRadius + 14
              return (
                <line
                  key={i}
                  x1={cx + r1 * Math.cos(angle)}
                  y1={cy + r1 * Math.sin(angle)}
                  x2={cx + r2 * Math.cos(angle)}
                  y2={cy + r2 * Math.sin(angle)}
                  stroke="#FFD700"
                  strokeWidth={i % 3 === 0 ? 2 : 1}
                  opacity={i % 3 === 0 ? 0.8 : 0.4}
                />
              )
            })}

            {/* Main wheel background */}
            <circle cx={cx} cy={cy} r={outerRadius} fill="#0a0a1a" />
            <circle cx={cx} cy={cy} r={outerRadius} fill="none" stroke="#1a1a3e" strokeWidth="2" />

            {/* Wheel segments */}
            {segments.map((seg, i) => {
              const startAngle = i * segmentAngle
              const endAngle = (i + 1) * segmentAngle
              const midAngle = startAngle + segmentAngle / 2
              const path = describeArc(cx, cy, outerRadius - 2, innerRadius + 4, startAngle, endAngle)
              const style = SEGMENT_STYLES[seg.type] || SEGMENT_STYLES.cash
              const labelRadius = (outerRadius + innerRadius) / 2 + 8
              const labelX = cx + labelRadius * Math.cos(((midAngle - 90) * Math.PI) / 180)
              const labelY = cy + labelRadius * Math.sin(((midAngle - 90) * Math.PI) / 180)
              const rotDeg = midAngle + 90
              const rgb = hexToRgb(style.colors[0])

              return (
                <g key={i} filter="url(#segGlow)">
                  <path d={path} fill={`url(#segGrad${i})`} />
                  {/* Segment border lines */}
                  <line
                    x1={cx + (innerRadius + 4) * Math.cos(((startAngle - 90) * Math.PI) / 180)}
                    y1={cy + (innerRadius + 4) * Math.sin(((startAngle - 90) * Math.PI) / 180)}
                    x2={cx + (outerRadius - 2) * Math.cos(((startAngle - 90) * Math.PI) / 180)}
                    y2={cy + (outerRadius - 2) * Math.sin(((startAngle - 90) * Math.PI) / 180)}
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="1"
                  />
                  {/* Text label */}
                  <text
                    x={labelX}
                    y={labelY}
                    fill={seg.textColor}
                    fontSize="11"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${rotDeg}, ${labelX}, ${labelY})`}
                    style={{
                      fontFamily: 'Arial, sans-serif',
                      textShadow: `0 0 10px rgba(${rgb},0.8), 1px 1px 2px rgba(0,0,0,0.8)`,
                      letterSpacing: '0.5px',
                    }}
                  >
                    {seg.label}
                  </text>
                </g>
              )
            })}

            {/* Inner decorative rings */}
            <circle
              cx={cx}
              cy={cy}
              r={innerRadius + 2}
              fill="none"
              stroke="rgba(255,215,0,0.3)"
              strokeWidth="1"
            />
            <circle
              cx={cx}
              cy={cy}
              r={innerRadius - 2}
              fill="#0a0a1a"
              stroke="url(#goldRing)"
              strokeWidth="3"
            />

            {/* Center emblem */}
            <circle cx={cx} cy={cy} r={innerRadius - 20} fill="#1a1a3e" />
            {/* Star in center */}
            <text
              x={cx}
              y={cy - 2}
              fill="#FFD700"
              fontSize="16"
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ textShadow: '0 0 10px rgba(255,215,0,0.8)' }}
            >
              ★
            </text>
          </svg>

          {/* SPIN Button overlay */}
          <button
            onClick={handleSpin}
            disabled={spinning || hasError}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 rounded-full
              disabled:opacity-50 disabled:cursor-not-allowed
              hover:scale-110 active:scale-95
              transition-all duration-200
              ${spinning || hasError ? '' : 'animate-pulse'}`}
            style={{
              width: 72,
              height: 72,
              background: spinning || hasError
                ? 'linear-gradient(135deg, #666, #444)'
                : 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
              border: '3px solid #FFD700',
              boxShadow: spinning || hasError
                ? 'none'
                : '0 0 30px rgba(255,215,0,0.8), 0 0 60px rgba(255,165,0,0.4), inset 0 2px 4px rgba(255,255,255,0.3)',
              fontFamily: 'Arial, sans-serif',
            }}
          >
            <span
              className="block font-black text-black text-xs uppercase tracking-wider"
              style={{ textShadow: '0 1px 0 rgba(255,255,255,0.3)' }}
            >
              {spinning ? '...' : 'SPIN'}
            </span>
          </button>

          {/* Pointer - golden arrow at top */}
          <div
            className="absolute -top-2 left-1/2 -translate-x-1/2 z-20"
            style={{ filter: 'drop-shadow(0 0 12px rgba(255,215,0,0.9))' }}
          >
            <svg width="32" height="36" viewBox="0 0 32 36">
              {/* Outer glow layer */}
              <polygon points="16,38 4,2 28,2" fill="rgba(255,215,0,0.2)" />
              {/* Main arrow */}
              <polygon
                points="16,34 5,4 27,4"
                fill="url(#goldRing)"
              />
              {/* Inner highlight */}
              <polygon points="16,30 9,8 23,8" fill="#FCF6BA" opacity="0.4" />
              {/* Arrow tip */}
              <polygon points="16,0 12,10 20,10" fill="#FFD700" />
            </svg>
            <defs>
              <linearGradient id="goldRing" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#BF953F" />
                <stop offset="50%" stopColor="#FCF6BA" />
                <stop offset="100%" stopColor="#B38728" />
              </linearGradient>
            </defs>
          </div>
        </div>

        {/* Bottom decorative shine */}
        <div
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 rounded-full pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.6), transparent)',
          }}
        />
      </div>

      {/* Winner reveal */}
      {winner && (
        <div className="text-center animate-bounce mt-2">
          <p className="text-yellow-400 font-black text-xs uppercase tracking-widest">★ Anda Memenangi! ★</p>
          <p
            className="text-4xl font-black text-yellow-300 mt-1"
            style={{
              textShadow: '0 0 20px rgba(255,215,0,0.6), 0 0 40px rgba(255,165,0,0.4)',
            }}
          >
            {winner}
          </p>
        </div>
      )}
    </div>
  )
}