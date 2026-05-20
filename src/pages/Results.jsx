import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { GROUP_FIXTURES, KNOCKOUT_ROUNDS } from '../data/fixtures'
import FlagImage from '../components/FlagImage'

function hasScore(result) {
  return Number.isFinite(result?.home) && Number.isFinite(result?.away)
}

function ScorePill({ result }) {
  if (!hasScore(result)) {
    return (
      <span
        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0"
        style={{
          background: 'rgba(230,242,250,0.85)',
          color: '#6b7280',
        }}
      >
        Pending
      </span>
    )
  }

  return (
    <span
      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0"
      style={{
        background: 'rgba(46,115,168,0.12)',
        color: '#2E73A8',
        border: '1px solid rgba(46,115,168,0.3)',
      }}
    >
      {result.home}-{result.away}
    </span>
  )
}

function GroupResultRow({ fixture, teams, result }) {
  const home = teams.find(t => t.id === fixture.home)
  const away = teams.find(t => t.id === fixture.away)
  if (!home || !away) return null

  return (
    <div
      className="rounded-xl px-3 py-2.5 flex items-center gap-2"
      style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(199,211,224,0.9)' }}
    >
      <span className="text-[10px] text-gray-500 w-14 shrink-0">MD{fixture.matchday}</span>

      <div className="flex-1 flex items-center justify-end gap-2 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{home.name}</p>
        <FlagImage code={home.code} emoji={home.flag} size={20} />
      </div>

      <div className="w-24 shrink-0 text-center">
        <ScorePill result={result} />
      </div>

      <div className="flex-1 flex items-center gap-2 min-w-0">
        <FlagImage code={away.code} emoji={away.flag} size={20} />
        <p className="text-sm font-semibold text-white truncate">{away.name}</p>
      </div>
    </div>
  )
}

function KnockoutResultRow({ match, teams, knockoutTeams, result }) {
  const participants = knockoutTeams[String(match.id)] || {}
  const home = teams.find(t => t.id === participants.homeTeamId)
  const away = teams.find(t => t.id === participants.awayTeamId)

  return (
    <div
      className="rounded-xl px-3 py-2.5 flex items-center gap-3"
      style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(199,211,224,0.9)' }}
    >
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-gray-500">M{match.num}</p>
        <p className="text-xs text-gray-300 truncate">{match.label}</p>
        <p className="text-xs text-gray-500 truncate mt-0.5">
          {home ? `${home.flag} ${home.name}` : 'TBD'} vs {away ? `${away.flag} ${away.name}` : 'TBD'}
        </p>
      </div>

      <ScorePill result={result} />
    </div>
  )
}

export default function Results() {
  const { TEAMS, matchResults, knockoutTeams } = useApp()

  const groupByKey = useMemo(() => {
    return GROUP_FIXTURES.reduce((acc, fixture) => {
      acc[fixture.group] = acc[fixture.group] || []
      acc[fixture.group].push(fixture)
      return acc
    }, {})
  }, [])

  const summary = useMemo(() => {
    const groupTotal = GROUP_FIXTURES.length
    const groupDone = GROUP_FIXTURES.filter(f => hasScore(matchResults[String(f.id)])).length

    const knockoutMatches = KNOCKOUT_ROUNDS.flatMap(r => r.matches)
    const knockoutTotal = knockoutMatches.length
    const knockoutDone = knockoutMatches.filter(m => hasScore(matchResults[String(m.id)])).length

    return { groupTotal, groupDone, knockoutTotal, knockoutDone }
  }, [matchResults])

  return (
    <div className="min-h-screen bg-grid py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Source IT Services</p>
          <h1 className="text-4xl sm:text-5xl font-black mb-2">
            <span className="gradient-text">Match Results</span>
          </h1>
          <p className="text-sm text-gray-400">Read-only view for everyone. Results are managed from Admin.</p>
        </motion.div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-xl p-4"
          style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(199,211,224,1)' }}
        >
          <div className="rounded-lg px-3 py-2" style={{ background: 'rgba(46,115,168,0.08)' }}>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Group Stage</p>
            <p className="text-lg font-black text-white">{summary.groupDone}/{summary.groupTotal}</p>
          </div>
          <div className="rounded-lg px-3 py-2" style={{ background: 'rgba(46,115,168,0.08)' }}>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Knockout</p>
            <p className="text-lg font-black text-white">{summary.knockoutDone}/{summary.knockoutTotal}</p>
          </div>
        </div>

        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-white">Group Stage</h2>
            <p className="text-xs text-gray-500">All groups A-L</p>
          </div>

          {Object.keys(groupByKey).sort().map((groupKey, idx) => (
            <motion.div
              key={groupKey}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="space-y-2"
            >
              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(46,115,168,0.1)', color: '#2E73A8', border: '1px solid rgba(46,115,168,0.25)' }}
                >
                  Group {groupKey}
                </span>
                <span className="text-[10px] text-gray-500">{groupByKey[groupKey].filter(f => hasScore(matchResults[String(f.id)])).length}/6 played</span>
              </div>
              <div className="space-y-1.5">
                {groupByKey[groupKey]
                  .slice()
                  .sort((a, b) => a.matchday - b.matchday || a.id - b.id)
                  .map(fixture => (
                    <GroupResultRow
                      key={fixture.id}
                      fixture={fixture}
                      teams={TEAMS}
                      result={matchResults[String(fixture.id)]}
                    />
                  ))}
              </div>
            </motion.div>
          ))}
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-white">Knockout</h2>
            <p className="text-xs text-gray-500">Round of 32 to Final</p>
          </div>

          {KNOCKOUT_ROUNDS.map(round => (
            <div key={round.id} className="space-y-2">
              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(46,115,168,0.1)', color: '#2E73A8', border: '1px solid rgba(46,115,168,0.25)' }}
                >
                  {round.name}
                </span>
                <span className="text-[10px] text-gray-500">{round.matches.filter(m => hasScore(matchResults[String(m.id)])).length}/{round.matches.length} played</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {round.matches.map(match => (
                  <KnockoutResultRow
                    key={match.id}
                    match={match}
                    teams={TEAMS}
                    knockoutTeams={knockoutTeams}
                    result={matchResults[String(match.id)]}
                  />
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}
