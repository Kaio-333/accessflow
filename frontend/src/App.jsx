import React, { useEffect, useState } from 'react'
import Sidebar from './components/layout/Sidebar.tsx'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Sandbox from './pages/Sandbox.jsx'
import Changelog from './pages/Changelog.jsx'
import DifficultyProfile from './pages/DifficultyProfile.jsx'

export default function App() {
  const [view, setView] = useState('landing')
  const [section, setSection] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    function closeOnEscape(event) {
      if (event.key === 'Escape') setSidebarOpen(false)
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [])

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [sidebarOpen])

  useEffect(() => {
    if (view !== 'landing') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (!section) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const timeout = window.setTimeout(() => {
      document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' })
    }, 80)
    return () => window.clearTimeout(timeout)
  }, [view, section])

  function navigate(nextView, nextSection = null) {
    setView(nextView)
    setSection(nextSection)
    setSidebarOpen(false)
  }

  return (
    <>
      {/* Global login button — top-right on all pages */}
      {view !== 'login' && (
        <button
          id="global-login-btn"
          className="global-login-btn"
          aria-label="Ir para login"
          onClick={() => navigate('login')}
        >
          <span className="material-symbols-outlined">account_circle</span>
          <span className="global-login-label">Entrar</span>
        </button>
      )}

      <button
        id="hamburger"
        className="hamburger"
        aria-label="Abrir menu de navegação"
        aria-expanded={sidebarOpen}
        onClick={() => setSidebarOpen(open => !open)}
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      <nav id="sidebar" className={`sidebar ${sidebarOpen ? 'open' : ''} ${sidebarCollapsed ? 'collapsed' : ''}`} role="navigation" aria-label="Navegação principal">
        <Sidebar
          currentView={view}
          currentSection={section}
          onNavigate={navigate}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(c => !c)}
        />
      </nav>

      <button
        className={`sidebar-toggle ${sidebarCollapsed ? 'sidebar-toggle--collapsed' : ''}`}
        onClick={() => setSidebarCollapsed(c => !c)}
        aria-label={sidebarCollapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
        title={sidebarCollapsed ? 'Expandir' : 'Recolher'}
      >
        <span className="material-symbols-outlined">
          {sidebarCollapsed ? 'chevron_right' : 'chevron_left'}
        </span>
      </button>

      <div
        id="mobile-overlay"
        className={`mobile-overlay ${sidebarOpen ? 'visible' : ''}`}
        aria-hidden="true"
        onClick={() => setSidebarOpen(false)}
      />

      <main id="main-content" className="main-content" role="main">
        {view === 'landing' && <Landing onNavigate={navigate} />}
        {view === 'login' && <Login />}
        {view === 'sandbox' && <Sandbox />}
        {view === 'changelog' && <Changelog />}
        {view === 'difficulty-profile' && <DifficultyProfile />}
      </main>
    </>
  )
}
