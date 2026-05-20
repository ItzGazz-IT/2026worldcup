import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import CountdownTimer from '../components/CountdownTimer'
import GlassCard from '../components/GlassCard'
import { useApp } from '../context/AppContext'
import { PRIZE_POOL } from '../data/players'

// Stagger helper
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }
const fadeUp  = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }

export default function Home() {
  const { PLAYERS, drawState, getPlayerTeams, eliminated } = useApp()

  return (
    <div className="min-h-screen bg-grid">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 pt-16 pb-20 text-center">
        {/* Glow blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #2E73A8, transparent 70%)' }} />

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="relative z-10"
        >
          <p className="text-xs tracking-[0.4em] text-gray-400 uppercase mb-4">
            Source IT Services Presents
          </p>
          <h1 className="text-5xl sm:text-7xl font-black mb-3 leading-none gradient-text">
            WORLD CUP
          </h1>
          <h2 className="text-5xl sm:text-7xl font-black mb-6 leading-none"
            style={{ color: '#2E73A8', textShadow: '0 0 40px rgba(46,115,168,0.5)' }}>
            2026 ⚽
          </h2>
          <p className="text-lg text-gray-500 mb-10 max-w-xl mx-auto">
            The ultimate office sweepstake. 48 teams. 10 players. One champion.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/draw" className="btn-neon text-base">
              🎲 Join the Draw
            </Link>
            <Link to="/leaderboard" className="btn-outline text-base">
              🏆 Leaderboard
            </Link>
          </div>
        </motion.div>

        {/* Floating balls */}
        {['⚽','🏆','⭐','🎯'].map((e, i) => (
          <motion.span
            key={i}
            className="absolute text-2xl sm:text-4xl opacity-20 select-none pointer-events-none"
            style={{
              left: `${10 + i * 25}%`,
              top:  `${15 + (i % 2) * 30}%`,
            }}
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
          >
            {e}
          </motion.span>
        ))}
      </section>

      <div className="max-w-6xl mx-auto px-4 pb-20 space-y-16">

        {/* ── Countdown ───────────────────────────────────────────────────── */}
        <GlassCard className="p-8" delay={0.1}>
          <p className="text-center text-xs uppercase tracking-widest text-gray-400 mb-6">
            ⏱ Countdown to Kick-Off — June 11, 2026
          </p>
          <CountdownTimer />
        </GlassCard>

        {/* ── Prize Pool ──────────────────────────────────────────────────── */}
        <motion.section variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeUp} className="text-2xl font-black text-center mb-8">
            💰 <span className="gradient-text">Prize Pool</span>
            <span className="ml-2 text-lg text-gray-400">— R{PRIZE_POOL.total.toLocaleString()}</span>
          </motion.h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {PRIZE_POOL.prizes.map((prize, i) => (
              <motion.div
                key={prize.position}
                variants={fadeUp}
                className="rounded-xl p-5 text-center"
                style={{
                  background: `linear-gradient(135deg, ${prize.color}18, ${prize.color}06)`,
                  border: `1px solid ${prize.color}35`,
                }}
              >
                <div className="text-3xl mb-2">{prize.icon}</div>
                <p className="text-xs text-gray-400 mb-1">{prize.label}</p>
                <p className="text-2xl font-black" style={{ color: prize.color }}>
                  R{prize.amount.toLocaleString()}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── Draw Status ─────────────────────────────────────────────────── */}
        {!drawState.isStarted && (
          <GlassCard className="p-6 text-center" delay={0.2}>
            <p className="text-4xl mb-3">🎲</p>
            <p className="text-lg font-bold text-gray-300 mb-2">Draw hasn't started yet</p>
            <p className="text-sm text-gray-500 mb-5">Head to the Live Draw page to begin the sweepstake.</p>
            <Link to="/draw" className="btn-neon">Start the Draw</Link>
          </GlassCard>
        )}

        {drawState.isStarted && (
          <div>
            <h2 className="text-2xl font-black text-center mb-8">
              👥 <span className="gradient-text">Our Players</span>
            </h2>
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4"
            >
              {PLAYERS.map((player, i) => {
                const teams      = getPlayerTeams(player.id)
                const aliveCount = teams.filter(t => !eliminated.includes(t.id)).length
                return (
                  <motion.div
                    key={player.id}
                    variants={fadeUp}
                    className="rounded-xl p-4 text-center"
                    style={{
                      backdropFilter: 'blur(12px)',
                      background: `${player.color}0a`,
                      border: `1px solid ${player.color}25`,
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl mx-auto mb-2"
                      style={{ background: `${player.color}20`, border: `1px solid ${player.color}40` }}
                    >
                      {player.avatar}
                    </div>
                    <p className="font-bold text-sm" style={{ color: player.color }}>{player.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {drawState.isComplete
                        ? `${aliveCount}/${teams.length} alive`
                        : `${teams.length} teams`}
                    </p>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        )}

        {/* ── Quick Links ─────────────────────────────────────────────────── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {[
            { to: '/draw',        icon: '🎲', title: 'Live Draw',   desc: 'Watch teams get assigned in real-time' },
            { to: '/leaderboard', icon: '🏆', title: 'Leaderboard', desc: 'See who\'s winning the prize pool' },
            { to: '/teams',       icon: '🌍', title: 'All Teams',   desc: 'Browse all 48 World Cup nations' },
          ].map((card, i) => (
            <motion.div key={card.to} variants={fadeUp}>
              <Link
                to={card.to}
                className="block p-6 rounded-xl transition-all duration-300 group"
                style={{
                  backdropFilter: 'blur(12px)',
                  background: 'rgba(255,255,255,0.92)',
                  border: '1px solid #c7d3e0',
                  boxShadow: '0 10px 24px rgba(22,58,99,0.08)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(46,115,168,0.3)'
                  e.currentTarget.style.transform = 'translateY(-3px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#c7d3e0'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div className="text-3xl mb-3">{card.icon}</div>
                <h3 className="font-bold text-white mb-1">{card.title}</h3>
                <p className="text-sm text-gray-500">{card.desc}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </div>
  )
}
