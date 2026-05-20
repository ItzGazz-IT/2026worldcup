import React from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import TeamCard from './TeamCard'

/**
 * Summary card for a player showing their teams and points.
 */
export default function PlayerCard({ player, position = null, points = 0, compact = false, delay = 0 }) {
  const { getPlayerTeams, eliminated } = useApp()
  const teams     = getPlayerTeams(player.id)
  const aliveTeams = teams.filter(t => !eliminated.includes(t.id))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="rounded-xl overflow-hidden"
      style={{
        backdropFilter: 'blur(12px)',
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${player.color}25`,
        boxShadow: `0 0 20px ${player.color}08`,
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-3">
          {position && (
            <span className="text-sm font-bold w-6 text-center" style={{ color: player.color }}>
              #{position}
            </span>
          )}
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold"
            style={{ background: `${player.color}20`, border: `1px solid ${player.color}40` }}
          >
            {player.avatar}
          </div>
          <div>
            <p className="font-bold text-sm text-white">{player.name}</p>
            <p className="text-xs text-gray-400">
              {aliveTeams.length}/{teams.length} teams alive
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Points</p>
          <p className="text-lg font-black" style={{ color: player.color }}>
            {points}
          </p>
        </div>
      </div>

      {/* Team list */}
      {!compact && teams.length > 0 && (
        <div className="p-3 grid grid-cols-1 gap-1.5">
          {teams.map(team => (
            <TeamCard
              key={team.id}
              team={team}
              eliminated={eliminated.includes(team.id)}
              compact
            />
          ))}
        </div>
      )}

      {!compact && teams.length === 0 && (
        <div className="p-4 text-center text-gray-500 text-xs">
          No teams assigned yet
        </div>
      )}
    </motion.div>
  )
}
