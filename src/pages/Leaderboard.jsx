import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import FlagImage from '../components/FlagImage'
import { calculateLeaderboard, calculatePointsFromResults } from '../utils/drawLogic'
import TeamCard from '../components/TeamCard'
import { PRIZE_POOL } from '../data/players'
import { GROUP_FIXTURES } from '../data/fixtures'

const PODIUM_ORDER = [1, 0, 2] // center = 1st, left = 2nd, right = 3rd

export default function Leaderboard() {
  const { PLAYERS, TEAMS, drawState, points, eliminated, matchResults, knockoutTeams } = useApp()

  const hasAnyGroupResult = useMemo(
    () => GROUP_FIXTURES.some(f => {
      const r = matchResults[String(f.id)]
      return Number.isFinite(r?.home) && Number.isFinite(r?.away)
    }),
    [matchResults]
  )

  const knockoutFixtures = useMemo(
    () => Object.entries(knockoutTeams)
      .map(([id, value]) => ({
        id,
        home: value?.homeTeamId,
        away: value?.awayTeamId,
      }))
      .filter(f => Number.isFinite(f.home) && Number.isFinite(f.away)),
    [knockoutTeams]
  )

  const mergePoints = (base, extra) => {
    const merged = { ...base }
    Object.keys(extra).forEach(playerId => {
      merged[playerId] = (merged[playerId] || 0) + (extra[playerId] || 0)
    })
    return merged
  }

  const effectivePoints = useMemo(
    () => {
      const groupPoints = hasAnyGroupResult
        ? calculatePointsFromResults(PLAYERS, drawState.assignments, matchResults, GROUP_FIXTURES)
        : points

      if (!knockoutFixtures.length) return groupPoints

      const knockoutPoints = calculatePointsFromResults(PLAYERS, drawState.assignments, matchResults, knockoutFixtures)
      return mergePoints(groupPoints, knockoutPoints)
    },
    [PLAYERS, drawState.assignments, matchResults, points, hasAnyGroupResult, knockoutFixtures]
  )

  const standings = useMemo(
    () => calculateLeaderboard(PLAYERS, drawState.assignments, effectivePoints, eliminated, TEAMS),
    [PLAYERS, TEAMS, drawState.assignments, effectivePoints, eliminated]
  )

  const top3 = [standings[1], standings[0], standings[2]].filter(Boolean)

  const podiumHeights = ['h-24', 'h-32', 'h-20']
  const podiumColors  = ['#c0c0c0', '#ffd700', '#cd7f32']

  if (!drawState.isStarted) {
    return (
      <div className="min-h-screen bg-grid flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center glass-card p-10 max-w-md"
        >
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-2xl font-black text-white mb-2">No Draw Yet</h2>
          <p className="text-gray-400">Complete the draw first, then leaderboard will appear here.</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-grid py-8 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Source IT Services</p>
          <h1 className="text-4xl sm:text-5xl font-black mb-2">
            <span className="gradient-text">Leaderboard</span>{' '}
            <span aria-hidden="true">🏆</span>
          </h1>
          <p className="text-gray-400 text-sm">Live standings — sorted by points</p>
        </motion.div>

        {/* Podium (top 3 only shown when draw is complete) */}
        {drawState.isComplete && standings.length >= 3 && (
          <motion.section
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-center text-sm uppercase tracking-widest text-gray-400 mb-8">🥇 Top Three</h2>
            <div className="flex items-end justify-center gap-3 sm:gap-6">
              {PODIUM_ORDER.map((idx, col) => {
                const player = standings[idx]
                if (!player) return null
                const prize  = PRIZE_POOL.prizes[idx]
                return (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * col, duration: 0.5 }}
                    className="flex flex-col items-center"
                  >
                    {/* Avatar */}
                    <div
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-2xl mb-2"
                      style={{
                        background: `${player.color}20`,
                        border: `2px solid ${player.color}`,
                        boxShadow: `0 0 20px ${player.color}50`,
                      }}
                    >
                      {player.avatar}
                    </div>
                    <p className="font-black text-sm mb-1" style={{ color: player.color }}>{player.name}</p>
                    <p className="text-xs text-gray-400 mb-2">{player.points} pts</p>
                    {prize && (
                      <p className="text-xs font-bold mb-2" style={{ color: prize.color }}>
                        {prize.icon} R{prize.amount.toLocaleString()}
                      </p>
                    )}
                    {/* Podium block */}
                    <div
                      className={`w-20 sm:w-24 ${podiumHeights[col]} rounded-t-xl flex items-start justify-center pt-2`}
                      style={{
                        background: `linear-gradient(180deg, ${podiumColors[col]}30, ${podiumColors[col]}10)`,
                        border: `1px solid ${podiumColors[col]}40`,
                        borderBottom: 'none',
                      }}
                    >
                      <span className="text-2xl font-black" style={{ color: podiumColors[col] }}>
                        {idx + 1}
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.section>
        )}

        {/* Full standings table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="rounded-xl overflow-hidden"
          style={{ backdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(199,211,224,1)' }}
        >
          {/* Table header */}
          <div
            className="grid grid-cols-12 px-4 py-3 text-xs uppercase tracking-wider text-gray-500"
            style={{ borderBottom: '1px solid rgba(199,211,224,0.8)' }}
          >
            <span className="col-span-1">#</span>
            <span className="col-span-3">Player</span>
            <span className="col-span-2 text-center">Points</span>
            <span className="col-span-2 text-center hidden sm:block">Alive</span>
            <span className="col-span-4 hidden md:block">Teams</span>
          </div>

          {standings.map((player, i) => {
            const prize = PRIZE_POOL.prizes[i]
            return (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.3 }}
                layout
                className="grid grid-cols-12 px-4 py-4 items-center transition-colors"
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.94)',
                  background: i === 0 ? `${player.color}05` : 'transparent',
                }}
              >
                {/* Position */}
                <div className="col-span-1 flex items-center gap-1">
                  {prize ? (
                    <span className="text-lg">{prize.icon}</span>
                  ) : (
                    <span className="text-gray-500 font-bold text-sm">{player.position}</span>
                  )}
                </div>

                {/* Player name */}
                <div className="col-span-3 flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                    style={{ background: `${player.color}20`, border: `1px solid ${player.color}40` }}
                  >
                    {player.avatar}
                  </div>
                  <span className="font-bold text-sm text-white">{player.name}</span>
                </div>

                {/* Points */}
                <div className="col-span-2 text-center">
                  <span
                    className="font-black text-base"
                    style={{ color: i === 0 ? '#2E73A8' : player.color }}
                  >
                    {player.points}
                  </span>
                </div>

                {/* Teams alive */}
                <div className="col-span-2 text-center hidden sm:block">
                  <span className="text-sm text-gray-300">
                    {player.teamsAlive}
                    <span className="text-gray-500">/{player.totalTeams}</span>
                  </span>
                </div>

                {/* Team flags (desktop) */}
                <div className="col-span-4 hidden md:flex flex-wrap gap-1">
                  {player.assignedTeams.map(team => (
                    <span
                      key={team.id}
                      title={`${team.name}${eliminated.includes(team.id) ? ' (eliminated)' : ''}`}
                      style={{ opacity: eliminated.includes(team.id) ? 0.25 : 1, filter: eliminated.includes(team.id) ? 'grayscale(1)' : 'none', display: 'inline-block' }}
                    >
                      <FlagImage code={team.code} emoji={team.flag} size={24} />
                    </span>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Legend */}
        <p className="text-center text-xs text-gray-600 mt-6">
          Faded flags = eliminated teams &nbsp;·&nbsp; Points from entered match results (group + knockout when teams are selected)
        </p>

      </div>
    </div>
  )
}
