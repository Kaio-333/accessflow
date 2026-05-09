import http from 'node:http'
import { pathToFileURL } from 'node:url'
import { injectAccessflowBridge } from '../src/lib/accessflowBridge.js'

const DEFAULT_PORT = 5174

export function createProxyServer({ port = DEFAULT_PORT } = {}) {
  const server = http.createServer(async (request, response) => {
    const requestUrl = new URL(request.url || '/', `http://${request.headers.host || '127.0.0.1'}`)

    if (requestUrl.pathname === '/api/health') {
      sendJSON(response, 200, { ok:true, service:'accessflow-proxy' })
      return
    }

    if (requestUrl.pathname !== '/api/render') {
      sendHTML(response, 404, renderMessage('Rota não encontrada', 'Use /api/render?url=https://exemplo.com.'))
      return
    }

    const target = requestUrl.searchParams.get('url')
    let normalizedUrl

    try {
      normalizedUrl = normalizeTargetUrl(target)
    } catch {
      sendHTML(response, 400, renderMessage('URL inválida', 'Informe uma URL HTTP ou HTTPS válida.'))
      return
    }

    try {
      const upstream = await fetch(normalizedUrl, {
        redirect: 'follow',
        headers: {
          'user-agent': 'AccessFlowSandbox/1.0 (+https://accessflow.local)',
          accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.5',
        },
      })

      const contentType = upstream.headers.get('content-type') || ''
      const finalUrl = upstream.url || normalizedUrl

      if (!upstream.ok) {
        sendHTML(response, upstream.status, renderMessage('Não foi possível carregar a página', `O site respondeu com status ${upstream.status}.`))
        return
      }

      if (!contentType.includes('text/html') && !contentType.includes('application/xhtml+xml')) {
        const text = await upstream.text()
        sendHTML(response, 200, renderTextDocument(finalUrl, text.slice(0, 12000)))
        return
      }

      const html = await upstream.text()
      const safeHTML = stripBlockingMeta(html)
      sendHTML(response, 200, injectAccessflowBridge(safeHTML, finalUrl))
    } catch (error) {
      sendHTML(response, 502, renderMessage('Falha no proxy', `Não conseguimos buscar essa página agora. Detalhe: ${error.message}`))
    }
  })

  server.listen(port, '127.0.0.1', () => {
    console.log(`AccessFlow proxy ativo em http://127.0.0.1:${port}`)
  })

  return server
}

function normalizeTargetUrl(value) {
  if (!value) throw new Error('Missing URL')
  const withProtocol = /^[a-z][a-z0-9+.-]*:\/\//i.test(value) ? value : `https://${value}`
  const url = new URL(withProtocol)
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Unsupported protocol')
  return url.href
}

function stripBlockingMeta(html) {
  return html
    .replace(/<meta[^>]+http-equiv=["']?content-security-policy["']?[^>]*>/gi, '')
    .replace(/<meta[^>]+http-equiv=["']?x-frame-options["']?[^>]*>/gi, '')
}

function renderTextDocument(url, text) {
  return injectAccessflowBridge(`
    <main style="font-family: Inter, system-ui, sans-serif; max-width: 860px; margin: 0 auto; padding: 40px 24px;">
      <p style="font-size: 12px; text-transform: uppercase; letter-spacing: .12em; color: #9951e6;">Conteúdo de texto</p>
      <h1 style="font-size: 28px;">${escapeHTML(url)}</h1>
      <pre style="white-space: pre-wrap; line-height: 1.7;">${escapeHTML(text)}</pre>
    </main>
  `, url)
}

function renderMessage(title, message) {
  return injectAccessflowBridge(`
    <main style="font-family: Inter, system-ui, sans-serif; max-width: 720px; margin: 0 auto; padding: 56px 24px; color: #1f1a23;">
      <p style="font-size: 12px; text-transform: uppercase; letter-spacing: .12em; color: #9951e6;">AccessFlow Sandbox</p>
      <h1 style="font-size: 30px; margin-bottom: 12px;">${escapeHTML(title)}</h1>
      <p style="font-size: 16px; line-height: 1.7;">${escapeHTML(message)}</p>
    </main>
  `)
}

function sendHTML(response, status, html) {
  response.writeHead(status, {
    'content-type': 'text/html; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
  })
  response.end(html)
}

function sendJSON(response, status, payload) {
  response.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  })
  response.end(JSON.stringify(payload))
}

function escapeHTML(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  createProxyServer({ port:Number(process.env.PORT || DEFAULT_PORT) })
}
