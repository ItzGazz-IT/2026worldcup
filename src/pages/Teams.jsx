import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { POT_CONFIG, CONFEDERATIONS } from '../data/teams'
import FlagImage from '../components/FlagImage'
import { getTeamOwner } from '../utils/drawLogic'

const POT_TABS = [0, 1, 2, 3, 4] // 0 = All

export default function Teams() {
  const { TEAMS, PLAYERS, drawState, eliminated } = useApp()
  const [activePot,    setActivePot]    = useState(0)
  const [activeConf,   setActiveConf]   = useState('All')
  const [search,       setSearch]       = useState('')
  const [showElimOnly, setShowElimOnly] = useState(false)

  const filtered = useMemo(() => {
    return TEAMS.filter(team => {
      if (activePot  && team.pot !== activePot)                return false
      if (activeConf !== 'All' && team.confederation !== activeConf) return false
      if (showElimOnly && !eliminated.includes(team.id))       return false
      if (search && !team.name.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [TEAMS, activePot, activeConf, search, showElimOnly, eliminated])

  return (
    <div className="min-h-screen bg-grid py-8 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">FIFA World Cup 2026</p>
          <h1 className="text-4xl sm:text-5xl font-black mb-2">
            <span className="gradient-text">All Teams</span>{' '}
            <span aria-hidden="true">🌍</span>
          </h1>
          <p className="text-gray-400 text-sm">48 nations competing for glory</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="space-y-4 mb-8"
        >
          {/* Search */}
          <div className="relative max-w-sm mx-auto">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search teams…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white bg-white/5 border border-white/10 outline-none placeholder-gray-500 focus:border-neon-green transition-colors"
              style={{ '--tw-ring-color': '#2E73A8' }}
            />
          </div>

          {/* Pot tabs */}
          <div className="flex flex-wrap justify-center gap-2">
            {POT_TABS.map(p => (
              <button
                key={p}
                onClick={() => setActivePot(p)}
                className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
                style={{
                  background: activePot === p
                    ? (p === 0 ? '#2E73A8' : POT_CONFIG[p]?.color || '#fff')
                    : 'rgba(255,255,255,0.05)',
                  color: activePot === p ? '#0a0e1a' : '#9ca3af',
                  border: `1px solid ${activePot === p ? 'transparent' : 'rgba(255,255,255,0.08)'}`,
                }}
              >
                {p === 0 ? `All (${TEAMS.length})` : `${POT_CONFIG[p].label.split('–')[0].trim()} (${TEAMS.filter(t => t.pot === p).length})`}
              </button>
            ))}
          </div>

          {/* Confederation + eliminated toggle */}
          <div className="flex flex-wrap justify-center gap-2">
            {['All', ...CONFEDERATIONS].map(conf => (
              <button
                key={conf}
                onClick={() => setActiveConf(conf)}
                className="px-3 py-1 rounded-full text-xs transition-all duration-200"
                style={{
                  background: activeConf === conf ? 'rgba(0,212,255,0.2)' : 'rgba(255,255,255,0.04)',
                  color: activeConf === conf ? '#3AA0D8' : '#6b7280',
                  border: `1px solid ${activeConf === conf ? '#3AA0D850' : 'rgba(255,255,255,0.06)'}`,
                }}
              >
                {conf}
              </button>
            ))}
            <button
              onClick={() => setShowElimOnly(v => !v)}
              className="px-3 py-1 rounded-full text-xs transition-all duration-200"
              style={{
                background: showElimOnly ? 'rgba(255,71,87,0.15)' : 'rgba(255,255,255,0.04)',
                color: showElimOnly ? '#ff4757' : '#6b7280',
                border: `1px solid ${showElimOnly ? '#ff475740' : 'rgba(255,255,255,0.06)'}`,
              }}
            >
              ❌ Eliminated only
            </button>
          </div>
        </motion.div>

        {/* Results count */}
        <p className="text-xs text-gray-500 text-center mb-6">
          Showing {filtered.length} of {TEAMS.length} teams
        </p>

        {/* Team grid */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
        >
          {filtered.map((team, i) => {
            const ownerId = getTeamOwner(team.id, drawState.assignments)
            const owner   = PLAYERS.find(p => p.id === ownerId) || null
            const isOut   = eliminated.includes(team.id)
            const pot     = POT_CONFIG[team.pot]

            return (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.02, 0.5) }}
                whileHover={{ y: -2, scale: 1.01 }}
                className="relative rounded-xl overflow-hidden"
                style={{
                  backdropFilter: 'blur(12px)',
                  background: isOut ? 'rgba(255,71,87,0.04)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${isOut ? 'rgba(255,71,87,0.2)' : 'rgba(255,255,255,0.07)'}`,
                  opacity: isOut ? 0.65 : 1,
                }}
              >
                {/* Pot stripe */}
                <div className="absolute top-0 left-0 w-1 h-full" style={{ background: pot.color }} />

                <div className="pl-4 pr-3 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <FlagImage code={team.code} emoji={team.flag} size={40} style={{ borderRadius: 5, flexShrink: 0 }} />
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-white truncate">{team.name}</p>
                        <p className="text-xs text-gray-500">{team.confederation}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span
                        className="text-[10px] font-black px-1.5 py-0.5 rounded-full"
                        style={{ color: pot.color, background: pot.bg }}
                      >
                        POT {team.pot}
                      </span>
                      {owner && (
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                          style={{
                            color: owner.color,
                            background: `${owner.color}18`,
                            border: `1px solid ${owner.color}30`,
                          }}
                        >
                          {owner.avatar} {owner.name}
                        </span>
                      )}
                      {!owner && drawState.isStarted && (
                        <span className="text-[10px] text-gray-600">Unassigned</span>
                      )}
                      {isOut && (
                        <span className="text-[10px] text-red-400 font-bold">Eliminated</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <p className="text-4xl mb-3">🔍</p>
            <p>No teams match your filters</p>
          </div>
        )}

      </div>
    </div>
  )
}
