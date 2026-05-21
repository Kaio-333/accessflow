import React from 'react'

const CHANGELOG = [
  {
    version: '1.2.0',
    date: '2026-05-20',
    tag: 'Novo',
    tagColor: '#9951e6',
    items: [
      { type: 'feat', text: 'Página de Perfil de Dificuldades — formulário completo para mapear necessidades de acessibilidade.' },
      { type: 'feat', text: 'Página de Changelog — histórico visual de atualizações do AccessFlow.' },
      { type: 'improve', text: 'Sidebar atualizada com novos links de navegação.' },
    ],
  },
  {
    version: '1.1.0',
    date: '2026-04-15',
    tag: 'Melhoria',
    tagColor: '#9f78ff',
    items: [
      { type: 'feat', text: 'Sandbox de acessibilidade com preview em tempo real.' },
      { type: 'feat', text: 'Perfis de acessibilidade predefinidos (Baixa Visão, Dislexia, TDAH, Motor).' },
      { type: 'improve', text: 'Controles de contraste, fonte, espaçamento e foco visual.' },
      { type: 'fix', text: 'Correções de layout responsivo no painel de configurações.' },
    ],
  },
  {
    version: '1.0.0',
    date: '2026-03-01',
    tag: 'Lançamento',
    tagColor: '#34d399',
    items: [
      { type: 'feat', text: 'Landing page com apresentação de recursos e seção "Como Funciona".' },
      { type: 'feat', text: 'Sistema de login com autenticação por e-mail e Google.' },
      { type: 'feat', text: 'Sidebar colapsável com navegação principal.' },
      { type: 'feat', text: 'Design system Aether — tokens, componentes e tema escuro.' },
    ],
  },
]

const TYPE_ICONS = {
  feat: 'add_circle',
  improve: 'trending_up',
  fix: 'build',
}

const TYPE_LABELS = {
  feat: 'Novo',
  improve: 'Melhoria',
  fix: 'Correção',
}

export default function Changelog() {
  return (
    <div className="changelog-view">
      {/* Ambient glow */}
      <div className="changelog-glow" aria-hidden="true" />

      <header className="changelog-header">
        <div className="changelog-header-badge">
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>history</span>
          changelog
        </div>
        <h1 className="changelog-title">O que há de novo</h1>
        <p className="changelog-subtitle">
          Acompanhe todas as atualizações, melhorias e correções do AccessFlow.
        </p>
      </header>

      <div className="changelog-timeline">
        {CHANGELOG.map((release, i) => (
          <article
            key={release.version}
            className="changelog-release"
            style={{ animationDelay: `${i * 0.12}s` }}
          >
            {/* Timeline dot */}
            <div className="changelog-dot-wrap">
              <span className="changelog-dot" style={{ background: release.tagColor }} />
              {i < CHANGELOG.length - 1 && <span className="changelog-line" />}
            </div>

            <div className="changelog-release-card">
              <div className="changelog-release-head">
                <div className="changelog-version-row">
                  <span className="changelog-version">v{release.version}</span>
                  <span className="changelog-tag" style={{ background: `${release.tagColor}22`, color: release.tagColor, borderColor: `${release.tagColor}44` }}>
                    {release.tag}
                  </span>
                </div>
                <span className="changelog-date">
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>calendar_today</span>
                  {release.date}
                </span>
              </div>

              <ul className="changelog-items">
                {release.items.map((item, j) => (
                  <li key={j} className="changelog-item">
                    <span className={`changelog-item-icon changelog-item-icon--${item.type}`}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{TYPE_ICONS[item.type]}</span>
                    </span>
                    <span className="changelog-item-label">{TYPE_LABELS[item.type]}</span>
                    <span className="changelog-item-text">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
