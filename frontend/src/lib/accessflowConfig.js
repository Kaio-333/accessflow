export const DEFAULT_ACCESSFLOW_STATE = {
  preset: 'none',
  fontFamily: 'default',
  fontSize: 16,
  letterSpacing: 0,
  lineHeight: 1.75,
  contrastMode: 'normal',
  focusMode: false,
  highlightLinks: false,
  removeAnimations: false,
  readingRuler: false,
  readingProgress: false,
}

export const ACCESSFLOW_PRESETS = {
  dyslexia: {
    fontFamily: 'opendyslexic',
    fontSize: 18,
    letterSpacing: 3,
    lineHeight: 2,
    contrastMode: 'normal',
    focusMode: false,
    highlightLinks: true,
    removeAnimations: true,
    readingRuler: false,
    readingProgress: false,
  },
  adhd: {
    fontFamily: 'default',
    fontSize: 17,
    letterSpacing: 1,
    lineHeight: 1.9,
    contrastMode: 'high',
    focusMode: true,
    highlightLinks: false,
    removeAnimations: true,
    readingRuler: true,
    readingProgress: true,
  },
  both: {
    fontFamily: 'opendyslexic',
    fontSize: 18,
    letterSpacing: 3,
    lineHeight: 2.1,
    contrastMode: 'high',
    focusMode: true,
    highlightLinks: true,
    removeAnimations: true,
    readingRuler: true,
    readingProgress: true,
  },
}

// Mapeia um perfil salvo (modelo simples do backend: contrast 1-4, font 1-5,
// animations) para o estado de acessibilidade usado no preview do Sandbox.
const PROFILE_FONT_SIZES = { 1: 12, 2: 14, 3: 16, 4: 18, 5: 22 }

export function profileToAccessflowState(profile) {
  const fontSize = PROFILE_FONT_SIZES[profile?.font] ?? DEFAULT_ACCESSFLOW_STATE.fontSize
  const contrastMode = Number(profile?.contrast) >= 3 ? 'high' : 'normal'
  const removeAnimations = !profile?.animations
  return {
    ...DEFAULT_ACCESSFLOW_STATE,
    preset: 'none',
    fontSize,
    contrastMode,
    removeAnimations,
  }
}

// Chave de localStorage usada para passar o perfil ativo da página "Meus Perfis"
// para o preview do Sandbox.
export const ACTIVE_PROFILE_KEY = 'accessflow:activeProfile'

export function readActiveProfile() {
  try {
    const raw = localStorage.getItem(ACTIVE_PROFILE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function normalizePageUrl(value) {
  const trimmed = value.trim()
  const withProtocol = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  const url = new URL(withProtocol)
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Unsupported protocol')
  return url.href
}

export function looksLikeHTML(value) {
  const trimmed = value.trim()
  return /^<!doctype\s+html/i.test(trimmed) || /^<html[\s>]/i.test(trimmed) || /<body[\s>]/i.test(trimmed)
}

export function compactUrl(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return 'conteúdo externo'
  }
}
