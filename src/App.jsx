import React, { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Landing from './views/Landing.jsx'
import Login from './views/Login.jsx'
import Sandbox from './views/Sandbox.jsx'

export default function App() {
  const [view, setView] = useState('landing')
  const [section, setSection] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
      <button
        id="hamburger"
        className="hamburger"
        aria-label="Abrir menu de navegação"
        aria-expanded={sidebarOpen}
        onClick={() => setSidebarOpen(open => !open)}
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      <nav id="sidebar" className={`sidebar ${sidebarOpen ? 'open' : ''}`} role="navigation" aria-label="Navegação principal">
        <Sidebar currentView={view} onNavigate={navigate} />
      </nav>

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
      </main>
    </>
  )
}
