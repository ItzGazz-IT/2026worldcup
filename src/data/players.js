// Office sweepstake participants

export const PLAYERS = [
  { id: 'gaz',     name: 'Gaz',     avatar: '⚽', color: '#2E73A8' },
  { id: 'kg',      name: 'Kg',      avatar: '🏆', color: '#3AA0D8' },
  { id: 'kaiz',    name: 'Kaiz',    avatar: '🎯', color: '#ffd700' },
  { id: 'brendon', name: 'Brendon', avatar: '🔥', color: '#ff6b35' },
  { id: 'bianca',  name: 'Bianca',  avatar: '⭐', color: '#ff4d8d' },
  { id: 'paul',    name: 'Paul',    avatar: '🎪', color: '#c084fc' },
  { id: 'rob',     name: 'Rob',     avatar: '💪', color: '#34d399' },
  { id: 'shupo',   name: 'Shupo',   avatar: '🚀', color: '#f59e0b' },
  { id: 'cam',     name: 'Cam',     avatar: '🎮', color: '#60a5fa' },
  { id: 'josh',    name: 'Josh',    avatar: '👑', color: '#e879f9' },
]

// Prize pool structure (ZAR)
export const PRIZE_POOL = {
  total: 2000,
  prizes: [
    { position: 1, label: '1st Place', amount: 1000, icon: '🥇', color: '#ffd700' },
    { position: 2, label: '2nd Place', amount: 500,  icon: '🥈', color: '#c0c0c0' },
    { position: 3, label: '3rd Place', amount: 300,  icon: '🥉', color: '#cd7f32' },
    { position: 4, label: '4th Place', amount: 200,  icon: '🏅', color: '#9ca3af' },
  ],
}
