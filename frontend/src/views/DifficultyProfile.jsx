import React, { useState } from 'react'

const CONTRAST_OPTIONS = ['Sempre', 'Às vezes', 'Raramente', 'Nunca']
const LEGIBILITY_LABELS = ['Muito fácil', 'Fácil', 'Neutro', 'Difícil', 'Muito difícil']

export default function DifficultyProfile() {
  const [contrast, setContrast] = useState(null)
  const [loseFocus, setLoseFocus] = useState(false)
  const [legibility, setLegibility] = useState(3)
  const [animDistract, setAnimDistract] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
    // In production, send data to backend
    setTimeout(() => setSubmitted(false), 3000)
  }

  function handleReset() {
    setContrast(null)
    setLoseFocus(false)
    setLegibility(3)
    setAnimDistract(false)
    setFeedback('')
    setSubmitted(false)
  }

  return (
    <div className="dp-view">
      {/* Ambient glow */}
      <div className="dp-glow" aria-hidden="true" />

      <header className="dp-header">
        <div className="dp-header-badge">
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>person_search</span>
          perfil de acessibilidade
        </div>
        <h1 className="dp-title">Perfil de Dificuldades</h1>
        <p className="dp-subtitle">
          Conte-nos sobre suas necessidades visuais para personalizar sua experiência no AccessFlow.
        </p>
      </header>

      <form className="dp-form" onSubmit={handleSubmit} autoComplete="off">

        {/* ── 1. Contrast Difficulties ── */}
        <fieldset className="dp-fieldset">
          <legend className="dp-legend">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>contrast</span>
            Dificuldades com Contraste
          </legend>
          <p className="dp-hint">Com que frequência você tem dificuldade para distinguir elementos com pouco contraste?</p>

          <div className="dp-segment">
            {CONTRAST_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`dp-segment-btn ${contrast === opt ? 'active' : ''}`}
                onClick={() => setContrast(opt)}
                aria-pressed={contrast === opt}
              >
                {opt}
              </button>
            ))}
          </div>
        </fieldset>

        {/* ── 2. Visual Focus ── */}
        <fieldset className="dp-fieldset">
          <legend className="dp-legend">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>center_focus_weak</span>
            Foco Visual
          </legend>
          <p className="dp-hint">Você perde o foco visual com frequência ao ler ou navegar?</p>

          <label className="dp-check-row" htmlFor="dp-focus">
            <div className="dp-check-info">
              <span className="dp-check-label">Perco o foco frequentemente</span>
              <span className="dp-check-desc">Textos longos ou interfaces complexas fazem eu perder a posição de leitura.</span>
            </div>
            <div className="ae-switch">
              <input
                type="checkbox"
                id="dp-focus"
                checked={loseFocus}
                onChange={() => setLoseFocus(v => !v)}
              />
              <span className="ae-track" />
            </div>
          </label>
        </fieldset>

        {/* ── 3. Font Legibility ── */}
        <fieldset className="dp-fieldset">
          <legend className="dp-legend">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>text_fields</span>
            Legibilidade de Fontes
          </legend>
          <p className="dp-hint">Quão fácil é ler as fontes padrão em sites e aplicativos?</p>

          <div className="dp-slider-wrap">
            <div className="dp-slider-header">
              <span className="dp-slider-label">Legibilidade</span>
              <span className="dp-slider-val">{legibility} — {LEGIBILITY_LABELS[legibility - 1]}</span>
            </div>
            <input
              type="range"
              className="ae-range dp-range"
              min="1"
              max="5"
              step="1"
              value={legibility}
              onChange={(e) => setLegibility(Number(e.target.value))}
              aria-label="Nível de legibilidade de 1 (muito fácil) a 5 (muito difícil)"
            />
            <div className="dp-range-labels">
              <span>Fácil</span>
              <span>Difícil</span>
            </div>
          </div>
        </fieldset>

        {/* ── 4. Animation Distractions ── */}
        <fieldset className="dp-fieldset">
          <legend className="dp-legend">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>animation</span>
            Distrações por Animações
          </legend>
          <p className="dp-hint">Animações em páginas web distraem ou incomodam você?</p>

          <label className="dp-check-row" htmlFor="dp-anim">
            <div className="dp-check-info">
              <span className="dp-check-label">Sim, animações me distraem</span>
              <span className="dp-check-desc">Movimentos, transições e efeitos visuais atrapalham minha concentração.</span>
            </div>
            <div className="ae-switch">
              <input
                type="checkbox"
                id="dp-anim"
                checked={animDistract}
                onChange={() => setAnimDistract(v => !v)}
              />
              <span className="ae-track" />
            </div>
          </label>
        </fieldset>

        {/* ── 5. Feedback ── */}
        <fieldset className="dp-fieldset">
          <legend className="dp-legend">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chat</span>
            Feedback
          </legend>
          <p className="dp-hint">Há algo mais que gostaria de nos contar? Comentários, sugestões ou dificuldades específicas.</p>

          <textarea
            className="dp-textarea"
            id="dp-feedback"
            rows="5"
            placeholder="Escreva seus comentários aqui…"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </fieldset>

        {/* ── Actions ── */}
        <div className="dp-actions">
          <button type="submit" className="dp-btn-submit" disabled={submitted}>
            {submitted ? (
              <>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>check_circle</span>
                Perfil salvo!
              </>
            ) : (
              <>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>save</span>
                Salvar Perfil
              </>
            )}
          </button>
          <button type="button" className="dp-btn-reset" onClick={handleReset}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>restart_alt</span>
            Resetar
          </button>
        </div>

      </form>
    </div>
  )
}
