export function createAccessflowBridgeScript() {
  return `
    (function () {
      var style = document.getElementById('accessflow-live-style');
      if (!style) {
        style = document.createElement('style');
        style.id = 'accessflow-live-style';
        document.head.appendChild(style);
      }

      function cssForState(state) {
        var fonts = {
          default: "'Inter', system-ui, sans-serif",
          opendyslexic: "'OpenDyslexic', system-ui, sans-serif",
          system: "system-ui, sans-serif"
        };
        var font = fonts[state.fontFamily] || fonts.default;
        var contrast = '';
        if (state.contrastMode === 'high') {
          contrast = 'html, body { background: #000 !important; color: #fff !important; } body *:not(svg):not(path) { color: #fff !important; background-color: transparent !important; }';
        }
        if (state.contrastMode === 'dark') {
          contrast = 'html, body { background: #16111b !important; color: #eadfed !important; } body *:not(svg):not(path) { color: inherit !important; }';
        }

        var links = state.highlightLinks ? 'a, button, [role="button"] { color: #9951e6 !important; text-decoration: underline !important; text-underline-offset: 3px !important; }' : '';
        var focus = state.focusMode ? 'p:not(:hover), li:not(:hover), article:not(:hover), section:not(:hover) { opacity: .56 !important; }' : '';
        var motion = state.removeAnimations ? '*, *::before, *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }' : '';

        return [
          'html, body { font-family: ' + font + ' !important; font-size: ' + state.fontSize + 'px !important; letter-spacing: ' + state.letterSpacing + 'px !important; line-height: ' + state.lineHeight + ' !important; }',
          'body, body *:not(svg):not(path) { font-family: ' + font + ' !important; letter-spacing: ' + state.letterSpacing + 'px !important; line-height: ' + state.lineHeight + ' !important; }',
          contrast,
          links,
          focus,
          motion
        ].join('\\n');
      }

      window.addEventListener('message', function (event) {
        if (!event.data || event.data.type !== 'ACCESSFLOW_APPLY_STATE') return;
        style.textContent = cssForState(event.data.state || {});
      });

      window.parent.postMessage({ type: 'ACCESSFLOW_FRAME_READY' }, '*');
    })();
  `
}

export function injectAccessflowBridge(html, baseUrl = '') {
  const baseTag = baseUrl ? `<base href="${escapeAttribute(baseUrl)}">` : ''
  const payload = `${baseTag}<script>${createAccessflowBridgeScript()}</script>`

  if (/<head[\s>]/i.test(html)) {
    return html.replace(/<head([^>]*)>/i, `<head$1>${payload}`)
  }

  return `<!doctype html><html lang="pt-BR"><head>${payload}</head><body>${html}</body></html>`
}

function escapeAttribute(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}
