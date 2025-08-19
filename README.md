# Takehome — CRUD Users

Sistema composto por **API (NestJS + Prisma + PostgreSQL + Redis)** e **Web (Next.js)**.  
Objetivo: CRUD de usuários com autenticação e cache.

---

## 🛠️ Requisitos

- [Node.js 20+](https://nodejs.org/)
- [pnpm 10+](https://pnpm.io/) (`corepack enable && corepack prepare pnpm@latest --activate`)
- [PostgreSQL 16+](https://www.postgresql.org/)
- [Redis 7+](https://redis.io/)

---

## 1. Clonar o projeto

```bash
git clone https://github.com/LuccaGianKolenez/takehome-users.git
cd takehome-users
```
---

## 2. Configurar variáveis de ambiente

### 2.1 API (`apps/api/.env`)
```env
PORT=3001
DATABASE_URL=postgresql://SEU_USUARIO@localhost:5432/usersdb?schema=public
REDIS_URL=redis://localhost:6379
```

### 2.2 Web (`apps/web/.env.local`)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
# ou http://localhost:3001/v1 se a API usar prefixo
```

---

## 3. Preparar banco de dados

Criar o banco local:

```bash
createdb usersdb || true
```

Rodar migrations e seeds (dentro da pasta da API):

```bash
cd apps/api
pnpm i
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:seed   # opcional
```

---

## 4. Rodar a API (NestJS)

```bash
cd apps/api
pnpm start:dev
```

Endpoints:
- Health check → [http://localhost:3001/health](http://localhost:3001/health)  
- Users CRUD → [http://localhost:3001/users](http://localhost:3001/users)  

---

## 5. Rodar a Web (Next.js)

```bash
cd apps/web
pnpm i
pnpm dev -p 3000
```

Abrir: [http://localhost:3000](http://localhost:3000)

---

## 6. Testes (API)

```bash
cd apps/api

# unitários
pnpm test

# e2e
pnpm test:e2e
```

---

##  7. Exemplos de requisição

### Criar usuário
```bash
curl -X POST http://localhost:3001/users   -H "Content-Type: application/json"   -d '{"name":"Lucca","email":"lucca@test.dev"}'
```

### Listar usuários
```bash
curl http://localhost:3001/users
```

---

## Troubleshooting

- `redis-cli ping` → deve retornar `PONG`
- `psql -h localhost -U postgres -d usersdb -c '\dt'` → lista tabelas
- Erros de cache? Verificar `REDIS_URL`
- Erros de banco? Revisar `DATABASE_URL`

---

## Estrutura

```
takehome-users/
│── apps/
│   ├── api/   # NestJS + Prisma
│   └── web/   # Next.js
│── db/   
│── .env.example
│── takehome-users.postman_collection.json
│── README.md
```
