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
  const resultRef = useRef<{ reward: string; rewardType: string } | null>(null)

  const handleSpin = async () => {
    if (spinning || hasError) return
    setSpinning(true)
    setWinner(null)
    resultRef.current = null

    try {
      const result = await onSpin()

      if (!result) {
        setSpinning(false)
        return
      }

      resultRef.current = result

      const segmentIndex = segments.findIndex(s => s.label === result.reward)
      const safeIndex = segmentIndex >= 0 ? segmentIndex : 0
      const segmentAngle = 360 / segments.length

      // Pointer is at top (0deg), so we need to land the target segment under the pointer
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

  const size = 320
  const cx = size / 2
  const cy = size / 2
  const outerRadius = size / 2 - 8
  const innerRadius = 48
  const segmentAngle = 360 / Math.max(segments.length, 1)

  function describeArc(cx: number, cy: number, outerR: number, innerR: number, startAngle: number, endAngle: number) {
    const toRad = (deg: number) => (deg * Math.PI) / 180
    const startOuter = { x: cx + outerR * Math.cos(toRad(startAngle - 90)), y: cy + outerR * Math.sin(toRad(startAngle - 90)) }
    const endOuter = { x: cx + outerR * Math.cos(toRad(endAngle - 90)), y: cy + outerR * Math.sin(toRad(endAngle - 90)) }
    const startInner = { x: cx + innerR * Math.cos(toRad(endAngle - 90)), y: cy + innerR * Math.sin(toRad(endAngle - 90)) }
    const endInner = { x: cx + innerR * Math.cos(toRad(startAngle - 90)), y: cy + innerR * Math.sin(toRad(startAngle - 90)) }
    const largeArc = endAngle - startAngle > 180 ? 1 : 0
    return `M ${startOuter.x} ${startOuter.y} A ${outerR} ${outerR} 0 ${largeArc} 1 ${endOuter.x} ${endOuter.y} L ${startInner.x} ${startInner.y} A ${innerR} ${innerR} 0 ${largeArc} 0 ${endInner.x} ${endInner.y} Z`
  }

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Wheel Container */}
      <div className="relative">
        {/* Outer glow */}
        <div
          className="absolute inset-[-12px] rounded-full opacity-30 blur-2xl pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255,215,0,0.5) 0%, transparent 70%)',
            animation: 'ls-glow-pulse 2s ease-in-out infinite',
          }}
        />

        {/* SVG Wheel */}
        <div
          className="relative rounded-full overflow-hidden"
          style={{
            width: size,
            height: size,
            boxShadow: '0 0 60px rgba(255,215,0,0.2), 0 0 120px rgba(255,215,0,0.1)',
            transition: spinning ? 'transform 5.5s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
            transform: `rotate(${rotation}deg)`,
          }}
        >
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
            <circle cx={cx} cy={cy} r={outerRadius} fill="#0d0d2b" />

            {segments.map((seg, i) => {
              const startAngle = i * segmentAngle
              const endAngle = (i + 1) * segmentAngle
              const midAngle = startAngle + segmentAngle / 2
              const path = describeArc(cx, cy, outerRadius, innerRadius, startAngle, endAngle)
              const labelRadius = (outerRadius + innerRadius) / 2
              const labelX = cx + labelRadius * Math.cos(((midAngle - 90) * Math.PI) / 180)
              const labelY = cy + labelRadius * Math.sin(((midAngle - 90) * Math.PI) / 180)
              return (
                <g key={i}>
                  <path d={path} fill={seg.color} />
                  <text
                    x={labelX}
                    y={labelY}
                    fill={seg.textColor}
                    fontSize="12"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${midAngle}, ${labelX}, ${labelY})`}
                    style={{ fontFamily: 'Arial, sans-serif', textShadow: '1px 1px 2px rgba(0,0,0,0.6)' }}
                  >
                    {seg.label}
                  </text>
                </g>
              )
            })}

            <circle cx={cx} cy={cy} r={innerRadius - 4} fill="#0d0d2b" stroke="#FFD700" strokeWidth="3" />
            <circle cx={cx} cy={cy} r={innerRadius - 16} fill="none" stroke="rgba(255,215,0,0.3)" strokeWidth="1" />
          </svg>

          <button
            onClick={handleSpin}
            disabled={spinning || hasError}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full
              bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600
              border-[3px] border-yellow-300
              font-black text-black text-xs uppercase tracking-wider
              disabled:opacity-50 disabled:cursor-not-allowed
              hover:scale-110 active:scale-95
              transition-all duration-200 shadow-xl z-10
              ${spinning || hasError ? '' : 'animate-pulse'}`}
            style={{
              boxShadow: spinning || hasError
                ? 'none'
                : '0 0 30px rgba(255,215,0,0.7), 0 0 60px rgba(255,215,0,0.3)',
            }}
          >
            {spinning ? '...!' : 'SPIN'}
          </button>
        </div>

        {/* Pointer */}
        <div
          className="absolute -top-1 left-1/2 -translate-x-1/2 z-20"
          style={{ filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.8))' }}
        >
          <svg width="24" height="28" viewBox="0 0 24 28">
            <polygon points="12,28 2,0 22,0" fill="#FFD700" />
            <polygon points="12,24 5,4 19,4" fill="#B8860B" />
          </svg>
        </div>

        <div
          className="absolute inset-0 rounded-full pointer-events-none border-[4px] border-yellow-500/20"
          style={{ boxShadow: 'inset 0 0 40px rgba(0,0,0,0.6)' }}
        />
      </div>

      {winner && (
        <div className="text-center animate-bounce">
          <p className="text-yellow-400 font-black text-sm uppercase tracking-widest">★ Anda Memenangi! ★</p>
          <p className="text-3xl font-black text-yellow-300 mt-1" style={{ textShadow: '0 0 20px rgba(255,215,0,0.5)' }}>{winner}</p>
        </div>
      )}
    </div>
  )
}
