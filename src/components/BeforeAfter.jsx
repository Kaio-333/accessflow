import React, { useRef, useState } from 'react'

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
    <section id="before-after" style={{ padding:'100px 48px', background:'rgba(17,12,21,.7)', backdropFilter:'blur(6px)', borderTop:'1px solid #4c4453', borderBottom:'1px solid #4c4453', position:'relative', zIndex:1 }}>
      <div style={{ maxWidth:900, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <p style={{ fontFamily:'JetBrains Mono, monospace', fontSize:11, color:'#9951e6', textTransform:'uppercase', letterSpacing:'.15em', marginBottom:14 }}>Veja a diferença</p>
          <h2 style={{ fontSize:'clamp(26px,4vw,42px)', fontWeight:700, color:'#eadfed', letterSpacing:0, marginBottom:12 }}>Arraste para comparar a transformação</h2>
          <p style={{ fontSize:13, color:'#988d9f', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
            <span className="material-symbols-outlined" style={{ animation:'bounceX 1.5s ease-in-out infinite', color:'#9951e6' }}>swap_horiz</span>
            Mova o controle para esquerda ou direita
          </p>
        </div>

        <div
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
          style={{ position:'relative', borderRadius:16, overflow:'hidden', border:'1px solid #4c4453', height:440, cursor:'col-resize', userSelect:'none', boxShadow:'0 16px 48px rgba(0,0,0,.5)' }}
        >
          <div className="slider-after" style={{ position:'absolute', inset:0, overflow:'hidden' }}>
            <div style={{ width:'100%', height:'100%', background:'#0d1117', padding:32, fontFamily:'Inter, sans-serif', color:'#f0ede8', overflow:'hidden' }}>
              <div style={{ background:'#1f1a23', borderBottom:'1px solid #4c4453', padding:'10px 16px', margin:'-32px -32px 24px', fontSize:13, fontWeight:600, display:'flex', alignItems:'center', gap:8, color:'#9951e6' }}>
                <span className="material-symbols-outlined" style={{ fontSize:16, fontVariationSettings:"'FILL' 1" }}>accessibility_new</span>
                AccessFlow · Ativo
              </div>
              <div style={{ height:3, background:'linear-gradient(90deg,#9951e6,transparent)', width:'65%', borderRadius:2, marginBottom:20 }} />
              <div style={{ fontSize:22, fontWeight:700, lineHeight:1.3, letterSpacing:'.02em', color:'#eadfed', marginBottom:16, fontFamily:'OpenDyslexic, Inter, sans-serif' }}>Como o design acessível<br />transforma a leitura</div>
              <p style={{ fontSize:16, lineHeight:2.1, letterSpacing:'.04em', color:'#cec2d5', fontFamily:'OpenDyslexic, Inter, sans-serif' }}>
                Pesquisas mostram que ajustes tipográficos reduzem a carga cognitiva para leitores com
                <span style={{ color:'#9951e6', fontWeight:700, textDecoration:'underline' }}> dislexia</span> e
                <span style={{ color:'#9951e6', fontWeight:700, textDecoration:'underline' }}> TDAH</span>.
              </p>
            </div>
          </div>

          <div className="slider-before" style={{ position:'absolute', inset:0, overflow:'hidden', clipPath:`inset(0 ${100 - position}% 0 0)` }}>
            <div style={{ width:'100%', height:'100%', background:'#faf8f5', padding:32, fontFamily:'Georgia, serif', color:'#444', overflow:'hidden' }}>
              <div style={{ background:'#fffc00', padding:6, textAlign:'center', fontSize:10, fontWeight:'bold', color:'#333', margin:'-32px -32px 8px', animation:'blinkBanner .8s step-end infinite' }}>URGENTE: oferta acaba em 00:59</div>
              <div style={{ background:'linear-gradient(90deg,#ff6b6b,#ff8e53)', color:'white', padding:'8px 16px', margin:'0 -32px 12px', fontSize:11, display:'flex', justifyContent:'space-between' }}>
                <span>AccessNews Pro+</span><span style={{ animation:'shake .3s ease infinite', fontWeight:700 }}>50% OFF</span>
              </div>
              <div style={{ background:'#ffd700', border:'2px dashed #ffc107', padding:8, textAlign:'center', fontSize:10, color:'#856404', marginBottom:10 }}>PATROCINADO - clique para concorrer</div>
              <div style={{ fontFamily:'Times New Roman, serif', fontSize:17, lineHeight:1.2, letterSpacing:0, color:'#222', marginBottom:8 }}>Como o design acessível transforma a experiência de leitura</div>
              <p style={{ fontSize:12, lineHeight:1.3, letterSpacing:0, color:'#555' }}>Pesquisas mostram que a acessibilidade tipográfica reduz a carga cognitiva para leitores com <span style={{ color:'blue', textDecoration:'underline' }}>dislexia</span> e <span style={{ color:'blue', textDecoration:'underline' }}>TDAH</span>.</p>
              <div style={{ background:'#fff3cd', border:'2px dashed #ffc107', padding:8, textAlign:'center', fontSize:10, color:'#856404', marginTop:10, animation:'adPulse 1s ease infinite' }}>Você também pode gostar: 10 dicas imperdíveis</div>
            </div>
          </div>

          <div className="slider-handle" style={{ position:'absolute', top:0, bottom:0, left:`${position}%`, transform:'translateX(-50%)', width:3, background:'#eadfed', zIndex:10, pointerEvents:'none' }}>
            <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:44, height:44, borderRadius:'50%', background:'#eadfed', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 16px rgba(0,0,0,.4)' }}>
              <span className="material-symbols-outlined" style={{ fontSize:20, color:'#16111b', fontVariationSettings:"'FILL' 1" }}>swap_horiz</span>
            </div>
          </div>

          <span style={{ position:'absolute', top:16, left:16, zIndex:5, padding:'5px 12px', borderRadius:9999, fontSize:11, fontWeight:700, fontFamily:'JetBrains Mono, monospace', letterSpacing:'.05em', background:'rgba(255,107,107,.15)', border:'1px solid rgba(255,107,107,.4)', color:'#ff6b6b', pointerEvents:'none' }}>Sem AccessFlow</span>
          <span style={{ position:'absolute', top:16, right:16, zIndex:5, padding:'5px 12px', borderRadius:9999, fontSize:11, fontWeight:700, fontFamily:'JetBrains Mono, monospace', letterSpacing:'.05em', background:'rgba(86,211,100,.15)', border:'1px solid rgba(86,211,100,.4)', color:'#56d364', pointerEvents:'none' }}>Com AccessFlow</span>
        </div>
      </div>
    </section>
  )
}
