import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MeshGradient } from '@paper-design/shaders-react'
import BeforeAfter from '../components/BeforeAfter.jsx'

export default function Landing({ onNavigate }) {
  const [showSplash, setShowSplash] = useState(true)
  const [key, setKey] = useState(0)

  useEffect(() => {
    setShowSplash(true)
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 4500)

    const handleScroll = () => {
      setShowSplash(false)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('touchmove', handleScroll, { passive: true })
    window.addEventListener('wheel', handleScroll, { passive: true })

    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('touchmove', handleScroll)
      window.removeEventListener('wheel', handleScroll)
    }
  }, [key])

  // 4 Featured pillars as selected by the user
  const featuredPillars = [
    {
      index: '01',
      icon: 'psychology',
      name: 'Seleção de Perfil de Necessidade',
      desc: 'Perfis pré-configurados para dislexia, TDAH ou necessidades mistas. Adapte toda a interface instantaneamente em apenas um clique.'
    },
    {
      index: '02',
      icon: 'match_case',
      name: 'Troca de Fonte para OpenDyslexic',
      desc: 'Substitui a tipografia de qualquer site por fontes desenhadas para melhorar a legibilidade e evitar a rotação ou confusão de letras.'
    },
    {
      index: '03',
      icon: 'center_focus_strong',
      name: 'Modo Foco Dinâmico',
      desc: 'Escurece o conteúdo ao redor do parágrafo de leitura atual, reduzindo distrações visuais e ajudando a reter o foco por mais tempo.'
    },
    {
      index: '04',
      icon: 'science',
      name: 'Sandbox de Experimentação',
      desc: 'Um ambiente de testes interativo onde você pode simular a extensão do Swim e personalizar suas preferências antes da instalação.'
    }
  ]

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.8, 0.25, 1]
      }
    }
  }

  return (
    <div id="landing-view">
      {/* GPU Accelerated Premium Mesh Gradient Background */}
      <div className="lp-background-wrapper">
        <MeshGradient
          colors={['#16111b', '#1f1a23', '#5416bf', '#23005c']}
          speed={0.35}
          distortion={0.5}
          swirl={0.1}
          style={{ width: '100%', height: '100vh', position: 'fixed', inset: 0 }}
        />
      </div>

      {/* HERO SECTION */}
      <section id="home" className="lp-hero">
        <motion.div 
          className="lp-hero-content"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="lp-badge-glass">
            <span className="dot" />
            <span>Acessibilidade Cognitiva</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="lp-hero-headline">
            A web, adaptada ao<br />
            <span>jeito como sua mente lê.</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="lp-hero-subline">
            Criado para acompanhar você
          </motion.p>

          <motion.p variants={itemVariants} className="lp-hero-body">
            O Swim ajusta qualquer página da internet em tempo real para pessoas com dislexia e TDAH.
            Menos ruído visual, mais foco e leitura fluida no seu ritmo.
          </motion.p>

          <motion.div variants={itemVariants} className="lp-hero-ctas">
            <button className="lp-btn-glass-primary" aria-label="Adicionar o Swim ao Chrome gratuitamente">
              <span className="material-symbols-outlined">download</span>
              Adicionar ao Chrome
            </button>
            <button 
              className="lp-btn-glass-ghost" 
              aria-label="Abrir o sandbox interativo" 
              onClick={() => onNavigate('sandbox')}
            >
              <span className="material-symbols-outlined">science</span>
              Testar sandbox
            </button>
          </motion.div>

          <motion.div variants={itemVariants} className="lp-hero-stats">
            <div className="lp-stat-item">
              <span className="lp-stat-value">20</span>
              <span className="lp-stat-label">Recursos Integrados</span>
            </div>
            <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.1)' }} />
            <div className="lp-stat-item">
              <span className="lp-stat-value">1 Clique</span>
              <span className="lp-stat-label">Instalação</span>
            </div>
            <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.1)' }} />
            <div className="lp-stat-item">
              <span className="lp-stat-value">AA</span>
              <span className="lp-stat-label">Padrão WCAG</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* FEATURES HIGHLIGHTS SECTION */}
      <section id="features" className="lp-features">
        <motion.div 
          className="lp-section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <p className="lp-section-label">O que o Swim faz</p>
          <h2 className="lp-section-title" id="features-heading">Foco no que importa.</h2>
          <p className="lp-section-sub">
            Quatro recursos pilares desenhados meticulosamente para reduzir o atrito cognitivo durante a leitura.
          </p>
        </motion.div>

        <motion.div 
          className="lp-features-grid-premium"
          role="list"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={containerVariants}
        >
          {featuredPillars.map((feature) => (
            <motion.div 
              className="lp-card-premium" 
              variants={itemVariants}
              role="article" 
              aria-label={feature.name} 
              key={feature.name}
            >
              <div className="lp-card-index">{feature.index}</div>
              <div className="lp-card-icon-wrapper">
                <span className="material-symbols-outlined" aria-hidden="true">{feature.icon}</span>
              </div>
              <h3 className="lp-card-name-premium">{feature.name}</h3>
              <p className="lp-card-desc-premium">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* COMPARATIVE SLIDER SECTION */}
      <BeforeAfter />

      {/* HOW IT WORKS SECTION */}
      <HowItWorks />

      {/* PRICING SECTION */}
      <Pricing onNavigate={onNavigate} />

      {/* FOOTER SECTION */}
      <Footer />

      {/* Animated Splash Screen Overlay */}
      <AnimatePresence>
        {showSplash && (
          <motion.div 
            className="lp-splash-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="lp-splash-logo-wrapper">
              <div className="lp-splash-logo-glow" />
              <svg viewBox="0 0 100 100" width="160" height="160" style={{ overflow: 'visible' }}>
                <defs>
                  <linearGradient id="swim-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00d2ff" />
                    <stop offset="100%" stopColor="#9951e6" />
                  </linearGradient>
                  {/* Glow filter */}
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                {/* Outer circle frame */}
                <motion.circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeWidth="1"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1 }}
                />
                {/* Wave-shaped W Logo Path */}
                <motion.path
                  d="M 22,42 C 30,72 38,72 50,47 C 62,72 70,72 78,42"
                  fill="none"
                  stroke="url(#swim-grad)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#glow)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2.2, ease: "easeInOut" }}
                />
              </svg>

              {/* Title text animates letter by letter */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.8, ease: "easeOut" }}
                className="lp-splash-text"
              >
                S<span>W</span>IM
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function HowItWorks() {
  const steps = [
    { n: '01', icon: 'download', t: 'Instale a Extensão', d: 'Adicione o Swim ao Chrome em menos de um minuto pela Web Store.' },
    { n: '02', icon: 'tune', t: 'Escolha seu Perfil', d: 'Selecione suas preferências visuais ou deixe a IA guiar sua configuração.' },
    { n: '03', icon: 'public', t: 'Navegue sem Barreiras', d: 'Aproveite qualquer site da web adaptado automaticamente às suas preferências.' },
  ]

  return (
    <section id="howworks" className="lp-how">
      <div className="lp-how-inner">
        <motion.div 
          className="lp-section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <p className="lp-section-label">Como funciona</p>
          <h2 className="lp-section-title">Três passos para a clareza.</h2>
          <p className="lp-section-sub">O Swim foi construído para atuar de forma invisível: você navega, ele adapta.</p>
        </motion.div>

        <div className="lp-steps-premium">
          {steps.map((step, idx) => (
            <motion.div 
              className="lp-step-premium" 
              key={step.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
            >
              <div className="lp-step-icon-wrapper">
                <div className="lp-step-number">{step.n}</div>
                <span className="material-symbols-outlined">{step.icon}</span>
              </div>
              <h3 className="lp-step-title-premium">{step.t}</h3>
              <p className="lp-step-desc-premium">{step.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
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
      <motion.div 
        className="lp-section-header"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        <p className="lp-section-label">Planos</p>
        <h2 className="lp-section-title">Acesso completo ao Swim.</h2>
        <p className="lp-section-sub">Um plano simples, sem pegadinhas. Cancele quando quiser.</p>
      </motion.div>

      <motion.div 
        className="lp-price-card-premium"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7 }}
      >
        <div className="lp-price-badge-premium">Mais popular</div>
        <h3 className="lp-price-name-premium">Acesso Completo</h3>
        <div className="lp-price-value-premium">
          <span className="lp-price-currency-premium">R$</span>
          <span className="lp-price-amount-premium">9,99</span>
          <span className="lp-price-period-premium">/mês</span>
        </div>
        <ul className="lp-price-perks-premium" role="list">
          {perks.map((perk, idx) => (
            <motion.li 
              key={perk}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <span className="material-symbols-outlined" aria-hidden="true">check_circle</span>
              {perk}
            </motion.li>
          ))}
        </ul>
        <button className="lp-btn-glass-primary lp-price-cta-premium" onClick={() => onNavigate('register')}>
          <span className="material-symbols-outlined">lock_open</span>
          Obter acesso
        </button>
        <p className="lp-price-note-premium">Pagamento mensal · sem fidelidade</p>
      </motion.div>
    </section>
  )
}

function Footer() {
  return (
    <footer id="site-footer" className="lp-footer">
      <div className="lp-footer-inner">
        <div>
          <div className="lp-footer-logo">
            <div className="lp-footer-logo-icon">
              <span className="material-symbols-outlined">accessibility_new</span>
            </div>
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
