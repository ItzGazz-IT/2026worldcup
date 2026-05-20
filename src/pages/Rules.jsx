import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { PRIZE_POOL } from '../data/players'

const cardAnim = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
}

function RuleCard({ icon, title, children, delay = 0 }) {
  return (
    <motion.section
      variants={cardAnim}
      initial="hidden"
      animate="show"
      transition={{ duration: 0.35, delay }}
      className="rounded-2xl p-5 sm:p-6"
      style={{
        background: 'rgba(255,255,255,0.94)',
        border: '1px solid rgba(199,211,224,0.95)',
        boxShadow: '0 10px 24px rgba(22,58,99,0.07)',
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl" aria-hidden="true">{icon}</span>
        <h2 className="text-xl sm:text-2xl font-black text-white">{title}</h2>
      </div>
      <div className="space-y-2 text-sm sm:text-base text-gray-300">
        {children}
      </div>
    </motion.section>
  )
}

export default function Rules() {
  const { PLAYERS } = useApp()

  return (
    <div className="min-h-screen bg-grid py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">

        <motion.header
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl p-6 sm:p-8"
          style={{
            background: 'linear-gradient(135deg, rgba(230,242,250,0.96), rgba(245,247,250,0.96))',
            border: '1px solid rgba(199,211,224,1)',
          }}
        >
          <div
            className="absolute -top-24 -right-24 h-56 w-56 rounded-full opacity-30 blur-3xl"
            style={{ background: 'radial-gradient(circle, #2E73A8, transparent 65%)' }}
            aria-hidden="true"
          />
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Source IT Services</p>
          <h1 className="text-4xl sm:text-5xl font-black mb-2">
            <span className="gradient-text">Competition Rules</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-3xl">
            Quick guide to how the office sweepstake works. Everyone can view results live. Only admin can enter or edit scores.
          </p>
        </motion.header>

        <RuleCard icon="🎲" title="1) Team Draw" delay={0.05}>
          <p>The draw is random, but pot-balanced so everyone gets a fair spread of strong and weaker teams.</p>
          <p><strong>Step 1:</strong> Teams are separated into Pot 1 to Pot 4.</p>
          <p><strong>Step 2:</strong> Each player gets 1 team from each pot (4 guaranteed teams each).</p>
          <p><strong>Step 3:</strong> Extra teams are distributed randomly, so with 48 teams and {PLAYERS.length} players, 8 players get 5 teams and 2 players get 4 teams.</p>
          <p><strong>Step 4:</strong> The live draw reveals assignments one by one until all teams are allocated.</p>
          <p>Once the draw is locked, assignments should not be changed unless everyone agrees.</p>
        </RuleCard>

        <RuleCard icon="⚽" title="2) Match Results & Scoring" delay={0.1}>
          <p>Points are awarded per match result for the team owner:</p>
          <p><strong>Win = 3 points</strong>, <strong>Draw = 1 point</strong>, <strong>Loss = 0 points</strong>.</p>
          <p>Group-stage and knockout matches can both contribute to leaderboard points.</p>
          <p>Knockout points only count once the teams are selected for that knockout fixture.</p>
        </RuleCard>

        <RuleCard icon="🧾" title="3) Results Management" delay={0.15}>
          <p>All users can view fixtures, standings, and entered results on the public Fixtures & Results page.</p>
          <p>Only the Admin page can add, edit, or clear scores.</p>
          <p>Updates save automatically and sync for everyone when Firebase is configured.</p>
        </RuleCard>

        <RuleCard icon="🏆" title="4) Leaderboard & Tiebreakers" delay={0.2}>
          <p>Leaderboard rank is sorted by total points.</p>
          <p>If players are tied on points, teams still alive in the tournament are used as the tiebreaker.</p>
          <p>Group tables follow standard order: points, goal difference, goals scored, then alphabetical.</p>
        </RuleCard>

        <motion.section
          variants={cardAnim}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.35, delay: 0.25 }}
          className="rounded-2xl p-5 sm:p-6"
          style={{
            background: 'rgba(255,255,255,0.94)',
            border: '1px solid rgba(199,211,224,0.95)',
            boxShadow: '0 10px 24px rgba(22,58,99,0.07)',
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl" aria-hidden="true">💰</span>
            <h2 className="text-xl sm:text-2xl font-black text-white">5) Prize Pool</h2>
          </div>
          <p className="text-sm sm:text-base text-gray-300 mb-4">Total prize pool: <strong>R{PRIZE_POOL.total.toLocaleString()}</strong></p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PRIZE_POOL.prizes.map((prize) => (
              <div
                key={prize.position}
                className="rounded-xl p-3"
                style={{
                  background: `${prize.color}10`,
                  border: `1px solid ${prize.color}35`,
                }}
              >
                <p className="text-sm font-bold" style={{ color: prize.color }}>
                  {prize.icon} {prize.label}
                </p>
                <p className="text-lg font-black text-white">R{prize.amount.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.3 }}
          className="flex flex-wrap gap-3"
        >
          <Link to="/fixtures" className="btn-neon">📅 View Fixtures & Results</Link>
          <Link to="/leaderboard" className="btn-outline">🏆 View Leaderboard</Link>
        </motion.div>
      </div>
    </div>
  )
}
