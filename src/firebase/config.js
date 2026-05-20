// Firebase configuration
// ─────────────────────────────────────────────────────────────────────────────
// Replace the placeholder values below with your real Firebase project config.
// Obtain them at: https://console.firebase.google.com → Project Settings → Web app
//
// For local development, copy .env.example to .env.local and fill in values there.
// ─────────────────────────────────────────────────────────────────────────────

import { initializeApp, getApps } from 'firebase/app'
import { getFirestore }           from 'firebase/firestore'

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            || '',
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        || '',
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         || '',
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             || '',
}

// Only initialise when a real projectId is present
export const isFirebaseConfigured = Boolean(firebaseConfig.projectId)

let db = null

if (isFirebaseConfigured) {
  const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
  db = getFirestore(app)
}

export { db }
