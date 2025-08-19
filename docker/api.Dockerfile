FROM node:20-alpine
WORKDIR /usr/src/app
RUN corepack enable && corepack prepare pnpm@9.7.0 --activate
COPY apps/api/package.json apps/api/pnpm-lock.yaml* ./
RUN pnpm i --frozen-lockfile || pnpm i
COPY apps/api .
RUN pnpm build || true
EXPOSE 3001
CMD ["pnpm","start:dev"]
