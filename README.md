# AccessFlow - Projeto Vite + React

## Início rápido

```bash
npm install
npm run dev      # Vite em http://127.0.0.1:5173 + proxy em http://127.0.0.1:5174
npm run build    # dist/
```

## Arquitetura

O projeto usa React no front-end e um proxy Node simples para a renderização do sandbox.

```text
src/
  App.jsx                       # Layout principal e navegação
  main.jsx                      # Entrada React
  data/
    features.js                 # Recursos da landing page
  lib/
    accessflowBridge.js         # Ponte injetada em páginas renderizadas
    accessflowConfig.js         # Presets e normalização de URLs
  components/
    BeforeAfter.jsx             # Comparativo interativo
    Sidebar.jsx                 # Navegação lateral
  views/
    Landing.jsx                 # Página inicial
    Login.jsx                   # Tela de login
    Sandbox.jsx                 # Controles + iframe de renderização
  styles/
    main.css                    # Tokens, sidebar e layout global
    landing.css                 # Landing page
    views.css                   # Login e sandbox

server/
  dev.js                        # Sobe Vite e proxy juntos
  proxy-server.js               # Busca HTML externo e injeta a ponte AccessFlow
```

## Sandbox

O sandbox aceita:

- URL externa, renderizada por `/api/render?url=...` dentro de um `iframe`.
- HTML colado diretamente no campo, renderizado via `srcDoc`.
- Exemplo local, útil quando a página externa bloqueia scripts ou exige login.

Alguns sites ainda podem falhar parcialmente por autenticação, scripts próprios, CORS de APIs internas ou proteções contra automação. Para um TCC, essa abordagem é demonstrável, profissional e mais próxima de um produto real do que um preview estático.
