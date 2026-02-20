'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import './floating-socials.css'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function FloatingSocials() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Yo! 👋 Aku AI CM8 bro. Ada apa nak tanya? Nak daftar, nak tahu komisyen, atau nak link admin — tanya je terus!',
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Drag state
  const isDragging = useRef(false)
  const dragStartPos = useRef({ x: 0, y: 0 })
  const dragStartTime = useRef(0)
  const hasMoved = useRef(false)
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null)

  const toggleOpen = () => {
    // Only open if we didn't just finish dragging
    if (!hasMoved.current) {
      setIsOpen(!isOpen)
    }
    hasMoved.current = false
  }

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Touch drag handlers
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (isOpen) return // Don't drag when chat is open
      const touch = e.touches[0]
      isDragging.current = true
      hasMoved.current = false
      dragStartTime.current = Date.now()
      dragStartPos.current = {
        x: touch.clientX - (position?.x ?? window.innerWidth - 80),
        y: touch.clientY - (position?.y ?? window.innerHeight - 114),
      }
    },
    [isOpen, position],
  )

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging.current || isOpen) return
      e.preventDefault()
      const touch = e.touches[0]
      const newX = touch.clientX - dragStartPos.current.x
      const newY = touch.clientY - dragStartPos.current.y

      // Check if moved beyond threshold (8px) to distinguish tap vs drag
      const dx = touch.clientX - (dragStartPos.current.x + (position?.x ?? window.innerWidth - 80))
      const dy =
        touch.clientY - (dragStartPos.current.y + (position?.y ?? window.innerHeight - 114))
      if (Math.sqrt(dx * dx + dy * dy) > 8) {
        hasMoved.current = true
      }

      // Clamp within viewport
      const btnSize = 62
      const clampedX = Math.max(8, Math.min(window.innerWidth - btnSize - 8, newX))
      const clampedY = Math.max(8, Math.min(window.innerHeight - btnSize - 86, newY)) // 86 = nav bar

      setPosition({ x: clampedX, y: clampedY })
    },
    [isOpen, position],
  )

  const handleTouchEnd = useCallback(() => {
    if (!isDragging.current) return
    isDragging.current = false

    if (!hasMoved.current) return // Was a tap, not a drag

    // Snap to nearest edge (left or right)
    setPosition((prev) => {
      if (!prev) return prev
      const midX = window.innerWidth / 2
      const btnSize = 62
      const snappedX = prev.x < midX ? 12 : window.innerWidth - btnSize - 12
      return { x: snappedX, y: prev.y }
    })
  }, [])

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!input.trim() || isTyping) return

    const userText = input.trim()
    setInput('')

    // Add user message to UI
    const newMessages: Message[] = [...messages, { role: 'user', content: userText }]
    setMessages(newMessages)
    setIsTyping(true)

    try {
      // Fetch AI response
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: newMessages }),
      })

      if (!res.ok) throw new Error('Network response was not ok')

      const data = await res.json()

      // Add AI message to UI
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
    } catch (error) {
      console.error('Chat error:', error)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Maaf, saya menghadapi masalah teknikal buat sementara waktu. Sila chat Admin VVIP kita ya.',
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend(e)
    }
  }

  // Build inline style for dragged position
  const containerStyle: React.CSSProperties = position
    ? {
        bottom: 'auto',
        right: 'auto',
        left: position.x,
        top: position.y,
        transition: isDragging.current ? 'none' : 'left 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
      }
    : {}

  return (
    <div
      className={`floating-socials-container ${position ? 'is-dragged' : ''}`}
      ref={containerRef}
      style={containerStyle}
    >
      {/* The expanded chat window */}
      <div className={`floating-menu ${isOpen ? 'is-open' : ''}`}>
        {/* Chat Header with quick social links */}
        <div className="floating-menu-header">
          <div className="fm-header-top">
            <h4 className="fm-title">
              <span className="fm-dot"></span> AI Assistant CM8
            </h4>
            <div className="fm-quick-links">
              <a
                href="https://whatsapp.com/channel/0029Vb7cSULCxoAtcGaunK37"
                target="_blank"
                rel="noopener noreferrer"
                title="WhatsApp Channel"
                className="fm-icon whatsapp-icon"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.025.507 3.932 1.395 5.608L.05 23.708a.5.5 0 00.606.606l6.1-1.345A11.937 11.937 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.758 0-3.442-.46-4.938-1.323l-.354-.21-3.67.808.823-3.607-.23-.367A9.935 9.935 0 012 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10z" />
                </svg>
              </a>
              <a
                href="https://t.me/+7qOP1Y8RQcthYjll"
                target="_blank"
                rel="noopener noreferrer"
                title="Telegram Group"
                className="fm-icon telegram-icon"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.892-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/share/17aHEYTnqo/"
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook Page"
                className="fm-icon facebook-icon"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>
          <p className="fm-subtitle">Sentiasa dalam talian 🟢</p>
        </div>

        {/* Chat Body */}
        <div className="fm-chat-body">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`fm-msg-row ${msg.role === 'user' ? 'fm-msg-user' : 'fm-msg-bot'}`}
            >
              <div className="fm-bubble">
                {msg.role === 'assistant' ? (
                  <ReactMarkdown
                    components={{
                      a: ({ node: _, ...props }) => (
                        <a {...props} target="_blank" rel="noopener noreferrer" />
                      ),
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="fm-msg-row fm-msg-bot">
              <div className="fm-bubble fm-typing">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="fm-chat-input-area">
          <input
            type="text"
            placeholder="Tulis mesej..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
            className="fm-input"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="fm-send-btn"
            aria-label="Send Message"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>

      {/* The main toggle button — draggable on mobile */}
      <button
        className={`floating-toggle-btn ${isOpen ? 'active' : ''}`}
        onClick={toggleOpen}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        aria-label="Toggle AI Chat"
      >
        <span className="btn-icon">
          {isOpen ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            // Realistic 3D Robot Avatar
            <div className="realistic-robot-avatar">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Robot.png"
                alt="AI Robot Assistant"
                className="robot-3d-img"
              />
            </div>
          )}
        </span>
      </button>

      {/* Tooltip bubble when closed */}
      {!isOpen && !position && <div className="floating-tooltip">💬 Chat AI CM8</div>}
    </div>
  )
}
