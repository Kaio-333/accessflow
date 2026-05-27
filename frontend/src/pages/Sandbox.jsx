import React, { useEffect, useMemo, useRef, useState } from 'react'
import { injectAccessflowBridge } from '../lib/accessflowBridge.js'
import {
  ACCESSFLOW_PRESETS,
  DEFAULT_ACCESSFLOW_STATE,
  compactUrl,
  looksLikeHTML,
  normalizePageUrl,
} from '../lib/accessflowConfig.js'

const FONT_MAP = {
  default: "'Inter', system-ui, sans-serif",
  opendyslexic: "'OpenDyslexic', system-ui, sans-serif",
  system: 'system-ui, sans-serif',
}

export default function Sandbox() {
  const [state, setState] = useState(DEFAULT_ACCESSFLOW_STATE)
  const [input, setInput] = useState('')
  const [renderTarget, setRenderTarget] = useState({ mode: 'demo', url: '', srcDoc: '' })
  const [frameReady, setFrameReady] = useState(false)
  const [mouseY, setMouseY] = useState(0)
  const [progress, setProgress] = useState(0)
  const [settingsWidth, setSettingsWidth] = useState(320)
  const [isDragging, setIsDragging] = useState(false)
  const iframeRef = useRef(null)
  const viewportRef = useRef(null)
  const dragRef = useRef(null)

  // Resizable settings panel
  useEffect(() => {
    if (!isDragging) return
    function onMouseMove(e) {
      // Calculate width relative to the ae-body container
      const body = dragRef.current?.parentElement
      if (!body) return
      const bodyRect = body.getBoundingClientRect()
      const newWidth = Math.min(600, Math.max(240, e.clientX - bodyRect.left))
      setSettingsWidth(newWidth)
    }
    function onMouseUp() {
      setIsDragging(false)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [isDragging])

  const iframeSrc = renderTarget.mode === 'external'
    ? `/api/render?url=${encodeURIComponent(renderTarget.url)}`
    : undefined

  const status = useMemo(() => {
    if (renderTarget.mode === 'external') return {
      left: 'Renderizador: proxy + iframe',
      right: compactUrl(renderTarget.url),
      info: 'Página renderizada pelo proxy local. Os controles são enviados para o iframe em tempo real.',
    }
    if (renderTarget.mode === 'html') return {
      left: 'Renderizador: HTML informado',
      right: 'Entrada manual',
      info: 'HTML informado renderizado no sandbox com a ponte do AccessFlow.',
    }
    return {
      left: 'Renderizador: exemplo local',
      right: 'Conteúdo: demonstração',
      info: 'Digite uma URL para renderizar outra página no sandbox.',
    }
  }, [renderTarget])

  useEffect(() => {
    function onMessage(event) {
      if (event.data?.type === 'ACCESSFLOW_FRAME_READY') {
        setFrameReady(true)
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  useEffect(() => {
    if (renderTarget.mode === 'demo') return
    iframeRef.current?.contentWindow?.postMessage({ type: 'ACCESSFLOW_APPLY_STATE', state }, '*')
  }, [state, renderTarget, frameReady])

  useEffect(() => {
    setFrameReady(false)
  }, [renderTarget])

  function choosePreset(preset) {
    setState(current => {
      if (current.preset === preset) return { ...DEFAULT_ACCESSFLOW_STATE }
      return { ...DEFAULT_ACCESSFLOW_STATE, ...ACCESSFLOW_PRESETS[preset], preset }
    })
  }

  function patchState(partial) {
    setState(current => ({ ...current, ...partial, preset: 'none' }))
  }

  function resetState() {
    setState(DEFAULT_ACCESSFLOW_STATE)
  }

  function handleSubmit(event) {
    event.preventDefault()
    const value = input.trim()
    if (!value) {
      setRenderTarget({ mode: 'demo', url: '', srcDoc: '' })
      return
    }

    if (looksLikeHTML(value)) {
      setRenderTarget({
        mode: 'html',
        url: '',
        srcDoc: injectAccessflowBridge(value),
      })
      return
    }

    try {
      const url = normalizePageUrl(value)
      setRenderTarget({ mode: 'external', url, srcDoc: '' })
      setInput(url)
    } catch {
      setRenderTarget({
        mode: 'html',
        url: '',
        srcDoc: buildMessageDocument('URL inválida', 'Informe uma URL com domínio válido, como https://example.com.'),
      })
    }
  }

  function exportJSON() {
    const config = {
      accessflow_version: '1.0',
      design_system: 'Aether',
      exported_at: new Date().toISOString(),
      rendered_page: renderTarget.url || renderTarget.mode,
      preset: state.preset,
      typography: {
        fontFamily: state.fontFamily,
        fontSize: state.fontSize,
        letterSpacing: state.letterSpacing,
        lineHeight: state.lineHeight,
      },
      visual: {
        contrastMode: state.contrastMode,
        focusMode: state.focusMode,
        highlightLinks: state.highlightLinks,
        removeAnimations: state.removeAnimations,
      },
      reading: {
        readingRuler: state.readingRuler,
        readingProgress: state.readingProgress,
      },
    }
    const anchor = document.createElement('a')
    anchor.href = URL.createObjectURL(new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' }))
    anchor.download = 'accessflow-configuracao-aether.json'
    anchor.click()
    URL.revokeObjectURL(anchor.href)
  }

  function onViewportScroll() {
    const viewport = viewportRef.current
    if (!viewport || !state.readingProgress || renderTarget.mode !== 'demo') return
    const scrollable = viewport.scrollHeight - viewport.clientHeight
    setProgress(scrollable > 0 ? Math.min(100, (viewport.scrollTop / scrollable) * 100) : 0)
  }

  return (
    <div className="ae-sandbox-view" onMouseMove={event => setMouseY(event.clientY - 18)}>
      {state.readingRuler && <div className="ae-reading-ruler" aria-hidden="true" style={{ display: 'block', top: mouseY }} />}

      <header className="ae-topbar">
        <div className="ae-topbar-left">
          <span className="ae-topbar-title">Sandbox AccessFlow</span>
          <div className="ae-live-badge"><span className="ae-live-dot" />Ambiente ao vivo</div>
        </div>
        <div className="ae-topbar-right">
          <button className="ae-icon-btn" aria-label="Configurações"><span className="material-symbols-outlined">settings</span></button>
          <button className="ae-icon-btn" aria-label="Conta"><span className="material-symbols-outlined">account_circle</span></button>
        </div>
      </header>

      <div className="ae-body">
        <aside className="ae-settings" style={{ width: settingsWidth, minWidth: 240, maxWidth: 600 }}>
          <div className="ae-settings-header">
            <p className="ae-settings-title">Personalizar experiência</p>
            <p className="ae-settings-subtitle">Ajuste os parâmetros para simular diferentes necessidades de leitura.</p>
          </div>

          <div className="ae-settings-body">
            <section>
              <div className="ae-section-title"><span className="material-symbols-outlined">psychology</span>Perfil cognitivo</div>
              <div className="ae-profile-grid">
                <ProfileCard active={state.preset === 'dyslexia'} label="Simulação de dislexia" onClick={() => choosePreset('dyslexia')} />
                <ProfileCard active={state.preset === 'adhd'} label="Simulação de TDAH" onClick={() => choosePreset('adhd')} />
                <ProfileCard active={state.preset === 'both'} label="Dislexia + TDAH" onClick={() => choosePreset('both')} />
              </div>
            </section>

            <section>
              <div className="ae-section-title"><span className="material-symbols-outlined">match_case</span>Tipografia</div>
              <div className="ae-select-wrap">
                <label className="ae-label" htmlFor="ae-font-select">Família da fonte</label>
                <select className="ae-select" id="ae-font-select" value={state.fontFamily} onChange={event => patchState({ fontFamily: event.target.value })}>
                  <option value="default">Inter (padrão)</option>
                  <option value="opendyslexic">OpenDyslexic</option>
                  <option value="system">Sistema</option>
                </select>
              </div>
              <Slider id="ae-fontsize" label="Tamanho base da fonte" value={state.fontSize} min={12} max={24} step={1} format={value => `${Math.round(value)}px`} onChange={fontSize => patchState({ fontSize })} />
              <Slider id="ae-ls" label="Espaçamento entre letras" value={state.letterSpacing} min={0} max={6} step={0.5} format={value => `${value}px`} onChange={letterSpacing => patchState({ letterSpacing })} />
              <Slider id="ae-lh" label="Altura de linha" value={state.lineHeight} min={1.2} max={2.5} step={0.05} format={value => Number(value).toFixed(2)} onChange={lineHeight => patchState({ lineHeight })} />
            </section>

            <section>
              <div className="ae-section-title"><span className="material-symbols-outlined">visibility</span>Visual e foco</div>
              <div className="ae-select-wrap" style={{ marginBottom: 16 }}>
                <label className="ae-label">Modo de contraste</label>
                <div className="ae-segment">
                  {[
                    ['normal', 'Normal'],
                    ['high', 'Alto'],
                    ['dark', 'Escuro'],
                  ].map(([value, label]) => (
                    <button
                      className={`ae-segment-btn ${state.contrastMode === value ? 'active' : ''}`}
                      data-contrast={value}
                      aria-pressed={state.contrastMode === value}
                      onClick={() => patchState({ contrastMode: value })}
                      type="button"
                      key={value}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <Toggle icon="center_focus_strong" label="Modo foco" tip="Reduz a intensidade dos parágrafos fora do foco" checked={state.focusMode} onChange={focusMode => patchState({ focusMode })} />
              <Toggle icon="link" label="Destacar links" tip="Torna links e ações mais visíveis" checked={state.highlightLinks} onChange={highlightLinks => patchState({ highlightLinks })} />
              <Toggle icon="motion_photos_off" label="Remover animações" tip="Pausa animações e transições" checked={state.removeAnimations} onChange={removeAnimations => patchState({ removeAnimations })} />
              <Toggle icon="straighten" label="Régua de leitura" tip="Uma faixa horizontal acompanha o cursor" checked={state.readingRuler} onChange={readingRuler => patchState({ readingRuler })} />
              <Toggle icon="data_usage" label="Progresso de leitura" tip="Mostra uma barra de progresso no topo" checked={state.readingProgress} onChange={readingProgress => patchState({ readingProgress })} />
            </section>
          </div>

          <div className="ae-settings-footer">
            <button className="ae-btn-export" onClick={exportJSON}><span className="material-symbols-outlined">data_object</span>Exportar JSON</button>
            <button className="ae-btn-reset" onClick={resetState}>Restaurar padrões</button>
          </div>
        </aside>

        <div
          className={`ae-resize-handle ${isDragging ? 'active' : ''}`}
          ref={dragRef}
          onMouseDown={(e) => { e.preventDefault(); setIsDragging(true) }}
          role="separator"
          aria-orientation="vertical"
          aria-label="Redimensionar painel de configurações"
          tabIndex={0}
        >
          <span className="ae-resize-grip" />
        </div>

        <section className="ae-preview">
          <div className="ae-preview-card">
            <form className="ae-url-bar" onSubmit={handleSubmit}>
              <div className="ae-url-input-wrap">
                <span className="material-symbols-outlined">public</span>
                <input className="ae-url-input" value={input} onChange={event => setInput(event.target.value)} type="text" placeholder="Cole uma URL, por exemplo https://example.com" aria-label="Página para renderizar" />
              </div>
              <button className="ae-demo-btn" type="button" onClick={() => { setInput(''); setRenderTarget({ mode: 'demo', url: '', srcDoc: '' }) }}>Exemplo</button>
              <button className="ae-go-btn" type="submit">Renderizar</button>
            </form>

            <div className={`ae-viewport contrast-${state.contrastMode}`} ref={viewportRef} onScroll={onViewportScroll}>
              {state.readingProgress && renderTarget.mode === 'demo' && <div className="ae-reading-progress" style={{ display: 'block', width: `${progress}%` }} />}
              <div className="ae-render-shell">
                {renderTarget.mode === 'demo' ? (
                  <DemoArticle state={state} />
                ) : (
                  <div className="ae-frame-wrap">
                    <iframe
                      className="ae-render-frame"
                      ref={iframeRef}
                      title={renderTarget.mode === 'external' ? `Página renderizada: ${renderTarget.url}` : 'HTML informado'}
                      src={iframeSrc}
                      srcDoc={renderTarget.mode === 'html' ? renderTarget.srcDoc : undefined}
                      sandbox="allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin"
                      referrerPolicy="no-referrer-when-downgrade"
                      onLoad={() => {
                        setFrameReady(true)
                        iframeRef.current?.contentWindow?.postMessage({ type: 'ACCESSFLOW_APPLY_STATE', state }, '*')
                      }}
                    />
                    <div className="ae-frame-note">
                      {frameReady ? 'Conteúdo carregado. Se um site depender de login, APIs privadas ou scripts bloqueados, use o botão de abrir página para comparar.' : 'Carregando renderização...'}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="ae-info-bar">
              <div className="ae-info-bar-left">
                <span className="material-symbols-outlined">info</span>
                <span>{status.info}</span>
              </div>
              <button className="ae-info-bar-action" disabled={!renderTarget.url} onClick={() => renderTarget.url && window.open(renderTarget.url, '_blank', 'noopener,noreferrer')}>
                Abrir página
              </button>
            </div>

            <div className="ae-status-bar">
              <div className="ae-status-left"><span className="ae-status-dot" /><span>{status.left}</span></div>
              <div className="ae-status-right">{status.right}</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

function ProfileCard({ active, label, onClick }) {
  return (
    <button type="button" className={`ae-profile-card ${active ? 'active' : ''}`} onClick={onClick}>
      <span className="ae-profile-label">{label}</span>
      <span className={`ae-profile-radio ${active ? 'checked' : ''}`} aria-hidden="true" />
    </button>
  )
}

function Slider({ id, label, value, min, max, step, format, onChange }) {
  return (
    <div className="ae-slider-wrap">
      <div className="ae-slider-header">
        <label className="ae-slider-label" htmlFor={id}>{label}</label>
        <span className="ae-slider-val">{format(value)}</span>
      </div>
      <input className="ae-range" type="range" id={id} min={min} max={max} step={step} value={value} aria-label={label} onChange={event => onChange(parseFloat(event.target.value))} />
    </div>
  )
}

function Toggle({ icon, label, tip, checked, onChange }) {
  return (
    <div className="ae-toggle-row">
      <div className="ae-toggle-label">
        <span className="material-symbols-outlined ae-toggle-icon">{icon}</span>
        <span>{label}</span>
        <span className="material-symbols-outlined ae-info-icon" title={tip}>info</span>
      </div>
      <label className="ae-switch">
        <input type="checkbox" checked={checked} onChange={event => onChange(event.target.checked)} />
        <div className="ae-track" />
      </label>
    </div>
  )
}

function DemoArticle({ state }) {
  const articleStyle = {
    fontFamily: FONT_MAP[state.fontFamily] || FONT_MAP.default,
    fontSize: `${state.fontSize}px`,
    letterSpacing: `${state.letterSpacing}px`,
  }
  const textStyle = {
    lineHeight: state.lineHeight,
    color: state.contrastMode === 'high' ? '#fff' : undefined,
  }

  return (
    <article className={`ae-article ${state.focusMode ? 'focus-mode' : ''} ${state.highlightLinks ? 'highlight-links' : ''}`} style={articleStyle}>
      <p className="ae-article-tag">Acessibilidade · Pesquisa</p>
      <h1 style={textStyle}>Como o design acessível transforma a experiência de leitura</h1>
      <div className="ae-meta">
        <span>Equipe de pesquisa AccessFlow</span><span>·</span>
        <span>8 min de leitura</span><span>·</span><span>Atualizado em 2026</span>
      </div>
      <div className="ae-img">
        <span className="material-symbols-outlined" style={{ fontSize: 32, color: '#9951e6' }}>image</span>
        Imagem - texto alternativo gerado por IA
      </div>
      <p style={textStyle}>Pesquisas mostram que acessibilidade tipográfica, com espaçamento maior entre letras, altura de linha generosa e fontes escolhidas com cuidado, pode reduzir a carga cognitiva de leitores com dislexia e TDAH. Visite nossa <a href="#">biblioteca de pesquisa</a> para ver a metodologia completa.</p>
      <h2 style={textStyle}>A lógica por trás dos ajustes</h2>
      <p style={textStyle}>O sistema visual humano processa texto em movimentos rápidos entre pontos de foco. Para leitores neurodivergentes, erros de rastreamento podem ser mais frequentes. Aumentar o <a href="#">espaçamento entre letras</a> cria limites mais claros entre caracteres e facilita a leitura contínua.</p>
      <p style={textStyle}>O TDAH traz outro desafio: sustentar a atenção. Recursos como modo foco e régua de leitura criam âncoras visuais que guiam os olhos e reduzem estímulos concorrentes na página.</p>
      <h2 style={textStyle}>Exemplo de implementação</h2>
      <div className="ae-code-block">
        <span className="code-comment">/* Transformação central do AccessFlow */</span><br />
        <span className="code-key">body</span> {'{'}<br />
        &nbsp;&nbsp;<span className="code-key">font-family</span>: <span className="code-val">'OpenDyslexic', sans-serif</span>;<br />
        &nbsp;&nbsp;<span className="code-key">letter-spacing</span>: <span className="code-val">0.18em</span>;<br />
        &nbsp;&nbsp;<span className="code-key">line-height</span>: <span className="code-val">2.0</span>;<br />
        {'}'}
      </div>
      <p style={textStyle}>O resultado é um ambiente de leitura que se adapta à pessoa, em vez de exigir que a pessoa se adapte à página. Experimente os controles à esquerda e veja a diferença em tempo real.</p>
      <h2 style={textStyle}>Impacto na retenção de informação</h2>
      <p style={textStyle}>Estudos conduzidos pela <a href="#">Universidade de Michigan</a> demonstram que leitores com dislexia retêm até 40% mais informação quando o texto é apresentado com fontes projetadas para legibilidade, como a <a href="#">OpenDyslexic</a>. As letras com bases mais pesadas criam uma âncora visual que reduz a rotação percebida dos caracteres.</p>
      <p style={textStyle}>Além disso, a combinação de espaçamento generoso com alturas de linha acima de 1.8 reduz significativamente a fadiga ocular durante sessões prolongadas de leitura. Esse efeito é particularmente pronunciado em ambientes digitais, onde a luminosidade da tela adiciona uma camada extra de estresse visual.</p>
      <h2 style={textStyle}>Acessibilidade como padrão de design</h2>
      <p style={textStyle}>A tendência moderna de <a href="#">design inclusivo</a> propõe que acessibilidade não deveria ser uma adaptação posterior, mas um princípio fundamental desde a concepção do projeto. Quando um site é projetado considerando as necessidades de leitores neurodivergentes desde o início, todos os usuários se beneficiam de uma experiência mais clara e menos cognitivamente exigente.</p>
      <p style={textStyle}>Ferramentas como o AccessFlow permitem que desenvolvedores e designers testem diferentes configurações de acessibilidade em tempo real, acelerando o ciclo de feedback e garantindo que os ajustes atendam às necessidades reais dos usuários. Consulte nossa <a href="#">documentação técnica</a> para integrar esses recursos ao seu projeto.</p>
    </article>
  )
}

function buildMessageDocument(title, message) {
  return injectAccessflowBridge(`
    <main style="font-family: Inter, system-ui, sans-serif; padding: 48px; color: #1f1a23;">
      <h1>${escapeHTML(title)}</h1>
      <p>${escapeHTML(message)}</p>
    </main>
  `)
}

function escapeHTML(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}
