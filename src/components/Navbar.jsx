import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_LINKS = [
  { to: '/',           label: 'Home',        icon: '🏠' },
  { to: '/draw',       label: 'Live Draw',   icon: '🎲' },
  { to: '/leaderboard',label: 'Leaderboard', icon: '🏆' },
  { to: '/fixtures',   label: 'Fixtures & Results', icon: '📅' },
  { to: '/teams',      label: 'Teams',       icon: '🌍' },
  { to: '/admin',      label: 'Admin',       icon: '⚙️' },
]

export default function Navbar() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header
      className="sticky top-0 z-50 px-3 sm:px-4 py-2"
      style={{ background: 'rgba(245,247,250,0.92)' }}
    >
      <div
        className="max-w-7xl mx-auto rounded-2xl"
        style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          background: 'rgba(255,255,255,0.92)',
          border: '1px solid #c7d3e0',
          boxShadow: '0 8px 28px rgba(22,58,99,0.08)',
        }}
      >
        <div className="flex items-center justify-between h-12 px-3 sm:px-4">

          <Link to="/" className="flex items-center gap-2 group min-w-0">
            <span className="text-lg">⚽</span>
            <div className="leading-tight min-w-0">
              <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] truncate">Source IT Services</p>
              <p className="text-xs sm:text-sm font-bold neon-text truncate">World Cup 2026</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 p-1 rounded-xl" style={{ background: '#e6f2fa' }}>
            {NAV_LINKS.map(link => {
              const active = location.pathname === link.to
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="relative px-2.5 lg:px-3 py-1.5 rounded-lg text-xs lg:text-sm font-semibold transition-all duration-200"
                  style={{
                    color: active ? '#ffffff' : '#4f6380',
                    background: active ? 'linear-gradient(135deg, #2E73A8, #3AA0D8)' : 'transparent',
                  }}
                >
                  <span className="mr-1.5">{link.icon}</span>
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <button
            onClick={() => setMenuOpen(v => !v)}
            className="md:hidden p-1.5 rounded-lg text-gray-500 hover:text-[#2E73A8] transition-colors"
            aria-label="Toggle menu"
          >
            <div className="w-5 space-y-1">
              <span className={`block h-0.5 bg-current transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`block h-0.5 bg-current transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-current transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </div>
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-slate-300"
            >
              <nav className="px-3 py-3 flex flex-col gap-1.5">
                {NAV_LINKS.map(link => {
                  const active = location.pathname === link.to
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setMenuOpen(false)}
                      className="px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
                      style={{
                        color: active ? '#ffffff' : '#4f6380',
                        background: active ? 'linear-gradient(135deg, #2E73A8, #3AA0D8)' : '#f5f7fa',
                        border: active ? '1px solid transparent' : '1px solid #c7d3e0',
                      }}
                    >
                      <span className="mr-2">{link.icon}</span>
                      {link.label}
                    </Link>
                  )
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
