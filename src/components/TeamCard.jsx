import React from 'react'
import { motion } from 'framer-motion'
import { POT_CONFIG } from '../data/teams'
import FlagImage from './FlagImage'

/**
 * Display card for a single World Cup team.
 * Props: team, owner (player object|null), eliminated (bool), compact (bool)
 */
export default function TeamCard({ team, owner = null, eliminated = false, compact = false, delay = 0 }) {
  const pot = POT_CONFIG[team.pot]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ y: -2, scale: 1.02 }}
      className="relative overflow-hidden rounded-xl"
      style={{
        background: eliminated
          ? 'rgba(255,71,87,0.05)'
          : 'rgba(255,255,255,0.04)',
        border: `1px solid ${eliminated ? 'rgba(255,71,87,0.2)' : 'rgba(255,255,255,0.08)'}`,
        backdropFilter: 'blur(12px)',
        opacity: eliminated ? 0.6 : 1,
      }}
    >
      {/* Pot colour accent bar */}
      <div
        className="absolute top-0 left-0 w-1 h-full rounded-l-xl"
        style={{ background: pot.color }}
      />

      <div className={`pl-4 pr-3 ${compact ? 'py-2' : 'py-3'}`}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <FlagImage code={team.code} emoji={team.flag} size={compact ? 24 : 32} style={{ borderRadius: 4 }} />
            <div className="min-w-0">
              <p className={`font-semibold truncate ${compact ? 'text-xs' : 'text-sm'}`}
                style={{ color: eliminated ? '#6b7280' : '#f9fafb' }}>
                {team.name}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            {/* Pot badge */}
            <span
              className="text-xs font-bold px-1.5 py-0.5 rounded-full"
              style={{ color: pot.color, background: pot.bg, fontSize: '10px' }}
            >
              P{team.pot}
            </span>

            {/* Owner badge */}
            {owner && !compact && (
              <span
                className="text-xs px-1.5 py-0.5 rounded-full font-medium truncate max-w-[64px]"
                style={{
                  color: owner.color,
                  background: `${owner.color}18`,
                  border: `1px solid ${owner.color}30`,
                }}
              >
                {owner.name}
              </span>
            )}

            {/* Eliminated badge */}
            {eliminated && (
              <span className="text-xs text-red-400 font-semibold">❌ Out</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
