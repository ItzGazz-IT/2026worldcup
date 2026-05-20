// All 48 FIFA World Cup 2026 teams – official draw groups (December 2025)
// group = official group A-L
// pot   = SWEEPSTAKE quality tier (1 = favourites, 4 = underdogs) – NOT the FIFA draw pot
// code  = flagcdn.com ISO 3166-1 alpha-2 (lowercase); gb-eng / gb-sct = subdivision codes

export const TEAMS = [
  // ── GROUP A ────────────────────────────────────────────────────────────────
  { id: 1,  name: 'Mexico',               flag: '🇲🇽', code: 'mx',     pot: 1, confederation: 'CONCACAF', group: 'A' },
  { id: 2,  name: 'South Korea',          flag: '🇰🇷', code: 'kr',     pot: 2, confederation: 'AFC',      group: 'A' },
  { id: 3,  name: 'Czechia',              flag: '🇨🇿', code: 'cz',     pot: 3, confederation: 'UEFA',     group: 'A' },
  { id: 4,  name: 'South Africa',         flag: '🇿🇦', code: 'za',     pot: 4, confederation: 'CAF',      group: 'A' },
  // ── GROUP B ────────────────────────────────────────────────────────────────
  { id: 5,  name: 'Canada',               flag: '🇨🇦', code: 'ca',     pot: 1, confederation: 'CONCACAF', group: 'B' },
  { id: 6,  name: 'Switzerland',          flag: '🇨🇭', code: 'ch',     pot: 2, confederation: 'UEFA',     group: 'B' },
  { id: 7,  name: 'Bosnia-Herzegovina',   flag: '🇧🇦', code: 'ba',     pot: 3, confederation: 'UEFA',     group: 'B' },
  { id: 8,  name: 'Qatar',                flag: '🇶🇦', code: 'qa',     pot: 4, confederation: 'AFC',      group: 'B' },
  // ── GROUP C ────────────────────────────────────────────────────────────────
  { id: 9,  name: 'Brazil',               flag: '🇧🇷', code: 'br',     pot: 1, confederation: 'CONMEBOL', group: 'C' },
  { id: 10, name: 'Morocco',              flag: '🇲🇦', code: 'ma',     pot: 2, confederation: 'CAF',      group: 'C' },
  { id: 11, name: 'Scotland',             flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', code: 'gb-sct', pot: 3, confederation: 'UEFA',     group: 'C' },
  { id: 12, name: 'Haiti',                flag: '🇭🇹', code: 'ht',     pot: 4, confederation: 'CONCACAF', group: 'C' },
  // ── GROUP D ────────────────────────────────────────────────────────────────
  { id: 13, name: 'USA',                  flag: '🇺🇸', code: 'us',     pot: 1, confederation: 'CONCACAF', group: 'D' },
  { id: 14, name: 'Australia',            flag: '🇦🇺', code: 'au',     pot: 2, confederation: 'AFC',      group: 'D' },
  { id: 15, name: 'Türkiye',              flag: '🇹🇷', code: 'tr',     pot: 3, confederation: 'UEFA',     group: 'D' },
  { id: 16, name: 'Paraguay',             flag: '🇵🇾', code: 'py',     pot: 4, confederation: 'CONMEBOL', group: 'D' },
  // ── GROUP E ────────────────────────────────────────────────────────────────
  { id: 17, name: 'Germany',              flag: '🇩🇪', code: 'de',     pot: 1, confederation: 'UEFA',     group: 'E' },
  { id: 18, name: "Côte d'Ivoire",        flag: '🇨🇮', code: 'ci',     pot: 2, confederation: 'CAF',      group: 'E' },
  { id: 19, name: 'Ecuador',              flag: '🇪🇨', code: 'ec',     pot: 3, confederation: 'CONMEBOL', group: 'E' },
  { id: 20, name: 'Curaçao',              flag: '🇨🇼', code: 'cw',     pot: 4, confederation: 'CONCACAF', group: 'E' },
  // ── GROUP F ────────────────────────────────────────────────────────────────
  { id: 21, name: 'Netherlands',          flag: '🇳🇱', code: 'nl',     pot: 1, confederation: 'UEFA',     group: 'F' },
  { id: 22, name: 'Japan',                flag: '🇯🇵', code: 'jp',     pot: 2, confederation: 'AFC',      group: 'F' },
  { id: 23, name: 'Sweden',               flag: '🇸🇪', code: 'se',     pot: 3, confederation: 'UEFA',     group: 'F' },
  { id: 24, name: 'Tunisia',              flag: '🇹🇳', code: 'tn',     pot: 4, confederation: 'CAF',      group: 'F' },
  // ── GROUP G ────────────────────────────────────────────────────────────────
  { id: 25, name: 'Belgium',              flag: '🇧🇪', code: 'be',     pot: 1, confederation: 'UEFA',     group: 'G' },
  { id: 26, name: 'IR Iran',              flag: '🇮🇷', code: 'ir',     pot: 2, confederation: 'AFC',      group: 'G' },
  { id: 27, name: 'Egypt',                flag: '🇪🇬', code: 'eg',     pot: 3, confederation: 'CAF',      group: 'G' },
  { id: 28, name: 'New Zealand',          flag: '🇳🇿', code: 'nz',     pot: 4, confederation: 'OFC',      group: 'G' },
  // ── GROUP H ────────────────────────────────────────────────────────────────
  { id: 29, name: 'Spain',                flag: '🇪🇸', code: 'es',     pot: 1, confederation: 'UEFA',     group: 'H' },
  { id: 30, name: 'Uruguay',              flag: '🇺🇾', code: 'uy',     pot: 2, confederation: 'CONMEBOL', group: 'H' },
  { id: 31, name: 'Saudi Arabia',         flag: '🇸🇦', code: 'sa',     pot: 3, confederation: 'AFC',      group: 'H' },
  { id: 32, name: 'Cabo Verde',           flag: '🇨🇻', code: 'cv',     pot: 4, confederation: 'CAF',      group: 'H' },
  // ── GROUP I ────────────────────────────────────────────────────────────────
  { id: 33, name: 'France',               flag: '🇫🇷', code: 'fr',     pot: 1, confederation: 'UEFA',     group: 'I' },
  { id: 34, name: 'Senegal',              flag: '🇸🇳', code: 'sn',     pot: 2, confederation: 'CAF',      group: 'I' },
  { id: 35, name: 'Norway',               flag: '🇳🇴', code: 'no',     pot: 3, confederation: 'UEFA',     group: 'I' },
  { id: 36, name: 'Iraq',                 flag: '🇮🇶', code: 'iq',     pot: 4, confederation: 'AFC',      group: 'I' },
  // ── GROUP J ────────────────────────────────────────────────────────────────
  { id: 37, name: 'Argentina',            flag: '🇦🇷', code: 'ar',     pot: 1, confederation: 'CONMEBOL', group: 'J' },
  { id: 38, name: 'Algeria',              flag: '🇩🇿', code: 'dz',     pot: 2, confederation: 'CAF',      group: 'J' },
  { id: 39, name: 'Austria',              flag: '🇦🇹', code: 'at',     pot: 3, confederation: 'UEFA',     group: 'J' },
  { id: 40, name: 'Jordan',               flag: '🇯🇴', code: 'jo',     pot: 4, confederation: 'AFC',      group: 'J' },
  // ── GROUP K ────────────────────────────────────────────────────────────────
  { id: 41, name: 'Portugal',             flag: '🇵🇹', code: 'pt',     pot: 1, confederation: 'UEFA',     group: 'K' },
  { id: 42, name: 'Colombia',             flag: '🇨🇴', code: 'co',     pot: 2, confederation: 'CONMEBOL', group: 'K' },
  { id: 43, name: 'Uzbekistan',           flag: '🇺🇿', code: 'uz',     pot: 3, confederation: 'AFC',      group: 'K' },
  { id: 44, name: 'Congo DR',             flag: '🇨🇩', code: 'cd',     pot: 4, confederation: 'CAF',      group: 'K' },
  // ── GROUP L ────────────────────────────────────────────────────────────────
  { id: 45, name: 'England',              flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', code: 'gb-eng', pot: 1, confederation: 'UEFA',     group: 'L' },
  { id: 46, name: 'Croatia',              flag: '🇭🇷', code: 'hr',     pot: 2, confederation: 'UEFA',     group: 'L' },
  { id: 47, name: 'Panama',               flag: '🇵🇦', code: 'pa',     pot: 3, confederation: 'CONCACAF', group: 'L' },
  { id: 48, name: 'Ghana',                flag: '🇬🇭', code: 'gh',     pot: 3, confederation: 'CAF',      group: 'L' },
]

export const POT_CONFIG = {
  1: { label: 'Pot 1 – Elite',        color: '#ffd700', bg: 'rgba(255,215,0,0.1)'   },
  2: { label: 'Pot 2 – Strong',       color: '#60a5fa', bg: 'rgba(96,165,250,0.1)'  },
  3: { label: 'Pot 3 – Capable',      color: '#c084fc', bg: 'rgba(192,132,252,0.1)' },
  4: { label: 'Pot 4 – Dark Horses',  color: '#9ca3af', bg: 'rgba(156,163,175,0.1)' },
}

export const CONFEDERATIONS = ['UEFA', 'CONMEBOL', 'CONCACAF', 'CAF', 'AFC', 'OFC']
