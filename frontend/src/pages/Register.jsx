import React, { useState } from 'react'

const CONTRAST_LEVELS = [
  { value: 1, label: 'Baixo (Padrão)', desc: 'Contraste original da aplicação' },
  { value: 2, label: 'Suave', desc: 'Contraste ligeiramente aprimorado' },
  { value: 3, label: 'Médio', desc: 'Cores com forte distinção visual' },
  { value: 4, label: 'Alto Contraste', desc: 'Preto, branco e cores puras de alto contraste' },
]

const FONT_SIZES = [
  { value: 1, label: 'Pequena', size: '12px' },
  { value: 2, label: 'Padrão', size: '14px' },
  { value: 3, label: 'Média', size: '16px' },
  { value: 4, label: 'Grande', size: '18px' },
  { value: 5, label: 'Extra Grande', size: '22px' },
]

export default function Register({ onLogin, onNavigate }) {
  // Step navigation
  const [step, setStep] = useState(1)

  // Step 1: Account info (No name stored for user)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  // Step 2: Preset / Profile info (The 'name' stored in profile is the preset name)
  const [presetName, setPresetName] = useState('Meu Preset')
  const [contrast, setContrast] = useState(1)
  const [font, setFont] = useState(3) // default to 'Média'
  const [animations, setAnimations] = useState(true)
  const [feedback, setFeedback] = useState('')

  // State flags
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Go to step 2 after basic validation
  function handleNextStep(e) {
    e.preventDefault()
    setError('')
    if (!email.trim() || !email.includes('@')) {
      setError('Por favor, insira um e-mail válido.')
      return
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }
    setStep(2)
  }

  // Export current preset configuration as a JSON file
  function handleExportJSON() {
    try {
      const presetData = {
        presetName: presetName || 'Meu Preset AccessFlow',
        contrast,
        font,
        animations,
        feedback
      }
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(presetData, null, 2))
      const downloadAnchor = document.createElement('a')
      downloadAnchor.setAttribute("href", dataStr)
      const fileName = `${(presetName || 'preset').toLowerCase().replace(/\s+/g, '-')}-preset.json`
      downloadAnchor.setAttribute("download", fileName)
      document.body.appendChild(downloadAnchor)
      downloadAnchor.click()
      downloadAnchor.remove()
    } catch (err) {
      setError('Erro ao exportar o preset. Verifique as configurações.')
    }
  }

  // Import preset configuration from a JSON file
  function handleImportJSON(e) {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result)
        
        // Validate and apply fields
        if (parsed.presetName !== undefined) setPresetName(String(parsed.presetName))
        if (parsed.contrast !== undefined) {
          const val = Number(parsed.contrast)
          if (val >= 1 && val <= 4) setContrast(val)
        }
        if (parsed.font !== undefined) {
          const val = Number(parsed.font)
          if (val >= 1 && val <= 5) setFont(val)
        }
        if (parsed.animations !== undefined) setAnimations(Boolean(parsed.animations))
        if (parsed.feedback !== undefined) setFeedback(String(parsed.feedback))

        setError('')
      } catch (err) {
        setError('Falha ao carregar o arquivo JSON. Formato inválido ou corrompido.')
      }
    }
    reader.readAsText(file)
    e.target.value = '' // Clear input
  }

  // Handle final submission
  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('http://localhost:8000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          name: presetName || 'Meu Preset', // Stores the presetName in profile name field
          contrast,
          font,
          animations,
          feedback: feedback || `Preset personalizado: ${presetName}`
        }),
      })

      const data = await res.json()
      
      if (!res.ok) {
        setError(data.error || 'Erro ao realizar o cadastro.')
        setStep(1) // return to account details if email exists
        return
      }

      // Save token and trigger login callback
      localStorage.setItem('token', data.token)
      onLogin(email)
    } catch (err) {
      setError('Não foi possível conectar ao servidor. Tente novamente mais tarde.')
    } finally {
      setLoading(false)
    }
  }

  // Live dynamic styles for the preview card based on state
  const getPreviewStyles = () => {
    const fontScale = {
      1: '0.85rem',
      2: '0.95rem',
      3: '1.05rem',
      4: '1.2rem',
      5: '1.4rem',
    }

    let bg = '#251d2b'
    let text = '#eadfed'
    let border = '#4c4453'
    let glow = 'rgba(153, 81, 230, 0.15)'

    if (contrast === 2) {
      bg = '#2a2233'
      text = '#f7f1fa'
      border = '#6b5e78'
    } else if (contrast === 3) {
      bg = '#32263d'
      text = '#ffffff'
      border = '#907a9e'
      glow = 'rgba(153, 81, 230, 0.3)'
    } else if (contrast === 4) {
      bg = '#000000'
      text = '#ffffff'
      border = '#ffffff'
      glow = 'transparent'
    }

    return {
      fontSize: fontScale[font] || '1rem',
      backgroundColor: bg,
      color: text,
      borderColor: border,
      boxShadow: `0 8px 32px ${glow}`,
      transition: animations ? 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
    }
  }

  return (
    <div className="login-view register-view">
      <div className="register-glow" aria-hidden="true" />
      
      <div className="login-card register-card">
        {/* Logo and header */}
        <div className="login-logo">
          <div className="login-logo-icon">
            <span className="material-symbols-outlined">accessibility_new</span>
          </div>
          <span className="login-logo-name">AccessFlow</span>
        </div>

        <h1 className="login-title">
          {step === 1 ? 'Criar sua Conta' : 'Personalizar Acessibilidade'}
        </h1>
        <p className="login-subtitle">
          {step === 1 
            ? 'Crie seu perfil para salvar e aplicar seus presets personalizados.' 
            : 'Configure seu preset exclusivo. Ele será aplicado a todos os seus sites de forma integrada.'}
        </p>

        {/* Step Indicator */}
        <div className="register-steps" aria-label="Progresso de cadastro">
          <div className={`step-dot ${step >= 1 ? 'active' : ''}`}>
            <span>1</span>
            <label>Conta</label>
          </div>
          <div className={`step-connector ${step >= 2 ? 'active' : ''}`} />
          <div className={`step-dot ${step >= 2 ? 'active' : ''}`}>
            <span>2</span>
            <label>Preset</label>
          </div>
        </div>

        {error && (
          <div className="register-error-banner" role="alert">
            <span className="material-symbols-outlined">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form Container */}
        {step === 1 ? (
          <form onSubmit={handleNextStep} className="register-form-step">
            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">E-mail</label>
              <input
                className="form-input"
                type="email"
                id="reg-email"
                placeholder="voce@exemplo.com"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Senha</label>
              <input
                className="form-input"
                type="password"
                id="reg-password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="btn-login btn-register-next" type="submit">
              <span>Configurar Preset</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="register-form-step">
            
            {/* JSON Import/Export Actions Bar */}
            <div className="register-json-bar">
              <button 
                type="button" 
                className="btn-json-action" 
                onClick={handleExportJSON}
                title="Exportar preset atual como JSON"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>download</span>
                <span>Exportar JSON</span>
              </button>
              
              <label 
                className="btn-json-action label-json-action" 
                title="Importar preset a partir de arquivo JSON"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>upload</span>
                <span>Importar JSON</span>
                <input 
                  type="file" 
                  accept=".json" 
                  onChange={handleImportJSON} 
                  style={{ display: 'none' }} 
                />
              </label>
            </div>

            {/* Live Interactive Preview Box - Premium Design */}
            <div className="register-preview-box" style={getPreviewStyles()} aria-label="Visualização em tempo real do preset">
              <div className="preview-header">
                <span className="preview-badge" style={{
                  border: contrast === 4 ? '1px solid #fff' : 'none',
                  background: contrast === 4 ? 'transparent' : '#9951e6',
                  color: '#fff'
                }}>Prévia em Tempo Real</span>
                <span className={`material-symbols-outlined ${animations ? 'preview-spinner' : ''}`} style={{ fontSize: 18 }}>
                  sync
                </span>
              </div>
              <h3 className="preview-title" style={{ fontWeight: 700, margin: '8px 0 4px 0' }}>
                {presetName || 'Nome do Preset'}
              </h3>
              <p className="preview-text" style={{ fontSize: 'inherit', margin: 0, opacity: contrast === 4 ? 1 : 0.85 }}>
                Este texto demonstra como suas configurações de fonte e contraste serão aplicadas na leitura.
              </p>
              {animations && (
                <div className="preview-pulse-bar" aria-hidden="true" />
              )}
            </div>

            {/* Preset Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-preset-name">Nome do seu Preset</label>
              <input
                className="form-input"
                type="text"
                id="reg-preset-name"
                placeholder="Ex: Meu Preset Acessível"
                value={presetName}
                onChange={e => setPresetName(e.target.value)}
                required
              />
            </div>

            {/* Contrast Selection */}
            <fieldset className="dp-fieldset register-fieldset">
              <legend className="dp-legend">
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>contrast</span>
                Contraste Visual
              </legend>
              <div className="contrast-grid">
                {CONTRAST_LEVELS.map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    className={`contrast-card-btn ${contrast === level.value ? 'active' : ''}`}
                    onClick={() => setContrast(level.value)}
                    aria-pressed={contrast === level.value}
                  >
                    <span className="contrast-card-label">{level.label}</span>
                    <span className="contrast-card-desc">{level.desc}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Font Legibility */}
            <fieldset className="dp-fieldset register-fieldset">
              <legend className="dp-legend">
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>text_fields</span>
                Tamanho da Fonte
              </legend>
              <div className="dp-slider-wrap">
                <div className="dp-slider-header" style={{ marginBottom: 4 }}>
                  <span className="dp-slider-label">Tamanho</span>
                  <span className="dp-slider-val" style={{ color: '#9951e6' }}>
                    {FONT_SIZES.find(f => f.value === font)?.label} ({FONT_SIZES.find(f => f.value === font)?.size})
                  </span>
                </div>
                <input
                  type="range"
                  className="ae-range dp-range"
                  min="1"
                  max="5"
                  step="1"
                  value={font}
                  onChange={(e) => setFont(Number(e.target.value))}
                  aria-label="Tamanho de fonte de 1 (pequena) a 5 (extra grande)"
                />
                <div className="dp-range-labels">
                  <span>Pequena</span>
                  <span>Extra Grande</span>
                </div>
              </div>
            </fieldset>

            {/* Animations Toggle */}
            <fieldset className="dp-fieldset register-fieldset">
              <label className="dp-check-row" htmlFor="reg-animations" style={{ padding: 0 }}>
                <div className="dp-check-info">
                  <span className="dp-check-label" style={{ fontSize: 14 }}>Habilitar Animações</span>
                  <span className="dp-check-desc" style={{ fontSize: 11 }}>Transições e micro-efeitos fluidos. Desative se preferir movimentos estáticos.</span>
                </div>
                <div className="ae-switch">
                  <input
                    type="checkbox"
                    id="reg-animations"
                    checked={animations}
                    onChange={() => setAnimations(v => !v)}
                  />
                  <span className="ae-track" />
                </div>
              </label>
            </fieldset>

            {/* Comments / Feedback */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-feedback">Observações / Comentários (opcional)</label>
              <textarea
                className="dp-textarea"
                id="reg-feedback"
                rows="2"
                placeholder="Ex: Prefiro fontes sem serifa e facilidade para leitura..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                style={{ padding: '10px 12px', fontSize: 13, background: '#231e27', border: '1px solid #4c4453' }}
              />
            </div>

            {/* Navigation & Submit */}
            <div className="register-actions">
              <button 
                type="button" 
                className="btn-register-back" 
                onClick={() => setStep(1)}
                disabled={loading}
              >
                <span className="material-symbols-outlined">arrow_back</span>
                <span>Voltar</span>
              </button>
              
              <button 
                className="btn-login btn-register-submit" 
                type="submit" 
                disabled={loading}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>done</span>
                <span>{loading ? 'Cadastrando…' : 'Finalizar Cadastro'}</span>
              </button>
            </div>
          </form>
        )}

        <div className="login-divider"><span>ou</span></div>

        <p className="login-footer" style={{ marginTop: 0 }}>
          Já possui uma conta?{' '}
          <a 
            href="#login" 
            onClick={(e) => {
              e.preventDefault()
              onNavigate('login')
            }}
          >
            Fazer Login
          </a>
        </p>
      </div>
    </div>
  )
}
