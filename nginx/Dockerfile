FROM oven/bun:1.3 AS client-build
WORKDIR /app
COPY client/package.json client/bun.lock ./
RUN bun install --frozen-lockfile
COPY client/ .
RUN VITE_API_URL=/api bun run build

FROM nginx:1.27-alpine
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --chmod=755 nginx/40-reload-certs.sh /docker-entrypoint.d/40-reload-certs.sh
COPY --from=client-build /app/dist /usr/share/nginx/html
