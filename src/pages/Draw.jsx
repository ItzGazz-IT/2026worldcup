import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { POT_CONFIG } from '../data/teams'
import FlagImage from '../components/FlagImage'
import GlassCard from '../components/GlassCard'
import DrawCountdownTimer from '../components/DrawCountdownTimer'
import { getDrawProgress } from '../utils/drawLogic'

const ADMIN_AUTH_KEY = 'wc2026_admin_authed'
const SPIN_SECS  = 3   // suspense seconds before the team is revealed
const REVEAL_SECS = 2  // seconds the reveal card is shown
const TOTAL_SECS  = SPIN_SECS + REVEAL_SECS // 5 seconds per team

// ── Sound stub ────────────────────────────────────────────────────────────────
function playDrawSound() {}

// ── Confetti burst ────────────────────────────────────────────────────────────
function fireConfetti() {
  confetti({ particleCount: 140, spread: 80, origin: { y: 0.5 }, colors: ['#2E73A8','#163A63','#3AA0D8','#ffffff','#FFD700'] })
  setTimeout(() => confetti({ particleCount: 70, angle: 60,  spread: 55, origin: { x: 0, y: 0.55 }, colors: ['#3AA0D8','#2E73A8','#ffffff'] }), 220)
  setTimeout(() => confetti({ particleCount: 70, angle: 120, spread: 55, origin: { x: 1, y: 0.55 }, colors: ['#3AA0D8','#2E73A8','#ffffff'] }), 440)
}

// ── Slot‑machine spinner (random flags cycling fast → slow) ───────────────────
function SlotMachine({ teams, speed }) {
  const [team, setTeam] = useState(() => teams[Math.floor(Math.random() * teams.length)])
  useEffect(() => {
    const t = setInterval(() => {
      setTeam(teams[Math.floor(Math.random() * teams.length)])
    }, speed)
    return () => clearInterval(t)
  }, [speed, teams])

  return (
    <div style={{ textAlign: 'center', lineHeight: 1 }}>
      <span role="img" style={{ fontSize: 100, filter: 'drop-shadow(0 0 24px rgba(58,160,216,0.55))' }}>
        {team?.flag}
      </span>
    </div>
  )
}

// ── Full‑screen draw lightbox ─────────────────────────────────────────────────
function DrawLightbox({ open, player, revealedTeams, currentTeam, phase, teamIndex, totalTeams, onClose, allTeams }) {
  const [countdown, setCountdown] = useState(SPIN_SECS)

  // Reset and tick countdown whenever a new team's spinning phase starts
  useEffect(() => {
    if (phase !== 'spinning') return
    setCountdown(SPIN_SECS)
    const id = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1000)
    return () => clearInterval(id)
  }, [phase, teamIndex])

  if (!open || !player) return null

  const spinSpeed = countdown > 2 ? 80 : countdown > 1 ? 220 : countdown > 0 ? 520 : 1200
  const potColor  = currentTeam ? POT_CONFIG[currentTeam.pot].color : player.color

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(6,13,28,0.98)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '2rem', overflow: 'hidden',
      }}
    >
      {/* Ambient radial glow — shifts colour on reveal */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: phase === 'reveal'
          ? `radial-gradient(ellipse 65% 55% at 50% 48%, ${potColor}22 0%, transparent 68%)`
          : 'radial-gradient(ellipse 45% 40% at 50% 48%, rgba(46,115,168,0.12) 0%, transparent 68%)',
        transition: 'background 1s ease',
      }} />

      {/* Star‑field dots for depth */}
      {[...Array(28)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: i % 3 === 0 ? 3 : 2, height: i % 3 === 0 ? 3 : 2,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.18)',
          top:  `${(i * 37 + 7) % 100}%`,
          left: `${(i * 53 + 11) % 100}%`,
          pointerEvents: 'none',
        }} />
      ))}

      {/* ── Player header ── */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 220, damping: 24 }}
        style={{ textAlign: 'center', marginBottom: 32, position: 'relative', zIndex: 10 }}
      >
        <div style={{ fontSize: 52 }}>{player.avatar}</div>
        <h2 style={{ color: player.color, fontSize: 32, fontWeight: 900, margin: '8px 0 0' }}>{player.name}</h2>
        <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 13, marginTop: 4 }}>
          Team {teamIndex + 1} of {totalTeams}
        </p>
      </motion.div>

      {/* ── Stage ── */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 380, minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AnimatePresence mode="wait">

          {/* Spinning state */}
          {phase === 'spinning' && (
            <motion.div
              key={`spin-${teamIndex}`}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.3 }}
              style={{ textAlign: 'center', width: '100%' }}
            >
              <SlotMachine teams={allTeams} speed={spinSpeed} />

              {/* Progress dots */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, marginTop: 22 }}>
                {[...Array(SPIN_SECS)].map((_, i) => (
                  <div key={i} style={{
                    width: 11, height: 11, borderRadius: '50%',
                    background: i < (SPIN_SECS - countdown) ? player.color : 'rgba(255,255,255,0.1)',
                    boxShadow: i < (SPIN_SECS - countdown) ? `0 0 9px ${player.color}` : 'none',
                    transition: 'background 0.4s, box-shadow 0.4s',
                  }} />
                ))}
              </div>
              <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: 11, marginTop: 12, letterSpacing: '0.25em', textTransform: 'uppercase' }}>
                Drawing…
              </p>
            </motion.div>
          )}

          {/* Reveal state */}
          {phase === 'reveal' && currentTeam && (
            <motion.div
              key={`reveal-${currentTeam.id}`}
              initial={{ scale: 0.25, rotateY: 180, opacity: 0 }}
              animate={{ scale: 1, rotateY: 0, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 160, damping: 16 }}
              style={{ textAlign: 'center', width: '100%' }}
            >
              {/* Pot badge */}
              <div style={{ marginBottom: 14 }}>
                <span style={{
                  display: 'inline-block', padding: '4px 16px', borderRadius: 999,
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase',
                  color: POT_CONFIG[currentTeam.pot].color,
                  background: POT_CONFIG[currentTeam.pot].bg,
                  border: `1px solid ${POT_CONFIG[currentTeam.pot].color}55`,
                }}>
                  {POT_CONFIG[currentTeam.pot].label}
                </span>
              </div>

              {/* Flag card */}
              <div style={{
                display: 'flex', justifyContent: 'center', padding: '22px 0',
                borderRadius: 22,
                background: `linear-gradient(145deg, ${POT_CONFIG[currentTeam.pot].color}18 0%, transparent 100%)`,
                border: `1px solid ${POT_CONFIG[currentTeam.pot].color}30`,
                margin: '0 auto', maxWidth: 300,
              }}>
                <FlagImage
                  code={currentTeam.code}
                  emoji={currentTeam.flag}
                  size={120}
                  style={{ borderRadius: 10, boxShadow: `0 10px 50px ${POT_CONFIG[currentTeam.pot].color}50` }}
                />
              </div>

              {/* Team name */}
              <p style={{ color: '#ffffff', fontSize: 38, fontWeight: 900, marginTop: 18, lineHeight: 1.1 }}>
                {currentTeam.name}
              </p>
            </motion.div>
          )}

          {/* Done state */}
          {phase === 'done' && (
            <motion.div
              key="done"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              style={{ textAlign: 'center' }}
            >
              <div style={{ fontSize: 76 }}>🎉</div>
              <p style={{ color: '#ffffff', fontSize: 30, fontWeight: 900, marginTop: 14 }}>All teams drawn!</p>
              <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: 14, marginTop: 8 }}>
                {totalTeams} teams assigned to {player.name}
              </p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── Revealed teams chips ── */}
      {revealedTeams.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ position: 'relative', zIndex: 10, marginTop: 28, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, maxWidth: 640 }}
        >
          {revealedTeams.map(t => (
            <motion.div
              key={t.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '5px 11px', borderRadius: 9,
                background: `${POT_CONFIG[t.pot].color}1a`,
                border: `1px solid ${POT_CONFIG[t.pot].color}38`,
                color: '#ffffff', fontSize: 12, fontWeight: 600,
              }}
            >
              <span>{t.flag}</span>
              <span>{t.name}</span>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* ── Continue button (done only) ── */}
      {phase === 'done' && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          onClick={onClose}
          className="btn-neon"
          style={{ position: 'relative', zIndex: 10, marginTop: 32, fontSize: 16, padding: '13px 44px', borderRadius: 14 }}
        >
          ✓ Continue Draw
        </motion.button>
      )}
    </motion.div>,
    document.body
  )
}

export default function Draw() {
  const {
    drawState, PLAYERS, TEAMS,
    startDraw, drawTeamToPlayer, drawAllTeams, resetDraw, lockDraw, unlockDraw,
    currentDrawnTeam, currentDrawnPlayer,
    getPlayerTeams,
  } = useApp()

  const [isAnimating, setIsAnimating] = useState(false)
  const [showReveal,  setShowReveal]  = useState(false)

  // Lightbox state
  const [lightboxOpen,         setLightboxOpen]         = useState(false)
  const [lightboxPlayer,       setLightboxPlayer]       = useState(null)
  const [lightboxRevealedTeams,setLightboxRevealedTeams]= useState([])
  const [lightboxCurrentTeam,  setLightboxCurrentTeam]  = useState(null)
  const [lightboxPhase,        setLightboxPhase]        = useState('spinning')
  const [lightboxTeamIndex,    setLightboxTeamIndex]    = useState(0)
  const [lightboxTotalTeams,   setLightboxTotalTeams]   = useState(0)

  const isAdmin = localStorage.getItem(ADMIN_AUTH_KEY) === '1'

  // Auto-start the draw at 16:00 SAST on 22 May 2026 (admin only — requires Firestore to sync across all users)
  const DRAW_AUTO_START_TIME = new Date('2026-05-22T16:00:00+02:00').getTime()
  useEffect(() => {
    if (!isAdmin || drawState.isStarted) return
    const check = () => {
      if (Date.now() >= DRAW_AUTO_START_TIME && !drawState.isStarted) startDraw()
    }
    check()
    const id = setInterval(check, 5000)
    return () => clearInterval(id)
  }, [isAdmin, drawState.isStarted, startDraw, DRAW_AUTO_START_TIME])

  const progress = getDrawProgress(drawState.drawIndex, TEAMS.length)

  const baseTeamsPerPlayer = Math.floor(TEAMS.length / PLAYERS.length)
  const extraTeams = TEAMS.length % PLAYERS.length

  const nextPlayerBatch = useMemo(() => {
    if (!drawState.isStarted || drawState.isComplete) return null
    for (let i = 0; i < PLAYERS.length; i++) {
      const player = PLAYERS[i]
      const target  = baseTeamsPerPlayer + (i < extraTeams ? 1 : 0)
      const current = (drawState.assignments[player.id] || []).length
      if (current < target) return { player, teamsToDraw: target - current }
    }
    return null
  }, [drawState, PLAYERS, baseTeamsPerPlayer, extraTeams])

  const handleLightboxClose = useCallback(() => {
    setLightboxOpen(false)
    setLightboxPlayer(null)
    setLightboxRevealedTeams([])
    setLightboxCurrentTeam(null)
  }, [])

  // Opens the lightbox and orchestrates the timed draw for one player.
  const handleDrawPlayer = useCallback(() => {
    if (!isAdmin) return
    if (isAnimating || !drawState.isStarted || drawState.isComplete || drawState.isLocked || !nextPlayerBatch) return

    const { player, teamsToDraw } = nextPlayerBatch
    const startIndex = drawState.drawIndex

    // Capture team objects upfront — avoids stale‑closure issues with drawState
    const teamsToReveal = []
    for (let i = 0; i < teamsToDraw; i++) {
      const teamId = drawState.shuffledTeamIds[startIndex + i]
      teamsToReveal.push(TEAMS.find(t => t.id === teamId) || null)
    }

    setIsAnimating(true)
    setShowReveal(false)

    // Open lightbox immediately
    setLightboxOpen(true)
    setLightboxPlayer(player)
    setLightboxRevealedTeams([])
    setLightboxCurrentTeam(null)
    setLightboxPhase('spinning')
    setLightboxTeamIndex(0)
    setLightboxTotalTeams(teamsToDraw)

    for (let i = 0; i < teamsToDraw; i++) {
      // Begin spinning phase for team i
      setTimeout(() => {
        setLightboxPhase('spinning')
        setLightboxTeamIndex(i)
        setLightboxCurrentTeam(null)
      }, i * TOTAL_SECS * 1000)

      // Reveal team i after SPIN_SECS seconds of suspense
      setTimeout(() => {
        const team = teamsToReveal[i]
        drawTeamToPlayer(player.id)
        setLightboxCurrentTeam(team)
        setLightboxPhase('reveal')
        setLightboxRevealedTeams(prev => [...prev, team].filter(Boolean))
        setShowReveal(true)
        if (team?.pot === 1) fireConfetti()
        playDrawSound()
      }, i * TOTAL_SECS * 1000 + SPIN_SECS * 1000)
    }

    // Done state: last team shown for REVEAL_SECS, then summary
    setTimeout(() => {
      setLightboxPhase('done')
      setIsAnimating(false)
    }, teamsToDraw * TOTAL_SECS * 1000)
  }, [isAdmin, isAnimating, drawState, nextPlayerBatch, TEAMS, drawTeamToPlayer])

  const remainingCount = TEAMS.length - drawState.drawIndex

  return (
    <>
      {/* ── Fullscreen draw lightbox (portal) ─────────────────────────── */}
      <DrawLightbox
        open={lightboxOpen}
        player={lightboxPlayer}
        revealedTeams={lightboxRevealedTeams}
        currentTeam={lightboxCurrentTeam}
        phase={lightboxPhase}
        teamIndex={lightboxTeamIndex}
        totalTeams={lightboxTotalTeams}
        onClose={handleLightboxClose}
        allTeams={TEAMS}
      />

    <div className="min-h-screen bg-grid py-8 px-4">
      <div className="max-w-6xl mx-auto">

        {/* ── Header ────────────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Source IT Services</p>
          <h1 className="text-4xl sm:text-5xl font-black mb-2">
            <span className="gradient-text">Live Draw</span>{' '}
            <span aria-hidden="true">🎲</span>
          </h1>
          <p className="text-gray-400 text-sm">
            {drawState.isComplete
              ? '✅ Draw complete! All 48 teams have been assigned.'
              : drawState.isStarted
              ? `${remainingCount} teams remaining`
              : '48 teams • 10 players • Fair random draw'}
          </p>
        </motion.div>

        <GlassCard className="p-5 mb-6" delay={0.05}>
          <DrawCountdownTimer compact />
        </GlassCard>

        {/* ── Main draw area ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          {/* Control panel */}
          <GlassCard className="p-6 space-y-4" delay={0.1}>
            <h2 className="font-bold text-white text-sm uppercase tracking-wide">🎛 Draw Controls</h2>

            {/* Progress bar */}
            {drawState.isStarted && (
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>{drawState.drawIndex} drawn</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #2E73A8, #3AA0D8)' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="space-y-2">
              {!isAdmin ? (
                <div
                  className="rounded-xl p-3"
                  style={{ background: 'rgba(46,115,168,0.08)', border: '1px solid rgba(46,115,168,0.25)' }}
                >
                  <p className="text-xs text-gray-500 mb-2">Only admins can run the draw.</p>
                  <Link to="/admin" className="btn-outline w-full justify-center text-sm">
                    🔐 Open Admin Login
                  </Link>
                </div>
              ) : (
                <>
                  {!drawState.isStarted && (
                    <button className="btn-neon w-full justify-center" onClick={startDraw}>
                      🚀 Start Draw
                    </button>
                  )}

                  {drawState.isStarted && !drawState.isComplete && !drawState.isLocked && nextPlayerBatch && (
                    <button
                      className="btn-neon w-full justify-center"
                      onClick={handleDrawPlayer}
                      disabled={isAnimating}
                    >
                      {isAnimating
                        ? `🎬 Drawing for ${nextPlayerBatch.player.name}...`
                        : `🎭 Draw ${nextPlayerBatch.player.name} (${nextPlayerBatch.teamsToDraw} teams)`}
                    </button>
                  )}

                  {drawState.isStarted && !drawState.isComplete && !drawState.isLocked && (
                    <button
                      className="btn-outline w-full justify-center text-sm"
                      onClick={drawAllTeams}
                    >
                      ⚡ Complete Instantly
                    </button>
                  )}

                  {drawState.isStarted && (
                    <button
                      className="btn-danger w-full justify-center text-sm"
                      onClick={resetDraw}
                    >
                      🔄 Reset Draw
                    </button>
                  )}

                  {drawState.isComplete && !drawState.isLocked && (
                    <button className="btn-outline w-full justify-center text-sm" onClick={lockDraw}>
                      🔒 Lock Draw
                    </button>
                  )}
                  {drawState.isLocked && (
                    <button className="btn-outline w-full justify-center text-sm" onClick={unlockDraw}>
                      🔓 Unlock Draw
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Status */}
            <div className="pt-2 border-t border-slate-200 text-xs text-gray-500 space-y-1">
              <p>Teams: {TEAMS.length} total</p>
              <p>Players: {PLAYERS.length}</p>
              <p>Status: {
                drawState.isLocked    ? '🔒 Locked' :
                drawState.isComplete  ? '✅ Complete' :
                drawState.isStarted   ? '🟢 In progress' : '⚪ Not started'
              }</p>
            </div>
          </GlassCard>

          {/* Reveal spotlight */}
          <div className="lg:col-span-2">
            <GlassCard className="p-6 h-full flex flex-col" delay={0.15}>
              <h2 className="font-bold text-white text-sm uppercase tracking-wide mb-4">🎯 Current Draw</h2>

              <div className="flex-1 flex items-center justify-center min-h-[220px]">
                <AnimatePresence mode="wait">
                  {!drawState.isStarted && (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="text-center"
                    >
                      <div className="text-7xl mb-4 animate-float">🎲</div>
                      <p className="text-gray-400">
                        {isAdmin
                          ? <>Press <strong className="text-white">Start Draw</strong> to begin</>
                          : <>Admin login required to start the draw</>}
                      </p>
                    </motion.div>
                  )}

                  {drawState.isComplete && (
                    <motion.div
                      key="complete"
                      initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                      className="text-center"
                    >
                      <div className="text-7xl mb-4">🏆</div>
                      <p className="text-2xl font-black neon-text mb-2">Draw Complete!</p>
                      <p className="text-gray-400 text-sm">All 48 teams have been assigned. May the best team win!</p>
                    </motion.div>
                  )}

                  {drawState.isStarted && !drawState.isComplete && showReveal && currentDrawnTeam && currentDrawnPlayer && (
                    <motion.div
                      key={`reveal-${drawState.drawIndex}`}
                      initial={{ rotateY: 90, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      exit={{ rotateY: -90, opacity: 0 }}
                      transition={{ duration: 0.45 }}
                      className="text-center w-full max-w-xs mx-auto"
                    >
                      {/* Pot banner */}
                      <div
                        className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 uppercase tracking-wide"
                        style={{
                          color: POT_CONFIG[currentDrawnTeam.pot].color,
                          background: POT_CONFIG[currentDrawnTeam.pot].bg,
                          border: `1px solid ${POT_CONFIG[currentDrawnTeam.pot].color}50`,
                        }}
                      >
                        {POT_CONFIG[currentDrawnTeam.pot].label}
                      </div>

                      {/* Flag + name */}
                      <div
                        className="rounded-2xl p-6 mb-4"
                        style={{
                          background: `linear-gradient(135deg, ${POT_CONFIG[currentDrawnTeam.pot].color}12, transparent)`,
                          border: `1px solid ${POT_CONFIG[currentDrawnTeam.pot].color}30`,
                        }}
                      >
                        <div className="flex justify-center mb-3">
                          <FlagImage code={currentDrawnTeam.code} emoji={currentDrawnTeam.flag} size={80} style={{ borderRadius: 6, boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }} />
                        </div>
                        <p className="text-2xl font-black text-white">{currentDrawnTeam.name}</p>
                      </div>

                      {/* Assigned to */}
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-gray-400 text-sm">Assigned to</span>
                        <span
                          className="font-black text-base px-3 py-1 rounded-full"
                          style={{
                            color: currentDrawnPlayer.color,
                            background: `${currentDrawnPlayer.color}18`,
                            border: `1px solid ${currentDrawnPlayer.color}40`,
                          }}
                        >
                          {currentDrawnPlayer.avatar} {currentDrawnPlayer.name}
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {drawState.isStarted && !drawState.isComplete && !showReveal && (
                    <motion.div
                      key="waiting"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="text-center"
                    >
                      <div className="text-5xl mb-3">⚽</div>
                      <p className="text-gray-400">Ready to draw…</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* ── Player assignment grid ─────────────────────────────────────── */}
        {drawState.isStarted && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <h2 className="text-xl font-black text-white mb-4">👥 Team Assignments</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {PLAYERS.map((player, i) => {
                const teams = getPlayerTeams(player.id)
                return (
                  <div
                    key={player.id}
                    className="rounded-xl overflow-hidden"
                    style={{
                      backdropFilter: 'blur(12px)',
                      background: 'rgba(255,255,255,0.92)',
                      border: `1px solid ${player.color}20`,
                    }}
                  >
                    {/* Player header */}
                    <div
                      className="px-3 py-2.5 flex items-center gap-2"
                      style={{ borderBottom: '1px solid rgba(230,242,250,0.85)', background: `${player.color}08` }}
                    >
                      <span className="text-lg">{player.avatar}</span>
                      <span className="font-bold text-sm" style={{ color: player.color }}>{player.name}</span>
                      <span className="ml-auto text-xs text-gray-500">{teams.length} teams</span>
                    </div>

                    {/* Teams */}
                    <div className="p-2 space-y-1.5 min-h-[60px]">
                      <AnimatePresence>
                        {teams.map(team => (
                          <motion.div
                            key={team.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-center gap-2 px-2 py-1 rounded-lg text-xs"
                            style={{
                              background: `${POT_CONFIG[team.pot].color}0a`,
                              border: `1px solid ${POT_CONFIG[team.pot].color}20`,
                            }}
                          >
                            <FlagImage code={team.code} emoji={team.flag} size={20} />
                            <span className="text-gray-200 truncate flex-1">{team.name}</span>
                            <span className="text-[10px] font-bold" style={{ color: POT_CONFIG[team.pot].color }}>
                              P{team.pot}
                            </span>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      {teams.length === 0 && (
                        <p className="text-xs text-gray-600 text-center py-2">No teams yet</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}

      </div>
    </div>
    </>
  )
}
