import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { GROUPS, GROUP_FIXTURES, KNOCKOUT_ROUNDS } from '../data/fixtures'
import FlagImage from '../components/FlagImage'
import { getTeamOwner } from '../utils/drawLogic'

const GROUP_KEYS = Object.keys(GROUPS)
const NEON = '#2E73A8'

// ── helpers ──────────────────────────────────────────────────────────────────

function formatDate(isoDate) {
  if (!isoDate) return 'TBD'
  const d = new Date(isoDate + 'T12:00:00Z')
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

function getTeamById(id, teams) {
  return teams.find(t => t.id === id)
}

function calculateGroupStandings(groupKey, teams, matchResults) {
  const group = GROUPS[groupKey]
  if (!group) return []

  const statsByTeam = Object.fromEntries(
    group.teamIds.map(teamId => [teamId, {
      teamId,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      gf: 0,
      ga: 0,
      gd: 0,
      points: 0,
    }])
  )

  const groupMatches = GROUP_FIXTURES.filter(f => f.group === groupKey)

  groupMatches.forEach(match => {
    const result = matchResults[String(match.id)]
    const hasResult = Number.isFinite(result?.home) && Number.isFinite(result?.away)
    if (!hasResult) return

    const home = statsByTeam[match.home]
    const away = statsByTeam[match.away]
    if (!home || !away) return

    home.played += 1
    away.played += 1

    home.gf += result.home
    home.ga += result.away
    away.gf += result.away
    away.ga += result.home

    home.gd = home.gf - home.ga
    away.gd = away.gf - away.ga

    if (result.home > result.away) {
      home.won += 1
      away.lost += 1
      home.points += 3
    } else if (result.home < result.away) {
      away.won += 1
      home.lost += 1
      away.points += 3
    } else {
      home.drawn += 1
      away.drawn += 1
      home.points += 1
      away.points += 1
    }
  })

  return Object.values(statsByTeam)
    .map(row => ({
      ...row,
      team: getTeamById(row.teamId, teams),
    }))
    .filter(row => row.team)
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points
      if (b.gd !== a.gd) return b.gd - a.gd
      if (b.gf !== a.gf) return b.gf - a.gf
      return a.team.name.localeCompare(b.team.name)
    })
    .map((row, i) => ({ ...row, rank: i + 1 }))
}

// ── sub-components ───────────────────────────────────────────────────────────

function MatchRow({ fixture, teams, drawState, eliminated, players, matchResults, delay = 0 }) {
  const home  = getTeamById(fixture.home, teams)
  const away  = getTeamById(fixture.away, teams)
  if (!home || !away) return null

  const result = matchResults[String(fixture.id)]
  const hasResult = Number.isFinite(result?.home) && Number.isFinite(result?.away)
  const homeWon = hasResult && result.home > result.away
  const awayWon = hasResult && result.away > result.home

  const homeElim = eliminated.includes(home.id)
  const awayElim = eliminated.includes(away.id)
  const homeOwner = drawState?.assignments
    ? players.find(p => p.id === getTeamOwner(home.id, drawState.assignments))
    : null
  const awayOwner = drawState?.assignments
    ? players.find(p => p.id === getTeamOwner(away.id, drawState.assignments))
    : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="relative rounded-xl px-3 py-2.5 flex items-center gap-2 group"
      style={{
        background: 'rgba(255,255,255,0.92)',
        border: '1px solid rgba(199,211,224,0.9)',
      }}
    >
      {/* Simultaneous badge */}
      {fixture.simultaneous && (
        <span
          className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] px-1.5 py-0.5 rounded-full font-bold tracking-wider uppercase"
          style={{ background: 'rgba(46,115,168,0.15)', color: NEON, border: '1px solid rgba(46,115,168,0.3)' }}
        >
          simultaneous
        </span>
      )}

      {/* Date */}
      <span className="text-[10px] text-gray-500 w-14 shrink-0">{formatDate(fixture.date)}</span>

      {/* Home team */}
      <div className="flex-1 flex items-center justify-end gap-2 min-w-0">
        <div className="text-right min-w-0">
          <p className={`text-sm font-semibold truncate leading-tight ${homeElim ? 'line-through text-gray-600' : 'text-white'}`}>
            {home.name}
          </p>
          {hasResult && (
            <p className={`text-[10px] font-bold ${homeWon ? 'text-green-400' : 'text-gray-500'}`}>
              {homeWon ? 'W' : awayWon ? 'L' : 'D'}
            </p>
          )}
          {homeOwner && (
            <p className="text-[10px] truncate" style={{ color: homeOwner.color }}>{homeOwner.name}</p>
          )}
        </div>
        <FlagImage code={home.code} emoji={home.flag} size={28} style={{ opacity: homeElim ? 0.3 : 1, filter: homeElim ? 'grayscale(1)' : 'none', flexShrink: 0 }} />
      </div>

      {/* Result */}
      <div className="w-20 shrink-0 text-center">
        {hasResult ? (
          <>
            <p className="text-base font-black text-white leading-tight">{result.home} - {result.away}</p>
            <p className="text-[9px] uppercase tracking-wider text-green-400 font-bold">FT</p>
          </>
        ) : (
          <p className="text-xs font-black text-gray-500">vs</p>
        )}
      </div>

      {/* Away team */}
      <div className="flex-1 flex items-center justify-start gap-2 min-w-0">
        <FlagImage code={away.code} emoji={away.flag} size={28} style={{ opacity: awayElim ? 0.3 : 1, filter: awayElim ? 'grayscale(1)' : 'none', flexShrink: 0 }} />
        <div className="min-w-0">
          <p className={`text-sm font-semibold truncate leading-tight ${awayElim ? 'line-through text-gray-600' : 'text-white'}`}>
            {away.name}
          </p>
          {hasResult && (
            <p className={`text-[10px] font-bold ${awayWon ? 'text-green-400' : 'text-gray-500'}`}>
              {awayWon ? 'W' : homeWon ? 'L' : 'D'}
            </p>
          )}
          {awayOwner && (
            <p className="text-[10px] truncate" style={{ color: awayOwner.color }}>{awayOwner.name}</p>
          )}
        </div>
      </div>

      {/* Venue */}
      <span className="hidden lg:block text-[10px] text-gray-600 w-36 shrink-0 text-right truncate">{fixture.venue}</span>
    </motion.div>
  )
}

function GroupPanel({ groupKey, group, teams, drawState, eliminated, players, matchResults }) {
  const groupTeams = group.teamIds.map(id => getTeamById(id, teams)).filter(Boolean)
  const fixtures   = GROUP_FIXTURES.filter(f => f.group === groupKey)
  const matchdays  = [1, 2, 3]
  const standings  = calculateGroupStandings(groupKey, teams, matchResults)
  const completedMatches = fixtures.filter(f => {
    const result = matchResults[String(f.id)]
    return Number.isFinite(result?.home) && Number.isFinite(result?.away)
  }).length

  return (
    <div className="space-y-5">
      {/* Group standings table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(199,211,224,0.9)' }}
      >
        <div className="px-4 py-2 text-[10px] uppercase tracking-widest text-gray-500 font-semibold border-b border-slate-200 flex items-center justify-between gap-2">
          <span>Group Table</span>
          <span>{completedMatches}/6 results entered</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="text-gray-500 border-b border-slate-200">
                <th className="text-left font-semibold px-3 py-2 w-8">#</th>
                <th className="text-left font-semibold px-3 py-2">Team</th>
                <th className="text-right font-semibold px-2 py-2">P</th>
                <th className="text-right font-semibold px-2 py-2">W</th>
                <th className="text-right font-semibold px-2 py-2">D</th>
                <th className="text-right font-semibold px-2 py-2">L</th>
                <th className="text-right font-semibold px-2 py-2">GF</th>
                <th className="text-right font-semibold px-2 py-2">GA</th>
                <th className="text-right font-semibold px-2 py-2">GD</th>
                <th className="text-right font-semibold px-3 py-2">Pts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {standings.map(row => {
                const team = row.team
                const isElim  = eliminated.includes(team.id)
                const ownerId = drawState?.assignments ? getTeamOwner(team.id, drawState.assignments) : null
                const owner   = players.find(p => p.id === ownerId)
                const rankStyle = row.rank <= 2
                  ? { background: 'rgba(46,115,168,0.08)' }
                  : row.rank === 3
                    ? { background: 'rgba(255,255,255,0.02)' }
                    : {}

                return (
                  <tr key={team.id} style={rankStyle}>
                    <td className="px-3 py-2 text-gray-500 font-mono">{row.rank}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <FlagImage code={team.code} emoji={team.flag} size={18} style={{ opacity: isElim ? 0.3 : 1, filter: isElim ? 'grayscale(1)' : 'none' }} />
                        <div className="min-w-0">
                          <p className={`font-semibold truncate ${isElim ? 'line-through text-gray-600' : 'text-gray-200'}`}>
                            {team.name}
                          </p>
                          {owner && (
                            <p className="text-[10px] truncate" style={{ color: owner.color }}>{owner.name}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-2 text-right text-gray-300">{row.played}</td>
                    <td className="px-2 py-2 text-right text-gray-300">{row.won}</td>
                    <td className="px-2 py-2 text-right text-gray-300">{row.drawn}</td>
                    <td className="px-2 py-2 text-right text-gray-300">{row.lost}</td>
                    <td className="px-2 py-2 text-right text-gray-300">{row.gf}</td>
                    <td className="px-2 py-2 text-right text-gray-300">{row.ga}</td>
                    <td className={`px-2 py-2 text-right font-semibold ${row.gd > 0 ? 'text-green-400' : row.gd < 0 ? 'text-red-400' : 'text-gray-300'}`}>
                      {row.gd > 0 ? `+${row.gd}` : row.gd}
                    </td>
                    <td className="px-3 py-2 text-right font-black text-white">{row.points}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2 text-[10px] text-gray-500 border-t border-slate-200">
          Ranking order: points, goal difference, goals scored, then alphabetical.
        </div>
      </div>

      {/* Fixtures by matchday */}
      {matchdays.map(md => {
        const games = fixtures.filter(f => f.matchday === md)
        return (
          <div key={md}>
            <div className="flex items-center gap-3 mb-2">
              <span
                className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(46,115,168,0.1)', color: NEON, border: '1px solid rgba(46,115,168,0.25)' }}
              >
                Matchday {md}
              </span>
              {md === 3 && <span className="text-[10px] text-gray-500">• both games kick off simultaneously</span>}
            </div>
            <div className="space-y-1.5">
              {games.map((f, i) => (
                <MatchRow
                  key={f.id}
                  fixture={f}
                  teams={teams}
                  drawState={drawState}
                  eliminated={eliminated}
                  players={players}
                  matchResults={matchResults}
                  delay={i * 0.05}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function KnockoutRound({ round, matchResults, teams, knockoutTeams, drawState, players }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <h3 className="text-base font-bold text-white">{round.name}</h3>
        <span className="text-xs text-gray-500">{round.dates}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {round.matches.map((match) => (
          (() => {
            const result = matchResults[String(match.id)]
            const hasResult = Number.isFinite(result?.home) && Number.isFinite(result?.away)
            const participants = knockoutTeams[String(match.id)] || {}
            const homeTeam = getTeamById(participants.homeTeamId, teams)
            const awayTeam = getTeamById(participants.awayTeamId, teams)
            const homeOwner = homeTeam && drawState?.assignments
              ? players.find(p => p.id === getTeamOwner(homeTeam.id, drawState.assignments))
              : null
            const awayOwner = awayTeam && drawState?.assignments
              ? players.find(p => p.id === getTeamOwner(awayTeam.id, drawState.assignments))
              : null
            return (
          <div
            key={match.id}
            className="rounded-xl px-4 py-3 flex items-center gap-3"
            style={{
              background: 'rgba(255,255,255,0.92)',
              border: '1px solid rgba(199,211,224,0.9)',
            }}
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 truncate">{match.label}</p>
              {(homeTeam || awayTeam) && (
                <div className="text-xs text-gray-300 mt-0.5 flex items-center gap-1.5 min-w-0">
                  {homeTeam ? (
                    <>
                      <FlagImage code={homeTeam.code} emoji={homeTeam.flag} size={14} />
                      <span className="truncate">{homeTeam.name}</span>
                    </>
                  ) : <span>TBD</span>}
                  <span>vs</span>
                  {awayTeam ? (
                    <>
                      <FlagImage code={awayTeam.code} emoji={awayTeam.flag} size={14} />
                      <span className="truncate">{awayTeam.name}</span>
                    </>
                  ) : <span>TBD</span>}
                </div>
              )}
              {(homeOwner || awayOwner) && (
                <p className="text-[10px] text-gray-500 truncate mt-0.5">
                  {homeOwner ? homeOwner.name : 'Unassigned'} vs {awayOwner ? awayOwner.name : 'Unassigned'}
                </p>
              )}
              {match.venue && <p className="text-[10px] text-gray-600 truncate mt-0.5">{match.venue}</p>}
            </div>
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0"
              style={{
                background: hasResult ? 'rgba(46,115,168,0.12)' : 'rgba(230,242,250,0.85)',
                color: hasResult ? '#2E73A8' : '#6b7280',
                border: hasResult ? '1px solid rgba(46,115,168,0.3)' : 'none',
              }}
            >
              {hasResult ? `${result.home}-${result.away}` : 'TBD'}
            </span>
          </div>
            )
          })()
        ))}
      </div>
    </div>
  )
}

// ── main page ────────────────────────────────────────────────────────────────

export default function Fixtures() {
  const { TEAMS, PLAYERS, drawState, eliminated, matchResults, knockoutTeams } = useApp()
  const [view,       setView]       = useState('groups')   // 'groups' | 'knockout'
  const [activeGroup, setActiveGroup] = useState('A')
  const [search,     setSearch]     = useState('')

  // Filter groups by search (team name)
  const visibleGroups = useMemo(() => {
    if (!search.trim()) return GROUP_KEYS
    const q = search.toLowerCase()
    return GROUP_KEYS.filter(key =>
      GROUPS[key].teamIds.some(id => {
        const t = TEAMS.find(t => t.id === id)
        return t && t.name.toLowerCase().includes(q)
      })
    )
  }, [search, TEAMS])

  // Auto-select first visible group when search changes
  React.useEffect(() => {
    if (visibleGroups.length && !visibleGroups.includes(activeGroup)) {
      setActiveGroup(visibleGroups[0])
    }
  }, [visibleGroups])

  return (
    <div className="min-h-screen bg-grid py-8 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">FIFA World Cup 2026</p>
          <h1 className="text-4xl sm:text-5xl font-black mb-2">
            <span className="gradient-text">Fixtures & Results</span>{' '}
            <span aria-hidden="true">📅</span>
          </h1>
          <p className="text-gray-400 text-sm">12 groups · 48 teams · 72 group games · live scores shown here · June 11 – July 19, 2026</p>
        </motion.div>

        {/* View toggle */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="flex justify-center gap-2 mb-6"
        >
          {[
            { id: 'groups',   label: 'Group Stage', icon: '🏟️' },
            { id: 'knockout', label: 'Knockout',    icon: '⚡' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className="px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{
                background: view === tab.id ? 'rgba(46,115,168,0.12)' : 'rgba(255,255,255,0.94)',
                border:     view === tab.id ? '1px solid rgba(46,115,168,0.4)' : '1px solid rgba(199,211,224,1)',
                color:      view === tab.id ? NEON : '#9ca3af',
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">

          {/* ── GROUP STAGE ── */}
          {view === 'groups' && (
            <motion.div
              key="groups"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              {/* Search + group tabs */}
              <div className="space-y-3 mb-6">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by team name…"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all"
                    style={{
                      background: 'rgba(230,242,250,0.85)',
                      border:     '1px solid rgba(199,211,224,1)',
                    }}
                  />
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {visibleGroups.map(key => (
                    <button
                      key={key}
                      onClick={() => setActiveGroup(key)}
                      className="w-10 h-8 rounded-lg text-xs font-bold transition-all duration-150"
                      style={{
                        background: activeGroup === key ? 'rgba(46,115,168,0.15)' : 'rgba(255,255,255,0.94)',
                        border:     activeGroup === key ? '1px solid rgba(46,115,168,0.5)' : '1px solid rgba(199,211,224,1)',
                        color:      activeGroup === key ? NEON : '#9ca3af',
                      }}
                    >
                      {key}
                    </button>
                  ))}
                  {visibleGroups.length === 0 && (
                    <p className="text-sm text-gray-500">No groups match "{search}"</p>
                  )}
                </div>
              </div>

              {/* Active group */}
              {visibleGroups.includes(activeGroup) && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeGroup}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <h2 className="text-2xl font-black text-white">{GROUPS[activeGroup].name}</h2>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{ background: 'rgba(46,115,168,0.1)', color: NEON, border: '1px solid rgba(46,115,168,0.25)' }}
                      >
                        6 matches
                      </span>
                    </div>

                    <GroupPanel
                      groupKey={activeGroup}
                      group={GROUPS[activeGroup]}
                      teams={TEAMS}
                      drawState={drawState}
                      eliminated={eliminated}
                      players={PLAYERS}
                      matchResults={matchResults}
                    />
                  </motion.div>
                </AnimatePresence>
              )}

              {/* All groups at once (small screens friendly overview) */}
              <div className="mt-10 border-t border-slate-200 pt-8">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">All Groups Overview</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {GROUP_KEYS.map(key => {
                    const grpTeams = GROUPS[key].teamIds.map(id => TEAMS.find(t => t.id === id)).filter(Boolean)
                    return (
                      <button
                        key={key}
                        onClick={() => { setActiveGroup(key); setSearch(''); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                        className="rounded-xl p-3 text-left transition-all duration-150 hover:border-white/20"
                        style={{
                          background: activeGroup === key ? 'rgba(46,115,168,0.06)' : 'rgba(255,255,255,0.92)',
                          border:     activeGroup === key ? '1px solid rgba(46,115,168,0.3)' : '1px solid rgba(199,211,224,0.9)',
                        }}
                      >
                        <p className="text-xs font-bold mb-2" style={{ color: activeGroup === key ? NEON : '#6b7280' }}>
                          Group {key}
                        </p>
                        <div className="space-y-1">
                          {grpTeams.map(team => {
                            const isElim = eliminated.includes(team.id)
                            return (
                              <div key={team.id} className="flex items-center gap-1.5">
                                <FlagImage code={team.code} emoji={team.flag} size={16} style={{ opacity: isElim ? 0.3 : 1, filter: isElim ? 'grayscale(1)' : 'none' }} />
                                <span className={`text-xs truncate ${isElim ? 'text-gray-600 line-through' : 'text-gray-300'}`}>{team.name}</span>
                              </div>
                            )
                          })}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── KNOCKOUT ── */}
          {view === 'knockout' && (
            <motion.div
              key="knockout"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              {/* Banner */}
              <div
                className="rounded-2xl p-5 text-center"
                style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(199,211,224,0.9)' }}
              >
                <p className="text-2xl mb-1">⚡</p>
                <p className="text-white font-bold">Knockout rounds begin July 1, 2026</p>
                <p className="text-sm text-gray-500 mt-1">
                  Top 2 from each group + 8 best 3rd-place teams (32 teams total) advance to the Round of 32
                </p>
              </div>

              {KNOCKOUT_ROUNDS.map(round => (
                <KnockoutRound
                  key={round.id}
                  round={round}
                  matchResults={matchResults}
                  teams={TEAMS}
                  knockoutTeams={knockoutTeams}
                  drawState={drawState}
                  players={PLAYERS}
                />
              ))}
            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </div>
  )
}
