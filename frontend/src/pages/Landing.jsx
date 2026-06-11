import React, { useEffect } from 'react'
import BeforeAfter from '../components/BeforeAfter.jsx'
import { FEATURES } from '../data/features.js'

export default function Landing({ onNavigate }) {
  useLandingCanvas()

  useEffect(() => {
    const cards = document.querySelectorAll('.lp-card')
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' })

    cards.forEach(card => observer.observe(card))
    return () => observer.disconnect()
  }, [])

  return (
    <div id="landing-view">
      <section id="home" className="lp-hero">
        <div className="lp-hero-content">
          <h1 className="lp-hero-headline">A web, adaptada ao<br />jeito como sua mente lê.</h1>
          <p className="lp-hero-subline">Criado por HuGO para acompanhar você</p>
          <p className="lp-hero-body">
            O Swim ajusta qualquer página em tempo real para pessoas com dislexia e TDAH:
            menos ruído, mais clareza e leitura no seu ritmo.
          </p>
          <div className="lp-hero-ctas">
            <button className="lp-btn-primary" aria-label="Adicionar o Swim ao Chrome gratuitamente">
              <span className="material-symbols-outlined">download</span>
              Adicionar ao Chrome
            </button>
            <button className="lp-btn-ghost" aria-label="Abrir o sandbox interativo" onClick={() => onNavigate('sandbox')}>
              <span className="material-symbols-outlined">science</span>
              Testar sandbox
            </button>
          </div>
        </div>
      </section>

      <section id="features" className="lp-features">
        <div className="lp-section-header">
          <p className="lp-section-label">O que o Swim faz</p>
          <h2 className="lp-section-title" id="features-heading">20 recursos. Uma missão.</h2>
          <p className="lp-section-sub">
            Cada ajuste foi pensado para reduzir atrito cognitivo e tornar a web mais inclusiva.
          </p>
        </div>
        <div className="lp-features-grid" role="list">
          {FEATURES.map((feature, index) => (
            <div className="lp-card" style={{ transitionDelay:`${(index % 3) * 55}ms` }} role="article" aria-label={feature.name} key={feature.name}>
              <div className="lp-card-icon">
                <span className="material-symbols-outlined" aria-hidden="true">{feature.icon}</span>
              </div>
              <p className="lp-card-name">{feature.name}</p>
              <p className="lp-card-desc">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <BeforeAfter />
      <HowItWorks />
      <Pricing onNavigate={onNavigate} />
      <Footer />
    </div>
  )
}

function Pricing({ onNavigate }) {
  const perks = [
    'Ajustes de acessibilidade em qualquer site',
    'Perfis personalizados salvos na nuvem',
    'Sandbox completo com pré-visualização ao vivo',
    'Régua de leitura, foco e remoção de animações',
    'Suporte prioritário',
  ]

  return (
    <section id="pricing" className="lp-pricing">
      <div className="lp-section-header">
        <p className="lp-section-label">Planos</p>
        <h2 className="lp-section-title">Acesso completo ao Swim.</h2>
        <p className="lp-section-sub">Um plano simples, sem pegadinhas. Cancele quando quiser.</p>
      </div>

      <div className="lp-price-card">
        <div className="lp-price-badge">Mais popular</div>
        <h3 className="lp-price-name">Acesso completo</h3>
        <div className="lp-price-value">
          <span className="lp-price-currency">R$</span>
          <span className="lp-price-amount">9,99</span>
          <span className="lp-price-period">/mês</span>
        </div>
        <ul className="lp-price-perks" role="list">
          {perks.map(perk => (
            <li key={perk}>
              <span className="material-symbols-outlined" aria-hidden="true">check_circle</span>
              {perk}
            </li>
          ))}
        </ul>
        <button className="lp-btn-primary lp-price-cta" onClick={() => onNavigate('register')}>
          <span className="material-symbols-outlined">lock_open</span>
          Obter acesso
        </button>
        <p className="lp-price-note">Pagamento mensal · sem fidelidade</p>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    { n:'01', icon:'download', t:'Instale', d:'Adicione o Swim ao Chrome em um clique, sem configuração inicial.' },
    { n:'02', icon:'tune', t:'Configure', d:'Escolha seu perfil de leitura ou ajuste tudo manualmente no sandbox.' },
    { n:'03', icon:'public', t:'Navegue', d:'As páginas visitadas recebem os ajustes de acessibilidade automaticamente.' },
  ]

  return (
    <section id="howworks" className="lp-how">
      <div className="lp-how-inner">
        <div className="lp-section-header">
          <p className="lp-section-label">Como funciona</p>
          <h2 className="lp-section-title">Três passos para ler com clareza.</h2>
          <p className="lp-section-sub">O Swim foi pensado para ficar em segundo plano: você navega, ele adapta.</p>
        </div>
        <div className="lp-steps">
          {steps.map(step => (
            <div className="lp-step" key={step.n}>
              <div className="lp-step-num">{step.n}</div>
              <div className="lp-step-emoji"><span className="material-symbols-outlined">{step.icon}</span></div>
              <h3 className="lp-step-title">{step.t}</h3>
              <p className="lp-step-desc">{step.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer id="site-footer" className="lp-footer">
      <div className="lp-footer-inner">
        <div>
          <div className="lp-footer-logo">
            <div className="lp-footer-logo-icon"><span className="material-symbols-outlined">accessibility_new</span></div>
            <span className="lp-footer-logo-name">Swim</span>
          </div>
          <p className="lp-footer-tagline">A web, adaptada ao jeito como sua mente lê.</p>
          <p className="lp-footer-love">Feito com <span>♥</span> para mentes neurodivergentes.</p>
        </div>
        <div className="lp-footer-links">
          <a href="#" className="lp-footer-link">Política de privacidade</a>
          <a href="https://github.com/Kaio-333/accessflow" target="_blank" rel="noopener" className="lp-footer-link">GitHub</a>
          <a href="mailto:hello@accessflow.app" className="lp-footer-link">Contato</a>
        </div>
      </div>
      <div className="lp-footer-divider" />
      <div className="lp-footer-bottom">
        <span>© {new Date().getFullYear()} Swim. Todos os direitos reservados.</span>
        <span>Construído com foco em conformidade WCAG AA.</span>
      </div>
    </footer>
  )
}

function useLandingCanvas() {
  useEffect(() => {
    let canvas = document.getElementById('landing-canvas')
    if (!canvas) {
      canvas = document.createElement('canvas')
      canvas.id = 'landing-canvas'
      document.body.insertBefore(canvas, document.body.firstChild)
    }

    const context = canvas.getContext('2d')
    const colors = ['#9951e6', '#7f34cb', '#5416bf', '#23005c']
    let width = 0
    let height = 0
    let rafId = 0

    function resize() {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    class BlobShape {
      constructor() {
        this.size = Math.random() * 420 + 180
        this.x = Math.random() * (width || 1200)
        this.y = Math.random() * (height || 800)
        this.vx = (Math.random() - 0.5) * 0.7
        this.vy = (Math.random() - 0.5) * 0.7
        this.color = colors[Math.floor(Math.random() * colors.length)]
        this.opacity = Math.random() * 0.14 + 0.04
      }

      update() {
        this.x += this.vx
        this.y += this.vy
        if (this.x < -this.size) this.x = width + this.size
        if (this.x > width + this.size) this.x = -this.size
        if (this.y < -this.size) this.y = height + this.size
        if (this.y > height + this.size) this.y = -this.size
      }

      draw() {
        const gradient = context.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size)
        const r = parseInt(this.color.slice(1, 3), 16)
        const g = parseInt(this.color.slice(3, 5), 16)
        const b = parseInt(this.color.slice(5, 7), 16)
        gradient.addColorStop(0, `rgba(${r},${g},${b},${this.opacity})`)
        gradient.addColorStop(1, 'rgba(22,17,27,0)')
        context.fillStyle = gradient
        context.beginPath()
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        context.fill()
      }
    }

    resize()
    const blobs = Array.from({ length:12 }, () => new BlobShape())
    window.addEventListener('resize', resize)

    function animate() {
      context.fillStyle = '#16111b'
      context.fillRect(0, 0, width, height)
      blobs.forEach(blob => {
        blob.update()
        blob.draw()
      })
      rafId = requestAnimationFrame(animate)
    }

    animate()
    window.setTimeout(() => canvas.classList.add('visible'), 100)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      canvas.classList.remove('visible')
    }
  }, [])
}
