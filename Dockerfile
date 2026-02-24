# Stage 1: Dependencies
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

# Stage 2: Runner
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy necessary files from build stage
COPY --from=build /app/apps/web/public ./apps/web/public
COPY --from=build /app/apps/web/.next/standalone ./
COPY --from=build /app/apps/web/.next/static ./apps/web/.next/static

# Optional: Copy collab server script
COPY --from=build /app/scripts/collab-server.mjs ./scripts/

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Note: Next.js standalone build puts the server at apps/web/server.js
CMD ["node", "apps/web/server.js"]
