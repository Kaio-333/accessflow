# AccessFlow

Uma plataforma de acessibilidade para a web — carregue sites externos, aplique recursos de acessibilidade em tempo real e simule o funcionamento de uma extensão de navegador.

---

## Tecnologias

- React + Vite (frontend)
- Node.js + Express + TypeScript (backend)
- PostgreSQL via Docker

---

## Como rodar o projeto

### Pré-requisitos

- Node.js instalado
- Docker instalado

---

### 1. Banco de dados (Docker)

Entre na pasta do backend e suba o banco:

```bash
cd backend
docker compose up -d
```

Isso cria um container PostgreSQL na porta `5432` com o banco `accessflow`.

---

### 2. Configurar o `.env` do backend

Copie o arquivo de exemplo e preencha:

```bash
cp backend/.env.example backend/.env
```

Conteúdo do `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/accessflow"
JWT_SECRET=sua_chave_secreta_aqui
```

> O `DATABASE_URL` já está configurado para o Docker acima. Só mude se usar outro banco.

---

### 3. Rodar o backend

```bash
cd backend
npm install
npm run dev
```

O backend sobe em `http://localhost:8000`.

**Atenção — CORS:** o backend só aceita requisições de `http://localhost:5173` (endereço padrão do Vite). Se o frontend rodar em outra porta, ajuste a linha abaixo em `backend/src/server.ts`:

```ts
app.use(cors({ origin: "http://localhost:5173" }))
```

---

### 4. Configurar o `.env` do frontend

Na raiz do projeto, copie o exemplo:

```bash
cp .env.example frontend/.env
```

Conteúdo do `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=AccessFlow
VITE_ENV=development
```

---

### 5. Rodar o frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend sobe em `http://localhost:5173`.

---

## Resumo dos endereços

| Serviço    | Endereço                    |
|------------|-----------------------------|
| Frontend   | http://localhost:5173        |
| Backend    | http://localhost:8000        |
| PostgreSQL | localhost:5432               |
