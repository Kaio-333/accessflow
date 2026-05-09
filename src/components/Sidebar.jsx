import React from 'react'

const NAV_LINKS = [
  { id:'landing', section:'',         icon:'home',        label:'Início',         tooltip:'Início' },
  { id:'landing', section:'features', icon:'extension',   label:'Recursos',       tooltip:'Recursos' },
  { id:'landing', section:'howworks', icon:'help_circle', label:'Como funciona',  tooltip:'Como funciona' },
  { id:'login',   section:'',         icon:'login',       label:'Login',          tooltip:'Login' },
  { id:'sandbox', section:'',         icon:'science',     label:'Sandbox',        tooltip:'Sandbox' },
]

export default function Sidebar({ currentView, onNavigate }) {
  return (
    <div className="sidebar-inner">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <span className="material-symbols-outlined">accessibility_new</span>
        </div>
        <div className="sidebar-logo-text">
          <h1>AccessFlow</h1>
          <p>v1.0 · Aether</p>
        </div>
      </div>

      <ul className="sidebar-nav" role="list">
        {NAV_LINKS.map(link => {
          const active = link.id === currentView
          return (
            <li role="listitem" key={`${link.id}-${link.section || 'root'}`}>
              <button
                className={`nav-link ${active ? 'active' : ''}`}
                data-view={link.id}
                data-section={link.section}
                data-tooltip={link.tooltip}
                aria-label={link.label}
                aria-current={active ? 'page' : 'false'}
                onClick={() => onNavigate(link.id, link.section || null)}
              >
                <span className="material-symbols-outlined">{link.icon}</span>
                <span className="nav-link-label">{link.label}</span>
              </button>
            </li>
          )
        })}
      </ul>

      <div className="sidebar-cta">
        <button className="btn-sidebar-cta" aria-label="Baixar a extensão AccessFlow para Chrome">
          <span className="material-symbols-outlined">download</span>
          <span className="nav-link-label">Baixar extensão</span>
        </button>
      </div>
    </div>
  )
}
