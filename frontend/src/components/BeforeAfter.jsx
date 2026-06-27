import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function BeforeAfter() {
  const wrapperRef = useRef(null)
  const [position, setPosition] = useState(50)
  const dragging = useRef(false)

  function moveTo(clientX) {
    const rect = wrapperRef.current?.getBoundingClientRect()
    if (!rect) return
    const next = Math.max(2, Math.min(98, ((clientX - rect.left) / rect.width) * 100))
    setPosition(next)
  }

  function stopDragging() {
    dragging.current = false
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', stopDragging)
  }

  function onMouseMove(event) {
    if (dragging.current) moveTo(event.clientX)
  }

  function startMouseDrag(event) {
    dragging.current = true
    moveTo(event.clientX)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', stopDragging)
    event.preventDefault()
  }

  function onTouchMove(event) {
    if (event.touches[0]) moveTo(event.touches[0].clientX)
  }

  function onKeyDown(event) {
    const step = event.shiftKey ? 10 : 2
    if (event.key === 'ArrowLeft') {
      setPosition(value => Math.max(2, value - step))
      event.preventDefault()
    }
    if (event.key === 'ArrowRight') {
      setPosition(value => Math.min(98, value + step))
      event.preventDefault()
    }
  }

  return (
    <section 
      id="before-after" 
      style={{ 
        padding: '140px 48px', 
        background: 'rgba(17,12,21,0.45)', 
        backdropFilter: 'blur(12px)', 
        borderTop: '1px solid rgba(76,68,83,0.3)', 
        borderBottom: '1px solid rgba(76,68,83,0.3)', 
        position: 'relative', 
        zIndex: 1 
      }}
    >
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <p style={{ 
            fontFamily: 'JetBrains Mono, monospace', 
            fontSize: 11, 
            color: '#9951e6', 
            textTransform: 'uppercase', 
            letterSpacing: '.20em', 
            marginBottom: 16 
          }}>
            Veja a diferença
          </p>
          <h2 style={{ 
            fontSize: 'clamp(28px,4vw,46px)', 
            fontWeight: 800, 
            color: '#eadfed', 
            letterSpacing: '-0.01em', 
            marginBottom: 16 
          }}>
            Arraste para comparar a transformação
          </h2>
          <p style={{ 
            fontSize: 14, 
            color: '#988d9f', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: 8 
          }}>
            <span 
              className="material-symbols-outlined" 
              style={{ animation: 'bounceX 1.5s ease-in-out infinite', color: '#dbb8ff' }}
            >
              swap_horiz
            </span>
            Mova o controle para esquerda ou direita
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          ref={wrapperRef}
          className="slider-wrapper"
          role="slider"
          tabIndex="0"
          aria-label="Comparativo antes e depois"
          aria-valuenow={Math.round(position)}
          aria-valuemin="0"
          aria-valuemax="100"
          onMouseDown={startMouseDrag}
          onTouchStart={event => event.touches[0] && moveTo(event.touches[0].clientX)}
          onTouchMove={onTouchMove}
          onKeyDown={onKeyDown}
          style={{ 
            position: 'relative', 
            borderRadius: 24, 
            overflow: 'hidden', 
            border: '1px solid rgba(153,81,230,0.3)', 
            height: 460, 
            cursor: 'col-resize', 
            userSelect: 'none', 
            boxShadow: '0 24px 64px rgba(0,0,0,.6)' 
          }}
        >
          {/* AFTER (Swim Active) */}
          <div className="slider-after" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '100%', background: '#0e0b11', padding: '40px 48px', fontFamily: 'Inter, sans-serif', color: '#f0ede8', overflow: 'hidden' }}>
              <div style={{ 
                background: 'rgba(153, 81, 230, 0.12)', 
                borderBottom: '1px solid rgba(153, 81, 230, 0.25)', 
                padding: '12px 20px', 
                margin: '-40px -48px 32px', 
                fontSize: 13, 
                fontWeight: 600, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8, 
                color: '#dbb8ff',
                backdropFilter: 'blur(8px)'
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#dbb8ff' }}>accessibility_new</span>
                Swim · Adaptado e Ativo
              </div>
              <div style={{ height: 4, background: 'linear-gradient(90deg,#9951e6,transparent)', width: '60%', borderRadius: 2, marginBottom: 28 }} />
              <div style={{ 
                fontSize: 26, 
                fontWeight: 700, 
                lineHeight: 1.4, 
                letterSpacing: '.03em', 
                color: '#eadfed', 
                marginBottom: 20, 
                fontFamily: 'OpenDyslexic, Inter, sans-serif' 
              }}>
                Como o design acessível transforma a leitura
              </div>
              <p style={{ 
                fontSize: 18, 
                lineHeight: 2.2, 
                letterSpacing: '.05em', 
                color: '#cec2d5', 
                fontFamily: 'OpenDyslexic, Inter, sans-serif' 
              }}>
                Pesquisas mostram que ajustes tipográficos reduzem a carga cognitiva para leitores com
                <span style={{ color: '#dbb8ff', fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: '6px' }}> dislexia</span> e
                <span style={{ color: '#dbb8ff', fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: '6px' }}> TDAH</span>.
              </p>
            </div>
          </div>

          {/* BEFORE (Terrible Web Experience) */}
          <div className="slider-before" style={{ position: 'absolute', inset: 0, overflow: 'hidden', clipPath: `inset(0 ${100 - position}% 0 0)` }}>
            <div style={{ width: '100%', height: '100%', background: '#faf8f5', padding: '40px 48px', fontFamily: 'Georgia, serif', color: '#444', overflow: 'hidden' }}>
              <div style={{ background: '#fffc00', padding: 6, textAlign: 'center', fontSize: 10, fontWeight: 'bold', color: '#333', margin: '-40px -48px 12px', animation: 'blinkBanner .8s step-end infinite' }}>URGENTE: oferta acaba em 00:59</div>
              <div style={{ background: 'linear-gradient(90deg,#ff6b6b,#ff8e53)', color: 'white', padding: '8px 20px', margin: '0 -48px 16px', fontSize: 11, display: 'flex', justifyContent: 'space-between' }}>
                <span>AccessNews Pro+</span><span style={{ animation: 'shake .3s ease infinite', fontWeight: 700 }}>50% OFF</span>
              </div>
              <div style={{ background: '#ffd700', border: '2px dashed #ffc107', padding: 8, textAlign: 'center', fontSize: 10, color: '#856404', marginBottom: 12 }}>PATROCINADO - clique para concorrer</div>
              <div style={{ fontFamily: 'Times New Roman, serif', fontSize: 19, lineHeight: 1.2, letterSpacing: 0, color: '#222', marginBottom: 12 }}>Como o design acessível transforma a experiência de leitura</div>
              <p style={{ fontSize: 13, lineHeight: 1.4, letterSpacing: 0, color: '#555' }}>Pesquisas mostram que a acessibilidade tipográfica reduz a carga cognitiva para leitores com <span style={{ color: 'blue', textDecoration: 'underline' }}>dislexia</span> e <span style={{ color: 'blue', textDecoration: 'underline' }}>TDAH</span>.</p>
              <div style={{ background: '#fff3cd', border: '2px dashed #ffc107', padding: 8, textAlign: 'center', fontSize: 10, color: '#856404', marginTop: 12, animation: 'adPulse 1s ease infinite' }}>Você também pode gostar: 10 dicas imperdíveis</div>
            </div>
          </div>

          {/* DRAG HANDLE */}
          <div className="slider-handle" style={{ position: 'absolute', top: 0, bottom: 0, left: `${position}%`, transform: 'translateX(-50%)', width: 3, background: '#eadfed', zIndex: 10, pointerEvents: 'none' }}>
            <div style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%,-50%)', 
              width: 48, 
              height: 48, 
              borderRadius: '50%', 
              background: 'rgba(31, 26, 35, 0.8)', 
              border: '2px solid rgba(153, 81, 230, 0.6)',
              backdropFilter: 'blur(8px)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              boxShadow: '0 8px 24px rgba(153, 81, 230, 0.3)',
              color: '#dbb8ff'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 22, fontVariationSettings: "'FILL' 1" }}>swap_horiz</span>
            </div>
          </div>

          {/* GLASS LABELS */}
          <span style={{ 
            position: 'absolute', 
            top: 20, 
            left: 20, 
            zIndex: 5, 
            padding: '6px 14px', 
            borderRadius: 9999, 
            fontSize: 11, 
            fontWeight: 700, 
            fontFamily: 'JetBrains Mono, monospace', 
            letterSpacing: '.05em', 
            background: 'rgba(255,107,107,.12)', 
            border: '1px solid rgba(255,107,107,.3)', 
            color: '#ff6b6b', 
            pointerEvents: 'none',
            backdropFilter: 'blur(8px)'
          }}>
            Sem Swim
          </span>
          
          <span style={{ 
            position: 'absolute', 
            top: 20, 
            right: 20, 
            zIndex: 5, 
            padding: '6px 14px', 
            borderRadius: 9999, 
            fontSize: 11, 
            fontWeight: 700, 
            fontFamily: 'JetBrains Mono, monospace', 
            letterSpacing: '.05em', 
            background: 'rgba(153,81,230,.15)', 
            border: '1px solid rgba(153,81,230,.35)', 
            color: '#dbb8ff', 
            pointerEvents: 'none',
            backdropFilter: 'blur(8px)'
          }}>
            Com Swim
          </span>
        </motion.div>
      </div>
    </section>
  )
}
