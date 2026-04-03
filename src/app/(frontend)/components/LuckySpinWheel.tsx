'use client'

import { useState } from 'react'

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

// Premium casino wheel palette — matching SpinX reference
const WHEEL_PALETTE: Record<string, { bg: string; text: string; glow: string }> = {
  RM100_1: { bg: '#DC3545', text: '#FFFFFF', glow: 'rgba(220,53,69,0.5)' },
  RM100_2: { bg: '#FDD835', text: '#1A1A2E', glow: 'rgba(253,216,53,0.5)' },
  RM100_3: { bg: '#8E24AA', text: '#FFD700', glow: 'rgba(142,36,170,0.5)' },
  RM100_4: { bg: '#1E88E5', text: '#FFFFFF', glow: 'rgba(30,136,229,0.5)' },
  RM100_5: { bg: '#43A047', text: '#FFFFFF', glow: 'rgba(67,160,71,0.5)' },
  RM188:   { bg: '#FF9800', text: '#1A1A2E', glow: 'rgba(255,152,0,0.5)' },
  RM288:   { bg: '#E91E63', text: '#FFFFFF', glow: 'rgba(233,30,99,0.5)' },
  RM388:   { bg: '#00BCD4', text: '#1A1A2E', glow: 'rgba(0,188,212,0.5)' },
  RM588:   { bg: '#37474F', text: '#FFD700', glow: 'rgba(55,71,79,0.5)' },
  GOLD:    { bg: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)', text: '#1A1A2E', glow: 'rgba(255,215,0,0.7)' },
}

function describeArc(cx: number, cy: number, outerR: number, innerR: number, startAngle: number, endAngle: number) {
  const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180
  const startOuter = { x: cx + outerR * Math.cos(toRad(startAngle)), y: cy + outerR * Math.sin(toRad(startAngle)) }
  const endOuter = { x: cx + outerR * Math.cos(toRad(endAngle)), y: cy + outerR * Math.sin(toRad(endAngle)) }
  const startInner = { x: cx + innerR * Math.cos(toRad(endAngle)), y: cy + innerR * Math.sin(toRad(endAngle)) }
  const endInner = { x: cx + innerR * Math.cos(toRad(startAngle)), y: cy + Math.sin(toRad(startAngle)) }
  const largeArc = endAngle - startAngle > 180 ? 1 : 0
  return `M ${startOuter.x} ${startOuter.y} A ${outerR} ${outerR} 0 ${largeArc} 1 ${endOuter.x} ${endOuter.y} L ${startInner.x} ${startInner.y} A ${innerR} ${innerR} 0 ${largeArc} 0 ${endInner.x} ${endInner.y} Z`
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

  const size = 360
  const cx = size / 2
  const cy = size / 2
  const outerRadius = size / 2 - 2
  const innerRadius = 56
  const segmentAngle = 360 / Math.max(segments.length, 1)

  // Build segment color map from segment labels
  const segmentColors = segments.map((seg) => {
    // Match by label
    if (seg.label === '5 Gram Emas') return WHEEL_PALETTE.GOLD
    const label = seg.label.toUpperCase().replace(/ /g, '')
    if (label === 'RM100') {
      // Assign different RM100 slots different colors
      const idx = segments.filter(s => s.label === 'RM100').indexOf(seg)
      const rm100Colors = [WHEEL_PALETTE.RM100_1, WHEEL_PALETTE.RM100_2, WHEEL_PALETTE.RM100_3, WHEEL_PALETTE.RM100_4, WHEEL_PALETTE.RM100_5]
      return rm100Colors[idx % rm100Colors.length]
    }
    if (label === 'RM188') return WHEEL_PALETTE.RM188
    if (label === 'RM288') return WHEEL_PALETTE.RM288
    if (label === 'RM388') return WHEEL_PALETTE.RM388
    if (label === 'RM588') return WHEEL_PALETTE.RM588
    return { bg: seg.color, text: seg.textColor, glow: 'rgba(255,255,255,0.3)' }
  })

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Wheel Container */}
      <div className="relative">
        {/* Outer ambient glow */}
        <div
          className="absolute inset-[-24px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255,215,0,0.12) 0%, transparent 70%)',
            animation: 'ls-glow-pulse 3s ease-in-out infinite',
          }}
        />

        {/* Main wheel */}
        <div
          className="relative rounded-full"
          style={{
            width: size,
            height: size,
            transition: spinning ? 'transform 5.5s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
            transform: `rotate(${rotation}deg)`,
            boxShadow: '0 0 80px rgba(255,215,0,0.15), 0 0 120px rgba(255,215,0,0.08)',
          }}
        >
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <defs>
              {/* Gold metallic gradient for outer ring */}
              <linearGradient id="goldFrame" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#BF953F" />
                <stop offset="25%" stopColor="#FCF6BA" />
                <stop offset="50%" stopColor="#AA771C" />
                <stop offset="75%" stopColor="#FBF5BB" />
                <stop offset="100%" stopColor="#8C6B2F" />
              </linearGradient>
              {/* Gold bar gradient */}
              <linearGradient id="goldBar" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFE566" />
                <stop offset="30%" stopColor="#FFD700" />
                <stop offset="70%" stopColor="#FFA500" />
                <stop offset="100%" stopColor="#FF8C00" />
              </linearGradient>
              {/* Segment glow filter */}
              <filter id="wheelGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {/* Drop shadow for text */}
              <filter id="textShadow">
                <feDropShadow dx="1" dy="1" stdDeviation="1.5" floodColor="rgba(0,0,0,0.9)" />
              </filter>
              {/* Dot light pattern for outer ring */}
              {segments.map((_, i) => {
                const angle = i * segmentAngle + segmentAngle / 2
                const dotR = outerRadius + 10
                const x = cx + dotR * Math.cos(((angle - 90) * Math.PI) / 180)
                const y = cy + dotR * Math.sin(((angle - 90) * Math.PI) / 180)
                return (
                  <circle
                    key={`dot-${i}`}
                    cx={x}
                    cy={y}
                    r="3"
                    fill="#FFF"
                    opacity="0.7"
                    style={{
                      filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.8))',
                    }}
                  />
                )
              })}
            </defs>

            {/* Gold outer frame ring */}
            <circle
              cx={cx}
              cy={cy}
              r={outerRadius + 10}
              fill="none"
              stroke="url(#goldFrame)"
              strokeWidth="8"
            />
            {/* Outer ring highlight */}
            <circle
              cx={cx}
              cy={cy}
              r={outerRadius + 10}
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1"
            />

            {/* Wheel base */}
            <circle cx={cx} cy={cy} r={outerRadius} fill="#111122" />

            {/* Wheel segments */}
            {segments.map((seg, i) => {
              const startAngle = i * segmentAngle
              const endAngle = (i + 1) * segmentAngle
              const midAngle = startAngle + segmentAngle / 2
              const style = segmentColors[i]
              const labelRadius = (outerRadius + innerRadius) / 2 + 4
              const labelX = cx + labelRadius * Math.cos(((midAngle - 90) * Math.PI) / 180)
              const labelY = cy + labelRadius * Math.sin(((midAngle - 90) * Math.PI) / 180)
              const rotDeg = midAngle + 90

              const isGold = seg.label === '5 Gram Emas'
              const bgColor = isGold ? '#FFD700' : style.bg

              return (
                <g key={i} filter="url(#wheelGlow)">
                  <path
                    d={describeArc(cx, cy, outerRadius - 2, innerRadius + 2, startAngle, endAngle)}
                    fill={bgColor}
                    stroke="rgba(0,0,0,0.3)"
                    strokeWidth="0.5"
                  />
                  {/* Gold bar icon for 5 Gram Emas segment */}
                  {isGold && (
                    <g transform={`translate(${labelX - 14}, ${labelY - 22})`}>
                      <rect
                        x="0" y="0" width="28" height="18" rx="3"
                        fill="url(#goldBar)"
                        stroke="#8B6914"
                        strokeWidth="0.5"
                      />
                      <rect
                        x="2" y="2" width="24" height="14" rx="2"
                        fill="none"
                        stroke="rgba(255,255,255,0.4)"
                        strokeWidth="0.5"
                      />
                      <text
                        x="14" y="11"
                        fill="#7B5C10"
                        fontSize="7"
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontFamily="Arial"
                      >
                        5G
                      </text>
                    </g>
                  )}
                  {/* Segment divider lines */}
                  <line
                    x1={cx + (innerRadius + 2) * Math.cos(((startAngle - 90) * Math.PI) / 180)}
                    y1={cy + (innerRadius + 2) * Math.sin(((startAngle - 90) * Math.PI) / 180)}
                    x2={cx + (outerRadius - 2) * Math.cos(((startAngle - 90) * Math.PI) / 180)}
                    y2={cy + (outerRadius - 2) * Math.sin(((startAngle - 90) * Math.PI) / 180)}
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth="1"
                  />
                  {/* Prize label */}
                  {!isGold && (
                    <text
                      x={labelX}
                      y={labelY}
                      fill={style.text}
                      fontSize={seg.label.length > 6 ? '10' : '12'}
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${rotDeg}, ${labelX}, ${labelY})`}
                      filter="url(#textShadow)"
                      style={{ fontFamily: 'Arial Black, Arial, sans-serif', letterSpacing: '0.5px' }}
                    >
                      {seg.label}
                    </text>
                  )}
                </g>
              )
            })}

            {/* Inner decorative ring */}
            <circle
              cx={cx}
              cy={cy}
              r={innerRadius + 2}
              fill="none"
              stroke="url(#goldFrame)"
              strokeWidth="2.5"
              opacity="0.7"
            />
            {/* Center hub */}
            <circle
              cx={cx}
              cy={cy}
              r={innerRadius - 4}
              fill="#1a1a2e"
              stroke="url(#goldFrame)"
              strokeWidth="4"
            />
            {/* Center star */}
            <text
              x={cx}
              y={cy}
              fill="#FFD700"
              fontSize="22"
              textAnchor="middle"
              dominantBaseline="middle"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.9))',
                fontFamily: 'Arial',
              }}
            >
              ★
            </text>
          </svg>

          {/* SPIN Button */}
          <button
            onClick={handleSpin}
            disabled={spinning || hasError}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 rounded-full
              disabled:opacity-40 disabled:cursor-not-allowed
              hover:scale-110 active:scale-95
              transition-all duration-200
              ${spinning || hasError ? '' : 'animate-pulse'}`}
            style={{
              width: 80,
              height: 80,
              background: spinning || hasError
                ? 'linear-gradient(135deg, #555, #333)'
                : 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
              border: '4px solid #FFD700',
              boxShadow: spinning || hasError
                ? 'none'
                : '0 0 40px rgba(255,215,0,0.9), 0 0 80px rgba(255,165,0,0.5), inset 0 2px 6px rgba(255,255,255,0.4)',
              fontFamily: 'Arial Black, Arial, sans-serif',
            }}
          >
            <span
              className="block font-black text-black text-sm uppercase tracking-wider"
              style={{ textShadow: '0 1px 0 rgba(255,255,255,0.3)' }}
            >
              {spinning ? '...' : 'SPIN'}
            </span>
          </button>

          {/* Pointer (fixed at top, doesn't rotate) */}
          <div
            className="absolute -top-3 left-1/2 -translate-x-1/2 z-20"
            style={{ filter: 'drop-shadow(0 0 14px rgba(255,215,0,1))' }}
          >
            <svg width="40" height="46" viewBox="0 0 40 46">
              <defs>
                <linearGradient id="pointerGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFE566" />
                  <stop offset="30%" stopColor="#FFD700" />
                  <stop offset="70%" stopColor="#B38728" />
                  <stop offset="100%" stopColor="#8B6914" />
                </linearGradient>
              </defs>
              {/* Glow layer */}
              <polygon points="20,50 4,4 36,4" fill="rgba(255,215,0,0.25)" />
              {/* Main pointer */}
              <polygon points="20,44 6,6 34,6" fill="url(#pointerGold)" stroke="#8B6914" strokeWidth="0.5" />
              {/* Highlight */}
              <polygon points="20,38 11,10 29,10" fill="rgba(255,255,255,0.25)" />
            </svg>
          </div>
        </div>
      </div>

      {/* Winner reveal */}
      {winner && (
        <div className="text-center animate-bounce">
          <p className="text-yellow-400 font-black text-xs uppercase tracking-widest">★ Anda Memenangi! ★</p>
          <p
            className="text-4xl font-black text-yellow-300 mt-1"
            style={{
              textShadow: '0 0 30px rgba(255,215,0,0.8), 0 0 60px rgba(255,165,0,0.5)',
            }}
          >
            {winner}
          </p>
        </div>
      )}
    </div>
  )
}