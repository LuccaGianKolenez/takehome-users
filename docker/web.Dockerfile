FROM node:20-alpine
WORKDIR /usr/src/app
RUN corepack enable && corepack prepare pnpm@9.7.0 --activate
COPY apps/web/package.json apps/web/pnpm-lock.yaml* ./
RUN pnpm i --frozen-lockfile || pnpm i
COPY apps/web .
RUN pnpm build || true
EXPOSE 3000
CMD ["pnpm","dev","-p","3000"]
