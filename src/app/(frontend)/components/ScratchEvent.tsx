'use client'

import { useState } from 'react'

interface ScratchCardProps {
  index: number
  onScratch: (index: number, isWinner: boolean) => void
  isScratched: boolean
  isWinner: boolean
}

function ScratchCard({ index, onScratch, isScratched, isWinner }: ScratchCardProps) {
  const [scratching, setScratching] = useState(false)

  const handleClick = () => {
    if (!isScratched && !scratching) {
      setScratching(true)
      const win = Math.random() < 0.6
      setTimeout(() => {
        onScratch(index, win)
        setScratching(false)
      }, 500)
    }
  }

  return (
    <div 
      className={`scratch-card ${isScratched ? 'scratched' : ''} ${isScratched && isWinner ? 'winner' : ''}`}
      onClick={handleClick}
    >
      {isScratched ? (
        isWinner ? <span>🎉</span> : <span>😔</span>
      ) : (
        <span>🎫</span>
      )}
    </div>
  )
}

export default function ScratchEvent() {
  const [formData, setFormData] = useState({ whatsapp: '', playerId: '', code: 'CM8BEST' })
  const [submitted, setSubmitted] = useState(false)
  const [cards, setCards] = useState<{scratched: boolean; winner: boolean}[]>(
    Array(9).fill({ scratched: false, winner: false })
  )
  const [winnings, setWinnings] = useState(0)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.whatsapp && formData.playerId && formData.code === 'CM8BEST') {
      setSubmitted(true)
    }
  }

  const handleScratch = (index: number, isWinner: boolean) => {
    const newCards = [...cards]
    newCards[index] = { scratched: true, winner: isWinner }
    setCards(newCards)
    if (isWinner) setWinnings(prev => prev + 20)
  }

  const resetGame = () => {
    setCards(Array(9).fill({ scratched: false, winner: false }))
    setWinnings(0)
  }

  return (
    <div className="scratch-container">
      <div className="scratch-hero">
        <div className="hero-badge">🎰 LIVE NOW</div>
        <h1>CM8 SCRATCH EVENT</h1>
        <p className="prize-text">Win <span>RM20</span> Every Win!</p>
        <div className="event-tags">
          <span className="tag">🎫 9 Boxes</span>
          <span className="tag">🏆 50 Winners</span>
          <span className="tag">📈 60% Win Rate</span>
        </div>
      </div>

      <div className="timer-section">
        <div className="timer-box">
          <div className="timer-label">START</div>
          <div className="timer-value">1:00 PM</div>
        </div>
        <div className="timer-box">
          <div className="timer-label">END</div>
          <div className="timer-value">5:00 PM</div>
        </div>
        <div className="timer-box highlight">
          <div className="timer-label">PRIZE</div>
          <div className="timer-value">RM20</div>
        </div>
      </div>

      {!submitted && (
        <div className="form-section">
          <h2>🎫 Join Event</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>WhatsApp Number</label>
              <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} placeholder="+60XXXXXXXXX" required />
            </div>
            <div className="form-group">
              <label>CM8 Player ID</label>
              <input type="text" name="playerId" value={formData.playerId} onChange={handleInputChange} placeholder="Your Player ID" required />
            </div>
            <div className="form-group">
              <label>Entry Code</label>
              <input type="text" name="code" value={formData.code} onChange={handleInputChange} placeholder="CM8BEST" className="code-input" required />
            </div>
            <button type="submit" className="submit-btn">▶ Enter Event</button>
          </form>
        </div>
      )}

      {submitted && (
        <div className="scratch-section">
          <h3>🎰 Scratch to Win!</h3>
          <div className="scratch-grid">
            {cards.map((card, index) => (
              <ScratchCard key={index} index={index} onScratch={handleScratch} isScratched={card.scratched} isWinner={card.winner} />
            ))}
          </div>
          {winnings > 0 && (
            <div className="winner-announcement">
              🎉 Congratulations! You won <span>RM{winnings}</span>!
            </div>
          )}
          <button onClick={resetGame} className="reset-btn">🔄 Try Again</button>
        </div>
      )}

      <div className="claim-section">
        <h3>🏆 Winner Claim</h3>
        <p>If you win, WhatsApp us immediately:</p>
        <a href="https://wasap.my/60178182320" className="whatsapp-link">📱 wasap.my/60178182320</a>
        <p className="claim-note">Send screenshot of your winning result</p>
      </div>

      <style jsx>{`
        .scratch-container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: 'Poppins', sans-serif; }
        .scratch-hero { text-align: center; padding: 30px 20px; background: linear-gradient(180deg, rgba(212,175,55,0.1) 0%, transparent 100%); border-radius: 16px; margin-bottom: 20px; }
        .hero-badge { display: inline-block; background: linear-gradient(135deg, #00aa00, #00ff00); color: #000; padding: 8px 20px; border-radius: 25px; font-weight: 700; font-size: 14px; margin-bottom: 15px; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0%, 100% { box-shadow: 0 0 10px #00ff00; } 50% { box-shadow: 0 0 25px #00ff00; } }
        .scratch-hero h1 { font-size: 32px; background: linear-gradient(135deg, #d4af37, #fff, #d4af37); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 10px; }
        .prize-text { font-size: 18px; color: #aaa; margin-bottom: 15px; }
        .prize-text span { font-size: 28px; font-weight: 900; color: #d4af37; }
        .event-tags { display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; }
        .tag { background: rgba(255,255,255,0.1); padding: 6px 14px; border-radius: 20px; font-size: 12px; border: 1px solid #333; }
        .timer-section { display: flex; justify-content: center; gap: 15px; margin-bottom: 20px; }
        .timer-box { background: rgba(26,26,26,0.9); border: 1px solid #333; border-radius: 12px; padding: 12px 20px; text-align: center; }
        .timer-box.highlight { border-color: #d4af37; background: rgba(212,175,55,0.1); }
        .timer-label { font-size: 10px; color: #666; text-transform: uppercase; letter-spacing: 1px; }
        .timer-value { font-size: 16px; font-weight: 700; color: #d4af37; margin-top: 4px; }
        .form-section, .scratch-section, .claim-section { background: rgba(26,26,26,0.9); border-radius: 16px; padding: 25px; border: 1px solid #333; margin-bottom: 20px; }
        .form-section h2, .scratch-section h3, .claim-section h3 { text-align: center; color: #d4af37; margin-bottom: 20px; font-size: 20px; }
        .form-group { margin-bottom: 15px; }
        .form-group label { display: block; font-size: 12px; color: #888; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px; }
        .form-group input { width: 100%; padding: 14px 16px; background: #0a0a0a; border: 1px solid #333; border-radius: 10px; color: #fff; font-size: 14px; }
        .form-group input:focus { outline: none; border-color: #d4af37; box-shadow: 0 0 15px rgba(212,175,55,0.3); }
        .code-input { text-align: center; font-weight: 700; font-size: 18px; letter-spacing: 4px; border-color: #d4af37 !important; }
        .submit-btn { width: 100%; padding: 16px; background: linear-gradient(135deg, #d4af37, #f4e4a6, #d4af37); border: none; border-radius: 12px; font-size: 16px; font-weight: 700; color: #0d0d0d; cursor: pointer; text-transform: uppercase; letter-spacing: 2px; margin-top: 10px; }
        .scratch-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px; }
        .scratch-card { aspect-ratio: 1; background: linear-gradient(135deg, #1a1a1a, #2d2d2d); border-radius: 12px; display: flex; align-items: center; justify-content: center; border: 2px solid #d4af37; cursor: pointer; transition: all 0.3s; font-size: 32px; }
        .scratch-card:hover:not(.scratched) { box-shadow: 0 0 25px rgba(212,175,55,0.6); transform: scale(1.02); }
        .scratch-card.scratched.winner { background: linear-gradient(135deg, #00aa00, #00ff00); border-color: #00ff00; }
        .scratch-card.scratched:not(.winner) { background: #333; border-color: #555; opacity: 0.7; }
        .winner-announcement { text-align: center; padding: 20px; background: rgba(0,170,0,0.2); border: 2px solid #00ff00; border-radius: 12px; margin-bottom: 15px; font-size: 18px; color: #fff; }
        .winner-announcement span { color: #00ff00; font-weight: 900; font-size: 24px; }
        .reset-btn { width: 100%; padding: 12px; background: transparent; border: 1px solid #d4af37; border-radius: 8px; color: #d4af37; font-size: 14px; cursor: pointer; }
        .claim-section { text-align: center; }
        .claim-section p { color: #aaa; margin-bottom: 10px; }
        .whatsapp-link { display: inline-block; color: #d4af37; font-weight: 600; font-size: 16px; text-decoration: none; padding: 12px 24px; background: rgba(212,175,55,0.1); border-radius: 8px; border: 1px solid #d4af37; }
        .claim-note { font-size: 12px !important; color: #666 !important; margin-top: 10px !important; }
      `}</style>
    </div>
  )
}
