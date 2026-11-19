FROM node:26.13.1-trixie-slim

WORKDIR /src

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .
CMD ["node", "server.js"]
