import React, { useEffect, useState } from 'react'
import {
  ACTIVE_PROFILE_KEY,
  profileToAccessflowState,
  readActiveProfile,
} from '../lib/accessflowConfig.js'

const API_URL = 'http://localhost:8000'

const CONTRAST_LABELS = { 1: 'Baixo', 2: 'Suave', 3: 'Médio', 4: 'Alto contraste' }
const FONT_LABELS = { 1: 'Pequena', 2: 'Padrão', 3: 'Média', 4: 'Grande', 5: 'Extra grande' }

export default function Profiles({ onNavigate }) {
  const [profiles, setProfiles] = useState([])
  const [status, setStatus] = useState('loading') // loading | ready | error | unauth
  const [error, setError] = useState('')
  const [activeId, setActiveId] = useState(() => readActiveProfile()?.id ?? null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setStatus('unauth')
      return
    }

    let cancelled = false
    async function load() {
      try {
        const res = await fetch(`${API_URL}/profiles`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (cancelled) return
        if (res.status === 401) {
          setStatus('unauth')
          return
        }
        if (!res.ok) {
          setError(data.error || 'Erro ao carregar perfis')
          setStatus('error')
          return
        }
        setProfiles(data.profiles || [])
        setStatus('ready')
      } catch {
        if (!cancelled) {
          setError('Não foi possível conectar ao servidor.')
          setStatus('error')
        }
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  function activateProfile(profile) {
    const payload = {
      id: profile.id,
      name: profile.name,
      state: profileToAccessflowState(profile),
    }
    localStorage.setItem(ACTIVE_PROFILE_KEY, JSON.stringify(payload))
    setActiveId(profile.id)
  }

  function clearActive() {
    localStorage.removeItem(ACTIVE_PROFILE_KEY)
    setActiveId(null)
  }

  return (
    <div className="dp-view">
      <div className="dp-glow" aria-hidden="true" />

      <header className="dp-header">
        <div className="dp-header-badge">
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>badge</span>
          perfis de acessibilidade
        </div>
        <h1 className="dp-title">Meus Perfis</h1>
        <p className="dp-subtitle">
          Selecione um perfil para aplicá-lo automaticamente ao preview do Sandbox.
        </p>
      </header>

      {status === 'loading' && (
        <p className="dp-hint" style={{ textAlign: 'center' }}>Carregando perfis…</p>
      )}

      {status === 'unauth' && (
        <div className="register-error-banner" role="alert" style={{ maxWidth: 520, margin: '0 auto' }}>
          <span className="material-symbols-outlined">lock</span>
          <span>
            Você precisa estar logado para ver seus perfis.{' '}
            <a href="#login" onClick={(e) => { e.preventDefault(); onNavigate?.('login') }} style={{ color: '#dbb8ff', fontWeight: 600 }}>
              Fazer login
            </a>
          </span>
        </div>
      )}

      {status === 'error' && (
        <div className="register-error-banner" role="alert" style={{ maxWidth: 520, margin: '0 auto' }}>
          <span className="material-symbols-outlined">error</span>
          <span>{error}</span>
        </div>
      )}

      {status === 'ready' && profiles.length === 0 && (
        <p className="dp-hint" style={{ textAlign: 'center' }}>
          Nenhum perfil salvo ainda. Crie um ao se registrar.
        </p>
      )}

      {status === 'ready' && profiles.length > 0 && (
        <div className="profiles-grid">
          {profiles.map((profile) => {
            const isActive = profile.id === activeId
            return (
              <article
                key={profile.id}
                className={`profile-card ${isActive ? 'active' : ''}`}
              >
                <div className="profile-card-head">
                  <h2 className="profile-card-name">{profile.name}</h2>
                  {isActive && (
                    <span className="profile-card-badge">
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check_circle</span>
                      Ativo
                    </span>
                  )}
                </div>

                <ul className="profile-card-specs">
                  <li>
                    <span className="material-symbols-outlined">contrast</span>
                    Contraste: <strong>{CONTRAST_LABELS[profile.contrast] || profile.contrast}</strong>
                  </li>
                  <li>
                    <span className="material-symbols-outlined">text_fields</span>
                    Fonte: <strong>{FONT_LABELS[profile.font] || profile.font}</strong>
                  </li>
                  <li>
                    <span className="material-symbols-outlined">animation</span>
                    Animações: <strong>{profile.animations ? 'Ativadas' : 'Desativadas'}</strong>
                  </li>
                </ul>

                {profile.feedback && (
                  <p className="profile-card-feedback">"{profile.feedback}"</p>
                )}

                <div className="profile-card-actions">
                  {isActive ? (
                    <>
                      <button className="profile-btn profile-btn-primary" onClick={() => onNavigate?.('sandbox')}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>science</span>
                        Ver no Sandbox
                      </button>
                      <button className="profile-btn profile-btn-ghost" onClick={clearActive}>
                        Desativar
                      </button>
                    </>
                  ) : (
                    <button className="profile-btn profile-btn-primary" onClick={() => activateProfile(profile)}>
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>check</span>
                      Definir como ativo
                    </button>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
