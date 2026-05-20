/**
 * Firestore CRUD helpers – WC 2026 Office Sweepstake
 *
 * Collections used:
 *   players     – player records
 *   teams       – team records (elimination status etc.)
 *   drawState   – single document holding the full draw state
 *   leaderboard – per-player point totals
 *
 * All functions degrade gracefully when Firebase is not configured
 * (the app falls back to localStorage via AppContext).
 */

import {
  collection, doc,
  getDoc, getDocs, setDoc, updateDoc, deleteDoc,
  onSnapshot, writeBatch, serverTimestamp,
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from './config'

// ── Helpers ──────────────────────────────────────────────────────────────────

function guard() {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase is not configured. Add credentials to .env.local')
  }
}

// ── Players ───────────────────────────────────────────────────────────────────

/** Fetch all player documents */
export async function fetchPlayers() {
  guard()
  const snap = await getDocs(collection(db, 'players'))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

/** Upsert a player document */
export async function upsertPlayer(player) {
  guard()
  await setDoc(doc(db, 'players', player.id), player, { merge: true })
}

// ── Teams ─────────────────────────────────────────────────────────────────────

/** Fetch all team documents */
export async function fetchTeams() {
  guard()
  const snap = await getDocs(collection(db, 'teams'))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

/** Update elimination status for a team */
export async function setTeamEliminated(teamId, isEliminated) {
  guard()
  await updateDoc(doc(db, 'teams', String(teamId)), { isEliminated, updatedAt: serverTimestamp() })
}

/** Bulk-write all teams (used during initial seeding) */
export async function seedTeams(teams) {
  guard()
  const batch = writeBatch(db)
  teams.forEach(team => {
    batch.set(doc(db, 'teams', String(team.id)), { ...team, isEliminated: false })
  })
  await batch.commit()
}

// ── Draw State ────────────────────────────────────────────────────────────────

const DRAW_DOC_ID = 'current'

/** Read the current draw state document */
export async function fetchDrawState() {
  guard()
  const snap = await getDoc(doc(db, 'drawState', DRAW_DOC_ID))
  return snap.exists() ? snap.data() : null
}

/** Write / overwrite the draw state */
export async function saveDrawState(state) {
  guard()
  await setDoc(doc(db, 'drawState', DRAW_DOC_ID), { ...state, updatedAt: serverTimestamp() })
}

/** Subscribe to live draw state changes */
export function subscribeDrawState(callback) {
  if (!isFirebaseConfigured || !db) return () => {}
  return onSnapshot(doc(db, 'drawState', DRAW_DOC_ID), snap => {
    if (snap.exists()) callback(snap.data())
  })
}

// ── Leaderboard ───────────────────────────────────────────────────────────────

/** Fetch all leaderboard entries */
export async function fetchLeaderboard() {
  guard()
  const snap = await getDocs(collection(db, 'leaderboard'))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

/** Update points for a single player */
export async function updatePlayerPoints(playerId, points) {
  guard()
  await setDoc(
    doc(db, 'leaderboard', playerId),
    { points, updatedAt: serverTimestamp() },
    { merge: true }
  )
}

/** Subscribe to live leaderboard updates */
export function subscribeLeaderboard(callback) {
  if (!isFirebaseConfigured || !db) return () => {}
  return onSnapshot(collection(db, 'leaderboard'), snap => {
    const entries = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    callback(entries)
  })
}

// ── Combined game state (single-document approach) ────────────────────────────
//
// Stores the entire app state in one document so a single onSnapshot
// subscription keeps every connected client in sync.

const GAME_STATE_DOC_ID = 'current'

/**
 * Persist the full game state to Firestore.
 * @param {{ drawState, points, eliminated, matchResults, knockoutTeams }} state
 */
export async function saveGameState({ drawState, points, eliminated, matchResults, knockoutTeams }) {
  guard()
  await setDoc(
    doc(db, 'gameState', GAME_STATE_DOC_ID),
    { drawState, points, eliminated, matchResults, knockoutTeams, updatedAt: serverTimestamp() },
  )
}

/**
 * Subscribe to real-time game state updates.
 * The callback receives { drawState, points, eliminated, matchResults, knockoutTeams }.
 * Returns an unsubscribe function.
 */
export function subscribeGameState(callback) {
  if (!isFirebaseConfigured || !db) return () => {}
  return onSnapshot(
    doc(db, 'gameState', GAME_STATE_DOC_ID),
    snap => {
      if (!snap.exists()) return
      const { drawState, points, eliminated, matchResults, knockoutTeams } = snap.data()
      callback({ drawState, points, eliminated, matchResults, knockoutTeams })
    },
  )
}
