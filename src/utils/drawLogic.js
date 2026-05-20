/**
 * Draw Logic Utilities – WC 2026 Office Sweepstake
 */

/**
 * Shuffle an array using the Fisher-Yates algorithm.
 * Returns a new array; does not mutate the original.
 */
export function shuffleArray(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/**
 * Build a shuffled team-ID sequence that guarantees every player gets exactly
 * one team from each pot, with leftover teams spread randomly across pots.
 *
 * Designed for SEQUENTIAL BATCH assignment (not round-robin):
 *   player 0 → result[0..n0-1], player 1 → result[n0..n0+n1-1], …
 *
 * With 48 teams (12 per pot) / 10 players:
 *   • Players 0-7 get 5 teams: 1 guaranteed from each of the 4 pots + 1 random bonus
 *   • Players 8-9 get 4 teams: exactly 1 from each of the 4 pots
 *
 * @param {Object[]} teams    Full TEAMS array (must have .pot and .id)
 * @param {Object[]} players  PLAYERS array
 * @returns {number[]}        Ordered array of team IDs
 */
export function createFairShuffledTeamIds(teams, players) {
  const numPlayers = players.length
  const baseCount  = Math.floor(teams.length / numPlayers) // 4
  const extraCount = teams.length % numPlayers              // 8

  // Shuffle each pot independently
  const pots = [1, 2, 3, 4]
  const byPot = {}
  for (const pot of pots) {
    byPot[pot] = shuffleArray(teams.filter(t => t.pot === pot).map(t => t.id))
  }

  // The first `numPlayers` entries of each pot are the guaranteed per-player teams.
  // Anything beyond that (numPlayers…end) is pooled as extras and re-shuffled.
  const extras = shuffleArray(
    pots.flatMap(pot => byPot[pot].slice(numPlayers))
  )

  const result = []
  for (let p = 0; p < numPlayers; p++) {
    // One guaranteed team from each pot
    for (const pot of pots) {
      result.push(byPot[pot][p])
    }
    // Players below the extra threshold get one bonus team
    if (p < extraCount) {
      result.push(extras[p])
    }
  }
  return result
}

/**
 * Assign teams fairly to players in round-robin order.
 * With 48 teams and 10 players: players 1-8 get 5 teams, players 9-10 get 4 teams.
 * @param {number[]} shuffledTeamIds  Shuffled array of team IDs
 * @param {Object[]} players          Array of player objects with `id` property
 * @returns {{ [playerId: string]: number[] }}
 */
export function assignTeamsFairly(shuffledTeamIds, players) {
  const assignments = Object.fromEntries(players.map(p => [p.id, []]))
  shuffledTeamIds.forEach((teamId, index) => {
    const playerId = players[index % players.length].id
    assignments[playerId].push(teamId)
  })
  return assignments
}

/**
 * Verify no team is assigned to more than one player.
 * Returns true when the assignments are clean.
 */
export function preventDuplicateTeams(assignments) {
  const all = Object.values(assignments).flat()
  return all.length === new Set(all).size
}

/**
 * Calculate the leaderboard sorted by points then teams-still-alive.
 * @returns {{ position, ...player, assignedTeams, aliveTeams, teamsAlive, totalTeams, points }[]}
 */
export function calculateLeaderboard(players, assignments, points, eliminated, teams) {
  return players
    .map(player => {
      const assignedTeamIds = assignments[player.id] || []
      const assignedTeams   = teams.filter(t => assignedTeamIds.includes(t.id))
      const aliveTeams      = assignedTeams.filter(t => !eliminated.includes(t.id))
      return {
        ...player,
        assignedTeams,
        aliveTeams,
        teamsAlive:  aliveTeams.length,
        totalTeams:  assignedTeams.length,
        points:      points[player.id] || 0,
      }
    })
    .sort((a, b) => b.points !== a.points ? b.points - a.points : b.teamsAlive - a.teamsAlive)
    .map((entry, i) => ({ ...entry, position: i + 1 }))
}

/**
 * Return the player ID that owns a given team, or null.
 */
export function getTeamOwner(teamId, assignments) {
  for (const [playerId, teamIds] of Object.entries(assignments)) {
    if (teamIds.includes(teamId)) return playerId
  }
  return null
}

/**
 * Calculate sweepstake player points from group-stage match results.
 * Scoring: win = 3, draw = 1, loss = 0.
 */
export function calculatePointsFromResults(players, assignments, matchResults, fixtures) {
  const points = Object.fromEntries(players.map(p => [p.id, 0]))

  fixtures.forEach(fixture => {
    const result = matchResults[String(fixture.id)]
    const hasResult = Number.isFinite(result?.home) && Number.isFinite(result?.away)
    if (!hasResult) return

    const homeOwner = getTeamOwner(fixture.home, assignments)
    const awayOwner = getTeamOwner(fixture.away, assignments)

    if (result.home > result.away) {
      if (homeOwner) points[homeOwner] = (points[homeOwner] || 0) + 3
    } else if (result.home < result.away) {
      if (awayOwner) points[awayOwner] = (points[awayOwner] || 0) + 3
    } else {
      if (homeOwner) points[homeOwner] = (points[homeOwner] || 0) + 1
      if (awayOwner) points[awayOwner] = (points[awayOwner] || 0) + 1
    }
  })

  return points
}

/**
 * Return draw completion percentage (0-100).
 */
export function getDrawProgress(drawIndex, totalTeams) {
  return Math.round((drawIndex / totalTeams) * 100)
}
