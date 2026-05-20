import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const DRAW_TARGET = new Date('2026-05-22T17:00:00+02:00')

function calcTimeLeft() {
  const diff = DRAW_TARGET - Date.now()

  if (diff <= 0) return null

  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  }
}

function Digit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        key={value}
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="min-w-[54px] sm:min-w-[72px] text-center py-2.5 px-2 rounded-xl"
        style={{
          background: 'rgba(46,115,168,0.06)',
          border: '1px solid rgba(46,115,168,0.2)',
          fontSize: 'clamp(1.25rem, 3.4vw, 2rem)',
          fontWeight: 800,
          color: '#2E73A8',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {String(value).padStart(2, '0')}
      </motion.div>
      <span className="mt-1.5 text-[10px] sm:text-xs uppercase tracking-widest text-gray-400">{label}</span>
    </div>
  )
}

export default function DrawCountdownTimer({ compact = false }) {
  const [timeLeft, setTimeLeft] = useState(calcTimeLeft)

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(calcTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div>
      <div className="text-center mb-3">
        <p className="text-xs uppercase tracking-widest text-gray-400">Live Team Draw</p>
        <p className="text-sm sm:text-base font-semibold text-gray-300">Countdown to Friday 22 May, 17:00 SAST</p>
      </div>

      {timeLeft ? (
        <div className={`flex items-start justify-center ${compact ? 'gap-2 sm:gap-3' : 'gap-3 sm:gap-5'}`}>
          <Digit value={timeLeft.days} label="Days" />
          <span className="text-2xl sm:text-3xl font-bold text-gray-500 mt-1.5">:</span>
          <Digit value={timeLeft.hours} label="Hours" />
          <span className="text-2xl sm:text-3xl font-bold text-gray-500 mt-1.5">:</span>
          <Digit value={timeLeft.minutes} label="Minutes" />
          <span className="text-2xl sm:text-3xl font-bold text-gray-500 mt-1.5">:</span>
          <Digit value={timeLeft.seconds} label="Seconds" />
        </div>
      ) : (
        <p className="text-center text-lg font-black neon-text">The live draw has started.</p>
      )}
    </div>
  )
}
