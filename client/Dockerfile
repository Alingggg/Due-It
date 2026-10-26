FROM oven/bun:1.3
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# vite dev server with HMR, source is bind-mounted by compose
COPY . .
EXPOSE 5173
CMD ["bun", "run", "dev", "--host"]
