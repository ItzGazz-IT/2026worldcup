import React, {
  createContext, useContext, useState, useEffect, useCallback, useRef,
} from 'react'
import { TEAMS }   from '../data/teams'
import { PLAYERS } from '../data/players'
import { createFairShuffledTeamIds, assignTeamsFairly } from '../utils/drawLogic'
import { saveGameState, subscribeGameState } from '../firebase/firestore'
import { isFirebaseConfigured } from '../firebase/config'

const AppContext = createContext(null)

// ── LocalStorage keys ─────────────────────────────────────────────────────────
const LS = {
  DRAW:       'wc2026_draw_state',
  POINTS:     'wc2026_points',
  ELIMINATED: 'wc2026_eliminated',
  RESULTS:    'wc2026_match_results',
  KNOCKOUT_TEAMS: 'wc2026_knockout_teams',
}

function load(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch { return fallback }
}

const initDraw = () => ({
  shuffledTeamIds: [],
  assignments: Object.fromEntries(PLAYERS.map(p => [p.id, []])),
  drawIndex: 0,
  isStarted: false,
  isLocked:  false,
  isComplete: false,
})
const initPoints     = () => Object.fromEntries(PLAYERS.map(p => [p.id, 0]))
const initEliminated = () => []
const initResults    = () => ({})
const initKnockoutTeams = () => ({})

// ── Provider ──────────────────────────────────────────────────────────────────
export function AppProvider({ children }) {
  const [drawState,  setDrawState]  = useState(() => load(LS.DRAW,       initDraw()))
  const [points,     setPoints]     = useState(() => load(LS.POINTS,     initPoints()))
  const [eliminated, setEliminated] = useState(() => load(LS.ELIMINATED, initEliminated()))
  const [matchResults, setMatchResults] = useState(() => load(LS.RESULTS, initResults()))
  const [knockoutTeams, setKnockoutTeams] = useState(() => load(LS.KNOCKOUT_TEAMS, initKnockoutTeams()))

  // ── Firestore sync ──────────────────────────────────────────────────────────
  //
  // isSyncing: true for a short window after WE write to Firestore so our own
  // snapshot echo doesn't overwrite the newer local state mid-draw.
  const isSyncing = useRef(false)

  // Subscribe to Firestore on mount; update local state when remote changes
  useEffect(() => {
    if (!isFirebaseConfigured) return
    const unsub = subscribeGameState(remote => {
      if (isSyncing.current) return
      // Only accept remote drawState if it's at least as far along as ours
      // (guards against a stale snapshot arriving during a rapid draw)
      if (remote.drawState != null) {
        setDrawState(prev =>
          remote.drawState.drawIndex >= prev.drawIndex ? remote.drawState : prev
        )
      }
      if (remote.points        != null) setPoints(remote.points)
      if (remote.eliminated    != null) setEliminated(remote.eliminated)
      if (remote.matchResults  != null) setMatchResults(remote.matchResults)
      if (remote.knockoutTeams != null) setKnockoutTeams(remote.knockoutTeams)
    })
    return unsub
  }, [])

  // Persist to localStorage AND Firestore whenever state changes
  useEffect(() => {
    localStorage.setItem(LS.DRAW, JSON.stringify(drawState))
    if (!isFirebaseConfigured) return
    isSyncing.current = true
    const t = setTimeout(() => {
      saveGameState({ drawState, points, eliminated, matchResults, knockoutTeams })
        .catch(err => console.error('[Firestore] saveGameState failed:', err))
        .finally(() => {
          // Lift the silence window after the snapshot round-trip should have arrived
          setTimeout(() => { isSyncing.current = false }, 2000)
        })
    }, 400)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawState])

  useEffect(() => {
    localStorage.setItem(LS.POINTS, JSON.stringify(points))
    if (!isFirebaseConfigured) return
    isSyncing.current = true
    const t = setTimeout(() => {
      saveGameState({ drawState, points, eliminated, matchResults, knockoutTeams })
        .catch(err => console.error('[Firestore] saveGameState failed:', err))
        .finally(() => { setTimeout(() => { isSyncing.current = false }, 2000) })
    }, 400)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points])

  useEffect(() => {
    localStorage.setItem(LS.ELIMINATED, JSON.stringify(eliminated))
    if (!isFirebaseConfigured) return
    isSyncing.current = true
    const t = setTimeout(() => {
      saveGameState({ drawState, points, eliminated, matchResults, knockoutTeams })
        .catch(err => console.error('[Firestore] saveGameState failed:', err))
        .finally(() => { setTimeout(() => { isSyncing.current = false }, 2000) })
    }, 400)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eliminated])

  useEffect(() => {
    localStorage.setItem(LS.RESULTS, JSON.stringify(matchResults))
    if (!isFirebaseConfigured) return
    isSyncing.current = true
    const t = setTimeout(() => {
      saveGameState({ drawState, points, eliminated, matchResults, knockoutTeams })
        .catch(err => console.error('[Firestore] saveGameState failed:', err))
        .finally(() => { setTimeout(() => { isSyncing.current = false }, 2000) })
    }, 400)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchResults])

  useEffect(() => {
    localStorage.setItem(LS.KNOCKOUT_TEAMS, JSON.stringify(knockoutTeams))
    if (!isFirebaseConfigured) return
    isSyncing.current = true
    const t = setTimeout(() => {
      saveGameState({ drawState, points, eliminated, matchResults, knockoutTeams })
        .catch(err => console.error('[Firestore] saveGameState failed:', err))
        .finally(() => { setTimeout(() => { isSyncing.current = false }, 2000) })
    }, 400)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [knockoutTeams])

  // ── Draw actions ────────────────────────────────────────────────────────────

  /** Shuffle teams and prepare a fresh draw with guaranteed pot-fair distribution */
  const startDraw = useCallback(() => {
    const shuffled = createFairShuffledTeamIds(TEAMS, PLAYERS)
    setDrawState({
      shuffledTeamIds: shuffled,
      assignments:     Object.fromEntries(PLAYERS.map(p => [p.id, []])),
      drawIndex:       0,
      isStarted:       true,
      isLocked:        false,
      isComplete:      false,
    })
  }, [])

  /** Draw the next single team and assign it to the next player */
  const drawNextTeam = useCallback(() => {
    setDrawState(prev => {
      if (!prev.isStarted || prev.isComplete || prev.isLocked) return prev
      if (prev.drawIndex >= TEAMS.length) return { ...prev, isComplete: true }

      const teamId   = prev.shuffledTeamIds[prev.drawIndex]
      const playerId = PLAYERS[prev.drawIndex % PLAYERS.length].id
      const isComplete = prev.drawIndex + 1 >= TEAMS.length

      return {
        ...prev,
        assignments: {
          ...prev.assignments,
          [playerId]: [...(prev.assignments[playerId] || []), teamId],
        },
        drawIndex: prev.drawIndex + 1,
        isComplete,
      }
    })
  }, [])

  /** Draw the next single team and assign it to a specific player */
  const drawTeamToPlayer = useCallback((playerId) => {
    setDrawState(prev => {
      if (!prev.isStarted || prev.isComplete || prev.isLocked) return prev
      if (!playerId) return prev
      if (prev.drawIndex >= TEAMS.length) return { ...prev, isComplete: true }

      const teamId = prev.shuffledTeamIds[prev.drawIndex]
      const isComplete = prev.drawIndex + 1 >= TEAMS.length

      return {
        ...prev,
        assignments: {
          ...prev.assignments,
          [playerId]: [...(prev.assignments[playerId] || []), teamId],
        },
        drawIndex: prev.drawIndex + 1,
        isComplete,
      }
    })
  }, [])

  /** Instantly complete the entire draw (admin shortcut) — also uses fair pot distribution */
  const drawAllTeams = useCallback(() => {
    const shuffledTeamIds = createFairShuffledTeamIds(TEAMS, PLAYERS)
    // Sequential batch assignment (matches the per-player interactive draw)
    const numPlayers = PLAYERS.length
    const baseCount  = Math.floor(TEAMS.length / numPlayers)
    const extraCount = TEAMS.length % numPlayers
    const assignments = Object.fromEntries(PLAYERS.map(p => [p.id, []]))
    let idx = 0
    for (let p = 0; p < numPlayers; p++) {
      const n = baseCount + (p < extraCount ? 1 : 0)
      for (let i = 0; i < n; i++) assignments[PLAYERS[p].id].push(shuffledTeamIds[idx++])
    }
    setDrawState({
      shuffledTeamIds,
      assignments,
      drawIndex:       TEAMS.length,
      isStarted:       true,
      isLocked:        false,
      isComplete:      true,
    })
  }, [])

  /** Reset everything back to initial state */
  const resetDraw = useCallback(() => {
    setDrawState(initDraw())
    setPoints(initPoints())
    setEliminated(initEliminated())
    setMatchResults(initResults())
    setKnockoutTeams(initKnockoutTeams())
  }, [])

  const lockDraw   = useCallback(() => setDrawState(p => ({ ...p, isLocked: true  })), [])
  const unlockDraw = useCallback(() => setDrawState(p => ({ ...p, isLocked: false })), [])

  // ── Points / elimination ────────────────────────────────────────────────────

  const updatePoints = useCallback((playerId, value) => {
    setPoints(p => ({ ...p, [playerId]: Number(value) }))
  }, [])

  const toggleEliminated = useCallback((teamId) => {
    setEliminated(p =>
      p.includes(teamId) ? p.filter(id => id !== teamId) : [...p, teamId]
    )
  }, [])

  const updateMatchResult = useCallback((matchId, homeValue, awayValue) => {
    setMatchResults(prev => {
      const key = String(matchId)

      const home = homeValue === '' ? null : Number(homeValue)
      const away = awayValue === '' ? null : Number(awayValue)

      if ((home !== null && (!Number.isFinite(home) || home < 0)) || (away !== null && (!Number.isFinite(away) || away < 0))) {
        return prev
      }

      if (home === null && away === null) {
        if (!(key in prev)) return prev
        const next = { ...prev }
        delete next[key]
        return next
      }

      return {
        ...prev,
        [key]: {
          home: home === null ? null : Math.floor(home),
          away: away === null ? null : Math.floor(away),
          updatedAt: Date.now(),
        },
      }
    })
  }, [])

  const clearMatchResults = useCallback(() => {
    setMatchResults(initResults())
  }, [])

  const updateKnockoutTeams = useCallback((matchId, homeTeamIdValue, awayTeamIdValue) => {
    setKnockoutTeams(prev => {
      const key = String(matchId)
      const homeTeamId = homeTeamIdValue === '' ? null : Number(homeTeamIdValue)
      const awayTeamId = awayTeamIdValue === '' ? null : Number(awayTeamIdValue)

      if ((homeTeamId !== null && !Number.isFinite(homeTeamId)) || (awayTeamId !== null && !Number.isFinite(awayTeamId))) {
        return prev
      }

      if (homeTeamId === null && awayTeamId === null) {
        if (!(key in prev)) return prev
        const next = { ...prev }
        delete next[key]
        return next
      }

      return {
        ...prev,
        [key]: {
          homeTeamId,
          awayTeamId,
          updatedAt: Date.now(),
        },
      }
    })
  }, [])

  const clearKnockoutTeams = useCallback(() => {
    setKnockoutTeams(initKnockoutTeams())
  }, [])

  // ── Derived helpers ─────────────────────────────────────────────────────────

  /** Teams assigned to a specific player */
  const getPlayerTeams = useCallback(
    (playerId) => TEAMS.filter(t => (drawState.assignments[playerId] || []).includes(t.id)),
    [drawState.assignments]
  )

  /** The team card that was most recently drawn */
  const currentDrawnTeam = drawState.isStarted && drawState.drawIndex > 0
    ? TEAMS.find(t => t.id === drawState.shuffledTeamIds[drawState.drawIndex - 1]) ?? null
    : null

  /** The player who received the most recently drawn team */
  const currentDrawnPlayer = currentDrawnTeam
    ? PLAYERS.find(p => (drawState.assignments[p.id] || []).includes(currentDrawnTeam.id)) ?? null
    : null

  const value = {
    // State
    drawState, points, eliminated, matchResults, knockoutTeams,
    // Draw actions
    startDraw, drawNextTeam, drawTeamToPlayer, drawAllTeams, resetDraw, lockDraw, unlockDraw,
    // Data actions
    updatePoints, toggleEliminated, updateMatchResult, clearMatchResults, updateKnockoutTeams, clearKnockoutTeams,
    // Derived
    getPlayerTeams, currentDrawnTeam, currentDrawnPlayer,
    // Raw data refs
    PLAYERS, TEAMS,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}
