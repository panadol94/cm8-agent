export const revalidate = 60

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import BannerCarousel from './BannerCarousel'
import AnimatedStats from './AnimatedStats'
import { PatchIDIcon, TelegramKomunitiIcon, WhatsAppKomunitiIcon, AdminIcon } from './CM8Icons'
import {
  getIncomeShowcase,
  getHomepageProviders,
  getFAQs,
  getPromos,
  getBanners,
  getSiteSettings,
  getCommissionTiers,
} from '@/lib/cms'

/* ============================================================
   SECTION DATA
   ============================================================ */

const incomeShowcase = [
  {
    name: 'Ah***d R.',
    role: 'Master Agent',
    income: 'RM4,200',
    period: '/minggu',
    growth: '+32%',
    avatar: '/avatars/agent-1.png',
    bar: 72,
  },
  {
    name: 'Sa***h M.',
    role: 'Agent Aktif',
    income: 'RM1,800',
    period: '/minggu',
    growth: '+18%',
    avatar: '/avatars/agent-2.png',
    bar: 31,
  },
  {
    name: 'Ri***l K.',
    role: 'Agent Baru',
    income: 'RM650',
    period: '/minggu',
    growth: '+45%',
    avatar: '/avatars/agent-3.png',
    bar: 11,
  },
  {
    name: 'Fa***z A.',
    role: 'Senior Agent',
    income: 'RM3,100',
    period: '/minggu',
    growth: '+27%',
    avatar: '/avatars/agent-4.jpg',
    bar: 53,
  },
  {
    name: 'Nu***a L.',
    role: 'Agent Aktif',
    income: 'RM2,400',
    period: '/minggu',
    growth: '+35%',
    avatar: '/avatars/agent-5.jpg',
    bar: 41,
  },
  {
    name: 'Ha***m S.',
    role: 'Master Agent',
    income: 'RM5,800',
    period: '/minggu',
    growth: '+22%',
    avatar: '/avatars/agent-6.jpg',
    bar: 100,
  },
  {
    name: 'Am***a Y.',
    role: 'Agent Baru',
    income: 'RM900',
    period: '/minggu',
    growth: '+52%',
    avatar: '/avatars/agent-7.jpg',
    bar: 16,
  },
  {
    name: 'Za***i T.',
    role: 'Agent Aktif',
    income: 'RM2,100',
    period: '/minggu',
    growth: '+29%',
    avatar: '/avatars/agent-1.png',
    bar: 36,
  },
  {
    name: 'Sy***a N.',
    role: 'Senior Agent',
    income: 'RM3,600',
    period: '/minggu',
    growth: '+24%',
    avatar: '/avatars/agent-8.jpg',
    bar: 62,
  },
  {
    name: 'Mo***d H.',
    role: 'Agent Baru',
    income: 'RM480',
    period: '/minggu',
    growth: '+68%',
    avatar: '/avatars/agent-9.jpg',
    bar: 8,
  },
  {
    name: 'Li***a W.',
    role: 'Master Agent',
    income: 'RM4,900',
    period: '/minggu',
    growth: '+19%',
    avatar: '/avatars/agent-2.png',
    bar: 84,
  },
  {
    name: 'Da***n J.',
    role: 'Agent Aktif',
    income: 'RM1,500',
    period: '/minggu',
    growth: '+41%',
    avatar: '/avatars/agent-10.jpg',
    bar: 26,
  },
  {
    name: 'Is***l B.',
    role: 'Senior Agent',
    income: 'RM3,800',
    period: '/minggu',
    growth: '+31%',
    avatar: '/avatars/agent-11.jpg',
    bar: 66,
  },
  {
    name: 'Ai***n Z.',
    role: 'Agent Baru',
    income: 'RM750',
    period: '/minggu',
    growth: '+57%',
    avatar: '/avatars/agent-3.png',
    bar: 13,
  },
  {
    name: 'Kh***r M.',
    role: 'Agent Aktif',
    income: 'RM2,800',
    period: '/minggu',
    growth: '+33%',
    avatar: '/avatars/agent-12.jpg',
    bar: 48,
  },
  {
    name: 'Ra***a P.',
    role: 'Master Agent',
    income: 'RM5,200',
    period: '/minggu',
    growth: '+26%',
    avatar: '/avatars/agent-13.jpg',
    bar: 90,
  },
  {
    name: 'Fi***i C.',
    role: 'Agent Baru',
    income: 'RM550',
    period: '/minggu',
    growth: '+61%',
    avatar: '/avatars/agent-14.jpg',
    bar: 10,
  },
  {
    name: 'Na***m R.',
    role: 'Agent Aktif',
    income: 'RM1,950',
    period: '/minggu',
    growth: '+38%',
    avatar: '/avatars/agent-1.png',
    bar: 34,
  },
  {
    name: 'Wa***n D.',
    role: 'Senior Agent',
    income: 'RM4,500',
    period: '/minggu',
    growth: '+21%',
    avatar: '/avatars/agent-15.jpg',
    bar: 78,
  },
  {
    name: 'Ti***h G.',
    role: 'Agent Aktif',
    income: 'RM2,600',
    period: '/minggu',
    growth: '+36%',
    avatar: '/avatars/agent-16.jpg',
    bar: 45,
  },
]

const agentSteps: { num: string; icon: React.ReactNode; title: string; desc: string }[] = [
  {
    num: '01',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient
            id="stepGrad1"
            x1="0"
            y1="0"
            x2="40"
            y2="40"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#ff6b4a" />
            <stop offset="100%" stopColor="#e63520" />
          </linearGradient>
        </defs>
        <path
          d="M20 4L24.5 14.5H36L26.5 21.5L30 33L20 26L10 33L13.5 21.5L4 14.5H15.5L20 4Z"
          stroke="url(#stepGrad1)"
          strokeWidth="2.5"
          fill="none"
          strokeLinejoin="round"
        />
        <circle cx="20" cy="20" r="4" fill="url(#stepGrad1)" />
      </svg>
    ),
    title: 'VVIP Invitation Only',
    desc: 'Akses terhad melalui Private Invitation Link dari Master Agent sah.',
  },
  {
    num: '02',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient
            id="stepGrad2"
            x1="0"
            y1="0"
            x2="40"
            y2="40"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#ff8c42" />
            <stop offset="100%" stopColor="#e63520" />
          </linearGradient>
        </defs>
        <path
          d="M20 3L6 12V22C6 30 12 36 20 38C28 36 34 30 34 22V12L20 3Z"
          stroke="url(#stepGrad2)"
          strokeWidth="2.5"
          fill="none"
          strokeLinejoin="round"
        />
        <polyline
          points="14,20 18,25 27,15"
          stroke="url(#stepGrad2)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    ),
    title: 'Official Verification',
    desc: 'Pendaftaran profil perniagaan selamat dengan sekuriti gred bank.',
  },
  {
    num: '03',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient
            id="stepGrad3"
            x1="0"
            y1="0"
            x2="40"
            y2="40"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#ffaa33" />
            <stop offset="100%" stopColor="#ff6b4a" />
          </linearGradient>
        </defs>
        <rect
          x="6"
          y="10"
          width="28"
          height="22"
          rx="3"
          stroke="url(#stepGrad3)"
          strokeWidth="2.5"
          fill="none"
        />
        <line x1="6" y1="17" x2="34" y2="17" stroke="url(#stepGrad3)" strokeWidth="2" />
        <circle cx="20" cy="25" r="3" fill="url(#stepGrad3)" />
      </svg>
    ),
    title: 'Capital Allocation',
    desc: 'Komitmen modal permulaan untuk akses Tier-1 Commission (Max Yield).',
  },
  {
    num: '04',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient
            id="stepGrad4"
            x1="0"
            y1="0"
            x2="40"
            y2="40"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#ff6b4a" />
            <stop offset="100%" stopColor="#e63520" />
          </linearGradient>
        </defs>
        <rect
          x="4"
          y="8"
          width="32"
          height="24"
          rx="3"
          stroke="url(#stepGrad4)"
          strokeWidth="2.5"
          fill="none"
        />
        <circle cx="14" cy="20" r="3" stroke="url(#stepGrad4)" strokeWidth="2" fill="none" />
        <circle cx="26" cy="20" r="3" stroke="url(#stepGrad4)" strokeWidth="2" fill="none" />
        <line
          x1="14"
          y1="27"
          x2="14"
          y2="29"
          stroke="url(#stepGrad4)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="26"
          y1="27"
          x2="26"
          y2="29"
          stroke="url(#stepGrad4)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: 'System Authority',
    desc: 'Kuasa penuh Agent Command Center untuk operasi & kawalan kewangan.',
  },
  {
    num: '05',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient
            id="stepGrad5"
            x1="0"
            y1="0"
            x2="40"
            y2="40"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#ffaa33" />
            <stop offset="100%" stopColor="#e63520" />
          </linearGradient>
        </defs>
        <polyline
          points="6,32 14,22 22,26 34,10"
          stroke="url(#stepGrad5)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <polyline
          points="26,10 34,10 34,18"
          stroke="url(#stepGrad5)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    ),
    title: 'Wealth Generation',
    desc: 'Automasi pendapatan pasif & nikmati ROI mingguan.',
  },
]

const exclusiveBenefits: { icon: React.ReactNode; title: string; desc: string }[] = [
  {
    icon: (
      <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient
            id="benGrad1"
            x1="0"
            y1="0"
            x2="36"
            y2="36"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#ffaa33" />
            <stop offset="100%" stopColor="#e63520" />
          </linearGradient>
        </defs>
        <path
          d="M20 4L17 16H8L15 22L12 34L20 27L28 34L25 22L32 16H23L20 4Z"
          stroke="url(#benGrad1)"
          strokeWidth="2"
          fill="none"
          strokeLinejoin="round"
        />
        <line
          x1="20"
          y1="12"
          x2="20"
          y2="20"
          stroke="url(#benGrad1)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="16"
          y1="16"
          x2="24"
          y2="16"
          stroke="url(#benGrad1)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: 'Komisen Instant',
    desc: 'Komisyen dikreditkan secara automatik setiap deposit pemain.',
  },
  {
    icon: (
      <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient
            id="benGrad2"
            x1="0"
            y1="0"
            x2="36"
            y2="36"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#ff6b4a" />
            <stop offset="100%" stopColor="#e63520" />
          </linearGradient>
        </defs>
        <circle cx="18" cy="18" r="14" stroke="url(#benGrad2)" strokeWidth="2" fill="none" />
        <circle cx="18" cy="18" r="9" stroke="url(#benGrad2)" strokeWidth="2" fill="none" />
        <circle cx="18" cy="18" r="4" fill="url(#benGrad2)" />
      </svg>
    ),
    title: 'Tiada Modal',
    desc: 'Bermula tanpa sebarang kos. 100% percuma untuk daftar.',
  },
  {
    icon: (
      <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient
            id="benGrad3"
            x1="0"
            y1="0"
            x2="36"
            y2="36"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#ffaa33" />
            <stop offset="100%" stopColor="#ff6b4a" />
          </linearGradient>
        </defs>
        <path
          d="M8 14L18 4L28 14"
          stroke="url(#benGrad3)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <rect x="6" y="14" width="24" height="4" rx="2" fill="url(#benGrad3)" />
        <line
          x1="12"
          y1="22"
          x2="12"
          y2="32"
          stroke="url(#benGrad3)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="18"
          y1="22"
          x2="18"
          y2="32"
          stroke="url(#benGrad3)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="24"
          y1="22"
          x2="24"
          y2="32"
          stroke="url(#benGrad3)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: 'Training Percuma',
    desc: 'Kursus lengkap cara promote & tingkatkan jualan.',
  },
  {
    icon: (
      <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient
            id="benGrad4"
            x1="0"
            y1="0"
            x2="36"
            y2="36"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#ff8c42" />
            <stop offset="100%" stopColor="#e63520" />
          </linearGradient>
        </defs>
        <rect x="6" y="20" width="5" height="12" rx="1.5" fill="url(#benGrad4)" />
        <rect x="15.5" y="14" width="5" height="18" rx="1.5" fill="url(#benGrad4)" />
        <rect x="25" y="6" width="5" height="26" rx="1.5" fill="url(#benGrad4)" />
        <polyline
          points="6,12 16,8 26,3"
          stroke="url(#benGrad4)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <polyline
          points="22,3 26,3 26,7"
          stroke="url(#benGrad4)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    ),
    title: 'Dashboard Real-Time',
    desc: 'Pantau komisyen, pemain & prestasi secara live.',
  },
  {
    icon: (
      <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient
            id="benGrad5"
            x1="0"
            y1="0"
            x2="36"
            y2="36"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#ff6b4a" />
            <stop offset="100%" stopColor="#e63520" />
          </linearGradient>
        </defs>
        <path
          d="M18 3L6 10V18C6 26 11 32 18 34C25 32 30 26 30 18V10L18 3Z"
          stroke="url(#benGrad5)"
          strokeWidth="2.5"
          fill="none"
          strokeLinejoin="round"
        />
        <polyline
          points="13,18 16,22 24,13"
          stroke="url(#benGrad5)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    ),
    title: 'Support 24/7',
    desc: 'Pasukan admin sentiasa standby untuk bantu anda.',
  },
  {
    icon: (
      <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient
            id="benGrad6"
            x1="0"
            y1="0"
            x2="36"
            y2="36"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#ffaa33" />
            <stop offset="100%" stopColor="#ff6b4a" />
          </linearGradient>
        </defs>
        <rect
          x="6"
          y="14"
          width="24"
          height="18"
          rx="3"
          stroke="url(#benGrad6)"
          strokeWidth="2.5"
          fill="none"
        />
        <line x1="6" y1="20" x2="30" y2="20" stroke="url(#benGrad6)" strokeWidth="2" />
        <line x1="18" y1="14" x2="18" y2="32" stroke="url(#benGrad6)" strokeWidth="2" />
        <path
          d="M10 14L18 6L26 14"
          stroke="url(#benGrad6)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    ),
    title: 'Bonus Bulanan',
    desc: 'Insentif tambahan untuk agent yang aktif & berprestasi.',
  },
]

const liveFeedItems = [
  { type: 'join', text: 'Fa***z baru daftar sebagai agent', time: '2 minit lepas' },
  { type: 'commission', text: 'Ah***d terima RM680 komisyen', time: '5 minit lepas' },
  { type: 'join', text: 'Nu***l baru daftar sebagai agent', time: '8 minit lepas' },
  { type: 'milestone', text: 'Sa***h naik ke Master Agent!', time: '12 minit lepas' },
  { type: 'commission', text: 'Ri***l terima RM420 komisyen', time: '15 minit lepas' },
  { type: 'join', text: 'Am***n baru daftar sebagai agent', time: '18 minit lepas' },
  { type: 'commission', text: 'Ha***m terima RM1,200 komisyen', time: '22 minit lepas' },
  { type: 'milestone', text: 'Za***i naik ke Agent Aktif!', time: '25 minit lepas' },
  { type: 'join', text: 'Li***a baru daftar sebagai agent', time: '30 minit lepas' },
  { type: 'commission', text: 'Da***d terima RM550 komisyen', time: '33 minit lepas' },
]

const providers = [
  {
    name: 'MEGA888',
    img: 'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F32%2F35335f26-6f54-4387-850a-d5590768b25a.jpg',
  },
  {
    name: '918KISS',
    img: 'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F27%2Fcf1330dc-23e2-434e-bd02-a5cf6f7ecf8d.jpg',
  },
  {
    name: 'JILI',
    img: 'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F25%2Faece1da0-0722-4da1-b7d9-e300686f56ad.jpg',
  },
  {
    name: 'Pragmatic Play',
    img: 'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F47%2Fbefe333c-815a-43d7-884d-5a5bf5d5c4f0.jpg',
  },
  {
    name: 'Hacksaw',
    img: 'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F79%2Fd18411b6-519a-470f-8cdf-2442331ccf88.jpg',
  },
  {
    name: 'Playtech',
    img: 'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F83%2F2ef04bd9-813c-4169-a397-a59dcb66e87e.jpg',
  },
  {
    name: 'Habanero',
    img: 'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F89%2Fd22d30e6-3b31-46c9-bf4c-e671950d0402.jpg',
  },
  {
    name: 'Spade Gaming',
    img: 'https://images.cashmarket888.xyz/uploads%2Fsub_platform%2Fimage_path%2F95%2F3741cd4c-ade6-4323-9e4a-e70691722679.jpeg',
  },
]

const promoCards: {
  icon: React.ReactNode
  title: string
  highlight: boolean
  items: string[]
  cta: string
  ctaLink: string
}[] = [
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient
            id="promoGrad1"
            x1="0"
            y1="0"
            x2="40"
            y2="40"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#ffaa33" />
            <stop offset="100%" stopColor="#e63520" />
          </linearGradient>
        </defs>
        <circle cx="20" cy="20" r="14" stroke="url(#promoGrad1)" strokeWidth="2.5" fill="none" />
        <path
          d="M16 14C16 14 18 12 20 12C23 12 24.5 14 24.5 16C24.5 18 22 19 20 19V22"
          stroke="url(#promoGrad1)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <line
          x1="17"
          y1="26"
          x2="23"
          y2="26"
          stroke="url(#promoGrad1)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="17"
          y1="29"
          x2="23"
          y2="29"
          stroke="url(#promoGrad1)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: 'Weekly Deposit Bonus',
    highlight: false,
    items: [
      'Bonus 1% daripada deposit mingguan',
      'Tempoh: Isnin – Sabtu',
      'Diberi setiap Ahad 6:00PM',
      'Hubungi admin untuk claim',
    ],
    cta: 'Claim Now',
    ctaLink: 'https://masuk10.com/WhatsappVVIP',
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient
            id="promoGrad2"
            x1="0"
            y1="0"
            x2="40"
            y2="40"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#ff6b4a" />
            <stop offset="100%" stopColor="#e63520" />
          </linearGradient>
        </defs>
        <path
          d="M20 6L22 14L30 14L24 19L26 27L20 23L14 27L16 19L10 14L18 14L20 6Z"
          stroke="url(#promoGrad2)"
          strokeWidth="2"
          fill="url(#promoGrad2)"
          fillOpacity="0.15"
          strokeLinejoin="round"
        />
        <line
          x1="20"
          y1="2"
          x2="20"
          y2="6"
          stroke="url(#promoGrad2)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="32"
          y1="8"
          x2="30"
          y2="11"
          stroke="url(#promoGrad2)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="8"
          y1="8"
          x2="10"
          y2="11"
          stroke="url(#promoGrad2)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="20" cy="34" r="2" fill="url(#promoGrad2)" />
        <circle cx="10" cy="32" r="1.5" fill="url(#promoGrad2)" />
        <circle cx="30" cy="32" r="1.5" fill="url(#promoGrad2)" />
      </svg>
    ),
    title: 'Special Event',
    highlight: false,
    items: ['Weekly Bonus', 'Exclusive Rewards', 'One Player ID Benefits', 'Fast Support'],
    cta: 'View Event',
    ctaLink: '/benefits',
  },
]

const whyItems = [
  'Weekly Bonus',
  'Exclusive Rewards',
  'One Player ID Benefits',
  'Fast Support via Admin',
  'Komisyen Sehingga 90%',
  'Dashboard Real-Time',
]

const commissions = [
  {
    label: 'Newbie Agent',
    rate: '60%',
    desc: 'Agent baru yang ingin bermula dan mempelajari sistem',
    features: [
      'Komisyen asas 60%',
      'Admin ajar cara promote CM8',
      'Akses dashboard',
      'Naik peratus selepas capai target',
    ],
  },
  {
    label: 'Solo Player Agent',
    rate: '80%',
    desc: 'Agent yang fokus bermain dan menjaga player sendiri',
    popular: true,
    features: [
      'Komisyen 80%',
      'Dashboard premium',
      'Sokongan prioriti 24/7',
      'Naik peratus selepas capai target sales',
    ],
  },
  {
    label: 'Team Builder Agent',
    rate: '90%',
    desc: 'Agent yang membina team dan kembangkan network',
    features: [
      'Komisyen tertinggi 90%',
      'Bina team & network sendiri',
      'Pengalaman shareholder platform',
      'Semua bahan pemasaran',
      'Bonus & insentif khas',
      'Pendapatan downline',
    ],
  },
]

const testimonials = [
  {
    name: 'Ahmad R.',
    role: 'Master Agent',
    text: 'Sejak sertai CM8 sebagai agent, pendapatan saya meningkat 3x ganda. Platform yang sangat stabil dan komisyen memang laju masuk.',
    rating: 5,
    avatar: '/avatars/agent-4.jpg',
    income: 'RM4,200/minggu',
  },
  {
    name: 'Sarah M.',
    role: 'Agent Aktif',
    text: 'Dalam masa 3 bulan sudah naik ke Agent Aktif. Komisyen memang tinggi dan pembayaran sentiasa on time. Terbaik!',
    rating: 5,
    avatar: '/avatars/agent-8.jpg',
    income: 'RM2,800/minggu',
  },
  {
    name: 'Rizal K.',
    role: 'Senior Agent',
    text: 'Dashboard sangat mudah digunakan. Boleh pantau semua transaksi secara real-time. Support admin pun tiptop 24/7.',
    rating: 5,
    avatar: '/avatars/agent-11.jpg',
    income: 'RM3,600/minggu',
  },
]

const faqs = [
  {
    q: 'Bagaimana cara menjadi agent CM8?',
    a: 'Sangat mudah! Hanya isi borang pendaftaran dan pasukan kami akan menghubungi anda dalam masa 24 jam.',
  },
  {
    q: 'Berapa modal permulaan yang diperlukan?',
    a: 'Tiada modal permulaan diperlukan. Anda hanya perlu mendaftar dan kami sediakan semua alat pemasaran percuma.',
  },
  {
    q: 'Bagaimana komisyen dibayar?',
    a: 'Komisyen dibayar secara mingguan terus ke akaun bank anda. Tiada had minimum.',
  },
  {
    q: 'Adakah saya perlukan pengalaman?',
    a: 'Tidak! Kami menyediakan latihan penuh untuk agent baru.',
  },
  {
    q: 'Bolehkah saya jadi agent sambilan?',
    a: 'Ya, ramai agent kami menjalankan ini sebagai pendapatan sampingan.',
  },
]

/* ============================================================
   PAGE METADATA
   ============================================================ */
export const metadata: Metadata = {
  title: 'CM8 VVIP — Buat Duit Online & Agent Slot Tanpa Modal #1 Malaysia',
  description:
    'Jana income pasif sebagai Agent Slot CM8 VVIP. Daftar percuma, tiada modal. Akses tips hack slot & scanner live. Komisyen sehingga 90%!',
}

// ... (existing constants)

const _faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.a,
    },
  })),
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Cara Buat Duit Online Tanpa Modal Sebagai Agent Slot',
  image: 'https://cm8vvip.com/og-image.jpg',
  author: 'CM8 VVIP Team',
  genre: 'Business & Finance',
  keywords: 'buat duit online, agent slot, tanpa modal, income pasif, hack slot',
  publisher: {
    '@type': 'Organization',
    name: 'CM8 VVIP',
    logo: {
      '@type': 'ImageObject',
      url: 'https://cm8vvip.com/cm8-logo.png',
    },
  },
  description:
    'Panduan lengkap cara menjana pendapatan pasif 5-angka sebulan sebagai agent slot CM8 tanpa sebarang modal. Tips hack slot dan strategi marketing percuma.',
}

/* ============================================================
   PAGE COMPONENT
   ============================================================ */
export default async function HomePage() {
  // Fetch CMS data (falls back to hardcoded if DB empty)
  const cmsTestimonials = await getIncomeShowcase()
  const cmsProviders = await getHomepageProviders()
  const cmsFaqs = await getFAQs()
  const cmsPromos = await getPromos()
  const rawBanners = await getBanners()
  const siteSettings = await getSiteSettings()
  const cmsCommissions = await getCommissionTiers()

  // CTA buttons from admin panel (fallback to defaults)
  const ss = siteSettings as unknown as Record<string, string> | null
  const cta1Text = ss?.ctaButton1Text || '🚀 Jadi Agent Sekarang'
  const cta1Link = ss?.ctaButton1Link || 'https://masuk10.com/WhatsappVVIP'
  const cta2Text = ss?.ctaButton2Text || 'Daftar Akaun CM8'
  const cta2Link = ss?.ctaButton2Link || 'https://masuk10.com/WhatsappVVIP'

  // Map CMS banners to carousel format
  const cmsBanners = rawBanners
    ? (rawBanners
        .map((b) => {
          const img = b.image as { url?: string } | string | undefined
          const uploadSrc = typeof img === 'object' && img?.url ? img.url : null
          const src = (b as unknown as Record<string, string>).imageUrl || uploadSrc || null
          if (!src) return null
          return {
            src,
            alt: (b.title as string) || 'Banner',
            link: (b.link as string) || undefined,
          }
        })
        .filter(Boolean) as { src: string; alt: string; link?: string }[])
    : undefined

  // Use CMS data or fallback to hardcoded
  const displayShowcase = cmsTestimonials
    ? cmsTestimonials.map((t) => ({
        name: t.name || '',
        role: t.role || 'Agent Aktif',
        income: t.income || '',
        period: t.period || '/minggu',
        growth: t.growth || '',
        avatar: t.avatarUrl || '/avatars/agent-1.png',
        bar: t.bar || 0,
      }))
    : incomeShowcase

  const displayProviders = (() => {
    const raw = cmsProviders
      ? cmsProviders.map((p) => ({
          name: p.name || '',
          img: p.logoUrl || '',
        }))
      : providers
    // Deduplicate by name
    const seen = new Map<string, (typeof raw)[0]>()
    for (const p of raw) {
      if (!seen.has(p.name)) seen.set(p.name, p)
    }
    return [...seen.values()]
  })()

  const displayFaqs = (() => {
    const raw = cmsFaqs
      ? cmsFaqs.map((f) => ({
          q: f.question || '',
          a: f.answer || '',
        }))
      : faqs
    // Deduplicate by question
    const seen = new Map<string, (typeof raw)[0]>()
    for (const f of raw) {
      if (!seen.has(f.q)) seen.set(f.q, f)
    }
    return [...seen.values()]
  })()

  // Map CMS promo icon to SVG
  const promoIconMap: Record<string, React.ReactNode> = {
    bonus: promoCards[0]?.icon,
    star: promoCards[1]?.icon,
    vip: promoCards[1]?.icon,
  }

  const displayPromos = cmsPromos
    ? cmsPromos.map((p) => {
        const items = (p.items as { text: string }[] | undefined)?.map((i) => i.text) || []
        return {
          icon: promoIconMap[(p.icon as string) || 'bonus'] || promoCards[0]?.icon,
          title: (p.title as string) || '',
          highlight: !!p.highlight,
          items,
          cta: (p.ctaText as string) || 'Claim Now',
          ctaLink: (p.ctaLink as string) || 'https://masuk10.com/WhatsappVVIP',
        }
      })
    : promoCards

  // Commission tiers from CMS or fallback
  const displayCommissions = cmsCommissions
    ? cmsCommissions.map((c) => {
        const benefits = (c.benefits as { text: string }[] | undefined)?.map((b) => b.text) || []
        return {
          label: (c.name as string) || '',
          rate: `${c.percentage}%`,
          desc: '',
          popular: false,
          features: benefits,
        }
      })
    : commissions

  // Testimonials from CMS or fallback
  const cmsTestimonialCards = cmsTestimonials
    ? cmsTestimonials
        .filter((t) => !!t.content)
        .map((t) => ({
          name: (t.name as string) || '',
          role: (t.role as string) || 'Agent Aktif',
          text: (t.content as string) || '',
          rating: (t.rating as number) || 5,
          avatar: (t.avatarUrl as string) || '/avatars/agent-1.png',
          income: `${t.income || 'RM0'}${t.period || '/minggu'}`,
        }))
    : null
  const displayTestimonials =
    cmsTestimonialCards && cmsTestimonialCards.length > 0 ? cmsTestimonialCards : testimonials

  // WhatsApp link from SiteSettings (used everywhere)
  const mainWhatsappLink = cta1Link

  const displayFaqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: displayFaqs.map((faq: { q: string; a: string }) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  }
  return (
    <>
      {/* JSON-LD Schema for SEO Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'CM8 VVIP',
              url: 'https://cm8vvip.com',
              description: 'Platform Agent #1 Malaysia - Buat Duit Tanpa Modal',
              logo: 'https://cm8vvip.com/cm8-logo.png',
              sameAs: [
                'https://www.facebook.com/cm8vvip',
                'https://twitter.com/cm8vvip',
                'https://instagram.com/cm8vvip',
              ],
            },
            displayFaqSchema,
            articleSchema,
          ]),
        }}
      />

      {/* ===== HERO BANNER (real promo carousel) ===== */}
      <BannerCarousel banners={cmsBanners} />

      {/* ===== WINNER TICKER ===== */}
      <div className="winner-ticker">
        <span className="ticker-icon">📢</span>
        <div className="ticker-viewport">
          <span className="ticker-scroll">
            Tahniah kepada <strong>Ah***ng</strong> kerana memenangi iPhone 17 Pro Max
          </span>
        </div>
      </div>

      {/* ===== PREMIUM AGENT CTA ===== */}
      <div className="agent-cta-card">
        {/* Top: Headline + Commission */}
        <div className="agent-cta-top">
          <div className="agent-cta-headline">
            <span className="agent-cta-badge">👑 VIP AGENT</span>
            <h2 className="agent-cta-title">
              Jana Sehingga <span className="text-gradient">90% Komisen</span>
            </h2>
            <p className="agent-cta-subtitle">
              Jumlah bet pemain akan menjadi sumber pendapatan anda. Tiada modal, tiada risiko.
            </p>
          </div>
          <div className="agent-cta-commission">
            <div className="commission-ring-glow" />
            <div className="commission-ring-outer" />
            <span className="commission-number">90%</span>
            <span className="commission-divider" />
            <span className="commission-label">Komisen</span>
          </div>
        </div>

        {/* Middle: Benefits */}
        <div className="agent-cta-benefits">
          <div className="agent-benefit-item">
            <span className="benefit-check">⚡</span>
            <span>
              Komisen masuk <strong>instantly</strong>
            </span>
          </div>
          <div className="agent-benefit-item">
            <span className="benefit-check">🔒</span>
            <span>
              Support admin <strong>24/7</strong>
            </span>
          </div>
          <div className="agent-benefit-item">
            <span className="benefit-check">📈</span>
            <span>
              Dashboard tracking <strong>real-time</strong>
            </span>
          </div>
        </div>

        {/* Bottom: Social Proof + CTA */}
        <div className="agent-cta-bottom">
          <AnimatedStats />
          <div className="agent-cta-actions">
            <a
              href={cta1Link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gradient btn-lg"
            >
              {cta1Text}
            </a>
            <a
              href={cta2Link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
            >
              {cta2Text}
            </a>
          </div>
        </div>
      </div>

      {/* ===== QUICK ACTIONS (Patch ID / Telegram / WhatsApp / Admin) ===== */}
      <div className="quick-actions">
        <a
          href="https://masuk10.com/WhatsappVVIP"
          target="_blank"
          rel="noopener noreferrer"
          className="quick-action-btn qa-patch"
        >
          <div className="qa-icon-ring">
            <PatchIDIcon />
          </div>
          <div className="qa-text">
            <span className="quick-action-label">Patch ID</span>
            <span className="qa-sub">Daftar Akaun</span>
          </div>
          <span className="qa-arrow">›</span>
        </a>
        <a
          href="https://masuk10.com/TeleGrupVVIP"
          target="_blank"
          rel="noopener noreferrer"
          className="quick-action-btn qa-telegram"
        >
          <div className="qa-icon-ring">
            <TelegramKomunitiIcon />
          </div>
          <div className="qa-text">
            <span className="quick-action-label">Telegram</span>
            <span className="qa-sub">Grup Komuniti</span>
          </div>
          <span className="qa-arrow">›</span>
        </a>
        <a
          href="https://whatsapp.com/channel/0029Vb7cSULCxoAtcGaunK37"
          target="_blank"
          rel="noopener noreferrer"
          className="quick-action-btn qa-whatsapp"
        >
          <div className="qa-icon-ring">
            <WhatsAppKomunitiIcon />
          </div>
          <div className="qa-text">
            <span className="quick-action-label">WhatsApp</span>
            <span className="qa-sub">Grup Komuniti</span>
          </div>
          <span className="qa-arrow">›</span>
        </a>
        <a
          href={mainWhatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="quick-action-btn qa-admin"
        >
          <div className="qa-icon-ring">
            <AdminIcon />
          </div>
          <div className="qa-text">
            <span className="quick-action-label">Admin</span>
            <span className="qa-sub">Support 24/7</span>
          </div>
          <span className="qa-arrow">›</span>
        </a>
      </div>

      {/* ===== 1. INCOME SHOWCASE ===== */}
      <div className="section-title-bar">
        <h2>📊 Pendapatan Agent Sebenar</h2>
      </div>
      <p className="section-subtitle-bar">Contoh pendapatan mingguan agent kami</p>
      <div className="income-marquee-wrapper">
        <div className="income-marquee-track">
          {/* Original set */}
          {displayShowcase.map((agent, i) => (
            <div key={`a-${i}`} className="income-card">
              <div className="income-card-top">
                <div className="income-avatar-ring">
                  <Image
                    src={agent.avatar}
                    alt={agent.name}
                    width={48}
                    height={48}
                    className="income-avatar-img"
                    unoptimized
                  />
                </div>
                <div className="income-info">
                  <div className="income-name">{agent.name}</div>
                  <div className="income-role">{agent.role}</div>
                </div>
                <div className="income-growth">{agent.growth}</div>
              </div>
              <div className="income-amount">
                <span className="income-value">{agent.income}</span>
                <span className="income-period">{agent.period}</span>
              </div>
              <div className="income-bar">
                <div className="income-bar-fill" style={{ width: `${agent.bar}%` }} />
              </div>
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {displayShowcase.map((agent, i) => (
            <div key={`b-${i}`} className="income-card" aria-hidden="true">
              <div className="income-card-top">
                <div className="income-avatar-ring">
                  <Image
                    src={agent.avatar}
                    alt=""
                    width={48}
                    height={48}
                    className="income-avatar-img"
                    unoptimized
                  />
                </div>
                <div className="income-info">
                  <div className="income-name">{agent.name}</div>
                  <div className="income-role">{agent.role}</div>
                </div>
                <div className="income-growth">{agent.growth}</div>
              </div>
              <div className="income-amount">
                <span className="income-value">{agent.income}</span>
                <span className="income-period">{agent.period}</span>
              </div>
              <div className="income-bar">
                <div className="income-bar-fill" style={{ width: `${agent.bar}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== 2. STEPS PROCESS ===== */}
      <div className="section-title-bar">
        <h2>🏆 Langkah Jadi Agent</h2>
      </div>
      <p className="section-subtitle-bar">Mudah je, 4 langkah sahaja</p>
      <div className="steps-section">
        {agentSteps.map((step, i) => (
          <div key={i} className="step-item">
            <div className="step-icon-wrapper">
              <div className="step-number">{step.num}</div>
              <div className="step-icon">{step.icon}</div>
            </div>
            <div className="step-content">
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
            </div>
            {i < agentSteps.length - 1 && <div className="step-connector" />}
          </div>
        ))}
      </div>

      {/* ===== 3. BENEFITS SHOWCASE ===== */}
      <div className="section-title-bar">
        <h2>🔥 Kelebihan Eksklusif</h2>
      </div>
      <p className="section-subtitle-bar">Kenapa ramai pilih jadi agent CM8</p>
      <div className="benefits-showcase">
        {exclusiveBenefits.map((b, i) => (
          <div key={i} className="exc-benefit-card" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="exc-benefit-icon">{b.icon}</div>
            <h3 className="exc-benefit-title">{b.title}</h3>
            <p className="exc-benefit-desc">{b.desc}</p>
          </div>
        ))}
      </div>

      {/* ===== 4. LIVE ACTIVITY FEED ===== */}
      <div className="section-title-bar">
        <h2>📱 Aktiviti Semasa</h2>
      </div>
      <div className="live-feed-wrapper">
        <div className="live-feed-header">
          <span className="live-feed-pulse">
            <span className="pulse-dot" /> LIVE
          </span>
          <span className="live-feed-count">500+ agent aktif sekarang</span>
        </div>
        <div className="live-feed-viewport">
          <div className="live-feed-scroll">
            {[...liveFeedItems, ...liveFeedItems].map((item, i) => (
              <div key={i} className={`live-feed-item feed-${item.type}`}>
                <span className="feed-icon">
                  {item.type === 'join' ? '👤' : item.type === 'commission' ? '💰' : '🏆'}
                </span>
                <span className="feed-text">{item.text}</span>
                <span className="feed-time">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== PROMO CARDS (Weekly Bonus / Rollover / Special Event) ===== */}
      <div className="section-title-bar">
        <h2>🎁 Promotions</h2>
      </div>
      <div className="promo-grid">
        {displayPromos.map((card, i) => (
          <div key={i} className={`promo-card${card.highlight ? ' highlight' : ''}`}>
            <div className="promo-card-header">
              <div className="promo-card-icon">{card.icon}</div>
              <div className="promo-card-title">{card.title}</div>
            </div>
            <ul className="promo-card-list">
              {card.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
            <a
              href={card.ctaLink}
              className={`btn ${card.highlight ? 'btn-gradient' : 'btn-outline'}`}
              target={card.ctaLink.startsWith('http') ? '_blank' : undefined}
              rel={card.ctaLink.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {card.cta}
            </a>
          </div>
        ))}
      </div>

      {/* ===== GAME PROVIDERS ===== */}
      <div className="section-title-bar">
        <h2>Top Game Providers</h2>
      </div>
      <p className="section-subtitle-bar">High Win Rate • Smooth Gameplay</p>
      <div className="provider-section">
        <div className="provider-grid">
          {displayProviders.map((p, i) => (
            <a
              key={i}
              href={mainWhatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="provider-tile"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.img} alt={p.name} className="provider-tile-logo" />
              <div className="provider-tile-name">{p.name}</div>
            </a>
          ))}
        </div>
      </div>

      {/* ===== COMMISSION STRUCTURE ===== */}
      <div className="section-title-bar">
        <h2>💎 Komisyen Agent</h2>
      </div>
      <div className="commission-grid">
        {displayCommissions.map((c, i) => (
          <div key={i} className={`commission-card${c.popular ? ' popular' : ''}`}>
            {c.popular && <div className="commission-badge">Popular</div>}
            <div className="commission-label">{c.label}</div>
            <div className="commission-rate">{c.rate}</div>
            <div className="commission-desc">{c.desc}</div>
            <ul className="commission-features">
              {c.features.map((f, j) => (
                <li key={j}>{f}</li>
              ))}
            </ul>
            <a
              href={mainWhatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gradient"
            >
              Daftar Sekarang
            </a>
          </div>
        ))}
      </div>

      {/* ===== TESTIMONIALS ===== */}
      <section className="testimonials-section-v2">
        <div className="section-header">
          <div className="section-tag">Testimoni</div>
          <h2 className="section-title">Apa Kata Agent Kami</h2>
          <p className="section-subtitle">Dengar sendiri pengalaman mereka bersama CM8</p>
        </div>
        <div className="testimonials-grid-v2">
          {displayTestimonials.map((t, i) => (
            <div key={i} className="testi-card-v2">
              <div className="testi-quote-mark">&ldquo;</div>
              <div className="testi-stars-v2">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <span key={j} className="testi-star">
                    ★
                  </span>
                ))}
              </div>
              <p className="testi-text-v2">{t.text}</p>
              <div className="testi-footer-v2">
                <div className="testi-avatar-ring-v2">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    width={48}
                    height={48}
                    className="testi-avatar-img-v2"
                    unoptimized
                  />
                </div>
                <div className="testi-author-info-v2">
                  <h4 className="testi-name-v2">{t.name}</h4>
                  <p className="testi-role-v2">{t.role}</p>
                </div>
                <div className="testi-income-badge">{t.income}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== WHY CM8 ===== */}
      <div className="why-section">
        <h2>Why CM8 VVIP?</h2>
        <ul className="why-checklist">
          {whyItems.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
        <div className="why-actions">
          <a
            href={mainWhatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-gradient btn-lg"
          >
            Join Now
          </a>
          <a
            href="https://wa.me/60123456789"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-lg"
          >
            Contact Admin
          </a>
        </div>
      </div>

      {/* ===== FAQ ===== */}
      <div className="section-title-bar">
        <h2>❓ Soalan Lazim</h2>
      </div>
      <div className="faq-section">
        <div className="faq-list">
          {displayFaqs.map((f, i) => (
            <details key={i} className="faq-item">
              <summary className="faq-question">
                {f.q}
                <span className="faq-icon">+</span>
              </summary>
              <div className="faq-answer">
                <div className="faq-answer-inner">{f.a}</div>
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* ===== CTA ===== */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Sedia Untuk Mula Jana Pendapatan?</h2>
          <p className="cta-subtitle">
            Daftar sebagai agent CM8 hari ini dan mula menikmati komisyen tertinggi di pasaran.
          </p>
          <a
            href={mainWhatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-white btn-lg"
          >
            Daftar Sebagai Agent →
          </a>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="site-footer">
        <div className="footer-seo-links">
          <h3>Panduan & Info</h3>
          <div className="footer-links-grid">
            <Link href="/agent-judi">Agent Judi Online</Link>
            <Link href="/buat-duit-online">Buat Duit Online</Link>
            <Link href="/hack-slot-malaysia">Hack Slot Malaysia</Link>
            <Link href="/komisen-tanpa-modal">Komisen Tanpa Modal</Link>
            <Link href="/cm8">Platform CM8</Link>
            <Link href="/cm8-play">CM8 Play</Link>
            <Link href="/kiosk-mega888">Kiosk Mega888</Link>
            <Link href="/kiosk-918kiss">Kiosk 918Kiss</Link>
          </div>
        </div>
        <div className="footer-inner">
          <span>© 2026 CM8 VVIP</span>
          <span>•</span>
          <Link href="/about">Tentang</Link>
          <span>•</span>
          <Link href="/benefits">Kelebihan</Link>
          <span>•</span>
          <Link href="/blog">Blog</Link>
          <span>•</span>
          <div className="footer-social">
            <a
              href="https://wa.me/60123456789"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
            <a
              href="https://t.me/+aK5iX_FE_b9kMzQ1"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
      {/* ===== 6. SEO CONTENT SECTION (Hidden Gem) ===== */}
      <div className="seo-content-section">
        <div className="seo-container">
          <h2>Cara Buat Duit Online Tanpa Modal dengan CM8 VVIP</h2>
          <div className="seo-grid">
            <div className="seo-item">
              <h3>💰 Income Pasif Seumur Hidup</h3>
              <p>
                Ramai yang mencari cara{' '}
                <Link href="/buat-duit-online">
                  <strong>buat duit online</strong>
                </Link>{' '}
                atau{' '}
                <Link href="/komisen-tanpa-modal">
                  <strong>income pasif tanpa modal</strong>
                </Link>{' '}
                tetapi tertipu dengan skim cepat kaya. Di CM8 VVIP, anda menjadi{' '}
                <Link href="/agent-judi">rakan kongsi (agent)</Link> sebenar. Setiap kali pemain
                anda main slot game seperti{' '}
                <Link href="/kiosk-mega888">
                  <strong>Mega888</strong>
                </Link>
                ,{' '}
                <Link href="/kiosk-918kiss">
                  <strong>918Kiss</strong>
                </Link>
                , atau <strong>Pussy888</strong>, anda dapat komisyen.
              </p>
            </div>
            <div className="seo-item">
              <h3>🎰 Tips & &quot;Hack Slot&quot; Strategy</h3>
              <p>
                Sebagai agent, kami bekalkan anda dengan data <strong>RTP Live</strong> dan scanner
                terkini. Walaupun tiada istilah sebenar untuk{' '}
                <Link href="/hack-slot-malaysia">
                  <strong>hack slot</strong>
                </Link>{' '}
                (kerana sistem server-side), analisis data kami membantu pemain anda menang lebih
                kerap — bermakna mereka deposit lebih kerap, dan komisyen anda naik!
              </p>
            </div>
            <div className="seo-item">
              <h3>✅ Daftar Agent Slot Percuma</h3>
              <p>
                Berbeza dengan platform lain, pendaftaran{' '}
                <Link href="/cm8">
                  <strong>CM8 Agent</strong>
                </Link>{' '}
                adalah 100% percuma.{' '}
                <Link href="/komisen-tanpa-modal">
                  <strong>Buat duit tanpa modal</strong>
                </Link>{' '}
                hari ini. Kami sediakan bahan marketing, ayat copyayat, dan bimbingan penuh untuk
                anda mula menjana RM1,000 – RM5,000 seminggu.{' '}
                <Link href="/cm8-play">Cuba CM8 Play</Link> sekarang.
              </p>
            </div>
          </div>
          <p className="seo-footer-text">
            Sertai 10,000+ rakyat Malaysia yang telah berjaya mengubah hidup dengan platform
            affiliate #1 ini. Slot game online, live casino, dan sports betting — semua dalam satu
            sistem canggih CM8.
          </p>
        </div>
      </div>
    </>
  )
}
