FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --include=dev

COPY src ./src
COPY prisma ./prisma
COPY prisma.config.ts ./

RUN DATABASE_URL="postgresql://user:password@localhost:5432/db" npx prisma generate

USER node

EXPOSE 4000

CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]