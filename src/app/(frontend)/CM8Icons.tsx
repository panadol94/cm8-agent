import React from 'react'

/* ============================================================
   CM8 Icons — Extracted from cm8ong.com SVG assets
   ============================================================ */

export function PatchIDIcon({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 46 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#pid_f0)">
        <rect x="7.42" y="9.48" width="31.39" height="22.17" rx="3" fill="#c91d0e" />
        <rect x="7.42" y="7.45" width="31.39" height="22.17" rx="3" fill="url(#pid_g0)" />
        {/* Shield shape */}
        <path
          d="M23.1 11.5l-7 3.5v5c0 4.2 3 8.1 7 9 4-0.9 7-4.8 7-9v-5l-7-3.5z"
          fill="white"
          opacity="0.9"
        />
        {/* Star inside shield */}
        <path
          d="M23.1 15l1.4 2.8 3.1.5-2.25 2.2.53 3.1-2.78-1.46-2.78 1.46.53-3.1-2.25-2.2 3.1-.5L23.1 15z"
          fill="url(#pid_star)"
        />
        {/* CM8 text */}
        <text
          x="23.1"
          y="27"
          textAnchor="middle"
          fontSize="4"
          fontWeight="bold"
          fill="white"
          opacity="0.8"
        >
          CM8
        </text>
      </g>
      <defs>
        <filter
          id="pid_f0"
          x="0.52"
          y="1.55"
          width="45.19"
          height="38.46"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="3.45" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.9 0 0 0 0 0.2 0 0 0 0 0.1 0 0 0 0.35 0" />
          <feBlend in2="BackgroundImageFix" result="effect1" />
          <feBlend in="SourceGraphic" in2="effect1" result="shape" />
        </filter>
        <linearGradient
          id="pid_g0"
          x1="38.57"
          y1="24.8"
          x2="7.44"
          y2="19.65"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#ff6b2c" />
          <stop offset="0.5" stopColor="#e63520" />
          <stop offset="1" stopColor="#c91d0e" />
        </linearGradient>
        <linearGradient
          id="pid_star"
          x1="23.1"
          y1="15"
          x2="23.1"
          y2="24"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFD700" />
          <stop offset="1" stopColor="#FFA500" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function TelegramKomunitiIcon({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 46 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#tg_f0)">
        <rect x="7.42" y="9.48" width="31.39" height="22.17" rx="3" fill="#c91d0e" />
        <rect x="7.42" y="7.45" width="31.39" height="22.17" rx="3" fill="url(#tg_g0)" />
        {/* Paper plane */}
        <path
          d="M14 18.5l18-7.5-4 17-6-4.5-4 3.5v-5l14-11-10.5 9.5L14 18.5z"
          fill="white"
          opacity="0.95"
        />
        <path d="M21.5 23.5l-1.5 5 6-4.5-4.5-.5z" fill="white" opacity="0.6" />
      </g>
      <defs>
        <filter
          id="tg_f0"
          x="0.52"
          y="1.55"
          width="45.19"
          height="38.46"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="3.45" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.9 0 0 0 0 0.2 0 0 0 0 0.1 0 0 0 0.35 0" />
          <feBlend in2="BackgroundImageFix" result="effect1" />
          <feBlend in="SourceGraphic" in2="effect1" result="shape" />
        </filter>
        <linearGradient
          id="tg_g0"
          x1="38.57"
          y1="24.8"
          x2="7.44"
          y2="19.65"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#ff6b2c" />
          <stop offset="0.5" stopColor="#e63520" />
          <stop offset="1" stopColor="#c91d0e" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function WhatsAppKomunitiIcon({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 46 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#wa_f0)">
        <rect x="7.42" y="9.48" width="31.39" height="22.17" rx="3" fill="#c91d0e" />
        <rect x="7.42" y="7.45" width="31.39" height="22.17" rx="3" fill="url(#wa_g0)" />
        {/* Phone icon in chat bubble */}
        <path
          d="M23.1 10.5c-4.8 0-8.7 3.6-8.7 8 0 1.5.4 2.9 1.2 4.1L14 27l4.6-1.5c1.3.7 2.8 1 4.5 1 4.8 0 8.7-3.6 8.7-8s-3.9-8-8.7-8z"
          fill="white"
          opacity="0.95"
        />
        {/* Phone receiver */}
        <path
          d="M20.3 16c-.3-.6-.6-.6-.9-.6h-.7c-.3 0-.7.1-1.1.5-.4.4-1.4 1.3-1.4 3.2s1.4 3.7 1.6 4c.2.2 2.8 4.2 6.8 5.5 3.3 1.1 4 .9 4.7.8.7-.1 2.3-.9 2.6-1.8.3-.9.3-1.7.2-1.8-.1-.2-.4-.3-1-.5-.5-.2-2.8-1.4-3.2-1.5-.4-.2-.7-.2-1 .2-.3.4-1.2 1.5-1.5 1.8-.3.3-.5.3-1 .1-.5-.2-2.2-.8-4.2-2.5-1.5-1.4-2.6-3-2.9-3.5-.3-.5 0-.8.2-1 .2-.2.5-.5.7-.8.2-.3.3-.5.5-.8.2-.3.1-.6 0-.8-.2-.2-1-2.4-1.4-3.3z"
          fill="url(#wa_phone)"
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </g>
      <defs>
        <filter
          id="wa_f0"
          x="0.52"
          y="1.55"
          width="45.19"
          height="38.46"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="3.45" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.9 0 0 0 0 0.2 0 0 0 0 0.1 0 0 0 0.35 0" />
          <feBlend in2="BackgroundImageFix" result="effect1" />
          <feBlend in="SourceGraphic" in2="effect1" result="shape" />
        </filter>
        <linearGradient
          id="wa_g0"
          x1="38.57"
          y1="24.8"
          x2="7.44"
          y2="19.65"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#ff6b2c" />
          <stop offset="0.5" stopColor="#e63520" />
          <stop offset="1" stopColor="#c91d0e" />
        </linearGradient>
        <linearGradient
          id="wa_phone"
          x1="23"
          y1="16"
          x2="23"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#c91d0e" />
          <stop offset="1" stopColor="#8b1515" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function AdminIcon({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 46 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#adm_f0)">
        <rect x="7.42" y="9.48" width="31.39" height="22.17" rx="3" fill="#c91d0e" />
        <rect x="7.42" y="7.45" width="31.39" height="22.17" rx="3" fill="url(#adm_g0)" />
        {/* Headset */}
        <path
          d="M15 18.5v-1c0-4.4 3.6-8 8-8s8 3.6 8 8v1"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
        <rect x="13" y="17" width="4" height="6" rx="2" fill="white" opacity="0.9" />
        <rect x="29" y="17" width="4" height="6" rx="2" fill="white" opacity="0.9" />
        {/* Mic arm */}
        <path
          d="M29 23v1.5c0 1.4-1.1 2.5-2.5 2.5H25"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
        />
        <circle cx="24" cy="27" r="1.5" fill="white" opacity="0.8" />
      </g>
      <defs>
        <filter
          id="adm_f0"
          x="0.52"
          y="1.55"
          width="45.19"
          height="38.46"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="3.45" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.9 0 0 0 0 0.2 0 0 0 0 0.1 0 0 0 0.35 0" />
          <feBlend in2="BackgroundImageFix" result="effect1" />
          <feBlend in="SourceGraphic" in2="effect1" result="shape" />
        </filter>
        <linearGradient
          id="adm_g0"
          x1="38.57"
          y1="24.8"
          x2="7.44"
          y2="19.65"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#ff6b2c" />
          <stop offset="0.5" stopColor="#e63520" />
          <stop offset="1" stopColor="#c91d0e" />
        </linearGradient>
      </defs>
    </svg>
  )
}

/* Bottom Navigation Icons */
export function HomeIcon({ size = 24, active = false }: { size?: number; active?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1V9.5z"
        fill={active ? '#FA6292' : '#999'}
        stroke={active ? '#FA6292' : '#999'}
        strokeWidth="1.5"
      />
    </svg>
  )
}

export function PromoIcon({ size = 24, active = false }: { size?: number; active?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 12v10H4V12M2 7h20v5H2V7zM12 22V7M12 7H7.5a2.5 2.5 0 110-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 100-5C13 2 12 7 12 7z"
        stroke={active ? '#FA6292' : '#999'}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

export function CustomerServiceIcon({
  size = 24,
  active = false,
}: {
  size?: number
  active?: boolean
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 16v2a2 2 0 01-2 2H8l-4 2v-6m14-2V8A6 6 0 006 8v8m12 0h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2m-12 4H4a2 2 0 01-2-2v-2a2 2 0 012-2h2"
        stroke={active ? '#FA6292' : '#999'}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

export function AccountIcon({ size = 24, active = false }: { size?: number; active?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"
        stroke={active ? '#FA6292' : '#999'}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

/* Game Category Icons */
export function HotIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.985 13.094l-.097-1.734-1.059 1.377c-.084.11-.263.303-.493.48.101-.334.176-.674.225-1.019.185-1.306.07-3.311-1.528-5.445l-.67-.895-.44 1.028c-.506 1.186-1.326 1.782-2.088 1.517-.587-.205-1.063-.876-1.308-1.843-.228-.901-.361-2.488.304-4.926l.282-1.035-1.046.236C6.538 1.63 4.16 4.137 3.19 8.083c-.408 1.659-.485 3.23-.473 4.293-.834-.676-1.25-1.268-1.261-1.283l-.794-1.167-.362 1.367A8.38 8.38 0 000 13.603c0 12.851 18 11.841 18 0 0-.165-.005-.336-.015-.509z"
        fill="url(#hot_g)"
      />
      <defs>
        <linearGradient id="hot_g" x1="9" y1="0" x2="9" y2="23" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6B35" />
          <stop offset="1" stopColor="#FF3366" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function SlotsIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="2"
        y="3"
        width="16"
        height="14"
        rx="2"
        stroke="#FA6292"
        strokeWidth="1.5"
        fill="none"
      />
      <line x1="7.5" y1="3" x2="7.5" y2="17" stroke="#FA6292" strokeWidth="1" />
      <line x1="12.5" y1="3" x2="12.5" y2="17" stroke="#FA6292" strokeWidth="1" />
      <circle cx="5" cy="10" r="1.5" fill="#FA6292" />
      <circle cx="10" cy="10" r="1.5" fill="#FA6292" />
      <circle cx="15" cy="10" r="1.5" fill="#FA6292" />
      <path d="M8 1h4v3H8V1z" fill="#FA6292" stroke="#FA6292" strokeWidth="0.5" />
    </svg>
  )
}

export function LiveIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="10" cy="10" r="8" stroke="#FA6292" strokeWidth="1.5" fill="none" />
      <circle cx="10" cy="10" r="3" fill="#FA6292" />
      <path
        d="M10 2v3M10 15v3M2 10h3M15 10h3"
        stroke="#FA6292"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function SportsIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="10" cy="10" r="8.5" stroke="#FA6292" strokeWidth="1.2" fill="none" />
      <path
        d="M10 1.5c-2 3-2 5 0 8.5s2 5.5 0 8.5M1.5 10c3-2 5-2 8.5 0s5.5 2 8.5 0"
        stroke="#FA6292"
        strokeWidth="1"
      />
    </svg>
  )
}

export function FishingIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 8c0 4-3 7-5 9-2-2-5-5-5-9a5 5 0 0110 0z"
        stroke="#FA6292"
        strokeWidth="1.5"
        fill="none"
      />
      <path d="M4 3l2 4M16 3l-2 4" stroke="#FA6292" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="10" cy="8" r="2" fill="#FA6292" />
    </svg>
  )
}
