import React from 'react'
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Navbar      from './components/Navbar'
import Home        from './pages/Home'
import Draw        from './pages/Draw'
import Leaderboard from './pages/Leaderboard'
import Teams       from './pages/Teams'
import Fixtures    from './pages/Fixtures'
import Rules       from './pages/Rules'
import Admin       from './pages/Admin'

// HashRouter is used for GitHub Pages compatibility —
// it avoids 404s on direct URL access since GH Pages has no server-side routing.
export default function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen relative overflow-hidden" style={{ background: 'transparent', fontFamily: 'Inter, system-ui, sans-serif' }}>
          <div className="app-bg-effects" aria-hidden="true">
            <span className="aurora-blob aurora-1" />
            <span className="aurora-blob aurora-2" />
            <span className="aurora-blob aurora-3" />
            <span className="aurora-ring aurora-ring-1" />
            <span className="aurora-ring aurora-ring-2" />
            <span className="grain-overlay" />
          </div>
          <Navbar />
          <main>
            <Routes>
              <Route path="/"            element={<Home />}        />
              <Route path="/draw"        element={<Draw />}        />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/teams"       element={<Teams />}       />
              <Route path="/fixtures"    element={<Fixtures />}    />
              <Route path="/rules"       element={<Rules />}       />
              <Route path="/results"     element={<Navigate to="/fixtures" replace />} />
              <Route path="/admin"       element={<Admin />}       />
            </Routes>
          </main>
        </div>
      </Router>
    </AppProvider>
  )
}
