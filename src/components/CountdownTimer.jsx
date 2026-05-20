import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// World Cup 2026 kicks off June 11, 2026
const WC_START = new Date('2026-06-11T18:00:00Z')

function calcTimeLeft() {
  const diff = WC_START - Date.now()
  if (diff <= 0) return null
  return {
    days:    Math.floor(diff / 86_400_000),
    hours:   Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000)  / 60_000),
    seconds: Math.floor((diff % 60_000)     / 1_000),
  }
}

function Digit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        key={value}
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0,  opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="min-w-[64px] sm:min-w-[80px] text-center py-3 px-2 rounded-xl"
        style={{
          background: 'rgba(46,115,168,0.06)',
          border: '1px solid rgba(46,115,168,0.2)',
          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
          fontWeight: 800,
          color: '#2E73A8',
          textShadow: '0 0 12px rgba(46,115,168,0.5)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {String(value).padStart(2, '0')}
      </motion.div>
      <span className="mt-1.5 text-xs uppercase tracking-widest text-gray-400">{label}</span>
    </div>
  )
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(calcTimeLeft)

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(calcTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  if (!timeLeft) {
    return (
      <div className="text-center py-4">
        <p className="text-2xl font-bold neon-text animate-neon-pulse">🏆 The World Cup has started!</p>
      </div>
    )
  }

  return (
    <div className="flex items-start justify-center gap-3 sm:gap-5">
      <Digit value={timeLeft.days}    label="Days"    />
      <span className="text-3xl font-bold text-gray-500 mt-2">:</span>
      <Digit value={timeLeft.hours}   label="Hours"   />
      <span className="text-3xl font-bold text-gray-500 mt-2">:</span>
      <Digit value={timeLeft.minutes} label="Minutes" />
      <span className="text-3xl font-bold text-gray-500 mt-2">:</span>
      <Digit value={timeLeft.seconds} label="Seconds" />
    </div>
  )
}
