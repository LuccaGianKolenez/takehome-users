# CRUD Users
Monorepo com NestJS (API) + Next.js (Web), Postgres, Redis, Prisma, Jest, React Query.

# no root do repo
cp .env.example .env
docker compose up -d postgres redis

# preparar API localmente
cd apps/api
pnpm i
# gera client e aplica migration
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:seed
pnpm start:dev
# API em http://localhost:3001/v1

# preparar WEB
cd ../web
pnpm i
pnpm dev -p 3000
# Web em http://localhost:3000