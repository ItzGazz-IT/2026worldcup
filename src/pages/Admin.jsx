import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { POT_CONFIG } from '../data/teams'
import { GROUPS, GROUP_FIXTURES, KNOCKOUT_ROUNDS } from '../data/fixtures'
import FlagImage from '../components/FlagImage'

// ── Simple client-side password gate (not a security feature) ────────────────
// This just prevents accidental access. Do NOT use for anything sensitive.
const ADMIN_PASSWORD = 'sourceit2026'
const ADMIN_AUTH_KEY = 'wc2026_admin_authed'

export default function Admin() {
  const [authed,      setAuthed]      = useState(() => localStorage.getItem(ADMIN_AUTH_KEY) === '1')
  const [pwInput,     setPwInput]     = useState('')
  const [pwError,     setPwError]     = useState(false)
  const [activeTab,   setActiveTab]   = useState('draw')
  const [pointInputs, setPointInputs] = useState({})
  const [resultsGroup, setResultsGroup] = useState('A')
  const [resultsRound, setResultsRound] = useState('r32')

  const {
    PLAYERS, TEAMS, drawState, points, eliminated, matchResults, knockoutTeams,
    startDraw, drawAllTeams, resetDraw, lockDraw, unlockDraw,
    updatePoints, toggleEliminated, updateMatchResult, clearMatchResults, updateKnockoutTeams, clearKnockoutTeams,
  } = useApp()

  const getTeam = (teamId) => TEAMS.find(t => t.id === teamId)
  const getTeamName = (teamId) => TEAMS.find(t => t.id === teamId)?.name || `Team ${teamId}`

  const groupFixtures = GROUP_FIXTURES.filter(f => f.group === resultsGroup)
  const knockoutRound = KNOCKOUT_ROUNDS.find(r => r.id === resultsRound) || KNOCKOUT_ROUNDS[0]
  const sortedTeams = useMemo(() => [...TEAMS].sort((a, b) => a.name.localeCompare(b.name)), [TEAMS])

  // ── Auth gate ─────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-grid flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm"
        >
          <div
            className="rounded-2xl p-8"
            style={{ backdropFilter: 'blur(20px)', background: 'rgba(230,242,250,0.85)', border: '1px solid rgba(199,211,224,1)' }}
          >
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">⚙️</div>
              <h1 className="text-2xl font-black text-white">Admin Panel</h1>
              <p className="text-sm text-gray-400 mt-1">Enter the admin password to continue</p>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault()
                if (pwInput === ADMIN_PASSWORD) {
                  setAuthed(true)
                  localStorage.setItem(ADMIN_AUTH_KEY, '1')
                  setPwError(false)
                }
                else { setPwError(true); setPwInput('') }
              }}
              className="space-y-4"
            >
              <div>
                <input
                  type="password"
                  value={pwInput}
                  onChange={e => { setPwInput(e.target.value); setPwError(false) }}
                  placeholder="Password"
                  className="w-full px-4 py-3 rounded-xl text-white bg-white/5 border outline-none transition-colors text-sm"
                  style={{ borderColor: pwError ? '#ff4757' : 'rgba(199,211,224,1)' }}
                  autoComplete="current-password"
                />
                {pwError && (
                  <p className="text-red-400 text-xs mt-1.5">Incorrect password. Try again.</p>
                )}
              </div>
              <button type="submit" className="btn-neon w-full justify-center">
                🔓 Enter Admin
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    )
  }

  // ── Tabs ──────────────────────────────────────────────────────────────────
  const TABS = [
    { id: 'draw',   label: '🎲 Draw',   },
    { id: 'results', label: '🧾 Results', },
    { id: 'points', label: '📊 Points', },
    { id: 'teams',  label: '🌍 Teams',  },
  ]

  return (
    <div className="min-h-screen bg-grid py-8 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Source IT Services</p>
              <h1 className="text-3xl sm:text-4xl font-black">
                <span className="gradient-text">Admin Panel</span>{' '}
                <span aria-hidden="true">⚙️</span>
              </h1>
            </div>
            <button
              onClick={() => {
                setAuthed(false)
                localStorage.removeItem(ADMIN_AUTH_KEY)
              }}
              className="btn-danger text-sm"
            >
              🚪 Logout
            </button>
          </div>

          {/* Draw status bar */}
          <div
            className="mt-4 px-4 py-3 rounded-xl flex flex-wrap gap-4 text-xs"
            style={{ background: 'rgba(255,255,255,0.94)', border: '1px solid rgba(199,211,224,1)' }}
          >
            <span className="text-gray-400">Status: <span className="text-white font-semibold">
              {drawState.isLocked ? '🔒 Locked' : drawState.isComplete ? '✅ Complete' : drawState.isStarted ? '🟢 In Progress' : '⚪ Not Started'}
            </span></span>
            <span className="text-gray-400">Teams drawn: <span className="text-white font-semibold">{drawState.drawIndex}/{TEAMS.length}</span></span>
            <span className="text-gray-400">Eliminated: <span className="text-red-400 font-semibold">{eliminated.length}</span></span>
          </div>
        </motion.div>

        {/* Tab bar */}
        <div className="flex gap-2 mb-6">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
              style={{
                background: activeTab === t.id ? 'rgba(46,115,168,0.12)' : 'rgba(255,255,255,0.94)',
                color: activeTab === t.id ? '#2E73A8' : '#9ca3af',
                border: `1px solid ${activeTab === t.id ? 'rgba(46,115,168,0.3)' : 'rgba(199,211,224,0.8)'}`,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* ── Draw Tab ────────────────────────────────────────────────── */}
          {activeTab === 'draw' && (
            <motion.div key="draw" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div
                className="rounded-xl p-6 space-y-4"
                style={{ backdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.94)', border: '1px solid rgba(199,211,224,1)' }}
              >
                <h2 className="font-bold text-white">Draw Management</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {!drawState.isStarted && (
                    <button className="btn-neon justify-center" onClick={startDraw}>
                      🚀 Start Draw
                    </button>
                  )}
                  {drawState.isStarted && !drawState.isComplete && (
                    <button className="btn-neon justify-center" onClick={drawAllTeams}>
                      ⏩ Complete Draw
                    </button>
                  )}
                  {!drawState.isStarted && (
                    <button className="btn-neon justify-center" onClick={drawAllTeams}>
                      🎲 Randomize All
                    </button>
                  )}
                  {drawState.isStarted && !drawState.isLocked && (
                    <button className="btn-outline justify-center" onClick={lockDraw}>
                      🔒 Lock Draw
                    </button>
                  )}
                  {drawState.isLocked && (
                    <button className="btn-outline justify-center" onClick={unlockDraw}>
                      🔓 Unlock Draw
                    </button>
                  )}
                  <button className="btn-danger justify-center col-span-2 sm:col-span-1" onClick={() => {
                    if (window.confirm('Reset the entire draw? This cannot be undone.')) resetDraw()
                  }}>
                    ♻️ Reset Everything
                  </button>
                </div>

                {/* Current assignments summary */}
                {drawState.isStarted && (
                  <div className="pt-4 border-t border-slate-200">
                    <p className="text-xs text-gray-400 mb-3 uppercase tracking-wide">Current Assignments</p>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {PLAYERS.map(p => {
                        const count = (drawState.assignments[p.id] || []).length
                        return (
                          <div
                            key={p.id}
                            className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs"
                            style={{ background: `${p.color}0a`, border: `1px solid ${p.color}20` }}
                          >
                            <span>{p.avatar}</span>
                            <span style={{ color: p.color }}>{p.name}</span>
                            <span className="ml-auto text-gray-500">{count}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ── Results Tab ─────────────────────────────────────────────── */}
          {activeTab === 'results' && (
            <motion.div key="results" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div
                className="rounded-xl p-6 space-y-6"
                style={{ backdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.94)', border: '1px solid rgba(199,211,224,1)' }}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="font-bold text-white">Match Results</h2>
                  <button
                    className="btn-danger text-sm"
                    onClick={() => {
                      if (window.confirm('Clear all saved match results?')) clearMatchResults()
                    }}
                  >
                    🗑️ Clear All Results
                  </button>
                </div>

                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-wide text-gray-400">Group Stage</p>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.keys(GROUPS).map(groupKey => (
                      <button
                        key={groupKey}
                        onClick={() => setResultsGroup(groupKey)}
                        className="w-10 h-8 rounded-lg text-xs font-bold transition-all duration-150"
                        style={{
                          background: resultsGroup === groupKey ? 'rgba(46,115,168,0.15)' : 'rgba(255,255,255,0.94)',
                          border: resultsGroup === groupKey ? '1px solid rgba(46,115,168,0.5)' : '1px solid rgba(199,211,224,1)',
                          color: resultsGroup === groupKey ? '#2E73A8' : '#9ca3af',
                        }}
                      >
                        {groupKey}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    {groupFixtures.map(fixture => {
                      const result = matchResults[String(fixture.id)] || { home: null, away: null }
                      const homeTeam = getTeam(fixture.home)
                      const awayTeam = getTeam(fixture.away)
                      return (
                        <div
                          key={fixture.id}
                          className="rounded-xl px-3 py-2.5 flex items-center gap-2"
                          style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(199,211,224,0.9)' }}
                        >
                          <span className="text-[10px] text-gray-500 w-12 shrink-0">MD{fixture.matchday}</span>
                          <span className="text-xs text-gray-200 flex-1 truncate inline-flex items-center gap-1.5">
                            {homeTeam && <FlagImage code={homeTeam.code} emoji={homeTeam.flag} size={16} />}
                            {getTeamName(fixture.home)}
                          </span>
                          <input
                            type="number"
                            min="0"
                            value={result.home ?? ''}
                            onChange={e => updateMatchResult(fixture.id, e.target.value, result.away ?? '')}
                            className="w-14 px-2 py-1 rounded-lg text-sm font-bold bg-white/5 border border-slate-300 text-white outline-none text-center"
                          />
                          <span className="text-xs text-gray-500">-</span>
                          <input
                            type="number"
                            min="0"
                            value={result.away ?? ''}
                            onChange={e => updateMatchResult(fixture.id, result.home ?? '', e.target.value)}
                            className="w-14 px-2 py-1 rounded-lg text-sm font-bold bg-white/5 border border-slate-300 text-white outline-none text-center"
                          />
                          <span className="text-xs text-gray-200 flex-1 truncate text-right inline-flex items-center justify-end gap-1.5">
                            {getTeamName(fixture.away)}
                            {awayTeam && <FlagImage code={awayTeam.code} emoji={awayTeam.flag} size={16} />}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-200">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs uppercase tracking-wide text-gray-400">Knockout</p>
                    <button
                      className="btn-outline text-xs"
                      onClick={() => {
                        if (window.confirm('Clear all saved knockout team selections?')) clearKnockoutTeams()
                      }}
                    >
                      Clear Knockout Teams
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {KNOCKOUT_ROUNDS.map(round => (
                      <button
                        key={round.id}
                        onClick={() => setResultsRound(round.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
                        style={{
                          background: resultsRound === round.id ? 'rgba(46,115,168,0.12)' : 'rgba(255,255,255,0.94)',
                          border: resultsRound === round.id ? '1px solid rgba(46,115,168,0.45)' : '1px solid rgba(199,211,224,1)',
                          color: resultsRound === round.id ? '#2E73A8' : '#9ca3af',
                        }}
                      >
                        {round.name}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    {knockoutRound.matches.map(match => {
                      const result = matchResults[String(match.id)] || { home: null, away: null }
                      const teamsForMatch = knockoutTeams[String(match.id)] || { homeTeamId: null, awayTeamId: null }
                      return (
                        <div
                          key={match.id}
                          className="rounded-xl px-3 py-2.5 space-y-2"
                          style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(199,211,224,0.9)' }}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-500 w-14 shrink-0">M{match.num}</span>
                            <span className="text-xs text-gray-200 flex-1 truncate">{match.label}</span>
                            <input
                              type="number"
                              min="0"
                              value={result.home ?? ''}
                              onChange={e => updateMatchResult(match.id, e.target.value, result.away ?? '')}
                              className="w-14 px-2 py-1 rounded-lg text-sm font-bold bg-white/5 border border-slate-300 text-white outline-none text-center"
                            />
                            <span className="text-xs text-gray-500">-</span>
                            <input
                              type="number"
                              min="0"
                              value={result.away ?? ''}
                              onChange={e => updateMatchResult(match.id, result.home ?? '', e.target.value)}
                              className="w-14 px-2 py-1 rounded-lg text-sm font-bold bg-white/5 border border-slate-300 text-white outline-none text-center"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-2 items-center">
                            <select
                              value={teamsForMatch.homeTeamId ?? ''}
                              onChange={e => updateKnockoutTeams(match.id, e.target.value, teamsForMatch.awayTeamId ?? '')}
                              className="w-full px-2 py-1.5 rounded-lg text-xs bg-white/5 border border-slate-300 text-white outline-none"
                            >
                              <option value="">Home team (TBD)</option>
                              {sortedTeams.map(team => (
                                <option key={team.id} value={team.id}>{team.flag} {team.name}</option>
                              ))}
                            </select>

                            <span className="text-[10px] text-gray-500 text-center">vs</span>

                            <select
                              value={teamsForMatch.awayTeamId ?? ''}
                              onChange={e => updateKnockoutTeams(match.id, teamsForMatch.homeTeamId ?? '', e.target.value)}
                              className="w-full px-2 py-1.5 rounded-lg text-xs bg-white/5 border border-slate-300 text-white outline-none"
                            >
                              <option value="">Away team (TBD)</option>
                              {sortedTeams.map(team => (
                                <option key={team.id} value={team.id}>{team.flag} {team.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <p className="text-xs text-gray-500">Scores and knockout teams save automatically. Add teams to knockout matches so leaderboard can award knockout points to the correct owners.</p>
              </div>
            </motion.div>
          )}

          {/* ── Points Tab ──────────────────────────────────────────────── */}
          {activeTab === 'points' && (
            <motion.div key="points" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div
                className="rounded-xl p-6"
                style={{ backdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.94)', border: '1px solid rgba(199,211,224,1)' }}
              >
                <h2 className="font-bold text-white mb-4">Edit Points</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PLAYERS.map(p => (
                    <div
                      key={p.id}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl"
                      style={{ background: `${p.color}08`, border: `1px solid ${p.color}20` }}
                    >
                      <span className="text-xl">{p.avatar}</span>
                      <span className="font-bold text-sm flex-1" style={{ color: p.color }}>{p.name}</span>
                      <input
                        type="number"
                        min="0"
                        value={pointInputs[p.id] ?? points[p.id] ?? 0}
                        onChange={e => setPointInputs(prev => ({ ...prev, [p.id]: e.target.value }))}
                        onBlur={e => {
                          updatePoints(p.id, e.target.value)
                          setPointInputs(prev => ({ ...prev, [p.id]: undefined }))
                        }}
                        className="w-20 text-right px-2 py-1 rounded-lg text-sm font-bold bg-white/5 border border-slate-300 text-white outline-none"
                        style={{ color: p.color }}
                      />
                      <span className="text-xs text-gray-500">pts</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-4">Click out of a field to save. Changes are persisted locally.</p>
              </div>
            </motion.div>
          )}

          {/* ── Teams Tab ───────────────────────────────────────────────── */}
          {activeTab === 'teams' && (
            <motion.div key="teams" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div
                className="rounded-xl p-6"
                style={{ backdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.94)', border: '1px solid rgba(199,211,224,1)' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-white">Team Elimination</h2>
                  <span className="text-xs text-gray-400">{eliminated.length} eliminated</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {TEAMS.map(team => {
                    const isOut = eliminated.includes(team.id)
                    const pot   = POT_CONFIG[team.pot]
                    return (
                      <button
                        key={team.id}
                        onClick={() => toggleEliminated(team.id)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-left transition-all duration-200"
                        style={{
                          background: isOut ? 'rgba(255,71,87,0.1)' : `${pot.color}08`,
                          border: `1px solid ${isOut ? 'rgba(255,71,87,0.3)' : `${pot.color}25`}`,
                          opacity: isOut ? 0.7 : 1,
                        }}
                      >
                        <FlagImage code={team.code} emoji={team.flag} size={24} style={{ borderRadius: 3, flexShrink: 0 }} />
                        <span className="truncate flex-1" style={{ color: isOut ? '#ff4757' : '#e5e7eb' }}>
                          {team.name}
                        </span>
                        <span className="shrink-0 text-[10px]">
                          {isOut ? '❌' : '✅'}
                        </span>
                      </button>
                    )
                  })}
                </div>
                <p className="text-xs text-gray-500 mt-4">Toggle to mark a team as eliminated. This affects leaderboard counts.</p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
