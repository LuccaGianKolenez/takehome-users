# CRUD Users — Monorepo (NestJS + Next.js)  
API (NestJS + Prisma + Postgres + Redis) e Web (Next.js + React Query + RHF + Zod)

## Requisitos
- **Node.js 20+** (recomendo via `nvm`)
- **pnpm 10+** (`corepack enable && corepack prepare pnpm@latest --activate`)
- **PostgreSQL 16+**
- **Redis 7+`

> macOS (Homebrew):
> ```bash
> brew install postgresql@16 redis
> brew services start postgresql@16
> brew services start redis
> ```

---

## 1) Clonar & instalar dependências
```bash
git clone https://github.com/LuccaGianKolenez/takehome-users.git
cd takehome-users

# instala dependências de todos os apps do monorepo
pnpm i
```

---

## 2) Configurar variáveis de ambiente

### 2.1 API (`apps/api/.env`)
Crie o arquivo e cole:
```env
# Porta da API
PORT=3001

# Banco local
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/usersdb?schema=public

# Redis local
REDIS_URL=redis://localhost:6379
```

> Se seu Postgres local não usa senha/usuário `postgres:postgres`, ajuste a `DATABASE_URL`.

### 2.2 Web (`apps/web/.env.local`)
Crie o arquivo e cole **uma** das opções (conforme seu prefixo):

**Se a API usa prefixo `/v1`** (recomendado):
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/v1
```

**Se a API NÃO usa prefixo**:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

---

## 3) Preparar Banco de Dados (Postgres)

Crie o banco **uma vez**:
```bash
createdb usersdb || true
```

> Se preferir via `psql`:
> ```sql
> CREATE DATABASE usersdb;
> ```

---

## 4) Subir a **API** (NestJS)

```bash
cd apps/api

# Gera o client do Prisma e aplica migrations
pnpm prisma:generate
pnpm prisma:migrate

# (opcional) Popular o banco com dados de exemplo
pnpm prisma:seed

# Rodar em dev
pnpm start:dev
```

A API estará em:
- **Health**: `http://localhost:3001/health` (ou `http://localhost:3001/v1/health` se usa prefixo)
- **Users**: `http://localhost:3001/users` (ou `.../v1/users`)

### Testes
```bash
# unitários
pnpm test

# end-to-end
pnpm test:e2e
```

---

## 5) Subir a **Web** (Next.js)

```bash
cd ../web
pnpm dev -p 3000
```

Acesse **http://localhost:3000**.

- Tela única com **tabela de usuários**  
- Botões: **Adicionar**, **Editar** (pré-preenchido), **Excluir**  
- Integra com a API via `NEXT_PUBLIC_API_BASE_URL`

---

## 6) Rotas principais (API)

- `GET    /health`
- `POST   /users` — body `{ "name": string, "email": string }`
- `GET    /users`
- `GET    /users/:id`
- `PUT    /users/:id` — body `{ "name": string, "email": string }`
- `DELETE /users/:id`

### cURL rápido
```bash
# criar
curl -X POST http://localhost:3001/users   -H "Content-Type: application/json"   -d '{"name":"Lucca","email":"lucca@test.dev"}'

# listar
curl http://localhost:3001/users
```

---

## 7) Dicas & Troubleshooting

**Postgres:**
- `psql -h localhost -U postgres -d usersdb -c '\dt'` → vê tabelas
- `P1001 Can't reach database` → ver se o Postgres está rodando e a `DATABASE_URL` confere

**Redis:**
- `redis-cli ping` → deve retornar `PONG`

**Prefixo `/v1`:**
- 404 em `/v1/users`?  
  Ou **habilite** `app.setGlobalPrefix('v1')` na API, ou **remova** `/v1` do `NEXT_PUBLIC_API_BASE_URL`.

**Portas ocupadas:**
```bash
lsof -i :3001
kill -9 <PID>
```

**E2E travado por handles abertos:**
- Chame `await app.close()` e `await prisma.$disconnect()` no `afterAll`.

---

## 8) Scripts úteis

### API (`apps/api/package.json`)
- `pnpm start:dev` — iniciar em dev
- `pnpm prisma:generate` — gerar client
- `pnpm prisma:migrate` — `prisma migrate dev`
- `pnpm prisma:seed` — rodar seed
- `pnpm test` — unitários
- `pnpm test:e2e` — end-to-end

### Web (`apps/web/package.json`)
- `pnpm dev` — Next.js em dev

---

## 9) Reset geral (zerar banco local)
```bash
# Apaga e recria o DB (cuidado!)
dropdb usersdb && createdb usersdb

cd apps/api
pnpm prisma:migrate
pnpm prisma:seed
```
