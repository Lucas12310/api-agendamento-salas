FROM node:20-alpine3.18

WORKDIR /node-app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ARG PORT=3000
ENV PORT=${PORT}
EXPOSE ${PORT}

# Primeiro instala as dependências
COPY package.json package-lock.json ./
RUN npm ci

# Depois copia o projeto (Isto torna mais rápido o build devido ao cache)
COPY . .

RUN npx prisma generate

# Ponto de partida
ENTRYPOINT npm start
