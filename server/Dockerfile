FROM oven/bun:1.4
WORKDIR /app
ENV NODE_ENV=production

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

COPY . .

USER bun
EXPOSE 3000
CMD ["bun", "src/index.ts"]
