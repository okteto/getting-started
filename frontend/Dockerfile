FROM node:26.13.1-trixie-slim AS dev

WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.30.7-alpine AS prod

COPY --from=dev /usr/src/app/dist /usr/share/nginx/html
EXPOSE 80
