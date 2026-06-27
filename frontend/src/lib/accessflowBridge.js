export function createAccessflowBridgeScript() {
  return `
    (function () {
      var BASE_FONT_SIZE = 16;

      var style = document.getElementById('accessflow-live-style');
      if (!style) {
        style = document.createElement('style');
        style.id = 'accessflow-live-style';
        document.head.appendChild(style);
      }

      // O iframe é um documento separado e não herda os @font-face do app.
      // Sem isto, 'OpenDyslexic' não existe dentro do iframe e cai no fallback.
      if (!document.getElementById('accessflow-font-face')) {
        var fontStyle = document.createElement('style');
        fontStyle.id = 'accessflow-font-face';
        fontStyle.textContent =
          "@font-face{font-family:'OpenDyslexic';font-style:normal;font-weight:400;font-display:swap;" +
          "src:url('https://cdn.jsdelivr.net/fontsource/fonts/opendyslexic@latest/latin-400-normal.woff2') format('woff2')," +
          "url('https://cdn.jsdelivr.net/fontsource/fonts/opendyslexic@latest/latin-400-normal.woff') format('woff');}" +
          "@font-face{font-family:'OpenDyslexic';font-style:normal;font-weight:700;font-display:swap;" +
          "src:url('https://cdn.jsdelivr.net/fontsource/fonts/opendyslexic@latest/latin-700-normal.woff2') format('woff2')," +
          "url('https://cdn.jsdelivr.net/fontsource/fonts/opendyslexic@latest/latin-700-normal.woff') format('woff');}";
        (document.head || document.documentElement).appendChild(fontStyle);
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
          'html, body { font-family: ' + font + ' !important; letter-spacing: ' + state.letterSpacing + 'px !important; line-height: ' + state.lineHeight + ' !important; }',
          'body, body *:not(svg):not(path) { font-family: ' + font + ' !important; letter-spacing: ' + state.letterSpacing + 'px !important; line-height: ' + state.lineHeight + ' !important; }',
          contrast,
          links,
          focus,
          motion
        ].join('\\n');
      }

      // Escala a fonte proporcionalmente em cada elemento, preservando a
      // hierarquia da página. O tamanho original é guardado uma vez por elemento.
      function applyFontScaling(state) {
        if (!document.body) return;
        var factor = (Number(state.fontSize) || BASE_FONT_SIZE) / BASE_FONT_SIZE;
        var nodes = document.body.getElementsByTagName('*');
        for (var i = 0; i < nodes.length; i++) {
          var el = nodes[i];
          var tag = el.tagName;
          if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'SVG' || tag === 'PATH' || tag === 'BR') continue;
          if (el.id === 'accessflow-ruler') continue;
          var base = el.getAttribute('data-af-fs');
          if (base === null) {
            var computed = parseFloat(window.getComputedStyle(el).fontSize);
            if (!computed) continue;
            base = String(computed);
            el.setAttribute('data-af-fs', base);
          }
          el.style.setProperty('font-size', (parseFloat(base) * factor) + 'px', 'important');
        }
      }

      // Régua de leitura desenhada dentro do próprio iframe (o pai não recebe
      // o mousemove enquanto o cursor está sobre o iframe).
      var ruler = null;
      function ensureRuler() {
        if (ruler) return ruler;
        ruler = document.createElement('div');
        ruler.id = 'accessflow-ruler';
        ruler.style.cssText = 'position:fixed;left:0;right:0;height:38px;margin-top:-19px;background:rgba(153,81,230,0.10);border-top:1px solid rgba(153,81,230,0.40);border-bottom:1px solid rgba(153,81,230,0.40);pointer-events:none;z-index:2147483647;display:none;';
        (document.body || document.documentElement).appendChild(ruler);
        document.addEventListener('mousemove', function (e) {
          if (ruler && ruler.style.display !== 'none') ruler.style.top = e.clientY + 'px';
        });
        return ruler;
      }
      function setRuler(on) {
        var r = ensureRuler();
        r.style.display = on ? 'block' : 'none';
      }

      function applyState(state) {
        style.textContent = cssForState(state);
        applyFontScaling(state);
        setRuler(!!state.readingRuler);
      }

      window.addEventListener('message', function (event) {
        if (!event.data || event.data.type !== 'ACCESSFLOW_APPLY_STATE') return;
        applyState(event.data.state || {});
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
